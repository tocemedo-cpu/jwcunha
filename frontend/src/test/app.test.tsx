import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { I18nProvider } from '../i18n/I18nProvider';
import { emptyForm, validate } from '../lib/validation';
import { en } from '../content/en';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <I18nProvider>
        <App />
      </I18nProvider>
    </MemoryRouter>,
  );
}

afterEach(() => vi.restoreAllMocks());

describe('routing', () => {
  it.each([
    ['/', /We care for spaces/i],
    ['/about', /practical partner/i],
    ['/services/facility-management', /Facility Management/],
    ['/services/property-management', /Property Management/],
    ['/services/waste-management', /Waste Management/],
    ['/services/supplies-procurement', /Products & Supplies/],
    ['/sectors', /environments where continuity/i],
    ['/hse-quality', /planned and controlled/i],
    ['/mobilisation', /defined path/i],
    ['/contact', /Tell us about your site/i],
  ])('renders %s', (path, heading) => {
    renderAt(path);
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
  });

  it('shows the 404 page for unknown routes', () => {
    renderAt('/does-not-exist');
    expect(screen.getByRole('heading', { level: 1, name: /does not exist/i })).toBeInTheDocument();
  });

  it('toggles the mobile menu', async () => {
    renderAt('/');
    const toggle = screen.getByRole('button', { name: /open menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('validation', () => {
  it('flags every required field', () => {
    const e = validate(emptyForm, en.contact.form.errors);
    expect(Object.keys(e).sort()).toEqual(['company', 'consent', 'email', 'fullName', 'message', 'serviceArea']);
  });
  it('accepts a complete form', () => {
    const e = validate(
      { ...emptyForm, fullName: 'A B', company: 'C', email: 'a@b.co', serviceArea: 'OTHER', message: 'x'.repeat(25), consent: true },
      en.contact.form.errors,
    );
    expect(e).toEqual({});
  });
});

async function fillValid() {
  const u = userEvent.setup();
  await u.type(screen.getByLabelText(/full name/i), 'Ana Silva');
  await u.type(screen.getByRole('textbox', { name: /^company$/i }), 'Example Energy');
  await u.type(screen.getByLabelText(/work email/i), 'ana@example.com');
  await u.selectOptions(screen.getByLabelText(/service of interest/i), 'FACILITY_MANAGEMENT');
  await u.type(screen.getByLabelText(/describe the requirement/i), 'We need integrated facility management.');
  await u.click(screen.getByRole('checkbox'));
  return u;
}

describe('proposal form', () => {
  it('blocks submission and shows errors when invalid', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    renderAt('/contact');
    await userEvent.click(screen.getByRole('button', { name: /send request/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/correct the highlighted/i);
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('aria-invalid', 'true');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('confirms success only after a 201 response with a reference', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ reference: 'abc-123' }), { status: 201 }));
    renderAt('/contact');
    const u = await fillValid();
    await u.click(screen.getByRole('button', { name: /send request/i }));
    const status = await screen.findByRole('status');
    expect(within(status).getByText('abc-123')).toBeInTheDocument();
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body).toMatchObject({ email: 'ana@example.com', serviceArea: 'FACILITY_MANAGEMENT', consent: true, website: '' });
  });

  it('never shows success when the server fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 503 }));
    renderAt('/contact');
    const u = await fillValid();
    await u.click(screen.getByRole('button', { name: /send request/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not be saved/i);
    expect(screen.queryByText(/request received/i)).not.toBeInTheDocument();
  });

  it('never shows success on a network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('offline'));
    renderAt('/contact');
    const u = await fillValid();
    await u.click(screen.getByRole('button', { name: /send request/i }));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/could not reach the server/i));
    expect(screen.queryByText(/request received/i)).not.toBeInTheDocument();
  });
});
