import Link from "next/link";
import { BRAND, CATEGORIES, TRADES, getTrade } from "@/lib/trades";
import { TradeCard } from "@/components/trades/TradeCard";
import { Faq, type FaqItem } from "@/components/trades/Faq";
import { Ladder } from "@/components/trades/Ladder";

const OUTCOMES = [
  {
    title: "Your working-style profile",
    body:
      "Eight axes — setting, physical load, tolerance, people contact, systems thinking, heights, routine, and whether you'd rather build or maintain. Not a personality type. The specific conditions you actually want to work under.",
    icon: "profile",
  },
  {
    title: "Your ten-year arc",
    body:
      "Every match comes with the real progression: apprentice, journeyman, and what comes after. Pay band at each rung, what changes about the work, and which certification unlocks the next step.",
    icon: "arc",
  },
  {
    title: "Where to start near you",
    body:
      "Drop a ZIP and the results point at the apprenticeships, union halls, and trade schools that actually take applications in your area — plus what the application asks for.",
    icon: "map",
  },
] as const;

const STEPS = [
  {
    n: "01",
    title: "Answer twelve questions",
    body: "No name, no email, no account. Most people finish in eight to ten minutes.",
  },
  {
    n: "02",
    title: "See your top matches, scored",
    body: "All 30 trades ranked against your profile, with the honest friction points, not just the flattering parts.",
  },
  {
    n: "03",
    title: "Follow the arc to a start date",
    body: "Open the trade that fit, read the ten-year ladder, and take the specific next step where you live.",
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "I'd been told to go into HVAC for two years. The quiz put it eighth. Elevator constructor was first and I'd never heard of it as a job you could apply for. I'm two years into the apprenticeship now.",
    name: "Marcus D.",
    detail: "Elevator apprentice, second year",
  },
  {
    quote:
      "The friction list is what sold me. It said straight out that I'd hate the travel in pipefitting, and it was right — I went industrial maintenance instead and I'm home every night.",
    name: "Priya R.",
    detail: "Controls technician",
  },
  {
    quote:
      "Twenty-six, three years of college I didn't finish, no idea what to do. Took this on a Sunday and had an application in at the local on Tuesday.",
    name: "Sam O.",
    detail: "Sheet metal apprentice",
  },
] as const;

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Is it actually free? What's the catch?",
    a: "The quiz and every result page are free, and you don't create an account to see them. Your answers are encoded into the results URL rather than stored on a server, which is also why you should bookmark or copy that link if you want to come back to it.",
  },
  {
    q: "Do I need a high school diploma or a GED?",
    a: "For most registered apprenticeships, yes — a diploma or GED, being 18, and a valid driver's license are the common baseline. A few trades add a physical, a drug screen, or an aptitude test. Each trade page lists what its entry actually requires.",
  },
  {
    q: "I'm 34 and changing careers. Am I too old?",
    a: "No. Career changers are a large share of apprentices, and several trades openly prefer them for the work ethic and the customer skills. What changes with age isn't acceptance, it's that the hardest-on-the-body trades are worth weighing more carefully — which is exactly what the physical load axis is measuring.",
  },
  {
    q: "How accurate can twelve questions be?",
    a: "It's a starting filter, not a verdict. The questions are built around the conditions that actually make people leave a trade — weather, height, physical load, routine, and customer contact — because fit failures cluster there far more than around aptitude. Treat the top five as a shortlist worth researching, not a single answer.",
  },
  {
    q: "Do you place me in a job or take a cut?",
    a: "No. We don't broker placements, sell your information, or take a referral fee from schools. The apprenticeship and union links point at the programs' own application pages.",
  },
  {
    q: "Union or non-union?",
    a: "Both are on here, because the right answer is genuinely regional. In some metros the union hall is the highest-paid path with a pension attached; in others the open-shop contractors run the bigger projects. The trade pages flag which is stronger where it's clear-cut.",
  },
  {
    q: "What if my top match needs a license my state doesn't offer?",
    a: "Licensing is state-by-state and sometimes county-by-county, especially in plumbing and electrical. The trade pages describe the general path; your local licensing board is the authority, and the results page links to it with your ZIP.",
  },
];

export default function TradesLanding() {
  const featured = ["electrician", "elevator-constructor", "welder", "industrial-maintenance-technician", "lineworker", "hvac-technician"]
    .map(getTrade)
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const sampleArc = getTrade("electrician")!;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
            30 trades · 10 minutes · no sign-up
          </p>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Find the trade you were{" "}
            <span className="text-amber-400">built for</span>.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
            Most people pick a trade from the three they've heard of. There are
            thirty on this list, and the difference between the right one and a
            near-miss is about ten years of your life. Answer twelve questions
            and find out which end you belong on.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/trades/quiz"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-7 py-3.5 text-base font-bold text-zinc-950 transition-colors hover:bg-amber-300"
            >
              Start the quiz
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/trades/catalog"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Browse all 30 trades
            </Link>
          </div>

          <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-7 border-t border-white/10 pt-9 sm:grid-cols-4">
            {[
              ["30", "trades scored"],
              ["12", "questions"],
              ["$0", "to take it"],
              ["10yr", "arc per match"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-2xl font-bold tabular-nums text-amber-400 sm:text-3xl">{value}</dt>
                <dd className="mt-1 text-sm text-zinc-400">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Outcomes ---------- */}
      <section id="outcomes" className="scroll-mt-20 border-b border-zinc-200 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="What you get"
            title="Three things, at the end of ten minutes."
            lead="Not a list of careers to go research on your own. A profile, a path, and a place to apply."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {OUTCOMES.map((o) => (
              <div key={o.title} className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-7">
                <OutcomeIcon name={o.icon} />
                <h3 className="mt-5 text-lg font-bold tracking-tight text-zinc-950">{o.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-zinc-600">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how" className="scroll-mt-20 border-b border-zinc-200 bg-zinc-50 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading eyebrow="How it works" title="Twelve questions, then a shortlist." />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="border-t-2 border-zinc-900 pt-5">
                <span className="font-mono text-sm font-bold text-amber-600">{s.n}</span>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-zinc-950">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 max-w-2xl text-[15px] leading-relaxed text-zinc-500">
            The questions are about conditions, not aptitude — weather, height,
            physical load, routine, and how much you want to talk to customers.
            That's deliberate: people leave trades over conditions far more often
            than over the skill.
          </p>
        </div>
      </section>

      {/* ---------- Featured trades ---------- */}
      <section className="border-b border-zinc-200 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="The catalog"
            title="Thirty trades, across six families."
            lead="Everything from the ones everybody names to the ones with waitlists nobody's heard of."
          />

          <div className="mt-10 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/trades/catalog#${c.id}`}
                className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
              >
                {c.label}
                <span className="ml-1.5 tabular-nums text-zinc-400">
                  {TRADES.filter((t) => t.category === c.id).length}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((t) => (
              <TradeCard key={t.slug} trade={t} />
            ))}
          </div>

          <Link
            href="/trades/catalog"
            className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-zinc-900 underline decoration-amber-400 decoration-2 underline-offset-4 hover:decoration-zinc-900"
          >
            See all 30 trades
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* ---------- Sample arc ---------- */}
      <section className="border-b border-zinc-200 bg-zinc-50 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading
              eyebrow="The ten-year arc"
              title="Every match shows you the whole ladder."
              lead="Not a salary average. The actual rungs, what changes at each one, and what you have to pass to climb."
            />
            <p className="mt-6 text-[15px] leading-relaxed text-zinc-600">
              Here's what it looks like for one trade. The apprenticeship pays
              from the first week, the license arrives around year four, and the
              decision that matters most — stay on the tools, run crews, or go
              out on your own — is the one at the top.
            </p>
            <Link
              href={`/trades/catalog/${sampleArc.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-zinc-900 underline decoration-amber-400 decoration-2 underline-offset-4 hover:decoration-zinc-900"
            >
              Full {sampleArc.name.toLowerCase()} breakdown
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-7 sm:p-9">
            <div className="mb-7 flex items-baseline justify-between gap-4 border-b border-zinc-100 pb-5">
              <h3 className="text-xl font-bold tracking-tight">{sampleArc.name}</h3>
              <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                Sample arc
              </span>
            </div>
            <Ladder stages={sampleArc.ladder} />
          </div>
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="border-b border-zinc-200 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading eyebrow="From people who took it" title="The useful result isn't always the obvious one." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="flex flex-col rounded-2xl border border-zinc-200 p-7">
                <svg className="h-6 w-6 text-amber-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M9.5 5C6.5 6.6 5 9.3 5 13v6h6v-6H8.2c0-2.4.9-4 2.8-5.2L9.5 5zm9 0C15.5 6.6 14 9.3 14 13v6h6v-6h-2.8c0-2.4.9-4 2.8-5.2L18.5 5z" />
                </svg>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-zinc-700">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 border-t border-zinc-100 pt-4 text-sm">
                  <span className="font-semibold text-zinc-900">{t.name}</span>
                  <span className="block text-zinc-500">{t.detail}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-8 text-xs text-zinc-400">
            Composite accounts, written to illustrate typical outcomes.
          </p>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="scroll-mt-20 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <SectionHeading eyebrow="Questions" title="The ones people actually ask." />
          <div className="mt-10">
            <Faq items={FAQ_ITEMS} />
          </div>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="bg-zinc-950 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Ten minutes now, or ten years finding out the hard way.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-zinc-300">
            No account, no email, no cost. Just twelve questions and a straight
            answer about where you'd fit.
          </p>
          <Link
            href="/trades/quiz"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-amber-400 px-8 py-4 text-base font-bold text-zinc-950 transition-colors hover:bg-amber-300"
          >
            Find my trade
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <p className="mt-5 text-sm text-zinc-500">
            {BRAND.name} — {BRAND.tagline}
          </p>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-zinc-950 sm:text-4xl">
        {title}
      </h2>
      {lead && (
        <p className="mt-4 text-lg leading-relaxed text-zinc-600">{lead}</p>
      )}
    </div>
  );
}

function OutcomeIcon({ name }: { name: "profile" | "arc" | "map" }) {
  const paths: Record<typeof name, React.ReactNode> = {
    profile: <path d="M4 7h10M4 12h16M4 17h7" />,
    arc: <path d="M4 19V5M4 19h16M8 16l4-6 4 3 4-8" />,
    map: (
      <>
        <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  };
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-amber-400">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {paths[name]}
      </svg>
    </span>
  );
}
