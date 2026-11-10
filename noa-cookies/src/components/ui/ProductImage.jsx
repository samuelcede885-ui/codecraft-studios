import { useState } from 'react'
import { productSrc, productSrcSet } from '../../lib/format.js'

/**
 * Foto de producto con srcset. Si el archivo falla, deja el nombre del producto
 * en su lugar (nunca un emoji ni una foto genérica).
 */
export function ProductImage({ product, sizes, className = '', eager = false, priority, alt }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span className={`img-fallback ${className}`} role="img" aria-label={alt ?? product.image.alt}>
        {product.name}
      </span>
    )
  }
  return (
    <img
      className={className}
      src={productSrc(product, 800)}
      srcSet={productSrcSet(product)}
      sizes={sizes}
      width={product.image.w}
      height={product.image.h}
      alt={alt ?? product.image.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority}
      draggable={false}
      onError={() => setFailed(true)}
    />
  )
}
