import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, TRADES, tradesInCategory } from "@/lib/trades";
import { TradeCard } from "@/components/trades/TradeCard";

export const metadata: Metadata = {
  title: "All 30 trades",
  description:
    "Every trade we score, across six families — what the work is, what it pays at each rung, and how you get in.",
};

export default function CatalogPage() {
  return (
    <>
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-zinc-950 sm:text-5xl">
            Thirty trades, and what each one actually asks of you.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Browse them all, or{" "}
            <Link
              href="/trades/quiz"
              className="font-semibold text-zinc-900 underline decoration-amber-400 decoration-2 underline-offset-4"
            >
              take the quiz
            </Link>{" "}
            and have them ranked against how you want to work.
          </p>

          <nav className="mt-8 flex flex-wrap gap-2" aria-label="Trade categories">
            {CATEGORIES.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="rounded-full border border-zinc-300 bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
              >
                {c.label}
                <span className="ml-1.5 tabular-nums text-zinc-400">
                  {tradesInCategory(c.id).length}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {CATEGORIES.map((category, i) => (
        <section
          key={category.id}
          id={category.id}
          className={`scroll-mt-20 border-b border-zinc-200 py-14 sm:py-16 ${
            i % 2 === 1 ? "bg-zinc-50" : ""
          }`}
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
                {category.label}
              </h2>
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                {tradesInCategory(category.id).length} trades
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
              {category.blurb}
            </p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tradesInCategory(category.id).map((trade) => (
                <TradeCard key={trade.slug} trade={trade} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-16 text-center">
        <p className="text-sm text-zinc-500">
          {TRADES.length} trades scored on 8 axes.
        </p>
        <Link
          href="/trades/quiz"
          className="mt-5 inline-flex rounded-full bg-zinc-900 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-zinc-700"
        >
          Rank them against me
        </Link>
      </section>
    </>
  );
}
