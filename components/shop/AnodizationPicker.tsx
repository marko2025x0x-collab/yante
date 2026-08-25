'use client';

import React from 'react';
import { AnodizationOption } from '@/types/product';
import { Sparkles, Zap, Check } from 'lucide-react';

interface AnodizationPickerProps {
  options: AnodizationOption[];
  selectedOption: AnodizationOption;
  onSelect: (option: AnodizationOption) => void;
  isAnodized: boolean;
  onToggleAnodized: (enabled: boolean) => void;
}

export const AnodizationPicker: React.FC<AnodizationPickerProps> = ({
  options,
  selectedOption,
  onSelect,
  isAnodized,
  onToggleAnodized,
}) => {
  // Список кольорів для анодування (крім натурального базового)
  const coloredOptions = options.filter((o) => o.id !== 'natural');

  return (
    <div className="space-y-3.5">
      {/* Заголовок блоку */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Zap size={14} className="text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Анодування (з таблиці «Додатково»):
          </span>
        </div>
        <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
          +50 ₴ / шт
        </span>
      </div>

      {/* 1. Два перемикачі: "Без анодування" vs "З анодуванням" */}
      <div className="grid grid-cols-2 gap-2.5">
        
        {/* Кнопка "Без анодування" */}
        <button
          type="button"
          onClick={() => {
            onToggleAnodized(false);
            const natural = options.find((o) => o.id === 'natural') || options[0];
            onSelect(natural);
          }}
          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
            !isAnodized
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-1 ring-slate-900'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-white'
          }`}
        >
          <div className="space-y-0.5">
            <span className="text-xs font-bold block">Без анодування</span>
            <span className={`text-[10px] block ${!isAnodized ? 'text-slate-300' : 'text-slate-500'}`}>
              0 ₴ • Натуральний титан
            </span>
          </div>
          <span
            className="w-4 h-4 rounded-full border border-slate-300 shrink-0 ml-2"
            style={{ backgroundColor: '#D1D5DB' }}
          />
        </button>

        {/* Кнопка "З анодуванням" */}
        <button
          type="button"
          onClick={() => {
            onToggleAnodized(true);
            if (selectedOption.id === 'natural') {
              onSelect(coloredOptions[0]);
            }
          }}
          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
            isAnodized
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-1 ring-slate-900'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-white'
          }`}
        >
          <div className="space-y-0.5">
            <span className="text-xs font-bold block flex items-center gap-1">
              <span>Анодування</span>
              <Sparkles size={11} className="text-amber-400" />
            </span>
            <span className={`text-[10px] block ${isAnodized ? 'text-amber-300 font-medium' : 'text-slate-500'}`}>
              +50 ₴ • Зміна кольору
            </span>
          </div>
          <div className="flex -space-x-1 shrink-0 ml-1">
            <span className="w-3.5 h-3.5 rounded-full border border-slate-400" style={{ backgroundColor: '#F59E0B' }} />
            <span className="w-3.5 h-3.5 rounded-full border border-slate-400" style={{ backgroundColor: '#FB7185' }} />
            <span className="w-3.5 h-3.5 rounded-full border border-slate-400" style={{ backgroundColor: '#38BDF8' }} />
          </div>
        </button>

      </div>

      {/* 2. Палітра кольорів титану (з'являється при активному анодуванні) */}
      {isAnodized && (
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Оберіть колір титану:</span>
            <span className="font-bold text-slate-900 flex items-center gap-1.5 font-mono">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block border border-slate-300"
                style={{ backgroundColor: selectedOption.hex_code }}
              />
              {selectedOption.name}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {coloredOptions.map((opt) => {
              const isSelected = selectedOption.id === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelect(opt)}
                  title={`${opt.name} (${opt.voltage})`}
                  className={`group relative flex flex-col items-center p-1.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-slate-900 shadow-sm ring-1 ring-slate-900 scale-105'
                      : 'bg-white/60 border-slate-200 hover:border-slate-400 hover:bg-white'
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full border border-slate-300 shadow-inner flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: opt.hex_code }}
                  >
                    {isSelected && (
                      <Check
                        size={12}
                        className={
                          ['yellow-gold', 'champagne', 'ice-blue'].includes(opt.id)
                            ? 'text-slate-900'
                            : 'text-white'
                        }
                        strokeWidth={3}
                      />
                    )}
                  </span>
                  <span className="text-[9px] text-slate-700 text-center font-medium mt-1 truncate w-full">
                    {opt.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
