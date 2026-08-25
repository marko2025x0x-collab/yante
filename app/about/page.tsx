import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Sparkles, Award, Microscope, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
      
      {/* Заголовок */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white border border-slate-300 rounded-full text-xs uppercase tracking-[0.25em] text-slate-800 font-bold shadow-sm">
          <Sparkles size={13} className="text-amber-500" />
          <span>Студійний стандарт пірсингу</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold uppercase tracking-tight text-slate-950 leading-tight">
          Імплантаційний титан <br />
          <span className="text-slate-600">ASTM F-136 (Ti-6Al-4V ELI)</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
          Бренд YANTI створений для того, щоб надати кожному поціновувачу пірсингу прикраси найвищого світового рівня безпеки, які використовуються у хірургії та топових світових студіях.
        </p>
      </div>

      {/* Головне фото лабораторії / макро */}
      <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 shadow-lg">
        <Image
          src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1600&auto=format&fit=crop"
          alt="YANTI Titanium Materials"
          fill
          className="object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* 3 Стовпи безпеки YANTI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm">
          <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl w-fit text-slate-900">
            <Microscope size={22} />
          </div>
          <h3 className="text-base font-bold uppercase tracking-wider text-slate-900">
            1. Хімічна чистота ELI
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Маркування ELI (Extra Low Interstitials) гарантує наднизький вміст вуглецю, кисню та заліза. Сплав не кородує та не виділяє іони у тканини тіла.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm">
          <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl w-fit text-slate-900">
            <Award size={22} />
          </div>
          <h3 className="text-base font-bold uppercase tracking-wider text-slate-900">
            2. Дзеркальне полірування Mirror Finish
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Шорсткість поверхні Ra &lt; 0.025 μm унеможливлює налипання біологічних виділень, грануляцій та утворення бактеріальних біоплівок.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm">
          <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl w-fit text-slate-900">
            <ShieldCheck size={22} />
          </div>
          <h3 className="text-base font-bold uppercase tracking-wider text-slate-900">
            3. Безрізьбові замки Push-in
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Штифтові фіксатори забезпечують ідеально гладкий вхід у канал проколу без різьбових насічок, які можуть пошкодити стінки свіжої рани.
          </p>
        </div>

      </div>

      {/* Наука анодування */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 space-y-5 shadow-sm">
        <h2 className="text-2xl font-serif uppercase tracking-wider text-slate-950 font-bold">
          Як працює електрохімічне анодування?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Ми не використовуємо жодних лаків, барвників або фарб. При подачі стабілізованого електричного струму у спеціальному електроліті на поверхні титану утворюється прозорий оксидний шар TiO₂ певної нанометрової товщини. Завдяки явищу світлової інтерференції ми бачимо сяючі кольори: золото, рожеве золото, фіолетовий, синій або бронзу. Це на 100% біосумісно.
        </p>

        <div className="pt-2">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-950 hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
          >
            <span>Переглянути каталог пірсингу</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

    </div>
  );
}
