import { useState, useRef, memo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import {
  BookOpen, Users, Monitor, Building, Calendar, Award,
  CheckCircle, UserCheck, Globe,
   Target, Lightbulb, ArrowRight, Sparkles,
  ChevronRight, 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Types & helpers ──────────────────────────────────────────────────────────
type Lang = 'fr' | 'ar' | 'en';
const L = (fr: string, ar: string, en: string, lang: Lang): string =>
  lang === 'ar' ? ar : lang === 'en' ? en : fr;

// ─── Data ─────────────────────────────────────────────────────────────────────
const DETAILS = {
  location:  { fr: 'École Nationale des Transmissions',           ar: 'المدرسة الوطنية للمواصلات السلكية واللاسلكية',     en: 'National School of transmissionss' },
  audience:  { fr: 'Personnel des transmissions',            ar: 'موظفو المواصلات السلكية واللاسلكية',              en: 'transmissionss staff' },
  types:     { fr: '4 types de formations',                       ar: '4 أنواع من التكوينات',                             en: '4 training types' },
  modes:     { fr: 'Présentiel et à distance',                    ar: 'بالحضور وعن بعد',                                  en: 'In-person and remote' },
  platform:  { fr: 'Plateforme virtuelle ENT',                    ar: 'المنصة الافتراضية للمدرسة',                        en: 'ENT Virtual Platform' },
  ongoing:   { fr: 'Formation continue',                          ar: 'تكوين مستمر',                                      en: 'Continuous training' },
};

const OVERVIEW_CARDS = [
  { Icon: Building,  key: 'location', fr: 'Lieu',          ar: 'المكان',         en: 'Location',    note: null },
  { Icon: Users,     key: 'audience', fr: 'Public Cible',  ar: 'الفئة المستهدفة', en: 'Audience',    note: null },
  { Icon: BookOpen,  key: 'types',    fr: 'Types',         ar: 'الأنواع',        en: 'Types',       note: (l: Lang) => L('Cours, séminaires, TD, stages', 'دروس، ندوات، أعمال موجهة، تربصات', 'Courses, seminars, workshops, internships', l) },
  { Icon: Globe,     key: 'modes',    fr: 'Modalités',     ar: 'الطرق',          en: 'Methods',     note: null },
  { Icon: Monitor,   key: 'platform', fr: 'Plateforme',    ar: 'المنصة',         en: 'Platform',    note: (l: Lang) => L('Accès en ligne via Moodle', 'الوصول عبر الإنترنت من خلال Moodle', 'Online access via Moodle', l) },
  { Icon: Calendar,  key: 'ongoing',  fr: 'Fréquence',     ar: 'الوتيرة',        en: 'Frequency',   note: null },
] as const;

const TRAINING_TYPES = [
  { Icon: BookOpen,     fr: 'Cours et Conférences Méthodiques',              ar: 'دروس ومحاضرات منهجية',                         en: 'Methodical Courses and Conferences',
    desc_fr: 'Formations structurées avec approche pédagogique systématique', desc_ar: 'تكوينات منظمة بمنهج تربوي منتظم',          desc_en: 'Structured trainings with systematic pedagogical approach' },
  { Icon: Users,        fr: 'Rencontres et Séminaires',                      ar: 'ملتقيات وندوات',                               en: 'Meetings and Seminars',
    desc_fr: "Sessions d'échange et de partage d'expériences professionnelles", desc_ar: 'جلسات تبادل ومشاركة الخبرات المهنية',   desc_en: 'Exchange sessions and professional experience sharing' },
  { Icon: Target,       fr: 'Travaux Dirigés',                               ar: 'أعمال موجهة',                                  en: 'Directed Exercises',
    desc_fr: 'Exercices pratiques encadrés par des experts',                  desc_ar: 'تمارين عملية تحت إشراف الخبراء',           desc_en: 'Practical exercises supervised by experts' },
  { Icon: Building,     fr: 'Stages Pratiques en Milieu Professionnel',      ar: 'تربصات تطبيقية على مستوى الوسط المهني',        en: 'Practical Internships in Professional Environment',
    desc_fr: "Formation pratique dans l'environnement de travail réel",       desc_ar: 'تكوين عملي في بيئة العمل الحقيقية',        desc_en: 'Practical training in real work environment' },
];

const TRAINING_MODES = [
  { Icon: Building, fr: 'Formation en Présentiel',   ar: 'التكوين بالحضور',   en: 'In-Person Training',
    desc_fr: "Sessions de formation directes à l'École Nationale des Transmissions",
    desc_ar: 'جلسات تكوين مباشرة بالمدرسة الوطنية للمواصلات',
    desc_en: 'Direct training sessions at the National School of transmissionss',
    features_fr: ['Interaction directe avec les formateurs', 'Travaux pratiques en laboratoire', 'Échanges entre participants', 'Accès aux équipements spécialisés'],
    features_ar: ['تفاعل مباشر مع المكونين', 'أعمال تطبيقية في المختبر', 'تبادل بين المشاركين', 'الوصول للمعدات المتخصصة'],
    features_en: ['Direct interaction with trainers', 'Practical work in laboratory', 'Exchange between participants', 'Access to specialized equipment'] },
  { Icon: Monitor,  fr: 'Formation à Distance',      ar: 'التكوين عن بعد',    en: 'Distance Learning',
    desc_fr: "Formation via la plateforme virtuelle de l'école",
    desc_ar: 'التكوين عبر منصة التكوين الافتراضي للمدرسة',
    desc_en: "Training via the school's virtual learning platform",
    features_fr: ['Flexibilité horaire', 'Accès aux ressources numériques', 'Suivi personnalisé en ligne', 'Économie de temps et déplacements'],
    features_ar: ['مرونة في التوقيت', 'الوصول للموارد الرقمية', 'متابعة شخصية عبر الإنترنت', 'توفير الوقت والتنقل'],
    features_en: ['Flexible scheduling', 'Access to digital resources', 'Personalized online follow-up', 'Time and travel savings'] },
];

const OBJECTIVES = [
  { Icon: Lightbulb, fr: 'Amélioration du Niveau Professionnel',  ar: 'تحسين المستوى المهني',        en: 'Professional Development',
    desc_fr: 'Développer les compétences techniques et professionnelles des agents',
    desc_ar: 'تطوير المهارات التقنية والمهنية للموظفين',
    desc_en: 'Develop technical and professional skills of employees' },
  { Icon: Award,     fr: 'Renouvellement des Connaissances',      ar: 'تجديد المعارف',               en: 'Knowledge Renewal',
    desc_fr: 'Mise à jour des connaissances selon les évolutions technologiques',
    desc_ar: 'تحديث المعارف وفقاً للتطورات التكنولوجية',
    desc_en: 'Update knowledge according to technological developments' },
  { Icon: UserCheck, fr: 'Adaptation aux Nouvelles Technologies', ar: 'التكيف مع التقنيات الجديدة',  en: 'Technology Adaptation',
    desc_fr: 'Maîtrise des innovations dans le domaine des télécommunications',
    desc_ar: 'إتقان الابتكارات في مجال الاتصالات',
    desc_en: 'Master innovations in transmissionss field' },
  { Icon: Users,     fr: 'Renforcement des Capacités',            ar: 'تعزيز القدرات',               en: 'Capacity Building',
    desc_fr: 'Amélioration des performances individuelles et collectives',
    desc_ar: 'تحسين الأداء الفردي والجماعي',
    desc_en: 'Improve individual and collective performance' },
];

const TARGET_AUDIENCE = [
  { fr: "Agents de l'Administration des Transmissions",  ar: 'موظفو إدارة المواصلات السلكية واللاسلكية',  en: 'Transmission Administration Staff',
    desc_fr: 'Personnel technique et administratif des transmissions nationales',
    desc_ar: 'الموظفون التقنيون والإداريون للمواصلات الوطنية',
    desc_en: 'Technical and administrative staff of national transmission' },
  { fr: 'Cadres et Responsables',                              ar: 'الإطارات والمسؤولون',                        en: 'Managers and Leaders',
    desc_fr: "Personnel d'encadrement et de direction",
    desc_ar: 'موظفو الإشراف والإدارة',
    desc_en: 'Supervisory and management personnel' },
  { fr: 'Techniciens Spécialisés',                             ar: 'التقنيون المتخصصون',                          en: 'Specialized Technicians',
    desc_fr: 'Experts techniques dans différents domaines',
    desc_ar: 'الخبراء التقنيون في مختلف المجالات',
    desc_en: 'Technical experts in various fields' },
];

// ─── Tab types ────────────────────────────────────────────────────────────────
type Tab = 'types' | 'modes' | 'objectives';

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
const ContinuousTraining = () => {
  const { language } = useLanguage();
  const lang = (language === 'ar' ? 'ar' : language === 'en' ? 'en' : 'fr') as Lang;
  const isRtl = lang === 'ar';
  const t = (fr: string, ar: string, en: string) => L(fr, ar, en, lang);

  const [activeTab, setActiveTab] = useState<Tab>('types');

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const heroO = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const TABS: { id: Tab; label: string }[] = [
    { id: 'types',      label: t('Types',      'الأنواع',  'Types') },
    { id: 'modes',      label: t('Modalités',  'الطرق',    'Methods') },
    { id: 'objectives', label: t('Objectifs',  'الأهداف',  'Objectives') },
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
              {t('Formation Continue', 'التكوين المستمر', 'Continuous Training')}
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
                <BookOpen className="w-3.5 h-3.5" />
                {t('École Nationale des Transmissions', 'المدرسة الوطنية للمواصلات', 'National School of Transmission')}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="text-[clamp(40px,5.5vw,68px)] font-black text-white leading-[1.05] tracking-[-0.025em] mb-5"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {t("Cours d'Amélioration", 'دورات تحسين', 'Continuous')}<br />
                {t('du Niveau', 'المستوى', 'Training')}<br />
                <span className="text-[#e8c97a]">{t('et Renouvellement', 'وتجديد المعارف', 'Courses')}</span>
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
                  "Programmes de formation diversifiés pour développer les capacités du personnel des transmissions, en présentiel ou à distance.",
                  'برامج تكوينية متنوعة لتطوير قدرات موظفي إدارة المواصلات السلكية واللاسلكية، بالحضور أو عن بعد.',
                  'Diversified training programs to develop the capacities of transmission staff, in-person or remotely.',
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
                { v: '4',  u: t('types', 'أنواع', 'types'),    label: t('Formations', 'تكوينات', 'Trainings') },
                { v: '2',  u: t('modes', 'طرق', 'modes'),      label: t('Modalités', 'الطرق', 'Methods') },
                { v: '4',  u: '',                               label: t('Objectifs', 'أهداف', 'Objectives') },
                { v: 'ENT',u: '',                               label: t('Plateforme', 'المنصة', 'Platform') },
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
            {t("Cours d'Amélioration du Niveau", 'دورات تحسين المستوى', 'Continuous Training Courses')}
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
              "L'École Nationale des Transmissions organise plusieurs formations pour le personnel de l'administration des télécommunications nationales, comprenant des cours et conférences méthodiques, des rencontres, des travaux dirigés et des stages pratiques en milieu professionnel. Ces formations se déroulent soit en présentiel à l'école, soit à distance via la plateforme de formation virtuelle.",
              'تنظم المدرسة الوطنية للمواصلات السلكية واللاسلكية عدة تكوينات للموظفين المنتمين لإدارة المواصلات السلكية واللاسلكية الوطنية، وتشتمل على دروس ومحاضرات منهجية وملتقيات وأعمال موجهة وتربصات تطبيقية على مستوى الوسط المهني. تتم هذه الدورات التكوينية سواء بالحضور على مستوى المدرسة أو عن بعد بواسطة منصة التكوين الافتراضي.',
              'The National School of transmissionss organizes several trainings for national transmissionss administration staff, including methodical courses and conferences, meetings, directed exercises and practical internships in professional environment. These trainings take place either in-person at the school or remotely via the virtual training platform.',
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

            {/* TYPES */}
            {activeTab === 'types' && (
              <motion.div
                key="types"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {TRAINING_TYPES.map(({ Icon: TIcon, fr, ar, en, desc_fr, desc_ar, desc_en }, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="group flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-100 hover:border-[#133059]/20 hover:shadow-[0_6px_24px_rgba(19,48,89,0.08)] transition-all duration-300"
                    >
                      {/* Number + icon */}
                      <div className="flex-shrink-0 flex flex-col items-center gap-1">
                        <span className="text-[10px] font-black text-[#e8c97a] tabular-nums">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-[#133059]/7 flex items-center justify-center group-hover:bg-[#133059]/14 transition-colors">
                          <TIcon className="w-4 h-4 text-[#133059]" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-[15px] font-black text-[#0f1f3a] mb-1.5 leading-snug tracking-[-0.01em]"
                          style={{ fontFamily: "Georgia, serif" }}>
                          {L(fr, ar, en, lang)}
                        </h3>
                        <p className="text-[13px] text-slate-500 leading-[1.65]">
                          {L(desc_fr, desc_ar, desc_en, lang)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* MODES */}
            {activeTab === 'modes' && (
              <motion.div
                key="modes"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {TRAINING_MODES.map((mode, i) => {
                    const features = lang === 'ar' ? mode.features_ar : lang === 'en' ? mode.features_en : mode.features_fr;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                        className="group bg-white rounded-2xl border border-slate-100 hover:border-[#133059]/20 hover:shadow-[0_12px_36px_rgba(19,48,89,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
                      >
                        {/* Top accent */}
                        <div className={`h-[3px] ${i === 0 ? 'bg-gradient-to-r from-[#133059] via-[#133059]/60 to-transparent' : 'bg-gradient-to-r from-[#e8c97a] via-[#e8c97a]/60 to-transparent'}`} />

                        <div className="p-7">
                          <div className="flex items-start gap-4 mb-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-[#133059]/8' : 'bg-[#e8c97a]/15'} group-hover:scale-110 transition-transform duration-300`}>
                              <mode.Icon className={`w-5 h-5 ${i === 0 ? 'text-[#133059]' : 'text-[#e8c97a]'}`} />
                            </div>
                            <div>
                              <div className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-full bg-[#133059]/7 border border-[#133059]/12">
                                <span className="text-[10px] font-black text-[#133059] uppercase tracking-wider">
                                  {t('Modalité', 'الطريقة', 'Method')} {String(i + 1).padStart(2, '0')}
                                </span>
                              </div>
                              <h3 className="text-[17px] font-black text-[#0f1f3a] leading-snug tracking-[-0.01em]"
                                style={{ fontFamily: "Georgia, serif" }}>
                                {L(mode.fr, mode.ar, mode.en, lang)}
                              </h3>
                            </div>
                          </div>

                          <p className="text-[13.5px] text-slate-500 leading-[1.7] mb-5">
                            {L(mode.desc_fr, mode.desc_ar, mode.desc_en, lang)}
                          </p>

                          {/* Features */}
                          <div className="space-y-2">
                            {features.map((feature, ci) => (
                              <motion.div
                                key={ci}
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50/80 hover:bg-[#133059]/5 border border-transparent hover:border-[#133059]/10 transition-all cursor-default"
                              >
                                <CheckCircle className="w-4 h-4 text-[#e8c97a] flex-shrink-0" />
                                <span className="text-[13px] text-slate-600 font-medium">{feature}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* OBJECTIVES */}
            {activeTab === 'objectives' && (
              <motion.div
                key="objectives"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="space-y-10">
                  {/* Objectives grid */}
                  <div>
                    <h3 className="text-[18px] font-black text-[#0f1f3a] mb-6 tracking-[-0.01em]"
                      style={{ fontFamily: "Georgia, serif" }}>
                      {t('Objectifs de la Formation', 'أهداف التكوين', 'Training Objectives')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {OBJECTIVES.map((obj, i) => (
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
                              {t('Objectif', 'هدف', 'Objective')} {String(i + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-[#133059]/7 flex items-center justify-center flex-shrink-0 group-hover:bg-[#133059]/14 transition-colors">
                              <obj.Icon className="w-4 h-4 text-[#133059]" />
                            </div>
                            <h4 className="text-[16px] font-black text-[#0f1f3a] leading-snug tracking-[-0.01em]"
                              style={{ fontFamily: "Georgia, serif" }}>
                              {L(obj.fr, obj.ar, obj.en, lang)}
                            </h4>
                          </div>
                          <p className="text-[13.5px] text-slate-500 leading-[1.7]">
                            {L(obj.desc_fr, obj.desc_ar, obj.desc_en, lang)}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <h3 className="text-[18px] font-black text-[#0f1f3a] mb-6 tracking-[-0.01em]"
                      style={{ fontFamily: "Georgia, serif" }}>
                      {t('Public Cible', 'الجمهور المستهدف', 'Target Audience')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {TARGET_AUDIENCE.map((aud, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06, duration: 0.5 }}
                          className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-[#133059]/20 hover:shadow-[0_8px_32px_rgba(19,48,89,0.09)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                        >
                          {/* Top accent */}
                          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#133059] via-[#133059]/50 to-transparent" />

                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#133059]/7 text-[#133059] text-[11px] font-black mb-4">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <h4 className="text-[15px] font-black text-[#0f1f3a] mb-2 leading-snug tracking-[-0.01em]"
                            style={{ fontFamily: "Georgia, serif" }}>
                            {L(aud.fr, aud.ar, aud.en, lang)}
                          </h4>
                          <p className="text-[13px] text-slate-500 leading-[1.7]">
                            {L(aud.desc_fr, aud.desc_ar, aud.desc_en, lang)}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
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
                    {t('Formations disponibles', 'التكوينات متاحة', 'Trainings available')}
                  </span>
                </div>
                <h3 className="text-[30px] md:text-[36px] font-black text-white leading-[1.15] tracking-[-0.02em] mb-4"
                  style={{ fontFamily: "Georgia, serif" }}>
                  {t("Intéressé par ces formations ?", 'هل أنت مهتم بهذه الدورات؟', 'Interested in these trainings?')}
                </h3>
                <p className="text-[14px] text-white/50 leading-[1.7]">
                  {t(
                    "Découvrez plus d'informations sur les cours d'amélioration du niveau et de renouvellement des connaissances disponibles.",
                    'اكتشف المزيد عن دورات تحسين المستوى وتجديد المعارف المتاحة.',
                    'Discover more information about the level improvement and knowledge renewal courses available.',
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
                  <Link to="/formation"
                    className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-[13px] border border-white/20 text-white/60 hover:text-white hover:border-white/40 font-semibold text-[13px] transition-all hover:bg-white/[0.07]"
                  >
                    {t('Autres programmes', 'برامج أخرى', 'Other Programs')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  );
};

export default ContinuousTraining;
