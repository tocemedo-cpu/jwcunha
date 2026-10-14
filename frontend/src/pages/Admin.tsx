import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import PageHeader from '../components/PageHeader';
import Seo from '../components/Seo';
import { useI18n } from '../i18n/I18nProvider';
import {
  AuthError,
  ThrottledError,
  basicAuth,
  exportCsv,
  getRequests,
  getSummary,
  loadAuth,
  saveAuth,
  setStatus,
  type AdminRequest,
  type Filters,
  type RequestPage,
  type RequestStatus,
} from '../lib/adminApi';

const STATUSES: RequestStatus[] = ['NEW', 'IN_REVIEW', 'RESPONDED', 'CLOSED'];
const noFilters: Filters = { status: '', serviceArea: '', q: '' };

export default function Admin() {
  const { c } = useI18n();
  const [auth, setAuth] = useState<string | null>(loadAuth);

  // The administration area must never be indexed.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const signOut = useCallback(() => {
    saveAuth(null);
    setAuth(null);
  }, []);

  return (
    <>
      <Seo title={c.admin.title} />
      <PageHeader kicker={c.admin.kicker} title={c.admin.title} />
      <section className="section section--tight">
        <div className="wrap">
          {auth ? (
            <Dashboard auth={auth} onSignOut={signOut} />
          ) : (
            <Login
              onSignedIn={(a) => {
                saveAuth(a);
                setAuth(a);
              }}
            />
          )}
        </div>
      </section>
    </>
  );
}

function Login({ onSignedIn }: { onSignedIn: (auth: string) => void }) {
  const { c } = useI18n();
  const t = c.admin.login;
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const auth = basicAuth(user.trim(), password);
    try {
      await getSummary(auth); // proves the credentials against the real API before keeping them
      onSignedIn(auth);
    } catch (err) {
      setError(err instanceof AuthError ? t.wrong : err instanceof ThrottledError ? t.throttled : t.network);
      setPassword('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-login" onSubmit={submit} aria-label={c.admin.title}>
      <p>{t.intro}</p>
      {error && (
        <p className="form-banner" role="alert">
          {error}
        </p>
      )}
      <div className="field">
        <label htmlFor="a-user">{t.username}</label>
        <input id="a-user" name="username" type="text" autoComplete="username" required value={user} onChange={(e) => setUser(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="a-pass">{t.password}</label>
        <input id="a-pass" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" className="btn btn--primary" disabled={busy}>
        {busy ? t.signingIn : t.submit}
      </button>
    </form>
  );
}

function Dashboard({ auth, onSignOut }: { auth: string; onSignOut: () => void }) {
  const { c, locale } = useI18n();
  const a = c.admin;
  const [filters, setFilters] = useState<Filters>(noFilters);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [data, setData] = useState<RequestPage | null>(null);
  const [summary, setSummary] = useState<Record<RequestStatus, number> | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [openId, setOpenId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [exporting, setExporting] = useState(false);
  const lastLoad = useRef(0);

  // Debounce the text search so each keystroke does not hit the server.
  useEffect(() => {
    const id = setTimeout(() => {
      setFilters((f) => (f.q === search ? f : { ...f, q: search }));
      setPage(0);
    }, 300);
    return () => clearTimeout(id);
  }, [search]);

  const fail = useCallback(
    (err: unknown) => {
      if (err instanceof AuthError) onSignOut(); // password changed or session no longer valid
      else setState('error');
    },
    [onSignOut],
  );

  const refreshSummary = useCallback(() => getSummary(auth).then(setSummary).catch(fail), [auth, fail]);

  useEffect(() => {
    const ticket = ++lastLoad.current;
    setState('loading');
    getRequests(auth, filters, page)
      .then((p) => {
        if (ticket !== lastLoad.current) return; // a newer request already replaced this one
        setData(p);
        setState('ready');
      })
      .catch((err) => ticket === lastLoad.current && fail(err));
  }, [auth, filters, page, fail]);

  useEffect(() => {
    void refreshSummary();
  }, [refreshSummary]);

  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Luanda' }),
    [locale],
  );
  const services = c.contact.form.services;

  async function changeStatus(r: AdminRequest, status: RequestStatus) {
    setNotice('');
    try {
      const saved = await setStatus(auth, r.id, status);
      setData((d) => d && { ...d, content: d.content.map((x) => (x.id === saved.id ? saved : x)) });
      setNotice(a.statusSaved);
      void refreshSummary();
    } catch (err) {
      if (err instanceof AuthError) onSignOut();
      else setNotice(a.saveError);
    }
  }

  async function download() {
    setExporting(true);
    setNotice('');
    try {
      const blob = await exportCsv(auth, filters);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pedidos-de-proposta.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      if (err instanceof AuthError) onSignOut();
      else setNotice(a.exportError);
    } finally {
      setExporting(false);
    }
  }

  const filtered = filters.status || filters.serviceArea || filters.q;
  const total = data?.page.totalElements ?? 0;
  const pages = data?.page.totalPages ?? 0;

  return (
    <div className="admin">
      <div className="admin__bar">
        <ul className="admin__summary" aria-label={a.summaryLabel}>
          {STATUSES.map((s) => (
            <li key={s}>
              <button
                type="button"
                className={filters.status === s ? 'is-active' : undefined}
                aria-pressed={filters.status === s}
                onClick={() => {
                  setFilters((f) => ({ ...f, status: f.status === s ? '' : s }));
                  setPage(0);
                }}
              >
                <span className="admin__count">{summary ? summary[s] : '–'}</span>
                <span>{a.statuses[s]}</span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn--ghost btn--sm" onClick={onSignOut}>
          {a.login.logout}
        </button>
      </div>

      <div className="admin__filters">
        <div className="field">
          <label htmlFor="f-q">{a.filters.search}</label>
          <input id="f-q" type="search" value={search} placeholder={a.filters.searchPlaceholder} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="f-status">{a.filters.status}</label>
          <select id="f-status" value={filters.status} onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setPage(0); }}>
            <option value="">{a.filters.allStatuses}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{a.statuses[s]}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-service">{a.filters.service}</label>
          <select id="f-service" value={filters.serviceArea} onChange={(e) => { setFilters((f) => ({ ...f, serviceArea: e.target.value })); setPage(0); }}>
            <option value="">{a.filters.allServices}</option>
            {Object.entries(services).map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </div>
        <div className="admin__actions">
          {filtered && (
            <button type="button" className="text-link" onClick={() => { setFilters(noFilters); setSearch(''); setPage(0); }}>
              {a.filters.clear}
            </button>
          )}
          <button type="button" className="btn btn--primary btn--sm" onClick={download} disabled={exporting} title={a.exportNote}>
            {exporting ? a.exporting : a.export}
          </button>
        </div>
      </div>

      <p className="admin__notice" role="status" aria-live="polite">{notice}</p>

      {state === 'error' && <p className="form-banner" role="alert">{a.loadError}</p>}

      <div className="admin__tablewrap" aria-busy={state === 'loading'}>
        <table className="admin__table">
          <thead>
            <tr>
              <th scope="col">{a.columns.received}</th>
              <th scope="col">{a.columns.company}</th>
              <th scope="col">{a.columns.contact}</th>
              <th scope="col">{a.columns.service}</th>
              <th scope="col">{a.columns.status}</th>
              <th scope="col"><span className="sr-only">{a.open}</span></th>
            </tr>
          </thead>
          <tbody>
            {data?.content.map((r) => {
              const open = openId === r.id;
              return (
                <RowGroup key={r.id}>
                  <tr className={open ? 'is-open' : undefined}>
                    <td data-label={a.columns.received}>{dateFmt.format(new Date(r.createdAt))}</td>
                    <td data-label={a.columns.company}><strong>{r.company}</strong></td>
                    <td data-label={a.columns.contact}>{r.fullName}<br /><span className="admin__muted">{r.email}</span></td>
                    <td data-label={a.columns.service}>{services[r.serviceArea] ?? r.serviceArea}</td>
                    <td data-label={a.columns.status}>
                      <select
                        className={`admin__status admin__status--${r.status}`}
                        aria-label={`${a.columns.status}: ${r.company}`}
                        value={r.status}
                        onChange={(e) => changeStatus(r, e.target.value as RequestStatus)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{a.statuses[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button type="button" className="text-link" aria-expanded={open} aria-controls={`d-${r.id}`} onClick={() => setOpenId(open ? null : r.id)}>
                        {open ? a.close : a.open}{' '}
                        <span className="sr-only">{r.company}</span>
                      </button>
                    </td>
                  </tr>
                  {open && (
                    <tr className="admin__detail" id={`d-${r.id}`}>
                      <td colSpan={6}>
                        <dl>
                          <dt>{a.detail.message}</dt>
                          <dd className="admin__message">{r.message}</dd>
                          {r.projectLocation && (<><dt>{a.detail.location}</dt><dd>{r.projectLocation}</dd></>)}
                          {r.phone && (<><dt>{a.detail.phone}</dt><dd>{r.phone}</dd></>)}
                          <dt>{a.detail.language}</dt><dd>{r.language.toUpperCase()}</dd>
                          <dt>{a.detail.alert}</dt><dd>{a.alerts[r.notificationStatus]}{r.notifiedAt ? ` · ${dateFmt.format(new Date(r.notifiedAt))}` : ''}</dd>
                          <dt>{a.detail.reference}</dt><dd className="admin__ref">{r.id}</dd>
                        </dl>
                        <a className="btn btn--primary btn--sm" href={`mailto:${r.email}?subject=${encodeURIComponent(`Re: ${c.contact.form.title}`)}`}>
                          {a.detail.reply}
                        </a>
                      </td>
                    </tr>
                  )}
                </RowGroup>
              );
            })}
          </tbody>
        </table>
        {state === 'loading' && !data && <p className="admin__empty">{a.loading}</p>}
        {state === 'ready' && data?.content.length === 0 && <p className="admin__empty">{a.empty}</p>}
      </div>

      {pages > 1 && (
        <nav className="admin__pager" aria-label={a.pagination.page}>
          <button type="button" className="btn btn--ghost btn--sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            {a.pagination.previous}
          </button>
          <span>
            {a.pagination.page} {page + 1} {a.pagination.of} {pages} · {total} {a.pagination.total}
          </span>
          <button type="button" className="btn btn--ghost btn--sm" disabled={page + 1 >= pages} onClick={() => setPage((p) => p + 1)}>
            {a.pagination.next}
          </button>
        </nav>
      )}
    </div>
  );
}

/** A row plus its optional detail row; a fragment with a stable key. */
function RowGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
