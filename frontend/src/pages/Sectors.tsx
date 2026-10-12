import CtaBand from '../components/CtaBand';
import PageHeader from '../components/PageHeader';
import Photo from '../components/Photo';
import Seo from '../components/Seo';
import { useI18n } from '../i18n/I18nProvider';

export default function Sectors() {
  const { c } = useI18n();
  const s = c.sectors;
  return (
    <>
      <Seo title={s.title} />
      <PageHeader kicker={s.kicker} title={s.headline} lead={s.intro} />
      <section className="section section--tight">
        <div className="wrap">
          <Photo name="sectors" alt="Industrial facility with tanks and pipework" brief={s.photoBrief} ratio="16/9" />
        </div>
      </section>
      <section className="section" aria-label={s.title}>
        <div className="wrap">
          <ul className="ruled-list ruled-list--wide">
            {s.list.map((i) => (
              <li key={i.title}>
                <h3>{i.title}</h3>
                <p>{i.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section section--grey">
        <div className="wrap narrow">
          <h2 className="h-sm">{s.noteTitle}</h2>
          <p>{s.note}</p>
        </div>
      </section>
      <CtaBand title={c.about.ctaTitle} text={c.about.ctaText} />
    </>
  );
}
