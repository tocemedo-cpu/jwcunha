import CtaBand from '../components/CtaBand';
import PageHeader from '../components/PageHeader';
import Photo from '../components/Photo';
import Seo from '../components/Seo';
import { useI18n } from '../i18n/I18nProvider';

export default function About() {
  const { c } = useI18n();
  const a = c.about;
  return (
    <>
      <Seo title={a.title} />
      <PageHeader kicker={a.kicker} title={a.headline} />
      <section className="section section--tight">
        <div className="wrap split">
          <div className="prose">
            {a.intro.map((p) => <p key={p}>{p}</p>)}
          </div>
          <Photo name="about" brief={a.photoBrief} ratio="3/2" />
        </div>
      </section>
      <section className="section section--grey" aria-labelledby="principles-h">
        <div className="wrap">
          <h2 id="principles-h">{a.principlesTitle}</h2>
          <dl className="def-grid">
            {a.principles.map((p) => (
              <div key={p.title}>
                <dt>{p.title}</dt>
                <dd>{p.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="section" aria-labelledby="scope-h">
        <div className="wrap narrow">
          <h2 id="scope-h">{a.scopeTitle}</h2>
          <p className="lead">{a.scopeText}</p>
        </div>
      </section>
      <CtaBand title={a.ctaTitle} text={a.ctaText} />
    </>
  );
}
