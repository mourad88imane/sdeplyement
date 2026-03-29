import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Radio, Sparkles, X, Calendar, Lightbulb } from 'lucide-react';
import { useCallback, useMemo, useState, useEffect } from 'react';

interface Equipment {
  id: number;
  name_fr: string;
  name_ar: string;
  slug: string;
  description_fr: string;
  description_ar: string;
  historical_context_fr?: string;
  historical_context_ar?: string;
  inventory_number: string;
  condition: string;
  condition_display_fr: string;
  condition_display_ar: string;
  status: string;
  status_display_fr: string;
  status_display_ar: string;
  origin: string;
  period: string;
  production_date: string;
  dimensions: string;
  weight: string;
  image: string | null;
  image_alt_fr: string;
  image_alt_ar: string;
  featured: boolean;
  author_name: string;
  created_at: string;
}

const MuseumEquipment = () => {
  const { language: lang } = useLanguage();
  const isRtl = lang === 'ar';

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 6;

  const t = useCallback(
    (ar: string, fr: string, en: string) =>
      lang === 'ar' ? ar : lang === 'en' ? en : fr,
    [lang],
  );

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch('/api/museum/equipment/');
        if (!response.ok) {
          throw new Error('Failed to fetch equipment');
        }
        const data = await response.json();
        setEquipment(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error('Error fetching equipment:', err);
        setError('Failed to load equipment');
        setEquipment([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(equipment.map((eq) => eq.condition))];
    return [
      { id: 'all', labelFr: 'Tous', labelAr: 'الكل', labelEn: 'All' },
      ...uniqueCategories.map((cat) => ({
        id: cat,
        labelFr: cat.charAt(0).toUpperCase() + cat.slice(1),
        labelAr: cat,
        labelEn: cat.charAt(0).toUpperCase() + cat.slice(1),
      })),
    ];
  }, [equipment]);

  const filtered =
    selectedCategory === 'all'
      ? equipment
      : equipment.filter((eq) => eq.condition === selectedCategory);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-[3px] border-slate-200 border-t-[#e8c97a] mx-auto mb-6" />
          <p className="text-slate-500 text-sm font-medium tracking-wide">
            {t('جاري التحميل...', 'Chargement des equipements...', 'Loading equipment...')}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <p className="text-red-400 mb-6 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-7 py-3 bg-[#133059] text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all"
          >
            {t('إعادة المحاولة', 'Reessayer', 'Retry')}
          </button>
        </div>
      </div>
    );
  }

  if (equipment.length === 0) {
    return (
      <div className="min-h-screen bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(19,48,89,0.04)_0%,transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(232,201,122,0.05)_0%,transparent_50%)]" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 pt-32 pb-20 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#e8c97a]/10 to-[#e8c97a]/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#e8c97a]/10">
            <Radio className="h-8 w-8 text-[#e8c97a]/40" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#133059] mb-5 tracking-tight">
            {t('مجموعتنا', 'Notre Collection', 'Our Collection')}
          </h1>
          <p className="text-slate-500 text-base">
            {t(
              'لا توجد معدات متاحة حاليًا',
              'Aucun equipement disponible pour le moment',
              'No equipment available at the moment',
            )}
          </p>
          <p className="text-slate-400 mt-3 text-sm">
            {t(
              'أضف معدات من لوحة الإدارة',
              "Ajoutez des equipements depuis le panneau d'administration",
              'Add equipment from the admin panel',
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(19,48,89,0.04)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(232,201,122,0.05)_0%,transparent_50%)]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#133059]/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10">
        {/* HERO HEADER */}
        <motion.div
          className="pt-32 pb-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/80 border border-[#e8c97a]/20 shadow-lg shadow-[#e8c97a]/5 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e8c97a]" />
            <span className="text-[#133059] text-[11px] font-bold uppercase tracking-[0.2em]">
              {t('المعدات التاريخية', 'Equipements Historiques', 'Historical Equipment')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-[#133059] mb-6 tracking-tight leading-tight"
            style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
          >
            {t('مجموعتنا الكاملة', 'Notre Collection Complete', 'Our Complete Collection')}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#e8c97a]/60" />
            <div className="w-2 h-2 rounded-full bg-[#e8c97a] shadow-sm shadow-[#e8c97a]/40" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#e8c97a]/60" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            {t(
              'استكشف مجموعة شاملة من المعدات والأجهزة التاريخية',
              "Explorez une collection complete d'equipements et appareils historiques",
              'Explore a comprehensive collection of historical equipment and devices',
            )}
          </motion.p>
        </motion.div>

        {/* FILTER TABS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16 flex items-center justify-center"
        >
          <div className="inline-flex flex-wrap gap-2 justify-center p-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-sm">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-[0.15em] transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-[#133059] text-white shadow-md'
                    : 'text-slate-500 hover:text-[#133059] hover:bg-slate-50'
                }`}
              >
                {lang === 'ar' ? cat.labelAr : lang === 'en' ? cat.labelEn : cat.labelFr}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* EQUIPMENT GRID */}
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => setSelectedEquipment(item)}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#e8c97a]/[0.04] to-[#133059]/[0.04] rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#e8c97a]/60 via-[#133059]/30 to-transparent" />

                  {/* Image */}
                  <div className="relative h-60 bg-gradient-to-br from-[#133059]/[0.05] to-[#e8c97a]/[0.05] flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={t(item.name_ar, item.name_fr, item.name_fr)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <Radio className="h-12 w-12 text-[#e8c97a]/20 group-hover:text-[#e8c97a]/35 group-hover:scale-110 transition-all duration-500" />
                    )}

                    {/* Period Badge */}
                    {item.period && (
                      <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[#133059] text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-200/60 shadow-sm`}>
                        {item.period}
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className={`absolute bottom-4 ${isRtl ? 'right-4' : 'left-4'} px-3 py-1.5 bg-[#133059]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm`}>
                      {t(item.status_display_ar, item.status_display_fr, item.status_display_fr)}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#133059]/70 via-[#133059]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-16">
                      <span className="text-white/90 text-xs font-bold uppercase tracking-widest">
                        {t('التفاصيل', 'Voir Details', 'View Details')}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-6">
                    <h3 className="text-base font-bold text-[#133059] mb-2 tracking-tight">
                      {t(item.name_ar, item.name_fr, item.name_fr)}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {t(item.description_ar, item.description_fr, item.description_fr)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-16 flex items-center justify-center gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2.5 rounded-xl text-sm border border-slate-200/80 text-slate-500 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300/80 transition-all"
            >
              {isRtl ? '→' : '←'}
            </motion.button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-[#133059] text-white shadow-md'
                    : 'border border-slate-200/80 text-slate-500 hover:bg-slate-50 hover:border-slate-300/80'
                }`}
              >
                {page}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2.5 rounded-xl text-sm border border-slate-200/80 text-slate-500 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300/80 transition-all"
            >
              {isRtl ? '←' : '→'}
            </motion.button>
          </motion.div>
        )}

        {/* INFO STATS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-28"
        >
          <div className="text-center py-5 px-8 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm">
            <p className="text-slate-400 text-sm font-medium">
              {t(
                `عرض ${paginatedItems.length} من ${filtered.length} معدات`,
                `Affichage ${paginatedItems.length} sur ${filtered.length} equipements`,
                `Showing ${paginatedItems.length} of ${filtered.length} equipment`,
              )}
            </p>
          </div>
        </motion.div>
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedEquipment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEquipment(null)}
            className="fixed inset-0 bg-[#133059]/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200/50"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {/* Modal Header */}
              <div className="h-60 bg-gradient-to-br from-[#133059]/[0.06] to-[#e8c97a]/[0.06] flex items-center justify-center overflow-hidden sticky top-0 z-10">
                {selectedEquipment.image ? (
                  <img
                    src={selectedEquipment.image}
                    alt={t(selectedEquipment.name_ar, selectedEquipment.name_fr, selectedEquipment.name_fr)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Radio className="h-20 w-20 text-[#e8c97a]/20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent" />

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedEquipment(null)}
                  className={`absolute top-5 ${isRtl ? 'left-5' : 'right-5'} w-10 h-10 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-slate-200/50 hover:bg-white transition-all`}
                >
                  <X className="w-4 h-4 text-[#133059]" />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-8 md:p-10">
                {/* Title & Period */}
                <div className="mb-6">
                  {selectedEquipment.period && (
                    <div className="flex items-center gap-2.5 mb-3">
                      <Calendar className="w-4 h-4 text-[#e8c97a]" />
                      <span className="text-[11px] font-bold text-[#e8c97a] uppercase tracking-[0.15em]">
                        {selectedEquipment.period}
                      </span>
                    </div>
                  )}
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#133059] tracking-tight">
                    {t(selectedEquipment.name_ar, selectedEquipment.name_fr, selectedEquipment.name_fr)}
                  </h2>
                </div>

                {/* Category & Status */}
                <div className="mb-8 flex items-center gap-2 flex-wrap">
                  <div className="px-3.5 py-1.5 bg-gradient-to-r from-[#e8c97a]/15 to-[#e8c97a]/5 rounded-lg border border-[#e8c97a]/15">
                    <span className="text-[11px] font-bold text-[#133059] uppercase tracking-wider">
                      {t(selectedEquipment.status_display_ar, selectedEquipment.status_display_fr, selectedEquipment.status_display_fr)}
                    </span>
                  </div>
                  {selectedEquipment.condition && (
                    <div className="px-3.5 py-1.5 bg-[#133059]/[0.04] rounded-lg border border-[#133059]/10">
                      <span className="text-[11px] font-bold text-[#133059] uppercase tracking-wider">
                        {t(selectedEquipment.condition_display_ar, selectedEquipment.condition_display_fr, selectedEquipment.condition_display_fr)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="mb-8 p-6 bg-slate-50/80 rounded-2xl border border-slate-200/60">
                  <p className="text-[15px] text-slate-600 leading-relaxed">
                    {t(selectedEquipment.description_ar, selectedEquipment.description_fr, selectedEquipment.description_fr)}
                  </p>
                </div>

                {/* Historical Context */}
                {(selectedEquipment.historical_context_fr || selectedEquipment.historical_context_ar) && (
                  <div className="mb-8">
                    <h3 className={`text-lg font-bold text-[#133059] mb-4 flex items-center gap-2.5 tracking-tight ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <div className="p-1.5 bg-gradient-to-br from-[#e8c97a]/12 to-[#e8c97a]/5 rounded-lg border border-[#e8c97a]/10">
                        <Lightbulb className="w-4 h-4 text-[#e8c97a]" />
                      </div>
                      {t('معلومات تفصيلية', 'Informations Detaillees', 'Detailed Information')}
                    </h3>
                    <p className="text-[15px] text-slate-600 leading-relaxed">
                      {t(
                        selectedEquipment.historical_context_ar || '',
                        selectedEquipment.historical_context_fr || '',
                        selectedEquipment.historical_context_fr || '',
                      )}
                    </p>
                  </div>
                )}

                {/* Additional Info Grid */}
                <div className="mb-8 grid grid-cols-2 gap-3">
                  {selectedEquipment.origin && (
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
                      <p className="text-[10px] font-bold text-[#e8c97a] uppercase tracking-[0.15em] mb-1.5">
                        {t('الأصل', 'Origine', 'Origin')}
                      </p>
                      <p className="text-sm text-[#133059] font-medium">{selectedEquipment.origin}</p>
                    </div>
                  )}
                  {selectedEquipment.inventory_number && (
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
                      <p className="text-[10px] font-bold text-[#e8c97a] uppercase tracking-[0.15em] mb-1.5">
                        {t('رقم المخزون', 'N Inventaire', 'Inventory No.')}
                      </p>
                      <p className="text-sm text-[#133059] font-medium">{selectedEquipment.inventory_number}</p>
                    </div>
                  )}
                  {selectedEquipment.dimensions && (
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
                      <p className="text-[10px] font-bold text-[#e8c97a] uppercase tracking-[0.15em] mb-1.5">
                        {t('الأبعاد', 'Dimensions', 'Dimensions')}
                      </p>
                      <p className="text-sm text-[#133059] font-medium">{selectedEquipment.dimensions}</p>
                    </div>
                  )}
                  {selectedEquipment.weight && (
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
                      <p className="text-[10px] font-bold text-[#e8c97a] uppercase tracking-[0.15em] mb-1.5">
                        {t('الوزن', 'Poids', 'Weight')}
                      </p>
                      <p className="text-sm text-[#133059] font-medium">{selectedEquipment.weight}</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-slate-200/60">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedEquipment(null)}
                    className="w-full px-6 py-3.5 bg-[#133059] text-white text-sm font-bold rounded-2xl hover:shadow-lg hover:shadow-[#133059]/15 transition-all duration-300"
                  >
                    {t('إغلاق', 'Fermer', 'Close')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>
    </div>
  );
};

export default MuseumEquipment;
