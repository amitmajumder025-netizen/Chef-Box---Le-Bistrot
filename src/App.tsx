import React, { useState } from 'react';
import { Language } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { MenuSection } from './components/MenuSection';
import { BookingSystem } from './components/BookingSystem';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationSection } from './components/LocationSection';
import { MobileStickyBar } from './components/MobileStickyBar';
import { Footer } from './components/Footer';

export default function App() {
  const [lang, setLang] = useState<Language>('it');
  const [selectedDishNote, setSelectedDishNote] = useState<string>('');

  const handleOpenBooking = () => {
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDishForBooking = (dishName: string) => {
    setSelectedDishNote(dishName);
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#121110] text-[#f4efe6] font-sans-body selection:bg-[#c49b45] selection:text-[#121110] flex flex-col">
      {/* Header & Navigation */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        onOpenBooking={handleOpenBooking}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero lang={lang} onOpenBooking={handleOpenBooking} />

        {/* 2. Story & Heritage (About) */}
        <AboutSection lang={lang} />

        {/* 3. Interactive Digital Menu */}
        <MenuSection
          lang={lang}
          onSelectDishForBooking={handleSelectDishForBooking}
        />

        {/* 4. Direct WhatsApp Table Booking System */}
        <BookingSystem
          lang={lang}
          initialNote={selectedDishNote}
          onClearInitialNote={() => setSelectedDishNote('')}
        />

        {/* 5. Social Proof & Reviews */}
        <ReviewsSection lang={lang} />

        {/* 6. Location, Transit & Google Maps */}
        <LocationSection lang={lang} />
      </main>

      {/* Footer */}
      <Footer lang={lang} />

      {/* Mobile Sticky Bottom Action Bar */}
      <MobileStickyBar lang={lang} onOpenBooking={handleOpenBooking} />
    </div>
  );
}
