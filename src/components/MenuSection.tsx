import React, { useState, useMemo } from 'react';
import {
  UtensilsCrossed,
  Search,
  Sparkles,
  Flame,
  Leaf,
  WheatOff,
  Wine,
  Pizza,
  Cake,
  X,
  Plus,
  Check,
} from 'lucide-react';
import { MenuItem, Language } from '../types';
import { MENU_ITEMS } from '../data/restaurantData';
import { TRANSLATIONS } from '../data/translations';

interface MenuSectionProps {
  lang: Language;
  onSelectDishForBooking?: (dishName: string) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  lang,
  onSelectDishForBooking,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedNote, setAddedNote] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: t.menu.filterAll, icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'antipasti', label: t.menu.categories.antipasti, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'primi', label: t.menu.categories.primi, icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'secondi', label: t.menu.categories.secondi, icon: <Flame className="w-4 h-4" /> },
    { id: 'pinse', label: t.menu.categories.pinse, icon: <Pizza className="w-4 h-4" /> },
    { id: 'dolci', label: t.menu.categories.dolci, icon: <Cake className="w-4 h-4" /> },
    { id: 'bevande', label: t.menu.categories.bevande, icon: <Wine className="w-4 h-4" /> },
  ];

  const tagsList = [
    { id: 'all', label: t.menu.filterAll },
    { id: 'chef_special', label: t.menu.tags.chef_special },
    { id: 'artisan', label: t.menu.tags.artisan },
    { id: 'vegetarian', label: t.menu.tags.vegetarian },
    { id: 'gluten_free', label: t.menu.tags.gluten_free },
  ];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category match
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Tag match
      if (selectedTag !== 'all') {
        if (!item.tags || !item.tags.includes(selectedTag as any)) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch =
          item.name.it.toLowerCase().includes(query) ||
          item.name.en.toLowerCase().includes(query);
        const descMatch =
          item.description.it.toLowerCase().includes(query) ||
          item.description.en.toLowerCase().includes(query);
        return nameMatch || descMatch;
      }
      return true;
    });
  }, [activeCategory, selectedTag, searchQuery]);

  const handleDishClick = (dishName: string) => {
    if (onSelectDishForBooking) {
      onSelectDishForBooking(dishName);
      setAddedNote(dishName);
      setTimeout(() => setAddedNote(null), 2500);
    }
  };

  return (
    <section id="menu" className="py-20 bg-[#121110] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201d19] border border-[#3b352e] text-xs font-semibold text-[#c49b45] uppercase tracking-wider mb-3">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>{t.menu.badge}</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f4efe6] tracking-tight">
            {t.menu.title}
          </h2>

          <p className="mt-3 text-base text-[#a89f92] font-light">
            {t.menu.subtitle}
          </p>
        </div>

        {/* Search Bar & Dietary Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8072]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.menu.searchPlaceholder}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1a1815] border border-[#332e27] text-sm text-[#f4efe6] placeholder-[#7d7467] focus:outline-none focus:border-[#c49b45] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8072] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dietary Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {tagsList.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    selectedTag === tag.id
                      ? 'bg-[#c49b45] text-[#121110] font-semibold shadow-sm'
                      : 'bg-[#1b1916] text-[#b0a79a] border border-[#2d2822] hover:border-[#4d4439]'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#24211d]">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-[#2b251e] text-[#c49b45] border border-[#c49b45]/50 shadow-md'
                    : 'text-[#9c9284] hover:text-[#f4efe6] hover:bg-[#1a1815]'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Temporary toast if user tapped to add dish preference */}
        {addedNote && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-200 text-xs flex items-center justify-between shadow-lg animate-fadeIn">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'it'
                  ? `Piatto selezionato: "${addedNote}". Verrà incluso nella richiesta tavolo!`
                  : `Dish selected: "${addedNote}". Added to booking notes!`}
              </span>
            </span>
          </div>
        )}

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#171513] border border-[#292520] hover:border-[#453e34] transition-all hover:bg-[#1c1916] group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-serif-display text-lg font-bold text-[#f4efe6] group-hover:text-[#c49b45] transition-colors">
                          {item.name[lang]}
                        </h3>
                        {item.popular && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#b85a3a]/20 text-[#e67e5b] border border-[#b85a3a]/40">
                            {t.menu.popular}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-[#aba193] leading-relaxed font-light">
                        {item.description[lang]}
                      </p>
                    </div>

                    {/* Price in € */}
                    <div className="text-right shrink-0">
                      <span className="font-serif-display text-lg sm:text-xl font-bold text-[#c49b45]">
                        €{item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dietary Tags & Action Button */}
                <div className="mt-4 pt-3 border-t border-[#23201b] flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags?.map((tag) => {
                      if (tag === 'vegetarian') {
                        return (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                          >
                            <Leaf className="w-3 h-3" />
                            {t.menu.tags.vegetarian}
                          </span>
                        );
                      }
                      if (tag === 'gluten_free') {
                        return (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-800/40"
                          >
                            <WheatOff className="w-3 h-3" />
                            {t.menu.tags.gluten_free}
                          </span>
                        );
                      }
                      if (tag === 'chef_special') {
                        return (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#2e261b] text-[#c49b45] border border-[#4a3e2b]"
                          >
                            <Sparkles className="w-3 h-3" />
                            {t.menu.tags.chef_special}
                          </span>
                        );
                      }
                      return (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#26211c] text-[#d6c7b2] border border-[#3d342a]"
                        >
                          {t.menu.tags.artisan}
                        </span>
                      );
                    })}
                  </div>

                  {/* Pre-fill for table booking button */}
                  <button
                    onClick={() => handleDishClick(item.name[lang])}
                    title={lang === 'it' ? 'Aggiungi nota per il tavolo' : 'Add to table notes'}
                    className="p-1.5 rounded-lg text-[#8e8476] hover:text-[#c49b45] hover:bg-[#25211c] transition-colors cursor-pointer text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">
                      {lang === 'it' ? 'Prenota con questo' : 'Book with this'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-[#171513] rounded-2xl border border-[#26221c]">
            <UtensilsCrossed className="w-10 h-10 text-[#6b6255] mx-auto mb-3" />
            <p className="text-base text-[#d8cfc4]">{t.menu.noResults}</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedTag('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#27231e] text-[#c49b45] text-xs font-semibold hover:bg-[#332d26] transition-colors"
            >
              {t.menu.resetFilters}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
