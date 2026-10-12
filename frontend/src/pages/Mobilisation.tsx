import CtaBand from '../components/CtaBand';
import PageHeader from '../components/PageHeader';
import Photo from '../components/Photo';
import Seo from '../components/Seo';
import { useI18n } from '../i18n/I18nProvider';

export default function Mobilisation() {
  const { c } = useI18n();
  const m = c.mobilisation;
  return (
    <>
      <Seo title={m.title} />
      <PageHeader kicker={m.kicker} title={m.headline} lead={m.intro} />
      <section className="section section--tight">
        <div className="wrap">
          <Photo name="mobilisation" alt="Vehicles and crew arriving at a site gate" brief={m.photoBrief} ratio="16/9" />
        </div>
      </section>
      <section className="section" aria-labelledby="steps-h">
        <div className="wrap split">
          <h2 id="steps-h" className="split__title">{m.stepsTitle}</h2>
          <ol className="timeline">
            {m.steps.map((s, i) => (
              <li key={s.title}>
                <span className="timeline__n" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section section--grey" aria-labelledby="inputs-h">
        <div className="wrap split">
          <h2 id="inputs-h" className="split__title">{m.inputsTitle}</h2>
          <ul className="check-list">
            {m.inputs.map((i) => <li key={i}>{i}</li>)}
          </ul>
        </div>
      </section>
      <CtaBand title={m.ctaTitle} text={m.ctaText} />
    </>
  );
}
