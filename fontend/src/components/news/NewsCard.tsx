import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Eye, Clock, User, Flame, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { NewsArticle, formatNewsDate, formatPriority } from '@/services/api';

interface NewsCardProps {
  article: NewsArticle;
  index?: number;
  onClick?: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, index = 0, onClick }) => {
  const { language: lang } = useLanguage();

  // ✨ MEMOIZATION - Contenu dynamique selon la langue
  const content = useMemo(() => ({
    title: lang === 'ar' ? article.title_ar : article.title_fr,
    summary: lang === 'ar' ? article.summary_ar : article.summary_fr,
    categoryName: lang === 'ar' ? article.category_name_ar : article.category_name_fr,
    imageAlt: lang === 'ar' ? article.image_alt_ar : article.image_alt_fr,
    publishedLabel: lang === 'ar' ? 'نُشر في' : 'Publié le',
    byLabel: lang === 'ar' ? 'بواسطة' : 'Par',
    readingTimeLabel: lang === 'ar' ? 'دقائق قراءة' : 'min de lecture',
    commentsLabel: lang === 'ar' ? 'تعليقات' : 'commentaires',
    eventLabel: lang === 'ar' ? 'فعالية' : 'Événement',
    eventDateLabel: lang === 'ar' ? 'تاريخ الفعالية:' : 'Date de l\'événement:',
    featured: lang === 'ar' ? 'مميز' : 'Mis en avant',
  }), [lang, article]);

  // ✨ PRIORITY COLOR CONFIG - Cohérent avec le design
  const getPriorityConfig = (priority: string) => {
    const configs: Record<string, { color: string; bg: string; icon: JSX.Element }> = {
      urgent: { 
        color: '#e8c97a', 
        bg: 'from-red-600/90 to-red-700/90',
        icon: <Flame className="w-3 h-3" />
      },
      high: { 
        color: '#e8c97a', 
        bg: 'from-orange-600/90 to-orange-700/90',
        icon: <Flame className="w-3 h-3" />
      },
      normal: { 
        color: '#ffffff', 
        bg: 'from-[#133059]/80 to-[#0a2342]/80',
        icon: <Eye className="w-3 h-3" />
      },
      low: { 
        color: '#ffffff', 
        bg: 'from-slate-600/80 to-slate-700/80',
        icon: <Clock className="w-3 h-3" />
      },
    };
    return configs[priority] || configs['normal'];
  };

  // ✨ FORMAT DATES
  const formatDate = (dateString: string) => {
    return formatNewsDate(dateString, lang);
  };

  const formatEventDate = (dateString?: string) => {
    if (!dateString) return null;
    const eventDate = new Date(dateString);
    const now = new Date();
    
    if (eventDate > now) {
      return {
        text: formatNewsDate(dateString, lang),
        isUpcoming: true
      };
    }
    return null;
  };

  const eventInfo = formatEventDate(article.event_date);
  const priorityConfig = getPriorityConfig(article.priority);

  // ✨ ANIMATIONS
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: index * 0.1, ease: 'easeOut' },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.7 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="h-full"
    >
      <div
        onClick={onClick}
        className="relative h-full flex flex-col bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer"
      >
        
        {/* ✨ IMAGE SECTION */}
        <motion.div
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300"
        >
          <img
            src={article.featured_image}
            alt={content.imageAlt || content.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
            decoding="async"
          />
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 group-hover:from-black/40 group-hover:to-black/60 transition-all duration-500" />

          {/* Decorative corner on hover */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-[#e8c97a]/30 to-[#e8c97a]/0 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Featured Badge - Top Left */}
          {article.featured && (
            <motion.div
              className="absolute top-4 left-4 z-10"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#e8c97a]/90 to-[#d4a574]/90 text-[#133059] font-bold text-xs uppercase tracking-widest border-2 border-[#e8c97a] flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                <span className="text-lg">⭐</span>
                {content.featured}
              </div>
            </motion.div>
          )}

          {/* Priority Badge - Top Left (with offset if featured) */}
          <motion.div
            className={`absolute ${article.featured ? 'top-14' : 'top-4'} left-4 z-10`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div
              className={`px-3 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest border-2 backdrop-blur-md text-white bg-gradient-to-r ${priorityConfig.bg} border-[#e8c97a]/40 flex items-center gap-1.5 shadow-lg`}
            >
              {priorityConfig.icon}
              {formatPriority(article.priority, lang)}
            </div>
          </motion.div>

          {/* Category Badge - Top Right */}
          <motion.div
            className="absolute top-4 right-4 z-10"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <div
              className="px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest text-white border-2 backdrop-blur-md shadow-lg transition-all"
              style={{
                backgroundColor: `${article.category_color}dd`,
                borderColor: article.category_color,
              }}
            >
              {content.categoryName}
            </div>
          </motion.div>

          {/* Views Counter - Bottom Right */}
          <motion.div
            className="absolute bottom-4 right-4 z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <div className="px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md border border-white/20">
              <Eye className="w-3.5 h-3.5 text-[#e8c97a]" />
              {article.views_count}
            </div>
          </motion.div>

          {/* Event Date Badge - Bottom Left - ✨ OR (#e8c97a) au lieu du vert */}
          {eventInfo && (
            <motion.div
              className="absolute bottom-4 left-4 z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#e8c97a]/90 to-[#d4a574]/90 text-[#133059] font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md border-2 border-[#e8c97a] shadow-lg">
                <Calendar className="w-3.5 h-3.5" />
                {content.eventLabel}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ✨ CONTENT SECTION */}
        <div className="flex-1 flex flex-col p-6 md:p-7">
          
          {/* Title */}
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className={`text-lg md:text-xl font-bold text-[#133059] mb-3 line-clamp-2 leading-tight group-hover:text-[#e8c97a] transition-colors duration-300 ${lang === 'ar' ? 'text-right' : ''}`}
          >
            {content.title}
          </motion.h3>

          {/* Summary */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1 group-hover:text-slate-700 transition-colors duration-300 ${lang === 'ar' ? 'text-right' : ''}`}
          >
            {content.summary}
          </motion.p>

          {/* Event Date Info - ✨ OR (#e8c97a) au lieu du vert */}
          {eventInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className={`mb-4 p-3 bg-gradient-to-r from-[#e8c97a]/15 to-[#d4a574]/15 rounded-xl border-l-4 border-[#e8c97a] backdrop-blur-sm ${lang === 'ar' ? 'text-right border-r-4 border-l-0' : ''}`}
            >
              <div className={`flex items-center gap-2 text-[#d4a574] ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold text-xs uppercase tracking-widest">
                  {content.eventDateLabel}
                </span>
              </div>
              <p className="text-[#e8c97a] font-bold mt-1 text-sm">
                {eventInfo.text}
              </p>
            </motion.div>
          )}

          {/* Article Metadata */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2 text-xs text-slate-500 pb-3 border-b border-slate-200/50"
          >
            {/* Published Date */}
            <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Calendar className="w-3.5 h-3.5 text-[#e8c97a] flex-shrink-0" />
              <span>
                {content.publishedLabel} <strong className="text-slate-700">{formatDate(article.published_at)}</strong>
              </span>
            </div>

            {/* Author */}
            <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <User className="w-3.5 h-3.5 text-[#e8c97a] flex-shrink-0" />
              <span>
                {content.byLabel} <strong className="text-slate-700">{article.author_name}</strong>
              </span>
            </div>

            {/* Reading Time */}
            <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Clock className="w-3.5 h-3.5 text-[#e8c97a] flex-shrink-0" />
              <span>
                <strong className="text-slate-700">{article.reading_time}</strong> {content.readingTimeLabel}
              </span>
            </div>
          </motion.div>

          {/* Comments Count - ✨ OR (#e8c97a) au lieu du bleu */}
          {article.comment_count > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#e8c97a]/10 text-[#133059] font-bold text-sm ${lang === 'ar' ? 'flex-row-reverse justify-end' : ''}`}
            >
              <MessageCircle className="w-4 h-4 text-[#e8c97a]" />
              <span>
                {article.comment_count} {content.commentsLabel}
              </span>
            </motion.div>
          )}
        </div>

        {/* ✨ DECORATIVE ELEMENTS */}
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#e8c97a]/10 to-[#e8c97a]/0 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-[#133059]/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      <style>{`
        /* ✨ PERFORMANCE OPTIMIZATIONS */
        img {
          content-visibility: auto;
          contain-intrinsic-size: auto 224px;
        }

        .group:hover {
          transform: none;
        }

        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-xl {
            backdrop-filter: blur(10px);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default NewsCard;
