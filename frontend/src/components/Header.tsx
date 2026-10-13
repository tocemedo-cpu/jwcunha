import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';

export default function Header() {
  const { c, locale, setLocale, available } = useI18n();
  const [open, setOpen] = useState(false);
  const [svc, setSvc] = useState(false);
  const { pathname } = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const services = [c.services.facility, c.services.property, c.services.waste, c.services.supplies];

  useEffect(() => {
    setOpen(false);
    setSvc(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setSvc(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    return () => document.body.classList.remove('no-scroll');
  }, [open]);

  const cls = ({ isActive }: { isActive: boolean }) => (isActive ? 'is-active' : undefined);

  return (
    <header className="site-header">
      <div className="wrap site-header__bar">
        <Link to="/" className="brand" aria-label={`${c.site.name} — ${c.nav.home}`}>
          <span className="brand__mark" aria-hidden="true" />
          <span className="brand__text">
            <span className="brand__name">{c.site.name}</span>
            <span className="brand__sub">{c.site.descriptor}</span>
          </span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? c.nav.close : c.nav.open}</span>
          <span className="menu-toggle__bars" aria-hidden="true" />
        </button>

        <div id="primary-nav" ref={menuRef} className={`nav-panel${open ? ' is-open' : ''}`}>
          <nav aria-label={c.nav.primary}>
            <ul className="nav-list">
              <li><NavLink to="/about" className={cls}>{c.nav.about}</NavLink></li>
              <li className="has-sub">
                <button
                  type="button"
                  className="sub-toggle"
                  aria-expanded={svc}
                  aria-controls="services-sub"
                  onClick={() => setSvc((s) => !s)}
                >
                  {c.nav.services}
                </button>
                <ul id="services-sub" className={`sub-list${svc ? ' is-open' : ''}`}>
                  {services.map((s) => (
                    <li key={s.slug}><NavLink to={s.path} className={cls}>{s.navLabel}</NavLink></li>
                  ))}
                </ul>
              </li>
              <li><NavLink to="/sectors" className={cls}>{c.nav.sectors}</NavLink></li>
              <li><NavLink to="/hse-quality" className={cls}>{c.nav.hse}</NavLink></li>
              <li><NavLink to="/mobilisation" className={cls}>{c.nav.mobilisation}</NavLink></li>
              <li><NavLink to="/contact" className={cls}>{c.nav.contact}</NavLink></li>
            </ul>
          </nav>
          {available.length > 1 && (
            <div className="lang" role="group" aria-label={c.nav.language}>
              {available.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  lang={l.code}
                  className={l.code === locale ? 'is-active' : undefined}
                  aria-pressed={l.code === locale}
                  aria-label={l.label}
                  onClick={() => setLocale(l.code)}
                >
                  {l.code.toUpperCase()}
                </button>
              ))}
            </div>
          )}
          <Link to="/contact" className="btn btn--primary btn--sm">{c.nav.cta}</Link>
        </div>
      </div>
    </header>
  );
}
