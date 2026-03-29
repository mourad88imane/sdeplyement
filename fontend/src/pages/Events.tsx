import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, AlertCircle, Calendar, Star, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimpleNews {
  id: number;
  title?: string;
  title_fr?: string;
  title_ar?: string;
  title_en?: string;
  slug: string;
  description?: string;
  description_fr?: string;
  description_ar?: string;
  description_en?: string;
  summary_fr?: string;
  summary_ar?: string;
  summary_en?: string;
  featured: boolean;
  published_at?: string;
  start_date?: string;
  end_date?: string;
  featured_image?: string;
  image_url?: string;
  image?: string;
  image_alt_fr?: string;
  image_alt_ar?: string;
  image_alt_en?: string;
  location?: string;
}

const Events = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [news, setNews] = useState<SimpleNews[]>([]);
    const [filteredNews, setFilteredNews] = useState<SimpleNews[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const getLocalizedText = (fr?: string, ar?: string, en?: string) => {
        if (language === 'ar') return ar || fr || '';
        if (language === 'en') return en || fr || '';
        return fr || '';
    };

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
                const response = await fetch(`${API_BASE_URL}/events/conferences/`);

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const data = await response.json();
                let newsData = [];
                if (Array.isArray(data)) {
                    newsData = data;
                } else if (data && Array.isArray(data.results)) {
                    newsData = data.results;
                } else if (data && Array.isArray(data.conferences)) {
                    newsData = data.conferences;
                } else {
                    newsData = [];
                }

                setNews(newsData);
                setFilteredNews(newsData);

            } catch (err) {
                console.error('Erreur lors du chargement:', err);
                setError(getLocalizedText(
                    'Échec du chargement des événements',
                    'فشل في تحميل الأحداث',
                    'Failed to load events'
                ));
                toast({
                    title: language === 'ar' ? 'خطأ' : language === 'en' ? 'Error' : 'Erreur',
                    description: getLocalizedText(
                        'Échec du chargement des événements depuis le serveur',
                        'فشل في تحميل الأحداث من الخادم',
                        'Failed to load events from server'
                    ),
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [language, toast]);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredNews(news);
            return;
        }

        const filtered = news.filter(article => {
            const title = language === 'ar' ? article.title_ar : language === 'en' ? (article.title_en || article.title_fr) : article.title_fr;
            const summary = language === 'ar' ? article.summary_ar : language === 'en' ? (article.summary_en || article.summary_fr) : article.summary_fr;

            return (title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   summary?.toLowerCase().includes(searchQuery.toLowerCase()));
        });

        setFilteredNews(filtered);
    }, [news, searchQuery, language]);

    const handleNewsClick = (article: SimpleNews) => {
        navigate(`/news/${article.slug}`);
    };

    if (loading) {
        return (
            <div className="relative w-full overflow-hidden bg-white min-h-screen pt-24 pb-16 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue" />
                    <p className="text-slate-600">
                        {getLocalizedText('Chargement des événements...', 'جاري تحميل الأحداث...', 'Loading events...')}
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative w-full overflow-hidden bg-white min-h-screen pt-24 pb-16 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2 text-blue">
                        {getLocalizedText('Erreur de chargement', 'خطأ في التحميل', 'Load Error')}
                    </h2>
                    <p className="text-slate-600 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()} className="bg-blue hover:bg-blue/90">
                        {getLocalizedText('Réessayer', 'إعادة المحاولة', 'Retry')}
                    </Button>
                </div>
            </div>
        );
    }

    const featuredNews = filteredNews.filter(article => article.featured);
    const regularNews = filteredNews.filter(article => !article.featured);

    return (
        <div className="relative w-full overflow-hidden bg-white">
            {/* BACKGROUND DECORATIONS */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-50"
                style={{
                  background: `
                    radial-gradient(circle at 15% 25%, rgba(19, 48, 89, 0.08) 0%, transparent 50%),
                    radial-gradient(circle at 85% 75%, rgba(232, 201, 122, 0.08) 0%, transparent 50%),
                    radial-gradient(circle at 50% 100%, rgba(19, 48, 89, 0.05) 0%, transparent 80%)
                  `,
                }}
            />

            {/* Decorative top line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue via-gold to-blue opacity-30" />

            <section className="relative z-10 pt-32 pb-16 min-h-screen max-w-[1400px] mx-auto px-6 md:px-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-blue leading-[1.15] mb-6">
                        {getLocalizedText('Événements et Actualités', 'الأحداث والأخبار', 'Events & News')}
                    </h1>
                    <div className="h-1 w-20 bg-gradient-to-r from-gold to-blue rounded-full mx-auto mb-6" />
                    <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
                        {getLocalizedText(
                            'Suivez les derniers événements et actualités de l\'École Nationale des Transmissions',
                            'تابع أحدث الأحداث والأخبار من المدرسة الوطنية للمواصلات السلكية واللاسلكية',
                            'Follow the latest events and news from the National School of transmissionss'
                        )}
                    </p>
                </motion.div>

                {/* Recherche */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-md border border-blue/10 mb-8"
                >
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600 w-4 h-4" />
                        <Input
                            placeholder={getLocalizedText(
                                'Rechercher des événements...',
                                'البحث في الأحداث...',
                                'Search events...'
                            )}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-blue/20 focus:ring-blue focus:border-gold"
                        />
                    </div>

                    {searchQuery && (
                        <div className="mt-4 text-sm text-slate-600 text-center">
                            {getLocalizedText(
                                `${filteredNews.length} résultat${filteredNews.length > 1 ? 's' : ''} trouvé${filteredNews.length > 1 ? 's' : ''}`,
                                `تم العثور على ${filteredNews.length} نتيجة`,
                                `${filteredNews.length} result${filteredNews.length > 1 ? 's' : ''} found`
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Featured Events */}
                {featuredNews.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-blue mb-2 flex items-center gap-3">
                            <Star className="w-6 h-6 text-gold" />
                            {getLocalizedText('Événements en avant', 'أحداث مميزة', 'Featured Events')}
                        </h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-gold to-blue rounded-full mb-8" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredNews.map((article) => (
                                <EventCard
                                    key={article.id}
                                    article={article}
                                    language={language}
                                    onClick={() => handleNewsClick(article)}
                                    featured={true}
                                    getLocalizedText={getLocalizedText}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* All Events */}
                {regularNews.length === 0 && featuredNews.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-serif font-bold text-blue mb-2">
                            {getLocalizedText('Aucun événement trouvé', 'لا توجد أحداث', 'No events found')}
                        </h3>
                        <p className="text-slate-600">
                            {getLocalizedText(
                                'Aucun événement ne correspond à vos critères de recherche',
                                'لا توجد أحداث تطابق معايير البحث',
                                'No events match your search criteria'
                            )}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {regularNews.length > 0 && (
                            <>
                                <h2 className="text-2xl md:text-3xl font-serif font-bold text-blue mb-8">
                                    {getLocalizedText('Tous les événements', 'جميع الأحداث', 'All Events')}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {regularNews.map((article) => (
                                        <EventCard
                                            key={article.id}
                                            article={article}
                                            language={language}
                                            onClick={() => handleNewsClick(article)}
                                            featured={false}
                                            getLocalizedText={getLocalizedText}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </section>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none opacity-30" />
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue/20 rounded-full blur-3xl pointer-events-none opacity-20" />
        </div>
    );
};

const EventCard = ({ article, language, onClick, featured, getLocalizedText }: any) => {
    // Helper to get the correct title field
    const getTitle = () => {
        if (language === 'ar') return article.title_ar || article.title;
        if (language === 'en') return article.title_en || article.title_fr || article.title;
        return article.title_fr || article.title;
    };

    // Helper to get the correct description/summary field
    const getDescription = () => {
        if (language === 'ar') return article.description_ar || article.summary_ar;
        if (language === 'en') return article.description_en || article.description || article.summary_en || article.summary_fr;
        return article.description || article.description_fr || article.summary_fr;
    };

    // Helper to get the correct image field — match EventDetail priority: featured_image first
    const getImage = () => {
        const img = article.featured_image || article.image_url || article.image;
        if (!img) return '';
        // If image is a relative path, prepend the API base URL (without /api)
        if (img.startsWith('/')) {
            const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');
            return baseUrl + img;
        }
        return img;
    };

    // Helper to get the correct date field
    const getDate = () => {
        return article.start_date || article.published_at;
    };

    return (
    <motion.div
        whileHover={{ y: -8 }}
        className="bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-md border border-blue/10 hover:border-gold/30 transition-all hover:shadow-lg cursor-pointer group"
        onClick={onClick}
    >
        <div className="relative h-48 overflow-hidden">
            <img
                src={getImage() || 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt={getLocalizedText(article.image_alt_fr, article.image_alt_ar, article.image_alt_en) || article.title || 'Event Image'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {featured && (
                <div className="absolute top-4 left-4">
                    <div className="bg-gold text-blue px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold shadow">
                        <Star className="w-3 h-3" />
                        {getLocalizedText('Mis en avant', 'مميز', 'Featured')}
                    </div>
                </div>
            )}
        </div>

        <div className="p-6">
            <h3 className="text-lg font-serif font-bold text-blue mb-3 group-hover:text-gold transition-colors">
                {getTitle()}
            </h3>
            <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                {getDescription()}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600 mb-4">
                <Calendar className="w-3 h-3" />
                <span>{getDate() ? new Date(getDate()).toLocaleDateString() : ''}</span>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue to-blue/80 hover:from-blue/90 hover:to-blue text-white text-xs font-semibold py-2 rounded-lg">
                {getLocalizedText('Lire plus', 'اقرأ المزيد', 'Read More')} <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
        </div>
    </motion.div>
);
};

export default Events;
