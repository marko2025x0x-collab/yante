'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useOrderStore } from '@/lib/store/useOrderStore';
import { CheckCircle, Package, Truck, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get('orderNumber');
  const orderNumber = orderNumberParam ? parseInt(orderNumberParam, 10) : null;

  const order = useOrderStore((state) =>
    orderNumber ? state.getOrderByNumber(orderNumber) : undefined
  );

  return (
    <div className="space-y-10 text-center">
      {/* Іконка успіху */}
      <div className="relative inline-flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-lg">
          <CheckCircle size={44} className="text-emerald-600" />
        </div>
        <Sparkles className="absolute -top-1 -right-1 text-slate-800 w-5 h-5 animate-bounce" />
      </div>

      {/* Заголовок */}
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-700 font-bold block">
          Замовлення успішно оформлено
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold uppercase tracking-tight text-slate-950">
          Дякуємо за ваше замовлення!
        </h1>
        {orderNumber && (
          <p className="text-base sm:text-lg font-mono text-slate-700">
            Номер замовлення: <strong className="text-slate-950 bg-white px-3 py-1 rounded-lg border border-slate-300 shadow-sm">#{orderNumber}</strong>
          </p>
        )}
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          Ми вже отримали інформацію про ваше замовлення та готуємо прикраси до відправки. Сповіщення надіслано черговому менеджеру.
        </p>
      </div>

      {/* Деталі замовлення (якщо знайдені) */}
      {order && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-left max-w-2xl mx-auto space-y-5 shadow-sm">
          <h3 className="text-xs uppercase tracking-widest text-slate-700 font-bold border-b border-slate-100 pb-3">
            Деталі доставки
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Отримувач:</span>
              <span className="text-slate-900 font-semibold">{order.customer_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Телефон:</span>
              <span className="text-slate-900 font-mono font-semibold">{order.customer_phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Доставка:</span>
              <span className="text-slate-900">{order.delivery_city}, {order.delivery_warehouse}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Сума до сплати:</span>
              <span className="text-slate-950 font-mono font-bold">{order.total_amount.toLocaleString('uk-UA')} ₴</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Позиції:</span>
            {order.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-xs text-slate-700">
                <span>
                  {it.product_title} ({it.selected_gauge} | {it.selected_size} | {it.selected_color})
                  {it.is_sterilized && <span className="text-emerald-700 ml-1.5 font-semibold">[Стерилізовано]</span>}
                </span>
                <span className="font-mono text-slate-900 font-bold">{it.quantity} шт.</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Що відбувається далі? */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto text-left">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
          <Package className="text-slate-900" size={20} />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">1. Комплектація</h4>
          <p className="text-[11px] text-slate-600">Прикраси проходять контроль якості та упаковку.</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
          <ShieldCheck className="text-emerald-600" size={20} />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">2. Автоклавування</h4>
          <p className="text-[11px] text-slate-600">Якщо обрано опцію стерилізації, виріб запаюється у крафт-пакет.</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
          <Truck className="text-slate-900" size={20} />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">3. Відправка</h4>
          <p className="text-[11px] text-slate-600">Номер ТТН Нової Пошти надійде вам у SMS-повідомленні.</p>
        </div>
      </div>

      {/* Кнопки дій */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/catalog"
          className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all inline-flex items-center justify-center gap-2 shadow-sm"
        >
          <span>Продовжити покупки</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <Suspense fallback={<div className="text-center py-20 text-slate-500">Завантаження замовлення...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
