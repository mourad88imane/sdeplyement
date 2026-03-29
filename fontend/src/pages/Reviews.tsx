import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles } from 'lucide-react';
import ReviewList from '@/components/reviews/ReviewList';

const ReviewsPage: React.FC = () => {
  const { language: lang } = useLanguage();
  const isRtl = lang === 'ar';

  const t = useCallback(
    (ar: string, fr: string, en: string) =>
      lang === 'ar' ? ar : lang === 'en' ? en : fr,
    [lang],
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Subtle background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(19,48,89,0.04)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(232,201,122,0.05)_0%,transparent_50%)]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#133059]/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Hero Header */}
        <motion.div
          className="pt-32 pb-20 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/80 border border-[#e8c97a]/20 shadow-lg shadow-[#e8c97a]/5 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e8c97a]" />
            <span className="text-[#133059] text-[11px] font-bold uppercase tracking-[0.2em]">
              {t('آراء و شهادات', 'Avis & Temoignages', 'Reviews & Testimonials')}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-serif font-bold text-[#133059] mb-6 tracking-tight leading-tight"
            style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
          >
            {t('آراء و شهادات', 'Avis & Temoignages', 'Reviews & Testimonials')}
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#e8c97a]/60" />
            <div className="w-2 h-2 rounded-full bg-[#e8c97a] shadow-sm shadow-[#e8c97a]/40" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#e8c97a]/60" />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            {t(
              'اكتشف تجارب طلابنا وشركائنا وزوارنا',
              'Decouvrez les experiences de nos etudiants, partenaires et visiteurs',
              'Discover the experiences of our students, partners, and visitors',
            )}
          </motion.p>
        </motion.div>

        {/* Reviews Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="pb-28"
        >
          <ReviewList />
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>
    </div>
  );
};

export default ReviewsPage;
