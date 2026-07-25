const VISITOR_TYPES = new Set(['tourist', 'research', 'child']);
const AGE_GROUPS = new Set(['under18', 'above18']);
const MINOR_EDUCATION = new Set(['primary', 'highschool']);
const ADULT_EDUCATION = new Set(['university', 'diploma', 'other']);

function isMinorVisitor(visitorType, ageGroup) {
  if (visitorType === 'child') return true;
  if (visitorType === 'research') return false;
  return ageGroup === 'under18';
}

export function validateCreateSession(req) {
  const errors = [];
  const { fullName, visitorType, ageGroup, education } = req.body || {};

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    errors.push({ field: 'fullName', message: 'fullName must be at least 2 characters' });
  }

  if (!visitorType || !VISITOR_TYPES.has(visitorType)) {
    errors.push({ field: 'visitorType', message: 'visitorType must be tourist, research, or child' });
  }

  if (visitorType === 'tourist') {
    if (!ageGroup || !AGE_GROUPS.has(ageGroup)) {
      errors.push({ field: 'ageGroup', message: 'ageGroup is required for tourists' });
    }
  } else if (ageGroup != null && ageGroup !== '' && !AGE_GROUPS.has(ageGroup)) {
    errors.push({ field: 'ageGroup', message: 'ageGroup must be under18 or above18' });
  }

  if (!education || typeof education !== 'string') {
    errors.push({ field: 'education', message: 'education is required' });
  } else if (visitorType && VISITOR_TYPES.has(visitorType)) {
    const allowed = isMinorVisitor(visitorType, ageGroup)
      ? MINOR_EDUCATION
      : ADULT_EDUCATION;
    if (!allowed.has(education)) {
      errors.push({ field: 'education', message: 'education is not valid for this visitor type' });
    }
  }

  return errors;
}
