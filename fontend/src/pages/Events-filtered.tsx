import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, AlertCircle, Calendar, Star, MapPin, Users, Filter, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EventsAPI, Event } from '@/services/api';

const EventsFiltered = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { eventType } = useParams<{ eventType?: string }>();

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>(eventType || 'all');

  const getLocalizedText = (fr?: string, ar?: string, en?: string) => {
    if (language === 'ar') return ar || fr || '';
    if (language === 'en') return en || fr || '';
    return fr || '';
  };

  // Types d'événements disponibles
  const eventTypes = [
    { key: 'all', label_fr: 'Tous les événements', label_ar: 'جميع الأحداث', label_en: 'All Events' },
    { key: 'conferences', label_fr: 'Conférences', label_ar: 'المؤتمرات', label_en: 'Conferences' },
    { key: 'workshops', label_fr: 'Ateliers', label_ar: 'ورش العمل', label_en: 'Workshops' },
    { key: 'competitions', label_fr: 'Compétitions', label_ar: 'المسابقات', label_en: 'Competitions' },
    { key: 'cultural', label_fr: 'Événements culturels', label_ar: 'الأحداث الثقافية', label_en: 'Cultural Events' },
    { key: 'sports', label_fr: 'Événements sportifs', label_ar: 'الأحداث الرياضية', label_en: 'Sports Events' },
    { key: 'graduation', label_fr: 'Remise des diplômes', label_ar: 'تخرج', label_en: 'Graduation' },
    { key: 'seminars', label_fr: 'Séminaires', label_ar: 'الندوات', label_en: 'Seminars' },
  ];

  // Charger les événements selon le type sélectionné
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data: Event[] = [];
        
        if (selectedType === 'all') {
          data = await EventsAPI.getEvents();
        } else {
          data = await EventsAPI.getEventsByType(selectedType);
        }
        
        setEvents(data);
        setFilteredEvents(data);

      } catch (err) {
        console.error('Error loading events:', err);
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

    fetchEvents();
  }, [selectedType, language, toast]);

  // Mettre à jour le type sélectionné quand l'URL change
  useEffect(() => {
    setSelectedType(eventType || 'all');
  }, [eventType]);

  // Filtrer les événements par recherche
  useEffect(() => {
    if (!searchQuery) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter(event => {
      const title = getLocalizedText(event.title_fr, event.title_ar, event.title_en);
      const description = getLocalizedText(event.description_fr, event.description_ar, event.description_en);

      return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             description.toLowerCase().includes(searchQuery.toLowerCase());
    });

    setFilteredEvents(filtered);
  }, [events, searchQuery, language]);

  const handleEventClick = (event: Event) => {
    navigate(`/events/detail/${event.slug}`);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    if (type === 'all') {
      navigate('/events');
    } else {
      navigate(`/events/${type}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getCurrentTypeLabel = () => {
    const currentType = eventTypes.find(type => type.key === selectedType);
    return currentType ? getLocalizedText(currentType.label_fr, currentType.label_ar, currentType.label_en) : '';
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
          <h2 className="text-xl font-serif font-bold text-blue mb-2">
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

  const featuredEvents = filteredEvents.filter(event => event.is_featured);
  const regularEvents = filteredEvents.filter(event => !event.is_featured);

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
            {getCurrentTypeLabel()}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-gold to-blue rounded-full mx-auto mb-6" />
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
            {getLocalizedText(
              'Suivez les événements et activités de l\'École Nationale des Transmissions',
              'تابع الأحداث والفعاليات في المدرسة الوطنية للمواصلات السلكية واللاسلكية',
              'Follow the events and activities of the National School of transmissionss'
            )}
          </p>
        </motion.div>

        {/* Filtres par type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-md border border-blue/10 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-blue" />
            <h3 className="font-semibold text-blue font-serif">
              {getLocalizedText('Filtrer par type', 'تصفية حسب النوع', 'Filter by type')}
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((type) => (
              <Button
                key={type.key}
                variant={selectedType === type.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTypeChange(type.key)}
                className={`text-xs font-semibold transition-all ${
                  selectedType === type.key 
                    ?' bg-blue text-white border-blue hover:bg-blue/90'
                    :  'border-gold  bg-gold/5 text-blue hover:border-blue hover:bg-gold/5'
                }`}
              >
                {getLocalizedText(type.label_fr, type.label_ar, type.label_en)}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-md border border-blue/10 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-serif font-bold text-blue mb-2">{events.length}</div>
              <div className="text-sm text-slate-600">
                {getLocalizedText('Total des événements', 'إجمالي الأحداث', 'Total Events')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif font-bold text-gold mb-2">{featuredEvents.length}</div>
              <div className="text-sm text-slate-600">
                {getLocalizedText('Événements mis en avant', 'أحداث مميزة', 'Featured Events')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif font-bold text-blue mb-2">
                {events.filter(e => e.status && e.status.is_upcoming).length}
              </div>
              <div className="text-sm text-slate-600">
                {getLocalizedText('Événements à venir', 'أحداث قادمة', 'Upcoming Events')}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
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
                `${filteredEvents.length} résultat${filteredEvents.length > 1 ? 's' : ''} trouvé${filteredEvents.length > 1 ? 's' : ''}`,
                `تم العثور على ${filteredEvents.length} نتيجة`,
                `${filteredEvents.length} result${filteredEvents.length > 1 ? 's' : ''} found`
              )}
            </div>
          )}
        </motion.div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
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
              {featuredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  language={language}
                  onClick={() => handleEventClick(event)}
                  formatDate={formatDate}
                  featured={true}
                  getLocalizedText={getLocalizedText}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* All Events */}
        {regularEvents.length === 0 && featuredEvents.length === 0 ? (
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
            {regularEvents.length > 0 && (
              <>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-blue mb-8">
                  {getLocalizedText('Tous les événements', 'جميع الأحداث', 'All Events')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      language={language}
                      onClick={() => handleEventClick(event)}
                      formatDate={formatDate}
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

// Helper to resolve the correct image URL — match EventDetail priority: featured_image first
const getEventImage = (event: any): string => {
    const img = event.featured_image || event.image_url || event.image;
    if (!img) return '';
    // If image is a relative path, prepend the API base URL (without /api)
    if (img.startsWith('/')) {
        const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');
        return baseUrl + img;
    }
    return img;
};

const EventCard = ({ event, language, onClick, formatDate, featured, getLocalizedText }: any) => (
    <motion.div
        whileHover={{ y: -8 }}
        className="bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-md border border-blue/10 hover:border-gold/30 transition-all hover:shadow-lg cursor-pointer group"
        onClick={onClick}
    >
        <div className="relative h-48 overflow-hidden">
            <img
                src={getEventImage(event) || 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt={getLocalizedText(event.image_alt_fr, event.image_alt_ar, event.image_alt_en)}
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
            {event.status && (
                <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full text-xs text-white font-bold shadow ${
                        event.status.is_upcoming ? 'bg-gold text-blue' :
                        event.status.is_ongoing ? 'bg-blue' :
                        'bg-slate-400'
                    }`}>
                        {event.status.is_upcoming ? getLocalizedText('À venir', 'قادم', 'Upcoming') :
                         event.status.is_ongoing ? getLocalizedText('En cours', 'جاري', 'Ongoing') :
                         getLocalizedText('Terminé', 'انتهى', 'Completed')}
                    </div>
                </div>
            )}
        </div>

        <div className="p-6">
            <h3 className="text-lg font-serif font-bold text-blue mb-3 group-hover:text-gold transition-colors">
                {language === 'ar' ? event.title_ar : language === 'en' ? (event.title_en || event.title_fr) : event.title_fr}
            </h3>
            <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                {language === 'ar' ? event.description_ar : language === 'en' ? (event.description_en || event.description_fr) : event.description_fr}
            </p>
            
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(event.start_date)}</span>
                </div>
                
                {event.location && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                    </div>
                )}
                
                {event.max_participants && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Users className="w-3 h-3" />
                        <span>{event.max_participants} {getLocalizedText('participants', 'مشارك', 'participants')}</span>
                    </div>
                )}
            </div>

            <Button className="w-full bg-gradient-to-r from-blue to-blue/80 hover:from-blue/90 hover:to-blue text-white text-xs font-semibold py-2 rounded-lg">
                {getLocalizedText('Lire plus', 'اقرأ المزيد', 'Read More')} <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
        </div>
    </motion.div>
);

export default EventsFiltered;
