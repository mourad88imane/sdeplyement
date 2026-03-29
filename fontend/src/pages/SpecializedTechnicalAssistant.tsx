import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import {
  GraduationCap, Clock, Calendar, Award, FileText, Network, Cpu, Radio,
  Settings, Smartphone,  Zap, Video, Database, Server, ArrowRight,
  CheckCircle, BookOpen, Users, Target, ChevronRight, Sparkles, Shield,
  ClipboardList, Send
} from 'lucide-react';

import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Formation, FormationAPI } from '@/services/api';
/* ------------------------------------------------------------------ */
/*  Reusable sub-components                                            */
/* ------------------------------------------------------------------ */
const SectionHeading = ({
  icon: Icon,
  title,
  subtitle,
  center = false,
}: {
  icon?: React.ElementType;
  title: string;
  subtitle?: string;
  center?: boolean;
}) => (
  <div className={center ? 'text-center mb-14' : 'mb-12'}>
    <div className={`flex items-center gap-3 mb-4 ${center ? 'justify-center' : ''}`}>
      {Icon && (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#133059] to-[#1a4080] text-white shadow-lg shadow-[#133059]/20">
          <Icon className="w-5 h-5" />
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#133059] via-[#1a4080] to-[#133059] bg-clip-text text-transparent tracking-tight">
        {title}
      </h2>
    </div>
    <div className={`h-1 w-16 rounded-full bg-gradient-to-r from-[#e8c97a] to-[#d4a853] ${center ? 'mx-auto' : ''} mb-4`} />
    {subtitle && (
      <p className={`text-slate-500 text-lg leading-relaxed max-w-2xl ${center ? 'mx-auto' : ''}`}>
        {subtitle}
      </p>
    )}
  </div>
);
const StatCard = ({
  icon: Icon,
  label,
  value,
  description,
  accent = 'blue',
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  description?: string;
  accent?: 'blue' | 'gold';
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const accentColors = accent === 'gold'
    ? { bg: 'from-[#e8c97a]/15 to-[#d4a853]/10', border: 'border-[#e8c97a]/20 hover:border-[#e8c97a]/40', icon: 'from-[#e8c97a] to-[#d4a853]', shadow: 'shadow-[#e8c97a]/10' }
    : { bg: 'from-[#133059]/10 to-[#1a4080]/5', border: 'border-[#133059]/10 hover:border-[#133059]/30', icon: 'from-[#133059] to-[#1a4080]', shadow: 'shadow-[#133059]/10' };
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative bg-white rounded-2xl p-7 border ${accentColors.border} transition-all duration-500 hover:shadow-xl ${accentColors.shadow} hover:-translate-y-1`}
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accentColors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${accentColors.icon} text-white mb-5 shadow-lg ${accentColors.shadow} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.15em] mb-1">{label}</p>
        <p className="text-2xl font-bold text-[#133059] mb-1">{value}</p>
        {description && <p className="text-sm text-slate-500 leading-relaxed">{description}</p>}
      </div>
    </motion.div>
  );
};
const MissionCard = ({
  icon,
  text,
  index,
}: {
  icon: React.ReactNode;
  text: string;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex items-start gap-5 p-5 rounded-xl bg-white border border-slate-100 hover:border-[#e8c97a]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#133059]/5 hover:-translate-y-0.5"
    >
      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#133059]/8 to-[#e8c97a]/8 flex items-center justify-center group-hover:from-[#133059]/15 group-hover:to-[#e8c97a]/15 transition-all duration-300">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-700 leading-relaxed font-medium">{text}</p>
      </div>
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#133059]/5 flex items-center justify-center text-xs font-bold text-[#133059]/40 group-hover:bg-[#e8c97a]/20 group-hover:text-[#d4a853] transition-all duration-300">
        {String(index + 1).padStart(2, '0')}
      </span>
    </motion.div>
  );
};
/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
const SpecializedTechnicalAssistant = () => {
  const { language } = useLanguage();
  const [, setFormations] = useState<Formation[]>([]);
  const [activeTab, setActiveTab] = useState('missions');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const data = await FormationAPI.getFormations();
        setFormations(data);
      } catch (err) {
        console.error('Error fetching formations:', err);
      }
    };
    fetchFormations();
  }, []);
  const t = (fr?: string, ar?: string, en?: string) => {
    if (language === 'ar') return ar || fr || '';
    if (language === 'en') return en || fr || '';
    return fr || '';
  };
  const isRTL = language === 'ar';
  const programDetails = {
    durationFr: "12 mois", durationAr: "12 شهرا", durationEn: "12 months",
    theoryFr: "10 mois de formation theorique", theoryAr: "10 اشهر تكوين نظري", theoryEn: "10 months of theoretical training",
    practiceFr: "2 mois de formation pratique", practiceAr: "02 شهرين تطبيقي", practiceEn: "2 months of practical training",
    locationFr: "Directions des transmissionss de Wilaya", locationAr: "مديريات المواصلات الولائية", locationEn: "transmissionss Directorates of Wilayas",
  };
  const missions = [
    { id: 1, titleFr: "Execution des techniques d'intervention", titleAr: "تنفيــــذ جميــــع التقنيــــات اللازمــــة لإنجــــاز التدخـــلات", titleEn: "Execution of intervention techniques", icon: <Settings className="h-5 w-5 text-[#133059]" /> },
    { id: 2, titleFr: "Realisation des circuits et liaisons techniques", titleAr: "إنجــــاز الدارات والروابط التقنية", titleEn: "Implementation of circuits and technical connections", icon: <Network className="h-5 w-5 text-[#133059]" /> },
    { id: 3, titleFr: "Installation des equipements telephoniques, radio-electriques et informatiques", titleAr: "تــركـــــيب الأجــهــزة الــهـاتــفــيــة والــراديــو كــهــربــائــيـة والإعلام الآلي", titleEn: "Installation of telephone, radio-electric and computer equipment", icon: <Radio className="h-5 w-5 text-[#133059]" /> },
    { id: 4, titleFr: "Prise en charge des pannes et defaillances techniques", titleAr: "التكفــــل بالأعطــــال والأعطــــاب التقنيـــــة", titleEn: "Management of faults and technical failures", icon: <Cpu className="h-5 w-5 text-[#133059]" /> },
    { id: 5, titleFr: "Maintenance des equipements d'alimentation de secours", titleAr: "صيانة أجهزة طاقة النجدة", titleEn: "Maintenance of emergency power systems", icon: <Zap className="h-5 w-5 text-[#133059]" /> },
    { id: 6, titleFr: "Couverture audiovisuelle", titleAr: "التغطيـــة السمعيـــة البصريـــة", titleEn: "Audiovisual coverage", icon: <Video className="h-5 w-5 text-[#133059]" /> },
    { id: 7, titleFr: "Missions liees au fonctionnement des bases biometriques", titleAr: "مـهـــــام مـرتــبـــطــة بـســيــــــر القــواعـــــد البيــــومتــــريــــة", titleEn: "Biometric database operation tasks", icon: <Database className="h-5 w-5 text-[#133059]" /> },
  ];
  const curriculum = [
    { id: 1, subjectFr: "Reseaux et systemes de transmissionss nationaux", subjectAr: "شبكات و أنظمة المواصلات السلكية واللاسلكية الوطنية", subjectEn: "National transmissionss networks and systems", lectureHours: 4, practicalHours: 4, coefficient: 4, icon: <Network className="h-4 w-4" /> },
    { id: 2, subjectFr: "Informatique", subjectAr: "إعلام ألي", subjectEn: "Computer Science", lectureHours: 4, practicalHours: 4, coefficient: 3, icon: <Server className="h-4 w-4" /> },
    { id: 3, subjectFr: "Normes d'installation et d'intervention", subjectAr: "معايير التركيب و التدخل", subjectEn: "Installation and intervention standards", lectureHours: 2, practicalHours: 4, coefficient: 3, icon: <Settings className="h-4 w-4" /> },
    { id: 4, subjectFr: "Audiovisuel", subjectAr: "السمعية البصرية", subjectEn: "Audiovisual", lectureHours: 2, practicalHours: 2, coefficient: 2, icon: <Video className="h-4 w-4" /> },
    { id: 5, subjectFr: "Energie et systemes de protection energetique", subjectAr: "الطاقة وأنظمة الحماية الطاقوية", subjectEn: "Energy and power protection systems", lectureHours: 2, practicalHours: 2, coefficient: 2, icon: <Zap className="h-4 w-4" /> },
    { id: 6, subjectFr: "Systeme de service des transmissionss", subjectAr: "نظام خدمة المواصلات السلكية واللاسلكية", subjectEn: "transmissionss service system", lectureHours: 2, practicalHours: 0, coefficient: 2, icon: <Smartphone className="h-4 w-4" /> },
    { id: 7, subjectFr: "Terminologie technique", subjectAr: "مصطلحات تقنية", subjectEn: "Technical terminology", lectureHours: 1, practicalHours: 0, coefficient: 1, icon: <FileText className="h-4 w-4" /> },
    { id: 8, subjectFr: "Histoire et geographie de l'Algerie", subjectAr: "تاريخ وجغرافيا الجزائر", subjectEn: "History and geography of Algeria", lectureHours: 1, practicalHours: 0, coefficient: 1, icon: <GraduationCap className="h-4 w-4" /> },
    { id: 9, subjectFr: "Techniques d'expression et de communication", subjectAr: "تقنيات التعبير و الاتصال", subjectEn: "Expression and communication techniques", lectureHours: 1, practicalHours: 0, coefficient: 1, icon: <FileText className="h-4 w-4" /> },
  ];
  const totalLecture = curriculum.reduce((sum, s) => sum + s.lectureHours, 0);
  const totalPractical = curriculum.reduce((sum, s) => sum + s.practicalHours, 0);
  return (
    <div className={`relative w-full overflow-hidden bg-[#fafbfc] ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* ========== HERO ========== */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d2240] via-[#133059] to-[#1a4080]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          {/* Animated gradient orbs */}
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#e8c97a]/10 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#1a4080]/30 rounded-full blur-[100px]"
          />
        </div>
        {/* Decorative lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8c97a]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 max-w-[900px] mx-auto px-6 text-center">
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-4 h-4 text-[#e8c97a]" />
            <span className="text-white/80 text-xs font-semibold uppercase tracking-[0.2em]">
              {t('Programme Specialise', 'برنامج متخصص', 'Specialized Program')}
            </span>
          </motion.div>
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight"
          >
            {t('Assistant Technique', 'مساعد تقني', 'Technical Assistant')}
            <br />
            <span className="bg-gradient-to-r from-[#e8c97a] via-[#f0d99a] to-[#e8c97a] bg-clip-text text-transparent">
              {t('Specialise', 'متخصص', 'Specialized')}
            </span>
          </motion.h1>
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            {t(
              'Programme de formation specialise dans le domaine du support technique des transmissionss',
              'برنامج تكويني متخصص في مجال الدعم التقني للمواصلات السلكية واللاسلكية',
              'Specialized training program in transmissionss technical support'
            )}
          </motion.p>
          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#e8c97a] to-[#d4a853] text-[#133059] font-bold text-sm hover:shadow-xl hover:shadow-[#e8c97a]/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              {t('Postuler Maintenant', 'قدم طلبك الآن', 'Apply Now')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#program-overview"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-sm hover:bg-white/5 backdrop-blur-sm transition-all duration-300"
            >
              {t('Decouvrir le Programme', 'اكتشف البرنامج', 'Discover Program')}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
          {/* Quick stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 flex flex-wrap justify-center gap-8 md:gap-14"
          >
            {[
              { label: t('Duree', 'المدة', 'Duration'), value: t('12 Mois', '12 شهرا', '12 Months') },
              { label: t('Modules', 'الوحدات', 'Modules'), value: '9' },
              { label: t('Pratique', 'تطبيقي', 'Practical'), value: t('2 Mois', 'شهرين', '2 Months') },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40 uppercase tracking-[0.15em] mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
          >
            <motion.div className="w-1 h-2 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>
      {/* ========== PROGRAM OVERVIEW ========== */}
      <section id="program-overview" className="relative py-24 px-6 md:px-10">
        <div className="max-w-[1200px] mx-auto">
          <SectionHeading
            icon={BookOpen}
            title={t('Apercu du Programme', 'نظرة عامة على البرنامج', 'Program Overview')}
            subtitle={t(
              'Le programme d\'Assistant Technique Specialise est une formation visant a preparer des techniciens qualifies dans le domaine des transmissionss.',
              'برنامج مساعد تقني متخصص هو برنامج تكويني يهدف إلى إعداد فنيين مؤهلين في مجال الاتصالات السلكية واللاسلكية.',
              'The Specialized Technical Assistant program aims to prepare qualified technicians in the transmissionss field.'
            )}
          />
          <p className="text-slate-500 leading-relaxed text-lg mb-12 max-w-3xl">
            {t(
              'Le programme combine connaissances theoriques et formation pratique pour doter les etudiants des competences necessaires pour travailler dans ce domaine technique.',
              'يجمع البرنامج بين المعرفة النظرية والتدريب العملي لتزويد الطلاب بالمهارات اللازمة للعمل في هذا المجال التقني.',
              'The program combines theoretical knowledge and practical training to equip students with the necessary skills to work in this technical field.'
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              icon={Clock}
              label={t('Duree Totale', 'المدة الإجمالية', 'Total Duration')}
              value={t(programDetails.durationFr, programDetails.durationAr, programDetails.durationEn)}
              description={t(programDetails.theoryFr, programDetails.theoryAr, programDetails.theoryEn)}
              accent="blue"
              delay={0}
            />
            <StatCard
              icon={GraduationCap}
              label={t('Formation Pratique', 'تكوين عملي', 'Practical Training')}
              value={t(programDetails.practiceFr, programDetails.practiceAr, programDetails.practiceEn)}
              description={t(programDetails.locationFr, programDetails.locationAr, programDetails.locationEn)}
              accent="gold"
              delay={0.1}
            />
            <StatCard
              icon={BookOpen}
              label={t('Modules', 'الوحدات', 'Modules')}
              value="9"
              description={t('Matieres specialisees', 'مواد متخصصة', 'Specialized subjects')}
              accent="blue"
              delay={0.2}
            />
            <StatCard
              icon={Target}
              label={t('Missions', 'المهام', 'Missions')}
              value="7"
              description={t('Domaines d\'expertise', 'مجالات الخبرة', 'Areas of expertise')}
              accent="gold"
              delay={0.3}
            />
          </div>
        </div>
      </section>
      {/* ========== TABS SECTION ========== */}
      <section className="relative py-24 px-6 md:px-10 bg-white">
        {/* Subtle top border */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="max-w-[1200px] mx-auto">
          <SectionHeading
            icon={Award}
            title={t('Details du Programme', 'تفاصيل البرنامج', 'Program Details')}
            subtitle={t(
              'Explorez les missions, les exigences et le programme d\'etudes detaille.',
              'اكتشف المهام والمتطلبات والبرنامج الدراسي المفصل.',
              'Explore the missions, requirements, and detailed curriculum.'
            )}
            center
          />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 bg-[#f5f6f8] border border-slate-200/80 rounded-2xl p-1.5 h-auto">
              {[
                { value: 'missions', icon: Target, label: t('Missions', 'المهام', 'Missions') },
                { value: 'requirements', icon: Shield, label: t('Exigences', 'المتطلبات', 'Requirements') },
                { value: 'curriculum', icon: BookOpen, label: t('Programme', 'البرنامج', 'Curriculum') },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-[#133059] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#133059]/20 text-slate-500 hover:text-[#133059]"
                >
                  <tab.icon className="w-4 h-4 mr-2 inline-block" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {/* --- Missions Tab --- */}
            <TabsContent value="missions" className="mt-10">
              <div className="grid grid-cols-1 gap-3">
                {missions.map((mission, idx) => (
                  <MissionCard
                    key={mission.id}
                    icon={mission.icon}
                    text={t(mission.titleFr, mission.titleAr, mission.titleEn)}
                    index={idx}
                  />
                ))}
              </div>
            </TabsContent>
            {/* --- Requirements Tab --- */}
            <TabsContent value="requirements" className="mt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: GraduationCap,
                    title: t("Conditions d'Admission", 'شروط القبول', 'Admission Requirements'),
                    accent: 'blue' as const,
                    items: [
                      t('Niveau Bac + 2 ou equivalent', 'شهادة البكالوريا +2 أو ما يعادلها', "Bac + 2 Level or equivalent"),
                      t('Age  entre 21 et 30', 'السن بين ٢١ الي ٣٠  ', 'Age between 21 and 30'),
                     
                    ],
                  },
                  {
                    icon: Users,
                    title: t('Competences Requises', 'المهارات المطلوبة', 'Required Skills'),
                    accent: 'gold' as const,
                    items: [
                      t('Travail en equipe et collaboration', 'القدرة على العمل الجماعي', 'Teamwork and collaboration'),
                      t('Communication efficace', 'مهارات التواصل الجيدة', 'Effective communication'),
                      t('Attention aux details et rigueur technique', 'الدقة والانتباه للتفاصيل', 'Attention to detail and technical rigor'),
                    ],
                  },
                ].map((card, ci) => {
                  const colors = card.accent === 'gold'
                    ? { iconBg: 'from-[#e8c97a] to-[#d4a853]', checkColor: 'text-[#d4a853]', borderHover: 'hover:border-[#e8c97a]/30' }
                    : { iconBg: 'from-[#133059] to-[#1a4080]', checkColor: 'text-[#133059]', borderHover: 'hover:border-[#133059]/30' };
                  return (
                    <motion.div
                      key={ci}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: ci * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className={`bg-white rounded-2xl p-8 border border-slate-100 ${colors.borderHover} transition-all duration-300 hover:shadow-xl hover:shadow-slate-100`}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${colors.iconBg} text-white shadow-lg`}>
                          <card.icon className="w-5 h-5" />
                        </span>
                        <h3 className="text-lg font-bold text-[#133059]">{card.title}</h3>
                      </div>
                      <ul className="space-y-4">
                        {card.items.map((item, ii) => (
                          <li key={ii} className="flex items-start gap-3">
                            <CheckCircle className={`h-5 w-5 ${colors.checkColor} flex-shrink-0 mt-0.5`} />
                            <span className="text-slate-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
            {/* --- Curriculum Tab --- */}
            <TabsContent value="curriculum" className="mt-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#133059]">
                        <th className="p-5 text-left text-white/90 font-semibold text-sm tracking-wide">{t('Modules', 'الوحدات', 'Modules')}</th>
                        <th className="p-5 text-center text-white/90 font-semibold text-sm tracking-wide w-24">{t('Cours', 'دروس', 'Lectures')}</th>
                        <th className="p-5 text-center text-white/90 font-semibold text-sm tracking-wide w-24">{t('TP', 'أعمال تطبيقية', 'Practical')}</th>
                        <th className="p-5 text-center text-white/90 font-semibold text-sm tracking-wide w-24">{t('Coef.', 'المعامل', 'Coeff.')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {curriculum.map((subject, idx) => (
                        <tr
                          key={subject.id}
                          className={`group transition-colors duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} hover:bg-[#133059]/[0.03]`}
                        >
                          <td className="p-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#133059]/5 text-[#133059] group-hover:bg-[#133059]/10 transition-colors">
                                {subject.icon}
                              </span>
                              <span className="text-slate-700 font-medium text-sm">
                                {t(subject.subjectFr, subject.subjectAr, subject.subjectEn)}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-center border-b border-slate-100 text-slate-500 font-medium text-sm">{subject.lectureHours}h</td>
                          <td className="p-4 text-center border-b border-slate-100 text-slate-500 font-medium text-sm">{subject.practicalHours > 0 ? `${subject.practicalHours}h` : '-'}</td>
                          <td className="p-4 text-center border-b border-slate-100">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${subject.coefficient >= 3 ? 'bg-[#133059]/10 text-[#133059]' : 'bg-slate-100 text-slate-500'}`}>
                              {subject.coefficient}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gradient-to-r from-[#133059]/5 to-[#e8c97a]/5 font-bold">
                        <td className="p-4 text-[#133059] text-sm">{t('Total', 'المجموع', 'Total')}</td>
                        <td className="p-4 text-center text-[#133059] text-sm">{totalLecture}h</td>
                        <td className="p-4 text-center text-[#133059] text-sm">{totalPractical}h</td>
                        <td className="p-4 text-center text-[#133059] text-sm">{totalLecture + totalPractical}h</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      {/* ========== HOW TO APPLY ========== */}
      <section className="relative py-28 px-6 md:px-10 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9fb] via-white to-[#f5f0e6]/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-[#e8c97a]/40 to-transparent" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#133059]/[0.02] rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-[#e8c97a]/[0.04] rounded-full blur-[80px]" />

        <div className="relative max-w-[1200px] mx-auto">
          <SectionHeading
            icon={ClipboardList}
            title={t('Comment Postuler', 'كيفية التقديم', 'How to Apply')}
            subtitle={t(
              'Rejoignez le programme d\'Assistant Technique Specialise en suivant ces etapes simples.',
              'انضم إلى برنامج مساعد تقني متخصص باتباع هذه الخطوات البسيطة.',
              'Join the Specialized Technical Assistant program by following these simple steps.'
            )}
            center
          />

          {/* Bac+2 Hero Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-16 rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d2240] via-[#133059] to-[#1a4080]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }} />
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#e8c97a]/15 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-[60px]" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-10 py-12 md:px-16 md:py-14">
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#e8c97a]" />
                  <span className="text-white/70 text-[11px] font-semibold uppercase tracking-[0.15em]">
                    {t('Diplome Requis', 'الشهادة المطلوبة', 'Required Diploma')}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight">
                  {t(
                    'Niveau Bac + 2 ou equivalent',
                    'مستوى باك + 2 أو ما يعادله',
                    'Bac + 2 Level or equivalent'
                  )}
                </h3>
                <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-lg">
                  {t(
                    'Ce niveau permet de participer au concours sur la base des epreuves ou sur la base du diplome pour le grade d\'Assistant Technique Specialise.',
                    'هذا المستوى يسمح لصاحبه بالمشاركة في المسابقة على أساس الإختبارات أو على أساس الشهادة للإلتحاق برتبة مساعد تقني متخصص.',
                    'This level allows participation in the competition based on exams or diploma for the Specialized Technical Assistant rank.'
                  )}
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#e8c97a]/20 rounded-2xl blur-xl scale-110" />
                  <div className="relative bg-gradient-to-br from-[#e8c97a] to-[#d4a853] rounded-2xl px-10 py-8 text-center shadow-2xl shadow-[#e8c97a]/20">
                    <p className="text-[#133059] text-5xl md:text-6xl font-black tracking-tight leading-none">Bac+2</p>
                    <div className="h-0.5 w-12 mx-auto my-3 bg-[#133059]/20 rounded-full" />
                    <p className="text-[#133059]/70 text-xs font-bold uppercase tracking-[0.2em]">
                      {t('Minimum Requis', 'الحد الأدنى المطلوب', 'Minimum Required')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Conditions - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Age Condition */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-white rounded-2xl p-8 border border-slate-100 hover:border-[#133059]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#133059]/5 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#133059] to-[#1a4080] text-white mb-6 shadow-lg shadow-[#133059]/15 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-[#133059] mb-5">
                {t('Condition d\'Age', 'شرط السن', 'Age Requirement')}
              </h4>
              <div className="flex items-center justify-center gap-5 py-3 px-4 rounded-xl bg-gradient-to-r from-[#133059]/[0.03] to-[#e8c97a]/[0.06]">
                <div className="text-center">
                  <p className="text-3xl font-black text-[#133059]">21</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.15em] mt-1 font-semibold">{t('Min', 'الأدنى', 'Min')}</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-px bg-gradient-to-r from-[#133059]/30 to-[#e8c97a]/60" />
                  <span className="text-[10px] text-slate-300 font-medium">{t('a', 'إلى', 'to')}</span>
                  <div className="w-8 h-px bg-gradient-to-r from-[#e8c97a]/60 to-[#133059]/30" />
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-[#e8c97a]">30</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.15em] mt-1 font-semibold">{t('Max', 'الأقصى', 'Max')}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 text-center mt-4 leading-relaxed">
                {t(
                  'A la date du concours',
                  'عند تاريخ إجراء المسابقة',
                  'At the date of the competition'
                )}
              </p>
            </motion.div>

            {/* Required Specializations */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-white rounded-2xl p-8 border border-slate-100 hover:border-[#e8c97a]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#e8c97a]/5 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#e8c97a] to-[#d4a853] text-white mb-6 shadow-lg shadow-[#e8c97a]/15 group-hover:scale-110 transition-transform duration-300">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-[#133059] mb-5">
                {t('Specialisations', 'التخصصات المطلوبة', 'Specializations')}
              </h4>
              <ul className="space-y-2.5">
                {[
                  { fr: 'Technologie', ar: 'التكنولوجيا', en: 'Technology' },
                  { fr: 'transmissionss', ar: 'الإتصالات السلكية واللاسلكية', en: 'transmissionss' },
                  { fr: 'Electronique', ar: 'الإلكترونيك', en: 'Electronics' },
                  { fr: 'Informatique', ar: 'الإعلام الآلي', en: 'Computer Science' },
                  { fr: 'Electrotechnique', ar: 'الإلكتروتقني', en: 'Electrotechnics' },
                ].map((spec, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 group/item">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#e8c97a] to-[#d4a853]" />
                    <span className="text-slate-600 text-sm leading-relaxed group-hover/item:text-[#133059] transition-colors">{t(spec.fr, spec.ar, spec.en)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Competition Type */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-white rounded-2xl p-8 border border-slate-100 hover:border-[#133059]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#133059]/5 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#133059] to-[#1a4080] text-white mb-6 shadow-lg shadow-[#133059]/15 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-[#133059] mb-5">
                {t('Type de Concours', 'نوع المسابقة', 'Competition Type')}
              </h4>
              <div className="space-y-3">
                {[
                  { fr: 'Sur epreuves ecrites', ar: 'على أساس الإختبارات الكتابية', en: 'Written exams', icon: FileText },
                  { fr: 'Sur titre (diplome)', ar: 'على أساس الشهادة', en: 'Diploma-based', icon: GraduationCap },
                ].map((type, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100/80 group-hover:border-[#133059]/10 transition-all">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#133059]/5 flex items-center justify-center">
                      <type.icon className="w-3.5 h-3.5 text-[#133059]" />
                    </span>
                    <span className="text-slate-600 text-sm font-medium">{t(type.fr, type.ar, type.en)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Application Steps - Timeline Style */}
          <div className="mb-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h3 className="text-2xl font-bold text-[#133059] mb-2">
                {t('Etapes de Candidature', 'خطوات التقديم', 'Application Steps')}
              </h3>
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#e8c97a] to-[#d4a853] mx-auto" />
            </motion.div>

            <div className="relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#133059]/10 to-transparent -translate-y-1/2" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: '01',
                    icon: FileText,
                    titleFr: 'Preparer le Dossier',
                    titleAr: 'تحضير الملف',
                    titleEn: 'Prepare Your File',
                    descFr: 'Rassemblez votre diplome (Bac+2), pieces d\'identite, certificats de scolarite et documents justificatifs.',
                    descAr: 'اجمع شهادتك (باك+2)، وثائق الهوية، الشهادات المدرسية والوثائق التبريرية.',
                    descEn: 'Gather your diploma (Bac+2), identity documents, school certificates and supporting documents.',
                    accent: 'blue' as const,
                  },
                  {
                    step: '02',
                    icon: Send,
                    titleFr: 'Deposer la Candidature',
                    titleAr: 'إيداع الترشح',
                    titleEn: 'Submit Application',
                    descFr: 'Deposez votre dossier aupres de la Direction Generale des transmissionss ou en ligne lors de l\'ouverture des inscriptions.',
                    descAr: 'أودع ملفك لدى المديرية العامة للمواصلات السلكية واللاسلكية أو عبر المنصة عند فتح التسجيلات.',
                    descEn: 'Submit your file to the General Directorate of transmissionss or online when registrations open.',
                    accent: 'gold' as const,
                  },
                  {
                    step: '03',
                    icon: Award,
                    titleFr: 'Passer le Concours',
                    titleAr: 'اجتياز المسابقة',
                    titleEn: 'Take the Exam',
                    descFr: 'Participez au concours d\'admission. Les resultats seront communiques apres deliberation du jury.',
                    descAr: 'شارك في مسابقة القبول. تُعلن النتائج بعد مداولة اللجنة.',
                    descEn: 'Participate in the admission competition. Results will be announced after jury deliberation.',
                    accent: 'blue' as const,
                  },
                ].map((item, idx) => {
                  const stepColors = item.accent === 'gold'
                    ? { iconBg: 'from-[#e8c97a] to-[#d4a853]', numBg: 'bg-gradient-to-br from-[#e8c97a] to-[#d4a853] text-[#133059]', borderHover: 'hover:border-[#e8c97a]/30', shadow: 'hover:shadow-[#e8c97a]/10' }
                    : { iconBg: 'from-[#133059] to-[#1a4080]', numBg: 'bg-gradient-to-br from-[#133059] to-[#1a4080] text-white', borderHover: 'hover:border-[#133059]/30', shadow: 'hover:shadow-[#133059]/10' };
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className={`relative bg-white rounded-2xl p-8 border border-slate-100 ${stepColors.borderHover} transition-all duration-500 hover:shadow-2xl ${stepColors.shadow} hover:-translate-y-1.5 text-center`}
                    >
                      {/* Step number badge */}
                      <div className="flex justify-center mb-6">
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${stepColors.numBg} text-sm font-black shadow-lg`}>
                          {item.step}
                        </span>
                      </div>
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stepColors.iconBg} text-white mb-6 shadow-lg`}>
                        <item.icon className="w-7 h-7" />
                      </div>
                      <h4 className="text-lg font-bold text-[#133059] mb-3">
                        {t(item.titleFr, item.titleAr, item.titleEn)}
                      </h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {t(item.descFr, item.descAr, item.descEn)}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="relative py-24 px-6 md:px-10">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Background layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d2240] via-[#133059] to-[#1a4080]" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }} />
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#e8c97a]/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-[80px]" />
            <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8"
              >
                <Sparkles className="w-4 h-4 text-[#e8c97a]" />
                <span className="text-white/70 text-xs font-semibold uppercase tracking-[0.15em]">
                  {t('Inscriptions Ouvertes', 'التسجيلات مفتوحة', 'Enrollments Open')}
                </span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight leading-tight">
                {t(
                  'Interesse par ce programme ?',
                  'هل أنت مهتم بهذا البرنامج؟',
                  'Interested in this program?'
                )}
              </h2>
              <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto leading-relaxed">
                {t(
                  'Decouvrez les conditions d\'admission et les procedures d\'inscription au programme d\'Assistant Technique Specialise.',
                  'اكتشف المزيد عن شروط القبول وإجراءات التسجيل في برنامج مساعد تقني متخصص.',
                  'Discover admission requirements and registration procedures for the Specialized Technical Assistant program.'
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#e8c97a] to-[#d4a853] text-[#133059] font-bold text-sm hover:shadow-xl hover:shadow-[#e8c97a]/20 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {t('Contactez-nous', 'تواصل معنا', 'Contact Us')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/formation"
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl border border-white/15 text-white font-semibold text-sm hover:bg-white/5 backdrop-blur-sm transition-all duration-300"
                >
                  {t('Explorer d\'autres programmes', 'استكشف البرامج الأخرى', 'Explore Other Programs')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* ========== ALL FORMATIONS ========== */}
     
    </div>
  );
};
export default SpecializedTechnicalAssistant;
