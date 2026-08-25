'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { YantiLogo } from '@/components/ui/YantiLogo';
import { useContactStore } from '@/lib/store/useContactStore';

export const Footer: React.FC = () => {
  const { contacts } = useContactStore();
  const [isSent, setIsSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setForm({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <footer className="bg-[#000000] border-t border-zinc-900 text-zinc-300 text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* ЛІВА КОЛОНКА: Логотип + Опис бренду + Контакти + Соцмережі */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-block">
              <YantiLogo className="h-14 sm:h-16" />
            </Link>

            <div className="space-y-2 text-xs text-zinc-400 font-light leading-relaxed">
              <p className="font-medium text-zinc-200">Титанові прикраси YANTI TITANIUM</p>
              <p>Імплантаційний сертифікований титан ASTM F-136 для безпечного пірсингу.</p>
              <div className="space-y-1 pt-1 text-zinc-300">
                <p>📞 <a href={`tel:${contacts.phoneRaw}`} className="hover:text-white transition-colors">{contacts.phone}</a> ({contacts.workingHours})</p>
                <p>📍 {contacts.address}</p>
                <p>✉️ <a href={`mailto:${contacts.emailWholesale}`} className="hover:text-white transition-colors">{contacts.emailWholesale}</a></p>
              </div>
            </div>

            {/* Іконки соцмереж (Instagram, Telegram, TikTok) */}
            <div className="flex items-center gap-4 pt-2">
              {/* Instagram */}
              <a
                href={contacts.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-zinc-700 hover:border-white text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
                title={contacts.instagramUsername}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Telegram */}
              <a
                href={contacts.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-zinc-700 hover:border-white text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Telegram"
                title={contacts.telegramUsername}
              >
                <Send size={15} />
              </a>

              {/* TikTok */}
              <a
                href={contacts.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-zinc-700 hover:border-white text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="TikTok"
                title={contacts.tiktokUsername}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.75 1.41-.05 2.68-.96 3.13-2.31.25-.65.34-1.36.33-2.07.03-4.57.01-9.14.02-13.71z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ПРАВА КОЛОНКА: Контакт форм з підкресленнями */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-sm uppercase tracking-wider text-zinc-100 font-medium">
              Контакт форм
            </h3>

            {isSent ? (
              <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-200 text-xs">
                Дякуємо! Ваше повідомлення надіслано. Менеджер зв'яжеться з вами найближчим часом.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ім'я"
                      className="w-full bg-transparent border-b border-zinc-700 focus:border-white text-zinc-100 placeholder-zinc-500 pb-2 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Електронна пошта"
                      className="w-full bg-transparent border-b border-zinc-700 focus:border-white text-zinc-100 placeholder-zinc-500 pb-2 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Повідомлення"
                    className="w-full bg-transparent border-b border-zinc-700 focus:border-white text-zinc-100 placeholder-zinc-500 pb-2 focus:outline-none transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded-full border border-zinc-400 hover:border-white text-zinc-200 hover:text-white text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer"
                  >
                    Надіслати
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Нижній копірайт */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-light">
          <p>Titanium piercing jewelry - YANTI</p>
          <p>© {new Date().getFullYear()} YANTI TITANIUM</p>
        </div>
      </div>
    </footer>
  );
};
