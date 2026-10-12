import type { FormValues } from './validation';

const BASE = import.meta.env.VITE_API_BASE ?? '';

export type SubmitResult =
  | { kind: 'ok'; reference: string }
  | { kind: 'invalid'; errors: Record<string, string> }
  | { kind: 'rate-limited' }
  | { kind: 'server-error' }
  | { kind: 'network-error' };

/** Success is reported only when the API answers 201 with a reference, i.e. after the row is committed. */
export async function submitProposal(v: FormValues, language: string): Promise<SubmitResult> {
  let res: Response;
  try {
    res = await fetch(`${BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        fullName: v.fullName.trim(),
        company: v.company.trim(),
        email: v.email.trim(),
        phone: v.phone.trim() || null,
        serviceArea: v.serviceArea,
        projectLocation: v.projectLocation.trim() || null,
        message: v.message.trim(),
        consent: v.consent,
        language,
        website: v.website,
      }),
    });
  } catch {
    return { kind: 'network-error' };
  }
  if (res.status === 201) {
    try {
      const body = (await res.json()) as { reference?: string };
      if (body.reference) return { kind: 'ok', reference: body.reference };
    } catch {
      /* fall through */
    }
    return { kind: 'server-error' };
  }
  if (res.status === 400) {
    try {
      const body = (await res.json()) as { errors?: Record<string, string> };
      return { kind: 'invalid', errors: body.errors ?? {} };
    } catch {
      return { kind: 'server-error' };
    }
  }
  if (res.status === 429) return { kind: 'rate-limited' };
  return { kind: 'server-error' };
}
