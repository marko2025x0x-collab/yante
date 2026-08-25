import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-slate-500 font-bold block">
          Гарантії та законодавство
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif uppercase tracking-tight text-slate-950 font-bold">
          Обмін та повернення
        </h1>
      </div>

      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-sm">
        
        <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900">
          <AlertTriangle className="shrink-0 mt-0.5 text-amber-700" size={20} />
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-950 mb-1">
              Санітарно-гігієнічні норми (Стаття 9 Закону України «Про захист прав споживачів»)
            </h3>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              Прикраси для пірсингу є предметами особистої гігієни та контактують зі слизовими оболонками та кров'ю/лімфою. Відповідно до Постанови КМУ №172, вироби належної якості зі знятими пломбами чи відкритими пакетами поверненню не підлягають.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold uppercase tracking-wider text-slate-950">
            Коли обмін або повернення можливі?
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={16} />
              <div>
                <strong className="text-slate-950 block mb-0.5">1. Заводський брак або дефект різьби / клікера</strong>
                <span className="text-slate-600 text-xs">Якщо при огляді у відділенні або протягом 14 днів виявлено дефект замка або каменю — миттєва заміна за наш рахунок.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={16} />
              <div>
                <strong className="text-slate-950 block mb-0.5">2. Невідкритий фірмовий блістер / пломба</strong>
                <span className="text-slate-600 text-xs">Якщо ви замовили не той розмір та НЕ відкривали герметичний пакет або пломбу — можливий обмін протягом 14 днів.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <p className="text-slate-600 text-xs">
            Для вирішення будь-яких питань щодо розміру або повернення звертайтесь до нашої служби підтримки у Telegram: <a href="https://t.me" target="_blank" className="text-slate-950 underline font-bold">@yanti_titanium</a>
          </p>
        </div>

      </div>

    </div>
  );
}
