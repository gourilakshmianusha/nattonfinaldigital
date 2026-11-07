export class AdminApiError extends Error {
  constructor(public status: number, message: string, public code = 'request_failed') { super(message); }
}
export async function request<T = any>(path: string, options: RequestInit & { notifySessionExpired?: boolean } = {}): Promise<T> {
  const { notifySessionExpired = true, ...fetchOptions } = options;
  let response: Response;
  try { response = await fetch(`/api/admin${path}`, { ...fetchOptions, credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-ND-Request': 'admin', ...fetchOptions.headers } }); }
  catch { throw new AdminApiError(503, 'The admin server could not be reached. Check your connection and restart the application if needed.', 'api_unavailable'); }
  if (!response.headers.get('content-type')?.includes('application/json')) throw new AdminApiError(503, 'This host returned a web page instead of the admin API. Restart the updated development or preview server. Published installations must run the Node server.', 'api_unavailable');
  const data = await response.json();
  if (!response.ok) { const error = new AdminApiError(response.status, data.error || 'Request failed.', data.code); if (notifySessionExpired && response.status === 401 && !path.startsWith('/auth/')) window.dispatchEvent(new CustomEvent('nd-admin-session-expired')); throw error; }
  return data;
}
export const mutate = <T = any>(path: string, method: string, data?: unknown) => request<T>(path, { method, ...(data !== undefined ? { body: JSON.stringify(data) } : {}) });
export function navigate(path: string) { const target = path.startsWith('/admin/') ? path : '/admin/dashboard'; window.history.pushState({}, '', target); window.dispatchEvent(new PopStateEvent('popstate')); }
export const label = (value: unknown) => String(value ?? '').replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase());
export const dateTime = (value: string, timezone = 'Asia/Kolkata') => {
 if(!value)return 'Not set';const date=new Date(value);if(!Number.isFinite(date.getTime()))return 'Invalid record time';
 try{return new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short',timeZone:timezone}).format(date);}catch{return new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short',timeZone:'UTC'}).format(date)+' UTC';}
};
