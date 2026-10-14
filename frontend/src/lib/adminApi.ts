export type RequestStatus = 'NEW' | 'IN_REVIEW' | 'RESPONDED' | 'CLOSED';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED' | 'DISABLED';

export type AdminRequest = {
  id: string;
  fullName: string;
  company: string;
  email: string;
  phone?: string;
  serviceArea: string;
  projectLocation?: string;
  message: string;
  language: string;
  status: RequestStatus;
  notificationStatus: NotificationStatus;
  notifiedAt?: string;
  noteCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Note = { id: string; author: string; body: string; createdAt: string };

export type RequestPage = {
  content: AdminRequest[];
  page: { size: number; number: number; totalElements: number; totalPages: number };
};

export type Filters = { status: string; serviceArea: string; q: string };

export class AuthError extends Error {}
export class ThrottledError extends Error {}
export class NetworkError extends Error {}

const BASE = import.meta.env.VITE_API_BASE ?? '';
const KEY = 'jwc.admin';

/** HTTP Basic header value for the admin API (UTF-8 safe). */
export function basicAuth(user: string, password: string): string {
  const bytes = new TextEncoder().encode(`${user}:${password}`);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return `Basic ${btoa(bin)}`;
}

/** Kept in sessionStorage only: it disappears when the tab is closed. */
export function loadAuth(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}
export function saveAuth(auth: string | null): void {
  try {
    if (auth) sessionStorage.setItem(KEY, auth);
    else sessionStorage.removeItem(KEY);
  } catch {
    /* storage unavailable: the session simply lasts until the page is reloaded */
  }
}

function query(f: Filters, extra: Record<string, string | number> = {}): string {
  const p = new URLSearchParams();
  if (f.status) p.set('status', f.status);
  if (f.serviceArea) p.set('serviceArea', f.serviceArea);
  if (f.q.trim()) p.set('q', f.q.trim());
  Object.entries(extra).forEach(([k, v]) => p.set(k, String(v)));
  const s = p.toString();
  return s ? `?${s}` : '';
}

async function call(auth: string, path: string, init: RequestInit = {}): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(`${BASE}/api/admin/requests${path}`, {
      ...init,
      headers: { Authorization: auth, Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest', ...(init.headers ?? {}) },
    });
  } catch {
    throw new NetworkError();
  }
  if (res.status === 401) throw new AuthError();
  if (res.status === 429) throw new ThrottledError();
  if (!res.ok) throw new NetworkError(`HTTP ${res.status}`);
  return res;
}

export async function getSummary(auth: string): Promise<Record<RequestStatus, number>> {
  return (await call(auth, '/summary')).json();
}

export async function getRequests(auth: string, f: Filters, page: number, size = 20): Promise<RequestPage> {
  return (await call(auth, query(f, { page, size }))).json();
}

export async function setStatus(auth: string, id: string, status: RequestStatus): Promise<AdminRequest> {
  const res = await call(auth, `/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function deleteRequest(auth: string, id: string): Promise<void> {
  await call(auth, `/${id}`, { method: 'DELETE' });
}

export async function exportCsv(auth: string, f: Filters): Promise<Blob> {
  return (await call(auth, `/export.csv${query(f)}`, { headers: { Accept: 'text/csv' } })).blob();
}

export async function getNotes(auth: string, requestId: string): Promise<Note[]> {
  return (await call(auth, `/${requestId}/notes`)).json();
}

export async function addNote(auth: string, requestId: string, body: string): Promise<Note> {
  const res = await call(auth, `/${requestId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  return res.json();
}

export async function deleteNote(auth: string, requestId: string, noteId: string): Promise<void> {
  await call(auth, `/${requestId}/notes/${noteId}`, { method: 'DELETE' });
}
