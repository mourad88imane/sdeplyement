import { memo, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, Download, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import BookReservationButton from './BookReservationButton';

/* ═══════════════════ TYPES ═══════════════════ */
interface BookData {
  id: number;
  title: string;
  subtitle?: string;
  authors_list: string;
  category_name_fr: string;
  publisher_name: string;
  isbn: string;
  publication_date: string;
  pages: number;
  language: string;
  description_fr: string;
  cover_image?: string;
  status: string;
  copies_available: number;
  copies_total: number;
  is_available: boolean;
  average_rating: number;
  review_count: number;
  views_count: number;
  download_count: number;
  is_featured: boolean;
  is_new_arrival: boolean;
  allow_download: boolean;
  created_at: string;
}

interface BookCardProps {
  book: BookData;
  userEmail?: string;
  onReservationChange?: () => void;
  showDetails?: boolean;
}

/* ═══════════════════ ANIMATION VARIANTS ═══════════════════ */
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  hover: { y: -6, transition: { duration: 0.3, type: 'spring', stiffness: 300 } },
};

/* ═══════════════════ STATUS CONFIG ═══════════════════ */
const STATUS_CONFIG = {
  available: {
    bg: 'bg-emerald-50/90',
    border: 'border-emerald-200/60',
    text: 'text-emerald-700',
    label: { ar: 'متاح', fr: 'Disponible', en: 'Available' },
  },
  borrowed: {
    bg: 'bg-orange-50/90',
    border: 'border-orange-200/60',
    text: 'text-orange-700',
    label: { ar: 'مُعار', fr: 'Emprunte', en: 'Borrowed' },
  },
  reserved: {
    bg: 'bg-blue-50/90',
    border: 'border-blue-200/60',
    text: 'text-blue-700',
    label: { ar: 'محجوز', fr: 'Reserve', en: 'Reserved' },
  },
  maintenance: {
    bg: 'bg-gray-50/90',
    border: 'border-gray-200/60',
    text: 'text-gray-700',
    label: { ar: 'صيانة', fr: 'Maintenance', en: 'Maintenance' },
  },
  lost: {
    bg: 'bg-red-50/90',
    border: 'border-red-200/60',
    text: 'text-red-700',
    label: { ar: 'مفقود', fr: 'Perdu', en: 'Lost' },
  },
} as const;

const DEFAULT_STATUS = {
  bg: 'bg-gray-50/90',
  border: 'border-gray-200/60',
  text: 'text-gray-700',
  label: { ar: 'غير معروف', fr: 'Inconnu', en: 'Unknown' },
};

const formatPublicationDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
  });

/* ═══════════════════ SUB-COMPONENTS ═══════════════════ */
const StatusBadge = memo(({ status, lang }: { status: string; lang: string }) => {
  const config =
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || DEFAULT_STATUS;
  const label =
    lang === 'ar' ? config.label.ar : lang === 'en' ? config.label.en : config.label.fr;
  return (
    <Badge
      className={`${config.bg} ${config.border} ${config.text} backdrop-blur-sm border font-semibold text-[10px]`}
    >
      {label}
    </Badge>
  );
});
StatusBadge.displayName = 'StatusBadge';

const FeatureBadges = memo(
  ({
    isFeatured,
    isNewArrival,
    lang,
  }: {
    isFeatured: boolean;
    isNewArrival: boolean;
    lang: string;
  }) => {
    if (!isFeatured && !isNewArrival) return null;
    const t = (ar: string, fr: string, en: string) =>
      lang === 'ar' ? ar : lang === 'en' ? en : fr;
    return (
      <div className="absolute top-3 left-3 flex gap-1.5">
        {isFeatured && (
          <Badge className="bg-[#e8c97a]/90 backdrop-blur-sm text-[#133059] font-bold text-[10px] border-0">
            {t('مميز', 'Vedette', 'Featured')}
          </Badge>
        )}
        {isNewArrival && (
          <Badge className="bg-[#133059]/90 backdrop-blur-sm text-white font-bold text-[10px] border-0">
            {t('جديد', 'Nouveau', 'New')}
          </Badge>
        )}
      </div>
    );
  },
);
FeatureBadges.displayName = 'FeatureBadges';

const BookStats = memo(
  ({
    rating,
    reviewCount,
    viewsCount,
    copiesAvailable,
    copiesTotal,
  }: {
    rating: number;
    reviewCount: number;
    viewsCount: number;
    copiesAvailable: number;
    copiesTotal: number;
  }) => (
    <div className="flex items-center justify-between py-3 border-y border-slate-100/80 mb-3 text-[11px]">
      <div className="flex items-center gap-3">
        {rating > 0 && (
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-[#e8c97a] text-[#e8c97a]" />
            <span className="font-semibold text-slate-600">
              {rating.toFixed(1)}
            </span>
            <span className="text-slate-300">({reviewCount})</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-slate-400">
          <Eye className="h-3.5 w-3.5" />
          <span>{viewsCount}</span>
        </div>
      </div>
      <div className="text-slate-500 font-semibold">
        {copiesAvailable}/{copiesTotal}
      </div>
    </div>
  ),
);
BookStats.displayName = 'BookStats';

const BookDetails = memo(
  ({
    pages,
    language,
    publisher,
    isbn,
    lang,
  }: {
    pages: number;
    language: string;
    publisher: string;
    isbn: string;
    lang: string;
  }) => {
    const t = (ar: string, fr: string, en: string) =>
      lang === 'ar' ? ar : lang === 'en' ? en : fr;
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{ duration: 0.3 }}
        className="space-y-2 mb-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-100/80 text-[11px]"
      >
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-slate-400 text-[10px]">
              {t('الصفحات', 'Pages', 'Pages')}:
            </span>
            <span className="ml-2 font-semibold text-slate-600">{pages}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px]">
              {t('اللغة', 'Langue', 'Language')}:
            </span>
            <span className="ml-2 font-semibold text-slate-600">
              {language.toUpperCase()}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-slate-400 text-[10px]">
              {t('الناشر', 'Editeur', 'Publisher')}:
            </span>
            <span className="ml-2 font-semibold text-slate-600">
              {publisher}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-slate-400 text-[10px]">ISBN:</span>
            <span className="ml-2 font-mono text-slate-600 text-[10px]">
              {isbn}
            </span>
          </div>
        </div>
      </motion.div>
    );
  },
);
BookDetails.displayName = 'BookDetails';

const ActionButton = memo(
  ({
    icon: Icon,
    label,
    variant = 'default',
    onClick,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    variant?: 'default' | 'accent';
    onClick?: () => void;
  }) => (
    <motion.div
      className="flex-1"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        className={`w-full text-xs font-semibold rounded-xl ${
          variant === 'accent'
            ? 'text-[#e8c97a] border-[#e8c97a]/30 hover:bg-[#e8c97a]/5'
            : 'text-slate-500 border-slate-200/80 hover:border-[#e8c97a] hover:text-[#133059]'
        }`}
      >
        <Icon className="h-3.5 w-3.5 mr-1" />
        {label}
      </Button>
    </motion.div>
  ),
);
ActionButton.displayName = 'ActionButton';

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
const BookCard = memo(
  ({ book, userEmail, onReservationChange, showDetails = false }: BookCardProps) => {
    const { language: lang } = useLanguage();

    const t = useCallback(
      (ar: string, fr: string, en: string) =>
        lang === 'ar' ? ar : lang === 'en' ? en : fr,
      [lang],
    );

    const formattedDate = useMemo(
      () => formatPublicationDate(book.publication_date),
      [book.publication_date],
    );

    const handleImageError = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.style.display = 'none';
      },
      [],
    );

    const showDownload = book.allow_download && book.is_available;

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        whileHover="hover"
        viewport={{ once: true }}
        className="h-full"
      >
        <div className="group relative h-full">
          {/* Soft glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#133059]/[0.03] to-[#e8c97a]/[0.03] rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <Card className="relative h-full flex flex-col bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500">
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#e8c97a]/60 via-[#133059]/20 to-transparent z-10" />

            {/* Cover */}
            {book.cover_image && (
              <div className="relative h-56 overflow-hidden bg-slate-50">
                <motion.img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform ease-out" style={{ transitionDuration: '1500ms' }}
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={book.status} lang={lang} />
                </div>
                <FeatureBadges
                  isFeatured={book.is_featured}
                  isNewArrival={book.is_new_arrival}
                  lang={lang}
                />
              </div>
            )}

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
              <div className="mb-2">
                <h3 className="font-bold text-[#133059] text-base line-clamp-2 leading-tight mb-1 tracking-tight">
                  {book.title}
                </h3>
                {book.subtitle && (
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {book.subtitle}
                  </p>
                )}
              </div>

              {/* Author & Category */}
              <div className="space-y-1 mb-3 pb-3 border-b border-slate-100/80">
                <div className="text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-500">
                    {t('المؤلف:', 'Par:', 'By:')}
                  </span>{' '}
                  {book.authors_list}
                </div>
                <div className="text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-500">
                    {t('الفئة:', 'Categorie:', 'Category:')}
                  </span>{' '}
                  {book.category_name_fr}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed flex-grow">
                {book.description_fr}
              </p>

              {/* Details */}
              {showDetails && (
                <BookDetails
                  pages={book.pages}
                  language={book.language}
                  publisher={book.publisher_name}
                  isbn={book.isbn}
                  lang={lang}
                />
              )}

              {/* Stats */}
              <BookStats
                rating={book.average_rating}
                reviewCount={book.review_count}
                viewsCount={book.views_count}
                copiesAvailable={book.copies_available}
                copiesTotal={book.copies_total}
              />

              {/* Actions */}
              <div className="space-y-2">
                <BookReservationButton
                  book={book}
                  userEmail={userEmail}
                  onReservationChange={onReservationChange}
                />

                <div className="flex gap-2">
                  <ActionButton
                    icon={Eye}
                    label={t('التفاصيل', 'Details', 'Details')}
                  />
                  {showDownload && (
                    <ActionButton icon={Download} label="PDF" variant="accent" />
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="text-[10px] text-slate-300 mt-3 pt-3 border-t border-slate-100/60 text-center">
                {t('نُشر', 'Publie', 'Published')} {formattedDate}
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    );
  },
);

BookCard.displayName = 'BookCard';

export default BookCard;
