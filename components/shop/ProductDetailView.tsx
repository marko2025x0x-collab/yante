'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, ProductVariant, CompatibleTop } from '@/types/product';
import { ANODIZATION_OPTIONS, COMPATIBLE_TOPS } from '@/lib/data/mockProducts';
import { VariantSelector } from '@/components/shop/VariantSelector';
import { AnodizationPicker } from '@/components/shop/AnodizationPicker';
import { JewelryImagePreview } from '@/components/shop/JewelryImagePreview';
import { SterilizationModal } from '@/components/shop/SterilizationModal';
import { useCartStore } from '@/lib/store/useCartStore';
import {
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Check,
  HelpCircle,
  Truck,
  RotateCcw,
  Plus,
  Shield,
  Zap,
  PhoneCall,
  X,
} from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
  const defaultVariant: ProductVariant = product.variants?.[0] || {
    id: 'v-default',
    product_id: product.id,
    gauge: '1.2mm',
    length_or_diameter: '8mm',
    price_adjustment: 0,
    stock: 20,
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);
  
  // Анодування (за замовчуванням без анодування)
  const [isAnodized, setIsAnodized] = useState(false);
  const [selectedAnodization, setSelectedAnodization] = useState(ANODIZATION_OPTIONS[0]);

  // Стерилізація (за замовчуванням без додаткової стерилізації)
  const [isSterilized, setIsSterilized] = useState(false);
  const [isSterilizationModalOpen, setIsSterilizationModalOpen] = useState(false);

  // Стан додавання до кошика
  const [isAdded, setIsAdded] = useState(false);
  const [upsellAddedIds, setUpsellAddedIds] = useState<string[]>([]);
  
  // Швидке замовлення в 1 клік
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [quickPhone, setQuickPhone] = useState('');
  const [quickOrderSuccess, setQuickOrderSuccess] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  // Підрахунок фінальної ціни
  const basePriceWithVariant = product.base_price + (selectedVariant?.price_adjustment || 0);
  const anodizationFee = (isAnodized && product.supports_anodization !== false) ? 50 : 0;
  const sterilizationFee = isSterilized ? 50 : 0;
  const totalPrice = basePriceWithVariant + anodizationFee + sterilizationFee;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productTitle: product.title,
      productSlug: product.slug,
      image: product.images[activeImageIndex] || product.images[0],
      variantId: selectedVariant.id,
      gauge: selectedVariant.gauge,
      size: selectedVariant.length_or_diameter,
      anodizationId: isAnodized ? selectedAnodization.id : 'natural',
      anodizationName: isAnodized ? selectedAnodization.name : 'Без анодування (0V)',
      anodizationHex: isAnodized ? selectedAnodization.hex_code : '#D1D5DB',
      isSterilized: isSterilized,
      unitPrice: totalPrice,
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      openCart();
    }, 800);
  };

  const handleQuickOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuickOrderSuccess(true);
    setTimeout(() => {
      setQuickOrderSuccess(false);
      setIsQuickOrderOpen(false);
      setQuickPhone('');
    }, 2500);
  };

  const handleAddUpsellTop = (top: CompatibleTop) => {
    addItem({
      productId: top.id,
      productTitle: top.title,
      productSlug: top.slug,
      image: top.image,
      variantId: 'top-universal',
      gauge: 'Універсальний топ (Push-in)',
      size: 'Каст під лабрет',
      anodizationId: isAnodized ? selectedAnodization.id : 'anod-silver',
      anodizationName: isAnodized ? selectedAnodization.name : 'Без анодування',
      anodizationHex: isAnodized ? selectedAnodization.hex_code : '#E2E8F0',
      isSterilized: isSterilized,
      unitPrice: top.price,
      quantity: 1,
    });

    setUpsellAddedIds((prev) => [...prev, top.id]);
    setTimeout(() => {
      setUpsellAddedIds((prev) => prev.filter((id) => id !== top.id));
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 select-none">
      
      {/* Хлібні крихти */}
      <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 font-medium">
        <Link href="/" className="hover:text-slate-900 transition-colors">Головна</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-slate-900 transition-colors">Каталог</Link>
        <span>/</span>
        <Link href={`/catalog/${product.category_slug}`} className="hover:text-slate-900 transition-colors">
          {product.category_name}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold line-clamp-1">{product.title}</span>
      </nav>

      {/* Головна сітка: Галерея (зліва) + Конфігуратор і Кнопка Купити (справа) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* ЛІВА КОЛОНКА: Галерея фото з інтерактивним фільтром кольору */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
          
          {/* Головне велике фото з селективним анодуванням виробу */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#121214] border border-slate-200 shadow-md">
            <JewelryImagePreview
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              anodizationOption={selectedAnodization}
              isAnodized={isAnodized && product.supports_anodization !== false}
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />

            {/* Бейдж поточного кольору / анодування */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-zinc-700 rounded-full px-3.5 py-1.5 flex items-center gap-2 shadow-sm text-white">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block border border-zinc-500"
                style={{ backgroundColor: isAnodized && product.supports_anodization !== false ? selectedAnodization.hex_code : '#E2E8F0' }}
              />
              <span className="text-xs font-mono font-medium">
                {isAnodized && product.supports_anodization !== false ? selectedAnodization.name : '0V Срібло (Natural)'}
              </span>
            </div>

            {/* Сертифікат матеріалу */}
            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md border border-zinc-700 rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-zinc-200">
              ASTM F-136
            </div>
          </div>

          {/* Мініатюри галереї */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-900 border transition-all ${
                    activeImageIndex === idx
                      ? 'border-slate-900 ring-2 ring-slate-900 scale-105 shadow-sm'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* 3 Переваги матеріалу та сервісу */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs text-slate-700">
            <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
              <Shield className="mx-auto mb-1 text-slate-900" size={18} />
              <span className="font-semibold text-[11px] block">ASTM F-136 ELI</span>
              <span className="text-[10px] text-slate-500">Імплантаційний</span>
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
              <Truck className="mx-auto mb-1 text-slate-900" size={18} />
              <span className="font-semibold text-[11px] block">Нова Пошта</span>
              <span className="text-[10px] text-slate-500">1-2 дні по Україні</span>
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
              <Sparkles className="mx-auto mb-1 text-slate-900" size={18} />
              <span className="font-semibold text-[11px] block">Анодування</span>
              <span className="text-[10px] text-slate-500">Безкоштовно</span>
            </div>
          </div>

        </div>

        {/* ПРАВА КОЛОНКА: Конфігуратор товару + Головна кнопка КУПИТИ у зоні видимості */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* 1. Блок заголовка та динамічної ціни */}
          <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                {product.category_name}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                В наявності ({selectedVariant.stock} шт.)
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-tight text-slate-950">
              {product.title}
            </h1>

            {/* Велика ціна */}
            <div className="flex flex-wrap items-baseline gap-2.5 pt-1 border-t border-slate-100">
              <span className="text-3xl font-bold font-mono text-slate-950">
                {totalPrice.toLocaleString('uk-UA')} ₴
              </span>
              {anodizationFee > 0 && (
                <span className="text-xs text-amber-700 font-medium bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  +50 ₴ анодування ({selectedAnodization.name})
                </span>
              )}
              {isSterilized && (
                <span className="text-xs text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  +50 ₴ стерилізація
                </span>
              )}
            </div>
          </div>

          {/* 2. Блок вибору розміру / калібру */}
          <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-xs">
            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
            />
          </div>

          {/* 3. Блок вибору анодування (якщо товар підтримує анодування) */}
          {product.supports_anodization !== false ? (
            <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-xs">
              <AnodizationPicker
                options={ANODIZATION_OPTIONS}
                selectedOption={selectedAnodization}
                onSelect={setSelectedAnodization}
                isAnodized={isAnodized}
                onToggleAnodized={setIsAnodized}
              />
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-slate-300 border border-slate-400 shrink-0" />
                <span>Матеріал виробу: <strong>Натуральний полірований титан (0V)</strong></span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                Без анодування
              </span>
            </div>
          )}

          {/* 4. ВИБІР СТЕРИЛІЗАЦІЇ */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-800 font-bold flex items-center gap-1.5">
                <Shield size={14} className="text-slate-700" />
                <span>Стерилізація:</span>
              </span>
              <button
                type="button"
                onClick={() => setIsSterilizationModalOpen(true)}
                className="text-[11px] text-slate-500 hover:text-slate-900 underline flex items-center gap-1 transition-colors"
                title="Детальніше про процес стерилізації"
              >
                <span>Деталі</span>
                <HelpCircle size={13} />
              </button>
            </div>

            {/* Дві кнопки вибору стерилізації */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setIsSterilized(false)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  !isSterilized
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-1 ring-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-white'
                }`}
              >
                <span className="text-xs font-bold block">Без стерилізації</span>
                <span className={`text-[10px] block mt-0.5 ${!isSterilized ? 'text-slate-300' : 'text-slate-500'}`}>
                  0 ₴
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsSterilized(true)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSterilized
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-1 ring-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-white'
                }`}
              >
                <span className="text-xs font-bold block flex items-center gap-1">
                  <span>Стерилізація</span>
                  <span className="text-[10px] text-emerald-400 font-mono">+50 ₴</span>
                </span>
                <span className={`text-[10px] block mt-0.5 ${isSterilized ? 'text-slate-300' : 'text-slate-500'}`}>
                  Крафт-пакет з індикатором
                </span>
              </button>
            </div>
          </div>

          {/* 5. КНОПКА «КУПИТИ» (Додати в кошик) + «Швидке замовлення» — розташовані ПРЯМО ТУТ */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`w-full py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer ${
                isAdded
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-slate-950 hover:bg-black text-white hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={18} strokeWidth={2.5} />
                  <span>Додано до кошика!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Купити • {totalPrice.toLocaleString('uk-UA')} ₴</span>
                </>
              )}
            </button>

            {/* Швидке замовлення в 1 клік */}
            <button
              type="button"
              onClick={() => setIsQuickOrderOpen(true)}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-slate-200"
            >
              <PhoneCall size={14} />
              <span>Швидке замовлення в 1 клік</span>
            </button>
          </div>

          {/* 6. Повна таблиця технічних параметрів та характеристик */}
          <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl space-y-4 text-xs shadow-xs">
            <h3 className="text-xs uppercase tracking-wider text-slate-900 font-bold border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Технічні характеристики та параметри</span>
              {selectedVariant?.sku && (
                <span className="font-mono text-[10px] text-slate-500 font-normal">
                  Артикул: <strong className="text-slate-900">{selectedVariant.sku}</strong>
                </span>
              )}
            </h3>

            {/* Таблиця параметрів із таблиці */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Матеріал</span>
                <span className="font-semibold text-slate-900 block">{product.material}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Тип різьби / Замка</span>
                <span className="font-semibold text-slate-900 block">{product.thread_type}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Калібр (Товщина)</span>
                <span className="font-semibold text-slate-900 block font-mono">{selectedVariant?.gauge || '1.2mm'}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Довжина / Розмір</span>
                <span className="font-semibold text-slate-900 block font-mono">{selectedVariant?.length_or_diameter || '8mm'}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Фінішна обробка</span>
                <span className="font-semibold text-slate-900 block">Mirror Polish (Дзеркальна)</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Наявність</span>
                <span className="font-semibold text-emerald-700 block">В наявності ({selectedVariant?.stock || 30} шт)</span>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed pt-1">
              {product.description}
            </p>

            <div className="space-y-2 pt-1 border-t border-slate-100">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                Особливості моделі:
              </h4>
              <ul className="space-y-1.5 text-slate-600">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>

      {/* 7. БЛОК СУМІСНИХ ТОПІВ / НАКРУТОК (Upsell) */}
      <section className="border-t border-slate-200 pt-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold block mb-1">
              Ідеальне доповнення
            </span>
            <h2 className="text-xl sm:text-2xl font-serif uppercase tracking-wider text-slate-900 font-bold">
              Сумісні топи та накрутки (Push-in)
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Всі топи на 100% підходять до обраного лабрету
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMPATIBLE_TOPS.map((top) => {
            const isTopAdded = upsellAddedIds.includes(top.id);
            return (
              <div
                key={top.id}
                className="bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all shadow-xs"
              >
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#18181B] border border-slate-100">
                  <Image
                    src={top.image}
                    alt={top.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{top.title}</h4>
                  <p className="text-[11px] text-slate-500">{top.crystal}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold font-mono text-slate-950">{top.price} ₴</span>
                  <button
                    onClick={() => handleAddUpsellTop(top)}
                    disabled={isTopAdded}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-all ${
                      isTopAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-black text-white'
                    }`}
                  >
                    {isTopAdded ? (
                      <>
                        <Check size={12} />
                        <span>Додано</span>
                      </>
                    ) : (
                      <>
                        <Plus size={12} />
                        <span>Додати</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. МОДАЛЬНЕ ВІКНО ШВИДКОГО ЗАМОВЛЕННЯ В 1 КЛІК */}
      {isQuickOrderOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 relative text-slate-900 space-y-4">
            <button
              onClick={() => setIsQuickOrderOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-serif font-bold uppercase tracking-wider text-slate-950">
                Швидке замовлення в 1 клік
              </h3>
              <p className="text-xs text-slate-500">
                Залиште ваш номер, і наш менеджер зателефонує протягом 10 хвилин для підтвердження деталей доставки.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">{product.title}</p>
              <p className="text-slate-600">
                Розмір: {selectedVariant.gauge} x {selectedVariant.length_or_diameter} • {isAnodized ? selectedAnodization.name : 'Без анодування'}
                {isSterilized && ' • Стерилізація'}
              </p>
              <p className="font-bold font-mono text-slate-950 pt-1">
                Сума: {totalPrice.toLocaleString('uk-UA')} ₴
              </p>
            </div>

            {quickOrderSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl text-center text-xs font-semibold space-y-1 animate-fadeIn">
                <Check size={20} className="mx-auto text-emerald-600" />
                <p>Дякуємо! Замовлення прийнято. Менеджер вже телефонує вам.</p>
              </div>
            ) : (
              <form onSubmit={handleQuickOrderSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-700 block mb-1">
                    Ваш номер телефону:
                  </label>
                  <input
                    type="tel"
                    required
                    value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    placeholder="+380 (__) ___-__-__"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:border-slate-900 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-950 hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
                >
                  Підтвердити замовлення
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 9. МОДАЛКА АВТОКЛАВУ */}
      <SterilizationModal
        isOpen={isSterilizationModalOpen}
        onClose={() => setIsSterilizationModalOpen(false)}
      />

    </div>
  );
};
