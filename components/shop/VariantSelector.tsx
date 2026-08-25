'use client';

import React from 'react';
import { ProductVariant } from '@/types/product';
import { Ruler, Tag } from 'lucide-react';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
}) => {
  // Групування за калібром якщо є декілька калібрів
  const uniqueGauges = Array.from(new Set(variants.map((v) => v.gauge)));
  
  // Якщо є поділ на калібри (напр. 1.2мм vs 1.6мм), фільтруємо розміри для поточного калібру
  const currentGaugeVariants = uniqueGauges.length > 1
    ? variants.filter((v) => v.gauge === selectedVariant.gauge)
    : variants;

  const handleGaugeChange = (gauge: string) => {
    const matched = variants.find(
      (v) => v.gauge === gauge && v.length_or_diameter === selectedVariant.length_or_diameter
    ) || variants.find((v) => v.gauge === gauge) || variants[0];
    onSelectVariant(matched);
  };

  return (
    <div className="space-y-3.5">
      
      {/* 1. Вибір калібру / товщини (якщо у виробу кілька калібрів 1.2 / 1.6) */}
      {uniqueGauges.length > 1 && (
        <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Товщина (Модифікація):
            </span>
            <span className="text-xs text-slate-700 font-mono font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
              {selectedVariant.gauge}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueGauges.map((g) => {
              const isSelected = selectedVariant.gauge === g;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGaugeChange(g)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-white'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Точний вибір розміру та артикулу з таблиці (напр. 1.2*8мм, 1.6*10*4/6мм) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Ruler size={13} className="text-slate-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Розмір за каталогом:
            </span>
          </div>
          {selectedVariant.sku && (
            <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
              <Tag size={11} className="text-slate-400" />
              <span>Артикул: <strong className="text-slate-900">{selectedVariant.sku}</strong></span>
            </span>
          )}
        </div>

        {/* Плитка кнопок точних розмірів */}
        <div className="flex flex-wrap gap-2">
          {currentGaugeVariants.map((v) => {
            const isSelected = selectedVariant.id === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectVariant(v)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all duration-200 border flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm font-bold ring-1 ring-slate-900'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-white'
                }`}
              >
                <span>{v.length_or_diameter}</span>
                {v.price_adjustment > 0 && (
                  <span className={`text-[10px] ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`}>
                    +{v.price_adjustment}₴
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
