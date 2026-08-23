// Central "when does the next cohort start?" helper.
//
// Rule: cohorts always kick off on the 1st of a month. If today's already in
// that month (or past its 1st), roll forward to the next month. So on Aug 12
// we say "1st September"; on Sep 1 we say "1st October".

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

export function nextCohortStart(now: Date = new Date()): Date {
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

/** "1st September" — the form we use in copy. */
export function nextCohortLabel(now: Date = new Date()): string {
  const d = nextCohortStart(now);
  return `${ordinal(d.getDate())} ${MONTHS[d.getMonth()]}`;
}

/** "1st September 2026" — when the year matters (deep in a FAQ answer). */
export function nextCohortLabelLong(now: Date = new Date()): string {
  const d = nextCohortStart(now);
  return `${ordinal(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
