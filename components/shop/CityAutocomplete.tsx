'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { UKRAINE_SETTLEMENTS, UKRAINE_REGIONS, UkraineSettlement } from '@/lib/data/ukraineCities';
import { MapPin, Search, ChevronDown, Check, Building } from 'lucide-react';

interface CityAutocompleteProps {
  value: string;
  onChange: (cityWithRegion: string) => void;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [selectedRegion, setSelectedRegion] = useState('Всі області');
  const containerRef = useRef<HTMLDivElement>(null);

  // Синхронізація зі змінами значення ззовні
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Закриття при кліку поза межами
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Фільтрація населених пунктів
  const filteredSettlements = useMemo(() => {
    const q = query.trim().toLowerCase();

    return UKRAINE_SETTLEMENTS.filter((item) => {
      // Фільтр за областю
      if (selectedRegion !== 'Всі області' && !item.region.toLowerCase().includes(selectedRegion.toLowerCase())) {
        return false;
      }

      if (!q) return true;

      const matchesName = item.name.toLowerCase().includes(q);
      const matchesRegion = item.region.toLowerCase().includes(q);
      return matchesName || matchesRegion;
    }).slice(0, 25);
  }, [query, selectedRegion]);

  const handleSelect = (item: UkraineSettlement) => {
    const formatted = item.region === 'Київська' && item.name === 'Київ'
      ? 'м. Київ'
      : `м. ${item.name} (${item.region} обл.)`;
    setQuery(formatted);
    onChange(formatted);
    setIsOpen(false);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative space-y-1.5 select-none">
      <label className="text-xs text-slate-700 font-bold uppercase tracking-wider block">
        Населений пункт (будь-яке місто / смт / село в Україні) *
      </label>

      {/* Поле вводу з іконкою */}
      <div className="relative">
        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        
        <input
          type="text"
          required
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={handleCustomChange}
          placeholder="Почніть вводити місто, смт або село (напр. Бровари, Стрий, Умань)..."
          className="w-full pl-9 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white"
        />

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
        >
          <ChevronDown size={15} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Випадаючий список міст та областей */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 space-y-2 max-h-80 overflow-hidden flex flex-col animate-fadeIn text-xs">
          
          {/* Фільтр по області */}
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider shrink-0">
              Область:
            </span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1 focus:outline-none font-medium"
            >
              {UKRAINE_REGIONS.map((reg) => (
                <option key={reg} value={reg}>
                  {reg === 'Всі області' ? 'Всі області України' : `${reg} область`}
                </option>
              ))}
            </select>
          </div>

          {/* Список знайдених міст */}
          <div className="overflow-y-auto max-h-56 space-y-1 pr-1">
            {filteredSettlements.length === 0 ? (
              <div className="p-4 text-center text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">Населений пункт не знайдено в швидкому списку</p>
                <p className="text-[11px] text-slate-500">
                  Ви можете продовжити оформлення: введіть точну назву вашого села або міста та номер відділення/поштомату вручну.
                </p>
              </div>
            ) : (
              filteredSettlements.map((item, idx) => (
                <button
                  key={`${item.name}-${item.region}-${idx}`}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors flex items-center justify-between group border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-2.5">
                    <Building size={14} className="text-slate-400 group-hover:text-slate-900" />
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {item.type === 'місто' ? 'м.' : item.type === 'смт' ? 'смт' : 'с.'} {item.name}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {item.region} область
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 group-hover:text-slate-900 font-medium">
                    Обрати
                  </span>
                </button>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
};
