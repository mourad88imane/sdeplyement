import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Compass, Users, Calendar, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SteeringCommittee = () => {
  const { language } = useLanguage();

  // Animation variants matching hero section
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Données des membres du comité d'orientation
  const committeeMembers = [
    {
      id: 1,
      nameFr: "Directeur Général des Transmissions nationale",
      nameAr: "المدير العام للمواصلات السلكية واللاسلكية",
      titleFr: "Président du Comité",
      titleAr: "رئيسا",
      departmentFr: "Direction Générale des Transmissions",
      departmentAr: "المديرية العامة للمواصلات السلكية واللاسلكية"
    },
    {
      id: 2,
      nameFr: "Représentant du Ministre de la Défense Nationale",
      nameAr: "ممثل وزير الدفاع الوطني",
      titleFr: "Membre du Comité",
      titleAr: "عضو اللجنة",
      departmentFr: "Ministère de la Défense Nationale",
      departmentAr: "وزارة الدفاع الوطني"
    },
    {
      id: 3,
      nameFr: "Représentant du Ministre des Affaires Étrangères",
      nameAr: "ممثل وزير الشؤون الخارجية",
      titleFr: "Membre du Comité",
      titleAr: "عضو اللجنة",
      departmentFr: "Ministère des Affaires Étrangères",
      departmentAr: "وزارة الشؤون الخارجية"
    },
    {
      id: 4,
      nameFr: "Représentant de la Direction Générale de la Fonction Publique",
      nameAr: "ممثل المديرية العامة للوظيفة العمومية والإصلاح الإداري",
      titleFr: "Membre du Comité",
      titleAr: "عضو اللجنة",
      departmentFr: "Direction Générale de la Fonction Publique et de la Réforme Administrative",
      departmentAr: "المديرية العامة للوظيفة العمومية والإصلاح الإداري"
    },
    {
      id: 5,
      nameFr: "Représentant du Ministère de l'Éducation",
      nameAr: "ممثل وزارة التربية",
      titleFr: "Membre du Comité",
      titleAr: "عضو اللجنة",
      departmentFr: "Ministère de l'Éducation",
      departmentAr: "وزارة التربية"
    },
    {
      id: 6,
      nameFr: "Directeur de l'École Nationale des Télécommunications",
      nameAr: "مدير المدرسة الوطنية للمواصلات السلكية واللاسلكية",
      titleFr: "Membre du Comité",
      titleAr: "عضو اللجنة",
      departmentFr: "École Nationale des Télécommunications",
      departmentAr: "المدرسة الوطنية للمواصلات السلكية واللاسلكية"
    },
    {
      id: 7,
      nameFr: "Directeur des Études et des Stages",
      nameAr: "مدير الدراسات والتداريب",
      titleFr: "Membre du Comité",
      titleAr: "عضو اللجنة",
      departmentFr: "Direction des Études et des Stages",
      departmentAr: "مديرية الدراسات والتداريب"
    },
    {
      id: 8,
      nameFr: "Représentants du Corps Enseignant",
      nameAr: "ممثلين عن المدرسين",
      titleFr: "Membres du Comité",
      titleAr: "أعضاء اللجنة",
      departmentFr: "Corps Enseignant",
      departmentAr: "هيئة التدريس"
    },
    {
      id: 9,
      nameFr: "Représentants des Étudiants",
      nameAr: "ممثلين عن الطلبة",
      titleFr: "Membres du Comité",
      titleAr: "أعضاء اللجنة",
      departmentFr: "Corps Étudiant",
      departmentAr: "الهيئة الطلابية"
    }
  ];

  // Responsabilités du comité
  const responsibilities = [
    {
      id: 1,
      icon: FileText,
      titleFr: "Organisation des Études",
      titleAr: "تنظيم الدراسة",
      titleEn: "Organization of Studies",
      descriptionFr: "Donner son avis sur l'organisation des études et des stages au sein de l'école.",
      descriptionAr: "تعطي رأيها في تنظيم الدراسة والتداريب في المدرسة.",
      descriptionEn: "Provide advice on the organization of studies and internships at the school."
    },
    {
      id: 2,
      icon: CheckCircle,
      titleFr: "Programmes d'Enseignement",
      titleAr: "برامج التدريس",
      titleEn: "Teaching Programs",
      descriptionFr: "Examiner et donner son avis sur les programmes d'enseignement proposés par l'école.",
      descriptionAr: "تعطي رأيها في برامج التدريس المقترحة من قبل المدرسة.",
      descriptionEn: "Review and provide advice on teaching programs proposed by the school."
    },
    {
      id: 3,
      icon: Calendar,
      titleFr: "Réunions Périodiques",
      titleAr: "الاجتماعات الدورية",
      titleEn: "Regular Meetings",
      descriptionFr: "Se réunit une à deux fois par an pour discuter des questions relatives à l'organisation des études et des programmes.",
      descriptionAr: "تعقد اجتماعاتها مرة أو مرتين في السنة لمناقشة المسائل المتعلقة بتنظيم الدراسة والبرامج.",
      descriptionEn: "Meets one to two times per year to discuss matters related to the organization of studies and programs."
    }
  ];

  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* BACKGROUND DECORATIONS - Matching Hero */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background: `
            radial-gradient(circle at 15% 25%, rgba(19, 48, 89, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 85% 75%, rgba(232, 201, 122, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(19, 48, 89, 0.05) 0%, transparent 80%)
          `,
        }}
      />

      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue via-gold to-blue opacity-30" />

      {/* HERO BANNER */}
      <section className="relative z-10 pt-24 pb-16 px-6 md:px-10 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`max-w-3xl mx-auto ${language === 'ar' ? 'text-right' : 'text-center'}`}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue/20 bg-blue/5 backdrop-blur-sm hover:bg-blue/10 transition-colors mb-6"
          >
            <Compass className="w-4 h-4 text-gold animate-pulse" />
            <span className="text-blue text-xs font-bold uppercase tracking-widest">
              {language === 'ar' ? '🧭 التوجيه الاستراتيجي' : language === 'en' ? '🧭 Strategic Direction' : '🧭 Direction Stratégique'}
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-blue leading-[1.15] mb-6">
            {language === 'ar' ? 'لجنة التوجيه' : language === 'en' ? 'Steering Committee' : 'Comité d\'Orientation'}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-gold to-blue rounded-full mx-auto mb-6" />
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
            {language === 'ar'
              ? 'هيئة استشارية تعمل على توجيه وتطوير البرامج التعليمية للمدرسة'
              : language === 'en'
              ? 'An advisory body working to guide and develop the school\'s educational programs'
              : 'Organe consultatif travaillant à orienter et développer les programmes éducatifs de l\'école'}
          </p>
        </motion.div>
      </section>

      {/* INTRODUCTION SECTION */}
      <section className="relative z-10 py-12 px-6 md:px-10">
        <div className="container mx-auto max-w-[1400px]">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              {language === 'ar' ? (
                <>
                  <Compass className="h-8 w-8 text-gold flex-shrink-0" />
                  <h2 className="text-2xl font-serif font-bold text-blue">
                    نبذة عن لجنة التوجيه
                  </h2>
                </>
              ) : (
                <>
                  <Compass className="h-8 w-8 text-gold flex-shrink-0" />
                  <h2 className="text-2xl font-serif font-bold text-blue">
                    {language === 'en' ? 'About the Committee' : 'À Propos du Comité d\'Orientation'}
                  </h2>
                </>
              )}
            </div>
            <p className={`text-slate-600 mb-6 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {language === 'ar'
                ? 'لجنة التوجيه هي هيئة استشارية تلعب دورًا مهمًا في المدرسة الوطنية للمواصلات السلكية واللاسلكية. تتكون اللجنة من ممثلين عن مختلف الوزارات والإدارات، بالإضافة إلى مدير المدرسة ومدير الدراسات وممثلين عن المدرسين والطلبة.'
                : language === 'en'
                ? 'The Steering Committee is an advisory body that plays an important role at the National School of transmissionss. The committee comprises representatives from various ministries and administrations, as well as the school director, director of studies, and representatives from faculty and students.'
                : 'Le Comité d\'Orientation est un organe consultatif qui joue un rôle important au sein de l\'École Nationale des Transmissions. Le comité est composé de représentants de différents ministères et administrations, ainsi que du directeur de l\'école, du directeur des études et de représentants des enseignants et des étudiants.'}
            </p>
            <p className={`text-slate-600 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {language === 'ar'
                ? 'تتمثل المهمة الرئيسية للجنة في إبداء الرأي حول تنظيم الدراسة والتداريب وبرامج التدريس في المدرسة. تعقد اللجنة اجتماعاتها مرة أو مرتين في السنة لمناقشة هذه المسائل وتقديم التوصيات اللازمة لتحسين جودة التعليم في المدرسة.'
                : language === 'en'
                ? 'The committee\'s primary mission is to provide advice on the organization of studies, internships, and teaching programs at the school. The committee meets one to two times per year to discuss these matters and provide recommendations for improving the quality of education at the school.'
                : 'La mission principale du comité est de donner son avis sur l\'organisation des études, des stages et des programmes d\'enseignement de l\'école. Le comité se réunit une à deux fois par an pour discuter de ces questions et formuler les recommandations nécessaires à l\'amélioration de la qualité de l\'enseignement au sein de l\'école.'}
            </p>
          </div>
        </div>
      </section>

      {/* RESPONSIBILITIES SECTION */}
      <section className="relative z-10 py-16 px-6 md:px-10 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              {language === 'ar' ? (
                <>
                  <CheckCircle className="h-8 w-8 text-gold flex-shrink-0" />
                  <h2 className="text-2xl font-serif font-bold text-blue">
                    مسؤوليات اللجنة
                  </h2>
                </>
              ) : (
                <>
                  <CheckCircle className="h-8 w-8 text-gold flex-shrink-0" />
                  <h2 className="text-2xl font-serif font-bold text-blue">
                    {language === 'en' ? 'Committee Responsibilities' : 'Responsabilités du Comité'}
                  </h2>
                </>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {responsibilities.map((responsibility, idx) => {
              const Icon = responsibility.icon;
              return (
                <motion.div
                  key={responsibility.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-blue/10 hover:border-gold/30 transition-all shadow-sm hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue/10 to-gold/10 rounded-lg">
                      <Icon className="h-5 w-5 text-blue" />
                    </div>
                    <h3 className="font-semibold text-blue">
                      {language === 'ar' ? responsibility.titleAr : language === 'en' ? responsibility.titleEn : responsibility.titleFr}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {language === 'ar' ? responsibility.descriptionAr : language === 'en' ? responsibility.descriptionEn : responsibility.descriptionFr}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMMITTEE MEMBERS SECTION */}
      <section className="relative z-10 py-16 px-6 md:px-10">
        <div className="container mx-auto max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              {language === 'ar' ? (
                <>
                  <Users className="h-8 w-8 text-gold flex-shrink-0" />
                  <h2 className="text-2xl font-serif font-bold text-blue">
                    أعضاء اللجنة
                  </h2>
                </>
              ) : (
                <>
                  <Users className="h-8 w-8 text-gold flex-shrink-0" />
                  <h2 className="text-2xl font-serif font-bold text-blue">
                    {language === 'en' ? 'Committee Members' : 'Membres du Comité'}
                  </h2>
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {committeeMembers.map((member) => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                whileHover={{ x: 8 }}
                className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm hover:shadow-lg border border-blue/10 hover:border-gold/30 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className={language === 'ar' ? 'text-right' : ''}>
                    <h3 className="font-serif font-bold text-lg text-blue">
                      {language === 'ar' ? member.nameAr : language === 'en' ? member.nameFr : member.nameFr}
                    </h3>
                    <p className="text-gold font-semibold text-sm mt-1">
                      {language === 'ar' ? member.titleAr : language === 'en' ? member.titleFr : member.titleFr}
                    </p>
                  </div>
                  <div className={`px-4 py-2 bg-blue/5 border border-blue/10 rounded-lg ${language === 'ar' ? 'text-right' : ''}`}>
                    <span className="text-sm text-slate-600 font-medium">
                      {language === 'ar' ? member.departmentAr : language === 'en' ? member.departmentFr : member.departmentFr}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 py-16 px-6 md:px-10">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-blue">
              {language === 'ar' ? 'تعرف على المزيد' : language === 'en' ? 'Learn More' : 'En Savoir Plus'}
            </h2>
            <p className="text-slate-600 mb-8">
              {language === 'ar'
                ? 'للمزيد من المعلومات عن لجنة التوجيه والبرامج التعليمية'
                : language === 'en'
                ? 'For more information about the steering committee and educational programs'
                : 'Pour plus d\'informations sur le comité d\'orientation et les programmes éducatifs'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/board"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue text-white font-bold text-sm hover:bg-blue-dark transition-all duration-300 shadow-lg hover:shadow-blue/30 hover:scale-105 active:scale-95"
              >
                {language === 'ar' ? 'مجلس الإدارة' : language === 'en' ? 'Board of Directors' : 'Conseil d\'Administration'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-blue/30 text-blue font-bold text-sm hover:border-blue hover:bg-blue/5 transition-all duration-300"
              >
                {language === 'ar' ? 'عن المدرسة' : language === 'en' ? 'About School' : 'À Propos'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none opacity-30" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue/20 rounded-full blur-3xl pointer-events-none opacity-20" />
    </div>
  );
};

export default SteeringCommittee;
