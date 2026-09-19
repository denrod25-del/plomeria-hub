"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  QUIZ,
  encodeAnswers,
  normalizeZip,
  type QuizAnswers,
} from "@/lib/trades";

/** Questions, then one ZIP step at the end. */
const ZIP_STEP = QUIZ.length;
const TOTAL_STEPS = QUIZ.length + 1;

/**
 * Answers are held in sessionStorage so that coming back from the results page
 * — via the browser's back button or a bookmark — doesn't mean redoing twelve
 * questions. Per-tab and cleared on close, so it stays as account-free as the
 * rest of the flow. Every access is guarded: private mode and blocked site data
 * both make these throw, and the quiz has to work anyway.
 */
const STORAGE_KEY = "rung.quiz.v1";

type SavedState = { step: number; answers: QuizAnswers; zip: string };

function loadSaved(): SavedState | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedState>;
    if (!parsed || typeof parsed !== "object" || !parsed.answers) return null;
    // Drop anything that isn't a question/option we still ship.
    const answers: QuizAnswers = {};
    for (const q of QUIZ) {
      const choice = parsed.answers[q.id];
      if (choice && q.options.some((o) => o.id === choice)) answers[q.id] = choice;
    }
    const step =
      typeof parsed.step === "number" && parsed.step >= 0 && parsed.step <= ZIP_STEP
        ? parsed.step
        : 0;
    return { step, answers, zip: typeof parsed.zip === "string" ? parsed.zip : "" };
  } catch {
    return null;
  }
}

function saveState(state: SavedState) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* Storage unavailable — the quiz still works, it just won't resume. */
  }
}

export function QuizFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [zip, setZip] = useState("");
  const [zipError, setZipError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

  // Restore after mount rather than in useState, so the server-rendered first
  // question and the client's first paint agree.
  useEffect(() => {
    const saved = loadSaved();
    if (saved && Object.keys(saved.answers).length > 0) {
      setStep(saved.step);
      setAnswers(saved.answers);
      setZip(saved.zip);
      setRestored(true);
    }
  }, []);

  useEffect(() => {
    if (step === 0 && Object.keys(answers).length === 0) return;
    saveState({ step, answers, zip });
  }, [step, answers, zip]);

  const question = step < ZIP_STEP ? QUIZ[step] : null;
  const answered = question ? answers[question.id] : undefined;
  const progress = Math.round(((step + 1) / TOTAL_STEPS) * 100);

  const goBack = useCallback(() => {
    setZipError(null);
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const choose = useCallback(
    (questionId: string, optionId: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
      // Small pause so the selection is visible before the step changes.
      window.setTimeout(() => setStep((s) => Math.min(ZIP_STEP, s + 1)), 180);
    },
    []
  );

  const submit = useCallback(
    (withZip: boolean) => {
      const params = new URLSearchParams({ a: encodeAnswers(answers) });
      if (withZip) {
        const clean = normalizeZip(zip);
        if (!clean) {
          setZipError("Enter a five-digit US ZIP code, or skip this step.");
          return;
        }
        params.set("zip", clean);
      }
      router.push(`/trades/results?${params.toString()}`);
    },
    [answers, zip, router]
  );

  const unanswered = useMemo(
    () => QUIZ.filter((q) => !answers[q.id]).length,
    [answers]
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      {/* Progress */}
      <div className="mb-10">
        <div className="mb-2.5 flex items-baseline justify-between text-sm">
          <span className="font-semibold text-zinc-900">
            {step < ZIP_STEP ? `Question ${step + 1} of ${QUIZ.length}` : "Last step"}
          </span>
          <span className="tabular-nums text-zinc-500">{progress}%</span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-zinc-200"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-label="Quiz progress"
        >
          <div
            className="h-full rounded-full bg-amber-400 transition-all duration-300"
            style={{ width: `${Math.max(progress, 4)}%` }}
          />
        </div>
      </div>

      {restored && (
        <p className="mb-7 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Picked up where you left off.
          <button
            type="button"
            onClick={() => {
              try {
                window.sessionStorage.removeItem(STORAGE_KEY);
              } catch {
                /* nothing to clear */
              }
              setAnswers({});
              setZip("");
              setStep(0);
              setRestored(false);
            }}
            className="font-semibold underline underline-offset-2"
          >
            Start over
          </button>
        </p>
      )}

      {question ? (
        <fieldset key={question.id} className="step-in">
          <legend className="text-2xl font-bold leading-tight tracking-tight text-zinc-950 sm:text-3xl">
            {question.prompt}
          </legend>
          {question.helper && (
            <p className="mt-3 text-[15px] leading-relaxed text-zinc-500">
              {question.helper}
            </p>
          )}

          <div className="mt-7 space-y-3">
            {question.options.map((option) => {
              const selected = answered === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => choose(question.id, option.id)}
                  className={`flex w-full items-start gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                    selected
                      ? "border-amber-500 bg-amber-50"
                      : "border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      selected ? "border-amber-500 bg-amber-500" : "border-zinc-300"
                    }`}
                    aria-hidden="true"
                  >
                    {selected && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12l6 6L20 6" />
                      </svg>
                    )}
                  </span>
                  <span>
                    <span className="block font-semibold text-zinc-950">
                      {option.label}
                    </span>
                    {option.detail && (
                      <span className="mt-1 block text-sm leading-relaxed text-zinc-600">
                        {option.detail}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : (
        <div className="step-in">
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-zinc-950 sm:text-3xl">
            Where should we look for apprenticeships?
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-zinc-600">
            A ZIP code lets the results point at programs, union halls, and
            schools near you. It's optional, it isn't stored, and you'll still
            get your full match list without it.
          </p>

          <form
            className="mt-7"
            onSubmit={(e) => {
              e.preventDefault();
              submit(true);
            }}
          >
            <label htmlFor="zip" className="block text-sm font-semibold text-zinc-900">
              ZIP code
            </label>
            <input
              id="zip"
              name="zip"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="33101"
              maxLength={10}
              value={zip}
              onChange={(e) => {
                setZip(e.target.value);
                setZipError(null);
              }}
              aria-invalid={Boolean(zipError)}
              aria-describedby={zipError ? "zip-error" : undefined}
              className={`mt-2 w-full max-w-[12rem] rounded-xl border-2 px-4 py-3 text-lg tabular-nums outline-none transition-colors ${
                zipError
                  ? "border-red-400 focus:border-red-500"
                  : "border-zinc-200 focus:border-zinc-900"
              }`}
            />
            {zipError && (
              <p id="zip-error" role="alert" className="mt-2 text-sm font-medium text-red-600">
                {zipError}
              </p>
            )}

            {unanswered > 0 && (
              <p className="mt-5 rounded-lg bg-zinc-100 px-4 py-3 text-sm text-zinc-600">
                You skipped {unanswered} question{unanswered === 1 ? "" : "s"}.
                Those axes stay neutral, which widens your matches — go back if
                you'd rather answer them.
              </p>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="rounded-full bg-zinc-900 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-zinc-700"
              >
                See my matches
              </button>
              <button
                type="button"
                onClick={() => submit(false)}
                className="rounded-full border border-zinc-300 px-7 py-3.5 text-base font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                Skip and show matches
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Footer controls */}
      <div className="mt-10 flex items-center justify-between border-t border-zinc-200 pt-5">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span aria-hidden="true">←</span> Back
        </button>

        {question && (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(ZIP_STEP, s + 1))}
            className="text-sm font-medium text-zinc-500 underline underline-offset-4 transition-colors hover:text-zinc-900"
          >
            Skip this question
          </button>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-zinc-400">
        No account, no email.{" "}
        <Link href="/trades" className="underline underline-offset-2 hover:text-zinc-600">
          Back to home
        </Link>
      </p>
    </div>
  );
}
