import Link from "next/link";
import { CATEGORIES, type Trade } from "@/lib/trades";

export function categoryLabel(id: Trade["category"]): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function TradeCard({ trade, score }: { trade: Trade; score?: number }) {
  return (
    <Link
      href={`/trades/catalog/${trade.slug}`}
      className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-lg hover:shadow-zinc-200/60"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
          {categoryLabel(trade.category)}
        </span>
        {score !== undefined && (
          <span className="shrink-0 rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-bold tabular-nums text-white">
            {score}% fit
          </span>
        )}
      </div>
      <h3 className="mt-2 text-lg font-bold tracking-tight text-zinc-950">
        {trade.name}
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-zinc-600">
        {trade.tagline}
      </p>
      <div className="mt-4 flex items-baseline justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-500">
        <span>
          Year 5:{" "}
          <span className="font-semibold tabular-nums text-zinc-800">
            {trade.ladder[2]?.pay ?? trade.ladder[trade.ladder.length - 1].pay}
          </span>
        </span>
        <span className="font-medium text-zinc-400 transition-colors group-hover:text-zinc-900">
          Details →
        </span>
      </div>
    </Link>
  );
}
