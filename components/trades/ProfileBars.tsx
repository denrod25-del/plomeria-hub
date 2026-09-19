import { DIMENSIONS, describeScore, type Profile } from "@/lib/trades";

/** The working-style profile: where the answers landed on each axis. */
export function ProfileBars({
  profile,
  compare,
  compareLabel,
}: {
  profile: Profile;
  /** Optional second profile (a trade) drawn as a marker on the same axis. */
  compare?: Profile;
  compareLabel?: string;
}) {
  return (
    <ul className="space-y-6">
      {DIMENSIONS.map((dim) => {
        const value = profile[dim.id];
        const other = compare?.[dim.id];
        return (
          <li key={dim.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-sm font-bold text-zinc-900">{dim.label}</h3>
              <span className="text-sm text-zinc-600">
                {describeScore(dim.id, value)}
              </span>
            </div>

            <div className="relative mt-2.5 h-2 rounded-full bg-zinc-200">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-zinc-900"
                style={{ width: `${value}%` }}
              />
              <span
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-zinc-900 shadow"
                style={{ left: `${value}%` }}
                aria-hidden="true"
              />
              {other !== undefined && (
                <span
                  className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-white bg-amber-500"
                  style={{ left: `${other}%` }}
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="mt-1.5 flex justify-between text-[11px] text-zinc-400">
              <span>{dim.low}</span>
              <span>{dim.high}</span>
            </div>
          </li>
        );
      })}

      {compare && (
        <li className="flex items-center gap-5 border-t border-zinc-200 pt-5 text-xs text-zinc-600">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-zinc-900" aria-hidden="true" />
            You
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rotate-45 bg-amber-500" aria-hidden="true" />
            {compareLabel ?? "This trade"}
          </span>
        </li>
      )}
    </ul>
  );
}
