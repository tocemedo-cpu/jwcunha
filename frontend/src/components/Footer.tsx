import { Link } from 'react-router-dom';
import logo from '../assets/brand/logo-light.png';
import { useI18n } from '../i18n/I18nProvider';
import { company } from '../lib/company';

export default function Footer() {
  const { c } = useI18n();
  const services = [c.services.facility, c.services.property, c.services.waste, c.services.supplies];
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__grid">
        <div>
          <img className="site-footer__logo" src={logo} alt={c.site.name} width="900" height="164" />
          <p className="site-footer__tag">{c.footer.tagline}</p>
          <p className="site-footer__id">{company.legalName}<br />NIF {company.taxId}</p>
        </div>
        <nav aria-label={c.footer.servicesTitle}>
          <h2 className="site-footer__h">{c.footer.servicesTitle}</h2>
          <ul>
            {services.map((s) => (
              <li key={s.slug}><Link to={s.path}>{s.navLabel}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label={c.footer.companyTitle}>
          <h2 className="site-footer__h">{c.footer.companyTitle}</h2>
          <ul>
            <li><Link to="/about">{c.nav.about}</Link></li>
            <li><Link to="/sectors">{c.nav.sectors}</Link></li>
            <li><Link to="/hse-quality">{c.nav.hse}</Link></li>
            <li><Link to="/mobilisation">{c.nav.mobilisation}</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="site-footer__h">{c.footer.contactTitle}</h2>
          <ul>
            {company.email && <li><a href={`mailto:${company.email}`}>{company.email}</a></li>}
            <li>{company.address}</li>
            <li><Link to="/contact">{c.nav.cta}</Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap site-footer__legal">
        <p>© {new Date().getFullYear()} {c.site.name}. {c.footer.rights}</p>
        <p>{c.footer.scopeNote}</p>
        <p>{c.footer.privacy}</p>
      </div>
    </footer>
  );
}
