'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { YantiLogo } from '@/components/ui/YantiLogo';

export const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const totalItems = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  );
  const openCart = useCartStore((state) => state.openCart);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/catalog?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#000000] border-b border-zinc-900 select-none">
        
        {/* Верхній службовий рядок (Top utility bar) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1 flex justify-end">
          <div className="hidden sm:flex items-center space-x-6 text-[11px] text-zinc-400 font-medium">
            <Link href="/delivery" className="hover:text-white transition-colors">
              Оплата і доставка
            </Link>
            <Link href="/returns" className="hover:text-white transition-colors">
              Обмін та повернення
            </Link>
            <Link href="/contacts" className="hover:text-white transition-colors">
              Контакти
            </Link>
          </div>
        </div>

        {/* Головний навігаційний рядок з логотипом суворо по центру */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 pt-1">
          <div className="grid grid-cols-3 items-center">
            
            {/* Ліве головне меню (Desktop) / Кнопка мобільного меню (Mobile) */}
            <div className="flex items-center justify-start">
              <nav className="hidden lg:flex items-center space-x-8">
                <Link
                  href="/catalog"
                  className="text-xs uppercase tracking-[0.15em] text-white font-medium relative py-1 border-b-2 border-white"
                >
                  Каталог
                </Link>
                <Link
                  href="/about"
                  className="text-xs uppercase tracking-[0.15em] text-zinc-400 hover:text-white transition-colors font-medium"
                >
                  Про нас
                </Link>
                <Link
                  href="/about#blog"
                  className="text-xs uppercase tracking-[0.15em] text-zinc-400 hover:text-white transition-colors font-medium"
                >
                  Блог
                </Link>
              </nav>

              {/* Мобільна кнопка меню */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-zinc-300 hover:text-white p-2"
                aria-label="Меню"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* Центрований точний логотип YANTI TITANIUM (Суворо по центру) */}
            <div className="flex items-center justify-center text-center py-1">
              <Link href="/" className="group inline-flex items-center justify-center transition-transform duration-300 hover:scale-105">
                <YantiLogo className="h-14 sm:h-18 md:h-22" />
              </Link>
            </div>

            {/* Праві елементи керування: Пошук та Кошик */}
            <div className="flex items-center justify-end space-x-5">
              {/* Пошук */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-zinc-300 hover:text-white transition-colors p-1.5 rounded-full cursor-pointer"
                aria-label="Пошук"
              >
                <Search size={20} strokeWidth={1.75} />
              </button>

              {/* Кошик з індикатором кількості (показується тільки коли > 0) */}
              <button
                onClick={openCart}
                className="relative text-zinc-200 hover:text-white transition-colors p-1.5 group cursor-pointer"
                aria-label="Кошик"
              >
                <ShoppingBag size={21} strokeWidth={1.75} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E11D48] px-1 text-[10px] font-bold text-white shadow-md animate-scaleIn">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Модальне вікно пошуку */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-24 px-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#0F0F0F] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative text-white">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-5 right-5 text-zinc-500 hover:text-white p-1 rounded-full hover:bg-zinc-800"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center border-b border-zinc-800 pb-3 gap-3">
                <Search className="text-zinc-500" size={22} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Пошук у каталозі пірсингу (напр. Лабрет, Клікер, Банан)..."
                  className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none text-base sm:text-lg"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-zinc-200 hover:bg-white text-black font-semibold text-xs rounded-lg uppercase tracking-wider transition-colors"
                >
                  Знайти
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="text-zinc-500">Популярне:</span>
              <Link href="/catalog/labrets" onClick={() => setIsSearchOpen(false)} className="text-zinc-300 hover:text-white underline underline-offset-4">Лабрети</Link>
              <Link href="/catalog/clickers" onClick={() => setIsSearchOpen(false)} className="text-zinc-300 hover:text-white underline underline-offset-4">Клікери з паве</Link>
              <Link href="/catalog/tops-and-ends" onClick={() => setIsSearchOpen(false)} className="text-zinc-300 hover:text-white underline underline-offset-4">Топи з цирконами</Link>
            </div>
          </div>
        </div>
      )}

      {/* Мобільне меню */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/98 backdrop-blur-2xl pt-24 px-8 flex flex-col justify-between pb-12">
          <div className="flex flex-col space-y-5">
            <Link
              href="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base uppercase tracking-[0.2em] text-white font-medium border-b border-zinc-900 pb-3"
            >
              Каталог
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base uppercase tracking-[0.2em] text-zinc-300 hover:text-white border-b border-zinc-900 pb-3"
            >
              Про нас
            </Link>
            <Link
              href="/delivery"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base uppercase tracking-[0.2em] text-zinc-300 hover:text-white border-b border-zinc-900 pb-3"
            >
              Оплата і доставка
            </Link>
            <Link
              href="/returns"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base uppercase tracking-[0.2em] text-zinc-300 hover:text-white border-b border-zinc-900 pb-3"
            >
              Обмін та повернення
            </Link>
            <Link
              href="/contacts"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base uppercase tracking-[0.2em] text-zinc-300 hover:text-white border-b border-zinc-900 pb-3"
            >
              Контакти
            </Link>
          </div>

          <div className="text-center pt-6 border-t border-zinc-900">
            <YantiLogo className="h-10 mx-auto" />
          </div>
        </div>
      )}
    </>
  );
};
