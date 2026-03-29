 import React, { useMemo, useCallback, useState, useEffect, SyntheticEvent } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Award, Sparkles} from 'lucide-react';
import axios from 'axios';
//import { getImageUrl } from '@/services/api';

const API_BASE = 'http://localhost:8000';

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

const DirectorSection: React.FC = () => {
  const { t, language: lang } = useLanguage();
  const [currentDirector, setCurrentDirector] = useState<Director | null>(null);

  useEffect(() => {
    const fetchDirector = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/team/directors/`);
        const data = response.data;
        const directors: Director[] = Array.isArray(data) ? data : data.results || [];
        const current = directors.find(d => d.is_current) || directors[0] || null;
        setCurrentDirector(current);
      } catch (error) {
        console.error('Error fetching director:', error);
      }
    };
    fetchDirector();
  }, []);

  const getDirectorName = (director: Director | null): string => {
    if (!director) return t('directorName') || 'Director Name';
    const langKey = lang === 'ar' ? 'ar' : lang === 'en' ? 'en' : 'fr';
    const key = `name_${langKey}` as keyof Director;
    return (director[key] as string) || director.name_fr || '';
  };

  // Build full image URL using the production server
  const getDirectorImageUrl = (photo: string | undefined): string => {
    if (!photo) return '/ent.jpg';
    if (photo.startsWith('http')) return photo;
    // Replace any localhost reference with the real server
    const cleaned = photo.replace(/https?:\/\/localhost(:\d+)?/, API_BASE);
    // If it's a relative path, prefix with API_BASE
    if (cleaned.startsWith('/')) return `${API_BASE}${cleaned}`;
    return `${API_BASE}/${cleaned}`;
  };

  const PLACEHOLDER = '/ent.jpg';

  const handleImageError = useCallback((e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = PLACEHOLDER;
  }, []);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }), []);

  const texts = useMemo(() => ({
    badge: lang === 'ar' ? '💬 رسالة المدير' : lang === 'en' ? '💬 Director\'s Message' : '💬 Message du Directeur',
    title: lang === 'ar'
      ? 'قيادة تعليمية مميزة'
      : lang === 'en'
      ? 'Visionary Educational Leadership'
      : 'Une Direction Éducative Visionnaire',
    subtitle: lang === 'ar'
      ? 'اكتشف رؤية المدير والقيادة الاستراتيجية لمستقبل التعليم'
      : lang === 'en'
      ? 'Discover the Director\'s vision and strategic leadership for the future of education'
      : 'Découvrez la vision du Directeur et le leadership stratégique pour l\'avenir de l\'éducation',
    quoteDefault: lang === 'ar'
      ? 'التعليم هو الأساس الحقيقي لبناء مستقبل مزدهر وتنمية مستدامة'
      : 'L\'éducation est la fondation véritable pour construire un avenir prospère',
    recognized: lang === 'ar' ? 'معترف به دوليًا' : lang === 'en' ? 'Internationally Recognized' : 'Reconnu Internationalement',
    recognizedDesc: lang === 'ar'
      ? 'قيادة معترف بها في التعليم والتنمية المهنية'
      : lang === 'en'
      ? 'Recognized leader in education and professional development'
      : 'Leader reconnu dans l\'éducation et le développement professionnel',
    consultation: lang === 'ar' ? 'متاح للاستشارة' : lang === 'en' ? 'Available for consultation' : 'Disponible pour consultation',
  }), [lang]);

  const directorImageSrc = currentDirector?.photo
    ? getDirectorImageUrl(currentDirector.photo)
    : PLACEHOLDER;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-white to-slate-50">

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#133059]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#e8c97a]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#133059]/20 bg-[#133059]/5 backdrop-blur-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#e8c97a] animate-pulse" />
            <span className="text-[#133059] text-xs font-bold uppercase tracking-widest">
              {texts.badge}
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#133059] mb-6"
          >
            {texts.title}
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="h-1 w-20 bg-gradient-to-r from-[#e8c97a] to-[#133059] rounded-full mx-auto mb-6"
          />

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto"
          >
            {texts.subtitle}
          </motion.p>
        </motion.div>

        {/* Main content grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* LEFT — Director Image */}
          <motion.div
            variants={itemVariants}
            className="lg:order-first"
            whileHover={{ y: -6 }}
          >
            <div className="w-[70%] mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/60 group">

              {/*
                FIX 1 — removed fixed h-[280px] cap.
                The image now dictates height naturally so the full
                portrait is always visible. aspect-[3/4] gives a
                consistent tall portrait ratio on all screen sizes.
              */}
              <div className="relative w-full h-[420px] bg-gradient-to-br from-[#133059]/10 to-[#e8c97a]/10 overflow-hidden">
                <img
                  src={directorImageSrc}
                  alt={getDirectorName(currentDirector)}
                  className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                  onError={handleImageError}
                />

                {/* Gradient overlay — only bottom 40% so face is never covered */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#133059]/70 via-[#133059]/10 to-transparent" />
              </div>

              {/* Info overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p
                  className="font-bold text-xl text-white font-serif mb-1"
                  style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
                >
                  {getDirectorName(currentDirector)}
                </p>
                <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-3">
                  {t('directorTitle') || 'Director'}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#e8c97a]/20 rounded-full border border-[#e8c97a]/30">
                  <Award className="w-3 h-3 text-[#e8c97a]" />
                  <span className="text-xs text-white font-semibold">{texts.consultation}</span>
                </div>
              </div>
            </div>
            </div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="lg:order-last"
          >
            <motion.div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-5xl text-[#e8c97a] leading-none">"</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#133059] mb-4 leading-tight">
                {t('directorQuoteText') || texts.quoteDefault}
              </h3>
            </motion.div>

            <motion.div className="space-y-3 mb-6 text-slate-700 leading-relaxed text-sm md:text-base">
              <p>
                {lang === 'ar'
                  ? 'الهدف من مؤسستنا هو تدريب الجيل القادم من المتخصصين في مجالات التكنولوجيا والابتكار. نحن نؤمن بأن المستقبل يتشكل من خلال الأفراد الذين يمتلكون المهارات والقيم اللازمة للنجاح.'
                  : lang === 'en'
                  ? 'Our institution\'s goal is to train the next generation of technology and innovation specialists. We believe that the future is shaped by individuals who possess the skills and values necessary to succeed.'
                  : 'L\'objectif de notre institution est de former la prochaine génération de spécialistes en technologie et innovation. Nous croyons que l\'avenir est façonné par des individus qui possèdent les compétences et les valeurs nécessaires au succès.'}
              </p>
              <p>
                {lang === 'ar'
                  ? 'من خلال برامجنا، نأتي بآلاف الخريجين الناجحين إلى سوق العمل. يثبت التزامنا بالتميز أن النجاح لا يتحدد بالشهادة وحدها، بل بالقدرة على التعلم والابتكار والقيادة بمسؤولية.'
                  : lang === 'en'
                  ? 'Through our programs, we bring thousands of successful graduates to the job market. Our commitment to excellence demonstrates that success is not determined solely by credentials, but by the ability to learn, innovate, and lead responsibly.'
                  : 'Grâce à nos programmes, nous ammenons des milliers de diplômés réussis sur le marché du travail. Notre engagement envers l\'excellence démontre que la réussite n\'est pas déterminée uniquement par les diplômes, mais par la capacité à apprendre, innover et diriger avec responsabilité.'}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        .group-hover\\:scale-105 { will-change: transform; }
      `}</style>
    </section>
  );
};

export default DirectorSection;
