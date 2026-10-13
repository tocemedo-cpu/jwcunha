import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';
import { en } from '../content/en';
import { pt } from '../content/pt';
import { I18nProvider } from '../i18n/I18nProvider';

// Technical fields that are intentionally inherited from English.
const INHERITED = new Set(['slug', 'path', 'photo', 'serviceArea']);

function missing(base: unknown, over: unknown, path: string): string[] {
  if (typeof base === 'string') return typeof over === 'string' && over.trim() ? [] : [path];
  if (Array.isArray(base)) {
    if (!Array.isArray(over) || over.length !== base.length) return [path];
    return base.flatMap((b, i) => missing(b, over[i], `${path}[${i}]`));
  }
  if (base && typeof base === 'object') {
    return Object.keys(base).flatMap((k) =>
      INHERITED.has(k) ? [] : missing((base as Record<string, unknown>)[k], (over as Record<string, unknown> | undefined)?.[k], `${path}.${k}`),
    );
  }
  return [];
}

describe('Portuguese translation', () => {
  it('covers every English string (no silent fallbacks)', () => {
    expect(missing(en, pt, 'pt')).toEqual([]);
  });
});

function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <I18nProvider>
        <App />
      </I18nProvider>
    </MemoryRouter>,
  );
}

describe('language switcher', () => {
  beforeEach(() => localStorage.clear());

  it('switches the whole page to Portuguese, sets <html lang> and remembers the choice', async () => {
    renderApp('/contact');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/tell us about your site/i);
    await userEvent.click(screen.getByRole('button', { name: 'Português' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/fale-nos do seu local/i);
    expect(screen.getByRole('button', { name: /enviar pedido/i })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('pt');
    expect(localStorage.getItem('jwc.locale')).toBe('pt');
  });

  it('uses the saved language on the next visit and translates service pages', () => {
    localStorage.setItem('jwc.locale', 'pt');
    renderApp('/services/waste-management');
    expect(screen.getByRole('heading', { level: 1, name: 'Waste Management' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Âmbito habitual' })).toBeInTheDocument();
    expect(screen.getByText(/mapa de resíduos e comprovativos de destino/)).toBeInTheDocument();
  });

  it('shows the form validation messages in Portuguese', async () => {
    localStorage.setItem('jwc.locale', 'pt');
    renderApp('/contact');
    await userEvent.click(screen.getByRole('button', { name: /enviar pedido/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/corrija os campos/i);
    expect(screen.getByText('Indique o seu nome completo.')).toBeInTheDocument();
  });
});
