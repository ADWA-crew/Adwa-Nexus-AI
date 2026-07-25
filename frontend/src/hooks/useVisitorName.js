import { useVisitor } from './useVisitor';

/**
 * First name for greetings, resolved from the personalization session,
 * then a ?visitor= link parameter, then a neutral fallback.
 */
export const useVisitorName = (fallback = 'Guest') => {
  const context = useVisitor();
  const sessionName =
    context?.visitor?.fullName || context?.visitor?.name;

  const params =
    typeof window === 'undefined'
      ? null
      : new URLSearchParams(window.location.search);
  const linkName = params?.get('visitor') || params?.get('name');

  const resolved = sessionName || linkName;
  return resolved ? resolved.trim().split(/\s+/)[0] : fallback;
};
