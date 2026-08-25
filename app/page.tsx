'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProductStore } from '@/lib/store/useProductStore';
import { ProductCard } from '@/components/shop/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { products, categories, heroBanner } = useProductStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category_slug === activeCategory);

  return (
    <div className="space-y-0 pb-16 bg-white select-none">
      
      {/* 1. ГОЛОВНИЙ HERO-БАНЕР (Керується з адмінки та підтримує заміну фото) */}
      <section className="relative min-h-[460px] sm:min-h-[540px] lg:min-h-[620px] flex items-end justify-between bg-[#0A0A0A] overflow-hidden border-b border-zinc-900 px-6 sm:px-12 lg:px-16 pb-10 sm:pb-14">
        
        {/* Фонове фото */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBanner.imageUrl || '/images/hero-macro.jpg'}
            alt="YANTI Titanium Piercing Jewelry Hero"
            fill
            priority
            className="object-cover object-center scale-102"
          />
          {/* М'який градієнт для читабельності тексту */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
        </div>

        {/* Підписи під виробами зліва і справа */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 text-zinc-100">
          
          {/* Лівий підпис */}
          <Link
            href={`/product/${heroBanner.leftSlug || 'titanium-basic-labret'}`}
            className="max-w-md group cursor-pointer transition-transform duration-300 hover:translate-y--1"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-zinc-100 group-hover:text-white leading-snug tracking-wide drop-shadow-md whitespace-pre-line">
              {heroBanner.leftTitle}
            </h2>
          </Link>

          {/* Правий підпис */}
          <Link
            href={`/product/${heroBanner.rightSlug || 'titanium-clicker-ring-cz-pave'}`}
            className="max-w-md text-left sm:text-right group cursor-pointer transition-transform duration-300 hover:translate-y--1"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-zinc-100 group-hover:text-white leading-snug tracking-wide drop-shadow-md whitespace-pre-line">
              {heroBanner.rightTitle}
            </h2>
          </Link>

        </div>
      </section>

      {/* 2. КАТЕГОРІЇ ТА ВСІ ТОВАРИ НА ГОЛОВНІЙ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-8">
        
        {/* Заголовок та фільтр-пілюлі категорій */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold mb-2">
              <Sparkles size={14} className="text-zinc-700" />
              <span>Каталог YANTI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold uppercase tracking-tight text-zinc-950">
              Колекція прикрас
            </h2>
          </div>

          {/* Інтерактивні пілюлі категорій */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 md:pb-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-zinc-950 text-white shadow-md'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
              }`}
            >
              Всі товари ({products.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeCategory === cat.slug
                    ? 'bg-zinc-950 text-white shadow-md'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Сітка товарів */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-zinc-50 rounded-2xl border border-zinc-200">
            <p className="text-zinc-500 font-medium">У цій категорії поки що немає товарів</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </section>

      {/* 3. БЛОК ПЕРЕВАГ ТИТАНУ ASTM F-136 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h4 className="font-serif font-bold uppercase text-zinc-950 text-base">ASTM F-136 Імплантаційний титан</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              100% гіпоалергенний біосумісний метал. Ідеально підходить для свіжих проколів без ризику алергії чи окислення.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-serif font-bold uppercase text-zinc-950 text-base">Внутрішнє різьблення</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Безпечний монтаж топа: різьба знаходиться всередині штифта, що запобігає мікротравмам каналу.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-serif font-bold uppercase text-zinc-950 text-base">Стерилізація прикрас</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Можливість отримати прикрасу у стерильному крафт-пакеті з індикатором для негайного встановлення майстром.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
