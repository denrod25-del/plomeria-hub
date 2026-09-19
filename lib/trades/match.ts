import {
  DIMENSION_IDS,
  type DimensionId,
  type Profile,
  neutralProfile,
} from "./dimensions";
import { QUIZ, type QuizAnswers } from "./quiz";
import { TRADES, type Trade } from "./trades";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

/**
 * Fold a set of answers into a point in trait space. Every answer's effects are
 * summed against a neutral 50 and then clamped, so unanswered questions simply
 * leave their axes closer to the middle rather than skewing the result.
 */
export function profileFromAnswers(answers: QuizAnswers): Profile {
  const profile = neutralProfile();
  for (const question of QUIZ) {
    const choiceId = answers[question.id];
    if (!choiceId) continue;
    const option = question.options.find((o) => o.id === choiceId);
    if (!option) continue;
    for (const [dim, delta] of Object.entries(option.effects)) {
      profile[dim as DimensionId] += delta as number;
    }
  }
  for (const id of DIMENSION_IDS) profile[id] = clamp(profile[id]);
  return profile;
}

export type MatchReason = {
  dimension: DimensionId;
  /** How strongly this axis pulled the trade up (positive) or down (negative). */
  contribution: number;
};

export type Match = {
  trade: Trade;
  /** 0–100, where 100 is an exact fit on every weighted axis. */
  score: number;
  /** Axes where this trade fits you best, strongest first. */
  strengths: MatchReason[];
  /** Axes where it fits worst — the honest caveats. */
  frictions: MatchReason[];
};

/**
 * Weighted L1 distance in trait space, normalized to a 0–100 fit score.
 *
 * L1 rather than Euclidean on purpose: one badly mismatched axis (say, a person
 * who won't work at height matched against ironworker) should cost roughly what
 * it costs, not get softened by squaring against seven other axes that agree.
 */
export function scoreTrade(profile: Profile, trade: Trade): Match {
  let weightedError = 0;
  let totalWeight = 0;
  const perAxis: MatchReason[] = [];

  for (const id of DIMENSION_IDS) {
    const weight = trade.weights?.[id] ?? 1;
    const gap = Math.abs(profile[id] - trade.profile[id]);
    weightedError += weight * gap;
    totalWeight += weight;
    // Centered so agreement reads positive and mismatch reads negative.
    perAxis.push({ dimension: id, contribution: weight * (50 - gap) });
  }

  const score = Math.round(100 - (weightedError / (totalWeight * 100)) * 100);
  const sorted = [...perAxis].sort((a, b) => b.contribution - a.contribution);

  return {
    trade,
    score: clamp(score),
    strengths: sorted.filter((r) => r.contribution > 0).slice(0, 3),
    frictions: sorted.filter((r) => r.contribution < 0).reverse().slice(0, 2),
  };
}

export function rankTrades(profile: Profile, limit = TRADES.length): Match[] {
  return TRADES.map((trade) => scoreTrade(profile, trade))
    .sort((a, b) => b.score - a.score || a.trade.name.localeCompare(b.trade.name))
    .slice(0, limit);
}

/**
 * Answers are round-tripped through the URL so a results page can be shared,
 * bookmarked, or reopened later without any account or stored state.
 * Format: `questionId.optionId` pairs joined by `~`.
 */
export function encodeAnswers(answers: QuizAnswers): string {
  return QUIZ.filter((q) => answers[q.id])
    .map((q) => `${q.id}.${answers[q.id]}`)
    .join("~");
}

export function decodeAnswers(encoded: string | undefined | null): QuizAnswers {
  if (!encoded) return {};
  const answers: QuizAnswers = {};
  for (const pair of encoded.split("~")) {
    const [questionId, optionId] = pair.split(".");
    const question = QUIZ.find((q) => q.id === questionId);
    if (!question) continue;
    if (!question.options.some((o) => o.id === optionId)) continue;
    answers[questionId] = optionId;
  }
  return answers;
}

/** US ZIP, 5 digits. Anything else is dropped rather than echoed back. */
export function normalizeZip(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const match = /^\s*(\d{5})(?:-\d{4})?\s*$/.exec(raw);
  return match ? match[1] : null;
}
