import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Clock,
  Phone,
  MessageCircle,
  Menu as MenuIcon,
  X,
  MapPin,
  CalendarDays,
  Globe,
} from 'lucide-react';
import { Language } from '../types';
import { RESTAURANT_INFO, getLiveStatus } from '../data/restaurantData';
import { TRANSLATIONS } from '../data/translations';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  onOpenBooking,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const liveStatus = getLiveStatus(lang);
  const t = TRANSLATIONS[lang];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#141210]/95 backdrop-blur-md border-b border-[#2d2925]">
      {/* Top micro-bar for quick contact and live status */}
      <div className="hidden md:flex justify-between items-center px-6 py-1.5 text-xs text-[#b8afa3] bg-[#0d0c0a] border-b border-[#22201c]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#d8cfc4]">
            <MapPin className="w-3.5 h-3.5 text-[#c49b45]" />
            {RESTAURANT_INFO.neighborhood}
          </span>
          <span className="text-[#453f38]">•</span>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                liveStatus.isOpen
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-amber-500'
              }`}
            />
            <span
              className={
                liveStatus.isOpen
                  ? 'text-emerald-400 font-medium'
                  : 'text-amber-400 font-medium'
              }
            >
              {liveStatus.statusBadge}
            </span>
            <span className="text-[#8e8579]">({liveStatus.nextChange})</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${RESTAURANT_INFO.phoneRaw}`}
            className="flex items-center gap-1 hover:text-[#c49b45] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#c49b45]" />
            <span>{RESTAURANT_INFO.phone}</span>
          </a>
          <span className="text-[#453f38]">•</span>
          <a
            href={`https://wa.me/${RESTAURANT_INFO.whatsappRaw}?text=${encodeURIComponent(
              lang === 'it'
                ? 'Salve Chef Box - Le Bistrot! Vorrei informazioni.'
                : 'Hello Chef Box - Le Bistrot! I would like some information.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Rapido</span>
          </a>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Neighborhood Title */}
          <div
            onClick={() => scrollTo('hero')}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#c49b45] to-[#8d6923] p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-[#171513] rounded-[6px] flex items-center justify-center group-hover:bg-[#1e1b18] transition-colors">
                <UtensilsCrossed className="w-5 h-5 text-[#c49b45]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-[#f4efe6]">
                  Chef Box
                </span>
                <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-[#2e2923] text-[#c49b45] border border-[#4a3f32] font-semibold">
                  Le Bistrot
                </span>
              </div>
              <p className="text-[11px] text-[#a0978b] font-sans tracking-wide">
                Roma • Tuscolano Curione
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => scrollTo('menu')}
              className="text-sm font-medium text-[#d8cfc4] hover:text-[#c49b45] transition-colors cursor-pointer"
            >
              {t.nav.menu}
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="text-sm font-medium text-[#d8cfc4] hover:text-[#c49b45] transition-colors cursor-pointer"
            >
              {t.nav.story}
            </button>
            <button
              onClick={() => scrollTo('booking')}
              className="text-sm font-medium text-[#d8cfc4] hover:text-[#c49b45] transition-colors cursor-pointer"
            >
              {t.nav.booking}
            </button>
            <button
              onClick={() => scrollTo('reviews')}
              className="text-sm font-medium text-[#d8cfc4] hover:text-[#c49b45] transition-colors cursor-pointer"
            >
              {t.nav.reviews}
            </button>
            <button
              onClick={() => scrollTo('location')}
              className="text-sm font-medium text-[#d8cfc4] hover:text-[#c49b45] transition-colors cursor-pointer"
            >
              {t.nav.location}
            </button>
          </nav>

          {/* Action buttons & Language Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-[#23201d] rounded-lg p-1 border border-[#3b352e]">
              <Globe className="w-3.5 h-3.5 text-[#a0978b] ml-1.5 mr-1" />
              <button
                onClick={() => onLanguageChange('it')}
                className={`px-2 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                  lang === 'it'
                    ? 'bg-[#c49b45] text-[#121110] shadow-sm'
                    : 'text-[#9c9387] hover:text-white'
                }`}
              >
                IT
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#c49b45] text-[#121110] shadow-sm'
                    : 'text-[#9c9387] hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Quick WhatsApp button */}
            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsappRaw}?text=${encodeURIComponent(
                lang === 'it'
                  ? 'Salve Chef Box - Le Bistrot! Vorrei informazioni su menu e disponibilità.'
                  : 'Hello Chef Box - Le Bistrot! I would like information regarding the menu and table availability.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="p-2.5 rounded-lg bg-[#25d366]/15 hover:bg-[#25d366]/25 text-[#25d366] border border-[#25d366]/30 transition-all cursor-pointer"
              title="Chat WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            {/* Primary Reserve Table CTA */}
            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#c49b45] to-[#a37c2b] text-[#121110] font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <CalendarDays className="w-4 h-4 text-[#121110]" />
              <span>{t.nav.bookTableBtn}</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex sm:hidden items-center gap-2">
            {/* Language toggle for mobile */}
            <button
              onClick={() => onLanguageChange(lang === 'it' ? 'en' : 'it')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#23201d] text-xs font-semibold text-[#c49b45] border border-[#3b352e]"
            >
              <Globe className="w-3 h-3" />
              <span>{lang.toUpperCase()}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#d8cfc4] hover:bg-[#23201d] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#c49b45]" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#2d2925] bg-[#171513] px-5 py-6 space-y-4 shadow-2xl">
          {/* Live status badge mobile */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#201d19] border border-[#302b25]">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  liveStatus.isOpen
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-amber-500'
                }`}
              />
              <span className="text-xs font-medium text-[#d8cfc4]">
                {liveStatus.statusBadge}
              </span>
            </div>
            <span className="text-[11px] text-[#9c9387]">
              {liveStatus.nextChange}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-2">
            <button
              onClick={() => scrollTo('menu')}
              className="w-full text-left py-2.5 px-3 rounded-md text-sm font-medium text-[#f4efe6] hover:bg-[#23201d] transition-colors"
            >
              🍽️ {t.nav.menu}
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="w-full text-left py-2.5 px-3 rounded-md text-sm font-medium text-[#f4efe6] hover:bg-[#23201d] transition-colors"
            >
              ✨ {t.nav.story}
            </button>
            <button
              onClick={() => scrollTo('booking')}
              className="w-full text-left py-2.5 px-3 rounded-md text-sm font-medium text-[#f4efe6] hover:bg-[#23201d] transition-colors"
            >
              📅 {t.nav.booking}
            </button>
            <button
              onClick={() => scrollTo('reviews')}
              className="w-full text-left py-2.5 px-3 rounded-md text-sm font-medium text-[#f4efe6] hover:bg-[#23201d] transition-colors"
            >
              ⭐ {t.nav.reviews}
            </button>
            <button
              onClick={() => scrollTo('location')}
              className="w-full text-left py-2.5 px-3 rounded-md text-sm font-medium text-[#f4efe6] hover:bg-[#23201d] transition-colors"
            >
              📍 {t.nav.location}
            </button>
          </div>

          <div className="pt-3 border-t border-[#2d2925] flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#c49b45] to-[#a37c2b] text-[#121110] font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              <CalendarDays className="w-4 h-4 text-[#121110]" />
              {t.nav.bookTableBtn}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${RESTAURANT_INFO.phoneRaw}`}
                className="py-2.5 px-3 rounded-lg bg-[#23201d] border border-[#3b352e] text-[#f4efe6] text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#c49b45]" />
                {t.nav.call}
              </a>
              <a
                href={`https://wa.me/${RESTAURANT_INFO.whatsappRaw}?text=${encodeURIComponent(
                  lang === 'it'
                    ? 'Salve! Vorrei prenotare un tavolo a Chef Box Le Bistrot.'
                    : 'Hello! I would like to book a table at Chef Box Le Bistrot.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-lg bg-[#25d366]/20 border border-[#25d366]/30 text-[#25d366] text-xs font-semibold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
