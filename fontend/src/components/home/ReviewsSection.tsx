import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Star, MessageCircle } from 'lucide-react';

export type Review = {
  id: number;
  reviewer_type: string;
  rating: number;
  created_at: string;
  photo?: string;
  reviewer_name_fr?: string;
  reviewer_name_ar?: string;
  reviewer_name_en?: string;
  content_fr?: string;
  content_ar?: string;
  content_en?: string;
};

const reviewerTypeLabels: Record<string, { fr: string; ar: string; en: string }> = {
  visitor: { fr: 'Visiteur', ar: 'زائر', en: 'Visitor' },
  student: { fr: 'Étudiant', ar: 'طالب', en: 'Student' },
  sponsor: { fr: 'Sponsor', ar: 'راعي', en: 'Sponsor' },
};

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const { lang } = useLanguage();

  useEffect(() => {
    fetch('http://localhost:8000/api/reviews/')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setReviews(data);
        else if (data && Array.isArray(data.results)) setReviews(data.results);
        else setReviews([]);
      })
      .catch(() => setReviews([]));
  }, []);

  // ✨ MEMOIZATION
  const displayedReviews = useMemo(() => {
    const itemsPerPage = 6;
    const start = currentPage * itemsPerPage;
    return reviews.slice(start, start + itemsPerPage);
  }, [reviews, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(reviews.length / 6);
  }, [reviews.length]);

  // ✨ TEXTES MEMOIZÉS
  const texts = useMemo(() => ({
    title: lang === 'ar' ? 'آراء الزوار والطلاب والرعاة' : lang === 'en' ? 'What They Say About Us' : 'Ils nous font confiance',
    subtitle: lang === 'ar' ? 'اكتشف تجارب وآراء من يثقون بنا' : lang === 'en' ? 'Discover experiences from our community' : 'Découvrez les témoignages de notre communauté',
    noReviews: lang === 'ar' ? 'لا توجد آراء بعد.' : lang === 'en' ? 'No reviews yet.' : 'Aucun avis pour le moment.',
  }), [lang]);

  // ✨ ANIMATIONS
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const ratingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, staggerChildren: 0.05 },
    },
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-white via-blue/5 to-white">
      
      {/* ✨ BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ willChange: 'transform' }}>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        
        {/* ✨ HEADER SECTION */}
        <motion.div
          className="text-center mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#133059]/20 bg-[#133059]/5 backdrop-blur-sm mb-6"
          >
            <MessageCircle className="w-4 h-4 text-[#e8c97a] animate-pulse" />
            <span className="text-[#133059] text-xs font-bold uppercase tracking-widest">
              {lang === 'ar' ? '⭐ آراء مصدقة' : lang === 'en' ? '⭐ Verified Reviews' : '⭐ Avis Vérifiés'}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#133059] mb-6"
            style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
          >
            {texts.title}
          </motion.h2>

          {/* Decorative line */}
          <motion.div
            variants={itemVariants}
            className="h-1 w-24 bg-gradient-to-r from-[#e8c97a] to-[#133059] rounded-full mx-auto mb-6"
          />

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto"
          >
            {texts.subtitle}
          </motion.p>
        </motion.div>

        {/* ✨ REVIEWS GRID */}
        {reviews.length === 0 ? (
          <motion.div
            className="text-center text-slate-500 py-16"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl">{texts.noReviews}</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              {displayedReviews.map((review) => {
                // ✨ DYNAMIC LANGUAGE SELECTION
                let name = review.reviewer_name_fr || 'Anonymous';
                let content = review.content_fr || '';
                
                if (lang === 'ar') {
                  name = review.reviewer_name_ar || review.reviewer_name_fr || 'Anonymous';
                  content = review.content_ar || review.content_fr || '';
                } else if (lang === 'en') {
                  name = review.reviewer_name_en || review.reviewer_name_fr || 'Anonymous';
                  content = review.content_en || review.content_fr || '';
                }

                const typeLabel = reviewerTypeLabels[review.reviewer_type]?.[lang] || review.reviewer_type;

                return (
                  <motion.div
                    key={review.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="group relative"
                  >
                    {/* Card Background with Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#133059]/5 via-transparent to-[#e8c97a]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Card Content */}
                    <div className="relative h-full bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-8 shadow-lg group-hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden">
                      
                      {/* Decorative Corner */}
                      <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#e8c97a]/20 to-[#e8c97a]/0 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Header: Avatar & Name */}
                      <div className="flex items-start gap-4 mb-6 relative z-10">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {review.photo ? (
                            <img
                              src={review.photo.startsWith('http') ? review.photo : `http://localhost:8000${review.photo}`}
                              alt={name}
                              className="w-16 h-16 rounded-full object-cover border-3 border-[#e8c97a]/40 shadow-lg group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#133059]/20 to-[#e8c97a]/20 flex items-center justify-center text-2xl font-bold text-[#133059] border-3 border-[#e8c97a]/40 group-hover:scale-110 transition-transform duration-300">
                              {name ? name[0].toUpperCase() : '?'}
                            </div>
                          )}
                        </div>

                        {/* Name & Type */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-lg text-[#133059] truncate group-hover:text-[#e8c97a] transition-colors duration-300">
                            {name}
                          </p>
                          <span className="inline-block text-xs font-semibold bg-gradient-to-r from-[#133059]/10 to-[#e8c97a]/10 text-[#133059] px-3 py-1 rounded-full mt-1 border border-[#e8c97a]/20">
                            {typeLabel}
                          </span>
                        </div>
                      </div>

                      {/* Rating Stars */}
                      <motion.div
                        className="flex gap-1.5 mb-6"
                        variants={ratingVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <motion.div
                            key={i}
                            variants={{ hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 1, scale: 1 } }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <Star
                              size={20}
                              className={`transition-all duration-300 ${
                                i < review.rating
                                  ? 'text-[#e8c97a] fill-[#e8c97a] drop-shadow-lg'
                                  : 'text-slate-300 opacity-50'
                              }`}
                            />
                          </motion.div>
                        ))}
                      </motion.div>

                      {/* Review Content */}
                      <p className="text-slate-600 leading-relaxed text-base flex-1 mb-6 group-hover:text-[#133059] transition-colors duration-300 italic">
                        "{content}"
                      </p>

                      {/* Footer: Date */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                        <span className="text-xs text-slate-400 font-medium">
                          {new Date(review.created_at).toLocaleDateString(lang === 'ar' ? 'ar' : lang === 'en' ? 'en-US' : 'fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <div className="text-[#e8c97a] opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                          <MessageCircle size={16} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* ✨ PAGINATION */}
            {totalPages > 1 && (
              <motion.div
                className="flex items-center justify-center gap-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {Array.from({ length: totalPages }).map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-full font-bold transition-all duration-300 ${
                      currentPage === i
                        ? 'bg-gradient-to-r from-[#133059] to-[#0a2342] text-white shadow-lg'
                        : 'bg-slate-200/50 text-[#133059] hover:bg-slate-300/50'
                    }`}
                  >
                    {i + 1}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        
        /* ✨ PERFORMANCE OPTIMIZATIONS */
        img {
          content-visibility: auto;
          contain-intrinsic-size: auto 64px;
        }
        
        .group:hover {
          transform: none;
        }
      `}</style>
    </section>
  );
}
