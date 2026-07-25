/**
 * Placeholder for visit-completion certificates.
 * Returns a printable payload; PDF rendering can be added later.
 */
export function buildVisitCertificate({ visitorName, profile, completedAt = new Date() }) {
  return {
    title: 'Adwa Nexus Visit Certificate',
    visitorName: visitorName || 'Visitor',
    profile: profile || 'tourist',
    completedAt: completedAt.toISOString(),
    message:
      'Thank you for exploring the Adwa Victory Memorial Museum with Adwa Nexus AI.',
  };
}
