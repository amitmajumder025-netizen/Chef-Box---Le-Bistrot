import React from 'react';
import {
  UtensilsCrossed,
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  Clock,
  Heart,
} from 'lucide-react';
import { Language } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0e0d0c] border-t border-[#221f1b] pt-16 pb-24 md:pb-12 text-[#9a9082] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#c49b45] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#171513] rounded-[6px] flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-[#c49b45]" />
                </div>
              </div>
              <div>
                <span className="font-serif-display text-xl font-bold text-[#f4efe6]">
                  Chef Box
                </span>
                <span className="ml-2 text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#2e2923] text-[#c49b45] border border-[#4a3f32] font-semibold">
                  Le Bistrot
                </span>
              </div>
            </div>

            <p className="text-xs text-[#a39889] leading-relaxed">
              {t.footer.desc}
            </p>

            <div className="text-[11px] text-[#786e61]">
              <p>GPS: 41.8596° N, 12.5532° E</p>
              <p>Cap: 00175 • Municipio VII • Roma Capitale</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif-display text-sm font-bold text-[#f4efe6] uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollTo('menu')}
                  className="hover:text-[#c49b45] transition-colors cursor-pointer"
                >
                  {t.nav.menu}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('about')}
                  className="hover:text-[#c49b45] transition-colors cursor-pointer"
                >
                  {t.nav.story}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('booking')}
                  className="hover:text-[#c49b45] transition-colors cursor-pointer"
                >
                  {t.nav.booking}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('reviews')}
                  className="hover:text-[#c49b45] transition-colors cursor-pointer"
                >
                  {t.nav.reviews}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('location')}
                  className="hover:text-[#c49b45] transition-colors cursor-pointer"
                >
                  {t.nav.location}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Address */}
          <div className="space-y-3">
            <h4 className="font-serif-display text-sm font-bold text-[#f4efe6] uppercase tracking-wider">
              {lang === 'it' ? 'Contatti & Indirizzo' : 'Contact & Address'}
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#c49b45] shrink-0 mt-0.5" />
                <span>{RESTAURANT_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c49b45] shrink-0" />
                <a
                  href={`tel:${RESTAURANT_INFO.phoneRaw}`}
                  className="hover:text-white transition-colors"
                >
                  {RESTAURANT_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25d366] shrink-0" />
                <a
                  href={`https://wa.me/${RESTAURANT_INFO.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  WhatsApp: +39 331 887 8652
                </a>
              </div>
            </div>
          </div>

          {/* Operating Hours Summary */}
          <div className="space-y-3">
            <h4 className="font-serif-display text-sm font-bold text-[#f4efe6] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#c49b45]" />
              <span>{lang === 'it' ? 'Orari di Servizio' : 'Service Hours'}</span>
            </h4>
            <p className="text-xs text-[#a39889] leading-relaxed">
              {t.footer.hoursSummary}
            </p>
            <div className="p-3 rounded-xl bg-[#171513] border border-[#2b2620] space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-white">Mar - Sab:</span>
                <span>12:30-15:30 • 18:30-23:30</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-white">Domenica:</span>
                <span>12:30-16:00 • 19:00-23:30</span>
              </div>
              <div className="flex justify-between text-[11px] text-[#7d7365]">
                <span>Lunedì:</span>
                <span>Chiuso per riposo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 border-t border-[#201d19] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Chef Box - Le Bistrot Roma. {t.footer.rights}</p>

          <div className="flex items-center gap-4">
            <a
              href={RESTAURANT_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#c49b45] hover:underline"
            >
              <span>Google Maps Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-[#3b352e]">•</span>
            <span className="flex items-center gap-1 text-[#786f62]">
              Fatto con cura <Heart className="w-3 h-3 text-[#c49b45] fill-[#c49b45]" /> a Roma
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
