import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import { API_BASE_URL } from '@/services/api';

export type Alumni = {
  id: number;
  name_fr?: string;
  name_ar?: string;
  name_en?: string;
  title_fr?: string;
  title_ar?: string;
  title_en?: string;
  story_fr?: string;
  story_ar?: string;
  story_en?: string;
  photo?: string;
  created_at: string;
};

const AlumniSuccessPage = () => {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/alumni-success/`)
      .then(res => res.json())
      .then(data => {
        setAlumni(data.results || data);
        setLoading(false);
      })
      .catch(() => {
        setAlumni([]);
        setLoading(false);
      });
  }, []);

  const getLocalizedText = (fr?: string, ar?: string, en?: string) => {
    if (lang === 'ar') return ar || fr || '';
    if (lang === 'en') return en || fr || '';
    return fr || '';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

      {/* HERO BANNER */}
      <section className="relative z-10 pt-24 pb-16 px-6 md:px-10 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
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
              {lang === 'ar' ? '🎓 قصص النجاح' : lang === 'en' ? '🎓 Alumni Stories' : '🎓 Parcours Inspirants'}
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-blue leading-[1.15] mb-6">
            {lang === 'ar' 
              ? 'نجاحات خريجينا' 
              : lang === 'en'
              ? 'Alumni Success Stories'
              : 'Succès des Anciens'}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-gold to-blue rounded-full mx-auto mb-6" />
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
            {lang === 'ar'
              ? 'نحن فخورون بمسارات خريجينا المتميزين الذين يساهمون في ريادة قطاع المواصلات'
              : lang === 'en'
              ? 'We are proud of our distinguished alumni who are leaders in the transmissionss sector'
              : 'Découvrez les parcours inspirants de nos anciens élèves qui excellent dans le secteur des transmissions'}
          </p>
        </motion.div>
      </section>

      {/* ALUMNI GRID */}
      <section className="relative z-10 py-16 px-6 md:px-10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto">
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-blue/20 border-t-blue rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium">{lang === 'ar' ? 'جاري التحميل...' : lang === 'en' ? 'Loading...' : 'Chargement...'}</p>
              </div>
            </div>
          )}

          {!loading && alumni.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-blue/10">
              <div className="text-slate-600 text-lg font-medium">
                {lang === 'ar'
                  ? 'لا توجد قصص نجاح بعد'
                  : lang === 'en'
                  ? 'No success stories yet'
                  : 'Aucune histoire de succès pour le moment'}
              </div>
            </div>
          )}

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {alumni.map((a) => {
              const name = getLocalizedText(a.name_fr, a.name_ar, a.name_en);
              const title = getLocalizedText(a.title_fr, a.title_ar, a.title_en);
              const story = getLocalizedText(a.story_fr, a.story_ar, a.story_en);

              return (
                <motion.div
                  key={a.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="group bg-white/70 backdrop-blur-md rounded-2xl shadow-md border border-blue/10 hover:border-gold/30 overflow-hidden transition-all hover:shadow-xl cursor-pointer flex flex-col"
                  onClick={() => navigate(`/about/alumni-success/${a.id}`)}
                >
                  {/* Header background */}
                  <div className="h-32 bg-gradient-to-r from-blue/10 to-gold/10 group-hover:from-blue/20 group-hover:to-gold/20 transition-colors" />

                  {/* Content */}
                  <div className="px-6 pb-8 flex-1 flex flex-col items-center -mt-16">
                    {/* Avatar */}
                    <div className="relative mb-4 z-10">
                      {a.photo ? (
                        <img
                          src={a.photo.startsWith('http') ? a.photo : `${API_BASE_URL}${a.photo}`}
                          alt={name}
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg bg-white group-hover:shadow-xl transition-shadow"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue to-gold border-4 border-white shadow-lg flex items-center justify-center">
                          <span className="text-4xl font-bold text-white">{name?.charAt(0)}</span>
                        </div>
                      )}
                    </div>

                    {/* Name & Title */}
                    <h3 className="font-serif font-bold text-xl text-blue mb-1 text-center group-hover:text-gold transition-colors">
                      {name}
                    </h3>
                    <div className="text-sm font-semibold text-gold mb-4 text-center px-4 uppercase tracking-widest">
                      {title}
                    </div>

                    {/* Story snippet */}
                    <p className="text-slate-600 text-center line-clamp-3 italic text-sm leading-relaxed mb-6">
                      "{story}"
                    </p>

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-blue/10 w-full flex items-center justify-between">
                      <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                        {new Date(a.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="text-blue font-bold text-sm flex items-center gap-1 group-hover:text-gold group-hover:gap-2 transition-all">
                        {lang === 'ar' ? 'إقرأ المزيد' : lang === 'en' ? 'Read More' : 'En savoir plus'}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none opacity-30" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue/20 rounded-full blur-3xl pointer-events-none opacity-20" />
    </div>
  );
};

export default AlumniSuccessPage;
