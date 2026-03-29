import { useState, memo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Search, GraduationCap, ArrowRight, ArrowUpRight,
  Clock, Award, TrendingUp, Network, Wifi,
  CheckCircle, Briefcase, BookOpen, Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

// ─── Lang helper ──────────────────────────────────────────────────────────────
type Lang = 'fr' | 'ar' | 'en';
const L = (fr: string, ar: string, en: string, lang: Lang) =>
  lang === 'ar' ? ar : lang === 'en' ? en : fr;

// ─── Programs data ────────────────────────────────────────────────────────────
const PROGRAMS = [
  {
    id: 'inspector', type: 'specialized' as const, num: '01',
    route: '/formation/specialized-technical-inspector',
    Icon: Network, color: '#133059',
    title_fr: 'Inspecteur Technique Spécialisé',
    title_ar: 'مفتش تقني متخصص',
    title_en: 'Specialized Technical Inspector',
    short_fr: 'Formation d\'excellence · Bac+5',
    short_ar: 'تكوين متميز · بكالوريا +5',
    short_en: 'Excellence training · Bac+5',
    description_fr: "Programme d'excellence visant à préparer des experts techniques qualifiés en transmissions, combinant connaissances théoriques avancées et formation pratique intensive.",
    description_ar: 'برنامج متميز يهدف إلى إعداد خبراء تقنيين مؤهلين في مجال الاتصالات، يجمع بين المعرفة النظرية المتقدمة والتدريب العملي المكثف.',
    description_en: 'Excellence program preparing qualified technical experts in transmissionss, combining advanced theoretical knowledge and intensive practical training.',
    duration_fr: '12 mois', duration_ar: '12 شهر', duration_en: '12 months',
    level_fr: 'Bac +5', level_ar: 'بكالوريا +5', level_en: 'Bac +5',
    diploma_fr: "Dip. Inspecteur Technique Spécialisé", diploma_ar: 'شهادة مفتش تقني متخصص', diploma_en: 'Specialized Technical Inspector Dip.',
   
    cat_fr: 'Formation Spécialisée', cat_ar: 'التكوين المتخصص', cat_en: 'Specialized Training',
  },
  {
    id: 'assistant', type: 'specialized' as const, num: '02',
    route: '/formation/specialized-technical-assistant',
    Icon: Wifi, color: '#1a5276',
    title_fr: 'Assistant Technique Spécialisé',
    title_ar: 'مساعد تقني متخصص',
    title_en: 'Specialized Technical Assistant',
    short_fr: 'Formation technique · Baccalauréat+2',
    short_ar: 'تكوين تقني · البكالوريا+2',
    short_en: 'Technical training · Baccalaureate+2',
    description_fr: "Formation préparant des techniciens qualifiés en transmissions, alliant théorie et pratique pour maîtriser l'installation, la maintenance et l'exploitation des équipements.",
    description_ar: 'تكوين يهدف إلى إعداد فنيين مؤهلين في المواصلات السلكيةو اللاسلكية، يجمع بين النظرية والتطبيق لإتقان التركيب والصيانة واستغلال المعدات.',
    description_en: 'Training preparing qualified technicians in transmissionss, combining theory and practice to master installation, maintenance and equipment operation.',
    duration_fr: '12 mois', duration_ar: '12 شهر', duration_en: '12 months',
    level_fr: 'Baccalauréat+2', level_ar: 'البكالوريا +2', level_en: 'Baccalaureate +2',
    diploma_fr: "Dip. Assistant Technique Spécialisé", diploma_ar: 'شهادة مساعد تقني متخصص', diploma_en: 'Specialized Technical Assistant Dip.',
   
    cat_fr: 'Formation Spécialisée', cat_ar: 'التكوين المتخصص', cat_en: 'Specialized Training',
  },
  {
    id: 'agent', type: 'specialized' as const, num: '03',
    route: '/formation/agent-exploitation',
    Icon: CheckCircle, color: '#0e6655',
    title_fr: "Agent d'Exploitation",
    title_ar: 'عون استغلال',
    title_en: 'Exploitation Agent',
    short_fr: 'Exploitation & maintenance · 3ème année secondaire',
    short_ar: 'استغلال وصيانة · سنة ثالثة ثانوي',
    short_en: 'Operation & maintenance · 3rd year secondary',
    description_fr: "Formation spécialisée dans l'exploitation et la maintenance des systèmes de transmissions : correspondances officielles, contrôle des signatures, maintenance des équipements de 1ère classe.",
    description_ar: 'تكوين متخصص في استغلال وصيانة أنظمة المواصلات السلكية واللاسلكية: استقبال المراسلات الرسمية، مراقبة صحة الإمضاءات، صيانة المعدات من الدرجة الأولى.',
    description_en: "Specialized training in transmissionss systems operation and maintenance: official correspondence, signature control, first-class equipment maintenance.",
    duration_fr: '12 mois', duration_ar: '12 شهر', duration_en: '12 months',
    level_fr: '3ème année secondaire', level_ar: 'السنة الثالثة الثانوية', level_en: '3rd year secondary',
    diploma_fr: "Dip. Agent d'Exploitation", diploma_ar: 'شهادة عون استغلال', diploma_en: 'Exploitation Agent Dip.',
    
    cat_fr: 'Formation Spécialisée', cat_ar: 'التكوين المتخصص', cat_en: 'Specialized Training',
  },
  {
    id: 'pre-promotion', type: 'continuous' as const, num: '04',
    route: '/formation/pre-promotion-training',
    Icon: TrendingUp, color: '#784212',
    title_fr: 'Formation avant Promotion',
    title_ar: 'التكوين قبل الترقية',
    title_en: 'Pre-Promotion Training',
    short_fr: 'Décision ministérielle 22 mars 2012',
    short_ar: 'قرار وزاري 22 مارس 2012',
    short_en: 'Ministerial decision March 22, 2012',
    description_fr: "Formation des agents promus par examens professionnels dans trois grades : Agent d'Exploitation, Assistant Technique Spécialisé et ATS Principal.",
    description_ar: 'تكوين الأعوان المرقين عن طريق الامتحانات المهنية في ثلاث رتب: عون استغلال، مساعد تقني متخصص، ومساعد تقني متخصص رئيسي.',
    description_en: 'Training for agents promoted through professional examinations in three grades: Exploitation Agent, Specialized Technical Assistant and Principal STA.',
    duration_fr: '30–90 jours', duration_ar: '30–90 يوم', duration_en: '30–90 days',
    level_fr: 'Agents en promotion', level_ar: 'أعوان في الترقية', level_en: 'Agents in promotion',
    diploma_fr: 'Attestation de formation', diploma_ar: 'شهادة تكوين', diploma_en: 'Training Certificate',
    capacity: null,
    cat_fr: 'Formation Continue', cat_ar: 'التكوين المتواصل', cat_en: 'Continuous Training',
  },
  {
    id: 'preparatory', type: 'continuous' as const, num: '05',
    route: '/formation/preparatory-training',
    Icon: Briefcase, color: '#512e5f',
    title_fr: 'Formation Préparatoire',
    title_ar: 'تكوين تحضيري لشغل منصب',
    title_en: 'Preparatory Training',
    short_fr: 'Lauréats des concours directs',
    short_ar: 'الناجحون في مسابقات التوظيف المباشر',
    short_en: 'Direct recruitment competition winners',
    description_fr: "Destinée aux fonctionnaires lauréats des concours de recrutement direct aux directions transmissoins de wilaya. Grades : Agent Operateur et ATS Principal.",
    description_ar: 'مخصصة للموظفين الناجحين في مسابقات التوظيف المباشر. تخص رتبتَي عون عامل ومساعد تقني متخصص رئيسي.',
    description_en: 'For officials who passed direct recruitment competitions at wilaya transmissionss directorates. Covers Agent Operator and Principal ATS grades.',
    duration_fr: '15–30 j. th. · 45–90 j. pr.', duration_ar: '15–30 يوم نظري · 45–90 يوم تطبيقي', duration_en: '15–30 days th. · 45–90 days pr.',
    level_fr: 'Lauréats de concours', level_ar: 'الناجحون في المسابقات', level_en: 'Competition winners',
    diploma_fr: 'Attestation préparatoire', diploma_ar: 'شهادة التكوين التحضيري', diploma_en: 'Preparatory Certificate',
    capacity: null,
    cat_fr: 'Formation Continue', cat_ar: 'التكوين المتواصل', cat_en: 'Continuous Training',
  },
  {
    id: 'continuous-training', type: 'continuous' as const, num: '06',
    route: '/formation/continuous-training',
    Icon: BookOpen, color: '#1a6b3c',
    title_fr: "Cours d'Amélioration du Niveau",
    title_ar: 'دورات تحسين المستوى',
    title_en: 'Level Improvement Courses',
    short_fr: 'Présentiel & distance · Tout le personnel',
    short_ar: 'حضوري وعن بعد · جميع الموظفين',
    short_en: 'In-person & remote · All staff',
    description_fr: "Cours méthodiques, rencontres, travaux dirigés et stages pratiques pour le personnel des transmissions nationales. En présentiel à l'école ou à distance via la plateforme virtuelle.",
    description_ar: 'دروس منهجية، ملتقيات، أعمال موجهة وتربصات تطبيقية لموظفي المواصلاتالسلكية واللاسلكية الوطنية. بالحضور أو عن بعد عبر المنصة الافتراضية.',
    description_en: 'Methodical courses, meetings, directed exercises and practical internships for national transmissionss staff. In-person or remotely via the virtual platform.',
    duration_fr: 'Variable', duration_ar: 'متغيرة', duration_en: 'Variable',
    level_fr: 'Tout le personnel', level_ar: 'جميع الموظفين', level_en: 'All staff',
    diploma_fr: 'Attestation de participation', diploma_ar: 'شهادة مشاركة', diploma_en: 'Participation Certificate',
    capacity: null,
    cat_fr: 'Formation Continue', cat_ar: 'التكوين المتواصل', cat_en: 'Continuous Training',
  },
];

// ─── Card Component ───────────────────────────────────────────────────────────
const ProgramCard = memo(({ program, index, lang }: {
  program: typeof PROGRAMS[0]; index: number; lang: Lang;
}) => {
  const { Icon } = program;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
      className="group"
    >
      <Link to={program.route} className="block h-full">
        <div className="relative h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5">

          {/* Top accent line */}
          <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${program.color}ee, ${program.color}40)` }} />

          {/* Card header */}
          <div className="relative p-6 pb-4">
            {/* Ghost number — editorial flourish */}
            <span
              className="absolute -top-1 right-4 text-[64px] font-black leading-none select-none pointer-events-none"
              style={{ color: `${program.color}08` }}
            >
              {program.num}
            </span>

            {/* Icon + badge */}
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${program.color}12`, border: `1.5px solid ${program.color}22` }}
              >
                <Icon className="w-5 h-5" style={{ color: program.color }} />
              </div>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                program.type === 'specialized'
                  ? 'bg-[#133059]/6 border-[#133059]/15 text-[#133059]'
                  : 'bg-[#e8c97a]/25 border-[#e8c97a]/50 text-amber-800'
              }`}>
                {program.type === 'specialized'
                  ? L('Spécialisé', 'متخصص', 'Specialized', lang)
                  : L('Continu', 'متواصل', 'Continuous', lang)}
              </span>
            </div>

            {/* Title + subtitle */}
            <h3 className="font-bold text-[17px] text-[#133059] leading-snug mb-1 group-hover:text-[#0a2342] transition-colors">
              {L(program.title_fr, program.title_ar, program.title_en, lang)}
            </h3>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: `${program.color}99` }}>
              {L(program.short_fr, program.short_ar, program.short_en, lang)}
            </p>
          </div>

          {/* Hairline */}
          <div className="mx-6 h-px bg-slate-100" />

          {/* Description */}
          <p className="px-6 py-4 text-[13px] text-slate-500 leading-relaxed line-clamp-3 flex-grow">
            {L(program.description_fr, program.description_ar, program.description_en, lang)}
          </p>

          {/* Info grid */}
          <div className="px-6 pb-4 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50/80 border border-slate-100">
              <Clock className="w-3.5 h-3.5 flex-shrink-0 text-[#e8c97a]" />
              <div className="min-w-0">
                <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">{L('Durée', 'المدة', 'Duration', lang)}</p>
                <p className="text-[11px] font-bold text-[#133059] truncate">{L(program.duration_fr, program.duration_ar, program.duration_en, lang)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50/80 border border-slate-100">
              <GraduationCap className="w-3.5 h-3.5 flex-shrink-0 text-[#e8c97a]" />
              <div className="min-w-0">
                <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">{L('Niveau', 'المستوى', 'Level', lang)}</p>
                <p className="text-[11px] font-bold text-[#133059] truncate">{L(program.level_fr, program.level_ar, program.level_en, lang)}</p>
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50/80 border border-slate-100">
              <Award className="w-3.5 h-3.5 flex-shrink-0 text-[#e8c97a]" />
              <p className="text-[11px] text-slate-600 truncate flex-grow">
                {L(program.diploma_fr, program.diploma_ar, program.diploma_en, lang)}
              </p>
              
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 pb-6">
            <div
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-xs font-bold transition-all duration-300 group-hover:gap-3"
              style={{ background: `linear-gradient(135deg, ${program.color}f0, ${program.color}b0)` }}
            >
              {L('Découvrir le programme', 'اكتشف البرنامج', 'Discover program', lang)}
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});
ProgramCard.displayName = 'ProgramCard';

// ─── Section label with extending line ───────────────────────────────────────
const SectionLabel = memo(({ Icon, label, count, lang }: {
  Icon: React.ElementType; label: string; count: number; lang: Lang;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="flex items-center gap-4 mb-10"
  >
    <div className="w-10 h-10 rounded-xl bg-[#133059] flex items-center justify-center text-white flex-shrink-0">
      <Icon style={{ width: 18, height: 18 }} />
    </div>
    <div>
      <h2 className="text-xl font-bold text-[#133059] leading-none">{label}</h2>
      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
        {count} {L('programme', 'برنامج', 'program', lang)}{count > 1 && lang !== 'ar' ? 's' : ''}
      </p>
    </div>
    <div className="flex-grow h-px bg-gradient-to-r from-slate-200 to-transparent" />
  </motion.div>
));
SectionLabel.displayName = 'SectionLabel';

// ─── Main Page ────────────────────────────────────────────────────────────────
const Formation = () => {
  const { language } = useLanguage();
  const lang = (language === 'ar' ? 'ar' : language === 'en' ? 'en' : 'fr') as Lang;
  const isRtl = lang === 'ar';

  const [searchTerm,   setSearchTerm]   = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'specialized' | 'continuous'>('all');

  // Parallax hero
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroO = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const FILTERS = [
    { id: 'all'         as const, label: L('Tous',         'الكل',              'All',          lang) },
    { id: 'specialized' as const, label: L('Spécialisée',  'التكوين المتخصص',   'Specialized',  lang) },
    { id: 'continuous'  as const, label: L('Continue',     'التكوين المتواصل',  'Continuous',   lang) },
  ];

  const filtered = PROGRAMS.filter(p => {
    if (activeFilter !== 'all' && p.type !== activeFilter) return false;
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return (
      p.title_fr.toLowerCase().includes(s) ||
      p.title_ar.includes(s) ||
      p.title_en.toLowerCase().includes(s) ||
      p.cat_fr.toLowerCase().includes(s)
    );
  });

  const specialized = filtered.filter(p => p.type === 'specialized');
  const continuous  = filtered.filter(p => p.type === 'continuous');

  return (
    <div className="min-h-screen bg-[#f7f8fa]" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative overflow-hidden bg-[#133059] pt-28 pb-20">

        {/* Geometric decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Concentric rings — top right */}
          <div className="absolute -right-40 -top-40 w-[640px] h-[640px] rounded-full border border-white/[0.04]" />
          <div className="absolute -right-40 -top-40 w-[480px] h-[480px] rounded-full border border-white/[0.06]" />
          <div className="absolute -right-40 -top-40 w-[320px] h-[320px] rounded-full border border-white/[0.08]" />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: 'radial-gradient(circle, #e8c97a 1px, transparent 1px)', backgroundSize: '30px 30px' }}
          />
          {/* Gold orb */}
          <div className="absolute -left-32 bottom-0 w-80 h-80 bg-[#e8c97a]/10 rounded-full blur-3xl" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#133059]" />
          {/* Left gold stripe */}
          <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-gradient-to-b from-[#e8c97a] via-[#e8c97a]/40 to-transparent" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroO }} className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full border border-white/15 bg-white/[0.07] backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e8c97a]" />
            <span className="text-white/75 text-[11px] font-bold uppercase tracking-[0.2em]">
              {L('École Nationale des Transmissions', 'المدرسة الوطنية للمواصلات', 'National School of transmissionss', lang)}
            </span>
          </motion.div>

          {/* Two-column layout */}
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-end">

            {/* Left — headline */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.02] tracking-tight mb-5"
              >
                {L('Nos', 'برامج', 'Our', lang)}
                <br />
                <span className="text-[#e8c97a]">
                  {L('Formations', 'التكوين', 'Programs', lang)}
                </span>
              </motion.h1>

              {/* Animated accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="h-[3px] w-14 bg-[#e8c97a] rounded-full mb-6 origin-left"
              />

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-white/55 text-lg leading-relaxed max-w-md"
              >
                {L(
                  'Programmes spécialisés et continus en Transmission, conçus pour développer l\'excellence professionnelle.',
                  'برامج متخصصة ومتواصلة في مجال المواصلات السلكية واللاسلكية، مصممة لتطوير الكفاءة المهنية.',
                  'Specialized and continuous programs in transmissionss designed to develop professional excellence.',
                  lang
                )}
              </motion.p>
            </div>

            {/* Right — stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="grid grid-cols-2 gap-3 min-w-[280px]"
            >
              {[
                { v: '6',   t: L('Programmes', 'برامج', 'Programs', lang),     s: L('au total', 'بالمجموع', 'total', lang) },
                { v: '3',   t: L('Spécialisés', 'متخصصة', 'Specialized', lang), s: L('programmes', 'برامج', 'programs', lang) },
                { v: '3',   t: L('Continus', 'متواصلة', 'Continuous', lang),    s: L('programmes', 'برامج', 'programs', lang) },
                { v: '15+', t: L('Années', 'سنوات', 'Years', lang),             s: L("d'expérience", 'خبرة', 'experience', lang) },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white/[0.07] border border-white/10 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/[0.11] transition-colors"
                >
                  <p className="text-3xl font-black text-[#e8c97a] leading-none mb-1">{s.v}</p>
                  <p className="text-white text-sm font-semibold leading-none">{s.t}</p>
                  <p className="text-white/35 text-[11px] mt-0.5">{s.s}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ STICKY SEARCH BAR ═══════════════ */}
      <div className="sticky top-16 z-30 bg-white/96 backdrop-blur-lg border-b border-slate-200/80 shadow-[0_1px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-3.5 flex flex-wrap items-center gap-3">

          {/* Search input */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              placeholder={L('Rechercher un programme...', 'البحث عن برنامج...', 'Search a program...', lang)}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`w-full h-9 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-[#133059] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#133059]/20 focus:border-[#133059]/40 transition-all ${isRtl ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4'}`}
            />
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5">
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all duration-200 ${
                  activeFilter === f.id
                    ? 'bg-[#133059] text-white shadow-sm shadow-[#133059]/25'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-[#133059]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Count */}
          <span className="ml-auto text-[11px] text-slate-400 font-medium hidden sm:block">
            {filtered.length} {L('résultat(s)', 'نتيجة', 'result(s)', lang)}
          </span>
        </div>
      </div>

      {/* ═══════════════ CONTENT ═══════════════ */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-10 py-14 space-y-14">

        {/* Specialized */}
        {specialized.length > 0 && (
          <section>
            <SectionLabel
              Icon={GraduationCap}
              label={L('Formation Spécialisée', 'التكوين المتخصص', 'Specialized Training', lang)}
              count={specialized.length}
              lang={lang}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {specialized.map((p, i) => (
                <ProgramCard key={p.id} program={p} index={i} lang={lang} />
              ))}
            </div>
          </section>
        )}

        {/* Continuous */}
        {continuous.length > 0 && (
          <section>
            <SectionLabel
              Icon={TrendingUp}
              label={L('Formation Continue', 'التكوين المتواصل', 'Continuous Training', lang)}
              count={continuous.length}
              lang={lang}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {continuous.map((p, i) => (
                <ProgramCard key={p.id} program={p} index={i} lang={lang} />
              ))}
            </div>
          </section>
        )}

        {/* Empty */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
              <Search className="w-7 h-7 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-[#133059] mb-2">
              {L('Aucun programme trouvé', 'لم يتم العثور على برنامج', 'No program found', lang)}
            </h3>
            <p className="text-sm text-slate-400">
              {L("Essayez d'autres mots-clés", 'جرب كلمات مفتاحية أخرى', 'Try different keywords', lang)}
            </p>
          </motion.div>
        )}

        {/* ═══════════════ CTA BANNER ═══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative rounded-3xl overflow-hidden bg-[#133059]">
            {/* Decorations */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full border border-white/[0.05]" />
              <div className="absolute -right-20 -bottom-20 w-56 h-56 rounded-full border border-white/[0.07]" />
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(circle, #e8c97a 1px, transparent 1px)', backgroundSize: '22px 22px' }}
              />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8c97a]/40 to-transparent" />
              <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-gradient-to-b from-[#e8c97a] via-[#e8c97a]/50 to-transparent" />
            </div>

            <div className="relative z-10 p-10 md:p-14 flex flex-col lg:flex-row items-start lg:items-center gap-10 justify-between">
              <div className="max-w-lg">
                
                <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                  {L(
                    'Rejoignez notre école d\'excellence',
                    'انضم إلى مدرستنا المتميزة',
                    'Join our school of excellence',
                    lang
                  )}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {L(
                    "Nous accueillons les étudiants motivés à rejoindre un environnement d'excellence académique en transmissions.",
                    'نرحب بالطلاب المتحمسين للانضمام إلى بيئة أكاديمية متميزة في مجال المواصلات لسلكية واللاسلكية.',
                    "We welcome motivated students to join an  environment of academic excellence in transmissionss.",
                    lang
                  )}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/contact"
                    className="group flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#e8c97a] text-[#133059] font-black text-sm hover:bg-[#f0d48a] transition-all duration-300 shadow-lg hover:shadow-[#e8c97a]/25"
                  >
                    {L('Contactez nous', 'تواصل معنا', 'Contact us', lang)}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/about"
                    className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl border border-white/20 text-white/65 hover:text-white hover:border-white/40 font-semibold text-sm transition-all duration-300 hover:bg-white/[0.07]"
                  >
                    {L('En savoir plus', 'اعرف المزيد', 'Learn more', lang)}
                    <ArrowUpRight className="w-4 h-4" />
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

export default Formation;
