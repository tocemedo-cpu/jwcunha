import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';

export default function CtaBand({ title, text }: { title: string; text: string }) {
  const { c } = useI18n();
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="wrap cta-band__grid">
        <div>
          <h2 id="cta-title">{title}</h2>
          <p>{text}</p>
        </div>
        <Link className="btn btn--light" to="/contact">
          {c.nav.cta}
        </Link>
      </div>
    </section>
  );
}
