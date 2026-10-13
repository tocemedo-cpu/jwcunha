import { useI18n } from '../i18n/I18nProvider';
import { illustrativePhotos } from '../lib/photos';

type Props = {
  name: string;
  brief: string;
  ratio?: '16/9' | '4/3' | '3/2' | '4/5';
  className?: string;
  priority?: boolean;
};

const files = import.meta.glob('../assets/photos/*.{jpg,jpeg,webp,png,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

function find(name: string): string | undefined {
  const key = Object.keys(files).find((k) => new RegExp(`/${name}\\.[a-z]+$`).test(k));
  return key ? files[key] : undefined;
}

/**
 * Editorial photograph. Real photography is dropped into src/assets/photos/<name>.jpg (see the README for the
 * shot list). Until then a neutral tonal plate keeps the layout intact; in development it also shows the brief.
 */
export default function Photo({ name, brief, ratio = '3/2', className = '', priority = false }: Props) {
  const { c } = useI18n();
  const alt = c.photoAlt[name] ?? '';
  const src = find(name);
  const style = { aspectRatio: ratio };
  if (src) {
    return (
      <figure className={`photo ${className}`} style={style}>
        <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
        {illustrativePhotos.has(name) && <figcaption>{c.site.illustrative}</figcaption>}
      </figure>
    );
  }
  return (
    <div className={`photo photo--plate ${className}`} style={style} aria-hidden="true">
      {import.meta.env.DEV && <span className="photo__brief">Photo needed: {brief} (src/assets/photos/{name}.jpg)</span>}
    </div>
  );
}
