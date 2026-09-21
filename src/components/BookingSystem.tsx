import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  MessageCircle,
  ExternalLink,
  Trash2,
  Sparkles,
  Phone,
  User,
  AlertCircle,
} from 'lucide-react';
import { Language, BookingData } from '../types';
import {
  RESTAURANT_INFO,
  generateWhatsAppBookingUrl,
  generateGoogleCalendarUrl,
} from '../data/restaurantData';
import { TRANSLATIONS } from '../data/translations';

interface BookingSystemProps {
  lang: Language;
  initialNote?: string;
  onClearInitialNote?: () => void;
}

export const BookingSystem: React.FC<BookingSystemProps> = ({
  lang,
  initialNote,
  onClearInitialNote,
}) => {
  const t = TRANSLATIONS[lang];

  // Helper date generators (YYYY-MM-DD)
  const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  // State
  const [selectedDateType, setSelectedDateType] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [customDate, setCustomDate] = useState<string>(getTodayStr());
  const [selectedTime, setSelectedTime] = useState<string>('20:30');
  const [guests, setGuests] = useState<number>(2);
  const [seatingArea, setSeatingArea] = useState<'indoor' | 'outdoor' | 'wine_bar'>('indoor');
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestNotes, setGuestNotes] = useState<string>('');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [submittedBooking, setSubmittedBooking] = useState<BookingData | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedBookings, setSavedBookings] = useState<BookingData[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load bookings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('chefbox_bookings_history');
      if (stored) {
        setSavedBookings(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load bookings from storage', e);
    }
  }, []);

  // Sync initial note passed from menu selection
  useEffect(() => {
    if (initialNote) {
      setGuestNotes((prev) =>
        prev ? `${prev}, Piatto preferito: ${initialNote}` : `Desideriamo ordinare: ${initialNote}`
      );
      if (onClearInitialNote) onClearInitialNote();
    }
  }, [initialNote, onClearInitialNote]);

  // Derived chosen date
  const resolvedDate =
    selectedDateType === 'today'
      ? getTodayStr()
      : selectedDateType === 'tomorrow'
      ? getTomorrowStr()
      : customDate;

  // Available Time Slots for Roman Bistro
  const lunchSlots = ['12:30', '13:00', '13:30', '14:00', '14:30'];
  const dinnerSlots = ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!guestName.trim()) {
      setValidationError(
        lang === 'it'
          ? 'Inserisci il tuo nome per la prenotazione.'
          : 'Please enter your name for the reservation.'
      );
      setActiveStep(3);
      return;
    }

    if (!guestPhone.trim() || guestPhone.length < 6) {
      setValidationError(
        lang === 'it'
          ? 'Inserisci un numero di telefono valido.'
          : 'Please enter a valid phone number.'
      );
      setActiveStep(3);
      return;
    }

    // Generate unique booking code: CB-ROM-XXXX
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const code = `CB-ROM-${randomHex}`;

    const newBooking: BookingData = {
      id: Date.now().toString(),
      code,
      date: resolvedDate,
      time: selectedTime,
      guests,
      seatingArea,
      name: guestName.trim(),
      phone: guestPhone.trim(),
      notes: guestNotes.trim(),
      createdAt: new Date().toISOString(),
    };

    // Save to local storage
    const updated = [newBooking, ...savedBookings.filter((b) => b.code !== code)];
    setSavedBookings(updated);
    try {
      localStorage.setItem('chefbox_bookings_history', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setSubmittedBooking(newBooking);

    // Open WhatsApp directly
    const waUrl = generateWhatsAppBookingUrl(newBooking);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = () => {
    if (!submittedBooking) return;
    const seatingName = {
      indoor: 'Sala Bistrot Interna',
      outdoor: 'Dehors & Terrazza',
      wine_bar: 'Banco Degustazione / Wine Bar',
    }[submittedBooking.seatingArea];

    const message = [
      `🍷 *PRENOTAZIONE TAVOLO - Chef Box Le Bistrot* 🍷`,
      `----------------------------------------`,
      `📌 *Codice Prenotazione:* ${submittedBooking.code}`,
      `👤 *Nome:* ${submittedBooking.name}`,
      `📞 *Telefono:* ${submittedBooking.phone}`,
      `📅 *Data:* ${submittedBooking.date}`,
      `⏰ *Orario:* ${submittedBooking.time}`,
      `👥 *Numero Ospiti:* ${submittedBooking.guests}`,
      `🪑 *Zona:* ${seatingName}`,
      submittedBooking.notes ? `📝 *Note:* ${submittedBooking.notes}` : null,
      `----------------------------------------`,
      `Salve! Vorrei confermare la disponibilità del tavolo. Attendo vostra gentile conferma. Grazie!`,
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDeleteHistory = (id: string) => {
    const filtered = savedBookings.filter((b) => b.id !== id);
    setSavedBookings(filtered);
    try {
      localStorage.setItem('chefbox_bookings_history', JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
  };

  const resetBookingForm = () => {
    setSubmittedBooking(null);
    setActiveStep(1);
  };

  return (
    <section id="booking" className="py-20 bg-[#161412] border-t border-b border-[#292521] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25211c] border border-[#3d3429] text-xs font-semibold text-[#c49b45] uppercase tracking-wider mb-3">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{t.booking.badge}</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f4efe6] tracking-tight">
            {t.booking.title}
          </h2>

          <p className="mt-3 text-base text-[#a69c8e] font-light">
            {t.booking.subtitle}
          </p>

          {/* Toggle for history of bookings */}
          {savedBookings.length > 0 && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs font-semibold text-[#c49b45] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <span>
                  {showHistory
                    ? (lang === 'it' ? 'Nascondi le mie prenotazioni' : 'Hide my bookings')
                    : `${t.booking.myBookings} (${savedBookings.length})`}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Saved Bookings Drawer / List */}
        {showHistory && savedBookings.length > 0 && (
          <div className="mb-10 p-5 rounded-2xl bg-[#1c1916] border border-[#3b342a] shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#2c2720]">
              <h3 className="font-serif-display text-lg font-bold text-[#f4efe6] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#c49b45]" />
                <span>{t.booking.myBookings}</span>
              </h3>
              <span className="text-xs text-[#8c8273]">
                {lang === 'it' ? 'Salvate su questo browser' : 'Saved on this browser'}
              </span>
            </div>

            <div className="space-y-3">
              {savedBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="p-4 rounded-xl bg-[#231f1a] border border-[#363026] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-[#c49b45] px-2 py-0.5 rounded bg-[#181613]">
                        {bk.code}
                      </span>
                      <span className="text-white font-semibold">{bk.name}</span>
                      <span className="text-[#a49a8b]">• {bk.guests} ospiti</span>
                    </div>
                    <p className="text-[#8c8274]">
                      📅 {bk.date} alle {bk.time} | 🪑 {bk.seatingArea}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <a
                      href={generateWhatsAppBookingUrl(bk)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#25d366]/20 text-[#25d366] font-semibold border border-[#25d366]/30 flex items-center gap-1 hover:bg-[#25d366]/30 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <button
                      onClick={() => handleDeleteHistory(bk.id)}
                      className="p-1.5 rounded-lg text-[#8c8274] hover:text-rose-400 hover:bg-[#1a1714] transition-colors"
                      title="Elimina"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* If submitted, show confirmation step */}
        {submittedBooking ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1916] border border-[#443b2f] shadow-2xl text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-600/60 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#c49b45] font-semibold">
                {t.booking.bookingCodeLabel}
              </span>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-widest my-1">
                {submittedBooking.code}
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-[#f4efe6] mt-2">
                {t.booking.successTitle}
              </h3>
              <p className="text-sm text-[#aba091] mt-1 max-w-md mx-auto">
                {t.booking.successSub}
              </p>
            </div>

            {/* Summary details card */}
            <div className="p-4 rounded-xl bg-[#231f1a] border border-[#352f25] text-left max-w-md mx-auto text-xs sm:text-sm text-[#d8cfc3] space-y-2">
              <div className="flex justify-between pb-1.5 border-b border-[#2d271e]">
                <span className="text-[#8c8273]">Ospite:</span>
                <span className="font-medium text-white">{submittedBooking.name}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-[#2d271e]">
                <span className="text-[#8c8273]">Data & Orario:</span>
                <span className="font-medium text-white">
                  {submittedBooking.date} • {submittedBooking.time}
                </span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-[#2d271e]">
                <span className="text-[#8c8273]">Tavolo per:</span>
                <span className="font-medium text-white">
                  {submittedBooking.guests} {submittedBooking.guests === 1 ? 'persona' : 'persone'} ({submittedBooking.seatingArea})
                </span>
              </div>
              {submittedBooking.notes && (
                <div className="flex justify-between pt-1">
                  <span className="text-[#8c8273]">Note:</span>
                  <span className="font-medium text-[#c49b45] text-right">
                    {submittedBooking.notes}
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {/* WhatsApp direct trigger */}
              <a
                href={generateWhatsAppBookingUrl(submittedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{t.booking.openWhatsAppBtn}</span>
              </a>

              {/* Copy Message Fallback */}
              <button
                type="button"
                onClick={handleCopyMessage}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#28231d] hover:bg-[#332d25] text-[#f4efe6] font-semibold text-sm border border-[#42392d] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">{t.booking.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#c49b45]" />
                    <span>{t.booking.copyMsgBtn}</span>
                  </>
                )}
              </button>

              {/* Add to Google Calendar */}
              <a
                href={generateGoogleCalendarUrl(submittedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#28231d] hover:bg-[#332d25] text-[#f4efe6] font-medium text-sm border border-[#42392d] flex items-center justify-center gap-2 transition-colors"
              >
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>{t.booking.calendarBtn}</span>
              </a>
            </div>

            <button
              onClick={resetBookingForm}
              className="text-xs text-[#a09484] hover:text-white underline cursor-pointer pt-2"
            >
              {t.booking.createNewBooking}
            </button>
          </div>
        ) : (
          /* Multi-Step Interactive Form */
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-3xl bg-[#1a1714] border border-[#332c23] shadow-2xl"
          >
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#29231b]">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className={`flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
                  activeStep === 1
                    ? 'text-[#c49b45]'
                    : activeStep > 1
                    ? 'text-emerald-400'
                    : 'text-[#6e6456]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeStep === 1
                      ? 'bg-[#c49b45] text-black'
                      : activeStep > 1
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-[#29241e] text-[#8a7f70]'
                  }`}
                >
                  1
                </span>
                <span className="hidden sm:inline">{t.booking.step1}</span>
              </button>

              <div className="h-0.5 flex-1 mx-2 bg-[#2d2720]" />

              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className={`flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
                  activeStep === 2
                    ? 'text-[#c49b45]'
                    : activeStep > 2
                    ? 'text-emerald-400'
                    : 'text-[#6e6456]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeStep === 2
                      ? 'bg-[#c49b45] text-black'
                      : activeStep > 2
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-[#29241e] text-[#8a7f70]'
                  }`}
                >
                  2
                </span>
                <span className="hidden sm:inline">{t.booking.step2}</span>
              </button>

              <div className="h-0.5 flex-1 mx-2 bg-[#2d2720]" />

              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className={`flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
                  activeStep === 3
                    ? 'text-[#c49b45]'
                    : 'text-[#6e6456]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeStep === 3
                      ? 'bg-[#c49b45] text-black'
                      : 'bg-[#29241e] text-[#8a7f70]'
                  }`}
                >
                  3
                </span>
                <span className="hidden sm:inline">{t.booking.step3}</span>
              </button>
            </div>

            {/* Validation alert banner */}
            {validationError && (
              <div className="mb-6 p-3 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* STEP 1: Date, Time & Number of Guests */}
            {activeStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                {/* 1. Date selection tabs */}
                <div>
                  <label className="block text-xs font-semibold text-[#b5aa9b] uppercase tracking-wider mb-2.5">
                    {t.booking.selectDate}
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedDateType('today')}
                      className={`p-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        selectedDateType === 'today'
                          ? 'bg-[#c49b45] text-[#121110] shadow-md'
                          : 'bg-[#221e1a] text-[#b5aa9b] border border-[#332c23] hover:border-[#4f4435]'
                      }`}
                    >
                      {t.booking.today}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDateType('tomorrow')}
                      className={`p-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        selectedDateType === 'tomorrow'
                          ? 'bg-[#c49b45] text-[#121110] shadow-md'
                          : 'bg-[#221e1a] text-[#b5aa9b] border border-[#332c23] hover:border-[#4f4435]'
                      }`}
                    >
                      {t.booking.tomorrow}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDateType('custom')}
                      className={`p-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        selectedDateType === 'custom'
                          ? 'bg-[#c49b45] text-[#121110] shadow-md'
                          : 'bg-[#221e1a] text-[#b5aa9b] border border-[#332c23] hover:border-[#4f4435]'
                      }`}
                    >
                      {t.booking.customDate}
                    </button>
                  </div>

                  {selectedDateType === 'custom' && (
                    <div className="mt-3">
                      <input
                        type="date"
                        min={getTodayStr()}
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="w-full p-3 rounded-xl bg-[#221e1a] border border-[#3b3329] text-[#f4efe6] text-sm focus:outline-none focus:border-[#c49b45]"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Number of Guests */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#b5aa9b] uppercase tracking-wider">
                      {t.booking.guestsLabel}
                    </label>
                    <span className="text-sm font-serif-display font-bold text-[#c49b45]">
                      {guests} {guests === 1 ? t.booking.guestSingle : t.booking.guestsCount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuests(num)}
                        className={`w-11 h-11 shrink-0 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                          guests === num
                            ? 'bg-[#c49b45] text-[#121110] shadow-md scale-105'
                            : 'bg-[#221e1a] text-[#a49a8b] border border-[#332c23] hover:border-[#4d4233]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Arrival Time Slots */}
                <div>
                  <label className="block text-xs font-semibold text-[#b5aa9b] uppercase tracking-wider mb-2.5">
                    {t.booking.selectTime}
                  </label>

                  {/* Lunch Slots */}
                  <div className="mb-3">
                    <span className="text-[11px] text-[#8e8474] font-medium block mb-1.5">
                      ☀️ {lang === 'it' ? 'Pranzo (12:30 - 14:30)' : 'Lunch (12:30 - 14:30)'}
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      {lunchSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            selectedTime === slot
                              ? 'bg-[#c49b45] text-[#121110] font-bold shadow'
                              : 'bg-[#221e1a] text-[#b5aa9b] border border-[#332c23] hover:border-[#4d4233]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dinner Slots */}
                  <div>
                    <span className="text-[11px] text-[#8e8474] font-medium block mb-1.5">
                      🌙 {lang === 'it' ? 'Cena & Aperitivo (19:30 - 22:00)' : 'Dinner & Drinks (19:30 - 22:00)'}
                    </span>
                    <div className="grid grid-cols-6 gap-2">
                      {dinnerSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            selectedTime === slot
                              ? 'bg-[#c49b45] text-[#121110] font-bold shadow'
                              : 'bg-[#221e1a] text-[#b5aa9b] border border-[#332c23] hover:border-[#4d4233]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Continue button */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="px-6 py-3 rounded-xl bg-[#c49b45] text-[#121110] font-bold text-sm hover:brightness-110 transition-all cursor-pointer"
                  >
                    {lang === 'it' ? 'Avanti: Scegli Spazio →' : 'Next: Choose Area →'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Seating Area Selection */}
            {activeStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-xs font-semibold text-[#b5aa9b] uppercase tracking-wider mb-3">
                    {lang === 'it'
                      ? 'Dove preferisci accomodarti a Le Bistrot?'
                      : 'Where would you prefer to sit at Le Bistrot?'}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* Indoor */}
                    <div
                      onClick={() => setSeatingArea('indoor')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                        seatingArea === 'indoor'
                          ? 'bg-[#28221a] border-[#c49b45] shadow-lg ring-1 ring-[#c49b45]'
                          : 'bg-[#201c18] border-[#332c23] hover:border-[#4f4335]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">🕯️</span>
                        {seatingArea === 'indoor' && (
                          <Check className="w-4 h-4 text-[#c49b45]" />
                        )}
                      </div>
                      <h4 className="font-serif-display font-bold text-sm text-[#f4efe6]">
                        {t.booking.seating.indoor}
                      </h4>
                      <p className="text-xs text-[#a09484] mt-1 leading-relaxed">
                        {t.booking.seating.indoorDesc}
                      </p>
                    </div>

                    {/* Outdoor Terrace */}
                    <div
                      onClick={() => setSeatingArea('outdoor')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                        seatingArea === 'outdoor'
                          ? 'bg-[#28221a] border-[#c49b45] shadow-lg ring-1 ring-[#c49b45]'
                          : 'bg-[#201c18] border-[#332c23] hover:border-[#4f4335]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">🌿</span>
                        {seatingArea === 'outdoor' && (
                          <Check className="w-4 h-4 text-[#c49b45]" />
                        )}
                      </div>
                      <h4 className="font-serif-display font-bold text-sm text-[#f4efe6]">
                        {t.booking.seating.outdoor}
                      </h4>
                      <p className="text-xs text-[#a09484] mt-1 leading-relaxed">
                        {t.booking.seating.outdoorDesc}
                      </p>
                    </div>

                    {/* Wine Bar */}
                    <div
                      onClick={() => setSeatingArea('wine_bar')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                        seatingArea === 'wine_bar'
                          ? 'bg-[#28221a] border-[#c49b45] shadow-lg ring-1 ring-[#c49b45]'
                          : 'bg-[#201c18] border-[#332c23] hover:border-[#4f4335]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">🍷</span>
                        {seatingArea === 'wine_bar' && (
                          <Check className="w-4 h-4 text-[#c49b45]" />
                        )}
                      </div>
                      <h4 className="font-serif-display font-bold text-sm text-[#f4efe6]">
                        {t.booking.seating.wine_bar}
                      </h4>
                      <p className="text-xs text-[#a09484] mt-1 leading-relaxed">
                        {t.booking.seating.wine_barDesc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Back and Continue buttons */}
                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="px-5 py-2.5 rounded-xl bg-[#231f1a] text-[#aba090] text-xs font-semibold hover:text-white transition-colors"
                  >
                    ← {lang === 'it' ? 'Indietro' : 'Back'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="px-6 py-3 rounded-xl bg-[#c49b45] text-[#121110] font-bold text-sm hover:brightness-110 transition-all cursor-pointer"
                  >
                    {lang === 'it' ? 'Avanti: Dati Ospite →' : 'Next: Guest Details →'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Guest Details & Direct WhatsApp Trigger */}
            {activeStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Guest Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#b5aa9b] uppercase tracking-wider mb-1.5">
                      {t.booking.nameLabel} *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786e61]" />
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder={t.booking.namePlaceholder}
                        className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#221e1a] border border-[#383025] text-sm text-[#f4efe6] focus:outline-none focus:border-[#c49b45]"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-[#b5aa9b] uppercase tracking-wider mb-1.5">
                      {t.booking.phoneLabel} *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786e61]" />
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder={t.booking.phonePlaceholder}
                        className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#221e1a] border border-[#383025] text-sm text-[#f4efe6] focus:outline-none focus:border-[#c49b45]"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Notes / Allergies */}
                <div>
                  <label className="block text-xs font-semibold text-[#b5aa9b] uppercase tracking-wider mb-1.5">
                    {t.booking.notesLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={guestNotes}
                    onChange={(e) => setGuestNotes(e.target.value)}
                    placeholder={t.booking.notesPlaceholder}
                    className="w-full p-3 rounded-xl bg-[#221e1a] border border-[#383025] text-sm text-[#f4efe6] focus:outline-none focus:border-[#c49b45]"
                  />
                </div>

                {/* Real-time WhatsApp Preview Box */}
                <div className="p-4 rounded-2xl bg-[#141210] border border-[#2b251e]">
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[#c49b45]">
                    <MessageCircle className="w-4 h-4 text-[#25d366]" />
                    <span>{t.booking.previewTitle}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1d1a16] font-mono text-[11px] text-[#ccc2b3] leading-relaxed whitespace-pre-wrap border border-[#2e281f]">
                    {`🍷 *PRENOTAZIONE TAVOLO - Chef Box Le Bistrot*\n` +
                      `👤 *Nome:* ${guestName.trim() || '(Il tuo nome)'}\n` +
                      `📞 *Telefono:* ${guestPhone.trim() || '(Il tuo numero)'}\n` +
                      `📅 *Data:* ${resolvedDate} alle ${selectedTime}\n` +
                      `👥 *Ospiti:* ${guests} persone\n` +
                      `🪑 *Zona:* ${seatingArea}\n` +
                      (guestNotes ? `📝 *Note:* ${guestNotes}\n` : '') +
                      `Salve! Vorrei confermare la disponibilità del tavolo.`}
                  </div>
                </div>

                {/* Form Navigation & Final Submission */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#231f1a] text-[#aba090] text-xs font-semibold hover:text-white transition-colors"
                  >
                    ← {lang === 'it' ? 'Indietro' : 'Back'}
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#25d366] to-[#1eb855] text-black font-bold text-sm sm:text-base hover:brightness-110 active:scale-98 transition-all shadow-xl shadow-[#25d366]/20 flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>{t.booking.submitBtn}</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  );
};
