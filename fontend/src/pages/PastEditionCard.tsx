import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Crown, Medal, Image as ImageIcon, Trophy, Gift } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getMediaUrl } from '@/utils';
import Lightbox from './Lightbox';
import type { HackathonEvent, Prize, Winner, GalleryItem, Theme } from '@/types';

interface PastEditionCardProps {
  event: HackathonEvent;
  prizes: Prize[];
  winners: Winner[];
  gallery: GalleryItem[];
  themes: Theme[];
}

const t = (lang: string, fr: string, ar: string, en: string) =>
  lang === 'ar' ? ar : lang === 'en' ? en : fr;

const placeEmoji = (place: number) =>
  place === 1 ? '\u{1F947}' : place === 2 ? '\u{1F948}' : place === 3 ? '\u{1F949}' : `#${place}`;

const placeBorder = (place: number) =>
  place === 1 ? 'border-[#e8c97a]' : place === 2 ? 'border-slate-400' : 'border-amber-600';

export default function PastEditionCard({ event, prizes, winners, gallery, themes }: PastEditionCardProps) {
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<{ url: string; caption: string } | null>(null);

  const topWinner = winners.find((w) => w.place === 1);
  const sortedWinners = [...winners].sort((a, b) => a.place - b.place);
  const regularPrizes = prizes.filter((p) => !p.is_special).sort((a, b) => a.place - b.place);
  const specialPrizes = prizes.filter((p) => p.is_special);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const title = t(language, event.title_fr, event.title_ar, event.title_en);
  const subtitle = t(language, event.subtitle_fr, event.subtitle_ar, event.subtitle_en);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
        className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white"
      >
        {/* Header */}
        <div
          className="relative p-8 text-center"
          style={{
            background: event.banner
              ? undefined
              : 'linear-gradient(135deg, #133059 0%, #0a1e38 100%)',
          }}
        >
          {event.banner && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url(${getMediaUrl(event.banner)})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#133059] to-[#0a1e38] opacity-80" />
            </>
          )}
          <div className="relative z-10">
            <span className="inline-block px-4 py-1 rounded-full bg-[#e8c97a]/20 text-[#e8c97a] text-sm font-semibold mb-3">
              {event.year}
            </span>
            <h3 className="text-2xl font-serif font-bold text-white mb-2">{title}</h3>
            <p className="text-[#e8c97a] text-sm">{subtitle}</p>
          </div>
        </div>

        {/* Themes pills */}
        {themes.length > 0 && (
          <div className="flex flex-wrap gap-2 px-6 py-4 justify-center">
            {themes.map((theme) => (
              <span
                key={theme.id}
                className="px-3 py-1 rounded-full border border-[#e8c97a] text-[#133059] text-xs font-medium"
              >
                {t(language, theme.title_fr, theme.title_ar, theme.title_en)}
              </span>
            ))}
          </div>
        )}

        {/* Top winner preview */}
        {topWinner && (
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 justify-center text-sm text-slate-600">
              <Crown size={16} className="text-[#e8c97a]" />
              <span className="font-semibold">{topWinner.team_name}</span>
              <span className="text-slate-400">-</span>
              <span>{t(language, topWinner.project_name_fr, topWinner.project_name_ar, topWinner.project_name_en)}</span>
            </div>
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-3 flex items-center justify-center gap-2 text-sm font-medium text-[#133059] hover:bg-slate-50 transition-colors border-t border-slate-100"
        >
          {expanded
            ? t(language, 'Voir moins', '\u0639\u0631\u0636 \u0623\u0642\u0644', 'See less')
            : t(language, 'Voir plus', '\u0639\u0631\u0636 \u0627\u0644\u0645\u0632\u064a\u062f', 'See more')}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-6">
                {/* Winners */}
                {sortedWinners.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy size={18} className="text-[#e8c97a]" />
                      <h4 className="font-serif font-bold text-[#133059]">
                        {t(language, 'Gagnants', '\u0627\u0644\u0641\u0627\u0626\u0632\u0648\u0646', 'Winners')}
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {sortedWinners.map((winner) => (
                        <div
                          key={winner.id}
                          className={`p-4 rounded-xl border-2 ${placeBorder(winner.place)} bg-slate-50`}
                        >
                          <div className="flex items-start gap-3">
                            {winner.photo && (
                              <img
                                src={getMediaUrl(winner.photo)}
                                alt={winner.team_name}
                                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{placeEmoji(winner.place)}</span>
                                <span className="font-bold text-[#133059]">{winner.team_name}</span>
                              </div>
                              <p className="text-sm font-medium text-[#e8c97a]">
                                {t(language, winner.project_name_fr, winner.project_name_ar, winner.project_name_en)}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {t(language, winner.project_description_fr, winner.project_description_ar, winner.project_description_en)}
                              </p>
                              {winner.members && (
                                <p className="text-xs text-slate-400 mt-2 italic">{winner.members}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prizes */}
                {(regularPrizes.length > 0 || specialPrizes.length > 0) && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Gift size={18} className="text-[#e8c97a]" />
                      <h4 className="font-serif font-bold text-[#133059]">
                        {t(language, 'Prix', '\u0627\u0644\u062c\u0648\u0627\u0626\u0632', 'Prizes')}
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {regularPrizes.map((prize) => (
                        <div key={prize.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                          <span className="text-lg">{placeEmoji(prize.place)}</span>
                          <div className="flex-1">
                            <span className="font-medium text-[#133059] text-sm">
                              {t(language, prize.title_fr, prize.title_ar, prize.title_en)}
                            </span>
                            <p className="text-xs text-slate-500">
                              {t(language, prize.description_fr, prize.description_ar, prize.description_en)}
                            </p>
                          </div>
                          <span className="font-bold text-[#e8c97a] text-sm">
                            {Number(prize.amount).toLocaleString()} DA
                          </span>
                        </div>
                      ))}
                      {specialPrizes.map((prize) => (
                        <div key={prize.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#133059]/5 border border-[#133059]/10">
                          <Medal size={18} className="text-[#e8c97a]" />
                          <div className="flex-1">
                            <span className="font-medium text-[#133059] text-sm">
                              {t(language, prize.title_fr, prize.title_ar, prize.title_en)}
                            </span>
                            <p className="text-xs text-slate-500">
                              {t(language, prize.description_fr, prize.description_ar, prize.description_en)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gallery */}
                {gallery.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon size={18} className="text-[#e8c97a]" />
                      <h4 className="font-serif font-bold text-[#133059]">
                        {t(language, 'Galerie', '\u0627\u0644\u0645\u0639\u0631\u0636', 'Gallery')}
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {gallery.map((item) => (
                        <button
                          key={item.id}
                          onClick={() =>
                            setLightbox({
                              url: getMediaUrl(item.image),
                              caption: t(language, item.caption_fr, item.caption_ar, item.caption_en),
                            })
                          }
                          className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                        >
                          <img
                            src={getMediaUrl(item.image)}
                            alt={t(language, item.caption_fr, item.caption_ar, item.caption_en)}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <ImageIcon
                              size={24}
                              className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Lightbox
        isOpen={!!lightbox}
        imageUrl={lightbox?.url || ''}
        caption={lightbox?.caption || ''}
        onClose={closeLightbox}
      />
    </>
  );
}
