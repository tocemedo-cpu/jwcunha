import { Link } from 'react-router-dom';
import CtaBand from '../components/CtaBand';
import Photo from '../components/Photo';
import Seo from '../components/Seo';
import { useI18n } from '../i18n/I18nProvider';

export default function Home() {
  const { c } = useI18n();
  const h = c.home;
  const services = [c.services.facility, c.services.property, c.services.waste, c.services.supplies];
  return (
    <>
      <Seo />
      <section className="hero">
        <div className="wrap hero__grid">
          <div className="hero__copy">
            <p className="kicker kicker--light">{h.kicker}</p>
            <h1>{h.headline}</h1>
            <p className="lead lead--light">{h.lead}</p>
            <div className="hero__actions">
              <Link to="/contact" className="btn btn--accent">{h.primaryCta}</Link>
              <Link to="/mobilisation" className="link-light">{h.secondaryCta} →</Link>
            </div>
          </div>
          <Photo name="home-hero" brief={h.photoBrief} ratio="4/5" className="hero__photo" priority caption={h.photoCaption} />
        </div>
      </section>

      <section className="section" aria-labelledby="services-h">
        <div className="wrap split">
          <div className="split__head">
            <h2 id="services-h">{h.servicesTitle}</h2>
            <p>{h.servicesLead}</p>
          </div>
          <ol className="index-list">
            {services.map((s, i) => (
              <li key={s.slug}>
                <span className="index-list__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3><Link to={s.path}>{s.title}</Link></h3>
                  <p>{s.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--grey" aria-labelledby="aud-h">
        <div className="wrap split split--reverse">
          <div className="split__head">
            <h2 id="aud-h">{h.audienceTitle}</h2>
            <p>{h.audienceText}</p>
            <Link className="text-link" to="/sectors">{h.audienceLink} →</Link>
          </div>
          <ul className="plain-list">
            {c.sectors.list.map((s) => (
              <li key={s.title}>{s.title}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="eng-h">
        <div className="wrap narrow">
          <h2 id="eng-h">{h.engageTitle}</h2>
          <p className="lead">{h.engageText}</p>
          <Link className="text-link" to="/mobilisation">{h.engageLink} →</Link>
        </div>
      </section>

      <section className="statement" aria-labelledby="hse-h">
        <div className="wrap statement__grid">
          <h2 id="hse-h">{h.hseTitle}</h2>
          <div>
            <p>{h.hseText}</p>
            <Link className="link-light" to="/hse-quality">{h.hseLink} →</Link>
          </div>
        </div>
      </section>

      <CtaBand title={c.about.ctaTitle} text={c.about.ctaText} />
    </>
  );
}
