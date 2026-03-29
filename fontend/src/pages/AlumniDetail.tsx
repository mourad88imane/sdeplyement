import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Alumni as AlumniType, AlumniPhoto } from '@/components/alumni/AlumniGalleryModal';
import { ArrowLeft, Calendar, Quote, ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '@/services/api';

const AlumniDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState<AlumniType | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE_URL}/alumni-success/${id}/`)
      .then(res => res.json())
      .then(data => {
        setAlumni(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const getLocalizedText = (fr?: string, ar?: string, en?: string) => {
    if (lang === 'ar') return ar || fr || '';
    if (lang === 'en') return en || fr || '';
    return fr || '';
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    if (!gallery.length) return;
    setLightboxIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    if (!gallery.length) return;
    setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue/10 to-gold/10">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue font-medium">{lang === 'ar' ? 'جاري التحميل...' : lang === 'en' ? 'Loading...' : 'Chargement...'}</p>
      </div>
    </div>
  );

  if (!alumni) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue/10 to-gold/10">
      <div className="text-center">
        <p className="text-blue text-xl mb-4">{lang === 'ar' ? 'لم يتم العثور.' : lang === 'en' ? 'Not found.' : 'Non trouvé.'}</p>
        <button 
          onClick={() => navigate('/about/alumni-success')}
          className="px-6 py-3 bg-blue text-white rounded-lg hover:bg-blue-dark transition font-semibold"
        >
          {lang === 'ar' ? 'العودة للقائمة' : lang === 'en' ? 'Back to List' : 'Retour à la liste'}
        </button>
      </div>
    </div>
  );

  const name = getLocalizedText(alumni.name_fr, alumni.name_ar, alumni.name_en);
  const title = getLocalizedText(alumni.title_fr, alumni.title_ar, alumni.title_en);
  const story = getLocalizedText(alumni.story_fr, alumni.story_ar, alumni.story_en);
  const gallery: AlumniPhoto[] = alumni.gallery || [];

  const getImageUrl = (img: string) => img.startsWith('http') ? img : `http://localhost:8000${img}`;

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

      {/* Hero Header */}
      <div className="relative z-10 bg-gradient-to-r from-blue via-blue/90 to-blue/80 py-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 mb-8 text-white/80 hover:text-white font-medium transition group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            {lang === 'ar' ? 'رجوع' : lang === 'en' ? 'Back' : 'Retour'}
          </motion.button>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative flex-shrink-0"
            >
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                {alumni.photo ? (
                  <img
                    src={getImageUrl(alumni.photo)}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gold/40 flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">{name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gold rounded-full border-4 border-blue flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </motion.div>

            <div className="text-center md:text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-serif font-bold text-white mb-2"
              >
                {name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gold text-lg md:text-xl mb-4 font-semibold"
              >
                {title}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center md:justify-start gap-2 text-white/90 text-sm"
              >
                <Calendar size={16} />
                {new Date(alumni.created_at).toLocaleDateString(
                  lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'fr-FR',
                  { day: 'numeric', month: 'long', year: 'numeric' }
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 -mt-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-12 border border-blue/10 hover:border-gold/30 transition-all"
        >
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue to-gold rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Quote className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-blue mb-2">
                {lang === 'ar' ? 'قصة النجاح' : lang === 'en' ? 'Success Story' : 'Le Parcours'}
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-gold to-blue rounded-full"></div>
            </div>
          </div>
          
          <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
            {story}
          </p>
        </motion.div>
      </div>

      {/* Gallery Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-md rounded-full shadow-lg border border-blue/10 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue/10 to-gold/10 rounded-lg">
              <ImageIcon className="text-blue" size={20} />
            </div>
            <span className="font-serif font-bold text-blue text-lg">
              {lang === 'ar' ? 'معرض الصور' : lang === 'en' ? 'Photo Gallery' : 'Galerie de Photos'}
            </span>
            <span className="bg-gold/20 text-blue px-3 py-1 rounded-full text-sm font-bold">
              {gallery.length}
            </span>
          </div>
        </motion.div>

        {gallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-[4/3] border border-blue/10 hover:border-gold/30 transition-all">
                  <img
                    src={getImageUrl(photo.image)}
                    alt={getLocalizedText(photo.legend_fr, photo.legend_ar, photo.legend_en)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      {photo.legend_fr && (
                        <p className="text-white text-sm font-medium line-clamp-2">
                          {getLocalizedText(photo.legend_fr, photo.legend_ar, photo.legend_en)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                    <ImageIcon className="text-blue" size={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white/50 rounded-2xl border-2 border-dashed border-blue/20"
          >
            <ImageIcon className="mx-auto text-blue/30 mb-4" size={48} />
            <p className="text-slate-600 text-lg font-medium">
              {lang === 'ar' ? 'لا توجد صور' : lang === 'en' ? 'No photos available' : 'Aucune photo disponible'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-6 right-6 p-2 text-white/80 hover:text-white transition bg-white/10 rounded-full hover:bg-white/20 z-10"
              onClick={() => setLightboxOpen(false)}
            >
              <X size={32} />
            </button>
            
            <button
              className="absolute left-6 p-3 text-white/80 hover:text-white bg-white/10 rounded-full hover:bg-white/20 transition z-10"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeft size={32} />
            </button>
            
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={getImageUrl(gallery[lightboxIndex]?.image || '')}
              alt=""
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            
            <button
              className="absolute right-6 p-3 text-white/80 hover:text-white bg-white/10 rounded-full hover:bg-white/20 transition z-10"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRight size={32} />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              {lightboxIndex + 1} / {gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none opacity-30" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue/20 rounded-full blur-3xl pointer-events-none opacity-20" />
    </div>
  );
};

export default AlumniDetailPage;
