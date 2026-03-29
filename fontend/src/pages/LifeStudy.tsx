import { motion, Variants } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useCallback } from 'react';
import {
  BookOpen,
  Heart,
  Globe,
  Trophy,
  Users,
  Zap,
  
  LucideIcon,
 
  Sparkles,
  Camera,
  GraduationCap,
  Lightbulb,
} from 'lucide-react';

const LifeStudy = () => {
  const { language: lang } = useLanguage();
  const isRtl = lang === 'ar';

  const t = useCallback(
    (ar: string, fr: string, en: string) =>
      lang === 'ar' ? ar : lang === 'en' ? en : fr,
    [lang],
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  return (
    <div
      className="min-h-screen bg-white overflow-x-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(19,48,89,0.04)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(232,201,122,0.05)_0%,transparent_50%)]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#133059]/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10">
        {/* ═══════════════════ HEADER ═══════════════════ */}
        <motion.div
          className="pt-32 pb-20 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/80 border border-[#e8c97a]/20 shadow-lg shadow-[#e8c97a]/5 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e8c97a]" />
            <span className="text-[#133059] text-[11px] font-bold uppercase tracking-[0.2em]">
              {t('حياة الطالب في المدرسة', 'La Vie au Campus', 'Campus Life')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-7xl font-serif font-bold text-[#133059] mb-6 tracking-tight leading-tight"
            style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
          >
            {t(
              'حياة غنية بالفرص والنمو',
              "Une Vie d'Opportunites et de Croissance",
              'A Life of Opportunity & Growth',
            )}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#e8c97a]/60" />
            <div className="w-2 h-2 rounded-full bg-[#e8c97a] shadow-sm shadow-[#e8c97a]/40" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#e8c97a]/60" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            {t(
              'اكتشف حياة مليئة بالتجارب التعليمية والفرص الشخصية والنمو الشامل',
              "Decouvrez une vie remplie d'experiences educatives, d'opportunites personnelles et de croissance globale",
              'Discover a life filled with learning experiences, personal opportunities, and holistic growth',
            )}
          </motion.p>
        </motion.div>

        {/* ═══════════════════ HERO IMAGE ═══════════════════ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-32 rounded-3xl overflow-hidden shadow-2xl shadow-[#133059]/10 border border-slate-200/50 h-[500px] group"
        >
          <img
            src="/images/life-study.jpg"
            alt="Campus Life"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#133059]/60 via-[#133059]/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
            <div className="flex items-center gap-2.5 text-white/90">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <Camera className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium tracking-wide">
                {t(
                  'لحظات من الحياة في المدرسة',
                  'Moments du Campus',
                  'Moments from Campus',
                )}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════ CAMPUS HIGHLIGHTS ═══════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <SectionHeader
            badge={t('مرافقنا', 'Nos Installations', 'Our Facilities')}
            title={t(
              'معالم الحرم المدرسي',
              'Points Forts du Campus',
              'Campus Highlights',
            )}
            subtitle={t(
              'مرافق عصرية وفضاءات متنوعة مصممة لدعم رحلتك التعليمية',
              'Installations modernes et espaces diversifies concus pour soutenir votre parcours educatif',
              'Modern facilities and diverse spaces designed to support your educational journey',
            )}
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <CampusFeatureCard
              variants={itemVariants}
              icon={BookOpen}
              title={t(
                'مرافق حديثة',
                'Installations Modernes',
                'Modern Facilities',
              )}
              description={t(
                'مختبرات متقدمة وقاعات دراسة مجهزة بأحدث التقنيات',
                "Laboratoires avances et espaces d'etude equipes de technologies de pointe",
                'Advanced labs and study spaces equipped with cutting-edge technology',
              )}
              image="/images/instalation.jpg"
            />
            <CampusFeatureCard
              variants={itemVariants}
              icon={Heart}
              title={t(
                'الترفيه والصحة',
                'Loisirs & Bien-etre',
                'Recreation & Wellness',
              )}
              description={t(
                'صالة رياضة وفضاءات استرخاء لتعزيز صحتك البدنية والنفسية',
                'Salle de sport et espaces de detente pour votre bien-etre physique et mental',
                'Sport facilities and relaxation spaces for physical and mental wellbeing',
              )}
              image="/images/bien-etre.jpg"
            />
            <CampusFeatureCard
              variants={itemVariants}
              icon={Globe}
              title={t(
                'فضاءات ثقافية',
                'Espaces Culturels',
                'Cultural Spaces',
              )}
              description={t(
                'قاعة  للفعاليات الثقافية والاجتماعية',
                'Salle  pour les evenements culturels et sociaux',
                'Halls  for cultural and social events',
              )}
              image="/images/culturel.jpg"
            />
          </motion.div>
        </motion.section>

        {/* ═══════════════════ STUDENT ACTIVITIES ═══════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <SectionHeader
            badge={t('انخرط', 'Impliquez-vous', 'Get Involved')}
            title={t(
              'أنشطة الطلاب',
              'Activites Etudiantes',
              'Student Activities',
            )}
            subtitle={t(
              'انضم إلى نوادي وفرق تطور مهاراتك واهتماماتك بشكل عملي',
              'Rejoignez des clubs et equipes pour developper vos competences et explorer vos passions',
              'Join clubs and teams to develop your skills and explore your passions',
            )}
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <ActivityCategory
              variants={itemVariants}
              icon={Trophy}
              title={t('الرياضة', 'Sports', 'Sports')}
              activities={[
                t('كرة القدم', 'Football', 'Football'),
                t('اللياقة البدنية', 'Fitness', 'Fitness'),
              ]}
              accentColor="from-[#e8c97a] to-amber-400"
            />
            <ActivityCategory
              variants={itemVariants}
              icon={Lightbulb}
              title={t(
                'النوادي الأكاديمية',
                'Clubs Academiques',
                'Academic Clubs',
              )}
              activities={[
                t(
                  'العلوم والروبوتات',
                  'Science & Robotique',
                  'Science & Robotics',
                ),
                t(
                  'البرمجة والتكنولوجيا',
                  'Programmation & Tech',
                  'Coding & Tech',
                ),
              ]}
              accentColor="from-blue-400 to-indigo-400"
            />
            <ActivityCategory
              variants={itemVariants}
              icon={Users}
              title={t(
                'القيادة والخدمة',
                'Leadership & Service',
                'Leadership & Service',
              )}
              activities={[
                t('مجلس الطلاب', 'Conseil des Etudiants', 'Student Council'),
              ]}
              accentColor="from-emerald-400 to-teal-400"
            />
          </motion.div>
        </motion.section>

        {/* ═══════════════════ STUDENT SUPPORT ═══════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div className={isRtl ? 'order-2' : ''}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-gradient-to-br from-[#e8c97a]/15 to-[#e8c97a]/5 rounded-xl border border-[#e8c97a]/10">
                  <GraduationCap className="h-5 w-5 text-[#e8c97a]" />
                </div>
                <span className="text-[#e8c97a] text-[11px] font-bold uppercase tracking-[0.2em]">
                  {t('دعمنا', 'Notre Soutien', 'We Care')}
                </span>
              </div>

              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#133059] mb-6 tracking-tight leading-tight"
                style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
              >
                {t(
                  'خدمات دعم شاملة',
                  'Un Accompagnement Complet',
                  'Comprehensive Support',
                )}
              </h2>

              <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                {t(
                  'نحن ندعم نجاحك الأكاديمي والشخصي من خلال خدمات متخصصة وفريق محترف',
                  'Nous soutenons votre reussite academique et personnelle grace a des services specialises et un accompagnement expert',
                  'We support your academic and personal success through specialized services and expert guidance',
                )}
              </p>

              <div className="space-y-4">
                <SupportService
                  icon={BookOpen}
                  title={t(
                    'الإرشاد الأكاديمي',
                    'Conseil Academique',
                    'Academic Advising',
                  )}
                  description={t(
                    'تخطيط شامل لتحقيق أهدافك التعليمية',
                    'Planification strategique pour atteindre vos objectifs educatifs',
                    'Strategic planning to achieve your educational goals',
                  )}
                />
                <SupportService
                  icon={Globe}
                  title={t(
                    'دعم اللغات',
                    'Soutien Linguistique',
                    'Language Support',
                  )}
                  description={t(
                    'برامج تحسين اللغة الإنجليزية والفرنسية',
                    "Programmes d'amelioration en anglais et francais",
                    'English and French language enhancement programs',
                  )}
                />
                <SupportService
                  icon={Zap}
                  title={t(
                    'إرشادات المهنة',
                    'Orientation Professionnelle',
                    'Career Guidance',
                  )}
                  description={t(
                    'تحضير شامل لمسارك الوظيفي المستقبلي',
                    'Preparation complete pour votre parcours professionnel futur',
                    'Preparation for your future professional journey',
                  )}
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className={`relative rounded-3xl overflow-hidden shadow-2xl shadow-[#133059]/10 border border-slate-200/50 h-[500px] group ${isRtl ? 'order-1' : ''}`}
            >
              <img
                src="/images/soutien.jpg"
                alt="Student Support"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#133059]/40 via-[#133059]/10 to-transparent" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#e8c97a]/30 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#e8c97a]/30 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          </div>
        </motion.section>

        {/* ═══════════════════ CAMPUS GALLERY ═══════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="pb-28"
        >
          <SectionHeader
            badge={t('لحظاتنا', 'Nos Moments', 'Memories')}
            title={t(
              'معرض حياتنا',
              'Galerie de la Vie au Campus',
              'Campus Life Gallery',
            )}
            subtitle={t(
              'لحظات مميزة من حياتنا',
              'Des moments memorables de notre communaute',
              'Memorable moments from our campus community',
            )}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {[
              '/images/demo-ecole.jpg',
              '/images/demo-ecole1.JPG',
              '/images/demo-ecole2.png',
              '/images/demo-ecole3.jpg',
              '/images/demo-ecole4.jpg',
              '/images/demo-ecole5.jpg',
              '/images/demo-ecole6.jpg',
              '/images/sports.jpg',
            ].map((src, index) => (
              <GalleryImage key={index} src={src} index={index} />
            ))}
          </div>
        </motion.section>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>
    </div>
  );
};

// ═══════════════════ SUBCOMPONENTS ═══════════════════

const SectionHeader = ({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) => (
  <div className="mb-14 text-center">
    <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/80 border border-[#e8c97a]/15 shadow-sm backdrop-blur-sm mb-5">
      <div className="h-[2px] w-6 bg-[#e8c97a] rounded-full" />
      <span className="text-[#e8c97a] text-[10px] font-bold uppercase tracking-[0.2em]">
        {badge}
      </span>
      <div className="h-[2px] w-6 bg-[#e8c97a] rounded-full" />
    </div>
    <h2
      className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#133059] mb-5 tracking-tight"
      style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
    >
      {title}
    </h2>
    <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
      {subtitle}
    </p>
    <div className="flex items-center gap-3 mt-5 justify-center">
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#e8c97a]/60 rounded-full" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#e8c97a]" />
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#e8c97a]/60 rounded-full" />
    </div>
  </div>
);

interface CampusFeatureCardProps {
  variants: Variants;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  image: string;
}

const CampusFeatureCard = ({
  variants,
  icon: Icon,
  title,
  description,
  image,
}: CampusFeatureCardProps) => (
  <motion.div
    variants={variants}
    whileHover={{ y: -8, scale: 1.01 }}
    transition={{ type: 'spring', stiffness: 300 }}
    className="group relative"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#133059]/[0.04] to-[#e8c97a]/[0.04] rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

    <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 h-full">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#e8c97a]/60 via-[#133059]/20 to-transparent" />

      <div className="h-52 overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform ease-out" style={{ transitionDuration: '1500ms' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#133059]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="p-7 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-[#e8c97a]/12 to-[#e8c97a]/5 rounded-xl border border-[#e8c97a]/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <Icon className="w-5 h-5 text-[#133059]" />
          </div>
          <h3 className="text-lg font-bold text-[#133059] tracking-tight">
            {title}
          </h3>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
);

const ActivityCategory = ({
  variants,
  icon: Icon,
  title,
  activities,
  accentColor,
}: {
  variants: Variants;
  icon: LucideIcon;
  title: string;
  activities: string[];
  accentColor: string;
}) => (
  <motion.div
    variants={variants}
    whileHover={{ y: -8, scale: 1.01 }}
    transition={{ type: 'spring', stiffness: 300 }}
    className="group relative"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#133059]/[0.04] to-[#e8c97a]/[0.04] rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

    <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-8 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full">
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accentColor} opacity-60`}
      />

      <div className="flex items-center gap-3 mb-7">
        <div className="p-2.5 bg-gradient-to-br from-[#133059]/8 to-[#133059]/3 rounded-xl border border-[#133059]/8 group-hover:from-[#e8c97a]/12 group-hover:to-[#e8c97a]/5 group-hover:border-[#e8c97a]/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
          <Icon className="w-5 h-5 text-[#133059]" />
        </div>
        <h3 className="text-lg font-bold text-[#133059] tracking-tight">
          {title}
        </h3>
      </div>

      <ul className="space-y-4">
        {activities.map((activity, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex items-center gap-3 group/item"
          >
            <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${accentColor} group-hover/item:scale-150 transition-transform duration-300 shadow-sm`} />
            <span className="text-slate-500 font-medium text-sm group-hover/item:text-[#133059] transition-colors duration-300">
              {activity}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const SupportService = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex gap-4 p-5 rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:shadow-[#133059]/5 transition-all duration-300 group"
  >
    <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-[#133059]/8 to-[#133059]/3 rounded-xl border border-[#133059]/8 group-hover:from-[#e8c97a]/12 group-hover:to-[#e8c97a]/5 group-hover:border-[#e8c97a]/10 group-hover:scale-110 transition-all duration-300">
      <Icon className="w-5 h-5 text-[#133059]" />
    </div>
    <div>
      <h4 className="text-base font-bold text-[#133059] mb-1 tracking-tight">
        {title}
      </h4>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const GalleryImage = ({ src, index }: { src: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.92 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.06 }}
    whileHover={{ y: -6, scale: 1.02 }}
    className="relative overflow-hidden rounded-2xl h-52 shadow-sm hover:shadow-xl border border-slate-200/60 group cursor-pointer transition-shadow duration-500"
  >
    <img
      src={src}
      alt={`Campus ${index + 1}`}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform ease-out" style={{ transitionDuration: '1500ms' }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#133059]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-white/40 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-white/40 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  </motion.div>
);

export default LifeStudy;
