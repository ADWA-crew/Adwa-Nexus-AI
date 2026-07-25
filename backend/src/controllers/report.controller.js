// Reserved for report export (PDF/CSV) — not used by current frontend.
export function notImplemented(req, res) {
  return res.status(501).json({
    success: false,
    data: null,
    error: { message: 'Reports not implemented yet', code: 'NOT_IMPLEMENTED' },
  });
}
