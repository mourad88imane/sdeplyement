import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Search, Filter, Loader2, AlertCircle, Calendar, Star, Sparkles } from 'lucide-react';
import { NewsArticle, NewsCategory, NewsAPI } from '@/services/api';
import NewsCard from '@/components/news/NewsCard';
import { useToast } from '@/hooks/use-toast';
import ReviewsPreview from './ReviewsPreview';

const Events = () => {
  const { language } = useLanguage();
  const { category } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // ✨ ANIMATIONS COHÉRENTES AVEC HEROSECTION
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Charger les actualités et catégories depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [newsData, categoriesData] = await Promise.all([
          NewsAPI.getNews(),
          NewsAPI.getNewsCategories()
        ]);
        setNews(newsData);
        setCategories(categoriesData);
        setFilteredNews(newsData);
      } catch (err) {
        setError(language === 'ar' 
          ? 'فشل في تحميل الأحداث'
          : 'Échec du chargement des événements'
        );
        toast({
          title: language === 'ar' ? 'خطأ' : 'Erreur',
          description: language === 'ar' 
            ? 'فشل في تحميل الأحداث من الخادم'
            : 'Échec du chargement des événements depuis le serveur',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language, toast]);

  // Mettre à jour la catégorie sélectionnée quand l'URL change
  useEffect(() => {
    setSelectedCategory(category || 'all');
  }, [category]);

  // Filtrer les actualités
  useEffect(() => {
    let filtered = news;

    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter(article => {
        const title = language === 'ar' ? article.title_ar : article.title_fr;
        const summary = language === 'ar' ? article.summary_ar : article.summary_fr;
        const categoryName = language === 'ar' ? article.category_name_ar : article.category_name_fr;
        
        return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
               categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      const categoryId = parseInt(selectedCategory);
      if (!isNaN(categoryId)) {
        filtered = filtered.filter(article => {
          const categoryName = language === 'ar' ? article.category_name_ar : article.category_name_fr;
          const selectedCat = categories.find(cat => cat.id === categoryId);
          const selectedCatName = selectedCat ? (language === 'ar' ? selectedCat.name_ar : selectedCat.name_fr) : '';
          return categoryName === selectedCatName;
        });
      }
    }

    // Filtrer par priorité
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(article => article.priority === selectedPriority);
    }

    setFilteredNews(filtered);
  }, [news, searchQuery, selectedCategory, selectedPriority, language, categories]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      navigate('/events');
    } else {
      navigate(`/events/${categoryId}`);
    }
  };

  const handleNewsClick = (article: NewsArticle) => {
    navigate(`/news/${article.slug}`);
  };

  // Séparer les actualités mises en avant
  const featuredNews = filteredNews.filter(article => article.featured);
  const regularNews = filteredNews.filter(article => !article.featured);

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#133059]" />
          <p className="text-slate-600">
            {language === 'ar' ? 'جاري تحميل الأحداث...' : 'Chargement des événements...'}
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#133059] mb-2">
            {language === 'ar' ? 'خطأ في التحميل' : 'Erreur de chargement'}
          </h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-[#133059] hover:bg-[#0a2342] text-white font-bold"
          >
            {language === 'ar' ? 'إعادة المحاولة' : 'Réessayer'}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className="relative bg-gradient-to-b from-white via-slate-50/30 to-white overflow-hidden">
      
      {/* ✨ BACKGROUND DECORATIONS - COHÉRENT AVEC HEROSECTION */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#133059]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#e8c97a]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl" />
      </div>

      <section className="relative z-10 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          
          {/* ✨ HEADER SECTION - IDENTIQUE À HEROSECTION */}
          <motion.div 
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Badge - IDENTIQUE À HEROSECTION */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#133059]/20 bg-[#133059]/5 backdrop-blur-sm hover:bg-[#133059]/10 transition-colors mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#e8c97a] animate-pulse" />
              <span className="text-[#133059] text-xs font-bold uppercase tracking-widest">
                {language === 'ar' ? '📰 آخر الأخبار' : language === 'en' ? '📰 Latest News' : '📰 Dernières Actualités'}
              </span>
            </motion.div>

            {/* Titre - IDENTIQUE À HEROSECTION */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#133059] mb-6"
            >
              {language === 'ar' 
                ? 'الأحداث والأخبار' 
                : language === 'en'
                ? 'Events and News'
                : 'Événements et Actualités'
              }
            </motion.h1>

            {/* Ligne décorée - IDENTIQUE À HEROSECTION */}
            <motion.div 
              variants={itemVariants}
              className="h-1 w-20 bg-gradient-to-r from-[#e8c97a] to-[#133059] rounded-full mx-auto mb-6"
            />

            {/* Sous-titre - IDENTIQUE À HEROSECTION */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            >
              {language === 'ar'
                ? 'تابع آخر الأخبار والفعاليات في المدرسة الوطنية للمواصلات السلكية واللاسلكية'
                : language === 'en'
                ? 'Stay updated with the latest news and events from the National School of transmissionss'
                : 'Suivez les dernières actualités et événements de l\'École Nationale des Transmissions'
              }
            </motion.p>
          </motion.div>

          {/* ✨ FILTRES ET RECHERCHE - COHÉRENT AVEC HEROSECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/60 backdrop-blur border border-slate-200 rounded-2xl p-8 shadow-lg mb-16"
          >
            <div className="space-y-4">
              {/* Search input */}
              <div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#e8c97a] w-5 h-5" />
                  <Input
                    placeholder={language === 'ar' 
                      ? 'البحث في الأحداث والأخبار...'
                      : 'Rechercher des événements et actualités...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-3 text-base border-2 border-slate-200 hover:border-[#e8c97a]/50 transition-colors rounded-xl focus:border-[#133059] focus:ring-0"
                  />
                </div>
              </div>
              
              {/* Filters row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category filter */}
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="border-2 border-slate-200 hover:border-[#e8c97a]/50 transition-colors rounded-xl py-3">
                    <Filter className="w-4 h-4 text-[#133059] mr-2" />
                    <span className="text-[#133059] font-semibold">{language === 'ar' ? 'الفئة' : 'Catégorie'}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {language === 'ar' ? 'جميع الفئات' : 'Toutes les catégories'}
                    </SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {language === 'ar' ? cat.name_ar : cat.name_fr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Priority filter */}
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="border-2 border-slate-200 hover:border-[#e8c97a]/50 transition-colors rounded-xl py-3">
                    <Star className="w-4 h-4 text-[#133059] mr-2" />
                    <span className="text-[#133059] font-semibold">{language === 'ar' ? 'الأولوية' : 'Priorité'}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {language === 'ar' ? 'جميع الأولويات' : 'Toutes les priorités'}
                    </SelectItem>
                    <SelectItem value="urgent">
                      {language === 'ar' ? '🔴 عاجل' : '🔴 Urgent'}
                    </SelectItem>
                    <SelectItem value="high">
                      {language === 'ar' ? '🟠 عالي' : '🟠 Élevé'}
                    </SelectItem>
                    <SelectItem value="normal">
                      {language === 'ar' ? '🟡 عادي' : '🟡 Normal'}
                    </SelectItem>
                    <SelectItem value="low">
                      {language === 'ar' ? '🟢 منخفض' : '🟢 Faible'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Results count */}
            {searchQuery && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-sm text-slate-600 font-semibold"
              >
                {language === 'ar' 
                  ? `تم العثور على ${filteredNews.length} نتيجة`
                  : `${filteredNews.length} résultat${filteredNews.length > 1 ? 's' : ''} trouvé${filteredNews.length > 1 ? 's' : ''}`
                }
              </motion.div>
            )}
          </motion.div>

          {/* ✨ FEATURED NEWS - COHÉRENT AVEC HEROSECTION */}
          {featuredNews.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-7 h-7 text-[#e8c97a]" />
                  <h2 className="text-3xl font-bold text-[#133059]">
                    {language === 'ar' ? 'أخبار مميزة' : 'Actualités mises en avant'}
                  </h2>
                </div>
                <div className="h-1 w-16 bg-gradient-to-r from-[#e8c97a] to-transparent rounded-full" />
              </div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {featuredNews.map((article) => (
                  <motion.div
                    key={article.id}
                    variants={itemVariants}
                    onClick={() => handleNewsClick(article)}
                    className="cursor-pointer"
                  >
                    <NewsCard
                      article={article}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ✨ ALL NEWS - COHÉRENT AVEC HEROSECTION */}
          {regularNews.length === 0 && featuredNews.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#133059] mb-2">
                {language === 'ar' ? 'لا توجد أحداث' : 'Aucun événement trouvé'}
              </h3>
              <p className="text-slate-600 max-w-xl mx-auto">
                {language === 'ar' 
                  ? 'لا توجد أحداث تطابق معايير البحث'
                  : 'Aucun événement ne correspond à vos critères de recherche'
                }
              </p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {regularNews.length > 0 && (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[#133059] mb-2">
                      {language === 'ar' ? 'جميع الأخبار' : 'Toutes les actualités'}
                    </h2>
                    <div className="h-1 w-16 bg-gradient-to-r from-[#e8c97a] to-transparent rounded-full" />
                  </div>
                  
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    {regularNews.map((article) => (
                      <motion.div
                        key={article.id}
                        variants={itemVariants}
                        onClick={() => handleNewsClick(article)}
                        className="cursor-pointer"
                      >
                        <NewsCard
                          article={article}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </>
              )}
            </motion.div>
          )}

          {/* Reviews preview */}
          <ReviewsPreview />
        </div>
      </section>
    </div>
  );
};

export default Events;
