import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  BookOpen, 
  Users, 
  CheckCircle,
  GraduationCap,
  Zap
} from "lucide-react";

const HeroSection = () => {
  const { language: lang, t } = useLanguage();

  // Stats dynamiques selon la langue
  const stats = [
    { 
      icon: <Trophy className="w-5 h-5 text-gold" />, 
      value: '15+', 
      label: lang === 'ar' ? 'سنوات الخبرة' : lang === 'en' ? 'Years of Experience' : 'Années d\'Expérience' 
    },
    { 
      icon: <Users className="w-5 h-5 text-gold" />, 
      value: '5000+', 
      label: lang === 'ar' ? 'متعلم' : lang === 'en' ? 'Learners Trained' : 'Apprenants Formés' 
    },
    { 
      icon: <CheckCircle className="w-5 h-5 text-gold" />, 
      value: '98%', 
      label: lang === 'ar' ? 'معدل الرضا' : lang === 'en' ? 'Satisfaction Rate' : 'Taux de Satisfaction' 
    },
    { 
      icon: <BookOpen className="w-5 h-5 text-gold" />, 
      value: '20+', 
      label: lang === 'ar' ? 'مقرر تدريبي' : lang === 'en' ? 'Training Courses' : 'Cours de Formation' 
    },
  ];

  // Variants d'animation réutilisables
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.3, duration: 0.8 },
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

      {/* Ligne décorée en haut */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue via-gold to-blue opacity-30" />

      {/* HERO MAIN CONTENT */}
      <section className="relative z-10 py-16 lg:py-24 px-6 md:px-10 max-w-[1400px] mx-auto">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* LEFT CONTENT */}
          <motion.div variants={itemVariants} className="space-y-8">
            
            {/* Badge animé */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue/20 bg-blue/5 backdrop-blur-sm hover:bg-blue/10 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-gold animate-pulse" />
              <span className="text-blue text-xs font-bold uppercase tracking-widest">
                {lang === 'ar' ? '🎓 مركز التميز التعليمي' : lang === 'en' ? '🎓 Center of Learning Excellence' : '🎓 Centre d\'Excellence Éducative'}
              </span>
            </motion.div>

            {/* Titre principal */}
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-blue leading-[1.15] mb-6">
                {lang === 'ar' 
                  ? 'تعليم عالي الجودة للمستقبل الأفضل' 
                  : lang === 'en' 
                    ? 'Transform Your Future Through Quality Education' 
                    : 'Transformez Votre Avenir par une Éducation de Qualité'}
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-gold to-blue rounded-full" />
            </motion.div>

            {/* Sous-titre */}
            <motion.p
              variants={itemVariants}
              className="text-slate-600 text-lg md:text-xl max-w-xl leading-relaxed"
            >
              {lang === 'ar' 
                ? 'اكتشف برامج تدريبية متخصصة وشاملة مصممة لتطوير مهاراتك والارتقاء بمسارك المهني.'
                : lang === 'en'
                  ? 'Discover specialized and comprehensive training programs designed to develop your skills and advance your career path.'
                  : 'Découvrez des programmes de formation spécialisés et complets conçus pour développer vos compétences et progresser dans votre carrière.'}
            </motion.p>

            {/* Boutons CTA */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link 
                to="/formation"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue text-white font-bold text-sm hover:bg-blue-dark transition-all duration-300 shadow-lg hover:shadow-blue/30 hover:scale-105 active:scale-95"
              >
                <GraduationCap className="w-5 h-5" />
                {t('exploreButton') || (lang === 'en' ? 'Explore Courses' : lang === 'ar' ? 'استكشف البرامج' : 'Explorer les Cours')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/about"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-blue/30 text-blue font-bold text-sm hover:border-blue hover:bg-blue/5 transition-all duration-300"
              >
                <Zap className="w-4 h-4" />
                {t('learnMoreButton') || (lang === 'en' ? 'Learn More' : lang === 'ar' ? 'اعرف المزيد' : 'En Savoir Plus')}
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-6 pt-4 border-t border-slate-200"
            >
              <div>
                <p className="text-[#e8c97a] font-bold text-sm uppercase tracking-widest">
                  {lang === 'ar' ? 'معتمد دوليًا' : lang === 'en' ? 'Internationally Certified' : 'Certifié Internationalement'}
                </p>
                <p className="text-slate-500 text-xs">{lang === 'ar' ? 'برامج معتمدة' : lang === 'en' ? 'Certified Programs' : 'Programmes Certifiés'}</p>
              </div>
              <div>
                <p className="text-[#e8c97a] font-bold text-sm uppercase tracking-widest">
                  {lang === 'ar' ? 'دعم 24/7' : lang === 'en' ? '24/7 Support' : 'Support 24/7'}
                </p>
                <p className="text-slate-500 text-xs">{lang === 'ar' ? 'فريق متخصص' : lang === 'en' ? 'Expert Team' : 'Équipe d\'experts'}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT VISUAL */}
          <motion.div
            variants={imageVariants}
            className="relative"
          >
            {/* Image Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[4/3] lg:aspect-auto lg:h-[500px] group">
              <img
                src="/images/ent.jpg"
                alt="Education and Learning"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-2000 ease-out"
              />
              {/* Overlay avec gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#133059]/50 via-[#133059]/20 to-transparent" />
              
              {/* Badge flottant sur l'image */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                <span className="text-blue font-bold text-sm">
                  {lang === 'ar' ? 'تعليم متميــز' : lang === 'en' ? 'Quality education' : 'Enseignement d\'excellence '}
                </span>
              </motion.div>
            </div>

            {/* Floating Glass Card - Certification */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              whileHover={{ y: -5 }}
              className="absolute -bottom-6 -left-4 md:-left-12 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/40 max-w-[280px] hidden md:flex items-center gap-4 hover:shadow-[#133059]/20 transition-shadow"
            >
              <div className="bg-gradient-to-br from-[#133059] to-[#0a2342] p-3 rounded-xl shadow-lg">
                <CheckCircle className="w-6 h-6 text-[#e8c97a]" />
              </div>
              <div>
                <p className="text-[#133059] font-bold text-sm uppercase tracking-tight">
                  {lang === 'ar' ? 'شهادات معترف بها' : 'Certificats Reconnus'}
                </p>
                <p className="text-slate-500 text-xs uppercase font-medium mt-1">
                  {lang === 'ar' ? 'على الصعيد الوطني والدولي' : 'National & International'}
                </p>
              </div>
            </motion.div>

            {/* Decorative circle accent */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#e8c97a]/5 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS BAR - Floating Style */}
      <motion.div 
        className="relative z-20 px-6 md:px-10 -mt-8 mb-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div 
          className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(19,48,89,0.12)] border border-blue/10 p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          style={{ maxWidth: 1400, margin: '0 auto' }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center px-2 lg:px-4 group cursor-pointer"
            >
              <motion.div 
                className="mb-3 bg-gradient-to-br from-blue/5 to-gold/5 p-3 rounded-lg group-hover:from-blue/10 group-hover:to-gold/10 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                {stat.icon}
              </motion.div>
              <motion.span 
                className="text-3xl lg:text-4xl font-bold text-blue mb-2"
                whileHover={{ scale: 1.1 }}
              >
                {stat.value}
              </motion.span>
              <span className="text-xs lg:text-sm font-semibold text-slate-500 uppercase tracking-widest leading-tight">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/30 rounded-full blur-3xl pointer-events-none opacity-30" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue/20 rounded-full blur-3xl pointer-events-none opacity-20" />
    </div>
  );
};

export default HeroSection;
