import { useState, type CSSProperties } from 'react';
import { getPhoto, photoSrc, photoSrcSet, type PhotoId } from '../../data/photos';
import { cx } from '../../lib/cx';

interface PhotoProps {
  id: PhotoId;
  /** Atributo sizes del srcset (cuánto ocupa la foto en pantalla) */
  sizes: string;
  className?: string;
  imgClassName?: string;
  /** Carga inmediata y prioridad alta (solo para la foto principal del hero) */
  priority?: boolean;
  focus?: string;
  alt?: string;
  style?: CSSProperties;
}

/** Foto real responsive: WebP en varios anchos, carga diferida y placeholder borroso. */
export function Photo({ id, sizes, className, imgClassName, priority, focus, alt, style }: PhotoProps) {
  const p = getPhoto(id);
  const [failed, setFailed] = useState(false);
  const position = focus ?? p.focus ?? '50% 50%';
  const label = alt ?? p.alt;

  return (
    <span
      className={cx('relative block overflow-hidden bg-burdeos bg-cover', className)}
      style={{ backgroundImage: `url(${p.lqip})`, backgroundPosition: position, ...style }}
    >
      {failed ? (
        <span role="img" aria-label={label} className="absolute inset-0 flex items-end bg-burdeos/70 p-3">
          <span className="label-mono text-crema/80">Foto no disponible</span>
        </span>
      ) : (
        <img
          src={photoSrc(id, p.widths[p.widths.length - 1])}
          srcSet={photoSrcSet(id)}
          sizes={sizes}
          width={p.width}
          height={p.height}
          alt={label}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => setFailed(true)}
          className={cx('block h-full w-full object-cover', imgClassName)}
          style={{ objectPosition: position }}
          draggable={false}
        />
      )}
    </span>
  );
}
