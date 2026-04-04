import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Award, Users, Star, Shield, Briefcase, Landmark, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Types pour les membres du conseil
interface BoardMember {
  id: number;
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  image: string;
  bio: string;
  bioAr: string;
}

const BoardOfDirectors = () => {
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

  // Données des membres du conseil d'administration
  const boardMembers: BoardMember[] = [
    {
      id: 1,
      name: "Directeur Général des Transmissions",
      nameAr: "المدير العام للمواصلات السلكية واللاسلكية",
      title: "Président du Conseil d'Administration",
      titleAr: "رئيسا",
      image: "/images/algerie.webp",
      bio: "En tant que Directeur Général des Transmissions, il préside le conseil d'administration et supervise les orientations stratégiques de l'école.",
      bioAr: "بصفته المدير العام للمواصلات السلكية واللاسلكية، يرأس مجلس الإدارة ويشرف على التوجهات الاستراتيجية للمدرسة."
    },
    {
      id: 2,
      name: "Représentant du Ministre de la Défense Nationale",
      nameAr: "ممثل وزير الدفاع الوطني",
      title: "Membre du Conseil",
      titleAr: "عضو مجلس الإدارة",
      image: "/images/defence.webp",
      bio: "Représente le Ministère de la Défense Nationale au sein du conseil et assure la liaison entre l'école et les besoins stratégiques du secteur de la défense.",
      bioAr: "يمثل وزارة الدفاع الوطني في المجلس ويضمن الربط بين المدرسة والاحتياجات الاستراتيجية لقطاع الدفاع."
    },
    {
      id: 3,
      name: "Représentant du Ministre des Affaires Étrangères",
      nameAr: "ممثل وزير الشؤون الخارجية",
      title: "Membre du Conseil",
      titleAr: "عضو مجلس الإدارة",
      image: "/images/etrangere.webp",
      bio: "Apporte la perspective internationale et diplomatique aux décisions du conseil, facilitant les collaborations internationales de l'école.",
      bioAr: "يقدم المنظور الدولي والدبلوماسي لقرارات المجلس، مما يسهل التعاون الدولي للمدرسة."
    },
    {
      id: 4,
      name: "Représentant du Ministère de l'Intérieur",
      nameAr: "ممثل وزارة الداخلية والجماعات المحلية والنقل",
      title: "Membre du Conseil",
      titleAr: "عضو مجلس الإدارة",
      image: "/images/micl.webp",
      bio: "Représente le Ministère de l'Intérieur, des Collectivités Locales et de l'Aménagement du Territoire, assurant l'alignement des programmes avec les besoins nationaux.",
      bioAr: "يمثل وزارة الداخلية والجماعات المحلية والتهيئة العمرانية، ويضمن مواءمة البرامج مع الاحتياجات الوطنية."
    },
    {
      id: 5,
      name: "Représentant du Ministère des Finances",
      nameAr: "ممثل وزارة المالية",
      title: "Membre du Conseil",
      titleAr: "عضو مجلس الإدارة",
      image: "https://images.pexels.com/photos/5793953/pexels-photo-5793953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      bio: "Supervise les aspects financiers et budgétaires de l'école, assurant une gestion financière saine et conforme aux réglementations.",
      bioAr: "يشرف على الجوانب المالية والميزانية للمدرسة، مما يضمن إدارة مالية سليمة ومتوافقة مع اللوائح."
    },
    {
      id: 6,
      name: "Représentant de la Direction Générale de la Fonction Publique",
      nameAr: "ممثل المديرية العامة للوظيفة العمومية والإصلاح الإداري",
      title: "Membre du Conseil",
      titleAr: "عضو مجلس الإدارة",
      image: "https://images.pexels.com/photos/5989925/pexels-photo-5989925.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      bio: "Représente la Direction Générale de la Fonction Publique et de la Réforme Administrative, veillant à l'alignement des formations avec les besoins du secteur public.",
      bioAr: "يمثل المديرية العامة للوظيفة العمومية والإصلاح الإداري، ويضمن مواءمة التكوين مع احتياجات القطاع العام."
    },
    {
      id: 7,
      name: "Représentant du Ministère des Postes et Télécommunications",
      nameAr: "ممثل وزارة البريد والمواصلات السلكية واللاسلكية",
      title: "Membre du Conseil",
      titleAr: "عضو مجلس الإدارة",
      image: "https://images.pexels.com/photos/5989933/pexels-photo-5989933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      bio: "Assure la liaison entre l'école et le Ministère des Postes et Télécommunications, facilitant l'adaptation des programmes aux évolutions du secteur.",
      bioAr: "يضمن الربط بين المدرسة ووزارة البريد والمواصلات السلكية واللاسلكية، مما يسهل تكييف البرامج مع تطورات القطاع."
    },
    {
      id: 8,
      name: "Directeur de l'École Nationale des Transmissions",
      nameAr: "مدير المدرسة الوطنية للمواصلات السلكية واللاسلكية",
      title: "Membre du Conseil",
      titleAr: "عضو مجلس الإدارة",
      image: "/images/logo.jpg",
      bio: "Responsable de la gestion quotidienne de l'école, il présente au conseil les rapports sur lesquels sont basées les délibérations concernant le budget et l'organisation des études.",
      bioAr: "مسؤول عن الإدارة اليومية للمدرسة، يقدم للمجلس التقارير التي تستند إليها المداولات بشأن الميزانية وتنظيم الدراسة."
    },
    {
      id: 9,
      name: "Secrétaire Général de l'École",
      nameAr: "الأمين العام للمدرسة الوطنية للمواصلات السلكية واللاسلكية",
      title: "Membre du Conseil",
      titleAr: "عضو مجلس الإدارة",
      image: "/images/logo.jpg",
      bio: "Supervise les aspects administratifs de l'école et assure le suivi des décisions du conseil d'administration.",
      bioAr: "يشرف على الجوانب الإدارية للمدرسة ويضمن متابعة قرارات مجلس الإدارة."
    },
    {
      id: 10,
      name: "Directeur des Études et des Stages",
      nameAr: "مدير الدراسات والتربصات",
      title: "Membre du Conseil",
      titleAr: "عضو مجلس الإدارة",
      image: "/images/logo.jpg",
      bio: "Responsable de l'organisation pédagogique et des programmes de stages, il veille à la qualité de la formation dispensée aux étudiants.",
      bioAr: "مسؤول عن التنظيم التربوي وبرامج التدريب، يضمن جودة التكوين المقدم للطلاب."
    },
    {
      id: 11,
      name: "Représentants du Corps Enseignant",
      nameAr: "ممثلين عن المدرسين",
      title: "Membres du Conseil",
      titleAr: "أعضاء مجلس الإدارة",
      image: "/images/logo.jpg",
      bio: "Représentent le corps professoral au sein du conseil, apportant leur expertise pédagogique et leur connaissance des réalités du terrain.",
      bioAr: "يمثلون هيئة التدريس في المجلس، ويقدمون خبرتهم التربوية ومعرفتهم بواقع الميدان."
    },
    {
      id: 12,
      name: "Représentants des Étudiants",
      nameAr: "ممثلين عن الطلبة",
      title: "Membres du Conseil",
      titleAr: "أعضاء مجلس الإدارة",
      image: "/images/logo.jpg",
      bio: "Portent la voix des étudiants au sein du conseil, assurant que leurs préoccupations et suggestions sont prises en compte dans les décisions.",
      bioAr: "يحملون صوت الطلاب في المجلس، ويضمنون أخذ اهتماماتهم واقتراحاتهم في الاعتبار عند اتخاذ القرارات."
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
            <Award className="w-4 h-4 text-gold animate-pulse" />
            <span className="text-blue text-xs font-bold uppercase tracking-widest">
              {language === 'ar' ? '👥 قيادة مميزة' : '👥 Distinguished Leadership'}
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-blue leading-[1.15] mb-6">
            {language === 'ar' ? 'مجلس الإدارة' : 'Conseil d\'Administration'}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-gold to-blue rounded-full mx-auto mb-6" />
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
            {language === 'ar'
              ? 'فريق من الخبراء المكرسين لتوجيه مؤسستنا نحو التميز والابتكار'
              : 'Une équipe d\'experts dédiés à guider notre institution vers l\'excellence'}
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
                  <Landmark className="h-8 w-8 text-gold flex-shrink-0" />
                  <h2 className="text-2xl font-serif font-bold text-blue">
                    نبذة عن مجلس الإدارة
                  </h2>
                </>
              ) : (
                <>
                  <Landmark className="h-8 w-8 text-gold flex-shrink-0" />
                  <h2 className="text-2xl font-serif font-bold text-blue">
                    À Propos du Conseil
                  </h2>
                </>
              )}
            </div>
            <p className={`text-slate-600 mb-6 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {language === 'ar'
                ? 'يتكون مجلس إدارة المدرسة الوطنية للمواصلات السلكية واللاسلكية من مجموعة من الخبراء المتميزين في مجالات الاتصالات والتعليم والإدارة. يعمل المجلس على وضع الرؤية الاستراتيجية للمدرسة وضمان تحقيق أهدافها في تقديم تعليم عالي الجودة.'
                : 'Le Conseil d\'Administration de l\'École Nationale des Transmissions est composé d\'experts distingués dans les domaines des télécommunications, de l\'éducation et de la gestion. Le conseil établit la vision stratégique de l\'école et veille à la réalisation de ses objectifs en matière d\'éducation de qualité.'}
            </p>

            {/* Mission Card with Glass Morphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-blue/10 shadow-lg hover:shadow-[0_20px_50px_rgba(19,48,89,0.12)] transition-shadow"
            >
              <h3 className={`font-serif font-bold text-lg mb-3 text-blue ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {language === 'ar' ? 'مهام مجلس الإدارة' : 'Missions du Conseil d\'Administration'}
              </h3>
              <p className={`text-slate-600 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {language === 'ar'
                  ? 'يتــداول في ميزانيــة المدرســة وتسييــرها وتنظيــم الدراســـة فيهـا بنــاء علـى تقريــر مديــر المدرســة وينعقــد مــرة إلى مرتيــن في السنــة.'
                  : 'Le conseil délibère sur le budget de l\'école, sa gestion et l\'organisation des études sur la base du rapport du directeur de l\'école. Il se réunit une à deux fois par an.'}
              </p>
            </motion.div>

            {/* Missions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {[
                {
                  icon: Shield,
                  titleEn: 'Gouvernance',
                  titleAr: 'الحوكمة',
                  descEn: 'Assurer la transparence et la responsabilité dans tous les aspects de la gestion de l\'institution',
                  descAr: 'ضمان الشفافية والمساءلة في جميع جوانب إدارة المؤسسة'
                },
                {
                  icon: Star,
                  titleEn: 'Budget et Organisation',
                  titleAr: 'الميزانية والتنظيم',
                  descEn: 'Délibérer sur le budget de l\'école, sa gestion et l\'organisation des études',
                  descAr: 'يتــداول في ميزانيــة المدرســة وتسييــرها وتنظيــم الدراســـة'
                },
                {
                  icon: Briefcase,
                  titleEn: 'Partenariats',
                  titleAr: 'الشراكات',
                  descEn: 'Établir des relations stratégiques avec les institutions académiques',
                  descAr: 'بناء علاقات استراتيجية مع المؤسسات الأكاديمية والصناعية'
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-blue/10 hover:border-gold/30 transition-all shadow-sm hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gradient-to-br from-blue/10 to-gold/10 rounded-lg">
                        <Icon className="h-5 w-5 text-blue" />
                      </div>
                      <h3 className="font-semibold text-blue">
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600">
                      {language === 'ar' ? item.descAr : item.descEn}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* BOARD MEMBERS */}
      <section className="relative z-10 py-16 px-6 md:px-10 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="h-7 w-7 text-gold" />
              <h2 className="text-2xl font-serif font-bold text-blue">
                {language === 'ar' ? 'أعضاء مجلس الإدارة' : 'Membres du Conseil'}
              </h2>
            </div>
            <p className="text-slate-600 max-w-2xl mx-auto mb-3">
              {language === 'ar'
                ? 'تعرف على الخبراء الذين يقودون مؤسستنا نحو مستقبل أفضل'
                : 'Découvrez les experts qui guident notre institution vers un avenir meilleur'}
            </p>
            <div className="inline-block bg-gold/10 border border-gold/30 text-blue text-sm px-4 py-2 rounded-full mb-8 font-semibold">
              {language === 'ar'
                ? 'ينعقــد مجلس الإدارة مــرة إلى مرتيــن في السنــة'
                : 'Le conseil se réunit une à deux fois par an'}
            </div>

            {/* Members List Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto mb-12 bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue/10"
            >
              <h3 className={`font-serif font-bold text-lg mb-6 text-blue ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {language === 'ar' ? 'أعضــاء مجلس الإدارة' : 'Composition du Conseil'}
              </h3>
              <ul className={`space-y-3 text-slate-600 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {language === 'ar' ? (
                  <>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> المدير العام للمواصلات السلكية واللاسلكية رئيسا.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> ممثل وزير الدفاع الوطني.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> ممثل وزير الشؤون الخارجية.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> ممثل وزارة الداخلية والجماعات المحلية والتهيئة العمرانية.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> ممثل وزارة المالية.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> ممثل المديرية العامة للوظيفة العمومية والإصلاح الإداري.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> ممثل وزارة البريد والمواصلات السلكية واللاسلكية.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> مدير المدرسة الوطنية للمواصلات السلكية واللاسلكية.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> الأمين العام للمدرسة الوطنية للمواصلات السلكية واللاسلكية.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> مدير الدراسات والتداريب.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> ممثلين عن المدرسين.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> ممثلين عن الطلبة.</li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> Le Directeur Général des Télécommunications, Président.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> Un représentant du Ministre de la Défense Nationale.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> Un représentant du Ministre des Affaires Étrangères.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> Un représentant du Ministère de l'Intérieur, des Collectivités Locales et de l'Aménagement du Territoire.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> Un représentant du Ministère des Finances.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> Un représentant de la Direction Générale de la Fonction Publique et de la Réforme Administrative.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> Un représentant du Ministère des Postes et Télécommunications.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> Le Directeur de l'École Nationale des Télécommunications.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> Le Secrétaire Général de l'École Nationale des Télécommunications.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> Le Directeur des Études et des Stages.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> Des représentants du corps enseignant.</li>
                    <li className="flex items-start gap-2"><span className="text-gold mt-1">•</span> Des représentants des étudiants.</li>
                  </>
                )}
              </ul>
            </motion.div>
          </motion.div>

          {/* Members Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {boardMembers.map((member) => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-md hover:shadow-[0_20px_50px_rgba(19,48,89,0.12)] transition-all border border-blue/10 hover:border-gold/30 group"
              >
                {/* Image */}
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-200">
                  <img
                    src={member.image}
                    alt={language === 'ar' ? member.nameAr : member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-2000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue/40 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-serif font-bold mb-1 text-blue">
                    {language === 'ar' ? member.nameAr : member.name}
                  </h3>
                  <p className="text-gold font-semibold text-sm mb-4">
                    {language === 'ar' ? member.titleAr : member.title}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {language === 'ar' ? member.bioAr : member.bio}
                  </p>
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
              {language === 'ar' ? 'تواصل مع مجلس الإدارة' : 'Contactez le Conseil d\'Administration'}
            </h2>
            <p className="text-slate-600 mb-8">
              {language === 'ar'
                ? 'لديك أسئلة أو استفسارات؟ يمكنك التواصل مع مجلس الإدارة من خلال مكتب الاتصال الخاص بنا'
                : 'Vous avez des questions ou des préoccupations ? Vous pouvez contacter le Conseil d\'Administration via notre bureau de liaison'}
            </p>
            <Button asChild size="lg" className="bg-blue hover:bg-blue-dark text-white font-bold group">
              <Link to="/contact" className="inline-flex items-center gap-2">
                {language === 'ar' ? 'تواصل معنا' : 'Contactez-nous'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none opacity-30" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue/20 rounded-full blur-3xl pointer-events-none opacity-20" />
    </div>
  );
};

export default BoardOfDirectors;
