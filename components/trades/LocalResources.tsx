import type { Trade } from "@/lib/trades";

/**
 * Apprenticeship and school lookups, pre-filled with the visitor's ZIP.
 *
 * These deep-link into the public directories that actually hold the listings
 * (apprenticeship.gov, the DOL school finder, Google Maps for union halls)
 * rather than pretending to a database of local programs we don't have.
 */
export function LocalResources({ trade, zip }: { trade: Trade; zip: string | null }) {
  const q = (term: string) =>
    encodeURIComponent(zip ? `${term} near ${zip}` : term);

  const links = [
    {
      label: "Registered apprenticeships",
      detail: zip
        ? `Paid ${trade.name.toLowerCase()} programs near ${zip}, from the federal registry.`
        : `Paid ${trade.name.toLowerCase()} programs, from the federal registry.`,
      href: `https://www.apprenticeship.gov/apprenticeship-job-finder?keyword=${q(trade.name)}${zip ? `&location=${zip}` : ""}`,
    },
    {
      label: "Trade schools & community colleges",
      detail: "Accredited programs and their published tuition and completion rates.",
      href: `https://www.google.com/search?q=${q(`${trade.name} trade school program`)}`,
    },
    {
      label: "Union locals & halls",
      detail: "Where the application and the aptitude test actually happen.",
      href: `https://www.google.com/maps/search/${q(`${trade.name} union local`)}`,
    },
    {
      label: "Open positions",
      detail: "Helper and apprentice openings hiring right now.",
      href: `https://www.google.com/search?q=${q(`${trade.name} apprentice jobs`)}`,
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-zinc-950">
        Where to start{zip ? ` near ${zip}` : ""}
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">
        {zip
          ? "Four searches, already filled in. The first one is the important one — registered apprenticeships pay from week one."
          : "Add a ZIP code to the quiz to narrow these to your area. Registered apprenticeships are the ones that pay from week one."}
      </p>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-900"
            >
              <span className="flex items-center justify-between gap-3 font-semibold text-zinc-950">
                {link.label}
                <svg className="h-4 w-4 shrink-0 text-zinc-400 transition-colors group-hover:text-zinc-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </span>
              <span className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                {link.detail}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
