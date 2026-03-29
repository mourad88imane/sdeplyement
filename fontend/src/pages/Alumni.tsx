import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, Users } from 'lucide-react';


function YearBadge({ year }: { year: number }) {
  return (
    <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue to-gold text-xs font-bold text-white rounded-full px-3 py-1 shadow-lg">{year}</div>
  );
}

interface AlumniItem {
  id: number;
  title_fr: string;
  title_ar: string;
  title_en?: string;
  slug: string;
  summary_fr: string;
  summary_ar: string;
  summary_en?: string;
  featured_image?: string;
  year: number;
  featured?: boolean;
  photos?: Array<{ id: number; image: string; caption_fr?: string; caption_ar?: string; caption_en?: string }>
}

const Alumni = () => {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<AlumniItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/news/alumni/');
        if (!response.ok) throw new Error('HTTP error ' + response.status);
        const data = await response.json();
        const list = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);
        setItems(list);
      } catch (err) {
        console.error(err);
        setError(language === 'ar' ? 'حدث خطأ' : language === 'en' ? 'An error occurred' : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, [language]);

  const [modalImage, setModalImage] = useState<string | null>(null);

  const itemsArray = Array.isArray(items) ? items : [];
  const galleryPhotos = itemsArray.reduce((acc: any[], i) => {
    const photos = (i.photos || []).map((p: any) => ({
      id: p.id,
      image: p.image,
      caption_fr: p.caption_fr,
      caption_ar: p.caption_ar,
      caption_en: p.caption_en,
    }));
    return acc.concat(photos);
  }, []).slice(0, 8);

  const featuredItems = itemsArray.filter(i => i.featured);
  const featured = featuredItems.length > 0 ? featuredItems.slice(0, 1) : itemsArray.length > 0 ? [itemsArray[0]] : [];

  const getLocalizedText = (fr?: string, ar?: string, en?: string) => {
    if (language === 'ar') return ar || fr || '';
    if (language === 'en') return en || fr || '';
    return fr || '';
  };

  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* BACKGROUND DECORATIONS - Matching Hero */}
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

      {/* HERO BANNER */}
      {featured.length > 0 && (
        <section className="relative z-10 pt-24 pb-8 px-6 md:px-10 max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue/20 bg-blue/5 backdrop-blur-sm hover:bg-blue/10 transition-colors mb-6"
            >
              <Users className="w-4 h-4 text-gold animate-pulse" />
              <span className="text-blue text-xs font-bold uppercase tracking-widest">
                {language === 'ar' ? '🎓 قصص نجاح' : language === 'en' ? '🎓 Success Stories' : '🎓 Histoires de Succès'}
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-blue leading-[1.15] mb-6">
              {language === 'ar' 
                ? 'نجاحات خريجينا' 
                : language === 'en'
                ? 'Alumni Success Stories'
                : 'Succès des Anciens'}
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-gold to-blue rounded-full mb-6" />
            <p className="text-slate-600 text-lg md:text-xl max-w-2xl">
              {language === 'ar'
                ? 'نحن فخورون بمسارات خريجينا المتميزين الذين يساهمون في ريادة قطاع المواصلات'
                : language === 'en'
                ? 'We are proud of our distinguished alumni who are leaders in the transmissionss sector'
                : 'Découvrez les parcours inspirants de nos anciens élèves qui excellent dans le secteur des transmissions'}
            </p>
          </motion.div>

          {/* Featured Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-xl bg-white/70 backdrop-blur-md border border-blue/10 hover:border-gold/30 transition-all mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-2 relative h-80">
                <img 
                  src={featured[0].featured_image} 
                  alt={getLocalizedText(featured[0].title_fr, featured[0].title_ar, featured[0].title_en)} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue/60 via-transparent to-transparent" />
                <div className="absolute left-6 bottom-6">
                  <h2 className="text-3xl font-serif font-bold text-white drop-shadow-lg">{getLocalizedText(featured[0].title_fr, featured[0].title_ar, featured[0].title_en)}</h2>
                  <p className="text-white/90 max-w-xl mt-2 text-sm md:text-base">{getLocalizedText(featured[0].summary_fr, featured[0].summary_ar, featured[0].summary_en)}</p>
                </div>
              </div>
              <div className="p-8 flex flex-col gap-4 justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-slate-600 font-semibold uppercase tracking-widest">
                      {language === 'ar' ? 'النجاح المميز' : language === 'en' ? 'Featured Success' : 'Succès Vedette'}
                    </div>
                    <YearBadge year={featured[0].year} />
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{t('alumniSuccessIntro') || (language === 'ar' ? 'يمثل هذا الخريج نموذجًا متميزًا لنجاح برامجنا التعليمية' : language === 'en' ? 'This alumnus represents an outstanding model of success from our educational programs' : 'Cet ancien élève représente un modèle remarquable de succès de nos programmes éducatifs')}</p>
                </div>
                <Link 
                  to={`/about/alumni/${featured[0].slug}`} 
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue text-white font-bold text-sm hover:bg-blue-dark transition-all duration-300 shadow-lg hover:shadow-blue/30 hover:scale-105 active:scale-95"
                >
                  {language === 'ar' ? 'اقرأ القصة' : language === 'en' ? 'Read the Story' : 'Lire l\'histoire'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ALUMNI GRID */}
      <section className="relative z-10 py-12 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-blue/20 border-t-blue rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium">{t('loading') || (language === 'ar' ? 'جاري التحميل...' : language === 'en' ? 'Loading...' : 'Chargement...')}</p>
              </div>
            </div>
          )}
          
          {error && <p className="text-red-600 text-center py-8">{error}</p>}

          {!loading && items.length === 0 && (
            <div className="text-center py-16 bg-white/50 rounded-2xl border-2 border-dashed border-blue/20">
              <p className="text-slate-600 text-lg">{t('alumniNoSuccess') || (language === 'ar' ? 'لا توجد قصص نجاح بعد' : language === 'en' ? 'No success stories yet' : 'Aucune histoire de succès pour le moment')}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, idx) => (
              <motion.article 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-md border border-blue/10 hover:border-gold/30 transition-all hover:shadow-xl group"
              >
                <div className="relative rounded-t-2xl overflow-hidden h-48 bg-gradient-to-br from-blue/10 to-gold/10">
                  {item.featured_image ? (
                    <img 
                      src={item.featured_image} 
                      alt={getLocalizedText(item.title_fr, item.title_ar, item.title_en)} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue/20 to-gold/20 flex items-center justify-center">
                      <Users className="w-12 h-12 text-blue/30" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <YearBadge year={item.year} />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-blue mb-2">{getLocalizedText(item.title_fr, item.title_ar, item.title_en)}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">{getLocalizedText(item.summary_fr, item.summary_ar, item.summary_en)}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-blue/10">
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-widest">{item.year}</div>
                    <Link 
                      to={`/about/alumni/${item.slug}`} 
                      className="text-sm font-semibold text-blue hover:text-gold transition-colors flex items-center gap-1 group/link"
                    >
                      {language === 'ar' ? 'اقرأ المزيد' : language === 'en' ? 'Learn More' : 'En savoir plus'}
                      <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* SIDEBAR - Photo Gallery */}
      <section className="relative z-10 py-12 px-6 md:px-10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-blue/10 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue/10 to-gold/10 rounded-lg">
                  <Users className="h-5 w-5 text-blue" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-blue">{t('alumniSuccessTitle') || (language === 'ar' ? 'معرض النجاح' : language === 'en' ? 'Success Gallery' : 'Galerie des Succès')}</h3>
              </div>
              <div className="h-1 w-20 bg-gradient-to-r from-gold to-blue rounded-full mb-6" />
              
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">{t('alumniSuccessIntro') || (language === 'ar' ? 'استكشف الصور والذكريات من رحلات نجاح خريجينا' : language === 'en' ? 'Explore photos and memories from our alumni\'s success journeys' : 'Explorez les photos et souvenirs des parcours de réussite de nos anciens élèves')}</p>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {galleryPhotos.length ? (
                  galleryPhotos.map((photo) => (
                    <motion.button 
                      key={photo.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setModalImage(photo.image)}
                      className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all group aspect-square"
                    >
                      <img 
                        src={photo.image} 
                        alt={getLocalizedText(photo.caption_fr, photo.caption_ar, photo.caption_en)} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-blue/0 group-hover:bg-blue/40 transition-colors duration-300" />
                    </motion.button>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-slate-600 text-sm">
                    {t('alumniNoSuccess') || (language === 'ar' ? 'لا توجد صور' : language === 'en' ? 'No photos' : 'Pas de photos')}
                  </div>
                )}
              </div>

              <Link 
                to="/about/alumni" 
                className="group inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-blue text-white font-bold text-sm hover:bg-blue-dark transition-all duration-300 shadow-lg hover:shadow-blue/30 hover:scale-105 active:scale-95"
              >
                {t('viewAllSuccess') || (language === 'ar' ? 'عرض الكل' : language === 'en' ? 'View All' : 'Voir tout')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="mt-4 text-xs text-slate-500 text-center">{t('addPhotosInfo') || (language === 'ar' ? 'أضف صورك من قصة نجاحك' : language === 'en' ? 'Share photos from your success story' : 'Partagez vos photos de votre histoire de succès')}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal lightbox */}
      {modalImage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" 
          onClick={() => setModalImage(null)}
        >
          <motion.img 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            src={modalImage} 
            alt="" 
            className="max-w-[90%] max-h-[90%] rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none opacity-30" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue/20 rounded-full blur-3xl pointer-events-none opacity-20" />
    </div>
  );
};

export default Alumni;
