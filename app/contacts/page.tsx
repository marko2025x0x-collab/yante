'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { useContactStore } from '@/lib/store/useContactStore';

export default function ContactsPage() {
  const { contacts } = useContactStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-slate-500 font-bold block">
          Зв'язок з брендом
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif uppercase tracking-tight text-slate-950 font-bold">
          Контакти та шоурум
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Контактні канали */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            
            {/* Телефон */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <span className="text-slate-500 text-[11px] uppercase tracking-wider block font-bold">Телефон / Viber:</span>
                <a href={`tel:${contacts.phoneRaw}`} className="text-base font-mono font-bold text-slate-950 hover:text-slate-700 transition-colors">
                  {contacts.phone}
                </a>
                <p className="text-[11px] text-slate-500 mt-0.5">{contacts.workingHours}</p>
              </div>
            </div>

            {/* Telegram */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 shrink-0">
                <Send size={20} />
              </div>
              <div>
                <span className="text-slate-500 text-[11px] uppercase tracking-wider block font-bold">Telegram Підтримка:</span>
                <a href={contacts.telegramUrl} target="_blank" rel="noreferrer" className="text-base font-bold text-slate-950 hover:text-sky-700 transition-colors">
                  {contacts.telegramUsername}
                </a>
                <p className="text-[11px] text-slate-500 mt-0.5">Швидка консультація майстра пірсингу онлайн</p>
              </div>
            </div>

            {/* Адреса */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <span className="text-slate-500 text-[11px] uppercase tracking-wider block font-bold">Студія у Києві:</span>
                <p className="text-sm font-bold text-slate-900">{contacts.address}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{contacts.addressNote}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <span className="text-slate-500 text-[11px] uppercase tracking-wider block font-bold">Email для запитів та опту:</span>
                <a href={`mailto:${contacts.emailWholesale}`} className="text-sm font-semibold text-slate-950 hover:underline block">
                  {contacts.emailWholesale}
                </a>
                <a href={`mailto:${contacts.emailGeneral}`} className="text-xs text-slate-600 hover:underline block mt-0.5">
                  {contacts.emailGeneral}
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Швидка форма зв'язку */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <h3 className="text-lg font-serif font-bold uppercase tracking-wider text-slate-950">
              Залишити запитання
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Не впевнені, який калібр або довжина потрібні для вашого проколу? Напишіть нам, і майстер зв'яжеться з вами.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-2 animate-fadeIn">
              <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-950 uppercase">Повідомлення надіслано</h4>
              <p className="text-xs text-slate-600">Дякуємо! Консультант YANTI зв'яжеться з вами найближчим часом.</p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setForm({ name: '', contact: '', message: '' });
                }}
                className="mt-2 px-4 py-2 bg-white text-xs text-slate-900 font-semibold hover:bg-slate-50 rounded-xl border border-slate-300 shadow-sm cursor-pointer"
              >
                Надіслати ще одне повідомлення
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold uppercase tracking-wider">Ваше ім'я</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Олена"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold uppercase tracking-wider">Телефон або Telegram</label>
                <input
                  type="text"
                  required
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  placeholder="+380... або @username"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold uppercase tracking-wider">Повідомлення</label>
                <textarea
                  required
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Яка довжина лабрету потрібна для проколу Helix?"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-950 hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
              >
                Надіслати запит
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
