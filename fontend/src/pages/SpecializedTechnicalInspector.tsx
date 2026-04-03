import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import {
  Network, Clock, Award, CheckCircle, Briefcase, FileText,
  Microscope, Users, Wifi, Database, Globe, Shield, Server,
  Cog, Building, ArrowRight, GraduationCap, Sparkles,
  ChevronRight, BookOpen, Settings, ClipboardList, UserCheck,
   AlertCircle, Cpu, Code, HardDrive,
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES & HELPERS
───────────────────────────────────────────────────────────────────────────── */
type Lang = 'fr' | 'ar' | 'en';
const L = (fr: string, ar: string, en: string, lang: Lang) =>
  lang === 'ar' ? ar : lang === 'en' ? en : fr;

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const DETAILS = {
  duration:  { fr: '12 mois',  ar: '12 شهر',  en: '12 months' },
  theory:    { fr: '9 mois théorie',  ar: '9 أشهر نظري',   en: '9 months theory'   },
  practice:  { fr: '3 mois pratique', ar: '3 أشهر تطبيقي', en: '3 months practical' },
  location:  { fr: 'Directions des Transmission de Wilaya', ar: 'مديريات المواصلات  السلكية و اللاسلكيةالولائية', en: 'Transmission Directorates of Wilayas' },
  diploma:   { fr: "Diplôme d'Inspecteur Technique Spécialisé", ar: 'شهادة مفتش تقني متخصص', en: 'Specialized Technical Inspector Diploma' },
  admission: { fr: 'Baccalauréat +5', ar: 'بكالوريا + 5', en: 'baccalaureate + 5' },
  language:  { fr: 'Français ,Anglais et Arabe ', ar: 'الفرنسية والعربية و الانجليزية', en: 'French ,English and Arabic' },
  capacity:  { fr: '30 étudiants', ar: '30 طالب', en: '30 students' },
};

const OVERVIEW_CARDS = [
  { Icon: Clock,       key: 'duration',  fr:'Durée',         ar:'المدة',        en:'Duration',  sub: (l:Lang) => L('9 mois théorie · 3 mois pratique','9 أشهر نظري · 3 أشهر تطبيقي','9 months theory · 3 months practical',l) },
  { Icon: Award,       key: 'diploma',   fr:'Diplôme',        ar:'الشهادة',      en:'Diploma',   sub: null },
  { Icon: CheckCircle, key: 'admission', fr:'Admission',      ar:'القبول',       en:'Admission', sub: null },
  { Icon: Users,       key: 'capacity',  fr:'Capacité',       ar:'العدد',        en:'Capacity',  sub: null },
  { Icon: Building,    key: 'location',  fr:'Stage Pratique', ar:'مكان التطبيق', en:'Practicum', sub: null },
  { Icon: Wifi,        key: 'language',  fr:'Langues',        ar:'اللغات',       en:'Languages', sub: null },
] as const;

const MISSIONS = [
  { Icon: Network,        fr:'Développement de réseaux et applications',                                        ar:'إنجاز وتطوير الشبكات وتطبيقات الإعلام الآلي والتسيير',      en:'Development of networks and IT management applications' },
  { Icon: Cog,            fr:'Préparation et exécution de projets techniques',                                   ar:'إعداد وتنفيذ المشاريع التقنية في مجال الاختصاص',             en:'Preparation and execution of technical projects' },
  { Icon: Database,       fr:'Gestion et supervision des réseaux et bases de données',                           ar:'التسيير والإشراف على الشبكات وقواعد المعطيات',               en:'Management and supervision of networks and databases' },
  { Icon: Globe,          fr:'Exploitation des réseaux, bases de données et sites web',                          ar:'استغلال الشبكات وقواعد المعطيات الخاصة ومواقع الويب',       en:'Exploitation of networks, databases and websites' },
  { Icon: Server,         fr:'Maintenance des réseaux et équipements',                                           ar:'صيانة الشبكات والأجهزة',                                     en:'Maintenance of networks and equipment' },
  { Icon: Microscope,     fr:'Développement de travaux de recherche dans le domaine',                             ar:'تطوير أشغال البحث في مجال الاختصاص',                        en:'Development of research work in the specialized field' },
  { Icon: FileText,       fr:"Élaboration des plans d'interventions techniques",                                  ar:'المشاركة في إعداد مخططات التدخلات التقنية',                 en:'Development of technical intervention plans' },
  { Icon: Settings,       fr:"Coordination des activités pour atteindre les objectifs de l'administration",       ar:'تنسيق النشاطات لتحقيق الأهداف التي تحددها الإدارة',         en:'Coordination of activities to achieve administrative objectives' },
  { Icon: Shield,         fr:'Gestion de projets en télécommunications, informatique et biométrie',               ar:'إدارة المشاريع في الاتصالات والإعلام الآلي والبيومترية',    en:'Project management in telecom, IT and biometrics' },
  { Icon: GraduationCap, fr:'Participation aux activités de formation',                                           ar:'المشاركة في نشاطات التكوين',                                en:'Participation in training activities' },
];

const OBJECTIVES = [
  { fr:'Expertise Technique',      ar:'الخبرة التقنية',      en:'Technical Expertise',
    dfr:"Former des inspecteurs capables d'évaluer, contrôler et certifier les installations et équipements de télécommunications.",
    dar:'تكوين مفتشين قادرين على تقييم ومراقبة واعتماد منشآت ومعدات الاتصالات.',
    den:'Train inspectors capable of evaluating, controlling and certifying transmissionss installations.' },
  { fr:'Gestion de Projets',       ar:'إدارة المشاريع',      en:'Project Management',
    dfr:'Développer des compétences en planification, coordination et supervision de projets techniques complexes.',
    dar:'تطوير المهارات في تخطيط وتنسيق والإشراف على المشاريع التقنية المعقدة.',
    den:'Develop skills in planning, coordination and supervision of complex technical projects.' },
  { fr:'Conformité Réglementaire', ar:'الامتثال التنظيمي',   en:'Regulatory Compliance',
    dfr:'Assurer la conformité des installations aux normes nationales et internationales en télécommunications.',
    dar:'ضمان امتثال المنشآت للمعايير الوطنية والدولية في مجال الاتصالات.',
    den:'Ensure installations comply with national and international transmissionss standards.' },
  { fr:'Innovation Technologique', ar:'الابتكار التكنولوجي', en:'Technological Innovation',
    dfr:"Préparer les étudiants à comprendre et intégrer les nouvelles technologies en télécommunications.",
    dar:'إعداد الطلاب لفهم ودمج التقنيات الجديدة في مجال الاتصالات.',
    den:'Prepare students to understand and integrate new transmissionss technologies.' },
];

const OFFICIAL_MODULES = [
  { num:1,  ar:'هندسة الشبكات و أنظمة الاتصال و الإعلام',            fr:"Architecture des réseaux et systèmes de télécommunications",  en:'Network Architecture and Telecom Systems',       cours:4, td:2, total:6,  coeff:4 },
  { num:2,  ar:'تصميم و تطوير و تأمين التطبيقات الخاصة',              fr:'Conception, développement et sécurisation des applications',  en:'Design, Development & Security of Applications', cours:2, td:2, total:4,  coeff:3 },
  { num:3,  ar:'تطوير و إدارة و تأمين المواصلات السلكية و اللاسلكية',  fr:'Développement, gestion et sécurisation des transmission',        en:'Development, Management & Security of Transmission', cours:3, td:2, total:5,  coeff:3 },
  { num:4,  ar:'معايير و قوانين تكنولوجيات الإعلام و الاتصال',         fr:"Normes et réglementations des TIC",                         en:'ICT Standards and Regulations',                  cours:4, td:0, total:4,  coeff:3 },
  { num:5,  ar:'مناجمنت المشاريع التقنية',                              fr:'Management des projets techniques',                          en:'Technical Project Management',                   cours:2, td:1, total:3,  coeff:3 },
  { num:6,  ar:'إدارة و تأمين الشبكات',                                fr:'Administration et sécurisation des réseaux',                 en:'Network Administration and Security',             cours:2, td:0, total:2,  coeff:2 },
  { num:7,  ar:'تسيير المجالات الطبيعية',                              fr:'Gestion des domaines naturels',                              en:'Natural Domain Management',                      cours:2, td:0, total:2,  coeff:2 },
  { num:8,  ar:'الطاقة و أنظمة الحماية الطاقوية',                      fr:'Énergie et systèmes de protection énergétique',              en:'Energy and Energy Protection Systems',            cours:2, td:0, total:2,  coeff:2 },
  { num:9,  ar:'نظم خدمة المواصلات السلكية و اللاسلكية',               fr:'Systèmes de service des transmission',                 en:'Transmission Service Systems',                        cours:2, td:0, total:2,  coeff:2 },
  { num:10, ar:'مصطلحات تقنية',                                         fr:'Terminologie technique',                                    en:'Technical Terminology',                          cours:2, td:0, total:2,  coeff:2 },
  { num:11, ar:'تقنيات الاتصال و التعبير',                              fr:"Techniques de communication et d'expression",               en:'Communication and Expression Techniques',        cours:2, td:0, total:2,  coeff:2 },
];

const SPECIALTIES = [
  { ar:'الإلكتروتقني',                         fr:'Électrotechnique',                          en:'Electrotechnics',           Icon: Wifi     },
  { ar:'الإلكترونيك',                          fr:'Électronique',                              en:'Electronics',               Icon: HardDrive },
  { ar:'الإعلام الآلي',                        fr:'Informatique',                              en:'Computer Science',          Icon: Code     },
  { ar:'صيانة و أمن الإعلام الآلي',            fr:'Maintenance et sécurité informatique',       en:'IT Maintenance & Security', Icon: Shield   },
  { ar:'أنظمة وتكنولوجيات الإعلام و الإتصال', fr:"Systèmes et technologies de l'information", en:'ICT Systems & Technologies',Icon: Network  },
];

type Tab = 'missions' | 'objectives' | 'table';

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION HEADING
───────────────────────────────────────────────────────────────────────────── */
const SectionHeading = ({ Icon: HIcon, num, title }: { Icon: React.ElementType; num: string; title: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="flex items-center gap-5 mb-12"
  >
    <div className="w-12 h-12 rounded-2xl bg-[#0c1b30] flex items-center justify-center flex-shrink-0"
      style={{ boxShadow: '0 8px 24px rgba(12,27,48,0.28)' }}>
      <HIcon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-[10px] font-bold text-[#e8c97a] uppercase tracking-[0.22em] mb-0.5"
        style={{ fontFamily: 'system-ui, sans-serif' }}>{num}</p>
      <h2 className="text-[26px] font-black text-[#0c1b30] tracking-[-0.025em] leading-none">
        {title}
      </h2>
    </div>
    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent hidden sm:block" />
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function SpecializedTechnicalInspector() {
  const { language } = useLanguage();
  const lang = (language === 'ar' ? 'ar' : language === 'en' ? 'en' : 'fr') as Lang;
  const isRtl = lang === 'ar';
  const t = (fr: string, ar: string, en: string) => L(fr, ar, en, lang);

  const [activeTab, setActiveTab] = useState<Tab>('missions');

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroO = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const TABS: { id: Tab; label: string }[] = [
    { id: 'missions',   label: t('Missions',         'المهام',        'Missions')        },
    { id: 'objectives', label: t('Objectifs',        'الأهداف',       'Objectives')      },
    { id: 'table',      label: t('Programme Officiel','الجدول الرسمي','Official Schedule') },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4]" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ══════════════════════════════════════════════════════════ HERO */}
      <section ref={heroRef} className="relative overflow-hidden bg-[#0c1b30] min-h-[90vh] flex items-center">

        {/* ── Layered background ── */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(ellipse 85% 65% at 65% -5%, rgba(25,58,100,0.95) 0%, transparent 60%),
              radial-gradient(ellipse 55% 80% at 105% 85%, rgba(232,201,122,0.04) 0%, transparent 50%),
              radial-gradient(ellipse 45% 55% at -8% 55%, rgba(15,40,75,0.7) 0%, transparent 55%)
            `,
          }} />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.032]" style={{
            backgroundImage: 'radial-gradient(circle, #e8c97a 1.2px, transparent 1.2px)',
            backgroundSize: '28px 28px',
          }} />
          {/* Horizontal accent lines */}
          {[28, 52, 76].map((pct, i) => (
            <div key={i} className="absolute left-0 right-0 h-px" style={{
              top: `${pct}%`,
              background: `linear-gradient(to right, transparent, rgba(232,201,122,${0.03 + i * 0.01}), transparent)`,
            }} />
          ))}
          {/* Concentric rings — bottom right */}
          {[680, 500, 345, 210, 105].map((s, i) => (
            <div key={i} className="absolute rounded-full" style={{
              bottom: -(s * 0.32), right: -(s * 0.22), width: s, height: s,
              border: `1px solid rgba(232,201,122,${[0.022, 0.038, 0.062, 0.1, 0.165][i]})`,
            }} />
          ))}
          {/* Gold top line */}
          <div className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: 'linear-gradient(to right, transparent 0%, #e8c97a 30%, #e8c97a 70%, transparent 100%)' }} />
          {/* Left stripe */}
          <div className="absolute top-0 left-0 bottom-0 w-[3px]"
            style={{ background: 'linear-gradient(180deg, #e8c97a 0%, rgba(232,201,122,0.45) 50%, transparent 100%)' }} />
        </div>

        {/* ── Hero content ── */}
        <motion.div style={{ y: heroY, opacity: heroO }}
          className="relative z-10 w-full max-w-[1320px] mx-auto px-6 md:px-12 py-28"
        >
          <div className="grid lg:grid-cols-[1fr_360px] gap-16 items-center">

            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#e8c97a]/22 bg-[#e8c97a]/[0.07]">
                  <Sparkles className="w-3 h-3 text-[#e8c97a]" />
                  <span className="text-[#e8c97a]/75 text-[10px] font-bold uppercase tracking-[0.22em]"
                    style={{ fontFamily: 'system-ui, sans-serif' }}>
                    {t('Programme Spécialisé', 'برنامج متخصص', 'Specialized Program')}
                  </span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-black text-white leading-[1.0] tracking-[-0.03em] mb-7"
                style={{ fontSize: 'clamp(46px, 6.5vw, 82px)', fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {t('Inspecteur', 'مفتش', 'Specialized')}<br />
                <span style={{ color: '#e8c97a' }}>{t('Technique', 'تقني', 'Technical')}</span><br />
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>{t('Spécialisé', 'متخصص', 'Inspector')}</span>
              </motion.h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="h-[3px] w-16 rounded-full mb-8 origin-left"
                style={{ background: 'linear-gradient(to right, #e8c97a, rgba(232,201,122,0.25))' }}
              />

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28 }}
                className="text-[15.5px] leading-[1.9] max-w-[490px] mb-10"
                style={{ color: 'rgba(255,255,255,0.42)', fontFamily: 'system-ui, sans-serif' }}
              >
                {t(
                  "Formation d'excellence combinant connaissances théoriques avancées et pratique intensive pour préparer les experts des réseaux et systèmes des transmissions.",
                  'برنامج تكويني متميز يجمع بين المعرفة النظرية المتقدمة والتدريب العملي المكثف لإعداد خبراء في شبكات وأنظمة المواصلات السلكية و اللاسلكية.',
                  'An excellence program combining advanced theoretical knowledge and intensive practical training to prepare experts in transmissionss networks and systems.',
                )}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.44 }}
                className="flex items-center gap-5 flex-wrap"
              >
                <Link to="/contact"
                  className="group flex items-center gap-2.5 px-7 py-3.5 rounded-[14px] font-bold text-[13px] text-[#0c1b30] transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #e8c97a, #f5dfa0)',
                    boxShadow: '0 10px 36px rgba(232,201,122,0.35)',
                    fontFamily: 'system-ui, sans-serif',
                  }}
                >
                  {t('Postuler maintenant', 'التسجيل الآن', 'Apply Now')}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link to="/formation"
                  className="flex items-center gap-1.5 text-[13px] font-semibold transition-colors"
                  style={{ color: 'rgba(255,255,255,0.38)', fontFamily: 'system-ui, sans-serif' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}
                >
                  <ChevronRight className="w-4 h-4" />
                  {t('Tous les programmes', 'كل البرامج', 'All programs')}
                </Link>
              </motion.div>
            </div>

            {/* Right — stat cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { v: '12', u: t('mois','شهر','months'), l: t('Durée totale','المدة','Total Duration') },
                { v: 'Bac', u: '+3', l: t('Niveau requis','المستوى','Level') },
                { v: '30', u: t('places','مقعد','seats'), l: t('Capacité','العدد','Capacity') },
                { v: '9+3', u: t('mois','أشهر','months'), l: t('Théorie·Pratique','نظري·تطبيقي','Theory·Practice') },
              ].map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.38 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  className="relative p-5 rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(8px)',
                  }}
                  whileHover={{ background: 'rgba(255,255,255,0.08)' } as any}
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
                  <p className="text-[30px] font-black text-[#e8c97a] leading-none mb-2"
                    style={{ fontFamily: "Georgia, serif" }}>
                    {s.v}<span className="text-[15px] font-semibold ml-0.5" style={{ color: 'rgba(232,201,122,0.55)' }}>{s.u}</span>
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em]"
                    style={{ color: 'rgba(255,255,255,0.32)', fontFamily: 'system-ui, sans-serif' }}>{s.l}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll pulse */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-[1px] h-10 overflow-hidden mx-auto">
            <motion.div
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full h-full"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(232,201,122,0.5), transparent)' }}
            />
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════ BREADCRUMB */}
      <div className="sticky top-16 z-40 bg-white/96 backdrop-blur-xl border-b border-slate-100/70"
        style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.03)' }}>
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 py-3 flex items-center gap-2">
          <Link to="/formation" className="text-[12px] font-medium text-slate-400 hover:text-[#0c1b30] transition-colors"
            style={{ fontFamily: 'system-ui, sans-serif' }}>
            {t('Formations','التكوين','Programs')}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
          <span className="text-[12px] font-bold text-[#0c1b30]"
            style={{ fontFamily: 'system-ui, sans-serif' }}>
            {t('Inspecteur Technique Spécialisé','مفتش تقني متخصص','Specialized Technical Inspector')}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ MAIN */}
      <main className="max-w-[1320px] mx-auto px-6 md:px-12 py-20 space-y-24">

        {/* ── 01 OVERVIEW ── */}
        <section>
          <SectionHeading Icon={BookOpen} num="01" title={t("Aperçu du Programme", 'نظرة عامة على البرنامج', 'Program Overview')} />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[15px] text-slate-500 leading-[1.9] max-w-3xl mb-14"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            {t(
              "Le programme d'Inspecteur Technique Spécialisé est une formation d'excellence visant à préparer des experts techniques qualifiés dans le domaine des transmissions. Il combine connaissances théoriques avancées et formation pratique intensive pour doter les étudiants des compétences nécessaires dans ce domaine en constante évolution.",
              'برنامج مفتش تقني متخصص هو برنامج تكويني متميز يهدف إلى إعداد خبراء تقنيين مؤهلين في مجال الاتصالات السلكية واللاسلكية، يجمع بين المعرفة النظرية المتقدمة والتدريب العملي المكثف.',
              'The Specialized Technical Inspector program is an excellence training course aimed at preparing qualified technical experts in transmissionss, combining advanced theoretical knowledge and intensive practical training.',
            )}
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OVERVIEW_CARDS.map(({ Icon: CIcon, key, fr, ar, en, sub }, i) => (
              <motion.div key={key}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
                className="group relative bg-white rounded-2xl p-6 border border-slate-100 overflow-hidden cursor-default transition-all duration-300"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                whileHover={{ y: -5, boxShadow: '0 18px 52px rgba(12,27,48,0.1)' } as any}
              >
                {/* Hover accent top */}
                <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(to right, transparent, #e8c97a, transparent)' }} />

                <div className="w-10 h-10 rounded-xl bg-[#0c1b30]/7 flex items-center justify-center mb-4 group-hover:bg-[#0c1b30]/13 transition-colors">
                  <CIcon style={{ width: 18, height: 18, color: '#0c1b30' }} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-1.5"
                  style={{ color: '#e8c97a', fontFamily: 'system-ui, sans-serif' }}>
                  {L(fr, ar, en, lang)}
                </p>
                <p className="text-[14px] font-bold text-[#0c1b30] leading-snug"
                  style={{ fontFamily: "Georgia, serif" }}>
                  {L((DETAILS as any)[key].fr, (DETAILS as any)[key].ar, (DETAILS as any)[key].en, lang)}
                </p>
                {sub && (
                  <p className="text-[11.5px] text-slate-400 mt-1.5"
                    style={{ fontFamily: 'system-ui, sans-serif' }}>{sub(lang)}</p>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 02 CONTENT TABS ── */}
        <section>
          <SectionHeading Icon={Briefcase} num="02" title={t("Contenu du Programme", 'محتوى البرنامج', 'Program Content')} />

          {/* Tab bar */}
          <div className="flex gap-1 p-1 rounded-xl border border-slate-200/80 bg-white w-fit mb-8"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.04)', fontFamily: 'system-ui, sans-serif' }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-2.5 rounded-[10px] text-[12.5px] font-bold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#0c1b30] text-white'
                    : 'text-slate-500 hover:text-[#0c1b30] hover:bg-slate-50/80'
                }`}
                style={activeTab === tab.id ? { boxShadow: '0 4px 18px rgba(12,27,48,0.22)' } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* MISSIONS */}
            {activeTab === 'missions' && (
              <motion.div key="missions"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {MISSIONS.map(({ Icon: MIcon, fr, ar, en }, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="group flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-100 transition-all duration-300"
                      style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.03)' }}
                      whileHover={{ borderColor: 'rgba(12,27,48,0.2)', boxShadow: '0 8px 32px rgba(12,27,48,0.08)' } as any}
                    >
                      <div className="flex-shrink-0 flex flex-col items-center gap-2 pt-0.5">
                        <span className="text-[10px] font-black tabular-nums"
                          style={{ color: '#e8c97a', fontFamily: 'system-ui, sans-serif' }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-[#0c1b30]/6 flex items-center justify-center group-hover:bg-[#0c1b30]/12 transition-colors">
                          <MIcon style={{ width: 14, height: 14, color: '#0c1b30' }} />
                        </div>
                      </div>
                      <p className="text-[13.5px] text-slate-600 leading-[1.7]"
                        style={{ fontFamily: 'system-ui, sans-serif' }}>
                        {L(fr, ar, en, lang)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* OBJECTIVES */}
            {activeTab === 'objectives' && (
              <motion.div key="objectives"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {OBJECTIVES.map((obj, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.5 }}
                      className="relative bg-white rounded-2xl p-8 border border-slate-100 overflow-hidden"
                      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                      whileHover={{ boxShadow: '0 14px 44px rgba(12,27,48,0.09)', y: -4 } as any}
                    >
                      {/* Ghost number */}
                      <span className="absolute top-3 right-5 text-[80px] font-black leading-none select-none pointer-events-none"
                        style={{ color: 'rgba(12,27,48,0.03)', fontFamily: "Georgia, serif" }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {/* Left accent */}
                      <div className="absolute top-0 left-0 bottom-0 w-[3px] rounded-l-2xl"
                        style={{ background: 'linear-gradient(180deg, #e8c97a, rgba(232,201,122,0.4), transparent)' }} />
                      <div className="pl-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-3"
                          style={{ color: '#e8c97a', fontFamily: 'system-ui, sans-serif' }}>
                          {t('Objectif','هدف','Objective')} {String(i + 1).padStart(2, '0')}
                        </p>
                        <h3 className="text-[19px] font-black text-[#0c1b30] mb-3 leading-snug tracking-[-0.015em]"
                          style={{ fontFamily: "Georgia, serif" }}>
                          {L(obj.fr, obj.ar, obj.en, lang)}
                        </h3>
                        <p className="text-[13.5px] text-slate-500 leading-[1.75]"
                          style={{ fontFamily: 'system-ui, sans-serif' }}>
                          {L(obj.dfr, obj.dar, obj.den, lang)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* OFFICIAL TABLE */}
            {activeTab === 'table' && (
              <motion.div key="table"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}
              >
                {/* Header banner */}
                <div className="relative rounded-2xl overflow-hidden bg-[#0c1b30] mb-6 p-7">
                  <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: 'radial-gradient(circle, #e8c97a 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }} />
                  {[260,180,100].map((s,i) => (
                    <div key={i} className="absolute rounded-full" style={{
                      top: -(s*0.3), right: -(s*0.2), width: s, height: s,
                      border: `1px solid rgba(232,201,122,${[0.06,0.1,0.18][i]})`,
                    }} />
                  ))}
                  <div className="absolute top-0 left-0 bottom-0 w-[3px]"
                    style={{ background: 'linear-gradient(180deg, #e8c97a, rgba(232,201,122,0.4), transparent)' }} />
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div>
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#e8c97a]/25 bg-[#e8c97a]/10 mb-3">
                        <span className="text-[#e8c97a] text-[10px] font-black uppercase tracking-[0.18em]"
                          style={{ fontFamily: 'system-ui, sans-serif' }}>
                          {t('الملحق 3 — Document officiel','الملحق 3 — وثيقة رسمية','Annex 3 — Official Document')}
                        </span>
                      </span>
                      <h3 className="text-white font-black text-[18px] leading-snug"
                        style={{ fontFamily: "Georgia, serif" }}>
                        {t('Programme de Formation — Inspecteur Technique Spécialisé','برنامج التكوين المتخصص لرتبة مفتش تقني متخصص','Specialized Training Program — Technical Inspector')}
                      </h3>
                    </div>
                    <div className="flex gap-6 flex-shrink-0">
                      {[
                        {v:'1',  u:t('an','سنة','yr'),   l:t('Durée','المدة','Duration')},
                        {v:'9',  u:t('mois','أشهر','mths'),l:t('Théorie','نظري','Theory')},
                        {v:'3',  u:t('mois','أشهر','mths'),l:t('Pratique','تطبيقي','Practice')},
                      ].map((s,i) => (
                        <div key={i} className="text-center">
                          <p className="text-[24px] font-black text-[#e8c97a] leading-none"
                            style={{ fontFamily: "Georgia, serif" }}>
                            {s.v}<span className="text-[13px] font-semibold ml-0.5" style={{ color: 'rgba(232,201,122,0.55)' }}>{s.u}</span>
                          </p>
                          <p className="text-[10px] text-white/40 font-bold mt-1 uppercase tracking-wide"
                            style={{ fontFamily: 'system-ui, sans-serif' }}>{s.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
                  style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
                  {/* Header */}
                  <div dir="rtl" className="grid bg-[#0c1b30] text-white"
                    style={{ gridTemplateColumns: '44px 1fr 58px 58px 60px 66px', fontFamily: 'system-ui, sans-serif' }}>
                    {[
                      { l: t('رقم','رقم','No.'),      cls: 'justify-center border-r border-white/10 text-center' },
                      { l: t('الوحدات','الوحدات','Modules'), cls: 'justify-start px-5 border-r border-white/10' },
                      { l: t('دروس','دروس','Cours'),   cls: 'justify-center border-r border-white/10 text-center' },
                      { l: t('أ.م','أ.م','TD'),        cls: 'justify-center border-r border-white/10 text-center' },
                      { l: t('مجموع','مجموع','Total'), cls: 'justify-center border-r border-white/10 text-center' },
                      { l: t('معامل','معامل','Coef.'), cls: 'justify-center text-center text-[#e8c97a]' },
                    ].map((h, i) => (
                      <div key={i} className={`flex items-center ${h.cls} py-4 text-[10.5px] font-black uppercase tracking-[0.08em]`}>
                        {h.l}
                      </div>
                    ))}
                  </div>

                  {/* Rows */}
                  {OFFICIAL_MODULES.map((mod, i) => (
                    <motion.div key={mod.num} dir="rtl"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.033, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="grid border-b border-slate-100 hover:bg-[#0c1b30]/[0.02] transition-colors"
                      style={{ gridTemplateColumns: '44px 1fr 58px 58px 60px 66px', background: i % 2 === 1 ? '#fafafa' : 'white' }}
                    >
                      <div className="flex items-center justify-center border-r border-slate-100 py-4">
                        <span className="text-[11px] font-black text-slate-300 tabular-nums"
                          style={{ fontFamily: 'system-ui, sans-serif' }}>{String(mod.num).padStart(2,'0')}</span>
                      </div>
                      <div className="px-5 py-4 border-r border-slate-100 flex flex-col justify-center gap-0.5">
                        <p className="text-[13px] font-bold text-[#0c1b30] leading-snug" dir="rtl"
                          style={{ fontFamily: "Georgia, serif" }}>{mod.ar}</p>
                        {lang !== 'ar' && (
                          <p className="text-[11px] text-slate-400 leading-snug" dir="ltr"
                            style={{ fontFamily: 'system-ui, sans-serif' }}>
                            {lang === 'en' ? mod.en : mod.fr}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-center border-r border-slate-100">
                        <span className="text-[13px] font-bold text-[#0c1b30] tabular-nums"
                          style={{ fontFamily: 'system-ui, sans-serif' }}>{mod.cours || '—'}</span>
                      </div>
                      <div className="flex items-center justify-center border-r border-slate-100">
                        <span className="text-[13px] text-slate-400 tabular-nums"
                          style={{ fontFamily: 'system-ui, sans-serif' }}>{mod.td || '—'}</span>
                      </div>
                      <div className="flex items-center justify-center border-r border-slate-100">
                        <span className="text-[13px] font-black text-[#0c1b30] tabular-nums"
                          style={{ fontFamily: 'system-ui, sans-serif' }}>{mod.total}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-[12px] font-black ${
                          mod.coeff >= 4
                            ? 'text-[#0c1b30]'
                            : mod.coeff === 3
                            ? 'text-[#0c1b30]'
                            : 'text-slate-500'
                        }`}
                          style={{
                            fontFamily: 'system-ui, sans-serif',
                            background: mod.coeff >= 4 ? '#e8c97a' : mod.coeff === 3 ? 'rgba(12,27,48,0.1)' : '#f1f5f9',
                          }}>
                          {mod.coeff}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Total */}
                  <div dir="rtl" className="grid border-t-2 border-[#0c1b30]/15 bg-[#0c1b30]/4"
                    style={{ gridTemplateColumns: '44px 1fr 58px 58px 60px 66px' }}>
                    <div className="border-r border-slate-200" />
                    <div className="px-5 py-4 border-r border-slate-200 flex items-center">
                      <span className="text-[12px] font-black text-[#0c1b30] uppercase tracking-widest"
                        style={{ fontFamily: 'system-ui, sans-serif' }}>
                        {t(' Total ','المجموع العام','Grand Total')}
                      </span>
                    </div>
                    <div className="flex items-center justify-center border-r border-slate-200">
                      <span className="text-[14px] font-black text-[#0c1b30]"
                        style={{ fontFamily: 'system-ui, sans-serif' }}>
                        {OFFICIAL_MODULES.reduce((s,m)=>s+m.cours,0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-center border-r border-slate-200">
                      <span className="text-[14px] font-black text-[#0c1b30]"
                        style={{ fontFamily: 'system-ui, sans-serif' }}>
                        {OFFICIAL_MODULES.reduce((s,m)=>s+m.td,0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-center border-r border-slate-200">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0c1b30] text-[#e8c97a] text-[14px] font-black"
                        style={{ fontFamily: 'system-ui, sans-serif' }}>
                        {OFFICIAL_MODULES.reduce((s,m)=>s+m.total,0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-slate-300 text-sm">—</span>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-5 text-[11.5px] text-slate-400"
                  style={{ fontFamily: 'system-ui, sans-serif' }}>
                  {[
                    { bg: '#e8c97a',             l: t('Coefficient ≥ 4','معامل ≥ 4','Coeff. ≥ 4') },
                    { bg: 'rgba(12,27,48,0.1)',   l: t('Coefficient 3','معامل 3','Coeff. 3') },
                    { bg: '#f1f5f9',              l: t('Coefficient 2','معامل 2','Coeff. 2') },
                  ].map((item,i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ background: item.bg }} />
                      {item.l}
                    </div>
                  ))}
                  <span className="ml-auto font-semibold" style={{ color: 'rgba(12,27,48,0.4)' }}>
                    {t('Source : الملحق 3','المصدر : الملحق 3','Source: Annex 3')}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── 03 HOW TO APPLY ── */}
        <section>
          <SectionHeading Icon={ClipboardList} num="03" title={t('Comment Postuler','كيفية التسجيل','How to Apply')} />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-[15px] text-slate-500 leading-[1.85] max-w-3xl mb-12"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            {t(
              "Vous pouvez intégrer la formation à l'École Nationale des Transmissions après avoir réussi la concours organisée par la Direction Générale des Transmissions ُ(rattachée au Ministère de l'Intérieur, des Collectivités Locales et des Transports) ou par d'autres institutions habilitées.",
              'يمكنك الالتحاق بالتكوين في المدرسة الوطنية للمواصلات السلكية واللاسلكية بعد نجاحك في المسابقة المنظمة من طرف المديرية العامة للمواصلات السلكية واللاسلكية التابعة لوزارة الداخلية والجماعات المحلية والنقل  أو هيئات أخرى.',
              'You can join the training at the National School of transmissionss after passing the competition organized by the General Directorate of transmissions (Ministry of Interior) or other authorized bodies.',
            )}
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Diploma card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="w-9 h-9 rounded-xl bg-[#0c1b30] flex items-center justify-center flex-shrink-0">
                  <GraduationCap style={{ width: 16, height: 16, color: 'white' }} />
                </div>
                <h3 className="text-[15px] font-black text-[#0c1b30]"
                  style={{ fontFamily: 'system-ui, sans-serif' }}>
                  {t('Diplôme requis pour la concours','الشهادة المطلوبة للمسابقة','Required Diploma')}
                </h3>
              </div>

              <div className="p-6">
                {/* Master featured card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative rounded-2xl overflow-hidden p-7 mb-5"
                  style={{ background: 'linear-gradient(135deg, #0c1b30 0%, #1e3d66 100%)' }}
                >
                  <div className="absolute inset-0 opacity-[0.05]" style={{
                    backgroundImage: 'radial-gradient(circle, #e8c97a 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                  }} />
                  <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: 'linear-gradient(to right, transparent, #e8c97a, transparent)' }} />
                  {/* Glow ring */}
                  <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(232,201,122,0.08), transparent 70%)', transform: 'translate(40%, 40%)' }} />

                  <div className="relative z-10 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(232,201,122,0.13)', border: '1px solid rgba(232,201,122,0.25)' }}>
                      <Award style={{ width: 22, height: 22, color: '#e8c97a' }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="text-[22px] font-black text-[#e8c97a]"
                          style={{ fontFamily: "Georgia, serif" }}>
                          {t('Master','ماستر','Master')}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#e8c97a] text-[#0c1b30] text-[10px] font-black uppercase tracking-wide"
                          style={{ fontFamily: 'system-ui, sans-serif' }}>Bac +5</span>
                      </div>
                      <p className="text-[12.5px]" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'system-ui, sans-serif' }}>
                        {t('Diplôme requis pour accéder au programme','الشهادة المطلوبة للالتحاق بالبرنامج','Diploma required to access the program')}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Note */}
                <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border"
                  style={{ background: 'rgba(12,27,48,0.04)', borderColor: 'rgba(12,27,48,0.08)' }}>
                  <AlertCircle style={{ width: 15, height: 15, color: 'rgba(12,27,48,0.45)', flexShrink: 0, marginTop: 2 }} />
                  <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(12,27,48,0.55)', fontFamily: 'system-ui, sans-serif' }}>
                    {t(
                      "Cette shéhada permet la participation à la concours sur dossier ou sur la base des examens pour l'accès au grade de Mufatich Taqni Mutakhassis.",
                      'هذه الشهادة تسمح لحاملها بالمشاركة في المسابقة على أساس الاختبارات أو على أساس الشهادة للالتحاق برتبة مفتش تقني متخصص.',
                      'This diploma allows holders to participate in the competition through examination or diploma-based selection for the Specialized Technical Inspector grade.',
                    )}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right column */}
            <div className="space-y-5">

              {/* Conditions */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}
              >
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <div className="w-9 h-9 rounded-xl bg-[#0c1b30] flex items-center justify-center flex-shrink-0">
                    <UserCheck style={{ width: 16, height: 16, color: 'white' }} />
                  </div>
                  <h3 className="text-[15px] font-black text-[#0c1b30]"
                    style={{ fontFamily: 'system-ui, sans-serif' }}>
                    {t('Conditions de participation','شروط المشاركة','Participation Conditions')}
                  </h3>
                </div>
                <div className="p-5 grid grid-cols-2 gap-3">
                  {[
                    { Icon: Users,    l: t('Âge','السن','Age'),             v: t('Non limité','غير محدد','Not limited') },
                    { Icon: Globe,    l: t('Nationalité','الجنسية','Nat.'), v: t('Algérienne','جزائرية','Algerian') },
                    { Icon: Award,    l: t('Mode','الطريقة','Mode'),         v: t('Concours','مسابقة','Competition') },
                    { Icon: Building, l: t('Organisateur','المنظم','Org.'), v: t('DGTN','المديرية العامة','DGTN') },
                  ].map(({ Icon: CIcon, l, v }, i) => (
                    <div key={i} className="flex flex-col gap-1.5 p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <CIcon style={{ width: 12, height: 12, color: '#e8c97a' }} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide"
                          style={{ fontFamily: 'system-ui, sans-serif' }}>{l}</span>
                      </div>
                      <span className="text-[13px] font-bold text-[#0c1b30]"
                        style={{ fontFamily: 'system-ui, sans-serif' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Specialties */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}
              >
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <div className="w-9 h-9 rounded-xl bg-[#0c1b30] flex items-center justify-center flex-shrink-0">
                    <Cpu style={{ width: 16, height: 16, color: 'white' }} />
                  </div>
                  <h3 className="text-[15px] font-black text-[#0c1b30]"
                    style={{ fontFamily: 'system-ui, sans-serif' }}>
                    {t('Spécialités requises','التخصصات المطلوبة','Required Specialties')}
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  {SPECIALTIES.map((spec, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-100 transition-all duration-200"
                      style={{ background: '#fafafa' }}
                      whileHover={{ borderColor: 'rgba(12,27,48,0.15)', background: 'rgba(12,27,48,0.02)' } as any}
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#0c1b30]/7 flex items-center justify-center flex-shrink-0">
                        <spec.Icon style={{ width: 13, height: 13, color: '#0c1b30' }} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-[#0c1b30]" dir="rtl"
                          style={{ fontFamily: "Georgia, serif" }}>{spec.ar}</p>
                        {lang !== 'ar' && (
                          <p className="text-[11px] text-slate-400"
                            style={{ fontFamily: 'system-ui, sans-serif' }}>
                            {lang === 'en' ? spec.en : spec.fr}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative rounded-[28px] overflow-hidden bg-[#0c1b30]"
            style={{ boxShadow: '0 28px 80px rgba(12,27,48,0.32)' }}>

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse 65% 85% at 100% 50%, rgba(232,201,122,0.06) 0%, transparent 60%)',
              }} />
              <div className="absolute inset-0 opacity-[0.033]" style={{
                backgroundImage: 'radial-gradient(circle, #e8c97a 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }} />
              {[320,220,130].map((s,i) => (
                <div key={i} className="absolute rounded-full" style={{
                  bottom: -(s*0.38), right: -(s*0.18), width: s, height: s,
                  border: `1px solid rgba(232,201,122,${[0.055,0.1,0.18][i]})`,
                }} />
              ))}
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(to right, transparent, #e8c97a 35%, #e8c97a 65%, transparent)' }} />
              <div className="absolute top-0 left-0 bottom-0 w-[3px]"
                style={{ background: 'linear-gradient(180deg, #e8c97a, rgba(232,201,122,0.35), transparent)' }} />
            </div>

            <div className="relative z-10 p-10 md:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
              <div className="max-w-[520px]">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e8c97a]/28 bg-[#e8c97a]/[0.09] mb-5">
                  <Sparkles style={{ width: 12, height: 12, color: '#e8c97a' }} />
                  <span className="text-[#e8c97a] text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{ fontFamily: 'system-ui, sans-serif' }}>
                    {t('Candidatures ouvertes','التسجيل مفتوح','Applications open')}
                  </span>
                </div>
                <h3 className="font-black text-white leading-[1.1] tracking-[-0.025em] mb-4"
                  style={{ fontSize: 'clamp(28px,3.5vw,40px)', fontFamily: "Georgia, serif" }}>
                  {t("Intéressé par ce programme ?","هل أنت مهتم بهذا البرنامج؟","Interested in this program?")}
                </h3>
                <p className="text-[14px] leading-[1.75]" style={{ color: 'rgba(255,255,255,0.42)', fontFamily: 'system-ui, sans-serif' }}>
                  {t(
                    "Découvrez les conditions d'admission et les procédures d'inscription au programme d'Inspecteur Technique Spécialisé.",
                    'اكتشف شروط القبول وإجراءات التسجيل في برنامج مفتش تقني متخصص.',
                    'Discover admission requirements and registration procedures for the Specialized Technical Inspector program.',
                  )}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/contact"
                    className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-[14px] font-black text-[13px] text-[#0c1b30] transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #e8c97a, #f5dfa0)',
                      boxShadow: '0 10px 36px rgba(232,201,122,0.38)',
                      fontFamily: 'system-ui, sans-serif',
                    }}
                  >
                    {t('Nous contacter','تواصل معنا','Contact Us')}
                    <ArrowRight style={{ width: 16, height: 16 }} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/formation"
                    className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-[14px] font-semibold text-[13px] transition-all"
                    style={{
                      border: '1px solid rgba(255,255,255,0.18)',
                      color: 'rgba(255,255,255,0.5)',
                      fontFamily: 'system-ui, sans-serif',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.38)';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    {t('Autres programmes','برامج أخرى','Other Programs')}
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

      </main>
    </div>
  );
}
