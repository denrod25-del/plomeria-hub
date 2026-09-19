/**
 * The eight axes every trade and every quiz answer is scored on.
 *
 * Each axis runs 0–100. The two poles are written out so the same labels can
 * drive the quiz UI, the working-style profile on the results page, and the
 * "why this matched" copy — there is no second source of truth to drift from.
 */

export const DIMENSIONS = [
  {
    id: "setting",
    label: "Work setting",
    low: "Indoors, one shop",
    high: "Outdoors, in the field",
    blurb: "Whether the work happens under a roof you control or in whatever weather shows up.",
  },
  {
    id: "exertion",
    label: "Physical load",
    low: "Steady and light",
    high: "Heavy and demanding",
    blurb: "How much of the job is carried, lifted, and muscled into place.",
  },
  {
    id: "precision",
    label: "Tolerance",
    low: "Close enough, keep moving",
    high: "Thousandths matter",
    blurb: "How tight the work has to measure before it passes.",
  },
  {
    id: "people",
    label: "People contact",
    low: "Heads-down, few interruptions",
    high: "Customer-facing all day",
    blurb: "Whether you explain the work to strangers or just do it.",
  },
  {
    id: "systems",
    label: "Systems thinking",
    low: "Mechanical and hands-on",
    high: "Electronics and diagnostics",
    blurb: "How much of the job is reading meters, schematics, and software versus turning wrenches.",
  },
  {
    id: "exposure",
    label: "Heights and tight spaces",
    low: "Feet on the ground",
    high: "Comfortable anywhere",
    blurb: "Your appetite for towers, roofs, trenches, and crawlspaces.",
  },
  {
    id: "variety",
    label: "Routine",
    low: "Same site, same rhythm",
    high: "New job every week",
    blurb: "Whether you want to know where you're going Monday or find out Sunday night.",
  },
  {
    id: "creation",
    label: "Build vs. maintain",
    low: "Keep it running",
    high: "Put up something new",
    blurb: "Whether you'd rather troubleshoot what exists or leave something behind that didn't.",
  },
] as const;

export type DimensionId = (typeof DIMENSIONS)[number]["id"];
export type Dimension = (typeof DIMENSIONS)[number];

/** A point in trait space — every axis present, every value 0–100. */
export type Profile = Record<DimensionId, number>;

export const DIMENSION_IDS = DIMENSIONS.map((d) => d.id) as DimensionId[];

export function getDimension(id: DimensionId): Dimension {
  const found = DIMENSIONS.find((d) => d.id === id);
  if (!found) throw new Error(`Unknown dimension: ${id}`);
  return found;
}

/** The midpoint of trait space — what an unanswered quiz looks like. */
export function neutralProfile(): Profile {
  return DIMENSION_IDS.reduce((acc, id) => {
    acc[id] = 50;
    return acc;
  }, {} as Profile);
}

/** Describes where a score sits on its axis, for prose on the results page. */
export function describeScore(id: DimensionId, value: number): string {
  const dim = getDimension(id);
  if (value >= 78) return dim.high;
  if (value >= 60) return `Leans ${dim.high.toLowerCase()}`;
  if (value > 40) return "Comfortable either way";
  if (value > 22) return `Leans ${dim.low.toLowerCase()}`;
  return dim.low;
}
