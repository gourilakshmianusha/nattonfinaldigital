export async function captureNewAdminLead(payload: { name: string; email: string; phone: string; service: string; message: string; consent: boolean }, idempotencyKey: string): Promise<void> {
  // This optional destination supplements, and never replaces, the existing form handler.
  if (!idempotencyKey) return;
  try {
    const capabilities = await fetch('/api/public/admin-capabilities', { cache: 'no-store' });
    if (!capabilities.ok || !capabilities.headers.get('content-type')?.includes('application/json')) return;
    const config = await capabilities.json(); if (!config.leadIngestionEnabled) return;
    const result = await fetch('/api/public/leads', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-ND-Request': 'admin' }, body: JSON.stringify({ ...payload, idempotencyKey }) });
    if (!result.ok) console.warn('Supplemental CRM capture is unavailable; the primary form destination is unchanged.');
  } catch { console.warn('Supplemental CRM capture is unavailable; the primary form destination is unchanged.'); }
}
