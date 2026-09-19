export type FaqItem = { q: string; a: string };

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-zinc-200 border-y border-zinc-200">
      {items.map((item) => (
        <details key={item.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left text-base font-semibold text-zinc-900 marker:content-none">
            {item.q}
            <svg
              className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-open:rotate-45"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </summary>
          <p className="mt-3 max-w-3xl pr-10 text-[15px] leading-relaxed text-zinc-600">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
