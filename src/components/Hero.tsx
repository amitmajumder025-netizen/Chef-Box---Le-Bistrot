import React from 'react';
import {
  Star,
  CalendarDays,
  UtensilsCrossed,
  MessageCircle,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { Language } from '../types';
import { RESTAURANT_INFO, getLiveStatus } from '../data/restaurantData';
import { TRANSLATIONS } from '../data/translations';

interface HeroProps {
  lang: Language;
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onOpenBooking }) => {
  const t = TRANSLATIONS[lang];
  const liveStatus = getLiveStatus(lang);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-8 pb-16">
      {/* Background imagery with atmospheric dark gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=2000&q=80"
          alt="Bistrot Restaurant Atmosphere"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.28] contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/80 to-transparent" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#121110]/50 to-[#121110]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Badges: Neighborhood + Live Status + Google Rating */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-6">
          {/* Neighborhood badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#201d19]/90 border border-[#3b352e] text-xs font-medium text-[#c49b45] shadow-sm backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5 text-[#c49b45]" />
            {t.hero.subBadge}
          </span>

          {/* Real-time Status Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b1916]/90 border border-[#38332b] text-xs font-medium text-[#f4efe6] shadow-sm backdrop-blur-sm">
            <span
              className={`w-2 h-2 rounded-full ${
                liveStatus.isOpen
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-amber-500'
              }`}
            />
            <span
              className={
                liveStatus.isOpen ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'
              }
            >
              {liveStatus.statusBadge}
            </span>
            <span className="text-[#9e9587] text-[11px] hidden sm:inline">
              • {liveStatus.nextChange}
            </span>
          </span>

          {/* Google Rating Badge */}
          <a
            href={RESTAURANT_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e1b18]/90 border border-[#443b2f] text-xs font-medium text-[#f4efe6] hover:border-[#c49b45] transition-colors shadow-sm backdrop-blur-sm group"
          >
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="font-bold text-[#f4efe6]">{RESTAURANT_INFO.googleRating}</span>
            <span className="text-[#a49b8e] group-hover:text-[#c49b45] transition-colors">
              (180+ Google)
            </span>
          </a>
        </div>

        {/* Main Display Headline */}
        <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#f4efe6] leading-[1.12] mb-6 max-w-4xl">
          {t.hero.headline1}
          <br />
          <span className="italic font-normal text-[#c49b45]">
            {t.hero.headline2}
          </span>
        </h1>

        {/* Descriptive Subtitle */}
        <p className="font-sans-body text-base sm:text-lg text-[#ccc2b4] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          {t.hero.description}
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto mb-12">
          {/* Primary Reservation CTA */}
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#c49b45] via-[#d4ad53] to-[#a37c2b] text-[#121110] font-bold text-base hover:brightness-110 active:scale-98 transition-all shadow-xl shadow-[#c49b45]/15 flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <CalendarDays className="w-5 h-5 text-[#121110] group-hover:rotate-6 transition-transform" />
            <span>{t.hero.reserveBtn}</span>
          </button>

          {/* Quick WhatsApp Chat */}
          <a
            href={`https://wa.me/${RESTAURANT_INFO.whatsappRaw}?text=${encodeURIComponent(
              lang === 'it'
                ? 'Salve Chef Box - Le Bistrot! Vorrei informazioni su prenotazioni e menu.'
                : 'Hello Chef Box - Le Bistrot! I would like information regarding reservations and menu.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#25d366]/20 hover:bg-[#25d366]/30 text-[#25d366] font-semibold text-base border border-[#25d366]/40 transition-all flex items-center justify-center gap-2.5 backdrop-blur-sm cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t.hero.whatsappBtn}</span>
          </a>

          {/* View Menu */}
          <button
            onClick={() => scrollToSection('menu')}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#201d19]/90 hover:bg-[#2a2621] text-[#f4efe6] font-medium text-base border border-[#3b352e] hover:border-[#c49b45]/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UtensilsCrossed className="w-4 h-4 text-[#c49b45]" />
            <span>{t.hero.menuBtn}</span>
          </button>
        </div>

        {/* 4 Characteristic Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-4xl pt-4 border-t border-[#292521]/80">
          <div className="p-3 rounded-lg bg-[#181614]/80 border border-[#2c2823] flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#c49b45] shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-[#d8cfc4]">
              {t.hero.feature1}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#181614]/80 border border-[#2c2823] flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-[#c49b45] shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-[#d8cfc4]">
              {t.hero.feature2}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#181614]/80 border border-[#2c2823] flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#c49b45] shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-[#d8cfc4]">
              {t.hero.feature3}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#181614]/80 border border-[#2c2823] flex items-center justify-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-[#c49b45] shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-[#d8cfc4]">
              {t.hero.feature4}
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollToSection('about')}
          className="mt-10 text-[#8e8579] hover:text-[#c49b45] transition-colors flex flex-col items-center gap-1 cursor-pointer animate-bounce"
          aria-label="Scroll down"
        >
          <span className="text-[11px] uppercase tracking-widest font-mono">Scopri di più</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
