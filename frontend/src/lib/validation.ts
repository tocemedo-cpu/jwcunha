export type FormValues = {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  serviceArea: string;
  projectLocation: string;
  message: string;
  consent: boolean;
  website: string; // honeypot
};

export type FieldErrors = Partial<Record<'fullName' | 'company' | 'email' | 'phone' | 'serviceArea' | 'message' | 'consent', string>>;

export const emptyForm: FormValues = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  serviceArea: '',
  projectLocation: '',
  message: '',
  consent: false,
  website: '',
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[0-9+()\-.\s]*$/;

export type ErrorMessages = {
  fullName: string; company: string; email: string; phone: string; serviceArea: string; message: string; consent: string;
};

/** Mirrors the server-side rules; the server remains the authority. */
export function validate(v: FormValues, m: ErrorMessages): FieldErrors {
  const e: FieldErrors = {};
  if (!v.fullName.trim() || v.fullName.length > 120) e.fullName = m.fullName;
  if (!v.company.trim() || v.company.length > 160) e.company = m.company;
  if (!EMAIL.test(v.email.trim()) || v.email.length > 254) e.email = m.email;
  if (v.phone && (!PHONE.test(v.phone) || v.phone.length > 40)) e.phone = m.phone;
  if (!v.serviceArea) e.serviceArea = m.serviceArea;
  const len = v.message.trim().length;
  if (len < 20 || len > 4000) e.message = m.message;
  if (!v.consent) e.consent = m.consent;
  return e;
}
