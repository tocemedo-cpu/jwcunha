import CtaBand from '../components/CtaBand';
import PageHeader from '../components/PageHeader';
import Photo from '../components/Photo';
import Seo from '../components/Seo';
import { useI18n } from '../i18n/I18nProvider';

export default function Hse() {
  const { c } = useI18n();
  const h = c.hse;
  return (
    <>
      <Seo title={h.title} />
      <PageHeader kicker={h.kicker} title={h.headline} lead={h.intro} />
      <section className="section section--tight">
        <div className="wrap">
          <Photo name="hse" alt="Worker in PPE at a controlled work location" brief={h.photoBrief} ratio="16/9" />
        </div>
      </section>
      <section className="section" aria-labelledby="pillars-h">
        <div className="wrap">
          <h2 id="pillars-h">{h.pillarsTitle}</h2>
          <dl className="def-grid def-grid--3">
            {h.pillars.map((p) => (
              <div key={p.title}>
                <dt>{p.title}</dt>
                <dd>{p.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="section section--grey" aria-labelledby="docs-h">
        <div className="wrap narrow">
          <h2 id="docs-h">{h.docsTitle}</h2>
          <p className="lead">{h.docsText}</p>
        </div>
      </section>
      <CtaBand title={h.ctaTitle} text={h.ctaText} />
    </>
  );
}
