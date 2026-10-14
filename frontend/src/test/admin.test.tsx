import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { I18nProvider } from '../i18n/I18nProvider';
import { basicAuth } from '../lib/adminApi';

const row = (over: Record<string, unknown> = {}) => ({
  id: '11111111-1111-1111-1111-111111111111',
  fullName: 'Ana Silva',
  company: 'Alfa Energia',
  email: 'ana@alfa.ao',
  phone: '+244 900 000 000',
  serviceArea: 'WASTE_MANAGEMENT',
  projectLocation: 'Cabinda',
  message: 'Precisamos de uma proposta para resíduos.',
  language: 'pt',
  status: 'NEW',
  notificationStatus: 'SENT',
  notifiedAt: '2026-10-14T08:00:00Z',
  createdAt: '2026-10-14T07:59:00Z',
  updatedAt: '2026-10-14T07:59:00Z',
  ...over,
});
const page = (content: unknown[]) => ({ content, page: { size: 20, number: 0, totalElements: content.length, totalPages: 1 } });
const summary = { NEW: 1, IN_REVIEW: 0, RESPONDED: 0, CLOSED: 0 };

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

function renderAdmin() {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <I18nProvider>
        <App />
      </I18nProvider>
    </MemoryRouter>,
  );
}

async function signIn(user = 'admin', password = 'secret-password-1') {
  const u = userEvent.setup();
  await u.type(screen.getByLabelText(/utilizador|username/i), user);
  await u.type(screen.getByLabelText(/palavra-passe|password/i), password);
  await u.click(screen.getByRole('button', { name: /entrar|sign in/i }));
  return u;
}

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  localStorage.setItem('jwc.locale', 'pt');
});
afterEach(() => vi.restoreAllMocks());

describe('admin page', () => {
  it('asks for credentials and never keeps wrong ones', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 401 }));
    renderAdmin();
    await signIn('admin', 'wrong');
    expect(await screen.findByRole('alert')).toHaveTextContent(/incorrectos/i);
    expect(sessionStorage.getItem('jwc.admin')).toBeNull();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('tells the user when too many attempts were made', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 429 }));
    renderAdmin();
    await signIn();
    expect(await screen.findByRole('alert')).toHaveTextContent(/demasiadas tentativas/i);
  });

  it('signs in with HTTP Basic and lists the requests with the status summary', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      const u = String(url);
      if (u.includes('/summary')) return json(summary);
      return json(page([row()]));
    });
    renderAdmin();
    await signIn('admin', 'secret-password-1');

    expect(await screen.findByText('Alfa Energia', { selector: 'strong' })).toBeInTheDocument();
    const auth = basicAuth('admin', 'secret-password-1');
    expect(sessionStorage.getItem('jwc.admin')).toBe(auth);
    const headers = (fetchMock.mock.calls[0][1] as RequestInit).headers as Record<string, string>;
    expect(headers.Authorization).toBe(auth);
    const counters = within(screen.getByRole('list', { name: /pedidos por estado/i }));
    expect(counters.getByRole('button', { name: /novo/i })).toHaveTextContent('1');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toContain('noindex');
  });

  it('shows the message and a reply link, and changes the status through the API', async () => {
    sessionStorage.setItem('jwc.admin', basicAuth('admin', 'secret-password-1'));
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      const u = String(url);
      if (u.includes('/summary')) return json(summary);
      if (u.includes('/status')) return json(row({ status: 'RESPONDED' }));
      return json(page([row()]));
    });
    renderAdmin();
    const u = userEvent.setup();
    await screen.findByText('Alfa Energia', { selector: 'strong' });

    await u.click(screen.getByRole('button', { name: /abrir alfa energia/i }));
    expect(screen.getByText(/Precisamos de uma proposta para resíduos/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /responder por email/i })).toHaveAttribute('href', expect.stringContaining('mailto:ana@alfa.ao'));
    expect(screen.getByText(/aviso por email enviado/i)).toBeInTheDocument();

    await u.selectOptions(screen.getByRole('combobox', { name: /estado: alfa energia/i }), 'RESPONDED');
    await waitFor(() => {
      const patch = fetchMock.mock.calls.find(([, init]) => (init as RequestInit | undefined)?.method === 'PATCH');
      expect(patch).toBeTruthy();
      expect(String(patch![0])).toContain('/11111111-1111-1111-1111-111111111111/status');
      expect(JSON.parse((patch![1] as RequestInit).body as string)).toEqual({ status: 'RESPONDED' });
    });
    expect(await screen.findByText(/estado actualizado/i)).toBeInTheDocument();
  });

  it('does not pretend a status change worked when the server refuses it', async () => {
    sessionStorage.setItem('jwc.admin', basicAuth('admin', 'secret-password-1'));
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      const u = String(url);
      if (u.includes('/summary')) return json(summary);
      if (u.includes('/status')) return new Response('{}', { status: 500 });
      return json(page([row()]));
    });
    renderAdmin();
    const u = userEvent.setup();
    await screen.findByText('Alfa Energia', { selector: 'strong' });
    await u.selectOptions(screen.getByRole('combobox', { name: /estado: alfa energia/i }), 'CLOSED');
    expect(await screen.findByText(/nada foi alterado/i)).toBeInTheDocument();
    expect(screen.queryByText(/estado actualizado/i)).not.toBeInTheDocument();
  });

  it('sends the search and filters to the server and exports with the same filters', async () => {
    sessionStorage.setItem('jwc.admin', basicAuth('admin', 'secret-password-1'));
    const urls: string[] = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      const u = String(url);
      urls.push(u);
      if (u.includes('/summary')) return json(summary);
      if (u.includes('export.csv')) return new Response('﻿csv', { status: 200 });
      return json(page([row()]));
    });
    const createUrl = vi.fn(() => 'blob:x');
    Object.assign(URL, { createObjectURL: createUrl, revokeObjectURL: vi.fn() });
    renderAdmin();
    const u = userEvent.setup();
    await screen.findByText('Alfa Energia', { selector: 'strong' });

    await u.type(screen.getByLabelText(/pesquisar/i), 'alfa');
    await waitFor(() => expect(urls.some((x) => x.includes('q=alfa'))).toBe(true));
    await u.selectOptions(screen.getByLabelText(/^estado$/i), 'NEW');
    await waitFor(() => expect(urls.some((x) => x.includes('q=alfa') && x.includes('status=NEW'))).toBe(true));

    await u.click(screen.getByRole('button', { name: /exportar csv/i }));
    await waitFor(() => expect(createUrl).toHaveBeenCalled());
    const exportUrl = urls.find((x) => x.includes('export.csv'))!;
    expect(exportUrl).toContain('q=alfa');
    expect(exportUrl).toContain('status=NEW');
  });

  it('signs out when the server no longer accepts the saved credentials', async () => {
    sessionStorage.setItem('jwc.admin', basicAuth('admin', 'old-password-1'));
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 401 }));
    renderAdmin();
    expect(await screen.findByRole('button', { name: /entrar/i })).toBeInTheDocument();
    expect(sessionStorage.getItem('jwc.admin')).toBeNull();
  });

  it('terminates the session on request', async () => {
    sessionStorage.setItem('jwc.admin', basicAuth('admin', 'secret-password-1'));
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => json(String(url).includes('/summary') ? summary : page([row()])));
    renderAdmin();
    const u = userEvent.setup();
    await screen.findByText('Alfa Energia', { selector: 'strong' });
    await u.click(screen.getByRole('button', { name: /terminar sessão/i }));
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    expect(sessionStorage.getItem('jwc.admin')).toBeNull();
  });
});
