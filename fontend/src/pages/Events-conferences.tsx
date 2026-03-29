import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, AlertCircle, Calendar, Star, MapPin, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EventsAPI, Conference } from '@/services/api';

const EventsConferences = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [conferences, setConferences] = useState<Conference[]>([]);
  const [filteredConferences, setFilteredConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Charger les conférences depuis l'API
  useEffect(() => {
    const fetchConferences = async () => {
      try {
        setLoading(true);
        console.log('🎤 Chargement des conférences...');
        
        const data = await EventsAPI.getConferences();
        console.log('📊 Conférences reçues:', data);
        
        setConferences(data);
        setFilteredConferences(data);

      } catch (err) {
        console.error('❌ Erreur lors du chargement:', err);
        setError(language === 'ar'
          ? 'فشل في تحميل المؤتمرات'
          : 'Échec du chargement des conférences'
        );
        toast({
          title: language === 'ar' ? 'خطأ' : 'Erreur',
          description: language === 'ar'
            ? 'فشل في تحميل المؤتمرات من الخادم'
            : 'Échec du chargement des conférences depuis le serveur',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, [language, toast]);

  // Filtrer les conférences par recherche
  useEffect(() => {
    if (!searchQuery) {
      setFilteredConferences(conferences);
      return;
    }

    const filtered = conferences.filter(conference => {
      const title = language === 'ar' ? conference.title_ar : conference.title_fr;
      const description = language === 'ar' ? conference.description_ar : conference.description_fr;

      return (title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              description?.toLowerCase().includes(searchQuery.toLowerCase())) ?? false;
    });

    setFilteredConferences(filtered);
  }, [conferences, searchQuery, language]);

  const handleConferenceClick = (conference: Conference) => {
    navigate(`/conferences/${conference.slug}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {language === 'ar' ? 'جاري تحميل المؤتمرات...' : 'Chargement des conférences...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {language === 'ar' ? 'خطأ في التحميل' : 'Erreur de chargement'}
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            {language === 'ar' ? 'إعادة المحاولة' : 'Réessayer'}
          </Button>
        </div>
      </div>
    );
  }

  // Séparer les conférences mises en avant
  const featuredConferences = filteredConferences.filter(conf => conf.is_featured);
  const regularConferences = filteredConferences.filter(conf => !conf.is_featured);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-4xl font-bold mb-4 ${language === 'ar' ? 'text-right' : ''}`}
          >
            {language === 'ar' ? 'المؤتمرات' : 'Conférences'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-muted-foreground max-w-3xl mx-auto ${language === 'ar' ? 'text-right' : ''}`}
          >
            {language === 'ar'
              ? 'تابع المؤتمرات والندوات العلمية في المدرسة الوطنية للمواصلات السلكية واللاسلكية'
              : 'Suivez les conférences et séminaires scientifiques de l\'École Nationale des Transmissions'
            }
          </motion.p>
        </div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-r from-[#133059]/5 to-[#e8c97a]/5 rounded-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#133059]">{conferences.length}</div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'إجمالي المؤتمرات' : 'Total des conférences'}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{featuredConferences.length}</div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'مؤتمرات مميزة' : 'Conférences mises en avant'}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {conferences.filter(c => c.status?.is_upcoming).length}
              </div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'مؤتمرات قادمة' : 'Conférences à venir'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-md mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={language === 'ar'
                ? 'البحث في المؤتمرات...'
                : 'Rechercher des conférences...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {searchQuery && (
            <div className="mt-4 text-sm text-muted-foreground text-center">
              {language === 'ar'
                ? `تم العثور على ${filteredConferences.length} نتيجة`
                : `${filteredConferences.length} résultat${filteredConferences.length > 1 ? 's' : ''} trouvé${filteredConferences.length > 1 ? 's' : ''}`
              }
            </div>
          )}
        </motion.div>

        {/* Conférences mises en avant */}
        {featuredConferences.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${language === 'ar' ? 'text-right flex-row-reverse' : ''}`}>
              <Star className="w-6 h-6 text-yellow-500" />
              {language === 'ar' ? 'مؤتمرات مميزة' : 'Conférences mises en avant'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredConferences.map((conference) => (
                <ConferenceCard
                  key={conference.id}
                  conference={conference}
                  language={language}
                  onClick={() => handleConferenceClick(conference)}
                  formatDate={formatDate}
                  featured={true}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Toutes les conférences */}
        {regularConferences.length === 0 && featuredConferences.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {language === 'ar' ? 'لا توجد مؤتمرات' : 'Aucune conférence trouvée'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'ar'
                ? 'لا توجد مؤتمرات تطابق معايير البحث'
                : 'Aucune conférence ne correspond à vos critères de recherche'
              }
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {regularConferences.length > 0 && (
              <>
                <h2 className={`text-2xl font-bold mb-6 ${language === 'ar' ? 'text-right' : ''}`}>
                  {language === 'ar' ? 'جميع المؤتمرات' : 'Toutes les conférences'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularConferences.map((conference) => (
                    <ConferenceCard
                      key={conference.id}
                      conference={conference}
                      language={language}
                      onClick={() => handleConferenceClick(conference)}
                      formatDate={formatDate}
                      featured={false}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Composant pour afficher une carte de conférence
interface ConferenceCardProps {
  conference: Conference;
  language: string;
  onClick: () => void;
  formatDate: (date: string) => string;
  featured: boolean;
}

const ConferenceCard = ({ conference, language, onClick, formatDate, featured }: ConferenceCardProps) => (
  <div
    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    onClick={onClick}
  >
    {/* Image de la conférence */}
    <div className="relative h-48 overflow-hidden">
      <img
        src={conference.featured_image || 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800'}
        alt={language === 'ar' ? conference.image_alt_ar : conference.image_alt_fr}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
      {/* Badge "Mis en avant" */}
      {featured && (
        <div className="absolute top-4 left-4">
          <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Star className="w-3 h-3" />
            {language === 'ar' ? 'مميز' : 'Mis en avant'}
          </div>
        </div>
      )}
      {/* Badge de statut */}
      <div className="absolute top-4 right-4">
        <div className={`px-2 py-1 rounded-full text-xs text-white ${
          conference.status?.is_upcoming ? 'bg-green-500' :
          conference.status?.is_ongoing ? 'bg-[#133059]' :
          'bg-gray-500'
        }`}>
          {conference.status?.is_upcoming ? (language === 'ar' ? 'قادم' : 'À venir') :
           conference.status?.is_ongoing ? (language === 'ar' ? 'جاري' : 'En cours') :
           (language === 'ar' ? 'انتهى' : 'Terminé')}
        </div>
      </div>
    </div>

    <div className="p-6">
      <h3 className={`text-lg font-semibold mb-2 ${language === 'ar' ? 'text-right' : ''}`}>
        {language === 'ar' ? conference.title_ar : conference.title_fr}
      </h3>
      <p className={`text-muted-foreground text-sm mb-4 line-clamp-3 ${language === 'ar' ? 'text-right' : ''}`}>
        {language === 'ar' ? conference.description_ar : conference.description_fr}
      </p>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(conference.start_date)}</span>
        </div>
        
        {conference.location && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{conference.location}</span>
          </div>
        )}
        
        {conference.max_participants && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>{conference.max_participants} {language === 'ar' ? 'مشارك' : 'participants'}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default EventsConferences;
