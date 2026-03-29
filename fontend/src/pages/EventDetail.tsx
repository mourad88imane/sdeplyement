import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, Users, Loader2, AlertCircle } from 'lucide-react';

interface EventDetail {
  id: number;
  title?: string;
  title_fr?: string;
  title_ar?: string;
  title_en?: string;
  description?: string;
  description_fr?: string;
  description_ar?: string;
  description_en?: string;
  content_fr?: string;
  content_ar?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  address?: string;
  room?: string;
  max_participants?: number;
  registration_required?: boolean;
  registration_fee?: number;
  registration_open?: boolean;
  available_spots?: number;
  image_url?: string;
  image?: string;
  featured_image?: string;
  category?: {
    id: number;
    name_fr: string;
    name_ar: string;
  };
  category_name?: string;
  organizer?: {
    id: number;
    name: string;
    email: string;
  };
  views_count?: number;
  is_featured?: boolean;
  is_upcoming?: boolean;
  is_ongoing?: boolean;
  is_past?: boolean;
  [key: string]: any;
}

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getLocalizedText = (fr?: string, ar?: string, en?: string) => {
    if (language === 'ar') return ar || fr || '';
    if (language === 'en') return en || fr || '';
    return fr || '';
  };

  useEffect(() => {
    const fetchEventDetail = async () => {
      setLoading(true);
      setError(null);
      
      // Use environment variable or default
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      
      // Try the new dedicated endpoint first (correct path: /events/event/<slug>/)
      const endpoints = [
        `${API_BASE_URL}/events/event/${slug}/`,  // New endpoint - get single event by slug
        `${API_BASE_URL}/events/events-simple/?slug=${slug}`,  // Fallback to list endpoint
        `${API_BASE_URL}/events/events/?slug=${slug}`,
        `${API_BASE_URL}/events/conferences/?slug=${slug}`,
      ];

      let found = false;

      const tryNext = async (index = 0) => {
        if (index >= endpoints.length) {
          if (!found) {
            setError(getLocalizedText(
              'Événement non trouvé',
              'لم يتم العثور على الحدث',
              'Event not found'
            ));
            setLoading(false);
          }
          return;
        }

        try {
          const res = await fetch(endpoints[index]);
          if (!res.ok) throw new Error('Not ok');
          const data = await res.json();

          // Check if we got a direct event object (from new endpoint)
          if (data.event) {
            setEvent(data.event);
            found = true;
            setLoading(false);
            return;
          }

          // Support multiple response shapes for list endpoints
          const list = data.results || data.events || data.conferences || data;
          const arr = Array.isArray(list) ? list : (list.results || list.events || []);

          if (arr && arr.length > 0) {
            setEvent(arr[0]);
            found = true;
            setLoading(false);
            return;
          }

          // try next endpoint
          tryNext(index + 1);
        } catch (e) {
          tryNext(index + 1);
        }
      };

      tryNext();
    };

    if (slug) {
      fetchEventDetail();
    }
  }, [slug, language]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="relative w-full overflow-hidden bg-white min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue" />
          <p className="text-slate-600 font-serif">
            {getLocalizedText('Chargement de l\'événement...', 'جاري تحميل الحدث...', 'Loading event...')}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full overflow-hidden bg-white min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-serif font-bold text-blue mb-2">
            {getLocalizedText('Erreur', 'خطأ', 'Error')}
          </h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button 
            onClick={() => navigate(-1)}
            className="bg-blue hover:bg-blue/90 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {getLocalizedText('Retour', 'رجوع', 'Back')}
          </Button>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const imageUrl = event.featured_image || event.image_url || 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800';

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

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="relative z-20 mt-28 ml-6 md:ml-10 flex items-center gap-2 text-blue hover:text-gold transition-colors font-semibold group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        {getLocalizedText('Retour', 'رجوع', 'Back')}
      </motion.button>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 h-96 md:h-[500px] overflow-hidden rounded-3xl mx-6 md:mx-10 mt-8 shadow-2xl border-2 border-gold/20"
      >
        <img
          src={imageUrl}
          alt={language === 'ar' ? event.title_ar : language === 'en' ? (event.title_en || event.title) : event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue/40 to-transparent" />
      </motion.div>

      {/* Content */}
      <section className="relative z-10 max-w-[1000px] mx-auto px-6 md:px-10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-blue leading-tight mb-6">
            {language === 'ar' ? event.title_ar : language === 'en' ? (event.title_en || event.title) : event.title}
          </h1>

          {/* Accent line */}
          <div className="h-1 w-20 bg-gradient-to-r from-gold to-blue rounded-full mb-8" />

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {event.start_date && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-md border border-blue/10 flex items-start gap-4"
              >
                <div className="p-3 bg-gradient-to-br from-blue/10 to-gold/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue mb-1 font-serif">
                    {getLocalizedText('Date', 'التاريخ', 'Date')}
                  </h3>
                  <p className="text-slate-600">
                    {formatDate(event.start_date)}
                  </p>
                  {event.end_date && event.end_date !== event.start_date && (
                    <p className="text-slate-600 text-sm mt-1">
                      {getLocalizedText('Fin:', 'النهاية:', 'End:')} {formatDate(event.end_date)}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {event.location && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-md border border-blue/10 flex items-start gap-4"
              >
                <div className="p-3 bg-gradient-to-br from-blue/10 to-gold/10 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue mb-1 font-serif">
                    {getLocalizedText('Lieu', 'المكان', 'Location')}
                  </h3>
                  <p className="text-slate-600">{event.location}</p>
                  {event.address && <p className="text-slate-500 text-sm">{event.address}</p>}
                  {event.room && <p className="text-slate-500 text-sm">{getLocalizedText('Salle:', 'قاعة:', 'Room:')} {event.room}</p>}
                </div>
              </motion.div>
            )}

            {event.max_participants && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-md border border-blue/10 flex items-start gap-4"
              >
                <div className="p-3 bg-gradient-to-br from-blue/10 to-gold/10 rounded-lg">
                  <Users className="w-6 h-6 text-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue mb-1 font-serif">
                    {getLocalizedText('Participants', 'المشاركون', 'Participants')}
                  </h3>
                  <p className="text-slate-600">{event.max_participants}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Description */}
          {(event.description || event.description_ar || event.description_en) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-md border border-blue/10"
            >
              <h2 className="text-2xl font-serif font-bold text-blue mb-4">
                {getLocalizedText('À propos', 'حول', 'About')}
              </h2>
              <div className="h-1 w-12 bg-gradient-to-r from-gold to-blue rounded-full mb-6" />
              <p className="text-slate-600 leading-relaxed text-lg">
                {language === 'ar' ? (event.description_ar || event.description) : language === 'en' ? (event.description_en || event.description) : event.description}
              </p>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-12 flex flex-wrap gap-4"
          >
            <Button
              onClick={() => navigate(-1)}
              className="bg-blue hover:bg-blue/90 text-white font-semibold px-8 py-3 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {getLocalizedText('Retour aux événements', 'العودة إلى الأحداث', 'Back to Events')}
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none opacity-30" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue/20 rounded-full blur-3xl pointer-events-none opacity-20" />
    </div>
  );
};

export default EventDetailPage;
