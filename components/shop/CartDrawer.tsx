'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/useCartStore';
import { X, Trash2, Plus, Minus, ShieldCheck, ShoppingBag, ArrowRight, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    toggleSterilization,
    getSubtotal,
    getSterilizationTotal,
    getTotal,
  } = useCartStore();

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const sterilizationTotal = getSterilizationTotal();
  const total = getTotal();

  const FREE_SHIPPING_THRESHOLD = 1500;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const freeShippingProgress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Затемнення фону (Backdrop) */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
      />

      {/* Панель кошика (Slide-over адаптивна для смартфонів, планшетів і десктопу) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#0A0A0A] border-l border-zinc-800 text-white shadow-2xl flex flex-col justify-between h-full">
          
          {/* Header кошика */}
          <div className="p-4 sm:p-6 border-b border-zinc-800/80 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h2 className="text-sm uppercase tracking-[0.2em] font-semibold text-zinc-200">
                  Ваш кошик
                </h2>
                <p className="text-xs text-zinc-500 font-mono">
                  {items.reduce((acc, i) => acc + i.quantity, 0)} прикрас
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-full transition-colors cursor-pointer"
              aria-label="Закрити кошик"
            >
              <X size={20} />
            </button>
          </div>

          {/* Прогрес-бар безкоштовної доставки */}
          <div className="px-4 sm:px-6 py-3 bg-zinc-950 border-b border-zinc-850 text-xs">
            <div className="flex items-center gap-2 text-zinc-300 mb-1.5">
              <Truck size={14} className="text-zinc-400 shrink-0" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  До безкоштовної доставки: <strong className="text-white">{remainingForFreeShipping} ₴</strong>
                </span>
              ) : (
                <span className="text-emerald-400 font-medium">
                  🎉 Безкоштовна доставка активна
                </span>
              )}
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-zinc-400 to-slate-200 h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Список товарів */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-12">
                <ShoppingBag size={48} className="text-zinc-700 stroke-[1.2] mb-4" />
                <p className="text-sm text-zinc-300 font-medium mb-1">Ваш кошик порожній</p>
                <p className="text-xs text-zinc-500 max-w-xs mb-6">
                  Оберіть прикраси з імплантаційного титану ASTM F-136 у каталозі.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                >
                  Перейти до каталогу
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-[#121212] border border-zinc-850 rounded-2xl p-3.5 sm:p-4 transition-all hover:border-zinc-700/70"
                >
                  <div className="flex gap-3">
                    {/* Фото товару */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-zinc-850">
                      <Image
                        src={item.image}
                        alt={item.productTitle}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Інформація */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.productSlug}`}
                          onClick={closeCart}
                          className="text-xs font-semibold text-zinc-200 hover:text-white line-clamp-1 transition-colors"
                        >
                          {item.productTitle}
                        </Link>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-zinc-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                          title="Видалити"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Характеристики */}
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-400">
                        <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 font-mono">
                          {item.gauge}
                        </span>
                        <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 font-mono">
                          {item.size}
                        </span>
                        {item.anodizationName && item.anodizationId !== 'natural' && (
                          <span className="flex items-center gap-1 bg-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-300 text-[10px]">
                            <span
                              className="w-2 h-2 rounded-full inline-block"
                              style={{ backgroundColor: item.anodizationHex }}
                            />
                            <span>{item.anodizationName}</span>
                          </span>
                        )}
                      </div>

                      {/* Ціна та кількість */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/60">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            aria-label="Зменшити"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2.5 text-xs font-mono text-zinc-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            aria-label="Збільшити"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-white">
                            {(item.unitPrice * item.quantity).toLocaleString('uk-UA')} ₴
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Опція стерилізації */}
                  <div className="mt-3 pt-2.5 border-t border-zinc-850/80 flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-zinc-200">
                      <input
                        type="checkbox"
                        checked={item.isSterilized}
                        onChange={() => toggleSterilization(item.cartItemId)}
                        className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/20 w-3.5 h-3.5 accent-emerald-600 cursor-pointer"
                      />
                      <span className="flex items-center gap-1 text-[11px]">
                        <ShieldCheck size={13} className="text-emerald-400" />
                        <span>Стерилізація (+50 ₴/шт)</span>
                      </span>
                    </label>
                    {item.isSterilized && (
                      <span className="text-[11px] text-emerald-400 font-mono font-medium">
                        +{50 * item.quantity} ₴
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Футер кошика та кнопка оформлення */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-zinc-800 bg-[#080808] space-y-3">
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Вартість прикрас:</span>
                  <span className="text-zinc-200 font-mono">{subtotal.toLocaleString('uk-UA')} ₴</span>
                </div>
                {sterilizationTotal > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Стерилізація (крафт-пакет):</span>
                    <span className="font-mono">+{sterilizationTotal.toLocaleString('uk-UA')} ₴</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                  <span className="uppercase tracking-wider">Разом:</span>
                  <span className="font-mono text-base">{total.toLocaleString('uk-UA')} ₴</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full mt-3 py-3.5 px-6 rounded-xl bg-gradient-to-r from-zinc-100 via-slate-200 to-zinc-300 hover:from-white hover:to-zinc-200 text-black font-bold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-lg shadow-white/5 transition-all duration-200 group cursor-pointer"
              >
                <span>Оформити замовлення</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
