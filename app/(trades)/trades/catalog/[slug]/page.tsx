import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DIMENSIONS,
  PAY_DISCLAIMER,
  TRADES,
  describeScore,
  getTrade,
} from "@/lib/trades";
import { Ladder } from "@/components/trades/Ladder";
import { TradeCard, categoryLabel } from "@/components/trades/TradeCard";

export function generateStaticParams() {
  return TRADES.map((trade) => ({ slug: trade.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const trade = getTrade(params.slug);
  if (!trade) return { title: "Trade not found" };
  return {
    title: trade.name,
    description: `${trade.tagline} What the work is, what it pays at each rung, and how to get in.`,
  };
}

export default function TradeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const trade = getTrade(params.slug);
  if (!trade) notFound();

  const related = trade.related
    .map(getTrade)
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  // The axes this trade is most opinionated about — the ones worth being
  // honest with yourself about before applying.
  const defining = [...DIMENSIONS]
    .map((dim) => ({ dim, weight: trade.weights?.[dim.id] ?? 1 }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 4);

  return (
    <>
      <section className="border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
          <nav className="text-sm text-zinc-400" aria-label="Breadcrumb">
            <Link href="/trades/catalog" className="hover:text-white">
              All trades
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-zinc-300">{categoryLabel(trade.category)}</span>
          </nav>

          <h1 className="mt-5 text-4xl font-bold leading-none tracking-tight sm:text-5xl">
            {trade.name}
          </h1>
          <p className="mt-4 text-xl text-amber-300">{trade.tagline}</p>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-300">
            {trade.summary}
          </p>

          <dl className="mt-10 grid gap-x-10 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                How you get in
              </dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-zinc-200">
                {trade.entry}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                What you end up holding
              </dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-zinc-200">
                {trade.credential}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-14 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
              What the day looks like
            </h2>
            <ul className="mt-5 space-y-4">
              {trade.dayToDay.map((item) => (
                <li key={item} className="flex gap-3.5 text-[15px] leading-relaxed text-zinc-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
              Be honest about these first
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">
              The axes this trade is least flexible on. If one of these is a hard
              no for you, the pay won't fix it.
            </p>
            <ul className="mt-5 space-y-3">
              {defining.map(({ dim }) => (
                <li
                  key={dim.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg bg-zinc-50 px-4 py-3"
                >
                  <span className="text-sm font-semibold text-zinc-900">
                    {dim.label}
                  </span>
                  <span className="text-sm text-zinc-600">
                    {describeScore(dim.id, trade.profile[dim.id])}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            The ten-year arc
          </h2>
          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-7 sm:p-9">
            <Ladder stages={trade.ladder} />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-zinc-500">{PAY_DISCLAIMER}</p>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-b border-zinc-200 py-14 sm:py-16">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
              If this one interests you, look at these
            </h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
              Neighbors in trait space — similar conditions, different work.
            </p>
            <div className="mt-7 grid gap-5 sm:grid-cols-3">
              {related.map((t) => (
                <TradeCard key={t.slug} trade={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            Is {trade.name.toLowerCase()} actually your best fit?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-600">
            Twelve questions will rank it against the other {TRADES.length - 1}{" "}
            and tell you where it lands.
          </p>
          <Link
            href="/trades/quiz"
            className="mt-7 inline-flex rounded-full bg-zinc-900 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-zinc-700"
          >
            Take the quiz
          </Link>
        </div>
      </section>
    </>
  );
}
