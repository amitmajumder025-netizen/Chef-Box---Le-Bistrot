import React from 'react';
import {
  Wheat,
  Wine,
  HeartHandshake,
  Award,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AboutProps {
  lang: Language;
}

export const AboutSection: React.FC<AboutProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  const pillarIcons = [
    <Award className="w-5 h-5 text-[#c49b45]" key="award" />,
    <Wheat className="w-5 h-5 text-[#c49b45]" key="wheat" />,
    <Wine className="w-5 h-5 text-[#c49b45]" key="wine" />,
    <HeartHandshake className="w-5 h-5 text-[#c49b45]" key="heart" />,
  ];

  return (
    <section id="about" className="py-20 bg-[#161412] border-t border-b border-[#292521] relative overflow-hidden">
      {/* Decorative subtle texture */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c49b45]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#b85a3a]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#24201c] border border-[#3d362e] text-xs font-semibold text-[#c49b45] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.about.badge}</span>
            </div>

            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f4efe6] tracking-tight leading-tight">
              {t.about.title}
            </h2>

            <div className="space-y-4 text-[#cfc5b8] font-sans-body leading-relaxed text-base sm:text-lg font-light">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
            </div>

            {/* Quick value badges */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#e6ded3]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c49b45] shrink-0" />
                <span>Pecorino Romano DOP & Guanciale d'Amatrice</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c49b45] shrink-0" />
                <span>Impasti leggeri a 72 ore ad alta idratazione</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c49b45] shrink-0" />
                <span>Etichette laziali & cantina indipendente</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c49b45] shrink-0" />
                <span>Accoglienza calorosa autentica romana</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Composite with Italian Bistro Charm */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#38322a] shadow-2xl bg-[#1b1916]">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
                alt="Artisanal Roman Pasta & Pinsa"
                className="w-full h-80 object-cover object-center filter brightness-95 hover:scale-105 transition-transform duration-700"
              />
              <div className="p-6 bg-[#1a1714]">
                <div className="flex items-center justify-between pb-3 border-b border-[#2d2822]">
                  <div>
                    <h3 className="font-serif-display text-lg font-bold text-[#f4efe6]">
                      Chef Box - Le Bistrot
                    </h3>
                    <p className="text-xs text-[#a49b8e]">Via Scribonio Curione, 65 • Roma</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#2e271f] text-[#c49b45] font-mono text-xs border border-[#4d402f]">
                    Est. Roma
                  </span>
                </div>
                <p className="mt-3 text-xs text-[#b8afa3] italic leading-relaxed">
                  "La vera trattoria incontra l’eleganza del bistrot parigino nel cuore del Tuscolano: sapori autentici senza compromessi sulla qualità."
                </p>
              </div>
            </div>

            {/* Floating accent badge */}
            <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-[#c49b45] text-[#121110] p-4 rounded-xl shadow-xl border border-[#e8c87b] flex-col items-center justify-center text-center">
              <span className="font-serif-display text-2xl font-black leading-none">100%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Materie Prime Tipiche</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.about.pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#1a1815] border border-[#2d2924] hover:border-[#c49b45]/40 transition-all hover:-translate-y-1 shadow-md group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#27231e] border border-[#3b342b] flex items-center justify-center mb-4 group-hover:bg-[#c49b45]/15 transition-colors">
                {pillarIcons[idx]}
              </div>
              <h3 className="font-serif-display text-base font-bold text-[#f4efe6] mb-2 group-hover:text-[#c49b45] transition-colors">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#a89f92] leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
