
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Star, Download, Eye, Loader2, Sparkles, ChevronDown, Info} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useReservations } from '@/context/ReservationContext';
import { useAuth } from '@/context/AuthContext';
import { LibraryAPI, Book, BookCategory, formatRating, isValidRating } from '@/services/api';
import ReservationDialog from '@/components/ReservationDialog';
import BookDetailModal from '@/components/BookDetailModal';

/* ═══════════════════ ANIMATION VARIANTS ═══════════════════ */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const expandVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: 'auto', opacity: 1 },
};

/* ═══════════════════ TRILINGUAL HELPER (used by sub-components) ═══════════════════ */
type T = (ar: string, fr: string, en: string) => string;
const makeT = (lang: string): T => (ar, fr, en) =>
  lang === 'ar' ? ar : lang === 'en' ? en : fr;

/* ═══════════════════ MEMOIZED STATE SCREENS ═══════════════════ */
const LoadingState = memo(({ language }: { language: string }) => {
  const t = makeT(language);
  return (
    <div className="min-h-screen pt-24 pb-16 bg-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#133059]/5"
        >
          <Loader2 className="h-7 w-7 text-[#133059]" />
        </motion.div>
        <p className="text-slate-400 font-medium">
          {t('جاري تحميل الكتب...', 'Chargement des livres...', 'Loading books...')}
        </p>
      </motion.div>
    </div>
  );
});
LoadingState.displayName = 'LoadingState';

const ErrorState = memo(({ language, error, onRetry }: { language: string; error: string; onRetry: () => void }) => {
  const t = makeT(language);
  return (
    <div className="min-h-screen pt-24 pb-16 bg-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto px-4"
      >
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#133059]/5">
          <BookOpen className="h-10 w-10 text-[#133059]/40" />
        </div>
        <h2 className="text-xl font-bold text-[#133059] mb-3">
          {t('خطأ في التحميل', 'Erreur de chargement', 'Loading Error')}
        </h2>
        <p className="text-slate-400 mb-8 text-sm">{error}</p>
        <Button
          onClick={onRetry}
          className="bg-[#133059] hover:bg-[#0a2342] text-white rounded-xl px-8"
        >
          {t('إعادة المحاولة', 'Reessayer', 'Retry')}
        </Button>
      </motion.div>
    </div>
  );
});
ErrorState.displayName = 'ErrorState';

const EmptyState = memo(({ language }: { language: string }) => {
  const t = makeT(language);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-24"
    >
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[#133059]/5 mb-8">
        <BookOpen className="h-12 w-12 text-[#133059]/30" />
      </div>
      <h3 className="text-2xl font-bold text-[#133059] mb-3 tracking-tight">
        {t('لم يتم العثور على كتب', 'Aucun livre trouve', 'No Books Found')}
      </h3>
      <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
        {t(
          'حاول تعديل معايير البحث أو استكشف فئات مختلفة',
          "Essayez d'ajuster vos criteres de recherche ou explorez differentes categories",
          'Try adjusting your search criteria or explore different categories',
        )}
      </p>
    </motion.div>
  );
});
EmptyState.displayName = 'EmptyState';

/* ═══════════════════ BOOK CARD (INLINE) ═══════════════════ */
interface BookCardProps {
  book: Book;
  language: string;
  isExpanded: boolean;
  isAuthenticated: boolean;
  onToggleExpand: () => void;
  onReserve: () => void;
  onView: () => void;
  onDownload: () => void;
  //onLogin: () => void;
}

const BookCard = memo(({
  book,
  language,
  isExpanded,
  isAuthenticated,
  onToggleExpand,
  onReserve,
  onView,
  onDownload,
  //onLogin,
}: BookCardProps) => {
  const t = makeT(language);
  const description =
    language === 'ar' && book.description_ar ? book.description_ar : book.description_fr;

  return (
    <motion.div variants={itemVariants} className="h-full">
      <div className="group relative h-full">
        {/* Soft glow on hover */}
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
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Status badge */}
              <div className="absolute top-3 right-3">
                <Badge
                  className={
                    book.is_available
                      ? 'bg-emerald-50/90 backdrop-blur-sm border border-emerald-200/60 text-emerald-700 font-semibold text-[10px]'
                      : 'bg-red-50/90 backdrop-blur-sm border border-red-200/60 text-red-700 font-semibold text-[10px]'
                  }
                >
                  {book.is_available
                    ? t('متاح', 'Disponible', 'Available')
                    : t('غير متاح', 'Non disponible', 'Unavailable')}
                </Badge>
              </div>

              {/* Feature badges */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                {book.is_featured && (
                  <Badge className="bg-[#e8c97a]/90 backdrop-blur-sm text-[#133059] font-bold text-[10px] border-0">
                    {t('مميز', 'Vedette', 'Featured')}
                  </Badge>
                )}
                {book.is_new_arrival && (
                  <Badge className="bg-[#133059]/90 backdrop-blur-sm text-white font-bold text-[10px] border-0">
                    {t('جديد', 'Nouveau', 'New')}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col flex-1 p-5">
            <h3 className="font-bold text-[#133059] text-base line-clamp-2 leading-tight mb-1.5 tracking-tight">
              {book.title}
            </h3>

            {/* Author & Category */}
            <div className="space-y-1 mb-3 pb-3 border-b border-slate-100">
              <p className="text-[11px] text-slate-400">
                <span className="font-semibold text-slate-500">
                  {t('المؤلف:', 'Par:', 'By:')}
                </span>{' '}
                {book.authors_list}
              </p>
              <p className="text-[11px] text-slate-400">
                <span className="font-semibold text-slate-500">
                  {t('الفئة:', 'Categorie:', 'Category:')}
                </span>{' '}
                {book.category_name_fr}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed flex-grow">
              {description}
            </p>

            {/* Toggle details */}
            <motion.button
              onClick={onToggleExpand}
              className="flex items-center gap-1.5 mb-3 text-[11px] font-semibold text-[#133059]/70 hover:text-[#e8c97a] transition-colors"
            >
              <Info className="h-3 w-3" />
              {isExpanded
                ? t('اقل', 'Moins de details', 'Less details')
                : t('المزيد', 'Plus de details', 'More details')}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="h-3 w-3" />
              </motion.div>
            </motion.button>

            {/* Expandable details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  variants={expandVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mb-3"
                >
                  <div className="space-y-2 p-3 bg-slate-50/80 rounded-2xl border border-slate-100/80 text-[11px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400 text-[10px]">
                          {t('الصفحات:', 'Pages:', 'Pages:')}
                        </span>
                        <div className="font-semibold text-slate-600">{book.pages}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px]">
                          {t('اللغة:', 'Langue:', 'Language:')}
                        </span>
                        <div className="font-semibold text-slate-600">
                          {book.language.toUpperCase()}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 text-[10px]">
                          {t('الناشر:', 'Editeur:', 'Publisher:')}
                        </span>
                        <div className="font-semibold text-slate-600">
                          {book.publisher_name}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 text-[10px]">ISBN:</span>
                        <div className="font-mono text-slate-600 text-[9px] break-all">
                          {book.isbn}
                        </div>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-slate-200/60">
                        <span className="text-slate-400 text-[10px]">
                          {t('النسخ:', 'Exemplaires:', 'Copies:')}
                        </span>
                        <div className="font-bold text-[#e8c97a]">
                          {book.copies_available}/{book.copies_total}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            <div className="flex items-center justify-between py-3 border-y border-slate-100/80 mb-3 text-[11px]">
              <div className="flex items-center gap-3">
                {isValidRating(book.average_rating) && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-[#e8c97a] text-[#e8c97a]" />
                    <span className="font-semibold text-slate-600">
                      {formatRating(book.average_rating)}
                    </span>
                    <span className="text-slate-300">({book.review_count})</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-slate-400">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{book.views_count}</span>
                </div>
              </div>
              <div className="text-slate-500 font-semibold">
                {book.copies_available}/{book.copies_total}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {isAuthenticated ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="sm"
                    onClick={onReserve}
                    disabled={!book.is_available}
                    className="w-full bg-[#133059] hover:bg-[#0a2342] text-white font-semibold text-xs rounded-xl"
                  >
                    <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                    {t('حجز', 'Reserver', 'Reserve')}
                  </Button>
                </motion.div>
              ) : (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="sm"
                    className="w-full bg-white border border-[#e8c97a]/40 text-[#133059] font-semibold text-xs hover:bg-[#133059] hover:border-[#133059] hover:text-white transition-all duration-300 rounded-xl"
                   // onClick={onLogin}
                  >
                    <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                    {t('دخول', 'Connexion', 'Sign In')}
                  </Button>
                </motion.div>
              )}

              <div className="flex gap-2">
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="sm"
                    onClick={onView}
                    className="w-full bg-white border border-slate-200 text-[#133059] font-semibold text-xs hover:border-[#e8c97a] hover:bg-[#e8c97a]/5 transition-all duration-300 rounded-xl"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5 text-[#e8c97a]" />
                    {t('عرض', 'Voir', 'View')}
                  </Button>
                </motion.div>

                {book.allow_download && book.is_available && (
                  <motion.div
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onDownload}
                      className="w-full text-xs font-semibold text-[#e8c97a] border-[#e8c97a]/30 hover:bg-[#e8c97a]/5 rounded-xl"
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      PDF
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="text-[10px] text-slate-300 mt-3 pt-3 border-t border-slate-100/60 text-center">
              {new Date(book.publication_date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
              })}
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
});
BookCard.displayName = 'BookCard';

/* ═══════════════════ DATA HOOK ═══════════════════ */
const useLibraryData = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [booksData, categoriesData] = await Promise.all([
          LibraryAPI.getBooks(),
          LibraryAPI.getBookCategories(),
        ]);

        setBooks(Array.isArray(booksData) ? booksData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur inconnue';
        setError(`Erreur lors du chargement des livres: ${errorMessage}`);
        setBooks([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { books, categories, loading, error };
};

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
const Bibliotheque = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { addReservation, isBookReserved } = useReservations();
  const { isAuthenticated } = useAuth();

  const t = useCallback(
    (ar: string, fr: string, en: string) =>
      language === 'ar' ? ar : language === 'en' ? en : fr,
    [language],
  );

  const { books, categories, loading, error } = useLibraryData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [expandedBookId, setExpandedBookId] = useState<number | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [reservationDialog, setReservationDialog] = useState<{
    isOpen: boolean;
    book: Book | null;
  }>({ isOpen: false, book: null });

  const isArabic = language === 'ar';
  const isRtl = isArabic;

  const filteredBooks = useMemo(() => {
    if (!Array.isArray(books)) return [];
    let result = books;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(term) ||
          book.authors_list.toLowerCase().includes(term) ||
          book.description_fr.toLowerCase().includes(term) ||
          book.description_ar?.toLowerCase().includes(term),
      );
    }

    if (selectedCategory && Array.isArray(categories)) {
      const selectedCat = categories.find((cat) => cat.id === selectedCategory);
      if (selectedCat) {
        const selectedCatName = isArabic
          ? selectedCat.name_ar
          : selectedCat.name_fr;
        result = result.filter((book) => {
          const categoryName = isArabic
            ? book.category_name_ar
            : book.category_name_fr;
          return categoryName === selectedCatName;
        });
      }
    }

    return result;
  }, [searchTerm, selectedCategory, books, categories, isArabic]);

  /* ── callbacks ── */
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value),
    [],
  );

  const handleCategorySelect = useCallback(
    (categoryId: number | null) =>
      setSelectedCategory((prev) => (prev === categoryId ? null : categoryId)),
    [],
  );

  const handleRetry = useCallback(() => window.location.reload(), []);

  const handleDownloadBook = useCallback(
    (book: Book) => {
      if (!book.allow_download) {
        toast({
          title: t('غير متاح', 'Non disponible', 'Not Available'),
          description: t(
            'هذا الكتاب غير متاح للتحميل',
            "Ce livre n'est pas disponible au telechargement",
            'This book is not available for download',
          ),
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: t('تحميل الكتاب', 'Telechargement du livre', 'Downloading Book'),
        description: t(
          `جاري تحميل "${book.title}"`,
          `Telechargement de "${book.title}" en cours...`,
          `Downloading "${book.title}"...`,
        ),
      });
    },
    [t, toast],
  );

  const handleReserveBook = useCallback(
    (book: Book) => {
      if (!book.is_available) {
        toast({
          title: t('غير متاح', 'Non disponible', 'Not Available'),
          description: t(
            'هذا الكتاب غير متاح حالياً',
            "Ce livre n'est pas disponible actuellement",
            'This book is not currently available',
          ),
          variant: 'destructive',
        });
        return;
      }

      if (isBookReserved(book.id)) {
        toast({
          title: t('محجوز مسبقاً', 'Deja reserve', 'Already Reserved'),
          description: t(
            'لديك حجز نشط لهذا الكتاب',
            'Vous avez deja une reservation active pour ce livre',
            'You already have an active reservation for this book',
          ),
          variant: 'destructive',
        });
        return;
      }

      setReservationDialog({ isOpen: true, book });
    },
    [t, isBookReserved, toast],
  );

  const handleConfirmReservation = useCallback(
    async (userInfo: {
      name: string;
      email: string;
      phone?: string;
      notes?: string;
    }) => {
      if (!reservationDialog.book) return;

      const success = await addReservation(reservationDialog.book, userInfo);
      const bookTitle = reservationDialog.book.title;

      toast({
        title: success
          ? t('تم الحجز بنجاح', 'Reservation reussie', 'Reservation Successful')
          : t('فشل في الحجز', 'Echec de la reservation', 'Reservation Failed'),
        description: success
          ? t(
              `تم حجز "${bookTitle}" بنجاح.`,
              `"${bookTitle}" a ete reserve avec succes.`,
              `"${bookTitle}" has been reserved successfully.`,
            )
          : t(
              'حدث خطأ أثناء حجز الكتاب.',
              "Une erreur s'est produite lors de la reservation.",
              'An error occurred while reserving the book.',
            ),
        variant: success ? undefined : 'destructive',
      });
    },
    [reservationDialog.book, addReservation, t, toast],
  );

  const handleCloseReservationDialog = useCallback(
    () => setReservationDialog({ isOpen: false, book: null }),
    [],
  );

  const handleViewBook = useCallback((bookId: number) => {
    setSelectedBookId(bookId);
    setIsDetailModalOpen(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedBookId(null);
  }, []);


  const toggleExpandBook = useCallback(
    (bookId: number) =>
      setExpandedBookId((prev) => (prev === bookId ? null : bookId)),
    [],
  );

  /* ── render states ── */
  if (loading) return <LoadingState language={language} />;
  if (error) return <ErrorState language={language} error={error} onRetry={handleRetry} />;

  return (
    <div
      className="min-h-screen bg-white overflow-x-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(19,48,89,0.04)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(232,201,122,0.05)_0%,transparent_50%)]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#133059]/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-10 pt-28 pb-16">
        {/* ═══ HEADER ═══ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/80 border border-[#e8c97a]/20 shadow-lg shadow-[#e8c97a]/5 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e8c97a]" />
            <span className="text-[#133059] text-[11px] font-bold uppercase tracking-[0.2em]">
              {t('مجموعة المكتبة', 'Notre Collection', 'Our Collection')}
            </span>
          </motion.div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#133059] mb-6 tracking-tight leading-tight"
            style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
          >
            {t(
              'استكشف عالم الكتب',
              'Explorez Notre Bibliotheque',
              'Explore Our Library',
            )}
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#e8c97a]/60" />
            <div className="w-2 h-2 rounded-full bg-[#e8c97a] shadow-sm shadow-[#e8c97a]/40" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#e8c97a]/60" />
          </motion.div>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t(
              'استكشف مجموعتنا الواسعة من الكتب والموارد لتعزيز تجربة التعلم الخاصة بك',
              "Decouvrez notre vaste collection de livres et de ressources pour enrichir votre parcours d'apprentissage",
              'Discover our vast collection of books and resources to enrich your learning journey',
            )}
          </p>
        </motion.div>

        {/* ═══ SEARCH & FILTER ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                className={`absolute top-1/2 -translate-y-1/2 text-slate-300 h-5 w-5 ${isRtl ? 'right-4' : 'left-4'}`}
              />
              <Input
                placeholder={t(
                  'ابحث في الكتب...',
                  'Rechercher des livres...',
                  'Search books...',
                )}
                className={`h-12 bg-white border-slate-200/80 focus:border-[#e8c97a] focus:ring-[#e8c97a]/20 rounded-xl ${isRtl ? 'pr-12 text-right' : 'pl-12'} text-[#133059] placeholder:text-slate-300`}
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="lg:max-w-xs">
              <select
                className={`w-full h-12 rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-[#133059] font-medium focus:border-[#e8c97a] focus:ring-[#e8c97a]/20 transition-colors ${isRtl ? 'text-right' : ''}`}
                onChange={(e) =>
                  handleCategorySelect(
                    e.target.value === '' ? null : parseInt(e.target.value),
                  )
                }
                value={selectedCategory ?? ''}
              >
                <option value="">
                  {t('جميع الفئات', 'Toutes les categories', 'All Categories')}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {isArabic ? category.name_ar : category.name_fr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category pills */}
          <div className={`flex flex-wrap gap-2 ${isRtl ? 'justify-end' : ''}`}>
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.04 }}
              >
                <Badge
                  variant={
                    selectedCategory === category.id ? 'default' : 'outline'
                  }
                  className={`cursor-pointer transition-all duration-300 font-medium rounded-lg ${
                    selectedCategory === category.id
                      ? 'bg-[#133059] hover:bg-[#0a2342] text-white border-[#133059]'
                      : 'bg-white border-slate-200/80 text-slate-500 hover:border-[#e8c97a] hover:text-[#133059]'
                  }`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  {isArabic ? category.name_ar : category.name_fr}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══ BOOKS GRID ═══ */}
        {filteredBooks.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                language={language}
                isExpanded={expandedBookId === book.id}
                isAuthenticated={isAuthenticated}
                onToggleExpand={() => toggleExpandBook(book.id)}
                onReserve={() => handleReserveBook(book)}
                onView={() => handleViewBook(book.id)}
                onDownload={() => handleDownloadBook(book)}
               // onLogin={handleLogin}
              />
            ))}
          </motion.div>
        ) : (
          <EmptyState language={language} />
        )}
      </div>

      {/* Dialogs */}
      <ReservationDialog
        isOpen={reservationDialog.isOpen}
        onClose={handleCloseReservationDialog}
        onConfirm={handleConfirmReservation}
        book={reservationDialog.book}
      />

      <BookDetailModal
        bookId={selectedBookId}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>
    </div>
  );
};

export default Bibliotheque;
