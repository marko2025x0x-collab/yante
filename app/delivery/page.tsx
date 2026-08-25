import React from 'react';
import { Truck, CreditCard, Banknote, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DeliveryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-slate-500 font-bold block">
          Інформація для клієнтів
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif uppercase tracking-tight text-slate-950 font-bold">
          Оплата та доставка
        </h1>
      </div>

      {/* Блок доставки */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-sm">
            <Truck size={22} />
          </div>
          <h2 className="text-xl font-serif uppercase tracking-wider text-slate-950 font-bold">
            Доставка по Україні
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
            <h3 className="font-bold uppercase tracking-wider text-slate-900 text-sm">
              Відділення та Поштомати Нової Пошти
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Відправки здійснюються щодня з понеділка по суботу. Термін доставки: 1–2 дні.
            </p>
            <p className="text-slate-500 pt-2">
              Вартість: за тарифами перевізника (~70–90 ₴). <strong className="text-emerald-700">Безкоштовно від 1500 ₴.</strong>
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
            <h3 className="font-bold uppercase tracking-wider text-slate-900 text-sm">
              Кур'єрська доставка Нової Пошти
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Адресна доставка кур'єром безпосередньо до ваших дверей або пірсинг-студії.
            </p>
            <p className="text-slate-500 pt-2">
              Вартість: за тарифами перевізника (~100–130 ₴).
            </p>
          </div>
        </div>
      </div>

      {/* Блок оплати */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-sm">
            <CreditCard size={22} />
          </div>
          <h2 className="text-xl font-serif uppercase tracking-wider text-slate-950 font-bold">
            Способи оплати
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
            <Banknote size={20} className="text-emerald-600" />
            <h3 className="font-bold text-slate-900 uppercase">Накладений платіж</h3>
            <p className="text-slate-600">Оплата готівкою або карткою при отриманні у відділенні Нової Пошти.</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
            <CreditCard size={20} className="text-sky-600" />
            <h3 className="font-bold text-slate-900 uppercase">Онлайн-оплата</h3>
            <p className="text-slate-600">Миттєва безкомісійна оплата через Apple Pay, Google Pay або картку Visa/Mastercard.</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
            <Building2 size={20} className="text-amber-600" />
            <h3 className="font-bold text-slate-900 uppercase">Реквізити IBAN</h3>
            <p className="text-slate-600">Офіційний рахунок ФОП для юридичних осіб та пірсинг-майстрів.</p>
          </div>
        </div>
      </div>

      <div className="pt-4 text-center">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-950 hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
        >
          <span>Перейти до каталогу прикрас</span>
          <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  );
}
