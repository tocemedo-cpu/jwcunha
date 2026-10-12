import { Link } from 'react-router-dom';
import CtaBand from '../components/CtaBand';
import PageHeader from '../components/PageHeader';
import Photo from '../components/Photo';
import Seo from '../components/Seo';
import { useI18n } from '../i18n/I18nProvider';
import type { ServiceContent } from '../content/en';

export default function ServicePage({ service }: { service: ServiceContent }) {
  const { c } = useI18n();
  const others = [c.services.facility, c.services.property, c.services.waste, c.services.supplies].filter(
    (s) => s.slug !== service.slug,
  );
  return (
    <>
      <Seo title={service.title} />
      <PageHeader kicker={service.kicker} title={service.title} lead={service.summary} />
      <section className="section section--tight">
        <div className="wrap split">
          <div className="prose">
            {service.intro.map((p) => <p key={p}>{p}</p>)}
          </div>
          <Photo name={service.photo} alt={`${service.title} on an industrial site`} brief={service.photoBrief} ratio="3/2" />
        </div>
      </section>
      <section className="section section--grey" aria-labelledby="scope-h">
        <div className="wrap split">
          <h2 id="scope-h" className="split__title">{service.scopeTitle}</h2>
          <ul className="ruled-list">
            {service.scope.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section" aria-labelledby="approach-h">
        <div className="wrap split">
          <h2 id="approach-h" className="split__title">{service.approachTitle}</h2>
          <ol className="steps">
            {service.approach.map((a) => <li key={a}>{a}</li>)}
          </ol>
        </div>
      </section>
      <section className="section section--rule" aria-labelledby="related-h">
        <div className="wrap">
          <h2 id="related-h" className="h-sm">{c.services.relatedTitle}</h2>
          <ul className="inline-links">
            {others.map((s) => <li key={s.slug}><Link to={s.path}>{s.title}</Link></li>)}
          </ul>
        </div>
      </section>
      <CtaBand title={c.services.ctaTitle} text={c.services.ctaText} />
    </>
  );
}
