'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { useCartStore } from '@/lib/store/useCartStore';
import { ShoppingBag, Check } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const defaultVariant = product.variants[0] || {
    id: 'default',
    gauge: '1.2 мм',
    length_or_diameter: '8 мм',
    price_adjustment: 0,
    sku: 'BASIC',
  };

  const currentPrice = product.base_price + (defaultVariant.price_adjustment || 0);

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      productTitle: product.title,
      productSlug: product.slug,
      image: product.images[0] || '/images/products/labrets/lr-basic-12.webp',
      variantId: defaultVariant.id,
      gauge: defaultVariant.gauge,
      size: defaultVariant.length_or_diameter,
      anodizationId: 'natural',
      anodizationName: 'Natural Silver',
      anodizationHex: '#D1D5DB',
      isSterilized: false,
      unitPrice: currentPrice,
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-zinc-300 group select-none">
      
      {/* 1. Верхнє фото виробу */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square w-full bg-[#121214] overflow-hidden">
        <Image
          src={product.images[0] || '/images/products/labrets/lr-basic-12.webp'}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* 2. Інформація товару та кнопки дій */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5 bg-white">
        
        <div className="space-y-1.5">
          {/* Назва товару */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm sm:text-base font-medium text-zinc-900 group-hover:text-black line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Ціна у форматі ₴100 */}
          <div>
            <span className="text-base sm:text-lg font-bold text-zinc-950 font-sans">
              ₴{currentPrice}
            </span>
          </div>
        </div>

        {/* 3. Кнопки: «Купити» та «В кошик» */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            href={`/product/${product.slug}`}
            className="w-full py-2.5 px-3 bg-zinc-950 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xl text-center transition-all flex items-center justify-center cursor-pointer shadow-xs"
          >
            Купити
          </Link>

          <button
            type="button"
            onClick={handleQuickAddToCart}
            className={`w-full py-2.5 px-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
              isAdded
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-zinc-100 border-zinc-200 hover:bg-zinc-200 text-zinc-900'
            }`}
            title="Швидко додати в кошик"
          >
            {isAdded ? (
              <>
                <Check size={14} className="stroke-[2.5]" />
                <span>Додано</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} className="stroke-[2]" />
                <span>В кошик</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
