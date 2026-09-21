import React from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  Phone,
  MessageCircle,
  Train,
  Bus,
  Car,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';
import { Language } from '../types';
import {
  RESTAURANT_INFO,
  WEEKLY_HOURS,
  TRANSIT_INFO,
  getLiveStatus,
} from '../data/restaurantData';
import { TRANSLATIONS } from '../data/translations';

interface LocationProps {
  lang: Language;
}

export const LocationSection: React.FC<LocationProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const liveStatus = getLiveStatus(lang);

  // Get current day of week in Rome
  const now = new Date();
  const romeDate = new Date(
    now.toLocaleString('en-US', { timeZone: 'Europe/Rome' })
  );
  const currentDayIndex = romeDate.getDay();

  return (
    <section id="location" className="py-20 bg-[#121110] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201d19] border border-[#383127] text-xs font-semibold text-[#c49b45] uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.location.badge}</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f4efe6] tracking-tight">
            {t.location.title}
          </h2>

          <p className="mt-3 text-base text-[#a69c8e] font-light">
            {t.location.subtitle}
          </p>
        </div>

        {/* 4 Action Buttons on top */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <a
            href={RESTAURANT_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-[#1c1916] hover:bg-[#25211c] border border-[#332c23] hover:border-[#c49b45] text-[#f4efe6] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md group"
          >
            <ExternalLink className="w-4 h-4 text-[#c49b45] group-hover:scale-110 transition-transform" />
            <span>{t.location.openMaps}</span>
          </a>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              RESTAURANT_INFO.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-[#1c1916] hover:bg-[#25211c] border border-[#332c23] hover:border-[#c49b45] text-[#f4efe6] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md group"
          >
            <Navigation className="w-4 h-4 text-[#c49b45] group-hover:scale-110 transition-transform" />
            <span>{t.location.getDirections}</span>
          </a>

          <a
            href={`tel:${RESTAURANT_INFO.phoneRaw}`}
            className="p-3.5 rounded-xl bg-[#1c1916] hover:bg-[#25211c] border border-[#332c23] hover:border-[#c49b45] text-[#f4efe6] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md group"
          >
            <Phone className="w-4 h-4 text-[#c49b45] group-hover:scale-110 transition-transform" />
            <span>{t.location.callUs}</span>
          </a>

          <a
            href={`https://wa.me/${RESTAURANT_INFO.whatsappRaw}?text=${encodeURIComponent(
              lang === 'it'
                ? 'Salve Chef Box - Le Bistrot! Vorrei informazioni su orari e indicazioni.'
                : 'Hello Chef Box - Le Bistrot! I would like information regarding directions and hours.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-[#25d366]/20 hover:bg-[#25d366]/30 border border-[#25d366]/40 text-[#25d366] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md group"
          >
            <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>{t.location.whatsappUs}</span>
          </a>
        </div>

        {/* Content Layout: Hours & Transit on left, Map on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Weekly Hours & Transit Directions */}
          <div className="lg:col-span-6 space-y-6">
            {/* Opening Hours Card */}
            <div className="p-6 rounded-2xl bg-[#171513] border border-[#2d2822] shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#25211c] mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#c49b45]" />
                  <h3 className="font-serif-display text-lg font-bold text-[#f4efe6]">
                    {t.location.hoursTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
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
                        ? 'text-emerald-400 font-semibold'
                        : 'text-amber-400 font-semibold'
                    }
                  >
                    {liveStatus.statusBadge}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {WEEKLY_HOURS.map((item) => {
                  const isToday = item.dayIndex === currentDayIndex;
                  return (
                    <div
                      key={item.dayIndex}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-xs sm:text-sm transition-colors ${
                        isToday
                          ? 'bg-[#29231a] border border-[#c49b45]/50 font-bold text-white shadow-sm'
                          : 'text-[#bbb0a2] hover:bg-[#1e1b18]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.day[lang]}</span>
                        {isToday && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#c49b45] text-black font-extrabold uppercase">
                            {t.location.todayBadge}
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        {item.isClosed ? (
                          <span className="text-[#877c6e] italic">
                            {t.location.closed}
                          </span>
                        ) : (
                          <div className="space-x-2">
                            <span className="text-[#a49a8c]">{item.lunch}</span>
                            <span className="text-[#554d42]">•</span>
                            <span className="text-[#e2dacd]">{item.dinner}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transit & Metro Directions */}
            <div className="p-6 rounded-2xl bg-[#171513] border border-[#2d2822] shadow-xl space-y-4">
              <h3 className="font-serif-display text-lg font-bold text-[#f4efe6] flex items-center gap-2">
                <Train className="w-5 h-5 text-[#c49b45]" />
                <span>{t.location.transitTitle}</span>
              </h3>

              <div className="space-y-3">
                {/* Metro Stations */}
                {TRANSIT_INFO.metro.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#1e1b18] border border-[#2e2922] flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-950/80 text-rose-400 font-bold text-xs flex items-center justify-center shrink-0 border border-rose-800/40">
                      A
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#f4efe6]">
                        {m.line} - Stazione {m.station}
                      </h4>
                      <p className="text-xs text-[#9e9486] mt-0.5">
                        {m.distance[lang]}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Bus Lines */}
                {TRANSIT_INFO.bus.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#1e1b18] border border-[#2e2922] flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-950/80 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-800/40">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#f4efe6]">
                        {b.lines} ({b.stop[lang]})
                      </h4>
                      <p className="text-xs text-[#9e9486] mt-0.5">
                        {b.distance[lang]}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Parking info */}
                <div className="p-3 rounded-xl bg-[#1e1b18] border border-[#2e2922] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-sky-950/80 text-sky-400 font-bold text-xs flex items-center justify-center shrink-0 border border-sky-800/40">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#f4efe6]">
                      {lang === 'it' ? 'Parcheggio' : 'Parking'}
                    </h4>
                    <p className="text-xs text-[#9e9486] mt-0.5">
                      {TRANSIT_INFO.parking[lang]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Address Details & Google Maps Embed */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl bg-[#171513] border border-[#2d2822] shadow-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#c49b45] uppercase tracking-wider">
                  {t.location.addressTitle}
                </span>
                <p className="font-serif-display text-lg font-bold text-white mt-1">
                  {RESTAURANT_INFO.address}
                </p>
                <p className="text-xs text-[#8c8273]">
                  {RESTAURANT_INFO.neighborhood}
                </p>
              </div>

              <a
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#c49b45] text-black font-bold text-xs hover:brightness-110 transition-all shrink-0"
              >
                Maps →
              </a>
            </div>

            {/* Embedded Responsive Google Map */}
            <div className="rounded-2xl overflow-hidden border border-[#2d2822] shadow-2xl h-[420px] bg-[#1a1714] relative">
              <iframe
                title="Chef Box Le Bistrot Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2972.193139366472!2d12.551801276510344!3d41.859666066779435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132589e4c194511d%3A0xebe66f809930f782!2sVia%20Scribonio%20Curione%2C%2065%2C%2000175%20Roma%20RM!5e0!3m2!1sen!2sit!4v1710000000000!5m2!1sen!2sit"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(90%)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
