import {
  DIMENSION_IDS,
  type DimensionId,
  type Profile,
  neutralProfile,
} from "./dimensions";
import { QUIZ, type QuizAnswers } from "./quiz";
import { TRADES, type Trade } from "./trades";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

/** A stated dealbreaker, collected from the answers that declare one. */
export type Limit = { min?: number; max?: number };
export type Limits = Partial<Record<DimensionId, Limit>>;

/**
 * How far past a stated limit a trade has to sit before it is ruled out rather
 * than merely penalized.
 */
const EXCLUSION_MARGIN = 40;

/**
 * Exclusion additionally requires the trade to be *defined* by the axis, which
 * is what a weight of 1.5+ already means. Distance alone over-excludes: a hard
 * "no" on heights caps exposure at 15, and without this gate that would rule
 * out electricians and plumbers — trades with ladders and crawlspaces, not
 * trades built around height. Ironworker and lineworker still go.
 */
const EXCLUSION_MIN_WEIGHT = 1.5;

/** Collect the caps declared by the chosen answers. */
export function limitsFromAnswers(answers: QuizAnswers): Limits {
  const limits: Limits = {};
  for (const question of QUIZ) {
    const option = question.options.find((o) => o.id === answers[question.id]);
    if (!option?.limits) continue;
    for (const [dim, limit] of Object.entries(option.limits)) {
      const id = dim as DimensionId;
      const existing = limits[id] ?? {};
      // Keep the tightest limit if two answers constrain the same axis.
      limits[id] = {
        min: Math.max(existing.min ?? -Infinity, limit.min ?? -Infinity) || undefined,
        max: Math.min(existing.max ?? Infinity, limit.max ?? Infinity),
      };
      if (!Number.isFinite(limits[id]!.min!)) delete limits[id]!.min;
      if (!Number.isFinite(limits[id]!.max!)) delete limits[id]!.max;
    }
  }
  return limits;
}

/**
 * Fold a set of answers into a point in trait space. Every answer's effects are
 * summed against a neutral 50 and then clamped, so unanswered questions simply
 * leave their axes closer to the middle rather than skewing the result.
 *
 * Declared limits are applied *after* the sum, so a stated dealbreaker can't be
 * cancelled out by unrelated answers that happen to push the same axis back.
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
  const limits = limitsFromAnswers(answers);
  for (const id of DIMENSION_IDS) {
    let value = clamp(profile[id]);
    const limit = limits[id];
    if (limit?.max !== undefined) value = Math.min(value, limit.max);
    if (limit?.min !== undefined) value = Math.max(value, limit.min);
    profile[id] = value;
  }
  return profile;
}

/**
 * Whether a trade sits so far past a stated dealbreaker that it should be ruled
 * out rather than ranked. Returns the offending axis, for the "ruled out" copy.
 */
export function vetoedBy(trade: Trade, limits: Limits): DimensionId | null {
  for (const id of DIMENSION_IDS) {
    const limit = limits[id];
    if (!limit) continue;
    if ((trade.weights?.[id] ?? 1) < EXCLUSION_MIN_WEIGHT) continue;
    const value = trade.profile[id];
    if (limit.max !== undefined && value - limit.max >= EXCLUSION_MARGIN) return id;
    if (limit.min !== undefined && limit.min - value >= EXCLUSION_MARGIN) return id;
  }
  return null;
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

export type Ranking = {
  /** Trades still in the running, best first. */
  matches: Match[];
  /** Trades removed outright by a stated dealbreaker, with the axis that did it. */
  ruledOut: { trade: Trade; dimension: DimensionId }[];
};

/**
 * Rank every trade, removing the ones a stated dealbreaker rules out.
 *
 * If the dealbreakers would leave almost nothing to choose from, the exclusions
 * are reported but not applied — an empty results page helps nobody, and at
 * that point the honest thing is to show the ranking and name the tension.
 */
export function rankTrades(profile: Profile, limits: Limits = {}): Ranking {
  const ruledOut: { trade: Trade; dimension: DimensionId }[] = [];
  const survivors: Trade[] = [];

  for (const trade of TRADES) {
    const dimension = vetoedBy(trade, limits);
    if (dimension) ruledOut.push({ trade, dimension });
    else survivors.push(trade);
  }

  const pool = survivors.length >= MIN_POOL ? survivors : TRADES;
  const matches = pool
    .map((trade) => scoreTrade(profile, trade))
    .sort((a, b) => b.score - a.score || a.trade.name.localeCompare(b.trade.name));

  return { matches, ruledOut };
}

/** Below this many survivors, exclusions are reported rather than enforced. */
const MIN_POOL = 8;

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
