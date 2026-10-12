import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Seo from '../components/Seo';
import { useI18n } from '../i18n/I18nProvider';

export default function NotFound() {
  const { c } = useI18n();
  return (
    <>
      <Seo title={c.notFound.title} />
      <PageHeader kicker="404" title={c.notFound.headline} lead={c.notFound.text} />
      <section className="section section--tight">
        <div className="wrap">
          <Link className="btn btn--primary" to="/">{c.notFound.home}</Link>
        </div>
      </section>
    </>
  );
}
