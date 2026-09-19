import Link from "next/link";
import { BRAND, CATEGORIES, PAY_DISCLAIMER } from "@/lib/trades";
import { LadderMark } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
            <LadderMark />
            {BRAND.name}
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-600">
            {BRAND.description}
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Explore
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-600">
            <li><Link href="/trades/quiz" className="hover:text-zinc-950">Take the quiz</Link></li>
            <li><Link href="/trades/catalog" className="hover:text-zinc-950">All 30 trades</Link></li>
            <li><Link href="/trades#how" className="hover:text-zinc-950">How it works</Link></li>
            <li><Link href="/trades#faq" className="hover:text-zinc-950">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            By category
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-600">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href={`/trades/catalog#${c.id}`} className="hover:text-zinc-950">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-200">
        <div className="mx-auto max-w-6xl px-5 py-6 text-xs leading-relaxed text-zinc-500 sm:px-8">
          <p>{PAY_DISCLAIMER}</p>
          <p className="mt-3">
            {BRAND.name} is an independent career-exploration tool. It is not an
            apprenticeship program, a school, or an employer, and it is not
            affiliated with any union or licensing authority named on this site.
          </p>
        </div>
      </div>
    </footer>
  );
}
