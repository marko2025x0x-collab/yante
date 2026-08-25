'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/useCartStore';
import { useOrderStore } from '@/lib/store/useOrderStore';
import { createGuestOrderAction } from '@/lib/actions/order';
import { DeliveryType, PaymentMethod } from '@/types/order';
import { CityAutocomplete } from '@/components/shop/CityAutocomplete';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  Banknote,
  Building2,
  ShieldCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getSterilizationTotal, getTotal, clearCart } = useCartStore();
  const addOrderToStore = useOrderStore((state) => state.addOrder);

  // Форма замовлення
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '+380',
    email: '',
    city: 'Київ',
    warehouse: 'Відділення № ',
    deliveryType: 'nova_poshta_warehouse' as DeliveryType,
    paymentMethod: 'cod' as PaymentMethod,
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const sterilizationTotal = getSterilizationTotal();
  const total = getTotal();

  const handleQuickCity = (city: string) => {
    setFormData((prev) => ({ ...prev, city }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Валідація
    if (!formData.name.trim()) {
      setErrorMessage("Будь ласка, вкажіть ваше ім'я");
      return;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setErrorMessage('Вкажіть дійсний номер телефону для зв’язку');
      return;
    }
    if (!formData.city.trim() || !formData.warehouse.trim()) {
      setErrorMessage('Будь ласка, заповніть дані доставки Нової Пошти');
      return;
    }
    if (items.length === 0) {
      setErrorMessage('Ваш кошик порожній');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: formData.name.trim(),
        customerSurname: formData.surname.trim(),
        customerPhone: formData.phone.trim(),
        customerEmail: formData.email.trim() || undefined,
        deliveryType: formData.deliveryType,
        deliveryCity: formData.city.trim(),
        deliveryWarehouse: formData.warehouse.trim(),
        paymentMethod: formData.paymentMethod,
        customerNotes: formData.notes.trim() || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          productTitle: i.productTitle,
          productSlug: i.productSlug,
          image: i.image,
          selectedGauge: i.gauge,
          selectedSize: i.size,
          selectedColor: i.anodizationName,
          isSterilized: i.isSterilized,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      };

      const result = await createGuestOrderAction(payload);

      if (result.success && result.order) {
        addOrderToStore(result.order);
        clearCart();
        router.push(`/checkout/success?orderNumber=${result.orderNumber}`);
      } else {
        setErrorMessage(result.error || 'Помилка при створенні замовлення');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Виникла помилка з’єднання');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-500 shadow-sm">
          <ShoppingBag size={28} />
        </div>
        <h1 className="text-2xl font-serif uppercase tracking-wider text-slate-900 font-bold">Ваш кошик порожній</h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Щоб оформити замовлення, оберіть потрібні прикраси з нашого каталогу пірсингу.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-black text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm"
        >
          <span>Перейти до каталогу</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs uppercase tracking-[0.25em] text-slate-500 font-bold block mb-1">
          Швидке оформлення (Guest Flow)
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif uppercase tracking-tight text-slate-950 font-bold">
          Оформлення замовлення
        </h1>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center gap-3 text-rose-800 text-xs">
          <AlertCircle size={18} className="shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ЛІВА ЧАСТИНА: 3 Кроки форми */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* КРОК 1: Контактні дані */}
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-5 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs">
                1
              </span>
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
                Контактні дані покупця
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-700 font-bold uppercase tracking-wider">Ім'я *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Олена"
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-700 font-bold uppercase tracking-wider">Прізвище</label>
                <input
                  type="text"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  placeholder="Ковальчук"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-700 font-bold uppercase tracking-wider">Номер телефону *</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+380 97 123 4567"
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-700 font-bold uppercase tracking-wider">Email (для чеку)</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@gmail.com"
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* КРОК 2: Доставка Нова Пошта */}
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-5 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs">
                2
              </span>
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
                Доставка Новою Поштою
              </h2>
            </div>

            {/* Вибір типу доставки */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, deliveryType: 'nova_poshta_warehouse' })}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  formData.deliveryType === 'nova_poshta_warehouse'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-white'
                }`}
              >
                <Building size={20} className={formData.deliveryType === 'nova_poshta_warehouse' ? 'text-white' : 'text-slate-500'} />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Відділення або Поштомат</h4>
                  <p className={`text-[11px] mt-0.5 ${formData.deliveryType === 'nova_poshta_warehouse' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Самовивіз із пункту видачі
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, deliveryType: 'nova_poshta_courier' })}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  formData.deliveryType === 'nova_poshta_courier'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-white'
                }`}
              >
                <Truck size={20} className={formData.deliveryType === 'nova_poshta_courier' ? 'text-white' : 'text-slate-500'} />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Кур'єр Нової Пошти</h4>
                  <p className={`text-[11px] mt-0.5 ${formData.deliveryType === 'nova_poshta_courier' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Адресна доставка до дверей
                  </p>
                </div>
              </button>
            </div>

            {/* Вибір населеного пункту (всі області та міста України) та Відділення */}
            <div className="space-y-4">
              <CityAutocomplete
                value={formData.city}
                onChange={(city) => setFormData((prev) => ({ ...prev, city }))}
              />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-700 font-bold uppercase tracking-wider">
                    {formData.deliveryType === 'nova_poshta_warehouse' ? 'Номер відділення або Поштомату *' : 'Вулиця, будинок, квартира для кур’єра *'}
                  </label>
                  <span className="text-[10px] text-slate-500">
                    {formData.deliveryType === 'nova_poshta_warehouse' ? 'до 30 кг або поштомат' : 'адресна доставка'}
                  </span>
                </div>

                <input
                  type="text"
                  required
                  value={formData.warehouse}
                  onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                  placeholder={
                    formData.deliveryType === 'nova_poshta_warehouse'
                      ? 'Вкажіть, напр.: Відділення № 1 (вул. Головна, 10) або Поштомат № 8502'
                      : 'вул. Незалежності, 24, кв. 12'
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white font-medium"
                />

                {formData.deliveryType === 'nova_poshta_warehouse' && (
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                    <span className="text-slate-500 text-[10px] uppercase font-bold py-0.5">Швидкий шаблон:</span>
                    {['Відділення № 1', 'Відділення № 2', 'Поштомат № '].map((tmpl) => (
                      <button
                        key={tmpl}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, warehouse: tmpl }))}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 text-[10px]"
                      >
                        {tmpl}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* КРОК 3: Спосіб оплати */}
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-5 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs">
                3
              </span>
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
                Спосіб оплати
              </h2>
            </div>

            <div className="space-y-3">
              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  formData.paymentMethod === 'cod'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Banknote size={20} className={formData.paymentMethod === 'cod' ? 'text-emerald-400' : 'text-slate-500'} />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Накладений платіж</h4>
                    <p className={`text-[11px] ${formData.paymentMethod === 'cod' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Оплата при отриманні у відділенні Нової Пошти
                    </p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={() => {}}
                  className="accent-slate-900 w-4 h-4"
                />
              </label>

              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  formData.paymentMethod === 'card'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className={formData.paymentMethod === 'card' ? 'text-sky-400' : 'text-slate-500'} />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Онлайн-оплата карткою</h4>
                    <p className={`text-[11px] ${formData.paymentMethod === 'card' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Visa / Mastercard / Apple Pay / Google Pay
                    </p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={formData.paymentMethod === 'card'}
                  onChange={() => {}}
                  className="accent-slate-900 w-4 h-4"
                />
              </label>

              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'iban' })}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  formData.paymentMethod === 'iban'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 size={20} className={formData.paymentMethod === 'iban' ? 'text-amber-400' : 'text-slate-500'} />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Оплата за реквізитами IBAN</h4>
                    <p className={`text-[11px] ${formData.paymentMethod === 'iban' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Офіційний рахунок ФОП для пірсинг-студій та клієнтів
                    </p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={formData.paymentMethod === 'iban'}
                  onChange={() => {}}
                  className="accent-slate-900 w-4 h-4"
                />
              </label>
            </div>

            {/* Коментар */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs text-slate-700 font-bold uppercase tracking-wider">Коментар до замовлення</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Вкажіть особливості доставки або побажання щодо пакування..."
                rows={2}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white"
              />
            </div>
          </div>

        </div>

        {/* ПРАВА ЧАСТИНА: Склад замовлення та підсумок */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-6 sticky top-24 shadow-sm">
            
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Ваше замовлення</span>
              <span className="font-mono text-slate-500 text-xs">{items.length} позицій</span>
            </h3>

            {/* Список товарів */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.cartItemId} className="flex gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-200">
                    <Image src={item.image} alt={item.productTitle} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{item.productTitle}</h4>
                    <div className="text-[10px] text-slate-600 flex items-center gap-1.5 mt-0.5 font-medium">
                      <span>{item.gauge}</span>
                      <span>•</span>
                      <span>{item.size}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.anodizationHex }} />
                        {item.anodizationName}
                      </span>
                    </div>
                    {item.isSterilized && (
                      <span className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5 font-semibold">
                        <ShieldCheck size={10} /> Стерилізовано (+50 ₴)
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-950 block">
                      {((item.unitPrice + (item.isSterilized ? 50 : 0)) * item.quantity).toLocaleString('uk-UA')} ₴
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{item.quantity} шт.</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Розрахунок сум */}
            <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Вартість прикрас:</span>
                <span className="text-slate-900 font-mono font-semibold">{subtotal.toLocaleString('uk-UA')} ₴</span>
              </div>
              {sterilizationTotal > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Автоклавування:</span>
                  <span className="font-mono">+{sterilizationTotal.toLocaleString('uk-UA')} ₴</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Доставка Новою Поштою:</span>
                <span className="text-slate-900 font-mono">
                  {total >= 1500 ? (
                    <strong className="text-emerald-700 uppercase text-[11px]">Безкоштовно</strong>
                  ) : (
                    'За тарифами перевізника (~80 ₴)'
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-950 pt-3 border-t border-slate-100">
                <span className="uppercase tracking-wider">До сплати:</span>
                <span className="font-mono text-lg">{total.toLocaleString('uk-UA')} ₴</span>
              </div>
            </div>

            {/* Кнопка підтвердження */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-slate-950 hover:bg-black text-white font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Формування замовлення...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Підтвердити замовлення</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1 font-medium">
              <ShieldCheck size={13} className="text-slate-600" />
              <span>Безпечне оформлення замовлення без реєстрації</span>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
}
