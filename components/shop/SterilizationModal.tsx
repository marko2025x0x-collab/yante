'use client';

import React from 'react';
import { X, ShieldCheck, Sparkles, CheckCircle, Package } from 'lucide-react';

interface SterilizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SterilizationModal: React.FC<SterilizationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
        {/* Закрити */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1.5 rounded-full hover:bg-zinc-800"
          aria-label="Закрити"
        >
          <X size={20} />
        </button>

        {/* Заголовок */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-200">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-wide">Передпродажна стерилізація</h3>
            <p className="text-xs text-zinc-400">Гарантія 100% стерильності за стандартом ISO 11140-1</p>
          </div>
        </div>

        {/* Переваги */}
        <div className="space-y-4 text-sm text-zinc-300">
          <div className="flex items-start gap-3 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80">
            <Sparkles className="text-amber-400 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-semibold text-white">Повна професійна обробка</p>
              <p className="text-xs text-zinc-400 mt-0.5">Знищує всі види бактерій та мікроорганізмів перед відправкою клієнту.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80">
            <Package className="text-sky-400 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-semibold text-white">Індивідуальний медичний крафт-пакет</p>
              <p className="text-xs text-zinc-400 mt-0.5">Кожна прикраса запаюється в герметичний пакет із вбудованим хімічним індикатором стерильності.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80">
            <CheckCircle className="text-emerald-400 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-semibold text-white">Готово до негайної установки</p>
              <p className="text-xs text-zinc-400 mt-0.5">Майстер або ви можете встановлювати прикрасу у свіжий або загоєний прокол одразу після відкриття пакета.</p>
            </div>
          </div>
        </div>

        {/* Кнопка зрозуміло */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-white text-black font-semibold text-xs rounded-xl uppercase tracking-wider hover:bg-zinc-200 transition-colors"
        >
          Зрозуміло
        </button>
      </div>
    </div>
  );
};
