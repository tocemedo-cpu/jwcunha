import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { submitProposal } from '../lib/api';
import { emptyForm, validate, type FieldErrors, type FormValues } from '../lib/validation';

type Phase = { name: 'editing' } | { name: 'sending' } | { name: 'done'; reference: string };

export default function ProposalForm({ initialService = '' }: { initialService?: string }) {
  const { c, locale } = useI18n();
  const f = c.contact.form;
  const [values, setValues] = useState<FormValues>({ ...emptyForm, serviceArea: initialService });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [phase, setPhase] = useState<Phase>({ name: 'editing' });
  const [banner, setBanner] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const set = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const v = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setValues((s) => ({ ...s, [name]: v }));
    if (name in errors) setErrors((s) => ({ ...s, [name]: undefined }));
  };

  const focusFirst = (errs: FieldErrors) => {
    const first = (Object.keys(errs) as (keyof FieldErrors)[]).find((k) => errs[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBanner('');
    const errs = validate(values, f.errors);
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) {
      setBanner(f.errorSummary);
      focusFirst(errs);
      return;
    }
    setPhase({ name: 'sending' });
    const res = await submitProposal(values, locale);
    switch (res.kind) {
      case 'ok':
        setPhase({ name: 'done', reference: res.reference });
        setValues({ ...emptyForm });
        return;
      case 'invalid': {
        const mapped: FieldErrors = {};
        for (const k of Object.keys(f.errors) as (keyof FieldErrors)[]) {
          if (res.errors[k]) mapped[k] = f.errors[k];
        }
        setErrors(mapped);
        setBanner(f.errorSummary);
        focusFirst(mapped);
        break;
      }
      case 'rate-limited':
        setBanner(f.errorRate);
        break;
      case 'network-error':
        setBanner(f.errorNetwork);
        break;
      default:
        setBanner(f.errorServer);
    }
    setPhase({ name: 'editing' });
  }

  if (phase.name === 'done') {
    return (
      <div className="form-success" role="status">
        <h2>{f.successTitle}</h2>
        <p>{f.successText}</p>
        <p className="form-success__ref">{phase.reference}</p>
        <button type="button" className="btn btn--ghost" onClick={() => setPhase({ name: 'editing' })}>
          {f.another}
        </button>
      </div>
    );
  }

  const sending = phase.name === 'sending';
  const field = (name: keyof FieldErrors) => ({
    name,
    id: `f-${name}`,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `e-${name}` : undefined,
  });
  const err = (name: keyof FieldErrors) =>
    errors[name] ? (
      <p className="field__error" id={`e-${name}`}>{errors[name]}</p>
    ) : null;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-label={f.title}>
      {banner && (
        <p className="form-banner" role="alert">{banner}</p>
      )}
      <div className="field">
        <label htmlFor="f-fullName">{f.fullName}</label>
        <input {...field('fullName')} type="text" autoComplete="name" value={values.fullName} onChange={set} maxLength={120} />
        {err('fullName')}
      </div>
      <div className="field">
        <label htmlFor="f-company">{f.company}</label>
        <input {...field('company')} type="text" autoComplete="organization" value={values.company} onChange={set} maxLength={160} />
        {err('company')}
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="f-email">{f.email}</label>
          <input {...field('email')} type="email" autoComplete="email" value={values.email} onChange={set} maxLength={254} />
          {err('email')}
        </div>
        <div className="field">
          <label htmlFor="f-phone">{f.phone}</label>
          <input {...field('phone')} type="tel" autoComplete="tel" value={values.phone} onChange={set} maxLength={40} />
          {err('phone')}
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="f-serviceArea">{f.serviceArea}</label>
          <select {...field('serviceArea')} value={values.serviceArea} onChange={set}>
            <option value="">{f.serviceAreaPlaceholder}</option>
            {Object.entries(f.services).map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
          {err('serviceArea')}
        </div>
        <div className="field">
          <label htmlFor="f-projectLocation">{f.projectLocation}</label>
          <input id="f-projectLocation" name="projectLocation" type="text" value={values.projectLocation} onChange={set} maxLength={160} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="f-message">{f.message}</label>
        <textarea
          {...field('message')}
          rows={7}
          value={values.message}
          onChange={set}
          maxLength={4000}
          aria-describedby={errors.message ? 'e-message' : 'h-message'}
        />
        <p className="field__hint" id="h-message">{f.messageHint}</p>
        {err('message')}
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={set} />
      </div>

      <div className="field field--check">
        <input {...field('consent')} type="checkbox" checked={values.consent} onChange={set} />
        <label htmlFor="f-consent">{f.consent}</label>
        {err('consent')}
      </div>

      <button type="submit" className="btn btn--primary" disabled={sending}>
        {sending ? f.sending : f.submit}
      </button>
    </form>
  );
}
