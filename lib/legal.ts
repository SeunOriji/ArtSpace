/** Bump whenever content/terms.md changes in a way users must re-accept. */
export const TERMS_VERSION = "1.0";

/** Terms §2.1: every user must be at least 18. */
export const MIN_AGE = 18;

/** Whole years between a YYYY-MM-DD date of birth and `today`; NaN if the date is invalid. */
export function ageOn(dob: string, today: Date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return NaN;
  const birth = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return NaN;
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}
