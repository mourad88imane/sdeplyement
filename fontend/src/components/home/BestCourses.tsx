import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Users, ArrowRight, Sparkles,
  Zap, Award, TrendingUp, Eye, Loader2
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getImageUrl } from '@/services/api';
import axios from 'axios';
import { Link } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Course {
  id: number;
  title_fr: string;
  title_ar: string;
  title_en: string; // Added English title
  description_fr: string;
  description_ar: string;
  description_en: string; // Added English description
  label: string;
  image: string;
  category_name_fr: string;
  category_name_ar: string;
  category_name_en: string; // Added English category name
  level_display_fr: string;
  level_display_ar: string;
  level_display_en: string; // Added English level display
  grade: string;
  grade_display_fr: string;
  grade_display_ar: string;
  grade_display_en: string; // Added English grade display
  views_count: number;
  instructor_count: number;
  module_count: number;
  enrollment_count: number;
  start_date: string;
  end_date: string;
  featured: boolean;
}

// ─── Design tokens — identical to Bibliothèque ───────────────────────────────
// Primary: #133059 | Accent: #e8c97a | BG: white→#133059/2→#e8c97a/5

// ─── Animation variants (same as Bibliothèque) ───────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const fadeIn = { initial: { opacity: 0 }, animate: { opacity: 1 } };
const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

// Shared BG — mirrors Bibliothèque BG_GRADIENT exactly
const BG_GRADIENT = 'min-h-screen pt-24 pb-16 bg-gradient-to-br from-white via-[#133059]/2 to-[#e8c97a]/5';

// ─── Placeholder SVG ──────────────────────────────────────────────────────────
const PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250'>
    <rect width='100%' height='100%' fill='#f1f5f9'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
      font-family='sans-serif' font-size='14' fill='#94a3b8'>Aucune image</text>
  </svg>`
);

// ─── Background Decorations — same as Bibliothèque ───────────────────────────
const BackgroundDecorations = memo(() => (
  <>
    <motion.div
      className="absolute -top-40 -left-40 w-80 h-80 bg-[#e8c97a]/20 rounded-full blur-3xl pointer-events-none"
      animate={{ y: [0, 30, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#133059]/15 rounded-full blur-3xl pointer-events-none"
      animate={{ y: [0, -30, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#133059]/10 rounded-full blur-3xl pointer-events-none"
      animate={{ x: [0, 40, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    />
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#133059]/30 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8c97a]/20 to-transparent" />
  </>
));
BackgroundDecorations.displayName = 'BackgroundDecorations';

// ─── Loading State — mirrors Bibliothèque ────────────────────────────────────
const LoadingState = memo(({ language }: { language: string }) => (
  <div className={`${BG_GRADIENT} flex items-center justify-center`}>
    <motion.div {...fadeIn} className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="mb-4 inline-block"
      >
        <Loader2 className="h-8 w-8 text-[#133059]" />
      </motion.div>
      <p className="text-[#133059]/70 font-medium">
        {language === 'ar' ? 'جاري تحميل البرامج...' : language === 'en' ? 'Loading courses...' : 'Chargement des programmes...'}
      </p>
    </motion.div>
  </div>
));
LoadingState.displayName = 'LoadingState';

// ─── Empty State — mirrors Bibliothèque ──────────────────────────────────────
const EmptyState = memo(({ language }: { language: string }) => (
  <motion.div {...fadeInUp} className="text-center py-20">
    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#133059]/5 mb-6">
      <BookOpen className="h-10 w-10 text-[#133059]/40" />
    </div>
    <h3 className="text-2xl font-bold text-[#133059] mb-3">
      {language === 'ar' ? 'لم يتم العثور على برامج' : language === 'en' ? 'No courses found' : 'Aucun programme trouvé'}
    </h3>
    <p className="text-[#133059]/60 max-w-md mx-auto">
      {language === 'ar'
        ? 'حاول استكشاف فئات مختلفة'
        : language === 'en'
          ? 'Try exploring different categories'
          : "Essayez d'explorer d'autres catégories"}
    </p>
  </motion.div>
));
EmptyState.displayName = 'EmptyState';

// ─── Course Card — structurally mirrors BookCard from Bibliothèque ────────────
interface CourseCardProps {
  course: Course;
  language: string;
  getImgSrc: (img?: string) => string;
  getLocalizedContent: (item: any, field: string) => string;
}

const CourseCard = memo(({ course, language, getImgSrc, getLocalizedContent }: CourseCardProps) => {
  const isAr = language === 'ar';
  const isEn = language === 'en';
  const title        = getLocalizedContent(course, 'title');
  const description  = getLocalizedContent(course, 'description');
  const catName      = getLocalizedContent(course, 'category_name');
  const levelDisplay = getLocalizedContent(course, 'level_display');
  const gradeDisplay = getLocalizedContent(course, 'grade_display');

  return (
    <motion.div variants={itemVariants} className="h-full">
      <div className="h-full flex flex-col border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl group">

        {/* ── Cover image ── */}
        <div className="relative h-52 overflow-hidden bg-slate-100 flex-shrink-0">
          <motion.img
            src={getImgSrc(course.image)}
            alt={title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
          />

          {/* Label + Featured — top left (mirrors featured/new badges) */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {course.label && (
              <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#e8c97a] text-[#133059] shadow-md">
                {course.label}
              </span>
            )}
            {course.featured && (
              <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-black bg-[#133059] text-white shadow-md">
                ⭐ {isAr ? 'مميز' : isEn ? 'Featured' : 'Vedette'}
              </span>
            )}
          </div>

          {/* Grade badge — bottom right */}
          {gradeDisplay && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#133059]/90 backdrop-blur-sm border border-[#e8c97a]/50 text-[10px] font-semibold text-white shadow-sm">
              <BookOpen className="w-3 h-3 text-[#e8c97a]" />
              {gradeDisplay}
            </div>
          )}
        </div>

        {/* ── Card body ── */}
        <div className="flex flex-col flex-1 p-4">

          {/* Meta rows — mirrors BookCard "By:" / "Category:" rows */}
          <div className="space-y-1.5 mb-3 pb-3 border-b border-slate-100">
            {catName && (
              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-700">{isAr ? 'الفئة:' : isEn ? 'Category:' : 'Catégorie:'}</span>{' '}
                {catName}
              </div>
            )}
            {levelDisplay && (
              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-700">{isAr ? 'المستوى:' : isEn ? 'Level:' : 'Niveau:'}</span>{' '}
                {levelDisplay}
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-[#133059] text-base line-clamp-2 leading-tight mb-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed flex-grow">
            {description}
          </p>

          {/* Stats row — mirrors BookCard stats row exactly */}
          <div className="flex items-center justify-between py-3 border-y border-slate-100 mb-3 text-xs">
            <div className="flex items-center gap-3">
              {course.instructor_count > 0 && (
                <div className="flex items-center gap-1 text-slate-500">
                  <Users className="h-3.5 w-3.5" />
                  <span>{course.instructor_count} {isAr ? 'مدرب' : isEn ? 'Instructors' : 'Form.'}</span>
                </div>
              )}
              {course.module_count > 0 && (
                <div className="flex items-center gap-1 text-slate-500">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>{course.module_count} {isAr ? 'وحدة' : isEn ? 'modules' : 'mod.'}</span>
                </div>
              )}
              {course.views_count > 0 && (
                <div className="flex items-center gap-1 text-slate-500">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{course.views_count}</span>
                </div>
              )}
            </div>
            {course.enrollment_count > 0 && (
              <span className="text-slate-600 font-semibold">
                {course.enrollment_count.toLocaleString()} {isAr ? 'مسجل' : isEn ? 'enrolled' : 'inscrits'}
              </span>
            )}
          </div>

          {/* CTA — mirrors Bibliothèque primary button exactly */}
          {/* Removed "Découvrir le programme" button for all languages */}
          
          {/* Start date — mirrors Bibliothèque publication date footer */}
          {course.start_date && (
            <div className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100 text-center">
              {isAr ? 'تبدأ: ' : isEn ? 'Starts: ' : 'Début: '}
              {new Date(course.start_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});
CourseCard.displayName = 'CourseCard';

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',     name_fr: 'Tous',              name_ar: 'الكل',            name_en: 'All' },
  { id: 'telecom', name_fr: 'Télécommunications', name_ar: 'اتصالات',         name_en: 'Telecommunications' },
  { id: 'securit', name_fr: 'Sécurité',           name_ar: 'الأمن',           name_en: 'Security' },
  { id: 'data',    name_fr: 'Data Science',        name_ar: 'علوم البيانات',  name_en: 'Data Science' },
  { id: 'reseaux', name_fr: 'Réseaux',             name_ar: 'الشبكات',        name_en: 'Networks' },
  { id: 'cloud',   name_fr: 'Cloud',               name_ar: 'السحاب',         name_en: 'Cloud' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const BestCourses: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const isEn = language === 'en';

  const [activeCategory, setActiveCategory] = useState('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch from backend (unchanged logic) ──
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/courses/popular/?type=school');
        setCourses(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // ── Helpers (unchanged) ──
  const getLocalizedContent = useCallback((item: any, field: string) => {
    const langKey = language === 'ar' ? 'ar' : language === 'en' ? 'en' : 'fr';
    return item[`${field}_${langKey}`] || item[`${field}_fr`] || '';
  }, [language]);

  const getImgSrc = useCallback((img?: string) => {
    try { return getImageUrl(img) || PLACEHOLDER; }
    catch { return PLACEHOLDER; }
  }, []);

  // ── Filter ──
  const filteredCourses = useMemo(() => {
    if (activeCategory === 'all') return courses;
    return courses.filter(c =>
      (c.category_name_fr || '').toLowerCase().includes(activeCategory) ||
      (c.category_name_ar || '').includes(activeCategory)
    );
  }, [courses, activeCategory]);

  if (loading) return <LoadingState language={language} />;

  return (
    <div className={`${BG_GRADIENT} relative overflow-hidden`}>
      <BackgroundDecorations />

      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Header — identical structure to Bibliothèque ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`mb-16 ${isAr ? 'text-right' : 'text-center'}`}
          >
            {/* Eyebrow badge — exact Bibliothèque style */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#133059]/20 bg-[#133059]/5 backdrop-blur-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#e8c97a] animate-pulse" />
              <span className="text-[#133059] text-xs font-bold uppercase tracking-widest">
                {isAr ? '🎓 برامجنا المتميزة' : isEn ? '🎓 Our Featured Programs' : '🎓 Nos Programmes Phares'}
              </span>
            </motion.div>

            {/* H1 — same weight/size/color as Bibliothèque */}
            <h1 className="text-5xl sm:text-6xl font-bold text-[#133059] leading-tight mb-6">
              {isAr ? 'استكشف عالم التدريب' : isEn ? 'Explore the World of Training' : 'Explorez Nos Formations'}
            </h1>

            {/* Gold accent line — identical to Bibliothèque */}
            <div className={`h-1 w-20 bg-gradient-to-r from-[#e8c97a] to-[#133059] rounded-full mb-6 ${isAr ? 'ml-auto mr-0' : 'mx-auto'}`} />

            {/* Subtitle */}
            <p className="text-[#133059]/70 text-lg max-w-2xl mx-auto leading-relaxed">
              {isAr
                ? 'اكتسب المهارات المطلوبة من أفضل الخبراء والمدربين في مجالك'
                : isEn
                  ? 'Acquire in-demand skills from top industry experts and trainers'
                  : "Des programmes conçus par les meilleurs experts du secteur pour accélérer votre carrière"}
            </p>
          </motion.div>

          {/* ── Feature pills ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={`flex flex-wrap gap-3 mb-10 ${isAr ? 'justify-end' : ''}`}
          >
            {[
              { icon: <Zap className="w-3.5 h-3.5" />,        text: isAr ? 'محتوى تفاعلي'     : isEn ? 'Interactive Content' : 'Contenu Interactif'        },
              { icon: <Award className="w-3.5 h-3.5" />,      text: isAr ? 'شهادات معترف بها' : isEn ? 'Recognized Certifications' : 'Certifications Reconnues'  },
              { icon: <TrendingUp className="w-3.5 h-3.5" />, text: isAr ? 'تطور مهني مضمون'  : isEn ? 'Guaranteed Career Progression' : 'Évolution Carrière'        },
            ].map((pill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#133059]/20 bg-white text-xs font-semibold text-[#133059] shadow-sm"
              >
                <span className="text-[#e8c97a]">{pill.icon}</span>
                {pill.text}
              </motion.div>
            ))}
          </motion.div>

          {/* ── Category filter — mirrors Bibliothèque category pills exactly ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className={`flex flex-wrap gap-2 ${isAr ? 'justify-end' : ''}`}>
              {CATEGORIES.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-[#133059] hover:bg-[#0a2342] text-white border-[#133059]'
                        : 'bg-white border-[#133059]/20 text-[#133059] hover:border-[#e8c97a] hover:bg-[#e8c97a]/5'
                    }`}
                  >
                    {isAr ? cat.name_ar : isEn ? cat.name_en : cat.name_fr}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Courses grid — same layout as Bibliothèque books grid ── */}
          {filteredCourses.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredCourses.slice(0, 8).map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  language={language}
                  getImgSrc={getImgSrc}
                  getLocalizedContent={getLocalizedContent}
                />
              ))}
            </motion.div>
          ) : (
            <EmptyState language={language} />
          )}

          {/* ── CTA Banner ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#133059]/10 bg-gradient-to-br from-[#133059] via-[#0a2342] to-[#133059] p-10 md:p-14 shadow-xl">

              {/* Orbs */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#e8c97a]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8c97a]/30 to-transparent" />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="max-w-xl">
                  {/* Eyebrow badge — inverted colors, same structure */}
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
                    {isAr ? 'هل أنت مستعد للارتقاء بمهاراتك؟' : isEn ? 'Ready to Upgrade Your Skills?' : 'Prêt à transformer votre carrière?'}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {isAr
                      ? 'انضم إلى آلاف المتدربين الذين غيروا حياتهم المهنية مع برامجنا'
                      : isEn
                        ? 'Join thousands of learners who have transformed their careers with our programs'
                        : "Rejoignez des milliers d'apprenants qui ont accéléré leur progression."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                  {/* Gold primary button */}
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/formation"
                      className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-[#e8c97a] hover:bg-[#f0d48a] text-[#133059] font-bold text-sm transition-all duration-300 shadow-lg"
                    >
                      {isAr ? 'استكشف جميع البرامج' : isEn ? 'Explore All Programs' : 'Explorer tous les cours'}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>

                  {/* White outline secondary */}
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/about"
                      className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg border border-white/20 text-white/70 hover:border-white/40 hover:text-white font-semibold text-sm transition-all duration-300 bg-white/5 hover:bg-white/10"
                    >
                      {isAr ? 'اعرف المزيد' : isEn ? 'Learn More' : 'En savoir plus'}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default BestCourses;
