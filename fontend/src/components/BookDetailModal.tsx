import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Star,
  Download,
  Eye,
 
  Loader2,
  X,
} from 'lucide-react';
import { Book, LibraryAPI } from '@/services/api';

interface BookDetailModalProps {
  bookId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({
  bookId,
  isOpen,
  onClose,
}) => {
  const { language: lang } = useLanguage();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = useCallback(
    (ar: string, fr: string, en: string) =>
      lang === 'ar' ? ar : lang === 'en' ? en : fr,
    [lang],
  );

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!bookId || !isOpen) return;

      setLoading(true);
      setError(null);

      try {
        const data = await LibraryAPI.getBookById(bookId);
        setBook(data);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError(
          t(
            'فشل في تحميل تفاصيل الكتاب',
            'Erreur lors du chargement des details du livre',
            'Failed to load book details',
          ),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId, isOpen, t]);

  const handleDownload = () => {
    if (book?.pdf_file) {
      window.open(book.pdf_file!, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const locale = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'fr-FR';
      return new Date(dateString).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatRating = (rating: number | string | null | undefined) => {
    if (!rating) return '0.0';
    const num = typeof rating === 'string' ? parseFloat(rating) : rating;
    return num.toFixed(1);
  };

  const isValidRating = (rating: number | string | null | undefined) => {
    if (!rating) return false;
    const num = typeof rating === 'string' ? parseFloat(rating) : rating;
    return !isNaN(num) && num > 0;
  };

  if (!bookId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-2xl">
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-slate-100/80">
          <DialogTitle className="text-xl font-bold text-[#133059] pr-8 tracking-tight">
            {t('تفاصيل الكتاب', 'Details du livre', 'Book Details')}
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 opacity-70 hover:opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-[#e8c97a]/30"
          >
            <X className="h-4 w-4 text-slate-500" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#133059]/5 mb-4">
                <Loader2 className="h-6 w-6 animate-spin text-[#133059]" />
              </div>
              <p className="text-slate-400 text-sm">
                {t('جاري التحميل...', 'Chargement...', 'Loading...')}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 mb-4">
              <BookOpen className="h-6 w-6 text-red-400" />
            </div>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {book && !loading && (
          <div className="flex-1 overflow-y-auto pr-1 -mr-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {/* Cover Image */}
              <div className="md:col-span-1">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 bg-slate-50">
                  {book.cover_image ? (
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-slate-200" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {book.is_available ? (
                      <Badge className="bg-emerald-50/90 backdrop-blur-sm border border-emerald-200/60 text-emerald-700 font-semibold text-[10px]">
                        {t('متاح', 'Disponible', 'Available')}
                      </Badge>
                    ) : (
                      <Badge className="bg-red-50/90 backdrop-blur-sm border border-red-200/60 text-red-700 font-semibold text-[10px]">
                        {t('غير متاح', 'Non disponible', 'Unavailable')}
                      </Badge>
                    )}
                  </div>

                  {/* Feature Badges */}
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

                {/* Download Button */}
                {book.pdf_file && book.is_available && (
                  <Button
                    onClick={handleDownload}
                    className="w-full mt-4 bg-[#e8c97a] hover:bg-[#d4b06a] text-[#133059] font-semibold rounded-xl shadow-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('تحميل PDF', 'Telecharger PDF', 'Download PDF')}
                  </Button>
                )}
              </div>

              {/* Book Title */}
              <div className="md:col-span-2">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-[#133059] tracking-tight">
                    {book.title}
                  </h2>
                  {book.subtitle && (
                    <p className="text-slate-400 mt-1 text-sm">
                      {book.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Improved Information Section */}
            <div className="mt-6 pt-6 border-t border-slate-100/80">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-xl bg-slate-50 p-1">
                  <TabsTrigger
                    value="info"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm"
                  >
                    {t('معلومات', 'Informations', 'Information')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="description"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm"
                  >
                    {t('الوصف', 'Description', 'Description')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="mt-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50/80 rounded-xl p-4">
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                        {t('المؤلف', 'Auteur', 'Author')}
                      </div>
                      <div className="text-sm font-semibold text-[#133059]">
                        {book.authors_list}
                      </div>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-4">
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                        {t('الفئة', 'Categorie', 'Category')}
                      </div>
                      <div className="text-sm font-semibold text-[#133059]">
                        {lang === 'ar' ? book.category_name_ar : book.category_name_fr}
                      </div>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-4">
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                        {t('الناشر', 'Editeur', 'Publisher')}
                      </div>
                      <div className="text-sm font-semibold text-[#133059]">
                        {book.publisher_name}
                      </div>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-4">
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                        {t('تاريخ النشر', 'Date de publication', 'Publication Date')}
                      </div>
                      <div className="text-sm font-semibold text-[#133059]">
                        {formatDate(book.publication_date)}
                      </div>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-4">
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                        ISBN
                      </div>
                      <div className="text-sm font-mono text-[#133059]">
                        {book.isbn}
                      </div>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-4">
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                        {t('اللغة', 'Langue', 'Language')}
                      </div>
                      <div className="text-sm font-semibold text-[#133059]">
                        {book.language.toUpperCase()}
                      </div>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-4">
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                        {t('صفحات', 'Pages', 'Pages')}
                      </div>
                      <div className="text-sm font-semibold text-[#133059]">
                        {book.pages}
                      </div>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-4">
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                        {t('التوفر', 'Disponibilite', 'Availability')}
                      </div>
                      <div className={`text-sm font-semibold ${book.is_available ? 'text-emerald-600' : 'text-red-600'}`}>
                        {book.is_available 
                          ? t('متاح', 'Disponible', 'Available')
                          : t('غير متاح', 'Non disponible', 'Unavailable')}
                        {book.is_available && (
                          <span className="text-slate-400 font-normal">
                            {' '}({book.copies_available}/{book.copies_total} {t('نسخ', 'exemplaires', 'copies')})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ratings & Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100/80">
                    <div className="text-center p-3 bg-slate-50/60 rounded-xl">
                      <div className="flex items-center justify-center gap-1">
                        {isValidRating(book.average_rating) && (
                          <>
                            <Star className="h-4 w-4 fill-[#e8c97a] text-[#e8c97a]" />
                            <span className="text-xl font-bold text-[#133059]">
                              {formatRating(book.average_rating)}
                            </span>
                          </>
                        )}
                        {!isValidRating(book.average_rating) && (
                          <span className="text-xl font-bold text-slate-300">-</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">
                        {t('تقييم', 'Note', 'Rating')}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-slate-50/60 rounded-xl">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="h-4 w-4 text-slate-300" />
                        <span className="text-xl font-bold text-[#133059]">
                          {book.views_count}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">
                        {t('مشاهدات', 'Vues', 'Views')}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-slate-50/60 rounded-xl">
                      <div className="flex items-center justify-center gap-1">
                        <Download className="h-4 w-4 text-slate-300" />
                        <span className="text-xl font-bold text-[#133059]">
                          {book.download_count}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">
                        {t('تحميلات', 'Telechargements', 'Downloads')}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="description" className="mt-5">
                  <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-100/80">
                    <h3 className="text-lg font-semibold text-[#133059] mb-4 tracking-tight">
                      {t('حول هذا الكتاب', 'A propos de ce livre', 'About this Book')}
                    </h3>
                    <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                      {lang === 'ar' && book.description_ar
                        ? book.description_ar
                        : book.description_fr}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailModal;
