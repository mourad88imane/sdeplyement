import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { Award, Target, Lightbulb, Heart, ArrowRight, Users, BookOpen, Star, GraduationCap } from 'lucide-react';
import { useMemo } from 'react';

const About = () => {
  const { language: lang } = useLanguage();

  // ✨ MEMOIZATION
  const texts = useMemo(() => ({
    pageTitle: lang === 'ar' ? 'من نحن' : lang === 'en' ? 'About Us' : 'À Propos de Nous',
    badge: lang === 'ar' ? 'معلومات عنا' : lang === 'en' ? 'Our Story' : 'Notre Histoire',
    ourStoryTitle: lang === 'ar' ? 'قصتنا' : lang === 'en' ? 'Our Story' : 'Notre Histoire',
    missionTitle: lang === 'ar' ? 'مهمتنا' : lang === 'en' ? 'Our Mission' : 'Notre Mission',
    visionTitle: lang === 'ar' ? 'رؤيتنا' : lang === 'en' ? 'Our Vision' : 'Notre Vision',
    valuesTitle: lang === 'ar' ? 'قيمنا الأساسية' : lang === 'en' ? 'Core Values' : 'Nos Valeurs Fondamentales',
    leadershipTitle: lang === 'ar' ? 'فريق القيادة' : lang === 'en' ? 'Leadership Team' : 'Équipe de Direction',
    leadershipSubtitle: lang === 'ar' ? 'خبراء ملتزمون بتميزكم' : lang === 'en' ? 'Experts committed to your excellence' : 'Des experts engagés pour votre excellence',
  }), [lang]);

  // ✨ ANIMATIONS
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
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

  const scaleVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  // ✨ TEAM LEADERS DATA
  const teamLeaders = useMemo(() => [
    {
      name: 'M. A.Bediar',
      role: lang === 'ar' ? 'مدير المدرسة' : lang === 'en' ? 'School Director' : "Directeur de l'école",
      // Replace the src below with the actual photo path, e.g. "/images/leaders/bediar.jpg"
      image: '/images/leader/directeur.jpg',
      fallbackInitials: 'AB',
    },
    {
      name: 'M. H.Djerbou',
      role: lang === 'ar' ? 'مدير الدراسات و التربصات' : lang === 'en' ? 'Studies and Stages Director' : 'Directeur des études et stages',
      // Replace the src below with the actual photo path, e.g. "/images/leaders/djerbou.jpg"
      image: '/images/leader/d-e-s.jpg',
      fallbackInitials: 'HD',
    },
    {
      name: 'Ms. L.Bennour',
      role: lang === 'ar' ? 'الأمينة العامة' : lang === 'en' ? 'General Secretary' : 'Secrétaire général',
      // Replace the src below with the actual photo path, e.g. "/images/leaders/bennour.jpg"
      image: '/images/leaders/bennour.jpg',
      fallbackInitials: 'LB',
    },
  ], [lang]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-white">

      {/* ✨ ANIMATED BACKGROUND */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#133059]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#e8c97a]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#133059]/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#133059]/15 bg-white/60 backdrop-blur-md shadow-sm mb-8"
          >
            <BookOpen className="w-4 h-4 text-[#e8c97a]" />
            <span className="text-[#133059] text-xs font-bold uppercase tracking-[0.2em]">
              {texts.badge}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-serif font-bold text-[#133059] mb-8 leading-tight"
            style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
          >
            {texts.pageTitle}
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-3"
          >
            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#e8c97a] rounded-full" />
            <Star className="w-4 h-4 text-[#e8c97a] fill-[#e8c97a]" />
            <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#e8c97a] rounded-full" />
          </motion.div>
        </motion.div>

        {/* ✨ STORY SECTION */}
        <motion.div
          className="mb-28"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* LEFT - CONTENT */}
            <motion.div
              variants={itemVariants}
              className="lg:order-first"
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-[2px] w-8 bg-[#e8c97a] rounded-full" />
                <span className="text-[#e8c97a] text-xs font-bold uppercase tracking-[0.2em]">
                  {lang === 'ar' ? 'اكتشف' : lang === 'en' ? 'Discover' : 'Découvrir'}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#133059] mb-8" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
                {texts.ourStoryTitle}
              </h2>
              <div className="space-y-5 text-slate-600 leading-[1.8] text-[16px]">
                <p>
                  {lang === 'ar'
                    ? 'تأسست مؤسستنا برؤية واضحة: تقديم تعليم عالي الجودة يجمع بين النظرية والتطبيق العملي.'
                    : lang === 'en'
                    ? 'Our institution was founded with a clear vision: to provide high-quality education that combines theory and practical application.'
                    : 'Notre institution a été fondée avec une vision claire : fournir une éducation de haute qualité qui allie théorie et application pratique.'}
                </p>
                <p>
                  {lang === 'ar'
                    ? 'على مدى السنوات، تطورنا ليصبح مركزاً رائداً للتعليم التقني والابتكار، مع التزام ثابت بتطوير قادة ومبتكرين للمستقبل.'
                    : lang === 'en'
                    ? 'Over the years, we have evolved to become a leading center for technical education and innovation, with a steadfast commitment to developing tomorrow\'s leaders and innovators.'
                    : 'Au fil des années, nous avons évolué pour devenir un centre de premier plan pour l\'éducation technique et l\'innovation, avec un engagement inébranlable envers le développement des leaders et innovateurs de demain.'}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-10"
              >
                <Link
                  to="/about/School"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#133059] to-[#1a4a7a] text-white font-bold rounded-xl shadow-lg shadow-[#133059]/20 hover:shadow-xl hover:shadow-[#133059]/30 transition-all duration-300 group"
                >
                  {lang === 'ar' ? 'اعرف المزيد' : lang === 'en' ? 'Learn More' : 'En savoir plus'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT - IMAGE */}
            <motion.div
              variants={scaleVariants}
              className="lg:order-last"
              whileHover={{ y: -6 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#133059]/15 border border-white/50">
                <img
                  src="/images/ent.jpg"
                  alt="Campus"
                  className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#133059]/40 via-[#133059]/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-white/90">
                    <GraduationCap className="w-5 h-5" />
                    <span className="text-sm font-medium tracking-wide">
                      {lang === 'ar' ? 'حرم المدرسة' : lang === 'en' ? 'Our Campus' : 'Notre Campus'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ✨ MISSION & VISION */}
        <motion.div
          className="mb-28"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-[2px] w-8 bg-[#e8c97a] rounded-full" />
              <span className="text-[#e8c97a] text-xs font-bold uppercase tracking-[0.2em]">
                {lang === 'ar' ? 'أهدافنا' : lang === 'en' ? 'Our Goals' : 'Nos Objectifs'}
              </span>
              <div className="h-[2px] w-8 bg-[#e8c97a] rounded-full" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#133059] mb-4" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
              {lang === 'ar' ? 'رؤيتنا و مهمتنا' : lang === 'en' ? 'Vision & Mission' : 'Vision & Mission'}
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#e8c97a] rounded-full" />
              <Star className="w-3 h-3 text-[#e8c97a] fill-[#e8c97a]" />
              <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#e8c97a] rounded-full" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* MISSION */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.01 }}
              className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-10 shadow-lg hover:shadow-2xl hover:shadow-[#133059]/10 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e8c97a] via-[#133059] to-[#e8c97a] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#e8c97a]/5 to-[#133059]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#e8c97a]/25 to-[#e8c97a]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm">
                  <Target className="w-8 h-8 text-[#e8c97a]" />
                </div>
                <h3 className="text-3xl font-bold text-[#133059] mb-5 group-hover:text-[#e8c97a] transition-colors duration-300" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
                  {texts.missionTitle}
                </h3>
                <p className="text-slate-600 leading-[1.8] text-[16px]">
                  {lang === 'ar'
                    ? 'تمكين الأفراد من خلال تعليم عملي وابتكاري يطورهم ليصبحوا محترفين مؤهلين وقادة متميزين في مجالاتهم.'
                    : lang === 'en'
                    ? 'To empower individuals through practical and innovative education that develops them into qualified professionals and distinguished leaders in their fields.'
                    : 'Autonomiser les individus par une éducation pratique et innovante qui les développe en professionnels qualifiés et en leaders distingués dans leurs domaines.'}
                </p>
              </div>
            </motion.div>

            {/* VISION */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.01 }}
              className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-10 shadow-lg hover:shadow-2xl hover:shadow-[#133059]/10 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#133059] via-[#e8c97a] to-[#133059] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#133059]/5 to-[#e8c97a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#e8c97a]/25 to-[#e8c97a]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-sm">
                  <Lightbulb className="w-8 h-8 text-[#e8c97a]" />
                </div>
                <h3 className="text-3xl font-bold text-[#133059] mb-5 group-hover:text-[#e8c97a] transition-colors duration-300" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
                  {texts.visionTitle}
                </h3>
                <p className="text-slate-600 leading-[1.8] text-[16px]">
                  {lang === 'ar'
                    ? 'أن نكون مؤسسة تعليمية عالمية رائدة تشكل مستقبل التكنولوجيا والابتكار من خلال برامج متميزة وشراكات استراتيجية.'
                    : lang === 'en'
                    ? 'To be a leading global educational institution that shapes the future of technology and innovation through outstanding programs and strategic partnerships.'
                    : 'Être une institution éducative mondiale de premier plan qui façonne l\'avenir de la technologie et de l\'innovation par des programmes exceptionnels et des partenariats stratégiques.'}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ✨ CORE VALUES */}
        <motion.div
          className="mb-28"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-[2px] w-8 bg-[#e8c97a] rounded-full" />
              <span className="text-[#e8c97a] text-xs font-bold uppercase tracking-[0.2em]">
                {lang === 'ar' ? 'ما نؤمن به' : lang === 'en' ? 'What We Believe' : 'Ce Que Nous Croyons'}
              </span>
              <div className="h-[2px] w-8 bg-[#e8c97a] rounded-full" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#133059] mb-4" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
              {texts.valuesTitle}
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#e8c97a] rounded-full" />
              <Star className="w-3 h-3 text-[#e8c97a] fill-[#e8c97a]" />
              <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#e8c97a] rounded-full" />
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {/* Excellence */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:shadow-[#133059]/10 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e8c97a] to-[#133059] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="w-14 h-14 bg-gradient-to-br from-[#e8c97a]/25 to-[#e8c97a]/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                <Award className="w-7 h-7 text-[#e8c97a]" />
              </div>
              <h3 className="text-xl font-bold text-[#133059] mb-3 group-hover:text-[#e8c97a] transition-colors duration-300">
                {lang === 'ar' ? 'التميز' : lang === 'en' ? 'Excellence' : 'Excellence'}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {lang === 'ar'
                  ? 'السعي المستمر لأعلى معايير الجودة في كل جوانب عملنا'
                  : lang === 'en'
                  ? 'Continuous pursuit of the highest quality standards in all aspects of our work'
                  : 'Poursuite continue des normes de qualité les plus élevées dans tous les aspects de notre travail'}
              </p>
            </motion.div>

            {/* Innovation */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:shadow-[#133059]/10 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#133059] to-[#e8c97a] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="w-14 h-14 bg-gradient-to-br from-[#e8c97a]/25 to-[#e8c97a]/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                <Lightbulb className="w-7 h-7 text-[#e8c97a]" />
              </div>
              <h3 className="text-xl font-bold text-[#133059] mb-3 group-hover:text-[#e8c97a] transition-colors duration-300">
                {lang === 'ar' ? 'الابتكار' : lang === 'en' ? 'Innovation' : 'Innovation'}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {lang === 'ar'
                  ? 'تشجيع الإبداع والتفكير الحر لحل المشاكل المعقدة'
                  : lang === 'en'
                  ? 'Encourage creativity and free thinking to solve complex problems'
                  : 'Encourager la créativité et la pensée libre pour résoudre les problèmes complexes'}
              </p>
            </motion.div>

            {/* Integrity */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:shadow-[#133059]/10 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e8c97a] to-[#133059] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="w-14 h-14 bg-gradient-to-br from-[#e8c97a]/25 to-[#e8c97a]/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                <Heart className="w-7 h-7 text-[#e8c97a]" />
              </div>
              <h3 className="text-xl font-bold text-[#133059] mb-3 group-hover:text-[#e8c97a] transition-colors duration-300">
                {lang === 'ar' ? 'النزاهة' : lang === 'en' ? 'Integrity' : 'Intégrité'}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {lang === 'ar'
                  ? 'الالتزام بالأخلاقيات والمسؤولية في جميع التعاملات'
                  : lang === 'en'
                  ? 'Commitment to ethics and responsibility in all interactions'
                  : 'Engagement envers l\'éthique et la responsabilité dans toutes les interactions'}
              </p>
            </motion.div>

            {/* Collaboration */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:shadow-[#133059]/10 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#133059] to-[#e8c97a] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="w-14 h-14 bg-gradient-to-br from-[#e8c97a]/25 to-[#e8c97a]/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                <Users className="w-7 h-7 text-[#e8c97a]" />
              </div>
              <h3 className="text-xl font-bold text-[#133059] mb-3 group-hover:text-[#e8c97a] transition-colors duration-300">
                {lang === 'ar' ? 'التعاون' : lang === 'en' ? 'Collaboration' : 'Collaboration'}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {lang === 'ar'
                  ? 'العمل معاً كفريق واحد لتحقيق أهداف مشتركة'
                  : lang === 'en'
                  ? 'Working together as one team to achieve shared goals'
                  : 'Travailler ensemble en tant que seule équipe pour atteindre des objectifs partagés'}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ✨ LEADERSHIP TEAM */}
        <motion.div
          className="pb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-[2px] w-8 bg-[#e8c97a] rounded-full" />
              <span className="text-[#e8c97a] text-xs font-bold uppercase tracking-[0.2em]">
                {lang === 'ar' ? 'قادتنا' : lang === 'en' ? 'Our Leaders' : 'Nos Leaders'}
              </span>
              <div className="h-[2px] w-8 bg-[#e8c97a] rounded-full" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#133059] mb-4" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
              {texts.leadershipTitle}
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              {texts.leadershipSubtitle}
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#e8c97a] rounded-full" />
              <Star className="w-3 h-3 text-[#e8c97a] fill-[#e8c97a]" />
              <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#e8c97a] rounded-full" />
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {teamLeaders.map((member, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -12 }}
                className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#133059]/15 transition-all duration-500"
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e8c97a] via-[#133059] to-[#e8c97a] z-10" />

                {/* Image area */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      // Fallback: hide broken image and show initials
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Fallback initials avatar (hidden by default, shown on image error) */}
                  <div
                    className="w-full h-full items-center justify-center bg-gradient-to-br from-[#133059] to-[#1a4a7a]"
                    style={{ display: 'none' }}
                  >
                    <span className="text-6xl font-bold text-[#e8c97a]/80 select-none" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
                      {member.fallbackInitials}
                    </span>
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#133059]/70 via-[#133059]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Decorative corner accents */}
                  <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-[#e8c97a]/50 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-[#e8c97a]/50 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content area */}
                <div className="relative p-7 text-center">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-[#e8c97a] to-[#d4b054] rounded-full flex items-center justify-center shadow-lg shadow-[#e8c97a]/30">
                    <Star className="w-4 h-4 text-white fill-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#133059] mt-3 mb-2 group-hover:text-[#1a4a7a] transition-colors duration-300" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
                    {member.name}
                  </h3>
                  <div className="inline-block px-4 py-1.5 bg-[#133059]/5 rounded-full">
                    <p className="text-[#e8c97a] font-semibold text-xs uppercase tracking-[0.15em]">
                      {member.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>
    </div>
  );
};

export default About;
