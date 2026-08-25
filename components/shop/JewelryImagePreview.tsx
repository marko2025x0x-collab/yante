'use client';

import React from 'react';
import Image from 'next/image';
import { AnodizationOption } from '@/types/product';

interface JewelryImagePreviewProps {
  src: string;
  alt: string;
  anodizationOption?: AnodizationOption;
  isAnodized?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export const JewelryImagePreview: React.FC<JewelryImagePreviewProps> = ({
  src,
  alt,
  anodizationOption,
  isAnodized = false,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
}) => {
  const hasColor = isAnodized && anodizationOption && anodizationOption.id !== 'anod-silver';

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#101012] select-none ${className}`}>
      
      {/* 1. Базове макро-фото виробу */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover object-center transition-all duration-300 pointer-events-none"
        sizes={sizes}
      />

      {/* 2. Селективний шар металевого анодування (зафарбовує ТІЛЬКИ метал, зберігаючи темний камінь і кристали) */}
      {hasColor && (
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-500"
          style={{
            backgroundColor: anodizationOption.hex_code,
            mixBlendMode: 'color',
            opacity: 0.88,
          }}
        />
      )}

      {/* 3. Додатковий шар металевого насичення для золотих/кольорових відтінків без зміни фону */}
      {hasColor && (
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-500"
          style={{
            backgroundColor: anodizationOption.hex_code,
            mixBlendMode: 'soft-light',
            opacity: 0.45,
          }}
        />
      )}

      {/* 4. Тонкий захист глибоких тіней каменю */}
      {hasColor && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.15) 100%)',
          }}
        />
      )}

    </div>
  );
};
