import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useCallback, useMemo } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Building2,
  Sparkles,
  ArrowRight,
  Clock,
  Briefcase,
  School,
  TrendingUp,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MuseumTraining = () => {
  const { language: lang } = useLanguage();
  const isRtl = lang === 'ar';

  const t = useCallback(
    (ar: string, fr: string, en: string) =>
      lang === 'ar' ? ar : lang === 'en' ? en : fr,
    [lang],
  );

  const texts = useMemo(
    () => ({
      pageTitle: t(
        'تطور التكوين',
        'Evolution de la Formation',
        'Evolution of Training',
      ),
      pageSubtitle: t(
        'تتبع تاريخ تكوين المهندسين والتقنيين في مجال الاتصالات في الجزائر',
        "Retracez l'histoire de la formation des ingenieurs et techniciens en transmissionss en Algerie.",
        'Trace the history of engineer and technician training in transmissionss in Algeria.',
      ),
      introTitle: t(
        'إرث تعليمي غني',
        'Un Heritage Educatif Riche',
        'A Rich Educational Heritage',
      ),
      introText: t(
        'على مدى عقود، لعبت المدرسة الوطنية للمواصلات السلكية واللاسلكية دورًا محوريًا في تكوين أجيال من المهندسين والتقنيين المتخصصين في مجال الاتصالات. تواصل التطور لتوفير كوادر مؤهلة تأهيلاً عالياً لصناعة الاتصالات.',
        "Au fil des decennies, l'Ecole Nationale des Transmissions a joue un role central dans la formation de generations d'ingenieurs et techniciens specialises dans le domaine des transmissionss. Elle continue de se developper, fournissant des cadres hautement qualifies pour l'industrie des transmissionss.",
        'Over the decades, the National School of Transmissions has played a central role in training generations of engineers and technicians specializing in transmissionss. It continues to evolve, providing highly qualified professionals for the transmissionss industry.',
      ),
      milestonesTitle: t(
        'المراحل الرئيسية',
        'Jalons Importants',
        'Key Milestones',
      ),
      backToMuseum: t(
        'العودة إلى المتحف',
        'Retour au Musee',
        'Back to Museum',
      ),
      learnMore: t('اعرف المزيد', 'En savoir plus', 'Learn More'),
      todayTitle: t("اليوم", "Aujourd'hui", 'Today'),
      todayText: t(
        'تواصل المدرسة التزامها بالتميز في التعليم والتدريب، مع برامج حديثة تواكب التطورات التكنولوجية المتسارعة في مجال الاتصالات.',
        "L'ecole continue son engagement envers l'excellence dans l'education et la formation, avec des programmes modernes qui suivent les evolutions technologiques rapides dans le domaine des transmissionss.",
        'The school continues its commitment to excellence in education and training, with modern programs that keep pace with rapid technological developments in transmissionss.',
      ),
      programsTitle: t(
        'البرامج التدريبية',
        'Programmes de Formation',
        'Training Programs',
      ),
    }),
    [t],
  );

  const milestones = [
    {
      year: '1963',
      title: t(
        'إنشاء المدرسة',
        "Creation de l'Ecole",
        'Establishment of the School',
      ),
      description: t(
        'إنشاء المدرسة الوطنية للمواصلات في الجزائر لتكوين المهندسين والتقنيين في مجال الاتصالات.',
        "Creation de l'Ecole Nationale des Transmissions a Alger pour former les premiers ingenieurs et techniciens en transmissionss.",
        'Establishment of the National School of Transmissions in Algiers to train the first engineers and technicians in transmissionss.',
      ),
      icon: <Building2 className="h-6 w-6" />,
      color: 'from-amber-600 to-orange-700',
    },
    {
      year: '1970',
      title: t(
        'توسيع البرامج',
        'Expansion des Programmes',
        'Program Expansion',
      ),
      description: t(
        'تنويع التدريب مع إدخال برامج متخصصة جديدة في الإلكترونيك والاتصالات.',
        "Diversification des formations avec l'introduction de nouveaux programmes specialises en electronique et transmissionss.",
        'Diversification of training with the introduction of new specialized programs in electronics and transmissionss.',
      ),
      icon: <BookOpen className="h-6 w-6" />,
      color: 'from-yellow-500 to-amber-600',
    },
    {
      year: '1985',
      title: t(
        'التحديث التكنولوجي',
        'Modernisation Technologique',
        'Technological Modernization',
      ),
      description: t(
        'تحديث البنية التحتية وإدخال التقنيات الرقمية في برامج التدريب.',
        "Mise a niveau des infrastructures et introduction des technologies numeriques dans les programmes de formation.",
        'Infrastructure upgrade and introduction of digital technologies in training programs.',
      ),
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      year: '1995',
      title: t('العصر الرقمي', 'Ere Numerique', 'The Digital Era'),
      description: t(
        'التكيف مع تقنيات المعلومات والاتصال الجديدة (TIC).',
        "Adaptation aux nouvelles technologies de l'information et de la communication (TIC).",
        'Adaptation to new information and communication technologies (ICT).',
      ),
      icon: <Award className="h-6 w-6" />,
      color: 'from-violet-500 to-purple-700',
    },
    {
      year: '2005',
      title: t(
        'شراكات دولية',
        'Partenariats Internationaux',
        'International Partnerships',
      ),
      description: t(
        'إنشاء شراكات مع مؤسسات دولية وبرامج تبادل.',
        "Etablissement de partenariats avec des institutions internationales et programmes d'echange.",
        'Establishing partnerships with international institutions and exchange programs.',
      ),
      icon: <Users className="h-6 w-6" />,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      year: '2015+',
      title: t(
        'التكوين المستمر',
        'Formation Continue',
        'Continuing Education',
      ),
      description: t(
        'تطوير برامج التكوين المستمر للمهنيين العاملين.',
        "Developpement de programmes de formation continue pour les professionnels en activite.",
        'Development of continuing education programs for working professionals.',
      ),
      icon: <GraduationCap className="h-6 w-6" />,
      color: 'from-emerald-500 to-teal-700',
    },
  ];

  const programs = [
    {
      title: t(
        'تكوين المهندسين',
        'Formation des Ingenieurs',
        'Engineer Training',
      ),
      description: t(
        'تدريب عالي المستوى للمهندسين المتخصصين في الاتصالات السلكية واللاسلكية.',
        "Formation de haut niveau pour les ingenieurs specialises en transmissions et transmissionss.",
        'High-level training for engineers specializing in transmissions and transmissionss.',
      ),
      icon: <School className="h-8 w-8" />,
    },
    {
      title: t(
        'تقنيون متخصصون',
        'Techniciens Specialises',
        'Specialized Technicians',
      ),
      description: t(
        'تدريب عملي للتقنيين المسؤولين عن تركيب وصيانة المعدات.',
        "Formation pratique pour les techniciens charges de l'installation et de la maintenance des equipements.",
        'Hands-on training for technicians responsible for equipment installation and maintenance.',
      ),
      icon: <Briefcase className="h-8 w-8" />,
    },
    {
      title: t(
        'التكوين المستمر',
        'Formation Continue',
        'Continuing Education',
      ),
      description: t(
        'برامج تحديث للمهنيين العاملين في القطاع.',
        "Programmes de mise a niveau pour les professionnels en activite dans le secteur.",
        'Upskilling programs for active professionals in the sector.',
      ),
      icon: <Star className="h-8 w-8" />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(19,48,89,0.04)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(232,201,122,0.05)_0%,transparent_50%)]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#133059]/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10">
        {/* HEADER */}
        <motion.div
          className="pt-32 pb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="mb-8">
            <Link
              to="/about/museum"
              className="inline-flex items-center gap-2 text-[#133059]/60 hover:text-[#e8c97a] transition-colors duration-300 text-sm font-medium group"
            >
              <ArrowLeft className={`h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300 ${isRtl ? 'rotate-180' : ''}`} />
              {texts.backToMuseum}
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/80 border border-[#e8c97a]/20 shadow-lg shadow-[#e8c97a]/5 backdrop-blur-md mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e8c97a]" />
            <span className="text-[#133059] text-[11px] font-bold uppercase tracking-[0.2em]">
              {t('التكوين', 'Formation', 'Training')}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-serif font-bold text-[#133059] mb-6 tracking-tight leading-tight"
            style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
          >
            {texts.pageTitle}
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-px w-16 bg-gradient-to-r from-[#e8c97a] to-transparent" />
            <div className="w-2 h-2 rounded-full bg-[#e8c97a] shadow-sm shadow-[#e8c97a]/40" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#e8c97a]/60" />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-500 max-w-3xl leading-relaxed"
          >
            {texts.pageSubtitle}
          </motion.p>
        </motion.div>

        {/* INTRO SECTION */}
        <motion.div
          className="mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#133059]/[0.03] to-[#e8c97a]/[0.03] rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-10 md:p-14 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#133059] via-[#e8c97a]/60 to-transparent" />
              <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-[#e8c97a]/[0.04] to-transparent rounded-bl-full" />

              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#133059] mb-6 tracking-tight">
                  {texts.introTitle}
                </h2>
                <p className="text-[16px] md:text-[17px] text-slate-600 leading-relaxed">
                  {texts.introText}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* PROGRAMS SECTION */}
        <motion.div
          className="mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-br from-[#e8c97a]/15 to-[#e8c97a]/5 rounded-xl border border-[#e8c97a]/10">
                <BookOpen className="h-5 w-5 text-[#e8c97a]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#133059] tracking-tight">
                {texts.programsTitle}
              </h2>
            </div>
            <div className={`${isRtl ? 'mr-[52px]' : 'ml-[52px]'} h-0.5 w-12 bg-gradient-to-r from-[#e8c97a] to-transparent rounded-full`} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((program, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#133059]/[0.05] to-[#e8c97a]/[0.05] rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 h-full overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#e8c97a] via-[#133059]/30 to-transparent" />

                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#133059] to-[#1a4a7a] rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      {program.icon}
                    </div>
                    <h3 className="text-lg font-bold text-[#133059] mb-3 tracking-tight">
                      {program.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {program.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* MILESTONES TIMELINE */}
        <motion.div
          className="mb-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants} className="mb-14">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-br from-[#133059]/10 to-[#133059]/5 rounded-xl border border-[#133059]/10">
                <Clock className="h-5 w-5 text-[#133059]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#133059] tracking-tight">
                {texts.milestonesTitle}
              </h2>
            </div>
            <div className={`${isRtl ? 'mr-[52px]' : 'ml-[52px]'} h-0.5 w-12 bg-gradient-to-r from-[#133059] to-transparent rounded-full`} />
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className={`absolute ${isRtl ? 'right-8 md:right-1/2' : 'left-8 md:left-1/2'} top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#e8c97a] via-[#133059]/20 to-[#133059]/5`} />

            <motion.div
              className="space-y-10"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              {milestones.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`relative flex flex-col md:flex-row ${
                    idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } items-start gap-6`}
                >
                  {/* Card */}
                  <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-start' : 'md:text-end'} ${isRtl ? 'mr-16 md:mr-0' : 'ml-16 md:ml-0'}`}>
                    <div className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#133059]/[0.04] to-[#e8c97a]/[0.04] rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                        <div className={`absolute top-0 ${idx % 2 === 0 ? 'left-0' : 'right-0'} w-2 h-full bg-gradient-to-b ${item.color}`} />

                        <div className={`flex items-start gap-4 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                          <div className={`p-3 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-500 flex-shrink-0`}>
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <div className="inline-block px-3.5 py-1.5 bg-gradient-to-r from-[#133059] to-[#133059]/80 text-white text-xs font-bold rounded-full mb-3 shadow-sm">
                              {item.year}
                            </div>
                            <h3 className="text-xl font-bold text-[#133059] mb-3 tracking-tight">
                              {item.title}
                            </h3>
                            <p className="text-slate-500 leading-relaxed text-[15px]">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className={`absolute ${isRtl ? 'right-8 md:right-1/2' : 'left-8 md:left-1/2'} -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-br from-[#e8c97a] to-[#133059] border-4 border-white shadow-lg z-10`} />

                  {/* Spacer for opposite side */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* TODAY SECTION */}
        <motion.div
          className="mb-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e8c97a]/[0.04] to-[#133059]/[0.04] rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-gradient-to-br from-[#133059] to-[#1a4a7a] rounded-3xl p-10 md:p-14 overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#e8c97a]/[0.1] to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-[#e8c97a]/[0.05] to-transparent rounded-tr-full" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-[#e8c97a]" />
                  <span className="text-[#e8c97a] text-sm font-bold uppercase tracking-wider">
                    {texts.todayTitle}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-6 tracking-tight">
                  {texts.todayTitle}
                </h2>

                <p className="text-white/80 leading-relaxed text-[16px] md:text-[17px] max-w-2xl">
                  {texts.todayText}
                </p>

                <div className="flex flex-wrap gap-5 mt-10">
                  {[
                    {
                      label: t('مهندسون متكونون', 'Ingenieurs formes', 'Trained Engineers'),
                      value: '5000+',
                    },
                    {
                      label: t('تقنيون', 'Techniciens', 'Technicians'),
                      value: '12000+',
                    },
                    {
                      label: t('شراكات', 'Partenariats', 'Partnerships'),
                      value: '50+',
                    },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl px-7 py-5 border border-white/5"
                    >
                      <div className="text-2xl md:text-3xl font-bold text-[#e8c97a]">
                        {stat.value}
                      </div>
                      <div className="text-white/70 text-sm mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="pb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center">
            <Link
              to="/about/museum"
              className="inline-flex items-center gap-3 px-9 py-4 bg-gradient-to-r from-[#133059] to-[#1a4a7a] text-white rounded-full font-semibold shadow-lg shadow-[#133059]/20 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {texts.backToMuseum}
              <ArrowRight className={`h-5 w-5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>
    </div>
  );
};

export default MuseumTraining;
