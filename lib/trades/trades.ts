import type { DimensionId, Profile } from "./dimensions";

export type CategoryId =
  | "electrical"
  | "mechanical"
  | "metal"
  | "structure"
  | "vehicles"
  | "finish";

export const CATEGORIES: { id: CategoryId; label: string; blurb: string }[] = [
  { id: "electrical", label: "Electrical & Power", blurb: "Everything that carries current, from a bedroom outlet to a 230kV line." },
  { id: "mechanical", label: "Mechanical & HVAC", blurb: "The systems that move air, water, heat, and everything through a pipe." },
  { id: "metal", label: "Metal & Fabrication", blurb: "Cutting, joining, and machining steel and alloy to a drawing." },
  { id: "structure", label: "Construction & Structure", blurb: "The frame, the shell, and the ground it all sits on." },
  { id: "vehicles", label: "Vehicles & Heavy Equipment", blurb: "Anything with an engine, a hydraulic circuit, or tracks." },
  { id: "finish", label: "Finishing & Envelope", blurb: "The layers that keep weather out and make a building look finished." },
];

/** One rung on a trade's ten-year arc. */
export type LadderStage = {
  /** Years from day one, as a range. */
  years: string;
  title: string;
  /** Illustrative national pay band — see PAY_DISCLAIMER. */
  pay: string;
  detail: string;
};

export type Trade = {
  slug: string;
  name: string;
  category: CategoryId;
  /** One line, used on cards and in match results. */
  tagline: string;
  summary: string;
  dayToDay: string[];
  /** Where this trade sits in trait space. */
  profile: Profile;
  /**
   * Per-axis importance, 0.5–3. High weight means the axis is genuinely
   * defining for the trade, so a mismatch there should cost more than a
   * mismatch on an axis the trade is flexible about. Omitted axes default to 1.
   */
  weights?: Partial<Record<DimensionId, number>>;
  entry: string;
  credential: string;
  ladder: LadderStage[];
  related: string[];
};

export const PAY_DISCLAIMER =
  "Pay bands are illustrative national ranges for planning, not offers. Real numbers swing hard by metro, union status, overtime, and licensing — check your local apprenticeship or union hall for current scale.";

/** Terser helper so the table below stays readable. */
const p = (
  setting: number,
  exertion: number,
  precision: number,
  people: number,
  systems: number,
  exposure: number,
  variety: number,
  creation: number
): Profile => ({ setting, exertion, precision, people, systems, exposure, variety, creation });

export const TRADES: Trade[] = [
  {
    slug: "electrician",
    name: "Electrician",
    category: "electrical",
    tagline: "Code, current, and a meter that tells you the truth.",
    summary:
      "Electricians pull, terminate, and troubleshoot the wiring that everything else in a building depends on. It is a reading trade as much as a hands trade — the National Electrical Code is the spine of the job, and the license you earn is portable, respected, and hard to automate.",
    dayToDay: [
      "Lay out and rough in circuits from a print before the walls close up",
      "Terminate panels, devices, and gear, then verify with a meter",
      "Chase a fault nobody else could find and prove you fixed it",
    ],
    profile: p(45, 50, 78, 55, 78, 55, 65, 65),
    weights: { systems: 2.5, precision: 2 },
    entry: "Registered apprenticeship (IBEW/NECA or open-shop), 4–5 years, paid from day one",
    credential: "Journeyman license by state exam, then master after additional years",
    ladder: [
      { years: "0–1", title: "Apprentice, first year", pay: "$38k–$52k", detail: "Material handling, demo, learning bends and terminations under a journeyman. Classroom nights." },
      { years: "2–4", title: "Apprentice, upper years", pay: "$52k–$78k", detail: "Running your own rooms and circuits. Pay steps up with each period you clear." },
      { years: "4–6", title: "Journeyman", pay: "$70k–$105k", detail: "Licensed, working unsupervised, signing off your own work. Overtime is yours if you want it." },
      { years: "7–10", title: "Foreman, estimator, or master", pay: "$95k–$150k+", detail: "Running crews and prints, or sitting for master and putting your name on permits." },
    ],
    related: ["low-voltage-technician", "lineworker", "solar-pv-installer"],
  },
  {
    slug: "plumber",
    name: "Plumber",
    category: "mechanical",
    tagline: "Water goes where you tell it, or it goes everywhere.",
    summary:
      "Plumbers install and repair the supply, waste, and vent systems in everything from houses to hospitals. The code is strict, the consequences of a mistake are visible immediately, and licensed plumbers are chronically short in almost every market in the country.",
    dayToDay: [
      "Rough in supply, waste, and vent to a plan and a code book",
      "Solder, press, glue, and thread joints that cannot leak",
      "Diagnose a callback in someone's kitchen and explain the fix",
    ],
    profile: p(45, 65, 72, 68, 45, 60, 68, 60),
    weights: { precision: 2, people: 1.5 },
    entry: "Registered apprenticeship (UA local or open-shop), 4–5 years, paid",
    credential: "Journeyman plumber license by state or county exam, then master",
    ladder: [
      { years: "0–1", title: "Apprentice, first year", pay: "$36k–$50k", detail: "Digging, carrying, cutting, and learning why every joint is done that way." },
      { years: "2–4", title: "Apprentice, upper years", pay: "$50k–$74k", detail: "Roughing in your own fixtures and stacks with a journeyman checking behind you." },
      { years: "4–6", title: "Journeyman", pay: "$68k–$100k", detail: "Licensed and running service or new construction on your own." },
      { years: "7–10", title: "Master, service manager, or owner", pay: "$95k–$180k+", detail: "Pulling permits under your own license. Service plumbing is one of the shortest paths to your own truck." },
    ],
    related: ["pipefitter", "hvac-technician", "fire-sprinkler-fitter"],
  },
  {
    slug: "hvac-technician",
    name: "HVAC/R Technician",
    category: "mechanical",
    tagline: "Refrigeration cycle in your head, gauges in your hand.",
    summary:
      "HVAC/R techs install and service heating, cooling, and refrigeration — a trade that mixes real diagnostics with real customer contact. Commercial refrigeration in particular pays well and keeps you busy year-round instead of riding the summer spike.",
    dayToDay: [
      "Charge, recover, and troubleshoot refrigerant circuits by pressure and temperature",
      "Read a wiring diagram to find the control that failed",
      "Tell a homeowner what it costs and why, without losing the job",
    ],
    profile: p(50, 55, 72, 78, 75, 52, 72, 45),
    weights: { systems: 2, people: 2 },
    entry: "Trade school (6–24 months) or a paid apprenticeship; many start as an install helper",
    credential: "EPA 608 certification is federally required; state license in many states; NATE optional",
    ladder: [
      { years: "0–1", title: "Install helper", pay: "$36k–$50k", detail: "Hanging equipment, running lineset, pulling 608 certification." },
      { years: "2–4", title: "Service technician", pay: "$52k–$80k", detail: "Your own truck and route. Diagnostics get fast and your callbacks drop." },
      { years: "4–6", title: "Senior / commercial refrigeration tech", pay: "$72k–$110k", detail: "Racks, chillers, and controls. The specialty side pulls away from residential pay here." },
      { years: "7–10", title: "Service manager or owner", pay: "$95k–$170k+", detail: "Running a board of techs, or your own shop with maintenance contracts." },
    ],
    related: ["plumber", "industrial-maintenance-technician", "sheet-metal-worker"],
  },
  {
    slug: "welder",
    name: "Welder",
    category: "metal",
    tagline: "A skill you can test into anywhere in the world.",
    summary:
      "Welding is the rare trade where a certification test settles the argument — you either lay the bead or you don't. Structural, pipe, and pressure welding all pay differently, and pipe welders who can pass a 6G test travel well and price accordingly.",
    dayToDay: [
      "Fit, tack, and weld to a procedure and a drawing",
      "Run positions that punish bad body mechanics and rushed prep",
      "Grind, inspect, and hand off work that has to pass X-ray",
    ],
    profile: p(40, 62, 88, 25, 35, 55, 48, 72),
    weights: { precision: 3, people: 1.5 },
    entry: "Trade school (7–18 months) or shop apprenticeship; portfolio of passed coupons matters more than the diploma",
    credential: "AWS D1.1 / ASME Section IX certifications, per process and position",
    ladder: [
      { years: "0–1", title: "Welder helper / fitter", pay: "$36k–$52k", detail: "Prep, fit-up, and burning practice coupons until they pass bend tests." },
      { years: "2–4", title: "Certified structural welder", pay: "$52k–$78k", detail: "Certified in your processes, working production or field structural." },
      { years: "4–6", title: "Pipe / pressure welder", pay: "$75k–$120k", detail: "6G-certified pipe work. Shutdown and turnaround premiums start here." },
      { years: "7–10", title: "Welding inspector or rig welder", pay: "$95k–$180k+", detail: "CWI certification and inspection work, or your own rig truck billing by the hour." },
    ],
    related: ["pipefitter", "boilermaker", "ironworker"],
  },
  {
    slug: "carpenter",
    name: "Carpenter",
    category: "structure",
    tagline: "The trade that leaves the most behind.",
    summary:
      "Carpenters frame, form, and finish — the widest trade on this list, and the one where you can see what you did at the end of the day. It splits fast into rough framing, concrete formwork, interior systems, and finish work, and they are close to different jobs.",
    dayToDay: [
      "Lay out walls and floors from a print, then frame them square",
      "Build and strip forms that hold wet concrete where it belongs",
      "Hang doors and set trim to a tolerance the eye will catch",
    ],
    profile: p(65, 68, 70, 45, 25, 58, 72, 88),
    weights: { creation: 2, systems: 1.5 },
    entry: "Registered apprenticeship (UBC or open-shop), 3–4 years, paid",
    credential: "No universal license; certifications in scaffold, rigging, and lead/asbestos add pay",
    ladder: [
      { years: "0–1", title: "Apprentice carpenter", pay: "$36k–$50k", detail: "Stocking, cutting, and learning layout. Tool list grows every month." },
      { years: "2–4", title: "Journeyman carpenter", pay: "$52k–$80k", detail: "Running your own walls and forms. Choosing a specialty starts to matter." },
      { years: "4–6", title: "Lead carpenter", pay: "$68k–$98k", detail: "Leading a small crew, reading the whole print, catching other trades' mistakes." },
      { years: "7–10", title: "Superintendent or contractor", pay: "$90k–$160k+", detail: "Running the site, or licensed as a general contractor bidding your own work." },
    ],
    related: ["mason", "concrete-finisher", "drywall-finisher"],
  },
  {
    slug: "pipefitter",
    name: "Pipefitter / Steamfitter",
    category: "mechanical",
    tagline: "Industrial pipe, industrial money.",
    summary:
      "Pipefitters build the high-pressure process piping in refineries, power plants, and industrial facilities. It's plumbing's heavier, better-paid cousin — more rigging, more math, more travel, and turnaround work that stacks overtime fast.",
    dayToDay: [
      "Take isometric drawings and turn them into fabricated spools",
      "Rig and set pipe in place, then fit it within tolerance for the welder",
      "Work shutdowns where the clock and the schedule are the whole job",
    ],
    profile: p(58, 78, 82, 30, 45, 72, 62, 78),
    weights: { exertion: 2, precision: 2, exposure: 1.5 },
    entry: "UA apprenticeship, 5 years, paid; strong path from welding school",
    credential: "Journeyman card plus welding certifications and site safety tickets",
    ladder: [
      { years: "0–1", title: "Apprentice fitter", pay: "$40k–$55k", detail: "Rigging, cutting, and learning to read isos. Classroom alongside." },
      { years: "2–4", title: "Apprentice, upper years", pay: "$58k–$85k", detail: "Fabricating and setting your own spools. Welding certs stack on top." },
      { years: "4–6", title: "Journeyman fitter", pay: "$80k–$120k", detail: "Full scale plus per diem and turnaround overtime." },
      { years: "7–10", title: "Foreman or QA/QC", pay: "$110k–$190k+", detail: "Running fitting crews on capital projects, or moving into inspection." },
    ],
    related: ["welder", "boilermaker", "plumber"],
  },
  {
    slug: "sheet-metal-worker",
    name: "Sheet Metal Worker",
    category: "metal",
    tagline: "Flat stock in, three-dimensional system out.",
    summary:
      "Sheet metal workers lay out, fabricate, and install duct and architectural metal. It's the most geometric trade on this list — real layout math, CAD-driven fabrication in the shop, and installation that has to fit a building that was never built quite to print.",
    dayToDay: [
      "Lay out fittings and transitions from a drawing, in the shop or on software",
      "Form, seam, and assemble duct that has to seal to a leakage class",
      "Hang and connect systems overhead, around everyone else's work",
    ],
    profile: p(45, 58, 80, 32, 48, 65, 58, 80),
    weights: { precision: 2.5 },
    entry: "SMART apprenticeship or open-shop program, 4–5 years, paid",
    credential: "Journeyman card; TAB (testing, adjusting, balancing) certification is a lucrative branch",
    ladder: [
      { years: "0–1", title: "Apprentice", pay: "$38k–$52k", detail: "Shop work, brakes and shears, and learning layout by hand before software." },
      { years: "2–4", title: "Apprentice, upper years", pay: "$52k–$78k", detail: "Splitting time between fabrication and field install." },
      { years: "4–6", title: "Journeyman", pay: "$68k–$102k", detail: "Running install or detailing in the shop with CAD." },
      { years: "7–10", title: "Detailer, TAB specialist, or foreman", pay: "$90k–$150k+", detail: "Detailing pays well and is easier on the body; TAB work is its own certified specialty." },
    ],
    related: ["hvac-technician", "welder", "ironworker"],
  },
  {
    slug: "ironworker",
    name: "Ironworker",
    category: "metal",
    tagline: "The steel goes up before anything else does.",
    summary:
      "Ironworkers erect the structural steel and tie the rebar that everything else hangs on. It is the most exposed trade here — real height, real weather, real consequences — and it pays accordingly, with a strong union presence in most major markets.",
    dayToDay: [
      "Connect beams and columns as the crane sets them",
      "Bolt up, plumb, and weld structural connections",
      "Tie and place reinforcing steel before the pour",
    ],
    profile: p(92, 92, 62, 22, 20, 95, 72, 92),
    weights: { exposure: 3, exertion: 2.5, setting: 2 },
    entry: "Ironworkers apprenticeship, 3–4 years, paid",
    credential: "Journeyman card plus rigging, welding, and connector certifications",
    ladder: [
      { years: "0–1", title: "Apprentice", pay: "$40k–$56k", detail: "Rebar, decking, and learning to move on steel safely." },
      { years: "2–3", title: "Apprentice, upper years", pay: "$56k–$85k", detail: "Connecting and welding under supervision. Pay steps are steep." },
      { years: "4–6", title: "Journeyman ironworker", pay: "$78k–$120k", detail: "Full scale with benefits; overtime on schedule-driven jobs." },
      { years: "7–10", title: "Foreman or superintendent", pay: "$105k–$180k+", detail: "Running raising gangs, or moving into steel erection management." },
    ],
    related: ["welder", "crane-operator", "boilermaker"],
  },
  {
    slug: "millwright",
    name: "Millwright",
    category: "mechanical",
    tagline: "Install it, align it to a thousandth, keep it turning.",
    summary:
      "Millwrights install, align, and maintain industrial machinery — turbines, conveyors, presses, and pumps. Precision alignment with lasers and dial indicators is the core skill, and it is the kind of work that plants cannot afford to get wrong.",
    dayToDay: [
      "Set and level heavy machinery to a baseplate",
      "Laser-align shafts and couplings inside a few thousandths",
      "Tear down, inspect, and rebuild rotating equipment during an outage",
    ],
    profile: p(35, 70, 92, 28, 58, 62, 55, 55),
    weights: { precision: 3, exertion: 1.5 },
    entry: "Millwright apprenticeship (UBC or industrial), 4 years, paid",
    credential: "Journeyman card; vibration analysis and precision alignment certifications",
    ladder: [
      { years: "0–1", title: "Apprentice millwright", pay: "$40k–$54k", detail: "Rigging, disassembly, and learning to read indicators." },
      { years: "2–4", title: "Apprentice, upper years", pay: "$55k–$82k", detail: "Alignments and rebuilds with a journeyman signing off." },
      { years: "4–6", title: "Journeyman millwright", pay: "$75k–$115k", detail: "Outage and turnaround work with heavy overtime." },
      { years: "7–10", title: "Reliability tech or foreman", pay: "$100k–$165k+", detail: "Predictive maintenance programs, or running millwright crews on capital installs." },
    ],
    related: ["industrial-maintenance-technician", "machinist", "boilermaker"],
  },
  {
    slug: "machinist",
    name: "Machinist / CNC Programmer",
    category: "metal",
    tagline: "Where 0.001 inch is a big number.",
    summary:
      "Machinists turn bar stock and castings into parts that have to measure. The trade has split into manual machining, CNC setup and operation, and programming — and the programming end is closer to software work than most people expect.",
    dayToDay: [
      "Set up a machine, dial in work-holding, and prove out a first article",
      "Inspect with mics, gauges, and CMM against a print with real GD&T",
      "Write or edit G-code and toolpaths to hit cycle time without scrapping parts",
    ],
    profile: p(10, 32, 96, 20, 72, 18, 25, 72),
    weights: { precision: 3, setting: 2, exposure: 1.5 },
    entry: "Trade school or shop apprenticeship, 2–4 years; entry as machine operator is common",
    credential: "NIMS certifications by level; employer-specific CNC and CAM proficiency",
    ladder: [
      { years: "0–1", title: "Machine operator", pay: "$36k–$48k", detail: "Loading, running, and inspecting parts on a proven job." },
      { years: "2–4", title: "CNC setup machinist", pay: "$50k–$72k", detail: "Setting up your own jobs and holding tolerance without help." },
      { years: "4–6", title: "CNC programmer / toolmaker", pay: "$68k–$100k", detail: "CAM programming and fixture design. Toolmaking is its own premium." },
      { years: "7–10", title: "Lead programmer or shop owner", pay: "$90k–$160k+", detail: "Owning the process end to end, or running a job shop." },
    ],
    related: ["millwright", "welder", "industrial-maintenance-technician"],
  },
  {
    slug: "industrial-maintenance-technician",
    name: "Industrial Maintenance Technician",
    category: "mechanical",
    tagline: "The plant does not run without you.",
    summary:
      "Maintenance techs keep production equipment running — mechanical, electrical, hydraulic, pneumatic, and increasingly PLC-controlled. It's the best trade on this list for people who like variety without leaving the same building every day.",
    dayToDay: [
      "Troubleshoot a line that went down, under pressure, with production watching",
      "Read ladder logic and trace a control fault to a sensor or a drive",
      "Run preventive maintenance so the emergency never happens",
    ],
    profile: p(15, 52, 72, 42, 85, 45, 68, 25),
    weights: { systems: 2.5, setting: 2, creation: 1.5 },
    entry: "Two-year mechatronics degree or in-plant apprenticeship; many transfer in from other trades",
    credential: "No license required; PLC (Allen-Bradley/Siemens) and vibration certs raise pay fast",
    ladder: [
      { years: "0–1", title: "Maintenance helper", pay: "$38k–$52k", detail: "PMs, rounds, and learning the plant's equipment one breakdown at a time." },
      { years: "2–4", title: "Maintenance technician", pay: "$55k–$78k", detail: "Taking your own calls on nights or weekends. Shift premiums add up." },
      { years: "4–6", title: "Controls / E&I technician", pay: "$75k–$110k", detail: "PLCs, drives, and instrumentation. This is where the pay curve bends up." },
      { years: "7–10", title: "Reliability engineer or maintenance manager", pay: "$95k–$160k+", detail: "Owning uptime for a facility, often without a four-year degree." },
    ],
    related: ["millwright", "electrician", "machinist"],
  },
  {
    slug: "elevator-constructor",
    name: "Elevator Constructor",
    category: "mechanical",
    tagline: "The hardest apprenticeship to get into, and worth it.",
    summary:
      "Elevator constructors install and service elevators and escalators — a trade that combines structural work, precision mechanical alignment, and sophisticated controls. It is consistently among the best-paid construction trades in the country, and the apprenticeship is genuinely competitive to enter.",
    dayToDay: [
      "Set rails and align a hoistway to tolerances measured over many floors",
      "Wire and commission controllers, then test safeties",
      "Service callbacks in a building where people are waiting on you",
    ],
    profile: p(25, 62, 92, 50, 82, 85, 55, 60),
    weights: { precision: 2.5, systems: 2, exposure: 2 },
    entry: "IUEC apprenticeship, 4 years — competitive application, aptitude test, waitlists are real",
    credential: "Mechanic's license (state-dependent) and QEI certification for inspection work",
    ladder: [
      { years: "0–1", title: "Apprentice, first year", pay: "$44k–$58k", detail: "Hoistway work, material, and learning the equipment inside out." },
      { years: "2–4", title: "Apprentice, upper years", pay: "$62k–$95k", detail: "Installation and adjusting under a mechanic. Pay steps by period." },
      { years: "4–6", title: "Mechanic", pay: "$95k–$135k", detail: "Full scale, one of the highest journey rates in construction." },
      { years: "7–10", title: "Adjuster, supervisor, or inspector", pay: "$120k–$200k+", detail: "Adjusting is the specialty premium; QEI inspection is the exit ramp off the tools." },
    ],
    related: ["electrician", "millwright", "industrial-maintenance-technician"],
  },
  {
    slug: "lineworker",
    name: "Power Lineworker",
    category: "electrical",
    tagline: "The grid, energized, in weather.",
    summary:
      "Lineworkers build and maintain the transmission and distribution system. It is dangerous, weather-driven, and storm work means leaving at short notice for weeks — which is also why the overtime and the pay are what they are.",
    dayToDay: [
      "Climb or bucket up to energized conductors and work them hot or dead",
      "Set poles, pull conductor, and frame crossarms",
      "Restore outages through the night when a storm takes a circuit down",
    ],
    profile: p(98, 85, 65, 32, 65, 95, 78, 55),
    weights: { setting: 3, exposure: 3, exertion: 2 },
    entry: "Lineworker school (15 weeks) then utility or IBEW apprenticeship, 3–4 years",
    credential: "Journeyman lineman card; CDL required",
    ladder: [
      { years: "0–1", title: "Groundman", pay: "$42k–$58k", detail: "Rigging from the ground, running equipment, earning your way up the pole." },
      { years: "2–3", title: "Apprentice lineman", pay: "$60k–$88k", detail: "Climbing and working aloft under a journeyman. Storm work starts." },
      { years: "4–6", title: "Journeyman lineman", pay: "$95k–$140k", detail: "Full scale; storm and outage overtime routinely adds 25–50%." },
      { years: "7–10", title: "Foreman or troubleman", pay: "$125k–$200k+", detail: "Running crews, or working solo as the troubleman who diagnoses the system." },
    ],
    related: ["electrician", "wind-turbine-technician", "crane-operator"],
  },
  {
    slug: "solar-pv-installer",
    name: "Solar PV Installer",
    category: "electrical",
    tagline: "Fastest way onto a roof with an electrical trade under you.",
    summary:
      "PV installers mount arrays and wire the DC and AC sides of solar systems. Entry is genuinely fast, which is the appeal and the catch — the people who do well use it as an on-ramp into a full electrical license rather than an endpoint.",
    dayToDay: [
      "Lay out and mount racking and modules on a roof or a ground array",
      "Land DC strings, inverters, and the AC interconnection",
      "Commission the system and walk the inspector through it",
    ],
    profile: p(88, 68, 65, 45, 68, 82, 78, 82),
    weights: { setting: 2, exposure: 2 },
    entry: "Weeks-to-months entry as an installer; best combined with an electrical apprenticeship",
    credential: "NABCEP PV Installation Professional; electrical license for the AC side in most states",
    ladder: [
      { years: "0–1", title: "Installer", pay: "$36k–$50k", detail: "Racking, module setting, and roof work. Entry is quick." },
      { years: "2–4", title: "Lead installer / crew lead", pay: "$50k–$72k", detail: "Running a crew and the DC side. Electrical apprenticeship pays off here." },
      { years: "4–6", title: "PV electrician / commissioning tech", pay: "$68k–$100k", detail: "Licensed on the AC side, handling service and commissioning." },
      { years: "7–10", title: "Project manager or contractor", pay: "$90k–$150k+", detail: "Running installs at scale, or your own solar contracting license." },
    ],
    related: ["electrician", "roofer", "wind-turbine-technician"],
  },
  {
    slug: "wind-turbine-technician",
    name: "Wind Turbine Technician",
    category: "electrical",
    tagline: "Climb 300 feet, then start the actual job.",
    summary:
      "Wind techs maintain and repair utility-scale turbines — mechanical, hydraulic, and electrical work performed in a nacelle a long way off the ground. It is one of the fastest-growing occupations in the country, and it filters hard for people genuinely fine with height.",
    dayToDay: [
      "Climb or ride up the tower with your tools and your rescue plan",
      "Troubleshoot pitch, yaw, and generator faults from the SCADA down to the component",
      "Perform scheduled service on gearboxes, brakes, and blades",
    ],
    profile: p(88, 72, 75, 18, 82, 98, 52, 25),
    weights: { exposure: 3, systems: 2, setting: 2 },
    entry: "One-year technical certificate or manufacturer training program",
    credential: "GWO safety modules; manufacturer-specific turbine certifications",
    ladder: [
      { years: "0–1", title: "Traveling tech", pay: "$44k–$58k", detail: "On a blade or construction crew, traveling site to site with per diem." },
      { years: "2–4", title: "Site technician", pay: "$58k–$80k", detail: "Assigned to a wind farm, running scheduled and unscheduled maintenance." },
      { years: "4–6", title: "Lead tech / troubleshooter", pay: "$75k–$105k", detail: "The one they call for faults nobody else cleared." },
      { years: "7–10", title: "Site manager or commissioning lead", pay: "$95k–$150k+", detail: "Running a farm's operations, or commissioning new builds." },
    ],
    related: ["lineworker", "industrial-maintenance-technician", "millwright"],
  },
  {
    slug: "automotive-technician",
    name: "Automotive Technician",
    category: "vehicles",
    tagline: "Modern cars are computers you can still fix with your hands.",
    summary:
      "Auto techs diagnose and repair cars and light trucks. The trade has moved sharply toward electronics and diagnostics, and the techs who lean into that — plus EV and ADAS work — separate themselves from the ones still hoping for brake jobs.",
    dayToDay: [
      "Pull codes, then actually diagnose rather than parts-cannon the car",
      "Perform repairs under flat-rate time pressure",
      "Keep up with training as platforms change every model year",
    ],
    profile: p(12, 48, 75, 40, 88, 25, 55, 15),
    weights: { systems: 2.5, setting: 2, creation: 2 },
    entry: "Trade school (1–2 years) or dealer apprenticeship; lube tech entry is common",
    credential: "ASE certifications (A1–A8, plus L1 and EV); manufacturer master certifications",
    ladder: [
      { years: "0–1", title: "Lube / express tech", pay: "$32k–$44k", detail: "Services and basic repairs. Building a tool box, which is a real expense." },
      { years: "2–4", title: "Line technician", pay: "$48k–$72k", detail: "ASE certified, taking real diagnostic work on flat rate." },
      { years: "4–6", title: "Master / diagnostic tech", pay: "$70k–$105k", detail: "Master certified with EV and ADAS. You get the hard cars, which pay." },
      { years: "7–10", title: "Shop foreman or owner", pay: "$85k–$160k+", detail: "Running a shop's technical side, or owning an independent." },
    ],
    related: ["diesel-technician", "aircraft-maintenance-technician", "industrial-maintenance-technician"],
  },
  {
    slug: "diesel-technician",
    name: "Diesel Technician",
    category: "vehicles",
    tagline: "When a truck is down, the money stops for somebody.",
    summary:
      "Diesel techs service heavy trucks, buses, and equipment. The work is bigger and heavier than automotive, the downtime cost is higher, and fleet and dealer positions tend to pay hourly rather than flat rate — which many techs strongly prefer.",
    dayToDay: [
      "Diagnose aftertreatment, fuel, and electrical faults on heavy equipment",
      "Perform in-frame rebuilds and major component replacement",
      "Handle roadside or field service calls on a downed unit",
    ],
    profile: p(35, 70, 72, 35, 78, 35, 55, 15),
    weights: { systems: 2, exertion: 1.5, creation: 2 },
    entry: "Trade school (1–2 years) or fleet apprenticeship",
    credential: "ASE medium/heavy truck series; CDL is a strong add",
    ladder: [
      { years: "0–1", title: "Apprentice / PM tech", pay: "$38k–$52k", detail: "Services, tires, and learning the platforms." },
      { years: "2–4", title: "Diesel technician", pay: "$55k–$78k", detail: "Full diagnostic and repair work, often on a shift premium." },
      { years: "4–6", title: "Master / field service tech", pay: "$72k–$105k", detail: "Mobile service or specialty rebuilds. The truck comes to you or you go to it." },
      { years: "7–10", title: "Shop manager or fleet supervisor", pay: "$90k–$150k+", detail: "Running a fleet's maintenance operation." },
    ],
    related: ["automotive-technician", "heavy-equipment-operator", "industrial-maintenance-technician"],
  },
  {
    slug: "aircraft-maintenance-technician",
    name: "Aircraft Maintenance Technician (A&P)",
    category: "vehicles",
    tagline: "Your signature goes in the logbook.",
    summary:
      "A&P mechanics maintain and repair aircraft under FAA authority. The documentation discipline is unlike any other trade — you are personally certifying airworthiness — and the license is federal, so it travels to every state without re-testing.",
    dayToDay: [
      "Perform inspections and repairs to an approved maintenance manual, exactly",
      "Troubleshoot avionics, hydraulic, and powerplant systems",
      "Document everything, because the paperwork is legally part of the repair",
    ],
    profile: p(25, 48, 95, 22, 82, 48, 42, 18),
    weights: { precision: 3, systems: 2, creation: 1.5 },
    entry: "FAA Part 147 school (18–24 months) or 30 months documented experience",
    credential: "FAA Airframe & Powerplant certificate; Inspection Authorization later",
    ladder: [
      { years: "0–1", title: "Apprentice mechanic", pay: "$42k–$56k", detail: "Working under certificated mechanics while you test for your A&P." },
      { years: "2–4", title: "A&P mechanic", pay: "$58k–$85k", detail: "Line or hangar maintenance. Shift differentials are meaningful." },
      { years: "4–6", title: "Lead / heavy check mechanic", pay: "$78k–$112k", detail: "Major airline or MRO work, or corporate aviation." },
      { years: "7–10", title: "Inspector (IA) or maintenance manager", pay: "$100k–$165k+", detail: "Inspection Authorization, quality assurance, or running a maintenance department." },
    ],
    related: ["automotive-technician", "machinist", "industrial-maintenance-technician"],
  },
  {
    slug: "heavy-equipment-operator",
    name: "Heavy Equipment Operator",
    category: "vehicles",
    tagline: "Move the earth, to grade, the first time.",
    summary:
      "Operators run excavators, dozers, loaders, and graders on site work and civil projects. Good operators are valued for finesse, not speed — hitting grade cleanly without wasting passes is the whole skill, and GPS machine control has raised the bar.",
    dayToDay: [
      "Cut and fill to grade, reading stakes or GPS machine control",
      "Load trucks and move material efficiently all day",
      "Grease, inspect, and nurse equipment so it doesn't go down mid-job",
    ],
    profile: p(95, 42, 72, 28, 45, 45, 68, 82),
    weights: { setting: 3, exertion: 1.5 },
    entry: "Operating Engineers apprenticeship (3–4 years) or heavy equipment school",
    credential: "Journeyman card; CDL; GPS machine control proficiency",
    ladder: [
      { years: "0–1", title: "Apprentice / oiler", pay: "$40k–$55k", detail: "Greasing, servicing, and getting seat time on the easier machines." },
      { years: "2–3", title: "Apprentice operator", pay: "$55k–$80k", detail: "Running production equipment under supervision." },
      { years: "4–6", title: "Journeyman operator", pay: "$72k–$110k", detail: "Finish grading and the machines that need a light touch." },
      { years: "7–10", title: "Grade foreman or superintendent", pay: "$95k–$160k+", detail: "Running the dirt side of a job, or owning equipment yourself." },
    ],
    related: ["crane-operator", "concrete-finisher", "diesel-technician"],
  },
  {
    slug: "crane-operator",
    name: "Crane Operator",
    category: "vehicles",
    tagline: "Everyone on site is watching the load.",
    summary:
      "Crane operators lift and place the heaviest things on a job. It's a low-motion, extremely high-consequence trade — long stretches of concentration, load charts you have to actually understand, and certification that is federally required.",
    dayToDay: [
      "Read load charts and refuse the lift that doesn't work",
      "Place steel, precast, and equipment on signal, smoothly",
      "Assemble, disassemble, and inspect the machine itself",
    ],
    profile: p(92, 35, 85, 40, 52, 78, 58, 78),
    weights: { precision: 2.5, setting: 2.5, exertion: 1.5 },
    entry: "Operating Engineers apprenticeship or crane school plus documented seat hours",
    credential: "NCCCO certification is required by OSHA, by crane type",
    ladder: [
      { years: "0–1", title: "Oiler / apprentice", pay: "$42k–$58k", detail: "Servicing the machine, rigging, and watching every lift." },
      { years: "2–3", title: "Apprentice operator", pay: "$58k–$85k", detail: "Running smaller cranes and building certified hours." },
      { years: "4–6", title: "NCCCO certified operator", pay: "$78k–$118k", detail: "Mobile or tower crane on your own. Tower work carries a premium." },
      { years: "7–10", title: "Lift director or crane superintendent", pay: "$105k–$180k+", detail: "Planning critical lifts and running crane operations for a contractor." },
    ],
    related: ["heavy-equipment-operator", "ironworker", "boilermaker"],
  },
  {
    slug: "mason",
    name: "Mason / Bricklayer",
    category: "structure",
    tagline: "Work that outlives everyone who touched it.",
    summary:
      "Masons lay brick, block, and stone. It is physically hard and genuinely skilled — plumb, level, and consistent joints over a long wall is harder than it looks — and restoration masonry in particular has more demand than qualified people.",
    dayToDay: [
      "Set up line and leads, then lay to them all day",
      "Mix and manage mortar so the wall stays consistent",
      "Cut, point, and finish so the joints read clean",
    ],
    profile: p(85, 88, 78, 25, 12, 55, 62, 92),
    weights: { exertion: 2.5, creation: 2, systems: 1.5 },
    entry: "BAC apprenticeship or contractor training, 3–4 years, paid",
    credential: "No universal license; restoration and refractory specialties certify separately",
    ladder: [
      { years: "0–1", title: "Apprentice / tender", pay: "$34k–$48k", detail: "Mixing, stocking, scaffold, and laying practice wall." },
      { years: "2–3", title: "Apprentice mason", pay: "$48k–$70k", detail: "Laying production work with your leads set by a journeyman." },
      { years: "4–6", title: "Journeyman mason", pay: "$62k–$95k", detail: "Running your own wall. Restoration and stone pay above block." },
      { years: "7–10", title: "Foreman or masonry contractor", pay: "$85k–$150k+", detail: "Running crews, or bidding your own masonry work." },
    ],
    related: ["concrete-finisher", "carpenter", "ironworker"],
  },
  {
    slug: "concrete-finisher",
    name: "Concrete Finisher",
    category: "structure",
    tagline: "The clock starts when the truck does.",
    summary:
      "Finishers place, float, and finish concrete — a trade governed entirely by the set time of the material. You cannot pause, you cannot come back tomorrow, and reading the slab correctly is a judgment skill that takes years.",
    dayToDay: [
      "Place and screed a pour before it gets away from you",
      "Float, trowel, and finish to the specified surface",
      "Cut joints and cure so the slab doesn't crack where it shouldn't",
    ],
    profile: p(92, 92, 72, 22, 10, 35, 65, 90),
    weights: { exertion: 3, setting: 2, systems: 2 },
    entry: "Cement Masons apprenticeship (3 years) or contractor crew entry",
    credential: "ACI Concrete Flatwork Finisher certification",
    ladder: [
      { years: "0–1", title: "Laborer / helper", pay: "$34k–$48k", detail: "Placing, screeding, and learning to read the slab." },
      { years: "2–3", title: "Finisher", pay: "$48k–$70k", detail: "Running a power trowel and finishing your own sections." },
      { years: "4–6", title: "Journeyman finisher", pay: "$62k–$95k", detail: "Decorative, polished, and architectural finishes pay above flatwork." },
      { years: "7–10", title: "Foreman or concrete contractor", pay: "$85k–$150k+", detail: "Running pours, or your own flatwork company." },
    ],
    related: ["mason", "carpenter", "heavy-equipment-operator"],
  },
  {
    slug: "roofer",
    name: "Roofer",
    category: "finish",
    tagline: "The fastest entry on this list, if you can take the roof.",
    summary:
      "Roofers install and repair roofing systems, from shingles to commercial single-ply and metal. Entry is immediate and the money at the low end is better than most unskilled work — but the commercial and low-slope side is where the real career is.",
    dayToDay: [
      "Tear off and dry in before weather finds the opening",
      "Install shingle, membrane, or metal systems to manufacturer spec",
      "Detail flashings and penetrations, which is where roofs actually fail",
    ],
    profile: p(98, 88, 62, 38, 10, 92, 78, 78),
    weights: { setting: 3, exposure: 3, exertion: 2, systems: 1.5 },
    entry: "Direct hire as a helper; formal apprenticeships exist in union markets",
    credential: "Manufacturer certifications (GAF, Carlisle, Firestone) gate commercial warranty work",
    ladder: [
      { years: "0–1", title: "Roofing helper", pay: "$34k–$46k", detail: "Tear-off, loading, and learning to move on a roof." },
      { years: "2–3", title: "Roofer", pay: "$46k–$66k", detail: "Installing on your own. Commercial low-slope pays above residential." },
      { years: "4–6", title: "Lead / commercial roofer", pay: "$62k–$92k", detail: "Certified on manufacturer systems, running detail work and crews." },
      { years: "7–10", title: "Foreman or roofing contractor", pay: "$85k–$160k+", detail: "Roofing has one of the shortest paths to owning your own company." },
    ],
    related: ["solar-pv-installer", "sheet-metal-worker", "glazier"],
  },
  {
    slug: "glazier",
    name: "Glazier",
    category: "finish",
    tagline: "Curtain wall is engineering you install by hand.",
    summary:
      "Glaziers install glass and glazing systems — storefronts, curtain wall, and commercial entrances. It's a precise, heavy, exposed trade, and commercial curtain wall work on high-rises is a genuinely specialized skill.",
    dayToDay: [
      "Set and anchor framing systems plumb and true",
      "Handle and set glass units that are heavy, expensive, and unforgiving",
      "Seal and weatherproof so the building envelope actually performs",
    ],
    profile: p(72, 78, 85, 32, 22, 82, 68, 85),
    weights: { precision: 2, exposure: 2, exertion: 2 },
    entry: "Glaziers apprenticeship (IUPAT), 3–4 years, paid",
    credential: "Journeyman card; NACC certified glazier credential",
    ladder: [
      { years: "0–1", title: "Apprentice glazier", pay: "$36k–$50k", detail: "Material handling, glazing beads, and learning to move glass safely." },
      { years: "2–3", title: "Apprentice, upper years", pay: "$50k–$74k", detail: "Setting storefront and framing under a journeyman." },
      { years: "4–6", title: "Journeyman glazier", pay: "$66k–$98k", detail: "Curtain wall and high-rise work with height premiums." },
      { years: "7–10", title: "Foreman or glazing contractor", pay: "$88k–$150k+", detail: "Running curtain wall crews or a glazing shop." },
    ],
    related: ["ironworker", "carpenter", "roofer"],
  },
  {
    slug: "industrial-painter",
    name: "Painter / Industrial Coatings",
    category: "finish",
    tagline: "Commercial coatings, not a paint roller at the hardware store.",
    summary:
      "The residential end of painting is easy to enter and pays like it. The industrial end — bridge, tank, and marine coatings, surface prep, and containment — is certified, hazardous, well-paid work that almost nobody knows exists.",
    dayToDay: [
      "Prep and blast surfaces to a specified profile before anything gets sprayed",
      "Apply coating systems to a wet and dry film thickness spec",
      "Work inside containment with respiratory protection and monitoring",
    ],
    profile: p(72, 68, 72, 28, 25, 78, 72, 55),
    weights: { exposure: 1.5 },
    entry: "IUPAT apprenticeship (3 years) or direct hire on a residential crew",
    credential: "SSPC/NACE coatings certifications; lead and containment training",
    ladder: [
      { years: "0–1", title: "Apprentice painter", pay: "$32k–$46k", detail: "Prep, masking, and learning spray technique." },
      { years: "2–3", title: "Journeyman painter", pay: "$46k–$68k", detail: "Commercial finishing on your own. Industrial certs open the next tier." },
      { years: "4–6", title: "Industrial coatings applicator", pay: "$65k–$98k", detail: "Bridge, tank, and marine work with hazard and travel premiums." },
      { years: "7–10", title: "Coatings inspector or contractor", pay: "$85k–$145k+", detail: "NACE inspection pays well and gets you out of the containment." },
    ],
    related: ["drywall-finisher", "ironworker", "roofer"],
  },
  {
    slug: "drywall-finisher",
    name: "Drywall & Interior Finisher",
    category: "finish",
    tagline: "Piecework: your speed is literally your paycheck.",
    summary:
      "Finishers hang and tape drywall and build interior systems. Much of it is paid by the piece rather than the hour, which means skilled fast finishers out-earn the hourly trades around them — and slow ones don't.",
    dayToDay: [
      "Hang board to layout, cut tight around every opening",
      "Tape, coat, and sand to a finish level the paint won't betray",
      "Frame metal stud and build ceilings and soffits",
    ],
    profile: p(15, 68, 78, 28, 10, 45, 72, 85),
    weights: { setting: 2, systems: 2, creation: 1.5 },
    entry: "Direct hire as a helper, or a finishers apprenticeship in union markets",
    credential: "No license; Level 4/5 finish quality is the real credential",
    ladder: [
      { years: "0–1", title: "Helper / stocker", pay: "$32k–$46k", detail: "Stocking board, cleanup, and learning to hang." },
      { years: "2–3", title: "Hanger or taper", pay: "$48k–$70k", detail: "On piece rate. Speed and quality both start paying." },
      { years: "4–6", title: "Finisher, Level 5", pay: "$62k–$95k", detail: "High-end finish and specialty ceilings where quality is the spec." },
      { years: "7–10", title: "Foreman or drywall contractor", pay: "$85k–$150k+", detail: "Running crews and bidding by the square foot." },
    ],
    related: ["carpenter", "industrial-painter", "mason"],
  },
  {
    slug: "irrigation-technician",
    name: "Landscape & Irrigation Technician",
    category: "structure",
    tagline: "Outdoors every day, with a real backflow license behind it.",
    summary:
      "Irrigation techs design, install, and service sprinkler and drip systems — plumbing, low-voltage control, and hydraulics, all outside. The certified and backflow-licensed end of this trade is a real career, not seasonal labor.",
    dayToDay: [
      "Trench, run mainline, and set heads to a coverage plan",
      "Troubleshoot valves, controllers, and wiring faults in the ground",
      "Test and certify backflow prevention assemblies",
    ],
    profile: p(98, 62, 62, 68, 52, 30, 72, 68),
    weights: { setting: 3, exposure: 1.5 },
    entry: "Direct hire on a crew; certification programs run months not years",
    credential: "Irrigation Association certifications; state backflow tester license",
    ladder: [
      { years: "0–1", title: "Crew member", pay: "$32k–$44k", detail: "Trenching, install, and learning the hydraulics." },
      { years: "2–3", title: "Irrigation technician", pay: "$44k–$62k", detail: "Running service calls and diagnosing systems yourself." },
      { years: "4–6", title: "Certified tech / backflow tester", pay: "$58k–$85k", detail: "Licensed backflow testing is recurring, required, billable work." },
      { years: "7–10", title: "Designer or contractor", pay: "$75k–$140k+", detail: "System design and commercial contracts, or your own irrigation company." },
    ],
    related: ["plumber", "low-voltage-technician", "heavy-equipment-operator"],
  },
  {
    slug: "fire-sprinkler-fitter",
    name: "Fire Sprinkler Fitter",
    category: "mechanical",
    tagline: "A code-mandated trade with guaranteed recurring work.",
    summary:
      "Sprinkler fitters install and inspect fire suppression systems. The work is required by code in nearly every commercial building and must be inspected on a schedule forever — which makes demand about as stable as any trade gets.",
    dayToDay: [
      "Hang pipe and set heads to an approved hydraulic design",
      "Install risers, valves, and alarm devices, then trip-test them",
      "Perform annual and five-year inspections on existing systems",
    ],
    profile: p(45, 72, 78, 42, 42, 82, 68, 65),
    weights: { exposure: 2, precision: 1.5 },
    entry: "Sprinkler fitters apprenticeship (UA Local 669), 4–5 years, paid",
    credential: "Journeyman card; NICET certification levels I–IV drive pay and design authority",
    ladder: [
      { years: "0–1", title: "Apprentice fitter", pay: "$40k–$54k", detail: "Material, hanging pipe, and learning NFPA 13." },
      { years: "2–4", title: "Apprentice, upper years", pay: "$55k–$82k", detail: "Installing your own systems with supervision; NICET I and II." },
      { years: "4–6", title: "Journeyman fitter", pay: "$72k–$108k", detail: "Full scale on install or inspection. Inspection work is steady year-round." },
      { years: "7–10", title: "Designer (NICET III/IV) or contractor", pay: "$95k–$160k+", detail: "Hydraulic design and plan review, or your own sprinkler company." },
    ],
    related: ["plumber", "pipefitter", "low-voltage-technician"],
  },
  {
    slug: "low-voltage-technician",
    name: "Low-Voltage / Fiber Technician",
    category: "electrical",
    tagline: "The trade closest to IT, with the shortest ramp.",
    summary:
      "Low-voltage techs install structured cabling, fiber, access control, cameras, and building networks. Entry is faster than a full electrical apprenticeship and the work is cleaner and lighter — the ceiling is lower unless you move into fiber splicing, networking, or systems integration.",
    dayToDay: [
      "Pull, terminate, and test copper and fiber runs",
      "Fusion-splice fiber and certify links with an OTDR",
      "Commission cameras, access control, and network gear",
    ],
    profile: p(35, 32, 82, 48, 88, 62, 68, 65),
    weights: { systems: 2.5, exertion: 2, precision: 1.5 },
    entry: "Months-long certificate or direct hire as a cable puller",
    credential: "BICSI Installer/Technician, fiber certifications, CompTIA Network+ for the IT crossover",
    ladder: [
      { years: "0–1", title: "Cable installer", pay: "$34k–$48k", detail: "Pulling and dressing cable, learning to terminate clean." },
      { years: "2–3", title: "Low-voltage technician", pay: "$48k–$70k", detail: "Testing, certifying, and commissioning systems on your own." },
      { years: "4–6", title: "Fiber splicer / systems tech", pay: "$65k–$100k", detail: "Fusion splicing and integration work. Outside plant fiber pays above inside." },
      { years: "7–10", title: "Project manager or integrator", pay: "$85k–$150k+", detail: "Running structured cabling projects, or an integration business." },
    ],
    related: ["electrician", "irrigation-technician", "industrial-maintenance-technician"],
  },
  {
    slug: "boilermaker",
    name: "Boilermaker",
    category: "metal",
    tagline: "Travel, outages, and some of the heaviest money in the trades.",
    summary:
      "Boilermakers build and repair boilers, pressure vessels, and tanks — largely on outage and turnaround schedules at power plants, refineries, and mills. The work is confined, hot, hard, and travel-heavy, and the compensation reflects every bit of that.",
    dayToDay: [
      "Rig and set heavy pressure components inside tight spaces",
      "Weld and fit to code, with inspection on everything you touch",
      "Work planned outages on 6- and 7-day schedules until they're done",
    ],
    profile: p(55, 95, 85, 18, 35, 92, 85, 55),
    weights: { exertion: 3, exposure: 2.5, variety: 2 },
    entry: "Boilermakers apprenticeship, 4 years, paid",
    credential: "Journeyman card plus ASME welding certifications and confined-space training",
    ladder: [
      { years: "0–1", title: "Apprentice", pay: "$42k–$58k", detail: "Rigging, fit-up, and confined space work. Travel starts immediately." },
      { years: "2–4", title: "Apprentice, upper years", pay: "$60k–$92k", detail: "Welding certified and working outages with per diem." },
      { years: "4–6", title: "Journeyman boilermaker", pay: "$85k–$135k", detail: "Outage overtime regularly pushes annual well past base scale." },
      { years: "7–10", title: "Foreman or QA inspector", pay: "$115k–$200k+", detail: "Running outage crews, or moving to inspection and away from the heat." },
    ],
    related: ["welder", "pipefitter", "ironworker"],
  },
];

export const TRADES_BY_SLUG: Record<string, Trade> = Object.fromEntries(
  TRADES.map((t) => [t.slug, t])
);

export function getTrade(slug: string): Trade | undefined {
  return TRADES_BY_SLUG[slug];
}

export function tradesInCategory(category: CategoryId): Trade[] {
  return TRADES.filter((t) => t.category === category);
}
