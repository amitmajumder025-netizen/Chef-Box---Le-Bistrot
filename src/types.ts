export type Language = 'it' | 'en';

export interface MenuItem {
  id: string;
  category: 'antipasti' | 'primi' | 'secondi' | 'pinse' | 'dolci' | 'bevande';
  name: {
    it: string;
    en: string;
  };
  description: {
    it: string;
    en: string;
  };
  price: number;
  tags?: ('vegetarian' | 'gluten_free' | 'chef_special' | 'artisan')[];
  image?: string;
  popular?: boolean;
}

export interface DayHours {
  day: {
    it: string;
    en: string;
  };
  dayIndex: number; // 0 = Sunday, 1 = Monday, etc.
  lunch: string;
  dinner: string;
  isClosed?: boolean;
}

export interface BookingData {
  id: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: 'indoor' | 'outdoor' | 'wine_bar';
  name: string;
  phone: string;
  notes?: string;
  createdAt: string;
  code: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: {
    it: string;
    en: string;
  };
  text: {
    it: string;
    en: string;
  };
  highlight?: string;
  source: string;
}
