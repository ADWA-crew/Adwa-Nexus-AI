export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const LANGUAGES = {
  EN: 'en',
  AM: 'am',
};

/* Single source of truth for every language switcher in the app */
export const LANGUAGE_OPTIONS = [
  { code: 'EN', value: 'en', label: 'English' },
  { code: 'አማ', value: 'am', label: 'አማርኛ' },
  { code: 'FR', value: 'fr', label: 'Français' },
  { code: 'DE', value: 'de', label: 'Deutsch' },
];

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

/* ── Visitor personalization ─────────────────────────────── */

export const VISITOR_TYPES = [
  { value: 'tourist',  label: 'Tourist',      hint: 'Exploring for leisure and discovery' },
  { value: 'research', label: 'For Research', hint: 'Academic or professional study' },
  { value: 'child',    label: 'Child',        hint: 'A young explorer under 18' },
];

export const AGE_GROUPS = [
  { value: 'under18', label: 'Under 18' },
  { value: 'above18', label: 'Above 18' },
];

export const MINOR_EDUCATION = [
  { value: 'primary',    label: 'Primary School' },
  { value: 'highschool', label: 'High School' },
];

export const ADULT_EDUCATION = [
  { value: 'university', label: 'University Degree' },
  { value: 'diploma',    label: 'Diploma' },
  { value: 'other',      label: 'Other' },
];

/**
 * Only the Tourist type exposes an age selector, so Child is treated as
 * inherently under 18 and Research as inherently an adult.
 */
export const isMinorVisitor = (visitorType, ageGroup) => {
  if (visitorType === 'child') return true;
  if (visitorType === 'research') return false;
  return ageGroup === 'under18';
};

export const getEducationOptions = (visitorType, ageGroup) =>
  isMinorVisitor(visitorType, ageGroup) ? MINOR_EDUCATION : ADULT_EDUCATION;

/* ── Feature switches ────────────────────────────────────
   QR is the only way into an exhibit for this milestone. The
   browsing options stay in the codebase behind these flags. */

export const FEATURES = {
  exhibitPicker: false,
  manualCode: false,
};

/* ── Where each profile lands after personalization ──────── */

export const VISITOR_ROUTES = {
  minor: '/child',
  research: '/researcher',
  tourist: '/tourist',
};

/**
 * Minors always get the child experience, even when they signed up as a
 * tourist, so the reading level matches the audience.
 */
export const getVisitorRoute = (visitorType, ageGroup) => {
  if (isMinorVisitor(visitorType, ageGroup)) return VISITOR_ROUTES.minor;
  if (visitorType === 'research') return VISITOR_ROUTES.research;
  return VISITOR_ROUTES.tourist;
};
