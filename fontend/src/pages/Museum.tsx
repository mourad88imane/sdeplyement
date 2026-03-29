import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Landmark, History, Camera, Image, BookOpen, Clock, Radio, Users, ArrowRight, Sparkles } from 'lucide-react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface Equipment {
  id: number;
  name_fr: string;
  name_ar: string;
  slug: string;
  description_fr: string;
  description_ar: string;
  image: string | null;
  period: string;
}

interface Personality {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  slug: string;
  biography_fr: string;
  biography_ar: string;
  photo: string | null;
  role: string;
}

const Museum = () => {
  const { language: lang } = useLanguage();
  const isRtl = lang === 'ar';

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [loading, setLoading] = useState(true);

  const t = useCallback(
    (ar: string, fr: string, en: string) =>
      lang === 'ar' ? ar : lang === 'en' ? en : fr,
    [lang],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const equipmentResponse = await fetch('/api/museum/equipment/');
        if (equipmentResponse.ok) {
          const equipmentData = await equipmentResponse.json();
          const equipmentList = Array.isArray(equipmentData)
            ? equipmentData
            : equipmentData.results || [];
          setEquipment(equipmentList.slice(0, 4));
        }

        const personalitiesResponse = await fetch('/api/museum/personalities/');
        if (personalitiesResponse.ok) {
          const personalitiesData = await personalitiesResponse.json();
          setPersonalities(
            Array.isArray(personalitiesData)
              ? personalitiesData
              : personalitiesData.results || [],
          );
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const texts = useMemo(
    () => ({
      pageTitle: t('المتحف', 'Le Musee', 'The Museum'),
      pageSubtitle: t(
        'اكتشف تاريخ الاتصالات والتراث التقني',
        "Decouvrez l'histoire des transmissionss et le patrimoine technique",
        'Discover the history of transmissionss and our technical heritage',
      ),
      aboutTitle: t('نبذة عن المتحف', 'A Propos du Musee', 'About the Museum'),
      exhibitionsTitle: t('المعارض', 'Expositions', 'Exhibitions'),
      equipmentTitle: t(
        'المعدات التاريخية',
        'Equipements Historiques',
        'Historical Equipment',
      ),
      figuresTitle: t(
        'شخصيات مهمة',
        'Personnages Importants',
        'Notable Figures',
      ),
      practicalInfoTitle: t(
        'معلومات عملية',
        'Informations Pratiques',
        'Practical Information',
      ),
      visitCTA: t('زيارة المتحف', 'Visitez le Musee', 'Visit the Museum'),
      bookVisit: t('حجز زيارة', 'Reserver une visite', 'Book a Visit'),
      learnMore: t('المزيد', 'En savoir plus', 'Learn More'),
    }),
    [t],
  );

  const exhibitions = [
    {
      id: 1,
      title: t(
        'تاريخ الاتصالات',
        'Histoire des transmissionss',
        'History of transmissionss',
      ),
      description: t(
        'اكتشف تطور تقنيات الاتصال من أول أجهزة التلغراف إلى الشبكات الحديثة.',
        "Decouvrez l'evolution des technologies de communication depuis les premiers telegraphes jusqu'aux reseaux modernes.",
        'Discover the evolution of communication technologies from the first telegraphs to modern networks.',
      ),
      link: '/about/museum/history',
    },
    {
      id: 2,
      title: t(
        'المعدات التاريخية',
        'Equipements Historiques',
        'Historical Equipment',
      ),
      description: t(
        'مجموعة فريدة من أجهزة ومعدات الاتصالات المستخدمة عبر العصور المختلفة.',
        "Une collection unique d'appareils et d'equipements de transmissions utilises a travers les differentes epoques.",
        'A unique collection of transmissions devices and equipment used through different eras.',
      ),
      link: '/about/museum/equipment',
    },
    {
      id: 3,
      title: t(
        'تطور التكوين',
        'Evolution de la Formation',
        'Evolution of Training',
      ),
      description: t(
        'تتبع تاريخ تكوين المهندسين والتقنيين في مجال الاتصالات في الجزائر.',
        "Retracez l'histoire de la formation des ingenieurs et techniciens en transmissionss en Algerie.",
        'Trace the history of engineer and technician training in transmissionss in Algeria.',
      ),
      link: '/about/museum/training',
    },
  ];

  const historicalEquipment = loading
    ? Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        title: t('جاري التحميل...', 'Chargement...', 'Loading...'),
        description: '',
        image: null as string | null,
      }))
    : equipment.length > 0
      ? equipment.map((eq: Equipment) => ({
          id: eq.id,
          title: t(eq.name_ar, eq.name_fr, eq.name_fr),
          description: t(eq.description_ar, eq.description_fr, eq.description_fr),
          image: eq.image,
        }))
      : [
          {
            id: 1,
            title: t('لا توجد معدات', 'Aucun equipement', 'No equipment'),
            description: t(
              'لا توجد معدات متاحة',
              'Aucun equipement disponible',
              'No equipment available',
            ),
            image: null as string | null,
          },
        ];

  const importantFigures = loading
    ? Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        name: t('جاري التحميل...', 'Chargement...', 'Loading...'),
        contribution: '',
        photo: null as string | null,
      }))
    : personalities.length > 0
      ? personalities.map((p: Personality) => ({
          id: p.id,
          name: p.full_name || `${p.first_name} ${p.last_name}`,
          contribution: t(p.biography_ar, p.biography_fr, p.biography_fr),
          photo: p.photo,
        }))
      : [
          {
            id: 1,
            name: t('لا توجد شخصية', 'Aucune personnalite', 'No figures'),
            contribution: t(
              'لا توجد شخصية متاحة',
              'Aucune personnalite disponible',
              'No figures available',
            ),
            photo: null as string | null,
          },
        ];

  const practicalInfo = [
    {
      id: 1,
      icon: <Clock className="h-5 w-5 text-[#e8c97a]" />,
      title: t('ساعات العمل', "Horaires d'ouverture", 'Opening Hours'),
      details: t(
        'من الأحد إلى الخميس: 9:00 - 16:00',
        'Du dimanche au jeudi: 9h00 - 16h00',
        'Sunday to Thursday: 9:00 AM - 4:00 PM',
      ),
    },
    {
      id: 2,
      icon: <BookOpen className="h-5 w-5 text-[#e8c97a]" />,
      title: t('جولات مصحوبة بمرشدين', 'Visites guidees', 'Guided Tours'),
      details: t(
        'متاحة بالحجز للمجموعات',
        'Disponibles sur reservation pour les groupes',
        'Available upon reservation for groups',
      ),
    },
    {
      id: 3,
      icon: <Camera className="h-5 w-5 text-[#e8c97a]" />,
      title: t('التصوير الفوتوغرافي', 'Photographie', 'Photography'),
      details: t(
        'مسموح بدون فلاش',
        'Autorisee sans flash',
        'Allowed without flash',
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
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
        {/* HERO HEADER */}
        <motion.div
          className="pt-32 pb-28 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/80 border border-[#e8c97a]/20 shadow-lg shadow-[#e8c97a]/5 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e8c97a]" />
            <span className="text-[#133059] text-[11px] font-bold uppercase tracking-[0.2em]">
              {t('تراثنا', 'Notre Patrimoine', 'Our Heritage')}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-serif font-bold text-[#133059] mb-6 tracking-tight leading-tight"
            style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
          >
            {texts.pageTitle}
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#e8c97a]/60" />
            <div className="w-2 h-2 rounded-full bg-[#e8c97a] shadow-sm shadow-[#e8c97a]/40" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#e8c97a]/60" />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            {texts.pageSubtitle}
          </motion.p>
        </motion.div>

        {/* ABOUT SECTION */}
        <motion.div
          className="mb-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-br from-[#e8c97a]/15 to-[#e8c97a]/5 rounded-xl border border-[#e8c97a]/10">
                <Landmark className="h-5 w-5 text-[#e8c97a]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#133059] tracking-tight">
                {texts.aboutTitle}
              </h2>
            </div>
            <div className={`${isRtl ? 'mr-[52px]' : 'ml-[52px]'} h-0.5 w-12 bg-gradient-to-r from-[#e8c97a] to-transparent rounded-full`} />
          </motion.div>

          <motion.div variants={itemVariants} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#133059]/[0.03] to-[#e8c97a]/[0.03] rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-10 md:p-14 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#133059] via-[#e8c97a]/60 to-transparent" />
              <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-[#e8c97a]/[0.04] to-transparent rounded-bl-full" />

              <div className="relative space-y-6 text-slate-600 leading-relaxed">
                <p className="text-[16px] md:text-[17px]">
                  {t(
                    'يعد متحف المدرسة الوطنية للمواصلات السلكية واللاسلكية مساحة ثقافية وتعليمية تحتفي بتاريخ الاتصالات في الجزائر والعالم. يضم المتحف مجموعة متنوعة من المعدات التاريخية والوثائق والصور التي تعكس تطور تكنولوجيا الاتصالات عبر العصور.',
                    "Le musee de l'Ecole Nationale des Transmissions est un espace culturel et educatif qui celebre l'histoire des transmissionss en Algerie et dans le monde. Il abrite une collection variee d'equipements historiques, de documents et de photographies qui refletent l'evolution des technologies de communication a travers les ages.",
                    'The museum of the National School of Transmissions is a cultural and educational space celebrating the history of transmissionss in Algeria and worldwide. It houses a diverse collection of historical equipment, documents, and photographs reflecting the evolution of communication technologies through the ages.',
                  )}
                </p>
                <p className="text-[16px] md:text-[17px]">
                  {t(
                    'تم تأسيس المتحف بهدف الحفاظ على التراث التقني للمدرسة وتوثيق مساهمة الجزائر في مجال الاتصالات. يوفر المتحف للزوار فرصة فريدة للتعرف على التطور التكنولوجي في هذا المجال والاطلاع على الأجهزة والمعدات التي كانت تستخدم في الماضي.',
                    "Le musee a ete cree dans le but de preserver le patrimoine technique de l'ecole et de documenter la contribution de l'Algerie dans le domaine des transmissionss. Il offre aux visiteurs une occasion unique de decouvrir l'evolution technologique dans ce domaine et d'explorer les appareils et equipements utilises dans le passe.",
                    "The museum was established to preserve the school's technical heritage and document Algeria's contribution to transmissionss. It offers visitors a unique opportunity to discover technological progress in this field and explore the devices and equipment used in the past.",
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* EXHIBITIONS */}
        <motion.div
          className="mb-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-br from-[#133059]/10 to-[#133059]/5 rounded-xl border border-[#133059]/10">
                <Image className="h-5 w-5 text-[#133059]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#133059] tracking-tight">
                {texts.exhibitionsTitle}
              </h2>
            </div>
            <div className={`${isRtl ? 'mr-[52px]' : 'ml-[52px]'} h-0.5 w-12 bg-gradient-to-r from-[#133059] to-transparent rounded-full`} />
          </motion.div>

          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {exhibitions.map((exhibition, idx) => (
              <Link to={exhibition.link} key={exhibition.id} className="block group">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.003 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#133059]/[0.03] to-[#e8c97a]/[0.03] rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#e8c97a] via-[#133059]/30 to-transparent" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                      {/* Image placeholder */}
                      <div className="md:col-span-1">
                        <div className="h-full min-h-[200px] bg-gradient-to-br from-[#133059]/[0.06] to-[#e8c97a]/[0.06] flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#133059]/5 to-transparent" />
                          <Camera className="h-10 w-10 text-[#e8c97a]/25 group-hover:text-[#e8c97a]/45 group-hover:scale-110 transition-all duration-500" />
                          <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[#133059] text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-200/60 shadow-sm">
                            {t(`معرض ${idx + 1}`, `Expo ${idx + 1}`, `Expo ${idx + 1}`)}
                          </div>
                        </div>
                      </div>
                      {/* Content */}
                      <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
                        <h3 className="text-xl md:text-2xl font-bold text-[#133059] mb-3 tracking-tight flex items-center gap-2">
                          {exhibition.title}
                          <ArrowRight className={`h-5 w-5 text-[#e8c97a] opacity-0 group-hover:opacity-100 transition-all duration-300 ${isRtl ? 'translate-x-2 group-hover:translate-x-0 rotate-180' : '-translate-x-2 group-hover:translate-x-0'}`} />
                        </h3>
                        <p className="text-slate-500 leading-relaxed text-[15px] md:text-base">
                          {exhibition.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </motion.div>

        {/* HISTORICAL EQUIPMENT */}
        <motion.div
          className="mb-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-br from-[#e8c97a]/15 to-[#e8c97a]/5 rounded-xl border border-[#e8c97a]/10">
                <Radio className="h-5 w-5 text-[#e8c97a]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#133059] tracking-tight">
                {texts.equipmentTitle}
              </h2>
            </div>
            <div className={`${isRtl ? 'mr-[52px]' : 'ml-[52px]'} h-0.5 w-12 bg-gradient-to-r from-[#e8c97a] to-transparent rounded-full`} />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {historicalEquipment.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#e8c97a]/[0.04] to-[#133059]/[0.04] rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#e8c97a]/80 to-transparent" />
                  <div className="relative h-56 bg-gradient-to-br from-[#133059]/[0.05] to-[#e8c97a]/[0.05] flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <Radio className="h-12 w-12 text-[#e8c97a]/20 group-hover:text-[#e8c97a]/35 group-hover:scale-110 transition-all duration-500" />
                    )}
                  </div>
                  <div className="relative p-7">
                    <h3 className="text-lg font-bold text-[#133059] mb-2 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* IMPORTANT FIGURES */}
        <motion.div
          className="mb-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-br from-[#133059]/10 to-[#133059]/5 rounded-xl border border-[#133059]/10">
                <Users className="h-5 w-5 text-[#133059]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#133059] tracking-tight">
                {texts.figuresTitle}
              </h2>
            </div>
            <div className={`${isRtl ? 'mr-[52px]' : 'ml-[52px]'} h-0.5 w-12 bg-gradient-to-r from-[#133059] to-transparent rounded-full`} />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {importantFigures.map((figure) => (
              <motion.div
                key={figure.id}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#133059]/[0.03] to-[#e8c97a]/[0.03] rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#133059]/60 to-transparent" />
                  <div className="grid grid-cols-3 gap-0">
                    <div className="col-span-1">
                      <div className="h-full min-h-[160px] bg-gradient-to-br from-[#133059]/[0.06] to-[#e8c97a]/[0.06] flex items-center justify-center overflow-hidden">
                        {figure.photo ? (
                          <img
                            src={figure.photo}
                            alt={figure.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <Users className="h-10 w-10 text-[#e8c97a]/20 group-hover:text-[#e8c97a]/35 group-hover:scale-110 transition-all duration-500" />
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 p-6 md:p-7 flex flex-col justify-center">
                      <h3 className="text-lg font-bold text-[#133059] mb-2 tracking-tight">
                        {figure.name}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                        {figure.contribution}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* PRACTICAL INFO */}
        <motion.div
          className="mb-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-br from-[#e8c97a]/15 to-[#e8c97a]/5 rounded-xl border border-[#e8c97a]/10">
                <History className="h-5 w-5 text-[#e8c97a]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#133059] tracking-tight">
                {texts.practicalInfoTitle}
              </h2>
            </div>
            <div className={`${isRtl ? 'mr-[52px]' : 'ml-[52px]'} h-0.5 w-12 bg-gradient-to-r from-[#e8c97a] to-transparent rounded-full`} />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {practicalInfo.map((info) => (
              <motion.div
                key={info.id}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#e8c97a]/[0.04] to-[#133059]/[0.04] rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 h-full overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#e8c97a]/70 to-transparent" />
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-[#e8c97a]/[0.04] to-transparent rounded-bl-full" />
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#e8c97a]/12 to-[#e8c97a]/5 rounded-xl border border-[#e8c97a]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                      {info.icon}
                    </div>
                    <h3 className="text-base font-bold text-[#133059] mb-2 tracking-tight">
                      {info.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {info.details}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="pb-28"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="/images/ent.jpg"
              alt="Campus"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#133059]/95 via-[#133059]/90 to-[#0a2342]/95" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8c97a]/30 to-transparent" />
            <div className="absolute top-16 right-16 w-72 h-72 bg-[#e8c97a]/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-16 left-16 w-80 h-80 bg-[#e8c97a]/5 rounded-full blur-[100px]" />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative z-10 text-center py-24 md:py-28 px-8 max-w-3xl mx-auto"
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#e8c97a]/25 bg-white/5 backdrop-blur-sm mb-8"
              >
                <Landmark className="w-3.5 h-3.5 text-[#e8c97a]" />
                <span className="text-[#e8c97a] text-[11px] font-bold uppercase tracking-[0.2em]">
                  {t('زيارة', 'Visite', 'Visit')}
                </span>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 tracking-tight"
              >
                {texts.visitCTA}
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-white/70 mb-14 leading-relaxed"
              >
                {t(
                  'اكتشف تاريخ الاتصالات وتطورها عبر الزمن من خلال زيارة متحفنا',
                  "Decouvrez l'histoire des transmissionss et leur evolution a travers le temps en visitant notre musee",
                  'Discover the history and evolution of transmissionss through the ages by visiting our museum',
                )}
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-[#e8c97a] text-[#133059] font-bold rounded-2xl hover:shadow-lg hover:shadow-[#e8c97a]/25 transition-all duration-300 text-sm"
                >
                  {texts.bookVisit}
                  <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 px-9 py-4 border border-[#e8c97a]/30 text-[#e8c97a] font-bold rounded-2xl hover:bg-[#e8c97a]/5 transition-all duration-300 text-sm"
                >
                  {texts.learnMore}
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>
    </div>
  );
};

export default Museum;
