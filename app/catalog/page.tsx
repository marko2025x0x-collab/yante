'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllProducts, getCategories } from '@/lib/data/mockProducts';
import { ProductCard } from '@/components/shop/ProductCard';
import { Search, Sparkles } from 'lucide-react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('query') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedGauge, setSelectedGauge] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);

  const categories = getCategories();
  const allProducts = getAllProducts();

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category_slug !== selectedCategory) {
        return false;
      }

      // Gauge filter
      if (selectedGauge !== 'all') {
        const hasGauge = product.variants.some((v) => v.gauge.includes(selectedGauge));
        if (!hasGauge) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCategory = product.category_name?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCategory) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.base_price - b.base_price;
      if (sortBy === 'price-desc') return b.base_price - a.base_price;
      return (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0);
    });
  }, [allProducts, selectedCategory, selectedGauge, sortBy, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Заголовок каталогу */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-500 font-bold">
            <Sparkles size={13} />
            <span>Каталог прикрас для пірсингу</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif uppercase tracking-tight text-slate-900 font-bold">
            Титановий пірсинг ASTM F-136
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Повний асортимент сертифікованих лабретів, клікерів, бананів, штанг та безрізьбових топів із дзеркальним поліруванням.
          </p>
        </div>

        {/* Лічильник товарів */}
        <div className="text-xs font-mono text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-xl self-start md:self-auto shadow-sm">
          Знайдено: <strong className="text-slate-950">{filteredProducts.length}</strong> позицій
        </div>
      </div>

      {/* Панель фільтрів та сортування */}
      <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl space-y-4 shadow-sm">
        
        {/* Рядок пошуку та категорій */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Категорії (Pills) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Всі прикраси
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Пошукове поле */}
          <div className="relative min-w-[240px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Пошук у каталозі..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white"
            />
          </div>

        </div>

        {/* Другий рядок: Калібр (Gauge) та Сортування */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          
          {/* Gauge Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase tracking-wider text-[11px] font-bold">Товщина:</span>
            {['all', '1.2mm', '1.6mm'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGauge(g)}
                className={`px-3 py-1 rounded-lg font-mono text-xs transition-colors ${
                  selectedGauge === g
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {g === 'all' ? 'Всі' : g}
              </button>
            ))}
          </div>

          {/* Сортування */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase tracking-wider text-[11px] font-bold">Сортувати:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-1 text-xs focus:outline-none focus:border-slate-400 font-medium"
            >
              <option value="featured">За популярністю</option>
              <option value="price-asc">Ціна: від найдешевшої</option>
              <option value="price-desc">Ціна: від найдорожчої</option>
            </select>
          </div>

        </div>

      </div>

      {/* Сітка товарів */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
          <p className="text-base text-slate-800 font-medium">Товарів за вашим запитом не знайдено</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Спробуйте скинути фільтри калібру або змінити пошуковий запит.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedGauge('all');
              setSearchQuery('');
            }}
            className="mt-2 px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs uppercase tracking-wider font-semibold shadow-sm"
          >
            Скинути всі фільтри
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Suspense fallback={<div className="text-center py-20 text-slate-500">Завантаження каталогу...</div>}>
        <CatalogContent />
      </Suspense>
    </div>
  );
}
