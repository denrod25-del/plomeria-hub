import type { DimensionId } from "./dimensions";

/**
 * Each option nudges one or more axes. Deltas are in "profile points" and are
 * applied to a 50-point neutral start, so a +30 answer lands you at 80 on that
 * axis if nothing pulls back the other way.
 */
export type QuizOption = {
  id: string;
  label: string;
  detail?: string;
  effects: Partial<Record<DimensionId, number>>;
  /**
   * A stated dealbreaker, as opposed to a preference. Effects from other
   * questions sum freely and can cancel each other out; a limit is applied
   * *after* that sum and clamps the axis, so answering "hard no" to heights
   * cannot be quietly eroded by two unrelated answers that happen to nudge
   * exposure upward. Limits also drive outright exclusion in `match.ts`.
   */
  limits?: Partial<Record<DimensionId, { min?: number; max?: number }>>;
};

export type QuizQuestion = {
  id: string;
  /** Short label for the progress rail. */
  short: string;
  prompt: string;
  helper?: string;
  options: QuizOption[];
};

export const QUIZ: QuizQuestion[] = [
  {
    id: "setting",
    short: "Setting",
    prompt: "It's 6:40 in the morning. Where do you want to be walking in?",
    options: [
      { id: "shop", label: "The same shop, every day", detail: "Climate controlled, your bench, your tools where you left them.", effects: { setting: -35, variety: -20, exposure: -10 } },
      { id: "site", label: "A jobsite that's different this month", detail: "Outdoors, weather included, new building going up.", effects: { setting: 32, variety: 25 } },
      { id: "plant", label: "One big facility with a lot going on inside it", detail: "A plant, hospital, or campus you learn inside out.", effects: { setting: -22, variety: 12, systems: 15 } },
      { id: "truck", label: "Your own truck, with a list of stops", detail: "Different address every few hours, you decide the order.", effects: { setting: 15, variety: 30, people: 25 } },
    ],
  },
  {
    id: "body",
    short: "Body",
    prompt: "How do you want to feel at the end of a shift?",
    options: [
      { id: "wrecked", label: "Physically worked, and fine with it", detail: "Heavy material, all day, and you sleep well.", effects: { exertion: 35 } },
      { id: "moderate", label: "Moved all day, not destroyed", detail: "On your feet, lifting sometimes, nothing brutal.", effects: { exertion: 5 } },
      { id: "light", label: "Tired in the head, not the back", detail: "The hard part was the problem, not the load.", effects: { exertion: -32, systems: 20 } },
      { id: "mixed", label: "Depends on the day", detail: "Some weeks heavy, some weeks fine.", effects: { exertion: 8, variety: 15 } },
    ],
  },
  {
    id: "tolerance",
    short: "Tolerance",
    prompt: "Two jobs. Which one sounds better?",
    options: [
      { id: "tight", label: "One part, and it has to measure within a thousandth", detail: "Slow, checked, and right.", effects: { precision: 35, exertion: -15 } },
      { id: "volume", label: "Two hundred feet of work, done well and done today", detail: "Good enough to pass, and keep moving.", effects: { precision: -25, exertion: 15 } },
      { id: "code", label: "Work that has to pass an inspector", detail: "A written standard decides whether you're done.", effects: { precision: 22, systems: 12 } },
      { id: "judgment", label: "Work where there's no spec and you have to call it", detail: "Your read of the situation is the standard.", effects: { precision: -5, variety: 18, creation: 12 } },
    ],
  },
  {
    id: "people",
    short: "People",
    prompt: "How much of your day should involve talking to people who aren't in the trade?",
    options: [
      { id: "none", label: "Basically none", detail: "Give me the print and leave me alone.", effects: { people: -35 } },
      { id: "crew", label: "My crew, and that's it", detail: "Coordination with the people doing the work.", effects: { people: -12 } },
      { id: "some", label: "Some — I don't mind explaining the work", detail: "A customer walkthrough here and there.", effects: { people: 18 } },
      { id: "lots", label: "A lot — that's the part I'm good at", detail: "Diagnosing, quoting, and selling the repair.", effects: { people: 35, systems: 10 } },
    ],
  },
  {
    id: "systems",
    short: "Systems",
    prompt: "Something stopped working. What's the satisfying part?",
    options: [
      { id: "diagnose", label: "Narrowing it down with a meter and a schematic", detail: "The fix is almost anticlimactic once you've found it.", effects: { systems: 35, precision: 12 } },
      { id: "rebuild", label: "Tearing it down and putting it back right", detail: "Hands in it, parts on the bench.", effects: { systems: -5, exertion: 15, precision: 15 } },
      { id: "replace", label: "Getting it swapped and running before anyone notices", detail: "Speed under pressure.", effects: { systems: 10, variety: 15 } },
      { id: "prevent", label: "Finding out why, so it doesn't happen again", detail: "Root cause, then the process change.", effects: { systems: 28, creation: -18 } },
    ],
  },
  {
    id: "heights",
    short: "Heights",
    prompt: "Honestly: how do you feel about working 200 feet up, or in a space you have to crawl into?",
    helper: "There's no wrong answer here, but it rules some trades in and out completely.",
    options: [
      { id: "love", label: "Genuinely fine, maybe even like it", detail: "Towers, steel, roofs, confined spaces — no issue.", effects: { exposure: 38, setting: 15 } },
      { id: "ok", label: "I can do it, I don't seek it out", detail: "A ladder and a roof, sure. A tower, if I had to.", effects: { exposure: 12 } },
      { id: "prefer-not", label: "I'd rather keep my feet near the ground", detail: "Occasional is fine, daily is not.", effects: { exposure: -22 }, limits: { exposure: { max: 45 } } },
      { id: "no", label: "Hard no", detail: "Not what I want out of a career.", effects: { exposure: -40 }, limits: { exposure: { max: 15 } } },
    ],
  },
  {
    id: "routine",
    short: "Routine",
    prompt: "How much should next month look like this month?",
    options: [
      { id: "same", label: "Same place, same people, predictable", detail: "I want to know where I'm going.", effects: { variety: -32, setting: -12 } },
      { id: "rotating", label: "Same employer, different work each week", detail: "Stability underneath, variety on top.", effects: { variety: 12 } },
      { id: "new-jobs", label: "New job every few weeks", detail: "Project ends, next one starts.", effects: { variety: 30, creation: 18 } },
      { id: "travel", label: "Send me wherever the work is", detail: "Per diem, outages, weeks away at a time.", effects: { variety: 38, setting: 15, exertion: 12 } },
    ],
  },
  {
    id: "output",
    short: "Output",
    prompt: "Ten years in, what do you want to be able to point at?",
    options: [
      { id: "built", label: "Buildings and structures I helped put up", detail: "Drive past it and know you were on it.", effects: { creation: 35, setting: 15 } },
      { id: "running", label: "Equipment that never went down on my watch", detail: "Uptime nobody thinks about because you did your job.", effects: { creation: -35, systems: 20 } },
      { id: "parts", label: "Work so precise it passed every inspection", detail: "Certified, documented, correct.", effects: { precision: 28, creation: 8 } },
      { id: "customers", label: "A book of customers who ask for me by name", detail: "Reputation is the asset.", effects: { people: 30, creation: -8 } },
    ],
  },
  {
    id: "learning",
    short: "Learning",
    prompt: "How do you want to learn this?",
    options: [
      { id: "earn", label: "Paid from day one, classroom at night", detail: "A registered apprenticeship. No tuition debt.", effects: { creation: 8 } },
      { id: "school-first", label: "School first, then hired with a credential", detail: "6–24 months of training, then into the field.", effects: { systems: 18, precision: 12 } },
      { id: "fastest", label: "Whatever gets me earning fastest", detail: "Start as a helper and learn on the job.", effects: { exertion: 18, precision: -12 } },
      { id: "hardest", label: "The most selective program I can get into", detail: "If it has a waitlist and a test, that's a good sign.", effects: { precision: 20, systems: 15, exposure: 12 } },
    ],
  },
  {
    id: "risk",
    short: "Stakes",
    prompt: "Which kind of pressure do you handle best?",
    options: [
      { id: "clock", label: "A material that's setting up whether you're ready or not", detail: "Concrete, hot work, a pour that can't wait.", effects: { exertion: 25, setting: 20, variety: -8 } },
      { id: "safety", label: "Work where the consequence of a mistake is serious", detail: "Energized lines, critical lifts, airworthiness.", effects: { exposure: 25, precision: 25 } },
      { id: "downtime", label: "A line that's down and costing money every minute", detail: "Everyone watching while you diagnose.", effects: { systems: 28, creation: -20 } },
      { id: "steady", label: "I'd rather the pressure just be steady and manageable", detail: "Do the work well, go home.", effects: { exposure: -18, exertion: -10 } },
    ],
  },
  {
    id: "money",
    short: "Money",
    prompt: "What's the pay shape you actually want?",
    options: [
      { id: "scale", label: "Union scale, benefits, and a pension", detail: "Predictable, negotiated, with a retirement behind it.", effects: { setting: 12, exertion: 12 } },
      { id: "overtime", label: "High base, and all the overtime I can take", detail: "Outages and storm work, 60-hour weeks by choice.", effects: { variety: 25, exertion: 25, exposure: 18 } },
      { id: "specialize", label: "A specialty certification nobody else in the room has", detail: "Get paid for what you can do that others can't.", effects: { precision: 25, systems: 22 } },
      { id: "own", label: "My own business, eventually", detail: "Build a book, get licensed, put my name on the truck.", effects: { people: 30, creation: 12 } },
    ],
  },
  {
    id: "dealbreaker",
    short: "Limits",
    prompt: "Last one. What would make you quit a job you otherwise liked?",
    options: [
      { id: "cold", label: "Working outside in bad weather all winter", effects: { setting: -30 }, limits: { setting: { max: 45 } } },
      { id: "indoors", label: "Being stuck inside the same four walls", effects: { setting: 28, variety: 15 }, limits: { setting: { min: 55 } } },
      { id: "dirty", label: "Coming home filthy and beat up every day", effects: { exertion: -28 }, limits: { exertion: { max: 45 } } },
      { id: "boring", label: "Doing the exact same task over and over", effects: { variety: 28, systems: 12 }, limits: { variety: { min: 55 } } },
    ],
  },
];

export const QUIZ_LENGTH = QUIZ.length;

/** Answers are keyed by question id → option id. */
export type QuizAnswers = Record<string, string>;

export function getQuestion(id: string): QuizQuestion | undefined {
  return QUIZ.find((q) => q.id === id);
}
