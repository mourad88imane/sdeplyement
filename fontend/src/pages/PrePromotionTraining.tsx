import { useState, useRef, memo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import {
  TrendingUp, Award, Users, CheckCircle, FileText, Monitor,
  ExternalLink,  Globe, ArrowRight,
   Sparkles, ChevronRight, BookOpen, Clock,
  Briefcase, Shield, 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Types & helpers ──────────────────────────────────────────────────────────
type Lang = 'fr' | 'ar' | 'en';
const L = (fr: string, ar: string, en: string, lang: Lang): string =>
  lang === 'ar' ? ar : lang === 'en' ? en : fr;

// ─── Data ─────────────────────────────────────────────────────────────────────
const DETAILS = {
  regulation: { fr: 'Décision ministérielle conjointe du 22 mars 2012', ar: 'القرار الوزاري المشترك المؤرخ في 22 مارس 2012', en: 'Joint ministerial decision dated March 22, 2012' },
  target:     { fr: 'Agents promus par examens professionnels', ar: 'الأعوان المرقين عن طريق الامتحانات المهنية', en: 'Agents promoted through professional examinations' },
  platform:   { fr: "Plateforme e-learning de l'ENT", ar: 'منصة التعلم الإلكتروني للمدرسة الوطنية', en: "ENT e-learning platform" },
  grades:     { fr: '3 grades concernés', ar: '3 رتب معنية', en: '3 grades concerned' },
  method:     { fr: 'Formation à distance', ar: 'تكوين عن بعد', en: 'Distance learning' },
  duration:   { fr: '30 à 180 jours', ar: '30 إلى 180 يوم', en: '30 to 180 days' },
};

const PLATFORM_URL = 'http://ent.hopto.org/moodle/login/index.php';

const OVERVIEW_CARDS = [
  { Icon: FileText,    key: 'regulation', fr: 'Cadre Réglementaire', ar: 'الإطار القانوني',  en: 'Regulatory Framework', note: null },
  { Icon: Users,       key: 'target',     fr: 'Public Cible',        ar: 'الفئة المستهدفة',  en: 'Target Audience',      note: null },
  { Icon: Monitor,     key: 'platform',   fr: 'Plateforme',          ar: 'المنصة',           en: 'Platform',             note: (l: Lang) => L('Accès en ligne via Moodle', 'الوصول عبر الإنترنت من خلال Moodle', 'Online access via Moodle', l) },
  { Icon: Award,       key: 'grades',     fr: 'Grades',              ar: 'الرتب',            en: 'Grades',               note: null },
  { Icon: Globe,       key: 'method',     fr: 'Méthode',             ar: 'الطريقة',          en: 'Method',               note: null },
  { Icon: Clock,       key: 'duration',   fr: 'Durée',               ar: 'المدة',            en: 'Duration',             note: (l: Lang) => L('Variable selon le grade', 'متغيرة حسب الرتبة', 'Varies by grade', l) },
] as const;

const GRADES = [
  { Icon: Users,       fr: "Grade d'Agent d'Exploitation",                          ar: 'رتبة عون استغلال',                      en: 'Grade of Exploitation Agent',
    desc_fr: "Formation avant promotion pour les agents d'exploitation",             desc_ar: 'تكوين قبل الترقية لأعوان الاستغلال',  desc_en: 'Pre-promotion training for exploitation agents',
    theoretical: 30, practical: 30 },
  { Icon: Award,       fr: "Grade d'Assistant Technique Spécialisé",                ar: 'رتبة مساعد تقني متخصص',                  en: 'Grade of Specialized Technical Assistant',
    desc_fr: "Formation avant promotion pour les assistants techniques spécialisés", desc_ar: 'تكوين قبل الترقية للمساعدين التقنيين المتخصصين', desc_en: 'Pre-promotion training for specialized technical assistants',
    theoretical: 60, practical: 60 },
  { Icon: TrendingUp,  fr: "Grade d'Assistant Technique Spécialisé Principal",      ar: 'رتبة مساعد تقني متخصص رئيسي',            en: 'Grade of Principal Specialized Technical Assistant',
    desc_fr: "Formation avant promotion pour les assistants techniques spécialisés principaux", desc_ar: 'تكوين قبل الترقية للمساعدين التقنيين المتخصصين الرئيسيين', desc_en: 'Pre-promotion training for principal specialized technical assistants',
    theoretical: 90, practical: 90 },
];

const REQUIREMENTS = [
  { fr: 'Conditions de promotion',   ar: 'شروط الترقية',       en: 'Promotion Conditions',
    items_fr: ['Réussite aux examens professionnels', "Ancienneté requise dans le grade actuel", 'Évaluation de performance satisfaisante'],
    items_ar: ['النجاح في الامتحانات المهنية', 'الأقدمية المطلوبة في الرتبة الحالية', 'تقييم أداء مرضي'],
    items_en: ['Success in professional examinations', 'Required seniority in current grade', 'Satisfactory performance evaluation'] },
  { fr: 'Modalités de formation',    ar: 'طرق التكوين',        en: 'Training Methods',
    items_fr: ['Formation à distance via plateforme e-learning', 'Suivi pédagogique personnalisé', 'Évaluations continues et examens finaux'],
    items_ar: ['تكوين عن بعد عبر منصة التعلم الإلكتروني', 'متابعة تربوية شخصية', 'تقييمات مستمرة وامتحانات نهائية'],
    items_en: ['Distance learning via e-learning platform', 'Personalized educational follow-up', 'Continuous evaluations and final exams'] },
  { fr: 'Compétences développées',   ar: 'المهارات المطورة',   en: 'Developed Skills',
    items_fr: ['Compétences techniques avancées', "Capacités de gestion et d'encadrement", 'Maîtrise des nouvelles technologies'],
    items_ar: ['مهارات تقنية متقدمة', 'قدرات الإدارة والإشراف', 'إتقان التقنيات الجديدة'],
    items_en: ['Advanced technical skills', 'Management and supervisory capabilities', 'Mastery of new technologies'] },
];

const TRAINING_PROGRAMS = [
  { grade_fr: "Agents d'Exploitation",                         grade_ar: 'أعوان الاستغلال',                           grade_en: 'Exploitation Agents',                       theoretical: 30, practical: 30 },
  { grade_fr: 'Assistants Techniques Spécialisés',             grade_ar: 'المساعدين التقنيين المتخصصين',                grade_en: 'Specialized Technical Assistants',           theoretical: 60, practical: 60 },
  { grade_fr: 'Assistants Techniques Spécialisés Principaux',  grade_ar: 'المساعدين التقنيين المتخصصين الرئيسيين',      grade_en: 'Principal Specialized Technical Assistants', theoretical: 90, practical: 90 },
];

// ─── Tab types ────────────────────────────────────────────────────────────────
type Tab = 'grades' | 'requirements' | 'curriculum';

// ─── Animated section heading ─────────────────────────────────────────────────
const SectionHeading = memo(({ Icon: HIcon, label }: { Icon: React.ElementType; label: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="flex items-center gap-4 mb-10"
  >
    <div className="w-11 h-11 rounded-xl bg-[#133059] flex items-center justify-center flex-shrink-0">
      <HIcon className="w-5 h-5 text-white" />
    </div>
    <h2 className="text-2xl font-black text-[#0f1f3a] tracking-[-0.02em]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      {label}
    </h2>
    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
  </motion.div>
));
SectionHeading.displayName = 'SectionHeading';

// ─── Main Component ───────────────────────────────────────────────────────────
const PrePromotionTraining = () => {
  const { language } = useLanguage();
  const lang = (language === 'ar' ? 'ar' : language === 'en' ? 'en' : 'fr') as Lang;
  const isRtl = lang === 'ar';
  const t = (fr: string, ar: string, en: string) => L(fr, ar, en, lang);

  const [activeTab, setActiveTab] = useState<Tab>('grades');

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const heroO = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const TABS: { id: Tab; label: string }[] = [
    { id: 'grades',       label: t('Grades',     'الرتب',      'Grades') },
    { id: 'requirements', label: t('Conditions', 'الشروط',     'Requirements') },
    { id: 'curriculum',   label: t('Programme',  'البرنامج',   'Curriculum') },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fa]" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ════════════════════ HERO ════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden bg-[#0f1f3a] pt-28 pb-24">

        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse 80% 60% at 75% -15%, rgba(26,74,122,0.55) 0%, transparent 65%),
            radial-gradient(ellipse 50% 80% at -5% 85%, rgba(232,201,122,0.07) 0%, transparent 55%)
          `,
        }} />

        {/* Dot matrix */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.032]" style={{
          backgroundImage: 'radial-gradient(circle, #e8c97a 1.3px, transparent 1.3px)',
          backgroundSize: '30px 30px',
        }} />

        {/* Concentric rings — top right */}
        {[640, 470, 310, 185].map((s, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none" style={{
            top: -(s / 2.3), right: -(s / 3.2),
            width: s, height: s,
            border: `1px solid rgba(232,201,122,${[0.03, 0.055, 0.085, 0.13][i]})`,
          }} />
        ))}

        {/* Gold left stripe */}
        <div className="absolute top-0 left-0 bottom-0 w-[3px] pointer-events-none"
          style={{ background: 'linear-gradient(180deg, #e8c97a 0%, rgba(232,201,122,0.45) 55%, transparent 100%)' }} />

        {/* Bottom hairline */}
        <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(to right, transparent, rgba(232,201,122,0.35), transparent)' }} />

        <motion.div style={{ y: heroY, opacity: heroO }}
          className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-10"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full border border-[#e8c97a]/22 bg-[#e8c97a]/[0.07]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e8c97a]" />
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/60">
              {t('Programme Spécialisé', 'برنامج متخصص', 'Specialized Program')}
            </span>
          </motion.div>

          {/* Two-column hero */}
          <div className="grid lg:grid-cols-[1fr_auto] gap-14 items-end">

            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="inline-flex items-center gap-2 mb-5 text-[#e8c97a]/70 text-[12px] font-semibold uppercase tracking-[0.14em]"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                {t('École Nationale des Transmissions', 'المدرسة الوطنية للمواصلات', 'National School of transmissionss')}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="text-[clamp(40px,5.5vw,68px)] font-black text-white leading-[1.05] tracking-[-0.025em] mb-5"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {t('Formation', 'التكوين', 'Pre-Promotion')}<br />
                {t('avant', 'قبل', 'Training')}<br />
                <span className="text-[#e8c97a]">{t('Promotion', 'الترقية', 'Program')}</span>
              </motion.h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="h-[3px] w-14 bg-[#e8c97a] rounded-full mb-6 origin-left"
              />

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.32 }}
                className="text-[16px] text-white/50 leading-[1.75] max-w-[460px]"
              >
                {t(
                  "Programme de formation spécialisé pour les agents promus par examens professionnels, dispensé via la plateforme de formation à distance de l'École Nationale des Transmissions.",
                  'برنامج تكويني متخصص للأعوان المرقين عن طريق الامتحانات المهنية، يتم تقديمه عبر منصة التكوين عن بعد للمدرسة الوطنية للمواصلات السلكية واللاسلكية.',
                  'Specialized training program for agents promoted through professional examinations, delivered via the distance learning platform of the National School of transmissionss.',
                )}
              </motion.p>
            </div>

            {/* Right — key stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.38 }}
              className="grid grid-cols-2 gap-2.5 min-w-[260px]"
            >
              {[
                { v: '3',   u: t('grades', 'رتب', 'grades'),  label: t('Grades', 'الرتب', 'Grades') },
                { v: '180', u: t('jours', 'يوم', 'days'),     label: t('Max. durée', 'أقصى مدة', 'Max. duration') },
                { v: '100', u: '%',                            label: t('En ligne', 'عن بعد', 'Online') },
                { v: '2012',u: '',                             label: t('Cadre légal', 'الإطار القانوني', 'Legal framework') },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.47 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="p-4 rounded-[15px] bg-white/[0.06] border border-white/[0.09] backdrop-blur-sm hover:bg-white/[0.1] transition-colors"
                >
                  <p className="text-[28px] font-black text-[#e8c97a] leading-none" style={{ fontFamily: "Georgia, serif" }}>
                    {s.v}<span className="text-[16px] ml-0.5 font-bold text-[#e8c97a]/70">{s.u}</span>
                  </p>
                  <p className="text-[11px] font-semibold text-white/45 mt-1.5 uppercase tracking-[0.08em]">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════ BREADCRUMB ════════════════════ */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-30">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-3 flex items-center gap-2 text-[12px] text-slate-400 font-medium">
          <Link to="/formation" className="hover:text-[#133059] transition-colors">{t('Formations', 'التكوين', 'Programs')}</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-[#133059] font-semibold">
            {t('Formation avant Promotion', 'التكوين قبل الترقية', 'Pre-Promotion Training')}
          </span>
        </div>
      </div>

      {/* ════════════════════ CONTENT ════════════════════ */}
      <main className="max-w-[1280px] mx-auto px-6 md:px-10 py-16 space-y-20">

        {/* ── OVERVIEW ── */}
        <section>
          <SectionHeading Icon={BookOpen} label={t("Aperçu du Programme", 'نظرة عامة على البرنامج', 'Program Overview')} />

          {/* Intro paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[15px] text-slate-600 leading-[1.8] max-w-3xl mb-12"
          >
            {t(
              "Ce type de formation est soumis à la décision ministérielle conjointe du 22 mars 2012. Il concerne les agents promus par examens professionnels et touche les trois grades mentionnés. La formation se déroule via la plateforme de formation à distance de l'École Nationale des Transmissions.",
              'يخضع هذا النمط من التكوين للقرار الوزاري المشترك المؤرخ في 22 مارس 2012. يخص الأعوان الذين تمت ترقيتهم عن طريق الامتحانات المهنية، ويمس الرتب الثلاث المذكورة. يتم التكوين عبر منصة التكوين عن بعد للمدرسة الوطنية للمواصلات السلكية واللاسلكية.',
              'This type of training is subject to the joint ministerial decision of March 22, 2012. It concerns agents promoted through professional examinations and affects the three grades mentioned. Training takes place via the distance learning platform of the National School of transmissionss.',
            )}
          </motion.p>

          {/* Overview cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OVERVIEW_CARDS.map(({ Icon: CIcon, key, fr, ar, en, note }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
                className="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(19,48,89,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Left accent */}
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#133059] to-[#133059]/30 rounded-l-2xl" />

                <div className="flex items-center gap-3 mb-3 pl-2">
                  <div className="w-9 h-9 rounded-xl bg-[#133059]/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[#133059]/15 transition-colors">
                    <CIcon className="w-4 h-4 text-[#133059]" />
                  </div>
                  <span className="text-[10px] font-black text-[#133059]/60 uppercase tracking-[0.12em]">
                    {L(fr, ar, en, lang)}
                  </span>
                </div>
                <p className="text-[14px] font-semibold text-[#0f1f3a] pl-2 leading-snug">
                  {L((DETAILS as any)[key].fr, (DETAILS as any)[key].ar, (DETAILS as any)[key].en, lang)}
                </p>
                {note && (
                  <p className="text-[12px] text-slate-400 pl-2 mt-1.5">{note(lang)}</p>
                )}

                {/* Platform link for the platform card */}
                {key === 'platform' && (
                  <a
                    href={PLATFORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 pl-2 mt-2.5 text-[12px] font-semibold text-[#133059] hover:text-[#e8c97a] transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {t('Accéder à la plateforme', 'الوصول إلى المنصة', 'Access Platform')}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── TABBED SECTION ── */}
        <section>
          {/* Custom tab bar */}
          <div className="flex gap-1 p-1 bg-white rounded-xl border border-slate-100 shadow-sm mb-8 w-fit">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#133059] text-white shadow-md shadow-[#133059]/25'
                    : 'text-slate-500 hover:text-[#133059] hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* GRADES */}
            {activeTab === 'grades' && (
              <motion.div
                key="grades"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {GRADES.map((grade, i) => {
                    const total = grade.theoretical + grade.practical;
                    const theoryPct = Math.round((grade.theoretical / total) * 100);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                        className="group bg-white rounded-2xl border border-slate-100 hover:border-[#133059]/20 hover:shadow-[0_12px_36px_rgba(19,48,89,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
                      >
                        {/* Top accent */}
                        <div className={`h-[3px] ${i === 0 ? 'bg-gradient-to-r from-[#133059] via-[#133059]/60 to-transparent' : i === 1 ? 'bg-gradient-to-r from-[#e8c97a] via-[#e8c97a]/60 to-transparent' : 'bg-gradient-to-r from-[#133059] via-[#e8c97a]/60 to-transparent'}`} />

                        <div className="p-7">
                          {/* Grade number + icon */}
                          <div className="flex items-start gap-4 mb-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-[#133059]/8' : i === 1 ? 'bg-[#e8c97a]/15' : 'bg-[#133059]/8'} group-hover:scale-110 transition-transform duration-300`}>
                              <grade.Icon className={`w-5 h-5 ${i === 1 ? 'text-[#e8c97a]' : 'text-[#133059]'}`} />
                            </div>
                            <div>
                              <div className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-full bg-[#133059]/7 border border-[#133059]/12">
                                <span className="text-[10px] font-black text-[#133059] uppercase tracking-wider">
                                  {t('Grade', 'الرتبة', 'Grade')} {String(i + 1).padStart(2, '0')}
                                </span>
                              </div>
                              <h3 className="text-[16px] font-black text-[#0f1f3a] leading-snug tracking-[-0.01em]"
                                style={{ fontFamily: "Georgia, serif" }}>
                                {L(grade.fr, grade.ar, grade.en, lang)}
                              </h3>
                            </div>
                          </div>

                          <p className="text-[13px] text-slate-500 leading-[1.7] mb-5">
                            {L(grade.desc_fr, grade.desc_ar, grade.desc_en, lang)}
                          </p>

                          {/* Duration breakdown */}
                          <div className="bg-slate-50/80 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between text-[12px]">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#133059]" />
                                <span className="text-slate-600 font-medium">{t('Théorique', 'نظري', 'Theoretical')}</span>
                              </div>
                              <span className="font-bold text-[#133059]">
                                {grade.theoretical} {t('jours', 'يوم', 'days')}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[12px]">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#e8c97a]" />
                                <span className="text-slate-600 font-medium">{t('Pratique', 'تطبيقي', 'Practical')}</span>
                              </div>
                              <span className="font-bold text-[#e8c97a]">
                                {grade.practical} {t('jours', 'يوم', 'days')}
                              </span>
                            </div>
                            {/* Progress bar */}
                            <div className="h-2 bg-slate-200/60 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${theoryPct}%` }}
                                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + i * 0.1 }}
                                className="h-full bg-gradient-to-r from-[#133059] to-[#133059]/70 rounded-full relative"
                              >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#e8c97a] rounded-full border-2 border-white shadow-sm" />
                              </motion.div>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                              <span>{t('Théorique', 'نظري', 'Theoretical')} ({theoryPct}%)</span>
                              <span>{t('Total', 'المجموع', 'Total')}: {total} {t('jours', 'يوم', 'days')}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* REQUIREMENTS */}
            {activeTab === 'requirements' && (
              <motion.div
                key="requirements"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {REQUIREMENTS.map((req, i) => {
                    const items = lang === 'ar' ? req.items_ar : lang === 'en' ? req.items_en : req.items_fr;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                        className="bg-white rounded-2xl p-7 border border-slate-100 hover:border-[#133059]/20 hover:shadow-[0_8px_32px_rgba(19,48,89,0.09)] transition-all duration-300 group"
                      >
                        {/* Index pill */}
                        <div className="inline-flex items-center gap-1.5 mb-4 px-2.5 py-1 rounded-full bg-[#133059]/7 border border-[#133059]/12">
                          <span className="text-[10px] font-black text-[#133059] uppercase tracking-wider">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>

                        <h3 className="text-[17px] font-black text-[#0f1f3a] mb-4 leading-snug tracking-[-0.01em]"
                          style={{ fontFamily: "Georgia, serif" }}>
                          {L(req.fr, req.ar, req.en, lang)}
                        </h3>

                        <ul className="space-y-3">
                          {items.map((item, ci) => (
                            <motion.li
                              key={ci}
                              whileHover={{ x: 4 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-slate-50/80 hover:bg-[#133059]/5 border border-transparent hover:border-[#133059]/10 transition-all cursor-default"
                            >
                              <CheckCircle className="w-4 h-4 text-[#e8c97a] flex-shrink-0 mt-0.5" />
                              <span className="text-[13px] text-slate-600 font-medium leading-snug">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* CURRICULUM / PROGRAMME */}
            {activeTab === 'curriculum' && (
              <motion.div
                key="curriculum"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="space-y-5">
                  {TRAINING_PROGRAMS.map((program, yi) => {
                    const total = program.theoretical + program.practical;
                    return (
                      <motion.div
                        key={yi}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: yi * 0.1, duration: 0.5 }}
                        className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-[0_8px_32px_rgba(19,48,89,0.08)] transition-shadow duration-300"
                      >
                        {/* Grade header */}
                        <div className="flex items-center gap-4 px-7 py-5 border-b border-slate-100 bg-slate-50/60">
                          <span className="text-[32px] font-black text-[#133059]/10 leading-none select-none"
                            style={{ fontFamily: "Georgia, serif" }}>
                            {String(yi + 1).padStart(2, '0')}
                          </span>
                          <h3 className="text-[18px] font-black text-[#0f1f3a] tracking-[-0.01em]"
                            style={{ fontFamily: "Georgia, serif" }}>
                            {L(program.grade_fr, program.grade_ar, program.grade_en, lang)}
                          </h3>
                          <span className="ml-auto text-[11px] text-slate-400 font-semibold">
                            {total} {t('jours', 'يوم', 'days')}
                          </span>
                        </div>

                        {/* Duration details */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Theoretical */}
                          <div className="flex items-center gap-3 px-4 py-4 rounded-xl bg-slate-50/80 hover:bg-[#133059]/5 border border-transparent hover:border-[#133059]/10 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-[#133059]/8 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-4 h-4 text-[#133059]" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-[#133059]/50 uppercase tracking-[0.1em]">
                                {t('Formation Théorique', 'التكوين النظري', 'Theoretical Training')}
                              </p>
                              <p className="text-[15px] font-bold text-[#0f1f3a]">
                                {program.theoretical} {t('jours', 'يوم', 'days')}
                              </p>
                            </div>
                          </div>

                          {/* Practical */}
                          <div className="flex items-center gap-3 px-4 py-4 rounded-xl bg-slate-50/80 hover:bg-[#e8c97a]/5 border border-transparent hover:border-[#e8c97a]/20 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-[#e8c97a]/15 flex items-center justify-center flex-shrink-0">
                              <Briefcase className="w-4 h-4 text-[#e8c97a]" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-[#e8c97a]/70 uppercase tracking-[0.1em]">
                                {t('Formation Pratique', 'التكوين التطبيقي', 'Practical Training')}
                              </p>
                              <p className="text-[15px] font-bold text-[#0f1f3a]">
                                {program.practical} {t('jours', 'يوم', 'days')}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Progress visualization */}
                        <div className="px-7 pb-5">
                          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(program.theoretical / total) * 100}%` }}
                              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 + yi * 0.15 }}
                              className="h-full bg-gradient-to-r from-[#133059] to-[#133059]/70 rounded-full relative"
                            >
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#e8c97a] rounded-full border-2 border-white shadow-sm" />
                            </motion.div>
                          </div>
                          <div className="flex justify-between mt-1.5 text-[10px] text-slate-400 font-semibold">
                            <span>{t('Théorique', 'نظري', 'Theoretical')} ({Math.round((program.theoretical / total) * 100)}%)</span>
                            <span>{t('Pratique', 'تطبيقي', 'Practical')} ({Math.round((program.practical / total) * 100)}%)</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Note card */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-white rounded-2xl border border-slate-100 px-7 py-5 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#133059]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield className="w-4 h-4 text-[#133059]" />
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-[#133059] uppercase tracking-wider mb-1">{t('Note', 'ملاحظة', 'Note')}</p>
                      <p className="text-[13px] text-slate-500 leading-[1.7]">
                        {t(
                          "La formation avant promotion se déroule via la plateforme de formation à distance de l'École Nationale des Transmissions pour les trois grades.",
                          'يتم التكوين قبل الترقية عبر منصة التكوين عن بعد للمدرسة الوطنية للمواصلات السلكية واللاسلكية بالنسبة للرتب الثلاث.',
                          'Pre-promotion training takes place via the distance learning platform of the National School of transmissionss for all three grades.',
                        )}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── CTA BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative rounded-[28px] overflow-hidden bg-[#0f1f3a]">

            {/* Decorations */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse 65% 80% at 100% 50%, rgba(232,201,122,0.09) 0%, transparent 65%)',
              }} />
              {[300, 210, 125].map((s, i) => (
                <div key={i} className="absolute rounded-full" style={{
                  bottom: -(s / 2), right: -(s / 4), width: s, height: s,
                  border: `1px solid rgba(232,201,122,${[0.06, 0.1, 0.17][i]})`,
                  pointerEvents: 'none',
                }} />
              ))}
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: 'radial-gradient(circle, #e8c97a 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }} />
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(to right, transparent, rgba(232,201,122,0.45), transparent)' }} />
              <div className="absolute top-0 left-0 bottom-0 w-[3px]"
                style={{ background: 'linear-gradient(180deg, #e8c97a, rgba(232,201,122,0.5), transparent)' }} />
            </div>

            <div className="relative z-10 p-10 md:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 flex-wrap">
              <div className="max-w-[520px]">
                <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full border border-[#e8c97a]/30 bg-[#e8c97a]/[0.1]">
                  <Sparkles className="w-3 h-3 text-[#e8c97a]" />
                  <span className="text-[#e8c97a] text-[10px] font-black uppercase tracking-[0.2em]">
                    {t('Formation disponible', 'التكوين متاح', 'Training available')}
                  </span>
                </div>
                <h3 className="text-[30px] md:text-[36px] font-black text-white leading-[1.15] tracking-[-0.02em] mb-4"
                  style={{ fontFamily: "Georgia, serif" }}>
                  {t("Intéressé par ce programme ?", 'هل أنت مهتم بهذا البرنامج؟', 'Interested in this program?')}
                </h3>
                <p className="text-[14px] text-white/50 leading-[1.7]">
                  {t(
                    "Découvrez les conditions d'admission et accédez à la plateforme de formation à distance pour le programme de Formation avant Promotion.",
                    'اكتشف شروط القبول وادخل إلى منصة التكوين عن بعد لبرنامج التكوين قبل الترقية.',
                    'Discover admission requirements and access the distance learning platform for the Pre-Promotion Training program.',
                  )}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/contact"
                    className="group flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-[13px] bg-[#e8c97a] text-[#0f1f3a] font-black text-[13px] tracking-[0.02em] hover:bg-[#f0d48a] transition-all shadow-[0_8px_28px_rgba(232,201,122,0.35)] hover:shadow-[0_10px_36px_rgba(232,201,122,0.45)]"
                  >
                    {t('Nous contacter', 'تواصل معنا', 'Contact Us')}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <a
                    href={PLATFORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-[13px] border border-white/20 text-white/60 hover:text-white hover:border-white/40 font-semibold text-[13px] transition-all hover:bg-white/[0.07]"
                  >
                    <Globe className="w-4 h-4" />
                    {t('Accéder à la plateforme', 'الوصول إلى المنصة', 'Access Platform')}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  );
};

export default PrePromotionTraining;
