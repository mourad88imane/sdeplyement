import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { ReviewsService, Review } from '@/services/ReviewsService';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { MessageSquare, Plus, Pencil } from 'lucide-react';

const ReviewList: React.FC = () => {
  const { language: lang } = useLanguage();
  const isRtl = lang === 'ar';

  const t = useCallback(
    (ar: string, fr: string, en: string) =>
      lang === 'ar' ? ar : lang === 'en' ? en : fr,
    [lang],
  );

  const [reviews, setReviews] = useState<Review[]>([]);
  const [editing, setEditing] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    try {
      const data = await ReviewsService.list();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (payload: Partial<Review>) => {
    await ReviewsService.create(payload);
    setEditing(null);
    setShowForm(false);
    await load();
  };

  const handleUpdate = async (id: number, payload: Partial<Review>) => {
    await ReviewsService.update(id, payload);
    setEditing(null);
    await load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('هل تريد حذف هذا الرأي؟', 'Supprimer cet avis ?', 'Delete this review?'))) return;
    await ReviewsService.remove(id);
    await load();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-slate-200 border-t-[#e8c97a] mx-auto mb-5" />
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            {t('جاري التحميل...', 'Chargement...', 'Loading...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Section Header & Add Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-[#e8c97a]/15 to-[#e8c97a]/5 rounded-xl border border-[#e8c97a]/10">
            <MessageSquare className="h-5 w-5 text-[#e8c97a]" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#133059] tracking-tight">
              {t(
                'آراء الطلاب والشركاء والزوار',
                'Avis des etudiants, sponsors et visiteurs',
                'Student, Sponsor & Visitor Reviews',
              )}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {t(
                `${reviews.length} رأي`,
                `${reviews.length} avis`,
                `${reviews.length} review${reviews.length !== 1 ? 's' : ''}`,
              )}
            </p>
          </div>
        </div>

        {!showForm && !editing && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#133059] to-[#1a4a7a] text-white text-sm font-bold rounded-2xl shadow-lg shadow-[#133059]/15 hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            {t('اضافة رأي', 'Ajouter un avis', 'Add Review')}
          </motion.button>
        )}
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && !editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <ReviewForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-200/60">
            <MessageSquare className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-slate-400 text-base font-medium">
            {t('لا توجد آراء بعد', "Aucun avis pour l'instant", 'No reviews yet')}
          </p>
          <p className="text-slate-300 text-sm mt-2">
            {t(
              'كن أول من يضيف رأيه',
              'Soyez le premier a laisser un avis',
              'Be the first to leave a review',
            )}
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {reviews.map((r) => (
              <ReviewCard
                key={r.id}
                {...r}
                onEdit={(_id) => {
                  setEditing(r);
                  setShowForm(false);
                }}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Edit Form (inline, below cards) */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/10">
                <Pencil className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-[#133059] tracking-tight">
                {t('تعديل الرأي', "Modifier l'avis", 'Edit Review')}
              </h3>
            </div>
            <ReviewForm
              initial={editing}
              onSubmit={(p) => handleUpdate(editing.id, p)}
              onCancel={() => setEditing(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewList;
