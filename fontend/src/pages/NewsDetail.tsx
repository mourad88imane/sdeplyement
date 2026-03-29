import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Clock,
  Star,
  Share2,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Interface pour l'actualité détaillée
interface NewsDetail {
  id: number;
  title_fr: string;
  title_ar: string;
  slug: string;
  summary_fr: string;
  summary_ar: string;
  content_fr: string;
  content_ar: string;
  category_name_fr: string;
  category_name_ar: string;
  category_color: string;
  priority: string;
  priority_display_fr: string;
  priority_display_ar: string;
  featured_image: string;
  image_alt_fr: string;
  image_alt_ar: string;
  featured: boolean;
  views_count: number;
  comment_count: number;
  reading_time: number;
  published_at: string;
  event_date?: string;
  author_name: string;
  created_at: string;
}

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();

  const [article, setArticle] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/news/${slug}/`);

        if (!response.ok) {
          if (response.status === 404) {
            setError(language === 'ar' ? 'المقال غير موجود' : 'Article non trouvé');
          } else {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
          return;
        }

        const data = await response.json();
        setArticle(data);

      } catch (err) {
        console.error('Erreur lors du chargement de l\'article:', err);
        setError(language === 'ar'
          ? 'فشل في تحميل المقال'
          : 'Échec du chargement de l\'article'
        );
        toast({
          title: language === 'ar' ? 'خطأ' : 'Erreur',
          description: language === 'ar'
            ? 'فشل في تحميل المقال من الخادم'
            : 'Échec du chargement de l\'article depuis le serveur',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, language, toast]);

  const handleBack = () => {
    navigate('/events');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article ? (language === 'ar' ? article.title_ar : article.title_fr) : '',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: language === 'ar' ? 'تم النسخ' : 'Copié',
        description: language === 'ar' ? 'تم نسخ الرابط' : 'Lien copié dans le presse-papiers',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatEventDate = (dateString?: string) => {
    if (!dateString) return null;
    const eventDate = new Date(dateString);
    const now = new Date();

    if (eventDate > now) {
      return {
        text: new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(eventDate),
        isUpcoming: true
      };
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gradient-to-br from-white via-[#133059]/2 to-[#e8c97a]/5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-4 inline-block"
          >
            <Loader2 className="h-8 w-8 text-[#133059]" />
          </motion.div>
          <p className="text-[#133059]/70 font-medium">
            {language === 'ar' ? 'جاري تحميل المقال...' : 'Chargement de l\'article...'}
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gradient-to-br from-white via-[#133059]/2 to-[#e8c97a]/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-bold text-[#133059] mb-2">
            {language === 'ar' ? 'خطأ في التحميل' : 'Erreur de chargement'}
          </h2>
          <p className="text-[#133059]/60 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={handleBack} 
                variant="outline"
                className="bg-white border border-[#e8c97a] text-[#133059] font-semibold hover:bg-[#133059] hover:border-[#133059] hover:text-[#e8c97a] transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'العودة' : 'Retour'}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-[#133059] hover:bg-[#0a2342] text-white font-semibold"
              >
                {language === 'ar' ? 'إعادة المحاولة' : 'Réessayer'}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  const title = language === 'ar' ? article.title_ar : article.title_fr;
  const summary = language === 'ar' ? article.summary_ar : article.summary_fr;
  const content = language === 'ar' ? article.content_ar : article.content_fr;
  const imageAlt = language === 'ar' ? article.image_alt_ar : article.image_alt_fr;
  const eventInfo = formatEventDate(article.event_date);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-white via-[#133059]/2 to-[#e8c97a]/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 bg-[#e8c97a]/20 rounded-full blur-3xl pointer-events-none"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#133059]/15 rounded-full blur-3xl pointer-events-none"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleBack}
                className="bg-white border border-[#e8c97a] text-[#133059] font-semibold hover:bg-[#133059] hover:border-[#133059] hover:text-[#e8c97a] transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                {language === 'ar' ? <ChevronRight className="w-4 h-4 mr-2" /> : <ChevronLeft className="w-4 h-4 mr-2" />}
                {language === 'ar' ? 'العودة إلى الأحداث' : 'Retour aux événements'}
              </Button>
            </motion.div>
          </motion.div>

          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            {/* Badges */}
            {article.featured && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`flex flex-wrap gap-2 mb-6 ${language === 'ar' ? 'justify-end' : ''}`}
              >
                <Badge className="bg-[#e8c97a] text-[#133059] font-semibold text-xs">
                  <Star className="w-3 h-3 mr-1.5 fill-current" />
                  {language === 'ar' ? 'مميز' : 'Mis en avant'}
                </Badge>
              </motion.div>
            )}

            {/* Title */}
            <h1 className={`text-4xl sm:text-5xl font-bold text-[#133059] leading-tight mb-6 ${language === 'ar' ? 'text-right' : ''}`}>
              {title}
            </h1>

            <div className={`h-1 w-20 bg-gradient-to-r from-[#e8c97a] to-[#133059] rounded-full mb-6 ${language === 'ar' ? 'ml-auto mr-0' : ''}`} />

            {/* Summary */}
            <p className={`text-lg text-[#133059]/70 mb-8 leading-relaxed font-medium ${language === 'ar' ? 'text-right' : ''}`}>
              {summary}
            </p>

            {/* Meta Info */}
            <div className={`flex flex-wrap gap-6 text-sm text-[#133059]/70 mb-8 font-semibold ${language === 'ar' ? 'justify-end' : ''}`}>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#e8c97a]" />
                <span>{formatDate(article.published_at)}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#e8c97a]" />
                <span>{article.author_name}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#e8c97a]" />
                <span>{article.reading_time} {language === 'ar' ? 'دقائق' : 'min'}</span>
              </div>

              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#e8c97a]" />
                <span>{article.views_count} {language === 'ar' ? 'مشاهدة' : 'vues'}</span>
              </div>
            </div>

            {/* Actions */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`inline-block ${language === 'ar' ? 'block ml-auto' : ''}`}
            >
              <Button 
                onClick={handleShare} 
                className="bg-[#133059] hover:bg-[#0a2342] text-white font-bold gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Share2 className="w-4 h-4" />
                {language === 'ar' ? 'مشاركة' : 'Partager'}
              </Button>
            </motion.div>
          </motion.div>

          {/* Event Date Alert */}
          {eventInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`mb-12 p-6 bg-[#e8c97a]/10 border-l-4 border-[#e8c97a] rounded-xl ${language === 'ar' ? 'border-r-4 border-l-0 text-right' : ''}`}
            >
              <div className={`flex items-center gap-3 text-[#133059] mb-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Calendar className="w-5 h-5 text-[#e8c97a] flex-shrink-0" />
                <span className="font-bold text-lg">
                  {language === 'ar' ? '📅 تاريخ الفعالية:' : '📅 Date de l\'événement:'}
                </span>
              </div>
              <p className="text-[#133059] font-bold text-xl ml-8">
                {eventInfo.text}
              </p>
            </motion.div>
          )}

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <motion.img
                src={article.featured_image || 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                alt={imageAlt || title}
                className="w-full h-64 md:h-96 object-cover"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
          >
            <div
              className={`text-[#133059]/80 leading-relaxed text-base font-medium space-y-6 ${language === 'ar' ? 'text-right' : ''}`}
              style={{ whiteSpace: 'pre-line' }}
            >
              {content}
            </div>
          </motion.div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className={`flex gap-4 pt-8 border-t border-slate-200 ${language === 'ar' ? 'justify-end' : ''}`}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleBack}
                variant="outline"
                className="bg-white border border-[#133059]/20 text-[#133059] font-semibold hover:border-[#e8c97a] hover:text-[#e8c97a] hover:bg-[#e8c97a]/10 transition-all duration-300"
              >
                {language === 'ar' ? '← العودة' : 'Retour →'}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleShare}
                className="bg-[#133059] hover:bg-[#0a2342] text-white font-semibold gap-2"
              >
                <Share2 className="w-4 h-4" />
                {language === 'ar' ? 'شارك المقال' : 'Partager cet article'}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
