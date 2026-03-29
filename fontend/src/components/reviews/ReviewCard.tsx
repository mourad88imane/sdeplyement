import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Star, Pencil, Trash2, User, Quote } from 'lucide-react';

interface Props {
  id: number;
  author_name: string;
  author_role: string;
  content_fr: string;
  content_ar: string;
  rating?: number | null;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const ReviewCard: React.FC<Props> = ({
  author_name,
  author_role,
  content_fr,
  content_ar,
  rating,
  onEdit,
  onDelete,
  id,
}) => {
  const { language: lang } = useLanguage();

  const t = useCallback(
    (ar: string, fr: string, en: string) =>
      lang === 'ar' ? ar : lang === 'en' ? en : fr,
    [lang],
  );

  const roleLabels: Record<string, { ar: string; fr: string; en: string }> = {
    student: { ar: 'طالب', fr: 'Etudiant', en: 'Student' },
    sponsor: { ar: 'شريك', fr: 'Sponsor', en: 'Sponsor' },
    visitor: { ar: 'زائر', fr: 'Visiteur', en: 'Visitor' },
    staff: { ar: 'موظف', fr: 'Personnel', en: 'Staff' },
  };

  const roleLabel = roleLabels[author_role]
    ? t(roleLabels[author_role].ar, roleLabels[author_role].fr, roleLabels[author_role].en)
    : author_role;

  const roleColors: Record<string, string> = {
    student: 'from-blue-500/10 to-blue-500/5 border-blue-500/10 text-blue-700',
    sponsor: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/10 text-emerald-700',
    visitor: 'from-violet-500/10 to-violet-500/5 border-violet-500/10 text-violet-700',
    staff: 'from-amber-500/10 to-amber-500/5 border-amber-500/10 text-amber-700',
  };

  const roleBadgeClass =
    roleColors[author_role] ||
    'from-slate-500/10 to-slate-500/5 border-slate-500/10 text-slate-700';

  const content = lang === 'ar' ? content_ar : content_fr;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.005 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#133059]/[0.03] to-[#e8c97a]/[0.03] rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-7 md:p-8 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full flex flex-col">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#e8c97a]/50 via-[#133059]/20 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#e8c97a]/[0.03] to-transparent rounded-bl-full" />

        {/* Quote icon */}
        <div className="mb-5">
          <div className="w-10 h-10 bg-gradient-to-br from-[#e8c97a]/12 to-[#e8c97a]/5 rounded-xl border border-[#e8c97a]/10 flex items-center justify-center">
            <Quote className="w-4 h-4 text-[#e8c97a]" />
          </div>
        </div>

        {/* Rating */}
        {rating != null && rating > 0 && (
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 transition-colors ${
                  i < Math.min(5, Math.max(0, rating))
                    ? 'text-[#e8c97a] fill-[#e8c97a]'
                    : 'text-slate-200'
                }`}
              />
            ))}
            <span className="text-xs text-slate-400 font-medium ml-2">{rating}/5</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 mb-6">
          <p
            className="text-[15px] text-slate-600 leading-relaxed"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {content || (
              <span className="text-slate-400 italic">
                {t('لا يوجد محتوى', 'Pas de contenu', 'No content')}
              </span>
            )}
          </p>
        </div>

        {/* Author & Actions */}
        <div className="flex items-center justify-between gap-3 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#133059] to-[#1a4a7a] rounded-xl flex items-center justify-center shadow-sm">
              <User className="w-4 h-4 text-white/90" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#133059] tracking-tight leading-tight">
                {author_name}
              </p>
              <span
                className={`inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] rounded-md bg-gradient-to-r border ${roleBadgeClass}`}
              >
                {roleLabel}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {onEdit && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(id);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  title={t('تعديل', 'Modifier', 'Edit')}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </motion.button>
              )}
              {onDelete && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  title={t('حذف', 'Supprimer', 'Delete')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
