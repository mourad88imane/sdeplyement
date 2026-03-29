import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap,
  BookOpen,
  
  Calendar,
  Award,
  Users,
  
  CheckCircle,
  FileText,
  Briefcase,
  Building,
  
  ArrowRight,
  Star,
  
  MapPin,
  Zap,
  Scale,
  Shield
} from 'lucide-react';

const PreparatoryTraining = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('grades');

  // Programme data
  const programDetails = {
    regulation_fr: "Decision ministerielle conjointe du 22 mars 2012",
    regulation_ar: "\u0627\u0644\u0642\u0631\u0627\u0631 \u0627\u0644\u0648\u0632\u0627\u0631\u064a \u0627\u0644\u0645\u0634\u062a\u0631\u0643 \u0627\u0644\u0645\u0624\u0631\u062e \u0641\u064a 22 \u0645\u0627\u0631\u0633 2012",
    regulation_en: "Joint ministerial decision dated March 22, 2012",
    target_fr: "Fonctionnaires laureats des concours de recrutement direct",
    target_ar: "\u0627\u0644\u0645\u0648\u0638\u0641\u064a\u0646 \u0627\u0644\u0646\u0627\u062c\u062d\u064a\u0646 \u0641\u064a \u0645\u0633\u0627\u0628\u0642\u0627\u062a \u0627\u0644\u062a\u0648\u0638\u064a\u0641 \u0627\u0644\u0645\u0628\u0627\u0634\u0631",
    target_en: "Officials successful in direct recruitment competitions",
    location_fr: "Ecole Nationale des Transmissions",
    location_ar: "\u0627\u0644\u0645\u062f\u0631\u0633\u0629 \u0627\u0644\u0648\u0637\u0646\u064a\u0629 \u0644\u0644\u0645\u0648\u0627\u0635\u0644\u0627\u062a \u0627\u0644\u0633\u0644\u0643\u064a\u0629 \u0648\u0627\u0644\u0644\u0627\u0633\u0644\u0643\u064a\u0629",
    location_en: "National School of transmissionss",
    announcement_fr: "Annonces au niveau des directions des transmissionss de wilaya",
    announcement_ar: "\u064a\u062a\u0645 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u0639\u0646\u0647\u0627 \u0639\u0644\u0649 \u0645\u0633\u062a\u0648\u0649 \u0645\u062f\u064a\u0631\u064a\u0627\u062a \u0627\u0644\u0645\u0648\u0627\u0635\u0644\u0627\u062a \u0627\u0644\u0633\u0644\u0643\u064a\u0629 \u0648\u0627\u0644\u0644\u0627\u0633\u0644\u0643\u064a\u0629 \u0627\u0644\u0648\u0644\u0627\u0626\u064a\u0629",
    announcement_en: "Announced at the level of transmissionss directorates of wilayas"
  };

  // Target grades
  const targetGrades = [
    {
      icon: Users,
      title_fr: "Grade d'Agent Ouvrier",
      title_ar: "\u0631\u062a\u0628\u0629 \u0639\u0648\u0646 \u0639\u0627\u0645\u0644",
      title_en: "Grade of Worker Agent",
      description_fr: "Formation preparatoire pour les laureats du concours de recrutement direct",
      description_ar: "\u062a\u0643\u0648\u064a\u0646 \u062a\u062d\u0636\u064a\u0631\u064a \u0644\u0644\u0646\u0627\u062c\u062d\u064a\u0646 \u0641\u064a \u0645\u0633\u0627\u0628\u0642\u0629 \u0627\u0644\u062a\u0648\u0638\u064a\u0641 \u0627\u0644\u0645\u0628\u0627\u0634\u0631",
      description_en: "Preparatory training for successful direct recruitment competition participants",
      theoretical: 15,
      practical: 45,
      total: 60
    },
    {
      icon: Award,
      title_fr: "Grade d'Assistant Technique Specialise Principal",
      title_ar: "\u0631\u062a\u0628\u0629 \u0645\u0633\u0627\u0639\u062f \u062a\u0642\u0646\u064a \u0645\u062a\u062e\u0635\u0635 \u0631\u0626\u064a\u0633\u064a",
      title_en: "Grade of Principal Specialized Technical Assistant",
      description_fr: "Formation preparatoire pour les laureats du concours de recrutement direct",
      description_ar: "\u062a\u0643\u0648\u064a\u0646 \u062a\u062d\u0636\u064a\u0631\u064a \u0644\u0644\u0646\u0627\u062c\u062d\u064a\u0646 \u0641\u064a \u0645\u0633\u0627\u0628\u0642\u0629 \u0627\u0644\u062a\u0648\u0638\u064a\u0641 \u0627\u0644\u0645\u0628\u0627\u0634\u0631",
      description_en: "Preparatory training for successful direct recruitment competition participants",
      theoretical: 30,
      practical: 90,
      total: 120
    }
  ];

  // Training programs
  const trainingPrograms = [
    {
      grade_fr: "Agent Ouvrier",
      grade_ar: "\u0639\u0648\u0646 \u0639\u0627\u0645\u0644",
      grade_en: "Worker Agent",
      theoretical_days: 15,
      practical_days: 45,
      theoretical_fr: "15 jours de formation theorique",
      theoretical_ar: "15 \u064a\u0648\u0645 \u0645\u0646 \u0627\u0644\u062a\u0643\u0648\u064a\u0646 \u0627\u0644\u0646\u0638\u0631\u064a",
      theoretical_en: "15 days of theoretical training",
      practical_fr: "45 jours de formation pratique",
      practical_ar: "45 \u064a\u0648\u0645 \u0645\u0646 \u0627\u0644\u062a\u0643\u0648\u064a\u0646 \u0627\u0644\u062a\u0637\u0628\u064a\u0642\u064a",
      practical_en: "45 days of practical training"
    },
    {
      grade_fr: "Assistant Technique Specialise Principal",
      grade_ar: "\u0645\u0633\u0627\u0639\u062f \u062a\u0642\u0646\u064a \u0645\u062a\u062e\u0635\u0635 \u0631\u0626\u064a\u0633\u064a",
      grade_en: "Principal Specialized Technical Assistant",
      theoretical_days: 30,
      practical_days: 90,
      theoretical_fr: "30 jours de formation theorique",
      theoretical_ar: "30 \u064a\u0648\u0645 \u0645\u0646 \u0627\u0644\u062a\u0643\u0648\u064a\u0646 \u0627\u0644\u0646\u0638\u0631\u064a",
      theoretical_en: "30 days of theoretical training",
      practical_fr: "90 jours de formation pratique",
      practical_ar: "90 \u064a\u0648\u0645 \u0645\u0646 \u0627\u0644\u062a\u0643\u0648\u064a\u0646 \u0627\u0644\u062a\u0637\u0628\u064a\u0642\u064a",
      practical_en: "90 days of practical training"
    }
  ];

  // Requirements
  const requirements = [
    {
      icon: Briefcase,
      color: 'from-blue/20 to-blue/5',
      title_fr: "Experience professionnelle",
      title_ar: "\u0627\u0644\u062e\u0628\u0631\u0629 \u0627\u0644\u0645\u0647\u0646\u064a\u0629",
      title_en: "Professional Experience",
      items_fr: [
        "Minimum 5 ans d'experience dans le domaine",
        "Poste actuel de niveau intermediaire",
        "Evaluations de performance positives"
      ],
      items_ar: [
        "\u062e\u0628\u0631\u0629 \u0644\u0627 \u062a\u0642\u0644 \u0639\u0646 5 \u0633\u0646\u0648\u0627\u062a \u0641\u064a \u0627\u0644\u0645\u062c\u0627\u0644",
        "\u0645\u0646\u0635\u0628 \u062d\u0627\u0644\u064a \u0628\u0645\u0633\u062a\u0648\u0649 \u0645\u062a\u0648\u0633\u0637",
        "\u062a\u0642\u064a\u064a\u0645\u0627\u062a \u0623\u062f\u0627\u0621 \u0625\u064a\u062c\u0627\u0628\u064a\u0629"
      ],
      items_en: [
        "Minimum 5 years experience in the field",
        "Current position at intermediate level",
        "Positive performance evaluations"
      ]
    },
    {
      icon: GraduationCap,
      color: 'from-gold/20 to-gold/5',
      title_fr: "Qualifications academiques",
      title_ar: "\u0627\u0644\u0645\u0624\u0647\u0644\u0627\u062a \u0627\u0644\u0623\u0643\u0627\u062f\u064a\u0645\u064a\u0629",
      title_en: "Academic Qualifications",
      items_fr: [
        "Diplome universitaire en transmissionss ou equivalent",
        "Formations complementaires appreciees",
        "Maitrise des langues (francais, arabe, anglais)"
      ],
      items_ar: [
        "\u0634\u0647\u0627\u062f\u0629 \u062c\u0627\u0645\u0639\u064a\u0629 \u0641\u064a \u0627\u0644\u0627\u062a\u0635\u0627\u0644\u0627\u062a \u0623\u0648 \u0645\u0627 \u064a\u0639\u0627\u062f\u0644\u0647\u0627",
        "\u062a\u0643\u0648\u064a\u0646\u0627\u062a \u062a\u0643\u0645\u064a\u0644\u064a\u0629 \u0645\u0631\u063a\u0648\u0628\u0629",
        "\u0625\u062a\u0642\u0627\u0646 \u0627\u0644\u0644\u063a\u0627\u062a (\u0627\u0644\u0641\u0631\u0646\u0633\u064a\u0629\u060c \u0627\u0644\u0639\u0631\u0628\u064a\u0629\u060c \u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629)"
      ],
      items_en: [
        "University diploma in transmissionss or equivalent",
        "Complementary training appreciated",
        "Mastery of languages (French, Arabic, English)"
      ]
    },
    {
      icon: Zap,
      color: 'from-blue/15 to-gold/10',
      title_fr: "Competences personnelles",
      title_ar: "\u0627\u0644\u0645\u0647\u0627\u0631\u0627\u062a \u0627\u0644\u0634\u062e\u0635\u064a\u0629",
      title_en: "Personal Skills",
      items_fr: [
        "Capacites de leadership",
        "Esprit d'initiative et d'innovation",
        "Aptitudes a la communication"
      ],
      items_ar: [
        "\u0642\u062f\u0631\u0627\u062a \u0627\u0644\u0642\u064a\u0627\u062f\u0629",
        "\u0631\u0648\u062d \u0627\u0644\u0645\u0628\u0627\u062f\u0631\u0629 \u0648\u0627\u0644\u0627\u0628\u062a\u0643\u0627\u0631",
        "\u0645\u0647\u0627\u0631\u0627\u062a \u0627\u0644\u062a\u0648\u0627\u0635\u0644"
      ],
      items_en: [
        "Leadership capabilities",
        "Spirit of initiative and innovation",
        "Communication skills"
      ]
    }
  ];

  // Highlights
  const highlights = [
    {
      icon: Scale,
      value: "2012",
      label_fr: "Cadre reglementaire",
      label_ar: "\u0627\u0644\u0625\u0637\u0627\u0631 \u0627\u0644\u0642\u0627\u0646\u0648\u0646\u064a",
      label_en: "Regulatory framework"
    },
    {
      icon: Users,
      value: "2",
      label_fr: "Grades concernes",
      label_ar: "\u0631\u062a\u0628 \u0645\u0639\u0646\u064a\u0629",
      label_en: "Grades concerned"
    },
    {
      icon: BookOpen,
      value_fr: "60-120",
      value_ar: "60-120",
      value_en: "60-120",
      label_fr: "Jours de formation",
      label_ar: "\u064a\u0648\u0645 \u062a\u0643\u0648\u064a\u0646",
      label_en: "Training days"
    },
    {
      icon: Building,
      value_fr: "ENT",
      value_ar: "ENT",
      value_en: "ENT",
      label_fr: "Ecole Nationale",
      label_ar: "\u0627\u0644\u0645\u062f\u0631\u0633\u0629 \u0627\u0644\u0648\u0637\u0646\u064a\u0629",
      label_en: "National School"
    }
  ];

  const getLocalizedText = (fr?: string, ar?: string, en?: string) => {
    if (language === 'ar') return ar || fr || '';
    if (language === 'en') return en || fr || '';
    return fr || '';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className={`relative w-full overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 ${language === 'ar' ? 'rtl' : 'ltr'}`}>

      {/* ====== ANIMATED BACKGROUND ====== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Mesh gradient */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 10% 20%, rgba(19, 48, 89, 0.12) 0%, transparent 60%),
              radial-gradient(ellipse 60% 80% at 90% 80%, rgba(232, 201, 122, 0.10) 0%, transparent 60%),
              radial-gradient(ellipse 50% 50% at 50% 50%, rgba(19, 48, 89, 0.04) 0%, transparent 70%)
            `,
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(19,48,89,1) 1px, transparent 1px), linear-gradient(90deg, rgba(19,48,89,1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Floating orbs */}
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[15%] right-[10%] w-72 h-72 bg-gradient-to-br from-gold/15 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[20%] left-[5%] w-96 h-96 bg-gradient-to-tr from-blue/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[60%] right-[30%] w-48 h-48 bg-gradient-to-br from-gold/8 to-blue/5 rounded-full blur-2xl"
        />
      </div>

      {/* Decorative top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />

      {/* ====== HERO SECTION ====== */}
      <section className="relative z-10 pt-28 pb-8 px-6 md:px-10 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center"
        >
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/80 border border-blue/15 shadow-lg shadow-blue/5 backdrop-blur-md mb-8"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold" />
            </span>
            <span className="text-blue text-xs font-bold uppercase tracking-[0.2em]">
              {getLocalizedText('Formation Preparatoire', '\u062a\u0643\u0648\u064a\u0646 \u062a\u062d\u0636\u064a\u0631\u064a', 'Preparatory Training')}
            </span>
          </motion.div>

          {/* Title with gradient text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] mb-6"
          >
            <span className="bg-gradient-to-r from-blue via-blue/90 to-blue bg-clip-text text-transparent">
              {getLocalizedText(
                'Formation Preparatoire',
                '\u062a\u0643\u0648\u064a\u0646 \u062a\u062d\u0636\u064a\u0631\u064a \u0644\u0634\u063a\u0644 \u0645\u0646\u0635\u0628',
                'Preparatory Training'
              )}
            </span>
          </motion.h1>

          {/* Animated divider */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-gold via-gold to-gold/50 rounded-full mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light"
          >
            {getLocalizedText(
              "Programme de formation specialise pour preparer les cadres aux postes superieurs dans le domaine des transmissionss",
              '\u0628\u0631\u0646\u0627\u0645\u062c \u062a\u0643\u0648\u064a\u0646\u064a \u0645\u062a\u062e\u0635\u0635 \u0644\u0625\u0639\u062f\u0627\u062f \u0627\u0644\u0643\u0648\u0627\u062f\u0631 \u0644\u0644\u0645\u0646\u0627\u0635\u0628 \u0627\u0644\u0639\u0644\u064a\u0627 \u0641\u064a \u0645\u062c\u0627\u0644 \u0627\u0644\u0627\u062a\u0635\u0627\u0644\u0627\u062a',
              'Specialized training program to prepare managers for senior positions in transmissionss'
            )}
          </motion.p>
        </motion.div>
      </section>

      {/* ====== STATS HIGHLIGHTS ====== */}
      <section className="relative z-10 py-10 px-6 md:px-10">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {highlights.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue/5 to-gold/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-500 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue/10 to-gold/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-5 h-5 text-blue" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue to-blue/80 bg-clip-text text-transparent mb-1">
                    {stat.value || getLocalizedText(stat.value_fr, stat.value_ar, stat.value_en)}
                  </div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    {getLocalizedText(stat.label_fr, stat.label_ar, stat.label_en)}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== PROGRAM OVERVIEW ====== */}
      <section className="relative z-10 py-16 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Section header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue to-blue/80 rounded-xl shadow-lg shadow-blue/20">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue">
                  {getLocalizedText(
                    'Apercu du Programme',
                    '\u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629 \u0639\u0644\u0649 \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062c',
                    'Program Overview'
                  )}
                </h2>
              </div>
            </div>
            <div className="h-0.5 w-16 bg-gradient-to-r from-gold to-transparent rounded-full mb-10 ml-[4.5rem]" />

            <p className="text-slate-500 mb-12 leading-relaxed text-lg max-w-4xl">
              {getLocalizedText(
                "Ce type de formation est soumis a la decision ministerielle conjointe du 22 mars 2012 et concerne les fonctionnaires laureats des concours de recrutement direct annonces au niveau des directions des transmissionss de wilaya.",
                '\u064a\u062e\u0636\u0639 \u0647\u0630\u0627 \u0627\u0644\u0646\u0645\u0637 \u0645\u0646 \u0627\u0644\u062a\u0643\u0648\u064a\u0646 \u0644\u0644\u0642\u0631\u0627\u0631 \u0627\u0644\u0648\u0632\u0627\u0631\u064a \u0627\u0644\u0645\u0634\u062a\u0631\u0643 \u0627\u0644\u0645\u0624\u0631\u062e \u0641\u064a 22 \u0645\u0627\u0631\u0633 2012 \u0648\u064a\u062e\u0635 \u0627\u0644\u0645\u0648\u0638\u0641\u064a\u0646 \u0627\u0644\u0646\u0627\u062c\u062d\u064a\u0646 \u0641\u064a \u0645\u0633\u0627\u0628\u0642\u0627\u062a \u0627\u0644\u062a\u0648\u0638\u064a\u0641 \u0627\u0644\u0645\u0628\u0627\u0634\u0631 \u0648\u0627\u0644\u062a\u064a \u064a\u062a\u0645 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u0639\u0646\u0647\u0627 \u0639\u0644\u0649 \u0645\u0633\u062a\u0648\u0649 \u0645\u062f\u064a\u0631\u064a\u0627\u062a \u0627\u0644\u0645\u0648\u0627\u0635\u0644\u0627\u062a \u0627\u0644\u0633\u0644\u0643\u064a\u0629 \u0648\u0627\u0644\u0644\u0627\u0633\u0644\u0643\u064a\u0629 \u0627\u0644\u0648\u0644\u0627\u0626\u064a\u0629.',
                'This type of training is subject to the joint ministerial decision of March 22, 2012 and concerns officials successful in direct recruitment competitions announced at the level of transmissionss directorates of wilayas.'
              )}
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Regulatory Framework Card */}
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue/5 to-gold/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-8 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold/10 to-transparent rounded-bl-[3rem]" />
                  <div className="flex items-center gap-4 mb-5">
                    <div className="p-3 bg-gradient-to-br from-blue to-blue/80 rounded-xl shadow-md shadow-blue/20 group-hover:shadow-lg transition-shadow">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-blue uppercase tracking-[0.15em] text-sm">
                      {getLocalizedText('Cadre Reglementaire', '\u0627\u0644\u0625\u0637\u0627\u0631 \u0627\u0644\u0642\u0627\u0646\u0648\u0646\u064a', 'Regulatory Framework')}
                    </h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {getLocalizedText(programDetails.regulation_fr, programDetails.regulation_ar, programDetails.regulation_en)}
                  </p>
                  {/* Decorative element */}
                  <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
                    <Scale className="w-3.5 h-3.5" />
                    <span>{getLocalizedText('Texte officiel', '\u0646\u0635 \u0631\u0633\u0645\u064a', 'Official text')}</span>
                  </div>
                </div>
              </motion.div>

              {/* Training Location Card */}
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-blue/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-8 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue/8 to-transparent rounded-bl-[3rem]" />
                  <div className="flex items-center gap-4 mb-5">
                    <div className="p-3 bg-gradient-to-br from-gold to-gold/80 rounded-xl shadow-md shadow-gold/20 group-hover:shadow-lg transition-shadow">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-blue uppercase tracking-[0.15em] text-sm">
                      {getLocalizedText('Lieu de Formation', '\u0645\u0643\u0627\u0646 \u0627\u0644\u062a\u0643\u0648\u064a\u0646', 'Training Location')}
                    </h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-2">
                    {getLocalizedText(programDetails.location_fr, programDetails.location_ar, programDetails.location_en)}
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {getLocalizedText(programDetails.announcement_fr, programDetails.announcement_ar, programDetails.announcement_en)}
                  </p>
                  {/* Decorative dots */}
                  <div className="mt-6 flex gap-1.5 flex-wrap opacity-40">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="w-2 h-2 rounded-full bg-blue/30"
                        style={{ opacity: Math.random() * 0.6 + 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== TABS SECTION ====== */}
      <section className="relative z-10 py-16 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
            {/* Tab bar */}
            <div className="flex justify-center mb-12">
              <TabsList className="inline-flex bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-2xl p-1.5 shadow-lg shadow-slate-200/30 gap-1">
                <TabsTrigger
                  value="grades"
                  className="rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue data-[state=active]:to-blue/90 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue/25 text-slate-500 hover:text-blue"
                >
                  <Award className="w-4 h-4 mr-2 inline-block" />
                  {getLocalizedText('Grades', '\u0627\u0644\u0631\u062a\u0628', 'Grades')}
                </TabsTrigger>
                <TabsTrigger
                  value="requirements"
                  className="rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue data-[state=active]:to-blue/90 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue/25 text-slate-500 hover:text-blue"
                >
                  <Star className="w-4 h-4 mr-2 inline-block" />
                  {getLocalizedText('Conditions', '\u0627\u0644\u0634\u0631\u0648\u0637', 'Requirements')}
                </TabsTrigger>
                <TabsTrigger
                  value="curriculum"
                  className="rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue data-[state=active]:to-blue/90 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue/25 text-slate-500 hover:text-blue"
                >
                  <BookOpen className="w-4 h-4 mr-2 inline-block" />
                  {getLocalizedText('Programme', '\u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062c', 'Curriculum')}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* GRADES TAB */}
            <TabsContent value="grades" className="mt-0">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {targetGrades.map((grade, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ y: -6 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue/5 to-gold/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                      {/* Top gradient bar */}
                      <div className={`h-1.5 ${idx === 0 ? 'bg-gradient-to-r from-blue via-blue/80 to-blue/50' : 'bg-gradient-to-r from-gold via-gold/80 to-gold/50'}`} />

                      <div className="p-8">
                        <div className="flex items-start gap-5 mb-6">
                          <div className={`p-4 rounded-2xl shadow-md ${idx === 0 ? 'bg-gradient-to-br from-blue to-blue/80 shadow-blue/20' : 'bg-gradient-to-br from-gold to-gold/80 shadow-gold/20'} group-hover:scale-110 transition-transform duration-300`}>
                            <grade.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 ${idx === 0 ? 'bg-blue/10 text-blue' : 'bg-gold/15 text-gold'}`}>
                              {getLocalizedText(`Grade ${idx + 1}`, `\u0627\u0644\u0631\u062a\u0628\u0629 ${idx + 1}`, `Grade ${idx + 1}`)}
                            </span>
                            <h3 className="font-serif font-bold text-xl text-slate-800 leading-snug">
                              {getLocalizedText(grade.title_fr, grade.title_ar, grade.title_en)}
                            </h3>
                          </div>
                        </div>

                        <p className="text-slate-500 leading-relaxed mb-6">
                          {getLocalizedText(grade.description_fr, grade.description_ar, grade.description_en)}
                        </p>

                        {/* Duration breakdown */}
                        <div className="bg-slate-50/80 rounded-2xl p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue" />
                              <span className="text-sm text-slate-600 font-medium">{getLocalizedText('Theorique', '\u0646\u0638\u0631\u064a', 'Theoretical')}</span>
                            </div>
                            <span className="text-sm font-bold text-blue">
                              {language === 'ar' ? `${grade.theoretical} \u064a\u0648\u0645` : language === 'en' ? `${grade.theoretical} days` : `${grade.theoretical} jours`}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gold" />
                              <span className="text-sm text-slate-600 font-medium">{getLocalizedText('Pratique', '\u062a\u0637\u0628\u064a\u0642\u064a', 'Practical')}</span>
                            </div>
                            <span className="text-sm font-bold text-gold">
                              {language === 'ar' ? `${grade.practical} \u064a\u0648\u0645` : language === 'en' ? `${grade.practical} days` : `${grade.practical} jours`}
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div className="h-2.5 bg-slate-200/60 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(grade.theoretical / grade.total) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                              className="h-full bg-gradient-to-r from-blue to-blue/70 rounded-full relative"
                            >
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-gold rounded-full border-2 border-white shadow-sm" />
                            </motion.div>
                          </div>
                          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                            <span>{getLocalizedText('Theorique', '\u0646\u0638\u0631\u064a', 'Theoretical')} ({Math.round((grade.theoretical / grade.total) * 100)}%)</span>
                            <span>{getLocalizedText('Total', '\u0627\u0644\u0645\u062c\u0645\u0648\u0639', 'Total')}: {grade.total} {getLocalizedText('jours', '\u064a\u0648\u0645', 'days')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            {/* REQUIREMENTS TAB */}
            <TabsContent value="requirements" className="mt-0">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {requirements.map((req, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ y: -6 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue/5 to-gold/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500 h-full">
                      {/* Icon header */}
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${req.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <req.icon className="w-6 h-6 text-blue" />
                      </div>

                      <h3 className="font-serif font-bold text-xl text-slate-800 mb-6">
                        {getLocalizedText(req.title_fr, req.title_ar, req.title_en)}
                      </h3>

                      <ul className="space-y-4">
                        {(language === 'ar' ? req.items_ar : language === 'en' ? req.items_en : req.items_fr).map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <div className="mt-1 flex-shrink-0">
                              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center">
                                <CheckCircle className="h-3.5 w-3.5 text-gold" />
                              </div>
                            </div>
                            <span className="text-slate-500 text-sm leading-relaxed">{item}</span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* Bottom accent */}
                      <div className="mt-6 h-0.5 w-12 bg-gradient-to-r from-gold to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            {/* CURRICULUM TAB */}
            <TabsContent value="curriculum" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Training Programs Table */}
                <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue via-blue/95 to-blue/85">
                          <th className="p-5 text-left font-semibold text-white/90 text-sm uppercase tracking-wider">
                            {getLocalizedText('Grade', '\u0627\u0644\u0631\u062a\u0628\u0629', 'Grade')}
                          </th>
                          <th className="p-5 text-center font-semibold text-white/90 text-sm uppercase tracking-wider">
                            {getLocalizedText('Formation Theorique', '\u0627\u0644\u062a\u0643\u0648\u064a\u0646 \u0627\u0644\u0646\u0638\u0631\u064a', 'Theoretical Training')}
                          </th>
                          <th className="p-5 text-center font-semibold text-white/90 text-sm uppercase tracking-wider">
                            {getLocalizedText('Formation Pratique', '\u0627\u0644\u062a\u0643\u0648\u064a\u0646 \u0627\u0644\u062a\u0637\u0628\u064a\u0642\u064a', 'Practical Training')}
                          </th>
                          <th className="p-5 text-center font-semibold text-white/90 text-sm uppercase tracking-wider">
                            {getLocalizedText('Total', '\u0627\u0644\u0645\u062c\u0645\u0648\u0639', 'Total')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {trainingPrograms.map((program, idx) => (
                          <motion.tr
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`group/row hover:bg-blue/[0.03] transition-colors duration-300 ${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/50'}`}
                          >
                            <td className="p-5 border-b border-slate-100">
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-blue/5 text-blue text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                                  {idx + 1}
                                </span>
                                <span className="text-slate-700 font-semibold text-sm">
                                  {getLocalizedText(program.grade_fr, program.grade_ar, program.grade_en)}
                                </span>
                              </div>
                            </td>
                            <td className="p-5 text-center border-b border-slate-100">
                              <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue/5 text-blue font-bold text-sm">
                                {language === 'ar' ? `${program.theoretical_days} \u064a\u0648\u0645` : language === 'en' ? `${program.theoretical_days} days` : `${program.theoretical_days} jours`}
                              </span>
                            </td>
                            <td className="p-5 text-center border-b border-slate-100">
                              <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gold/10 text-gold font-bold text-sm">
                                {language === 'ar' ? `${program.practical_days} \u064a\u0648\u0645` : language === 'en' ? `${program.practical_days} days` : `${program.practical_days} jours`}
                              </span>
                            </td>
                            <td className="p-5 text-center border-b border-slate-100">
                              <div className="flex flex-col items-center gap-1.5">
                                <span className="font-bold text-blue text-sm">
                                  {program.theoretical_days + program.practical_days} {getLocalizedText('jours', '\u064a\u0648\u0645', 'days')}
                                </span>
                                {/* Mini bar */}
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${((program.theoretical_days + program.practical_days) / 120) * 100}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                                    className="h-full bg-gradient-to-r from-blue to-gold rounded-full"
                                  />
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Note banner */}
                  <div className="px-6 py-4 bg-gradient-to-r from-blue/5 to-gold/5 border-t border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-blue/10 rounded-lg flex-shrink-0 mt-0.5">
                        <Shield className="w-3.5 h-3.5 text-blue" />
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-blue">{getLocalizedText('Note:', '\u0645\u0644\u0627\u062d\u0638\u0629:', 'Note:')}</strong>{' '}
                        {getLocalizedText(
                          "La formation preparatoire pour occuper un poste se deroule au niveau de l'Ecole Nationale des Transmissions pour les deux grades.",
                          '\u064a\u062a\u0645 \u0627\u0644\u062a\u0643\u0648\u064a\u0646 \u0627\u0644\u062a\u062d\u0636\u064a\u0631\u064a \u0644\u0634\u063a\u0644 \u0645\u0646\u0635\u0628 \u0639\u0644\u0649 \u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0645\u062f\u0631\u0633\u0629 \u0627\u0644\u0648\u0637\u0646\u064a\u0629 \u0644\u0644\u0645\u0648\u0627\u0635\u0644\u0627\u062a \u0627\u0644\u0633\u0644\u0643\u064a\u0629 \u0648\u0627\u0644\u0644\u0627\u0633\u0644\u0643\u064a\u0629 \u0628\u0627\u0644\u0646\u0633\u0628\u0629 \u0644\u0643\u0644\u0627 \u0627\u0644\u0631\u062a\u0628\u062a\u064a\u0646.',
                          'Preparatory training for occupying a position takes place at the National School of transmissionss for both grades.'
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visual comparison cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {trainingPrograms.map((program, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15 }}
                      className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/60 p-6 shadow-sm"
                    >
                      <h4 className="font-semibold text-sm text-slate-800 mb-4 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-blue' : 'bg-gold'}`} />
                        {getLocalizedText(program.grade_fr, program.grade_ar, program.grade_en)}
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                            <span>{getLocalizedText('Theorique', '\u0646\u0638\u0631\u064a', 'Theoretical')}</span>
                            <span className="font-semibold text-blue">{program.theoretical_days} {getLocalizedText('jours', '\u064a\u0648\u0645', 'days')}</span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(program.theoretical_days / (program.theoretical_days + program.practical_days)) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-blue to-blue/70 rounded-full"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                            <span>{getLocalizedText('Pratique', '\u062a\u0637\u0628\u064a\u0642\u064a', 'Practical')}</span>
                            <span className="font-semibold text-gold">{program.practical_days} {getLocalizedText('jours', '\u064a\u0648\u0645', 'days')}</span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(program.practical_days / (program.theoretical_days + program.practical_days)) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                              className="h-full bg-gradient-to-r from-gold to-gold/70 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* ====== HOW TO APPLY SECTION ====== */}
      <section className="relative z-10 py-20 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Section header */}
            <div className="text-center mb-14">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/80 border border-gold/20 shadow-lg shadow-gold/5 backdrop-blur-md mb-6"
              >
                <FileText className="h-4 w-4 text-gold" />
                <span className="text-blue text-xs font-bold uppercase tracking-[0.2em]">
                  {getLocalizedText('Inscription', 'التسجيل', 'Registration')}
                </span>
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-blue mb-4">
                {getLocalizedText(
                  "Comment s'inscrire",
                  'كيفية الالتحاق',
                  'How to Apply'
                )}
              </h2>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-1 bg-gradient-to-r from-gold via-gold to-gold/50 rounded-full mx-auto mb-4"
              />
              <p className="text-slate-500 mt-6 leading-relaxed text-lg max-w-3xl mx-auto">
                {getLocalizedText(
                  "Vous pouvez rejoindre la formation à l'École Nationale des Télécommunications après avoir réussi le concours organisé par la Direction Générale des Télécommunications Nationales relevant du Ministère de l'Intérieur, des Collectivités Locales et de l'Aménagement du Territoire ou d'autres organismes",
                  'يمكنك الالتحاق بالتكوين في المدرسة الوطنية للمواصلات السلكية واللاسلكية بعد نجاحك في المسابقة المنظمة من طرف المديرية العامة للمواصلات السلكية واللاسلكية الوطنية التابعة لوزارة الداخلية والجماعات المحلية والتهيئة العمرانية أو هيئات أخرى',
                  'You can join the training at the National School of transmissionss after passing the competition organized by the General Directorate of National transmissionss under the Ministry of Interior, Local Communities and Urban Planning or other organizations'
                )}
              </p>
            </div>

            {/* ===== GRADE 1: Agent Ouvrier ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              {/* Grade header with accent line */}
              <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                  <div className="p-3.5 bg-gradient-to-br from-blue to-blue/80 rounded-2xl shadow-lg shadow-blue/20">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gold text-white text-[9px] font-bold flex items-center justify-center shadow-md">1</div>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-2xl md:text-3xl text-slate-800">
                    {getLocalizedText("Grade d'Agent Ouvrier", 'رتبة عون عامل', 'Worker Agent Grade')}
                  </h3>
                  <div className="h-0.5 w-12 bg-gradient-to-r from-blue to-transparent rounded-full mt-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Diploma Card */}
                <motion.div
                  whileHover={{ y: -5, scale: 1.005 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue/8 to-gold/8 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-2xl transition-all duration-500 h-full overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue via-blue/80 to-blue/40" />
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue/[0.04] to-transparent rounded-bl-full" />

                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-gradient-to-br from-blue/10 to-blue/5 rounded-2xl border border-blue/10 group-hover:border-blue/20 transition-colors duration-300">
                        <GraduationCap className="h-6 w-6 text-blue" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-800 tracking-tight">
                          {getLocalizedText('Diplôme requis', 'الشهادة المطلوبة', 'Required Certificate')}
                        </h4>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {getLocalizedText('Pour participer au concours', 'للمشاركة في المسابقة', 'To participate in the competition')}
                        </p>
                      </div>
                    </div>

                    {/* Single prominent diploma */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue/[0.06] to-blue/[0.02] border border-blue/15 mb-6"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue to-blue/80 flex items-center justify-center shadow-lg shadow-blue/20 flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="text-blue font-bold text-lg block">
                          {getLocalizedText('2ème année secondaire', 'السنة 2 ثانوي', '2nd Year Secondary')}
                        </span>
                        <span className="text-slate-400 text-xs">
                          {getLocalizedText('Niveau minimum requis', 'المستوى الأدنى المطلوب', 'Minimum required level')}
                        </span>
                      </div>
                    </motion.div>

                    {/* Note */}
                    <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center">
                          <CheckCircle className="h-3.5 w-3.5 text-gold" />
                        </div>
                        <p className="text-slate-500 leading-relaxed text-sm">
                          {getLocalizedText(
                            "Ce niveau permet à son titulaire de participer au concours sur la base d'épreuves ou sur la base du diplôme pour accéder au grade d'agent ouvrier",
                            'هذا المستوى يسمح لصاحبه بالمشاركة في المسابقة على أساس الإختبارات أو على أساس الشهادة للإلتحاق برتبة عون عامل',
                            'This level allows the holder to participate in the competition based on examinations or based on the certificate to join the rank of worker agent'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Conditions Card */}
                <motion.div
                  whileHover={{ y: -5, scale: 1.005 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/8 to-blue/8 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-2xl transition-all duration-500 h-full overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold/80 to-gold/40" />
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-gold/[0.04] to-transparent rounded-bl-full" />

                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl border border-gold/10 group-hover:border-gold/20 transition-colors duration-300">
                        <Shield className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-800 tracking-tight">
                          {getLocalizedText('Conditions de participation', 'شروط المشاركة', 'Participation Requirements')}
                        </h4>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {getLocalizedText('Critères essentiels', 'المعايير الأساسية', 'Essential criteria')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Age */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-blue/15 transition-all duration-300"
                      >
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue/8 flex items-center justify-center">
                          <Calendar className="w-4.5 h-4.5 text-blue" />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700 text-sm block mb-0.5">
                            {getLocalizedText('Âge', 'السن', 'Age')}
                          </span>
                          <span className="text-slate-500 text-[13px] leading-relaxed">
                            {getLocalizedText(
                              'Entre 18 ans minimum et 35 ans maximum à la date du concours',
                              'مابين 18 سنة على الأقل و 35 سنة على الأكثر عند تاريخ إجراء المسابقة',
                              'Between 18 years minimum and 35 years maximum at the date of the competition'
                            )}
                          </span>
                        </div>
                      </motion.div>

                      {/* Specializations */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-gold/15 transition-all duration-300"
                      >
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gold/8 flex items-center justify-center">
                          <BookOpen className="w-4.5 h-4.5 text-gold" />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700 text-sm block mb-2">
                            {getLocalizedText('Spécialités requises', 'التخصصات المطلوبة', 'Required Specializations')}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-white text-blue font-medium text-sm border border-blue/12 shadow-sm">
                              {getLocalizedText('Mathématiques', 'رياضيات', 'Mathematics')}
                            </span>
                            <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-white text-gold font-medium text-sm border border-gold/12 shadow-sm">
                              {getLocalizedText('Sciences expérimentales', 'علوم تجريبية', 'Experimental Sciences')}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* ===== GRADE 2: Assistant Technique Spécialisé Principal ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              {/* Grade header with accent line */}
              <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                  <div className="p-3.5 bg-gradient-to-br from-gold to-gold/80 rounded-2xl shadow-lg shadow-gold/20">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue text-white text-[9px] font-bold flex items-center justify-center shadow-md">2</div>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-2xl md:text-3xl text-slate-800">
                    {getLocalizedText("Grade d'Assistant Technique Spécialisé Principal", 'رتبة مساعد تقني متخصص رئيسي', 'Principal Specialized Technical Assistant Grade')}
                  </h3>
                  <div className="h-0.5 w-12 bg-gradient-to-r from-gold to-transparent rounded-full mt-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Diploma Card */}
                <motion.div
                  whileHover={{ y: -5, scale: 1.005 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/8 to-blue/8 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-2xl transition-all duration-500 h-full overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold/80 to-gold/40" />
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-gold/[0.04] to-transparent rounded-bl-full" />

                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl border border-gold/10 group-hover:border-gold/20 transition-colors duration-300">
                        <GraduationCap className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-800 tracking-tight">
                          {getLocalizedText('Diplôme requis', 'الشهادة المطلوبة', 'Required Certificate')}
                        </h4>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {getLocalizedText('Pour participer au concours', 'للمشاركة في المسابقة', 'To participate in the competition')}
                        </p>
                      </div>
                    </div>

                    {/* Single prominent diploma */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-gold/[0.06] to-gold/[0.02] border border-gold/15 mb-6"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-gold/80 flex items-center justify-center shadow-lg shadow-gold/20 flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="text-gold font-bold text-lg block">
                          {getLocalizedText('Licence', 'ليسانس', 'Bachelor\'s Degree')}
                        </span>
                        <span className="text-slate-400 text-xs">
                          {getLocalizedText('Niveau minimum requis', 'المستوى الأدنى المطلوب', 'Minimum required level')}
                        </span>
                      </div>
                    </motion.div>

                    {/* Note */}
                    <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center">
                          <CheckCircle className="h-3.5 w-3.5 text-gold" />
                        </div>
                        <p className="text-slate-500 leading-relaxed text-sm">
                          {getLocalizedText(
                            "Cette certification permet à son titulaire de participer au concours sur la base d'épreuves ou sur la base du diplôme pour accéder au grade d'assistant technique spécialisé principal",
                            'هذه الشهادة تسمح لحاملها بالمشاركة في المسابقة على أساس الإختبارات أو على أساس الشهادة للإلتحاق برتبة مساعد تقني متخصص رئيسي',
                            'This certificate allows the holder to participate in the competition based on examinations or based on the certificate to join the rank of principal specialized technical assistant'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Conditions Card */}
                <motion.div
                  whileHover={{ y: -5, scale: 1.005 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue/8 to-gold/8 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-2xl transition-all duration-500 h-full overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue via-blue/80 to-blue/40" />
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue/[0.04] to-transparent rounded-bl-full" />

                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-gradient-to-br from-blue/10 to-blue/5 rounded-2xl border border-blue/10 group-hover:border-blue/20 transition-colors duration-300">
                        <Shield className="h-6 w-6 text-blue" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-800 tracking-tight">
                          {getLocalizedText('Conditions de participation', 'شروط المشاركة', 'Participation Requirements')}
                        </h4>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {getLocalizedText('Critères essentiels', 'المعايير الأساسية', 'Essential criteria')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Age */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-blue/15 transition-all duration-300"
                      >
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue/8 flex items-center justify-center">
                          <Calendar className="w-4.5 h-4.5 text-blue" />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700 text-sm block mb-0.5">
                            {getLocalizedText('Âge', 'السن', 'Age')}
                          </span>
                          <span className="text-slate-500 text-[13px] leading-relaxed">
                            {getLocalizedText(
                              'Entre 21 ans minimum et 30 ans maximum à la date du concours',
                              'مابين 21 سنة على الأقل و 30 سنة على الأكثر عند تاريخ إجراء المسابقة',
                              'Between 21 years minimum and 30 years maximum at the date of the competition'
                            )}
                          </span>
                        </div>
                      </motion.div>

                      {/* Specializations */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-gold/15 transition-all duration-300"
                      >
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gold/8 flex items-center justify-center">
                          <BookOpen className="w-4.5 h-4.5 text-gold" />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700 text-sm block mb-2">
                            {getLocalizedText('Spécialités requises', 'التخصصات المطلوبة', 'Required Specializations')}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white text-blue font-medium text-xs border border-blue/12 shadow-sm">
                              {getLocalizedText('Technologie', 'التكنولوجيا', 'Technology')}
                            </span>
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white text-gold font-medium text-xs border border-gold/12 shadow-sm">
                              {getLocalizedText('Télécommunications', 'الإتصالات السلكية واللاسلكية', 'transmissionss')}
                            </span>
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white text-blue font-medium text-xs border border-blue/12 shadow-sm">
                              {getLocalizedText('Électronique', 'الإلكترونيك', 'Electronics')}
                            </span>
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white text-gold font-medium text-xs border border-gold/12 shadow-sm">
                              {getLocalizedText('Informatique', 'الإعلام الآلي', 'Computer Science')}
                            </span>
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white text-blue font-medium text-xs border border-blue/12 shadow-sm">
                              {getLocalizedText('Électrotechnique', 'الإلكتروتقني', 'Electrotechnics')}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ====== CTA SECTION ====== */}
      <section className="relative z-10 py-20 px-6 md:px-10">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[2rem]"
          >
            {/* CTA layered background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue via-blue/95 to-blue/85" />
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at 30% 70%, rgba(232,201,122,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)`
            }} />
            {/* Decorative geometric shapes */}
            <div className="absolute -top-12 -right-12 w-48 h-48 border border-white/10 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 border border-gold/20 rounded-full" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute top-8 right-16 w-20 h-20 border border-white/5 rounded-xl"
            />

            <div className="relative p-10 md:p-16 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8"
              >
                <GraduationCap className="w-4 h-4 text-gold" />
                <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                  {getLocalizedText('Rejoignez-nous', '\u0627\u0646\u0636\u0645 \u0625\u0644\u064a\u0646\u0627', 'Join Us')}
                </span>
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-5 leading-tight">
                {getLocalizedText(
                  'Interesse par ce programme ?',
                  '\u0647\u0644 \u0623\u0646\u062a \u0645\u0647\u062a\u0645 \u0628\u0647\u0630\u0627 \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062c\u061f',
                  'Interested in this program?'
                )}
              </h2>
              <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
                {getLocalizedText(
                  "Decouvrez plus d'informations sur les conditions d'admission et les procedures d'inscription au programme de Formation Preparatoire",
                  '\u0627\u0643\u062a\u0634\u0641 \u0627\u0644\u0645\u0632\u064a\u062f \u0639\u0646 \u0634\u0631\u0648\u0637 \u0627\u0644\u0642\u0628\u0648\u0644 \u0648\u0625\u062c\u0631\u0627\u0621\u0627\u062a \u0627\u0644\u062a\u0633\u062c\u064a\u0644 \u0641\u064a \u0628\u0631\u0646\u0627\u0645\u062c \u0627\u0644\u062a\u0643\u0648\u064a\u0646 \u0627\u0644\u062a\u062d\u0636\u064a\u0631\u064a \u0644\u0634\u063a\u0644 \u0645\u0646\u0635\u0628',
                  'Discover more information about admission requirements and registration procedures for the Preparatory Training program'
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-blue font-bold text-sm hover:bg-gold hover:text-white transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-gold/30 hover:scale-105"
                >
                  {getLocalizedText('Contactez-nous', '\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627', 'Contact Us')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  to="/formation"
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-bold text-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm hover:scale-105"
                >
                  {getLocalizedText("Explorer d'autres programmes", '\u0627\u0633\u062a\u0643\u0634\u0641 \u0627\u0644\u0628\u0631\u0627\u0645\u062c \u0627\u0644\u0623\u062e\u0631\u0649', 'Explore Other Programs')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PreparatoryTraining;
