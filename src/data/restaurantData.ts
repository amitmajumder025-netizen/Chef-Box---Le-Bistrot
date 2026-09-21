import { MenuItem, DayHours, Review, Language, BookingData } from '../types';

export const RESTAURANT_INFO = {
  name: 'Chef Box - Le Bistrot',
  tagline: {
    it: 'Cucina Romana d’Autore, Pinsa Tradizionale & Vini Selezionati',
    en: 'Artisanal Roman Cuisine, Traditional Pinsa & Curated Wines',
  },
  address: 'Via Scribonio Curione, 65, 00175 Roma RM',
  neighborhood: 'Roma • Tuscolano / Cinecittà (Metro Lucio Sestio)',
  phone: '+39 331 887 8652',
  phoneRaw: '+393318878652',
  whatsappRaw: '393318878652',
  googleMapsUrl: 'https://maps.app.goo.gl/8U4SBirg1vRhweix7',
  googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2972.193139366472!2d12.551801276510344!3d41.859666066779435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132589e4c194511d%3A0xebe66f809930f782!2sVia%20Scribonio%20Curione%2C%2065%2C%2000175%20Roma%20RM!5e0!3m2!1sen!2sit!4v1710000000000!5m2!1sen!2sit',
  googleRating: 4.8,
  reviewsCount: 184,
  priceRange: '€€',
};

export const WEEKLY_HOURS: DayHours[] = [
  {
    day: { it: 'Lunedì', en: 'Monday' },
    dayIndex: 1,
    lunch: 'Chiuso',
    dinner: 'Chiuso',
    isClosed: true,
  },
  {
    day: { it: 'Martedì', en: 'Tuesday' },
    dayIndex: 2,
    lunch: '12:30 - 15:30',
    dinner: '18:30 - 23:30',
  },
  {
    day: { it: 'Mercoledì', en: 'Wednesday' },
    dayIndex: 3,
    lunch: '12:30 - 15:30',
    dinner: '18:30 - 23:30',
  },
  {
    day: { it: 'Giovedì', en: 'Thursday' },
    dayIndex: 4,
    lunch: '12:30 - 15:30',
    dinner: '18:30 - 23:30',
  },
  {
    day: { it: 'Venerdì', en: 'Friday' },
    dayIndex: 5,
    lunch: '12:30 - 15:30',
    dinner: '18:30 - 00:00',
  },
  {
    day: { it: 'Sabato', en: 'Saturday' },
    dayIndex: 6,
    lunch: '12:30 - 15:30',
    dinner: '18:30 - 00:00',
  },
  {
    day: { it: 'Domenica', en: 'Sunday' },
    dayIndex: 0,
    lunch: '12:30 - 16:00',
    dinner: '19:00 - 23:30',
  },
];

// Helper to determine live status
export function getLiveStatus(lang: Language): {
  isOpen: boolean;
  statusBadge: string;
  nextChange: string;
} {
  const now = new Date();
  // Get Rome time offset (CET/CEST)
  // Formatted date in Rome
  const romeDateStr = now.toLocaleString('en-US', { timeZone: 'Europe/Rome' });
  const romeDate = new Date(romeDateStr);
  const currentDay = romeDate.getDay(); // 0 is Sunday
  const currentHour = romeDate.getHours();
  const currentMinute = romeDate.getMinutes();
  const currentTimeVal = currentHour * 60 + currentMinute;

  const todayHours = WEEKLY_HOURS.find((h) => h.dayIndex === currentDay);

  if (!todayHours || todayHours.isClosed) {
    return {
      isOpen: false,
      statusBadge: lang === 'it' ? 'Chiuso Oggi' : 'Closed Today',
      nextChange: lang === 'it' ? 'Riapre Martedì alle 12:30' : 'Reopens Tuesday at 12:30',
    };
  }

  // Lunch window: 12:30 (750) to 15:30 (930)
  const lunchStart = 12 * 60 + 30;
  const lunchEnd = currentDay === 0 ? 16 * 60 : 15 * 60 + 30;

  // Dinner window: 18:30 (1110) or 19:00 (1140) to 23:30 (1410) or 00:00 (1440)
  const dinnerStart = currentDay === 0 ? 19 * 60 : 18 * 60 + 30;
  const dinnerEnd = (currentDay === 5 || currentDay === 6) ? 24 * 60 : 23 * 60 + 30;

  if (currentTimeVal >= lunchStart && currentTimeVal < lunchEnd) {
    return {
      isOpen: true,
      statusBadge: lang === 'it' ? 'Aperto a Pranzo' : 'Open for Lunch',
      nextChange: lang === 'it' ? `Fino alle ${Math.floor(lunchEnd / 60)}:${(lunchEnd % 60).toString().padStart(2, '0')}` : `Until ${Math.floor(lunchEnd / 60)}:${(lunchEnd % 60).toString().padStart(2, '0')}`,
    };
  }

  if (currentTimeVal >= dinnerStart && currentTimeVal < dinnerEnd) {
    return {
      isOpen: true,
      statusBadge: lang === 'it' ? 'Aperto Stasera' : 'Open for Dinner',
      nextChange: lang === 'it' ? 'Cucina attiva fino a tarda sera' : 'Kitchen open until late',
    };
  }

  if (currentTimeVal < lunchStart) {
    return {
      isOpen: false,
      statusBadge: lang === 'it' ? 'Apre Oggi a Pranzo' : 'Opens Today for Lunch',
      nextChange: lang === 'it' ? 'Apertura alle 12:30' : 'Opens at 12:30',
    };
  }

  if (currentTimeVal >= lunchEnd && currentTimeVal < dinnerStart) {
    return {
      isOpen: false,
      statusBadge: lang === 'it' ? 'Pausa Pomeridiana' : 'Afternoon Break',
      nextChange: lang === 'it' ? `Apre stasera alle ${Math.floor(dinnerStart / 60)}:${(dinnerStart % 60).toString().padStart(2, '0')}` : `Opens tonight at ${Math.floor(dinnerStart / 60)}:${(dinnerStart % 60).toString().padStart(2, '0')}`,
    };
  }

  return {
    isOpen: false,
    statusBadge: lang === 'it' ? 'Chiuso per la Notte' : 'Closed for the Night',
    nextChange: lang === 'it' ? 'Ci vediamo domani a pranzo' : 'See you tomorrow for lunch',
  };
}

export const MENU_ITEMS: MenuItem[] = [
  // ANTIPASTI
  {
    id: 'ant-1',
    category: 'antipasti',
    name: {
      it: 'Gran Tagliere dei Castelli Romani & Formaggi DOP',
      en: 'Castelli Romani Artisan Charcuterie & DOP Cheese Board',
    },
    description: {
      it: 'Selezione di salumi artigianali laziali, prosciutto di Bassiano 24 mesi, pecorino romano a scaglie, miele d’acacia e focaccia calda della casa',
      en: 'Curated selection of Lazio artisanal cured meats, 24-month Bassiano prosciutto, aged Roman pecorino, acacia honey, and warm house focaccia',
    },
    price: 16.0,
    tags: ['artisan'],
    popular: true,
  },
  {
    id: 'ant-2',
    category: 'antipasti',
    name: {
      it: 'Tris di Supplì Romani al Telefono',
      en: 'Trio of Traditional Roman Fried Supplì al Telefono',
    },
    description: {
      it: 'Classico al ragù antico con cuore filante di fiordilatte, Cacio & Pepe con lime tostato, e Amatriciana croccante',
      en: 'Classic slow-cooked beef ragù with molten mozzarella, Cacio & Pepe with toasted lime, and crispy Amatriciana style',
    },
    price: 9.0,
    tags: ['chef_special'],
    popular: true,
  },
  {
    id: 'ant-3',
    category: 'antipasti',
    name: {
      it: 'Burrata Pugliese con Datterini Confit & Pesto di Basilico',
      en: 'Pugliese Burrata with Confit Datterini & Fresh Basil Pesto',
    },
    description: {
      it: 'Cuore cremoso di burrata fresca da 200g, pomodorini datterini caramellati al timo, cialda di pane carasau e gocce di pesto ligure',
      en: 'Creamy 200g fresh burrata, thyme-caramelized datterini tomatoes, crispy carasau bread wafer, and drops of basil pesto',
    },
    price: 13.5,
    tags: ['vegetarian'],
  },
  {
    id: 'ant-4',
    category: 'antipasti',
    name: {
      it: 'Tartare di Scottona al Coltello con Tuorlo d’Uovo Marinato',
      en: 'Knife-Cut Scottona Beef Tartare with Marinated Egg Yolk',
    },
    description: {
      it: 'Carne di scottona italiana battuta al coltello, senape antica in grani, capperi di Pantelleria croccanti e maionese al tartufo nero',
      en: 'Prime hand-cut Italian beef, whole-grain mustard, crispy Pantelleria capers, and black truffle infused mayonnaise',
    },
    price: 15.0,
    tags: ['gluten_free', 'chef_special'],
  },

  // PRIMI PIATTI
  {
    id: 'prim-1',
    category: 'primi',
    name: {
      it: 'La Nostra Carbonara Perfetta con Guanciale d’Amatrice',
      en: 'Our Signature Roman Carbonara with Amatrice Guanciale',
    },
    description: {
      it: 'Spaghetti artigianali di Gragnano trafilati al bronzo, tuorli d’uova biologiche a pasta gialla, guanciale croccante e Pecorino Romano DOP scorza nera',
      en: 'Bronze-drawn Gragnano spaghetti, organic yellow egg yolks, crispy Amatrice pork jowl, and aged black-rind Pecorino Romano DOP',
    },
    price: 13.5,
    tags: ['chef_special'],
    popular: true,
  },
  {
    id: 'prim-2',
    category: 'primi',
    name: {
      it: 'Tonnarelli Freschi Cacio e Pepe Tostata',
      en: 'Fresh Handcrafted Tonnarelli Cacio e Pepe',
    },
    description: {
      it: 'Pasta all’uovo fresca fatta a mano, crema vellutata di Pecorino Romano DOP e triplo pepe nero Tellicherry tostato a secco in padella',
      en: 'Fresh handmade egg tonnarelli, creamy emulsion of Pecorino Romano DOP, and freshly dry-toasted Tellicherry black pepper',
    },
    price: 12.5,
    tags: ['vegetarian'],
    popular: true,
  },
  {
    id: 'prim-3',
    category: 'primi',
    name: {
      it: 'Rigatoni all’Amatriciana Tradizionale',
      en: 'Rigatoni all’Amatriciana Tradizionale',
    },
    description: {
      it: 'Sugo denso con pomodori San Marzano pelati a mano, sfumatura di vino bianco dei Castelli, guanciale sfrigolante e pioggia di pecorino',
      en: 'Slow-simmered San Marzano tomatoes, Castelli white wine reduction, sizzling crispy guanciale, and generous grated pecorino',
    },
    price: 13.0,
    tags: ['artisan'],
  },
  {
    id: 'prim-4',
    category: 'primi',
    name: {
      it: 'Ravioloni Artigianali con Ripieno di Burrata e Crema di Pistacchio',
      en: 'Artisanal Ravioli with Burrata & Pistachio Cream',
    },
    description: {
      it: 'Pasta fresca all’uovo ripiena di burrata d’Andria, vellutata di pistacchi di Bronte DOP e scaglie di provolone del Monaco',
      en: 'Handmade fresh ravioli filled with creamy burrata, velvety Bronte pistachio sauce, and flakes of provolone del Monaco',
    },
    price: 15.0,
    tags: ['vegetarian', 'chef_special'],
  },

  // SECONDI PIATTI
  {
    id: 'sec-1',
    category: 'secondi',
    name: {
      it: 'Tagliata di Scottona alla Griglia con Sale Maldon & Rosmarino',
      en: 'Grilled Scottona Beef Slices with Maldon Sea Salt & Rosemary',
    },
    description: {
      it: '300g di scottona tenerissima frollata 35 giorni, servita su piastra calda con patate rustiche al forno al rosmarino e riduzione al Cesanese',
      en: '300g prime tender beef dry-aged 35 days, served sizzling with rosemary-roasted rustic potatoes and a Cesanese wine reduction',
    },
    price: 21.0,
    tags: ['gluten_free'],
    popular: true,
  },
  {
    id: 'sec-2',
    category: 'secondi',
    name: {
      it: 'Polpo Arrostito su Crema di Patate e Zeste di Lime',
      en: 'Pan-Roasted Octopus on Velvet Potato Cream & Lime Zest',
    },
    description: {
      it: 'Tentacoli di polpo cotti a bassa temperatura e resi croccanti in padella, purea soffice di patate allo zafferano e crumble di olive taggiasche',
      en: 'Slow-braised octopus tentacle seared crisp, saffron-infused silky potato purée, and crunchy Taggiasca olive crumble',
    },
    price: 19.5,
    tags: ['gluten_free', 'chef_special'],
    popular: true,
  },
  {
    id: 'sec-3',
    category: 'secondi',
    name: {
      it: 'Saltimbocca alla Romana del Bistrot',
      en: 'Le Bistrot Modern Roman Saltimbocca',
    },
    description: {
      it: 'Fettine di vitella da latte, prosciutto crudo di Parma 18 mesi, salvia fresca del nostro orto, glassa densa al burro chiarificato e vino bianco',
      en: 'Tender milk-fed veal escalopes, 18-month Parma prosciutto, fresh garden sage, glazed with clarified butter and white wine sauce',
    },
    price: 17.0,
    tags: ['artisan'],
  },

  // PINSE ROMANE
  {
    id: 'pin-1',
    category: 'pinse',
    name: {
      it: 'Pinsa Margherita Reale DOP',
      en: 'Pinsa Margherita Reale DOP',
    },
    description: {
      it: 'Impasto a lievitazione naturale 72 ore ad altissima digeribilità, pomodoro San Marzano BIO, mozzarella di bufala campana DOP a crudo, basilico',
      en: '72-hour naturally fermented crisp dough, organic San Marzano tomatoes, fresh buffalo mozzarella DOP added fresh, fragrant basil',
    },
    price: 9.5,
    tags: ['vegetarian'],
  },
  {
    id: 'pin-2',
    category: 'pinse',
    name: {
      it: 'Pinsa "Scribonio Curione" Special',
      en: 'Pinsa "Scribonio Curione" Signature',
    },
    description: {
      it: 'Base bianca fiordilatte, mortadella Bologna IGP a fette sottili, stracciatella di bufala fresca, granella di pistacchi tostati e miele al tartufo',
      en: 'White base with mozzarella, shaved Bologna IGP mortadella, fresh buffalo stracciatella, toasted pistachios, and truffle honey drizzle',
    },
    price: 13.5,
    tags: ['chef_special'],
    popular: true,
  },
  {
    id: 'pin-3',
    category: 'pinse',
    name: {
      it: 'Pinsa Diavola Rustica di Norcia',
      en: 'Spicy Norcia Diavola Pinsa',
    },
    description: {
      it: 'Pomodoro San Marzano, fiordilatte laziale, salame piccante artigianale di Norcia, \'nduja calabrese e fili di peperoncino dolce',
      en: 'San Marzano tomatoes, fresh local mozzarella, artisan spicy Norcia salami, dollops of spicy nduja, and mild chili threads',
    },
    price: 11.5,
    tags: ['artisan'],
  },
  {
    id: 'pin-4',
    category: 'pinse',
    name: {
      it: 'Pinsa Ortolana dell’Agro Romano',
      en: 'Roman Countryside Garden Pinsa',
    },
    description: {
      it: 'Mozzarella, zucchine romanesche grigliate, melanzane al forno, peperoni dolci arrostiti e scaglie di ricotta salata',
      en: 'Mozzarella, grilled Roman zucchini, roasted eggplant, sweet bell peppers, and salted ricotta shavings',
    },
    price: 10.5,
    tags: ['vegetarian'],
  },

  // DOLCI
  {
    id: 'dol-1',
    category: 'dolci',
    name: {
      it: 'Tiramisù Tradizionale "Le Bistrot" al Bicchiere',
      en: 'Signature "Le Bistrot" Artisan Tiramisù in Glass',
    },
    description: {
      it: 'Crema soffice al mascarpone artigianale, savoiardi sardi bagnati al caffè espresso arabica 100%, cacao amaro belga in purezza',
      en: 'Cloud-soft artisan mascarpone cream, Sardinian ladyfingers steeped in 100% Arabica espresso, dusted with pure Belgian cocoa',
    },
    price: 6.5,
    tags: ['vegetarian'],
    popular: true,
  },
  {
    id: 'dol-2',
    category: 'dolci',
    name: {
      it: 'Semifreddo al Pistacchio con Cuore Caldo al Cioccolato',
      en: 'Pistachio Parfait with Warm Dark Chocolate Center',
    },
    description: {
      it: 'Pistacchio puro di Sicilia, ganache calda fondente Valrhona 70% versata al tavolo e cialda croccante alle mandorle',
      en: 'Pure Sicilian pistachio parfait, poured table-side warm Valrhona 70% dark chocolate ganache, and almond brittle',
    },
    price: 7.0,
    tags: ['chef_special', 'vegetarian'],
    popular: true,
  },
  {
    id: 'dol-3',
    category: 'dolci',
    name: {
      it: 'Panna Cotta ai Frutti di Bosco & Menta Selvatica',
      en: 'Wild Berry & Fresh Mint Panna Cotta',
    },
    description: {
      it: 'Crema di latte fresco alla vaniglia Bourbon del Madagascar, coulis acidula di lamponi e mirtilli dell’appennino',
      en: 'Fresh dairy cream infused with Madagascar Bourbon vanilla, tart homemade raspberry and blueberry coulis',
    },
    price: 6.0,
    tags: ['gluten_free', 'vegetarian'],
  },

  // BEVANDE E CANTINA
  {
    id: 'bev-1',
    category: 'bevande',
    name: {
      it: 'Cesanese del Piglio DOCG "Vigne di Tufo"',
      en: 'Cesanese del Piglio DOCG Red Wine (Lazio)',
    },
    description: {
      it: 'Il rosso per eccellenza della terra laziale. Note di ciliegia matura, pepe nero, corpo avvolgente e tannini morbidi. Calice €5.50 | Bottiglia €24.00',
      en: 'The definitive noble red of Lazio. Notes of ripe dark cherry, wild herbs, and velvety tannins. Glass €5.50 | Bottle €24.00',
    },
    price: 24.0,
    tags: ['artisan'],
    popular: true,
  },
  {
    id: 'bev-2',
    category: 'bevande',
    name: {
      it: 'Frascati Superiore DOCG Biologico',
      en: 'Organic Frascati Superiore DOCG White Wine',
    },
    description: {
      it: 'Vino bianco fresco e minerale dei Castelli Romani. Sentori di fiori di campo e mela verde. Calice €5.00 | Bottiglia €22.00',
      en: 'Crisp, mineral-driven white wine from the Roman Hills. Notes of white flowers and green orchard fruit. Glass €5.00 | Bottle €22.00',
    },
    price: 22.0,
    tags: ['artisan'],
  },
  {
    id: 'bev-3',
    category: 'bevande',
    name: {
      it: 'Spritz del Bistrot al Bergamotto di Calabria',
      en: 'Signature Bergamot Bistro Spritz Cocktail',
    },
    description: {
      it: 'Italicus rosolio di bergamotto, prosecco di Valdobbiadene DOCG, soda, oliva di Cerignola e rametto di rosmarino bruciato',
      en: 'Italicus bergamot liqueur, Valdobbiadene Prosecco DOCG, soda water, green Cerignola olive, and torched rosemary sprig',
    },
    price: 8.0,
    tags: ['chef_special'],
    popular: true,
  },
  {
    id: 'bev-4',
    category: 'bevande',
    name: {
      it: 'Birra Artigianale Romana "I Cavalieri" (50cl)',
      en: 'Artisanal Roman Craft Beer (50cl)',
    },
    description: {
      it: 'Bionda non filtrata ad alta fermentazione brassata a Roma con luppoli aromatici e note agrumate',
      en: 'Locally brewed unfiltered golden ale crafted in Rome with aromatic hops and refreshing citrus finish',
    },
    price: 6.5,
    tags: ['artisan'],
  },
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Marco Ferri',
    rating: 5,
    date: { it: '2 settimane fa', en: '2 weeks ago' },
    text: {
      it: 'Una scoperta straordinaria in via Scribonio Curione! La Carbonara è tra le migliori mangiate a Roma: cremosità perfetta e guanciale croccante da manuale. Personale gentilissimo e accogliente.',
      en: 'An extraordinary discovery on Via Scribonio Curione! The Carbonara is among the very best in Rome: sublime creaminess and textbook crunchy guanciale. Incredibly welcoming staff.',
    },
    highlight: 'Carbonara da 10 e lode',
    source: 'Google Maps Verified Review',
  },
  {
    id: 'rev-2',
    author: 'Elena Rinaldi',
    rating: 5,
    date: { it: '1 mese fa', en: '1 month ago' },
    text: {
      it: 'Atmosfera calda da bistrot moderno. Abbiamo provato la Pinsa Curione con mortadella e burrata e la tagliata di manzo: cottura perfetta e materie prime di livello superiore. Consigliatissimo!',
      en: 'Warm modern bistro atmosphere. We tried the signature Curione pinsa with mortadella and burrata, plus the beef tagliata: flawless cooking and top-tier ingredients. Highly recommended!',
    },
    highlight: 'Pinsa e carni eccezionali',
    source: 'Google Maps Verified Review',
  },
  {
    id: 'rev-3',
    author: 'David Harrison (London, UK)',
    rating: 5,
    date: { it: '3 settimane fa', en: '3 weeks ago' },
    text: {
      it: 'Abbiamo soggiornato vicino a Cinecittà e siamo venuti qui due sere di fila. I tonnarelli cacio e pepe e il tiramisù della casa sono indimenticabili. Prenotare su WhatsApp è stato velocissimo!',
      en: 'We stayed near Cinecittà and came here two nights in a row. The tonnarelli cacio e pepe and house tiramisù are unforgettable. Booking directly via WhatsApp was effortless!',
    },
    highlight: 'Authentic Roman hospitality',
    source: 'Google Maps Verified Review',
  },
  {
    id: 'rev-4',
    author: 'Serena Marchesi',
    rating: 5,
    date: { it: '2 mesi fa', en: '2 months ago' },
    text: {
      it: 'Locale intimo e curato nei minimi dettagli. Ottima carta dei vini con etichette del territorio laziale. Il polpo arrostito è divino. Ci torneremo sicuramente con gli amici.',
      en: 'Intimate spot cared for in every detail. Excellent wine list focusing on authentic Lazio producers. The roasted octopus is divine. Will definitely return with friends.',
    },
    highlight: 'Carta vini e pesce superbo',
    source: 'Google Maps Verified Review',
  },
];

export const TRANSIT_INFO = {
  metro: [
    {
      line: 'Metro A',
      station: 'Lucio Sestio',
      distance: { it: '400 metri (5 min a piedi)', en: '400 meters (5 min walk)' },
    },
    {
      line: 'Metro A',
      station: 'Numidio Quadrato',
      distance: { it: '500 metri (6 min a piedi)', en: '500 meters (6 min walk)' },
    },
  ],
  bus: [
    {
      lines: 'Linee 558, 657, NMA (Notturno)',
      stop: { it: 'Fermata Curione / Tuscolana', en: 'Curione / Tuscolana Stop' },
      distance: { it: '120 metri (1 min a piedi)', en: '120 meters (1 min walk)' },
    },
  ],
  parking: {
    it: 'Parcheggio su strada disponibile lungo Via Scribonio Curione e vie adiacenti (strisce bianche gratuite e blu)',
    en: 'Street parking available along Via Scribonio Curione and neighboring streets (free white zones & blue metered)',
  },
};

// Function to generate pre-filled WhatsApp reservation link
export function generateWhatsAppBookingUrl(booking: BookingData): string {
  const seatingName = {
    indoor: 'Sala Bistrot Interna',
    outdoor: 'Dehors & Terrazza',
    wine_bar: 'Banco Degustazione / Wine Bar',
  }[booking.seatingArea];

  const message = [
    `🍷 *PRENOTAZIONE TAVOLO - Chef Box Le Bistrot* 🍷`,
    `----------------------------------------`,
    `📌 *Codice Prenotazione:* ${booking.code}`,
    `👤 *Nome:* ${booking.name}`,
    `📞 *Telefono:* ${booking.phone}`,
    `📅 *Data:* ${booking.date}`,
    `⏰ *Orario:* ${booking.time}`,
    `👥 *Numero Ospiti:* ${booking.guests} ${booking.guests === 1 ? 'persona' : 'persone'}`,
    `🪑 *Zona Preferita:* ${seatingName}`,
    booking.notes ? `📝 *Note / Allergie:* ${booking.notes}` : null,
    `----------------------------------------`,
    `Salve! Vorrei confermare la disponibilità del tavolo. Attendo vostra gentile conferma. Grazie!`,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${RESTAURANT_INFO.whatsappRaw}?text=${encodeURIComponent(message)}`;
}

export function generateGoogleCalendarUrl(booking: BookingData): string {
  // Booking date in YYYY-MM-DD format, time in HH:MM
  try {
    const [year, month, day] = booking.date.split('-');
    const [hours, minutes] = booking.time.split(':');
    if (!year || !month || !day || !hours || !minutes) {
      return 'https://calendar.google.com';
    }

    const start = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hours reservation

    const formatCalDate = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const title = encodeURIComponent(`Pranzo/Cena a Chef Box - Le Bistrot (Tavolo per ${booking.guests})`);
    const details = encodeURIComponent(
      `Prenotazione confermata per ${booking.name}.\nCodice: ${booking.code}\nTavolo per ${booking.guests} persone.\nZona: ${booking.seatingArea}\nTelefono Bistrot: ${RESTAURANT_INFO.phone}\nIndirizzo: ${RESTAURANT_INFO.address}`
    );
    const location = encodeURIComponent(RESTAURANT_INFO.address);
    const dates = `${formatCalDate(start)}/${formatCalDate(end)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  } catch {
    return 'https://calendar.google.com';
  }
}
