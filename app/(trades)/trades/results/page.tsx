import type { Metadata } from "next";
import Link from "next/link";
import {
  DIMENSIONS,
  PAY_DISCLAIMER,
  decodeAnswers,
  describeScore,
  getDimension,
  normalizeZip,
  profileFromAnswers,
  limitsFromAnswers,
  rankTrades,
  QUIZ,
} from "@/lib/trades";
import { TradeCard, categoryLabel } from "@/components/trades/TradeCard";
import { ProfileBars } from "@/components/trades/ProfileBars";
import { LocalResources } from "@/components/trades/LocalResources";
import { Ladder } from "@/components/trades/Ladder";
import { ShareResults } from "@/components/trades/ShareResults";

export const metadata: Metadata = {
  title: "Your matches",
  description: "Your working-style profile, your top trade matches, and where to start.",
  robots: { index: false },
};

type SearchParams = { a?: string; zip?: string };

export default function ResultsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const answers = decodeAnswers(searchParams.a);
  const answeredCount = Object.keys(answers).length;

  if (answeredCount === 0) {
    return <NoAnswers />;
  }

  const zip = normalizeZip(searchParams.zip);
  const profile = profileFromAnswers(answers);
  const limits = limitsFromAnswers(answers);
  const { matches: ranked, ruledOut } = rankTrades(profile, limits);
  const [top, ...rest] = ranked;
  const runnersUp = rest.slice(0, 4);
  const alsoRan = rest.slice(4, 10);
  const worst = ranked[ranked.length - 1];

  return (
    <>
      {/* ---------- Headline match ---------- */}
      <section className="border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Your strongest match
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
            <h1 className="text-4xl font-bold leading-none tracking-tight sm:text-6xl">
              {top.trade.name}
            </h1>
            <span className="rounded-full bg-amber-400 px-4 py-1.5 text-sm font-bold tabular-nums text-zinc-950">
              {top.score}% fit
            </span>
          </div>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
            {top.trade.summary}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/trades/catalog/${top.trade.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-base font-bold text-zinc-950 transition-colors hover:bg-amber-300"
            >
              Full {top.trade.name.toLowerCase()} breakdown
              <span aria-hidden="true">→</span>
            </Link>
            <ShareResults />
          </div>

          {answeredCount < QUIZ.length && (
            <p className="mt-6 text-sm text-zinc-400">
              You answered {answeredCount} of {QUIZ.length} questions. The
              unanswered axes were treated as neutral —{" "}
              <Link href="/trades/quiz?restart=1" className="underline underline-offset-2 hover:text-white">
                retake the quiz
              </Link>{" "}
              for a sharper result.
            </p>
          )}
        </div>
      </section>

      {/* ---------- Why / why not ---------- */}
      <section className="border-b border-zinc-200 py-14 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 sm:px-8 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
              Why it fits
            </h2>
            <ul className="mt-4 space-y-3">
              {top.strengths.map((s) => {
                const dim = getDimension(s.dimension);
                return (
                  <li key={s.dimension} className="flex gap-3 text-[15px] leading-relaxed text-zinc-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold text-zinc-950">{dim.label}:</strong>{" "}
                      you want {describeScore(s.dimension, profile[s.dimension]).toLowerCase()},
                      and that's what this trade is.
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-700">
              What you'd have to accept
            </h2>
            {top.frictions.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {top.frictions.map((f) => {
                  const dim = getDimension(f.dimension);
                  return (
                    <li key={f.dimension} className="flex gap-3 text-[15px] leading-relaxed text-zinc-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                      <span>
                        <strong className="font-semibold text-zinc-950">{dim.label}:</strong>{" "}
                        the job runs toward{" "}
                        {describeScore(f.dimension, top.trade.profile[f.dimension]).toLowerCase()},
                        which isn't where you landed. Worth seeing in person before you commit.
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-4 text-[15px] leading-relaxed text-zinc-600">
                Nothing significant — this trade lines up with you on every axis
                we measure. That's rare, and worth acting on.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Ten-year arc ---------- */}
      <section className="border-b border-zinc-200 bg-zinc-50 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            Your ten-year arc as {article(top.trade.name)} {top.trade.name.toLowerCase()}
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
            {top.trade.entry}. {top.trade.credential}.
          </p>
          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-7 sm:p-9">
            <Ladder stages={top.trade.ladder} />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-zinc-500">{PAY_DISCLAIMER}</p>
        </div>
      </section>

      {/* ---------- Working-style profile ---------- */}
      <section className="border-b border-zinc-200 py-14 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
              Your working-style profile
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-zinc-600">
              Eight axes, built from your answers. The diamond shows where{" "}
              {top.trade.name} sits on each one — the closer the two markers, the
              better the fit.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-zinc-600">
              This profile is worth more than the ranking. Take it to a career
              center, an apprenticeship coordinator, or someone already in the
              trade, and ask them which jobs match it.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-7 sm:p-8">
            <ProfileBars
              profile={profile}
              compare={top.trade.profile}
              compareLabel={top.trade.name}
            />
          </div>
        </div>
      </section>

      {/* ---------- Runners-up ---------- */}
      <section className="border-b border-zinc-200 bg-zinc-50 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            The rest of your shortlist
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
            Scores this close are within the noise of a twelve-question quiz.
            Research all five before you decide — and weight what's actually
            hiring where you live.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {runnersUp.map((m) => (
              <TradeCard key={m.trade.slug} trade={m.trade} score={m.score} />
            ))}
          </div>

          <details className="group mt-8">
            <summary className="cursor-pointer list-none text-base font-semibold text-zinc-900 underline decoration-amber-400 decoration-2 underline-offset-4">
              Show the next six <span className="group-open:hidden">▾</span>
              <span className="hidden group-open:inline">▴</span>
            </summary>
            <ul className="mt-5 divide-y divide-zinc-200 border-y border-zinc-200">
              {alsoRan.map((m, i) => (
                <li key={m.trade.slug}>
                  <Link
                    href={`/trades/catalog/${m.trade.slug}`}
                    className="flex items-center justify-between gap-4 py-3.5 transition-colors hover:text-amber-700"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="w-6 font-mono text-xs tabular-nums text-zinc-400">
                        {i + 6}
                      </span>
                      <span className="font-semibold text-zinc-900">{m.trade.name}</span>
                      <span className="hidden text-sm text-zinc-500 sm:inline">
                        {categoryLabel(m.trade.category)}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-bold tabular-nums text-zinc-500">
                      {m.score}%
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>

          <p className="mt-6 text-sm text-zinc-500">
            Furthest from your profile: <strong className="font-semibold text-zinc-700">{worst.trade.name}</strong>{" "}
            at {worst.score}%. Knowing what to rule out is worth something too.
          </p>

          {ruledOut.length > 0 && (
            <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
              <h3 className="text-base font-bold text-zinc-950">
                Ruled out by your dealbreakers
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                You named {ruledOutAxes(ruledOut)} as something you wouldn't
                accept, so {ruledOut.length} trade
                {ruledOut.length === 1 ? "" : "s"} came off the list entirely
                rather than being ranked low:{" "}
                <span className="text-zinc-700">
                  {ruledOut.map((r) => r.trade.name).join(", ")}
                </span>
                .
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                If one of those appeals to you anyway, retake the quiz and
                soften that answer — several of them are among the best-paid
                trades on the list.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ---------- Local resources ---------- */}
      <section className="border-b border-zinc-200 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <LocalResources trade={top.trade} zip={zip} />
        </div>
      </section>

      {/* ---------- Footer CTA ---------- */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <p className="text-[15px] text-zinc-600">
            Answers are encoded in this page's URL, not stored on a server —
            bookmark it or send it to yourself if you want it later.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/trades/quiz?restart=1"
              className="rounded-full border border-zinc-300 px-6 py-3 text-base font-semibold text-zinc-800 transition-colors hover:bg-zinc-100"
            >
              Retake the quiz
            </Link>
            <Link
              href="/trades/catalog"
              className="rounded-full bg-zinc-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-zinc-700"
            >
              Browse all 30 trades
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function NoAnswers() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
        No answers in this link
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-zinc-600">
        Results live entirely in the URL, so a truncated or edited link has
        nothing to score. It only takes ten minutes to redo.
      </p>
      <Link
        href="/trades/quiz"
        className="mt-8 inline-flex rounded-full bg-zinc-900 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-zinc-700"
      >
        Take the quiz
      </Link>
      <p className="mt-10 text-sm text-zinc-500">
        The eight axes we score:{" "}
        {DIMENSIONS.map((d) => d.label.toLowerCase()).join(", ")}.
      </p>
    </div>
  );
}

/** Human-readable list of the axes that excluded trades, for the copy above. */
function ruledOutAxes(
  ruledOut: { dimension: Parameters<typeof getDimension>[0] }[]
): string {
  const labels = Array.from(
    new Set(ruledOut.map((r) => getDimension(r.dimension).label.toLowerCase()))
  );
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

function article(name: string): string {
  return /^[AEIOU]/i.test(name) ? "an" : "a";
}
