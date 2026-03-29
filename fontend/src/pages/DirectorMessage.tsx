import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Award, ArrowRight, ArrowLeft } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { getImageUrl } from '@/services/api';

// Types
interface Director {
  id: number;
  name_fr: string;
  name_ar: string;
  name_en: string;
  message_fr: string;
  message_ar: string;
  message_en: string;
  start_year: number;
  end_year: number | null;
  photo: string;
  is_current: boolean;
  order: number;
}

const DirectorMessageProfessional = () => {
  const { t, language: lang } = useLanguage();
  const [directors, setDirectors] = useState<Director[]>([]);
  const [, setLoading] = useState(true);
  const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);

  // Fetch directors from API
  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/team/directors/');
        // Handle both array response and {results: [...]} response
        const data = response.data;
        setDirectors(Array.isArray(data) ? data : data.results || []);
      } catch (error) {
        console.error('Error fetching directors:', error);
        setDirectors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDirectors();
  }, []);

  // Get current director and previous directors
  const currentDirector = directors.find(d => d.is_current);
  const previousDirectors = directors.filter(d => !d.is_current).sort((a, b) => b.order - a.order);

  // Get localized content
  const getLocalizedContent = (item: Director | undefined, field: 'name' | 'message'): string => {
    if (!item) return '';
    const langKey = lang === 'ar' ? 'ar' : lang === 'en' ? 'en' : 'fr';
    const key = `${field}_${langKey}` as keyof Director;
    const fallbackKey = `${field}_fr` as keyof Director;
    return (item[key] as string) || (item[fallbackKey] as string) || '';
  };

  const getDirectorName = (director: Director | undefined) => getLocalizedContent(director, 'name');
  const getDirectorMessage = (director: Director | undefined) => getLocalizedContent(director, 'message');

  // Placeholder for missing images
  const PLACEHOLDER = '/ent.jpg';

  // ✨ MEMOIZATION
  const texts = useMemo(() => ({
    badge: lang === 'ar' ? 'رسالة المدير' : lang === 'en' ? 'Director\'s Message' : 'Message du Directeur',
    title: lang === 'ar' ? 'رسالة من المدير ' : lang === 'en' ? 'Message from the Director ' : 'Message du Directeur ',
    valuesTitle: lang === 'ar' ? 'قيمنا الأساسية' : lang === 'en' ? 'Core Values' : 'Nos Valeurs Fondamentales',
  }), [lang]);

  // ✨ ANIMATIONS
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* ✨ MINIMAL HEADER */}
      <div className="border-b border-slate-200/60 bg-gradient-to-r from-white via-slate-50/50 to-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.p
              variants={itemVariants}
              className="text-sm font-semibold text-[#e8c97a] uppercase tracking-widest mb-4"
            >
              {texts.badge}
            </motion.p>
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl font-serif font-bold text-[#133059] mb-2"
              style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
            >
              {texts.title}
            </motion.h1>
            <motion.div
              variants={itemVariants}
              className="h-1 w-16 bg-[#e8c97a] rounded-full mx-auto mt-6"
            />
          </motion.div>
        </div>
      </div>

      {/* ✨ MAIN CONTENT */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-20">
        
        {/* Director Info + Message Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* LEFT - DIRECTOR PROFILE */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1"
          >
            <div className="sticky top-24">
              {/* Avatar */}
              <div className="relative mb-6">
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-[#e8c97a]/30">
                  <img
                    src={currentDirector?.photo ? getImageUrl(currentDirector.photo) : PLACEHOLDER}
                    alt={getDirectorName(currentDirector!) || 'Director'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              {/* Director Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="font-bold text-xl text-[#133059] mb-1 font-serif" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
                  {currentDirector ? getDirectorName(currentDirector) : (t('directorName') || 'Director Name')}
                </h3>
                <p className="text-sm text-slate-500 font-semibold uppercase tracking-widest mb-4">
                  {currentDirector?.start_year && (
                    <span>{currentDirector.start_year} - {currentDirector.end_year || (lang === 'ar' ? 'الآن' : lang === 'en' ? 'Present' : 'Maintenant')}</span>
                  )}
                </p>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#e8c97a]/10 border border-[#e8c97a]/30 rounded-lg">
                  <Award className="w-4 h-4 text-[#e8c97a]" />
                  <span className="text-xs font-semibold text-[#133059]">
                    {lang === 'ar' ? 'مدير المدرسة' : lang === 'en' ? 'School director' : 'directeur de l\'école'}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT - MESSAGE CONTENT */}
          <motion.div
            variants={itemVariants}
            className={`md:col-span-3 ${lang === 'ar' ? 'text-right' : ''}`}
          >
            <div className="space-y-6 text-slate-700 leading-relaxed">
              {/* Opening */}
              <div className="text-lg">
                <p className="font-semibold text-[#133059] mb-3">
                  {lang === 'ar'
                    ? 'السلام عليكم ورحمة الله وبركاته'
                    : lang === 'en'
                    ? 'Dear Colleagues, Students, and Friends,'
                    : 'Mesdames, Messieurs,'}
                </p>
              </div>

              {/* Main Message */}
              <div className="space-y-4">
                {currentDirector ? (
                  <p>{getDirectorMessage(currentDirector)}</p>
                ) : (
                  <>
                    <p>
                      {lang === 'ar'
                        ? 'يشرفني أن أتحدث معكم عن رؤيتنا وتطلعاتنا لمؤسستنا التعليمية. في عالم يتغير بسرعة متزايدة، نؤمن بأن التعليم الجودة والابتكار هما مفتاح النجاح.'
                        : lang === 'en'
                        ? 'It is my privilege to share with you our vision and aspirations for our educational institution. In a rapidly changing world, we firmly believe that quality education and innovation are the keys to success.'
                        : 'Il m\'est agréable de partager avec vous notre vision et nos aspirations pour notre institution éducative. Dans un monde en changement rapide, nous croyons fermement que l\'éducation de qualité et l\'innovation sont les clés du succès.'}
                    </p>

                    <p>
                      {lang === 'ar'
                        ? 'مؤسستنا مكرسة لتطوير الكوادر البشرية المؤهلة والمتميزة. نحن نعمل على بناء منهج تعليمي متطور يجمع بين النظرية والتطبيق، ويركز على تنمية المهارات العملية التي يحتاجها سوق العمل الحديث.'
                        : lang === 'en'
                        ? 'Our institution is dedicated to developing qualified and outstanding human resources. We work to build an advanced curriculum that combines theory and practice, focusing on developing the practical skills required by the modern job market.'
                        : 'Notre institution se consacre au développement de ressources humaines qualifiées et distinguées. Nous construisons un programme éducatif avancé qui combine la théorie et la pratique, en mettant l\'accent sur le développement des compétences pratiques requises par le marché du travail moderne.'}
                    </p>

                    <p>
                      {lang === 'ar'
                        ? 'نحن فخورون بإنجازات طلابنا وخريجينا. آلاف الطلاب تخرجوا من مؤسستنا وحققوا نجاحات ملموسة في مختلف القطاعات والشركات العملاقة. هذا النجاح يعكس التزامنا بالتميز والتطوير المستمر.'
                        : lang === 'en'
                        ? 'We are proud of the achievements of our students and graduates. Thousands of students have graduated from our institution and achieved remarkable success in various sectors and major companies. This success reflects our commitment to excellence and continuous improvement.'
                        : 'Nous sommes fiers des réalisations de nos étudiants et de nos diplômés. Des milliers d\'étudiants ont obtenu leur diplôme de notre institution et ont réalisé un succès remarquable dans divers secteurs et grandes entreprises. Ce succès reflète notre engagement envers l\'excellence et l\'amélioration continue.'}
                    </p>

                    <p>
                      {lang === 'ar'
                        ? 'نحن ملتزمون بالاستمرار في التطوير والابتكار، وبناء شراكات استراتيجية مع الصناعة والقطاع الخاص. هدفنا هو خلق بيئة تعليمية محفزة تشجع على الإبداع والابتكار والتعاون.'
                        : lang === 'en'
                        ? 'We are committed to continuous development and innovation, building strategic partnerships with industry and the private sector. Our goal is to create a stimulating learning environment that encourages creativity, innovation, and collaboration.'
                        : 'Nous nous engageons à poursuivre le développement et l\'innovation, en construisant des partenariats stratégiques avec l\'industrie et le secteur privé. Notre objectif est de créer un environnement éducatif stimulant qui encourage la créativité, l\'innovation et la collaboration.'}
                    </p>

                    <p>
                      {lang === 'ar'
                        ? 'شكراً لكم على ثقتكم واختياركم لمؤسستنا. معاً، سنحقق المزيد من الإنجازات والنجاحات.'
                        : lang === 'en'
                        ? 'Thank you for your trust and choice of our institution. Together, we will achieve greater accomplishments and success.'
                        : 'Merci de votre confiance et de votre choix de notre institution. Ensemble, nous réaliserons de plus grands accomplissements et succès.'}
                    </p>
                  </>
                )}
              </div>

              {/* Signature */}
              <div className="mt-12 pt-8 border-t border-slate-200/60">
                <p className="mb-3">
                  {lang === 'ar'
                    ? 'مع أطيب التمنيات'
                    : lang === 'en'
                    ? 'Warm regards,'
                    : 'Cordialement,'}
                </p>
                <div>
                  <p className="font-bold text-lg text-[#133059] font-serif mb-1" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
                    {currentDirector ? getDirectorName(currentDirector) : (t('directorName') || 'Director Name')}
                  </p>
                  <p className="text-sm text-slate-500 font-semibold uppercase tracking-widest">
                    {t('directorTitle') || 'Director General'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ✨ DIVIDER */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-24" />

        {/* ✨ PREVIOUS DIRECTORS SECTION */}
        {previousDirectors.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="mb-24"
          >
            {!selectedDirector ? (
              <>
                <motion.div
                  variants={itemVariants}
                  className="text-center mb-16"
                >
                  <p className="text-sm font-semibold text-[#e8c97a] uppercase tracking-widest mb-4">
                    {lang === 'ar' ? 'القيادات السابقة' : lang === 'en' ? 'Previous Leadership' : 'Anciens Directeurs'}
                  </p>
                  <h2 className="text-4xl font-serif font-bold text-[#133059] mb-6" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
                    {lang === 'ar' ? 'مديرونا السابقون' : lang === 'en' ? 'Our Previous Directors' : 'Nos Anciens Directeurs'}
                  </h2>
                  <div className="h-1 w-16 bg-[#e8c97a] rounded-full mx-auto" />
                </motion.div>

                {/* Previous Directors Grid */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                >
                  {previousDirectors.map((director) => (
                    <motion.div
                      key={director.id}
                      variants={itemVariants}
                      className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedDirector(director)}
                    >
                      {/* Director Photo */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#e8c97a]/30 flex-shrink-0">
                          <img
                            src={director.photo ? getImageUrl(director.photo) : PLACEHOLDER}
                            alt={getDirectorName(director)}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#133059]">
                            {getDirectorName(director)}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {director.start_year} - {director.end_year || (lang === 'ar' ? 'الآن' : lang === 'en' ? 'Present' : 'Maintenant')}
                          </p>
                        </div>
                      </div>
                      {/* Message Preview */}
                      {getDirectorMessage(director) && (
                        <p className="text-slate-600 text-sm line-clamp-3">
                          {getDirectorMessage(director)}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </>
            ) : (
              /* Detailed Director View */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Back Button */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => setSelectedDirector(null)}
                  className={`flex items-center gap-2 mb-8 px-4 py-2 text-[#133059] hover:text-[#e8c97a] transition-colors duration-300 ${
                    lang === 'ar' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-semibold">
                    {lang === 'ar' ? 'العودة' : lang === 'en' ? 'Back' : 'Retour'}
                  </span>
                </motion.button>

                {/* Director Detailed Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-lg">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Director Photo */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#e8c97a]/30 shadow-lg">
                        <img
                          src={selectedDirector.photo ? getImageUrl(selectedDirector.photo) : PLACEHOLDER}
                          alt={getDirectorName(selectedDirector)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Director Info & Message */}
                    <div className={`flex-1 ${lang === 'ar' ? 'text-right' : ''}`}>
                      <h2 className="text-3xl font-serif font-bold text-[#133059] mb-2" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
                        {getDirectorName(selectedDirector)}
                      </h2>
                      <p className="text-lg text-slate-500 font-semibold mb-6">
                        {selectedDirector.start_year} - {selectedDirector.end_year || (lang === 'ar' ? 'الآن' : lang === 'en' ? 'Present' : 'Maintenant')}
                      </p>

                      {/* Full Message */}
                      <div className="text-slate-700 leading-relaxed space-y-4">
                        {getDirectorMessage(selectedDirector) ? (
                          <div className="text-lg">
                            {getDirectorMessage(selectedDirector).split('\n\n').map((paragraph, idx) => (
                              <p key={idx} className="mb-4">{paragraph}</p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-500 italic">
                            {lang === 'ar' ? 'لا تتوفر رسالة.' : lang === 'en' ? 'No message available.' : 'Aucun message disponible.'}
                          </p>
                        )}
                      </div>

                      {/* Signature */}
                      <div className="mt-8 pt-6 border-t border-slate-200/60">
                        <p className="font-bold text-lg text-[#133059] font-serif" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
                          {getDirectorName(selectedDirector)}
                        </p>
                        <p className="text-sm text-slate-500 font-semibold uppercase tracking-widest">
                          {lang === 'ar' ? 'مدير المدرسة السابق' : lang === 'en' ? 'Former School Director' : 'Ancien Directeur de l\'École'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ✨ CORE VALUES SECTION */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold text-[#e8c97a] uppercase tracking-widest mb-4">
              {lang === 'ar' ? 'مبادؤنا الأساسية' : lang === 'en' ? 'Our Principles' : 'Nos Principes'}
            </p>
            <h2 className="text-5xl font-serif font-bold text-[#133059] mb-6" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
              {texts.valuesTitle}
            </h2>
            <div className="h-1 w-16 bg-[#e8c97a] rounded-full mx-auto" />
          </motion.div>

          {/* Values Grid - 3 Columns */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {/* Value 1 */}
            <motion.div
              variants={itemVariants}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[#e8c97a]/15 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-[#e8c97a]" />
              </div>
              <h3 className="text-2xl font-bold text-[#133059] mb-4">
                {lang === 'ar' ? 'التميز' : lang === 'en' ? 'Excellence' : 'Excellence'}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'ar'
                  ? 'نسعى لتحقيق أعلى معايير الجودة في جميع جوانب عملنا التعليمي والإداري.'
                  : lang === 'en'
                  ? 'We strive for the highest standards of quality in all aspects of our educational and administrative work.'
                  : 'Nous aspirons aux plus hauts standards de qualité dans tous les aspects de notre travail éducatif et administratif.'}
              </p>
            </motion.div>

            {/* Value 2 */}
            <motion.div
              variants={itemVariants}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[#e8c97a]/15 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#e8c97a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#133059] mb-4">
                {lang === 'ar' ? 'الابتكار' : lang === 'en' ? 'Innovation' : 'Innovation'}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'ar'
                  ? 'نشجع التفكير الإبداعي والحلول المبتكرة لتحديات القرن الحادي والعشرين.'
                  : lang === 'en'
                  ? 'We encourage creative thinking and innovative solutions to 21st century challenges.'
                  : 'Nous encourageons la pensée créative et les solutions innovantes aux défis du XXIe siècle.'}
              </p>
            </motion.div>

            {/* Value 3 */}
            <motion.div
              variants={itemVariants}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[#e8c97a]/15 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#e8c97a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#133059] mb-4">
                {lang === 'ar' ? 'المسؤولية' : lang === 'en' ? 'Responsibility' : 'Responsabilité'}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'ar'
                  ? 'نلتزم بالمسؤولية الاجتماعية والأخلاقية في جميع قراراتنا وأفعالنا.'
                  : lang === 'en'
                  ? 'We are committed to social and ethical responsibility in all our decisions and actions.'
                  : 'Nous nous engageons à la responsabilité sociale et éthique dans toutes nos décisions et actions.'}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ✨ FOOTER CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="border-t border-slate-200/60 bg-gradient-to-r from-white via-slate-50/50 to-white py-16 mt-24"
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-[#133059] mb-4">
            {lang === 'ar' ? 'هل لديك أسئلة أو استفسارات ؟' : lang === 'en' ? 'Have Questions or Inquiries?' : 'Des Questions ou des Demandes de Renseignements?'}
          </h3>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            {lang === 'ar'
              ? 'نحن هنا للإجابة على جميع استفساراتك والمساعدة في رحلتك التعليمية.'
              : lang === 'en'
              ? 'We are here to answer all your questions and assist you in your educational journey.'
              : 'Nous sommes là pour répondre à toutes vos questions et vous aider dans votre parcours éducatif.'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#133059] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span>{lang === 'ar' ? 'تواصل معنا' : lang === 'en' ? 'Contact Us' : 'Nous Contacter'}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>
    </div>
  );
};

export default DirectorMessageProfessional;
