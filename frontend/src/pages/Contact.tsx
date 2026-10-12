import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ProposalForm from '../components/ProposalForm';
import Seo from '../components/Seo';
import { useI18n } from '../i18n/I18nProvider';
import { company } from '../lib/company';

export default function Contact() {
  const { c } = useI18n();
  const ct = c.contact;
  const [params] = useSearchParams();
  const requested = params.get('service') ?? '';
  const initial = requested in ct.form.services ? requested : '';
  const hasDetails = company.email || company.phone || company.address;
  return (
    <>
      <Seo title={ct.title} />
      <PageHeader kicker={ct.kicker} title={ct.headline} lead={ct.intro} />
      <section className="section section--tight">
        <div className="wrap contact-grid">
          <div className="form-panel">
            <h2 className="h-sm">{ct.form.title}</h2>
            <ProposalForm initialService={initial} />
          </div>
          <aside aria-labelledby="details-h" className="contact-aside">
            <h2 id="details-h" className="h-sm">{ct.detailsTitle}</h2>
            <p className="strong">{c.site.name}</p>
            {hasDetails ? (
              <dl className="details">
                {company.email && (<><dt>{ct.email}</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd></>)}
                {company.phone && (<><dt>{ct.phone}</dt><dd><a href={`tel:${company.phone.replace(/[^+\d]/g, '')}`}>{company.phone}</a></dd></>)}
                {company.address && (<><dt>{ct.address}</dt><dd>{company.address}</dd></>)}
              </dl>
            ) : (
              <p>{ct.detailsMissing}</p>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
