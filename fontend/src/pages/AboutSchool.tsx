import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { History, Award, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

const AboutSchool = () => {
  const { language: lang } = useLanguage();

  // ✨ MEMOIZATION
  const texts = useMemo(() => ({
    pageTitle: lang === 'ar' ? 'نبذة عن المدرسة' : 'À Propos de l\'École',
    pageSubtitle: lang === 'ar' 
      ? 'اكتشف تاريخنا وقيمنا ورسالتنا'
      : 'Découvrez notre histoire, nos valeurs et notre mission',
    historyTitle: lang === 'ar' ? 'تاريخ المدرسة' : 'Histoire de l\'École',
    missionVisionTitle: lang === 'ar' ? 'الرؤية والرسالة' : 'Mission et Vision',
    missionLabel: lang === 'ar' ? 'رسالتنا' : 'Notre Mission',
    visionLabel: lang === 'ar' ? 'رؤيتنا' : 'Notre Vision',
    ctaTitle: lang === 'ar' ? 'انضم إلينا في رحلة التميز' : 'Rejoignez-nous dans un parcours d\'excellence',
    ctaDesc: lang === 'ar'
      ? 'اكتشف برامجنا التعليمية المتميزة وابدأ مسيرتك المهنية'
      : 'Découvrez nos programmes éducatifs exceptionnels et commencez votre carrière',
    explorePrograms: lang === 'ar' ? 'استكشف برامجنا' : 'Explorer nos programmes',
    contactUs: lang === 'ar' ? 'تواصل معنا' : 'Contactez-nous',
  }), [lang]);

  const historyEvents = [
    {
      year: '1956',
      titleFr: 'Création de la première école',
      titleAr: 'إنشاء أول مدرسة',
      descriptionFr: 'Création de la première école des transmissions à l\'ouest du pays, avec des moyens matériels très limités et dans le plus grand secret.',
      descriptionAr: 'تم إنشاء أول مدرسة للمواصلات السلكية واللاسلكية سنة 1956 وذلك غرب البلاد بوسائل مادية جد محدودة وفي سرية تامة.'
    },
    {
      year: '1963',
      titleFr: 'Premier centre de formation après l\'indépendance',
      titleAr: 'أول مركز تكوين بعد الاستقلال',
      descriptionFr: 'Création du premier centre de formation au niveau de la caserne des assistantes des forces terrestres à El Mouradia.',
      descriptionAr: 'قامت فرقة شابة بإنشاء أول مركز تكوين على مستوى ثكنة المساعدين الإناث للقوات البرية بالمرادية.'
    },
    {
      year: '1968',
      titleFr: 'Premier centre officiel de formation',
      titleAr: 'أول مركز رسمي للتكوين',
      descriptionFr: 'Création du premier centre de formation en télécommunications par le décret n° 68-34.',
      descriptionAr: 'تم إحداث أول مركز تكوين في المواصلات السلكية واللاسلكية بموجب المرسوم رقم 68-34.'
    },
    {
      year: '1973',
      titleFr: 'Création de l\'École Nationale des Transmissions',
      titleAr: 'إنشاء المدرسة الوطنية للمواصلات',
      descriptionFr: 'Création et organisation de l\'école par le décret n° 73-160 du 1er octobre 1973.',
      descriptionAr: 'تم إنشاؤها وتنظيمها بمقتضى المرسوم رقم 73-160 المؤرخ في 1 أكتوبر 1973.'
    },
    {
      year: '1982',
      titleFr: 'Réorganisation de l\'École',
      titleAr: 'إعادة تنظيم المدرسة',
      descriptionFr: 'Modification de l\'organisation par le décret n° 82-186 du 22 mai 1982.',
      descriptionAr: 'عدل فيما بعد سنة 1982 بالمرسوم رقم 82-186 المؤرخ في 22 ماي سنة 1982.'
    }
  ];

  // ✨ ANIMATIONS
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-white">
      
      {/* ✨ ANIMATED BACKGROUND */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#133059]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#e8c97a]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10">
        
        {/* ✨ HERO HEADER */}
        <motion.div
          className="pt-24 pb-20 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#133059]/20 bg-[#133059]/5 backdrop-blur-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#e8c97a] animate-pulse" />
            <span className="text-[#133059] text-xs font-bold uppercase tracking-widest">
              {lang === 'ar' ? '🏫 تاريخنا' : '🏫 Notre Histoire'}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-serif font-bold text-[#133059] mb-6"
            style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
          >
            {texts.pageTitle}
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="h-1 w-24 bg-gradient-to-r from-[#e8c97a] to-[#133059] rounded-full mx-auto mb-8"
          />

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto"
          >
            {texts.pageSubtitle}
          </motion.p>
        </motion.div>

        {/* ✨ HISTORY TIMELINE */}
        <motion.div
          className="mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 mb-16"
          >
            <History className="h-8 w-8 text-[#e8c97a]" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#133059]">
              {texts.historyTitle}
            </h2>
          </motion.div>

          <motion.div
            className="relative space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#e8c97a] via-[#e8c97a]/50 to-transparent" />

            {historyEvents.map((event, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative flex gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 top-0 w-16 h-16 bg-white flex items-center justify-center border-4 border-[#e8c97a] rounded-full shadow-lg md:z-10">
                  <Clock className="w-8 h-8 text-[#133059]" />
                </div>

                {/* Content */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 ml-20 md:ml-0' : 'md:pl-12 ml-20 md:ml-0'}`}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="group bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e8c97a]/5 to-[#133059]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative">
                      {/* Year */}
                      <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#e8c97a]/30 to-[#e8c97a]/10 rounded-lg mb-4 border border-[#e8c97a]/30">
                        <span className="font-bold text-[#133059] text-lg">{event.year}</span>
                      </div>

                      {/* Title */}
                      <h3 className={`text-2xl font-bold text-[#133059] mb-3 group-hover:text-[#e8c97a] transition-colors ${lang === 'ar' ? 'text-right' : ''}`}>
                        {lang === 'ar' ? event.titleAr : event.titleFr}
                      </h3>

                      {/* Description */}
                      <p className={`text-slate-700 leading-relaxed ${lang === 'ar' ? 'text-right' : ''}`}>
                        {lang === 'ar' ? event.descriptionAr : event.descriptionFr}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ✨ MISSION & VISION */}
        <motion.div
          className="mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 mb-16"
          >
            <Award className="h-8 w-8 text-[#e8c97a]" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#133059]">
              {texts.missionVisionTitle}
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {/* MISSION */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#e8c97a]/5 to-[#133059]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-[#e8c97a]/30 to-[#e8c97a]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-7 h-7 text-[#e8c97a]" />
                </div>
                <h3 className="text-3xl font-bold text-[#133059] mb-4 group-hover:text-[#e8c97a] transition-colors">
                  {texts.missionLabel}
                </h3>
                <p className={`text-slate-700 leading-relaxed text-lg ${lang === 'ar' ? 'text-right' : ''}`}>
                  {lang === 'ar'
                    ? 'تكوين مهندسين وتقنيين ذوي كفاءة عالية في مجال الاتصالات والتكنولوجيا، قادرين على المساهمة في تطوير القطاع وتلبية احتياجات سوق العمل المتغيرة.'
                    : 'Former des ingénieurs et des techniciens hautement qualifiés dans le domaine des télécommunications et de la technologie, capables de contribuer au développement du secteur et de répondre aux besoins changeants du marché du travail.'}
                </p>
              </div>
            </motion.div>

            {/* VISION */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#e8c97a]/5 to-[#133059]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-[#e8c97a]/30 to-[#e8c97a]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-7 h-7 text-[#e8c97a]" />
                </div>
                <h3 className="text-3xl font-bold text-[#133059] mb-4 group-hover:text-[#e8c97a] transition-colors">
                  {texts.visionLabel}
                </h3>
                <p className={`text-slate-700 leading-relaxed text-lg ${lang === 'ar' ? 'text-right' : ''}`}>
                  {lang === 'ar'
                    ? 'أن نكون مؤسسة تعليمية رائدة على المستوى الوطني والإقليمي في مجال تكوين الكفاءات المتخصصة في الاتصالات والتكنولوجيا، ومركزاً للابتكار والبحث العلمي.'
                    : 'Être une institution éducative leader au niveau national et régional dans la formation de compétences spécialisées en télécommunications et technologie, et un centre d\'innovation et de recherche scientifique.'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ✨ CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="pb-20"
        >
          <div className="bg-gradient-to-r from-[#133059]/95 via-[#133059]/85 to-[#0a2342]/90 rounded-3xl p-16 md:p-20 text-white relative overflow-hidden shadow-2xl">
            {/* Background Image */}
            <img
              src="/images/ent.jpg"
              alt="Campus"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#133059]/95 via-[#133059]/85 to-[#0a2342]/90" />

            {/* Decorative orbs */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-[#e8c97a]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#e8c97a]/5 rounded-full blur-3xl" />

            {/* Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative z-10 text-center max-w-3xl mx-auto"
            >
              <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-5xl font-serif font-bold mb-6"
              >
                {texts.ctaTitle}
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-lg text-white/90 mb-10"
              >
                {texts.ctaDesc}
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#e8c97a] text-[#133059] font-bold rounded-xl hover:shadow-lg hover:shadow-[#e8c97a]/30 transition-all duration-300"
                >
                  <Link 
                                  to="/formation"
                                  >
                  {texts.explorePrograms}
                  <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#e8c97a] text-[#e8c97a] font-bold rounded-xl hover:bg-[#e8c97a]/10 transition-all duration-300"
                >
                  {texts.contactUs}
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>
    </div>
  );
};

export default AboutSchool;
