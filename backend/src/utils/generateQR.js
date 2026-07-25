/**
 * Build the public URL / payload used on printed QR labels.
 * The scannable `code` is normally the artifact slug (e.g. adwa-victory).
 */
export function buildQrUrl(code, { baseUrl = 'https://adwa.nexus' } = {}) {
  const slug = String(code || '')
    .trim()
    .toLowerCase();
  return `${baseUrl.replace(/\/$/, '')}/exhibit/${encodeURIComponent(slug)}?exhibit=${encodeURIComponent(slug)}`;
}

export function normalizeQrPayload(payload) {
  if (!payload) return null;
  const value = String(payload).trim();

  try {
    const url = new URL(value);
    const fromQuery = url.searchParams.get('exhibit') || url.searchParams.get('id');
    if (fromQuery) return fromQuery.toLowerCase();
    const lastSegment = url.pathname.split('/').filter(Boolean).pop();
    if (lastSegment) return lastSegment.toLowerCase();
  } catch {
    /* plain code */
  }

  return value.toLowerCase();
}
