"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND } from "@/lib/trades";

const NAV = [
  { href: "/trades#how", label: "How it works" },
  { href: "/trades/catalog", label: "All 30 trades" },
  { href: "/trades#outcomes", label: "What you get" },
  { href: "/trades#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
        <Link
          href="/trades"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <LadderMark />
          {BRAND.name}
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/trades/quiz"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            Take the quiz
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-2 rounded-md p-2 text-zinc-700 md:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-zinc-200 bg-white px-5 pb-4 pt-2 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-medium text-zinc-700"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/trades/quiz"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-full bg-zinc-900 px-4 py-2.5 text-center text-sm font-semibold text-white"
          >
            Take the quiz
          </Link>
        </nav>
      )}
    </header>
  );
}

/** Three rungs — the brand mark, inline so there's no image request. */
export function LadderMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 text-amber-500 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M7 3v18M17 3v18M7 8h10M7 14h10" />
    </svg>
  );
}
