import React from 'react';
import { Star, MessageSquare, ExternalLink, Quote, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { RESTAURANT_INFO, REVIEWS } from '../data/restaurantData';
import { TRANSLATIONS } from '../data/translations';

interface ReviewsProps {
  lang: Language;
}

export const ReviewsSection: React.FC<ReviewsProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section id="reviews" className="py-20 bg-[#161412] border-t border-b border-[#292521] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201d19] border border-[#3b352e] text-xs font-semibold text-[#c49b45] uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-[#c49b45] text-[#c49b45]" />
            <span>{t.reviews.badge}</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f4efe6] tracking-tight">
            {t.reviews.title}
          </h2>

          <p className="mt-3 text-base text-[#a89f92] font-light">
            {t.reviews.subtitle}
          </p>
        </div>

        {/* Rating Score Hero Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1916] border border-[#383127] shadow-xl max-w-3xl mx-auto mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c49b45] to-[#8d6923] p-1 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#181613] rounded-[12px] flex flex-col items-center justify-center">
                <span className="font-serif-display text-2xl font-black text-[#c49b45]">
                  {RESTAURANT_INFO.googleRating}
                </span>
                <span className="text-[10px] text-[#8e8576] font-mono">/ 5.0</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <h3 className="font-serif-display text-lg font-bold text-[#f4efe6]">
                Eccellente su Google Maps
              </h3>
              <p className="text-xs text-[#a09586] flex items-center justify-center sm:justify-start gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.reviews.basedOn}</span>
              </p>
            </div>
          </div>

          <a
            href={RESTAURANT_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-[#28231d] hover:bg-[#352f27] border border-[#443b2f] text-[#c49b45] text-xs font-semibold flex items-center gap-2 transition-colors shrink-0"
          >
            <span>{t.reviews.leaveReview}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Customer Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-[#181613] border border-[#2b2620] hover:border-[#42392d] transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <span className="text-[11px] text-[#857b6f] font-mono">
                    {rev.date[lang]}
                  </span>
                </div>

                {rev.highlight && (
                  <h4 className="font-serif-display text-base font-bold text-[#f4efe6] mb-2 flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-[#c49b45] shrink-0" />
                    <span>{rev.highlight}</span>
                  </h4>
                )}

                <p className="text-xs sm:text-sm text-[#beb5a8] leading-relaxed font-light italic">
                  "{rev.text[lang]}"
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#25211c] flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{rev.author}</span>
                <span className="text-[11px] text-[#7d7365] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  {rev.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
