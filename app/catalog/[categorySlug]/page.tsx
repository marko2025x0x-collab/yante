import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getAllProducts, getCategories } from '@/lib/data/mockProducts';
import { ProductCard } from '@/components/shop/ProductCard';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>;
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((c) => ({
    categorySlug: c.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const products = getAllProducts().filter((p) => p.category_slug === categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Хлібні крихти та Заголовок */}
      <div className="space-y-4">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft size={14} />
          <span>Назад до всього каталогу</span>
        </Link>

        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-500 font-bold">
            <Sparkles size={13} />
            <span>Категорія пірсингу</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif uppercase tracking-tight text-slate-950 font-bold">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Товари категорії */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
          <p className="text-base text-slate-800 font-medium">Товари у цій категорії готуються до викладки</p>
          <Link
            href="/catalog"
            className="inline-block mt-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs uppercase tracking-wider font-semibold"
          >
            Переглянути всі товари
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
