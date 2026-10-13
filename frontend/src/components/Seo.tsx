import { useEffect } from 'react';
import { useI18n } from '../i18n/I18nProvider';

export default function Seo({ title }: { title?: string }) {
  const { c } = useI18n();
  useEffect(() => {
    document.title = title ? `${title} | ${c.site.name}` : `${c.site.name} — ${c.site.descriptor}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', c.site.metaDescription);
  }, [title, c]);
  return null;
}
