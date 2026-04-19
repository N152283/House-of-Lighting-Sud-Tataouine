import type React from 'react';

export const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop';

export function getProductImageUrl(imageUrl?: string | null) {
  return imageUrl?.trim() || FALLBACK_PRODUCT_IMAGE;
}

export function handleProductImageError(event: React.SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (image.src !== FALLBACK_PRODUCT_IMAGE) {
    image.src = FALLBACK_PRODUCT_IMAGE;
  }
}
