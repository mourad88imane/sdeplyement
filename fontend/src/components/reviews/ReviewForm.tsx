import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Review } from '@/services/ReviewsService';
import { Send, X, Star, User, FileText, Globe } from 'lucide-react';

interface Props {
  initial?: Partial<Review> | null;
  onSubmit: (payload: Partial<Review>) => Promise<void> | void;
  onCancel?: () => void;
}

const ReviewForm: React.FC<Props> = ({ initial = null, onSubmit, onCancel }) => {
  const { language: lang } = useLanguage();
  const isRtl = lang === 'ar';

  const t = useCallback(
    (ar: string, fr: string, en: string) =>
      lang === 'ar' ? ar : lang === 'en' ? en : fr,
    [lang],
  );

  const [author_name, setAuthorName] = useState(initial?.author_name || '');
  const [author_role, setAuthorRole] = useState(initial?.author_role || 'student');
  const [content_fr, setContentFr] = useState(initial?.content_fr || '');
  const [content_ar, setContentAr] = useState(initial?.content_ar || '');
  const [rating, setRating] = useState<number | ''>(initial?.rating ?? '');
  const [is_published, setIsPublished] = useState(initial?.is_published ?? true);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        author_name,
        author_role,
        content_fr,
        content_ar,
        rating: rating === '' ? null : rating,
        is_published,
      });
      if (!initial) {
        setAuthorName('');
        setAuthorRole('student');
        setContentFr('');
        setContentAr('');
        setRating('');
        setIsPublished(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const roleOptions = [
    { value: 'student', label: t('طالب', 'Etudiant', 'Student') },
    { value: 'sponsor', label: t('شريك', 'Sponsor', 'Sponsor') },
    { value: 'visitor', label: t('زائر', 'Visiteur', 'Visitor') },
    { value: 'staff', label: t('موظف', 'Personnel', 'Staff') },
  ];

  const activeRating = hoverRating || (typeof rating === 'number' ? rating : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#133059]/[0.03] to-[#e8c97a]/[0.03] rounded-3xl blur-2xl" />

      <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 md:p-10 shadow-sm overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#133059] via-[#e8c97a]/60 to-transparent" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#e8c97a]/[0.04] to-transparent rounded-bl-full" />

        {/* Form title */}
        <div className="relative flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#133059]/10 to-[#133059]/5 rounded-xl border border-[#133059]/10">
              <FileText className="h-5 w-5 text-[#133059]" />
            </div>
            <h3 className="text-xl font-bold text-[#133059] tracking-tight">
              {initial
                ? t('تعديل الرأي', "Modifier l'avis", 'Edit Review')
                : t('اضافة رأي جديد', 'Ajouter un avis', 'Add a Review')}
            </h3>
          </div>
          {onCancel && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onCancel}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        <form onSubmit={submit} className="relative space-y-6">
          {/* Row 1: Name & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-[0.12em] mb-2.5">
                <User className="w-3.5 h-3.5 text-[#e8c97a]" />
                {t('الاسم', 'Nom', 'Name')}
              </label>
              <input
                value={author_name}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder={t('أدخل الاسم...', 'Entrez le nom...', 'Enter name...')}
                className="w-full px-5 py-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-sm text-[#133059] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#e8c97a]/30 focus:border-[#e8c97a]/40 transition-all duration-300"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-[0.12em] mb-2.5">
                <Globe className="w-3.5 h-3.5 text-[#e8c97a]" />
                {t('الدور', 'Role', 'Role')}
              </label>
              <select
                value={author_role}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-sm text-[#133059] focus:outline-none focus:ring-2 focus:ring-[#e8c97a]/30 focus:border-[#e8c97a]/40 transition-all duration-300 appearance-none cursor-pointer"
              >
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-[0.12em] mb-3">
              <Star className="w-3.5 h-3.5 text-[#e8c97a]" />
              {t('التقييم', 'Note', 'Rating')}
            </label>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star === rating ? '' : star)}
                  className="p-1 transition-colors"
                >
                  <Star
                    className={`w-7 h-7 transition-all duration-200 ${
                      star <= activeRating
                        ? 'text-[#e8c97a] fill-[#e8c97a] drop-shadow-sm'
                        : 'text-slate-200 hover:text-slate-300'
                    }`}
                  />
                </motion.button>
              ))}
              {typeof rating === 'number' && (
                <span className="text-xs text-slate-400 font-medium ml-2">{rating}/5</span>
              )}
            </div>
          </div>

          {/* Content FR */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-[0.12em] mb-2.5">
              <span className="w-5 h-5 bg-blue-50 rounded-md flex items-center justify-center text-[10px] font-black text-blue-500">
                FR
              </span>
              {t('المحتوى بالفرنسية', 'Contenu en francais', 'Content in French')}
            </label>
            <textarea
              value={content_fr}
              onChange={(e) => setContentFr(e.target.value)}
              placeholder={t('اكتب المحتوى بالفرنسية...', 'Ecrivez le contenu en francais...', 'Write content in French...')}
              rows={3}
              dir="ltr"
              className="w-full px-5 py-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-sm text-[#133059] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#e8c97a]/30 focus:border-[#e8c97a]/40 transition-all duration-300 resize-none leading-relaxed"
            />
          </div>

          {/* Content AR */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-[0.12em] mb-2.5">
              <span className="w-5 h-5 bg-emerald-50 rounded-md flex items-center justify-center text-[10px] font-black text-emerald-600">
                AR
              </span>
              {t('المحتوى بالعربية', 'Contenu en arabe', 'Content in Arabic')}
            </label>
            <textarea
              value={content_ar}
              onChange={(e) => setContentAr(e.target.value)}
              placeholder={t('اكتب المحتوى بالعربية...', 'Ecrivez le contenu en arabe...', 'Write content in Arabic...')}
              rows={3}
              dir="rtl"
              className="w-full px-5 py-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-sm text-[#133059] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#e8c97a]/30 focus:border-[#e8c97a]/40 transition-all duration-300 resize-none leading-relaxed"
            />
          </div>

          {/* Published toggle & submit */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none group/toggle">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={is_published}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer-checked:bg-[#133059] transition-colors duration-300" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-transform duration-300" />
              </div>
              <span className="text-sm font-medium text-slate-600 group-hover/toggle:text-[#133059] transition-colors">
                {t('منشور', 'Publie', 'Published')}
              </span>
            </label>

            <div className="flex items-center gap-2.5">
              {onCancel && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 border border-slate-200/80 text-slate-500 text-sm font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300/80 transition-all duration-300"
                >
                  {t('إلغاء', 'Annuler', 'Cancel')}
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2.5 px-7 py-3 bg-gradient-to-r from-[#133059] to-[#1a4a7a] text-white text-sm font-bold rounded-2xl shadow-lg shadow-[#133059]/15 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                )}
                {initial
                  ? t('تحديث', 'Mettre a jour', 'Update')
                  : t('اضافة', 'Ajouter', 'Submit')}
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ReviewForm;
