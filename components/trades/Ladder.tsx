import type { LadderStage } from "@/lib/trades";

/** The ten-year arc, rendered as rungs. */
export function Ladder({ stages }: { stages: LadderStage[] }) {
  return (
    <ol className="relative space-y-0">
      {stages.map((stage, i) => (
        <li key={stage.title} className="relative flex gap-5 pb-8 last:pb-0">
          <div className="relative flex flex-col items-center">
            <span className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-amber-500 bg-white text-xs font-bold tabular-nums text-amber-700">
              {i + 1}
            </span>
            {i < stages.length - 1 && (
              <span className="absolute top-9 h-full w-0.5 bg-zinc-200" aria-hidden="true" />
            )}
          </div>
          <div className="flex-1 pb-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                Year {stage.years}
              </span>
              <h3 className="text-base font-bold tracking-tight text-zinc-950">
                {stage.title}
              </h3>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold tabular-nums text-emerald-800">
                {stage.pay}
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
              {stage.detail}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
