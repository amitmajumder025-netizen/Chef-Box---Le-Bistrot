import React from 'react';
import { Phone, MessageCircle, MapPin, CalendarDays } from 'lucide-react';
import { Language } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { TRANSLATIONS } from '../data/translations';

interface MobileStickyBarProps {
  lang: Language;
  onOpenBooking: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  lang,
  onOpenBooking,
}) => {
  const t = TRANSLATIONS[lang];

  const scrollToLocation = () => {
    const el = document.getElementById('location');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#141210]/95 backdrop-blur-lg border-t border-[#2e2924] px-2 py-2 shadow-[0_-8px_25px_rgba(0,0,0,0.6)]">
      <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto">
        {/* 1. Call */}
        <a
          href={`tel:${RESTAURANT_INFO.phoneRaw}`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#1c1916] text-[#d8cfc4] hover:text-white border border-[#302a23] active:scale-95 transition-all text-center"
        >
          <Phone className="w-4 h-4 text-[#c49b45] mb-1" />
          <span className="text-[10px] font-medium leading-none">
            {t.mobileBar.call}
          </span>
        </a>

        {/* 2. WhatsApp */}
        <a
          href={`https://wa.me/${RESTAURANT_INFO.whatsappRaw}?text=${encodeURIComponent(
            lang === 'it'
              ? 'Salve Chef Box - Le Bistrot! Vorrei informazioni.'
              : 'Hello Chef Box - Le Bistrot! I would like some information.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#25d366]/15 text-[#25d366] hover:bg-[#25d366]/25 border border-[#25d366]/30 active:scale-95 transition-all text-center"
        >
          <MessageCircle className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-bold leading-none">
            {t.mobileBar.whatsapp}
          </span>
        </a>

        {/* 3. Directions / Map */}
        <button
          onClick={scrollToLocation}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#1c1916] text-[#d8cfc4] hover:text-white border border-[#302a23] active:scale-95 transition-all text-center cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-[#c49b45] mb-1" />
          <span className="text-[10px] font-medium leading-none">
            {t.mobileBar.map}
          </span>
        </button>

        {/* 4. Book Table */}
        <button
          onClick={onOpenBooking}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-gradient-to-r from-[#c49b45] to-[#a37c2b] text-[#121110] font-bold active:scale-95 transition-all text-center shadow-md cursor-pointer"
        >
          <CalendarDays className="w-4 h-4 text-[#121110] mb-1" />
          <span className="text-[10px] font-bold leading-none">
            {t.mobileBar.book}
          </span>
        </button>
      </div>
    </div>
  );
};
