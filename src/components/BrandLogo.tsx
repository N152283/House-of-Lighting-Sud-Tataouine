import React from 'react';
import logoUrl from '@/img/logo.jpeg';
import { cn } from '@/lib/utils';

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  alt?: string;
};

export default function BrandLogo({
  className,
  imageClassName,
  alt = 'House of Lighting Sud Tataouine',
}: BrandLogoProps) {
  return (
    <span className={cn('inline-flex shrink-0 overflow-hidden bg-white shadow-sm', className)}>
      <img
        src={logoUrl}
        alt={alt}
        className={cn('h-full w-full object-contain', imageClassName)}
      />
    </span>
  );
}
