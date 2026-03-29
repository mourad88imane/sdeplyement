import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Library, Coffee, Dumbbell, GraduationCap, Building2, Utensils, BedDouble, ArrowRight, Heart, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const Campus = () => {
    const { language } = useLanguage();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    // Content translations
    const content = {
        campusTitle: language === 'ar' ? 'حرم المدرسة الوطنية' : language === 'en' ? 'Our Campus' : 'Notre Campus',
        campusSubtitle: language === 'ar' ? 'بنية تحتية حديثة وبيئة تعليمية متقدمة' : language === 'en' ? 'Modern infrastructure and advanced educational environment' : 'Infrastructure moderne et environnement éducatif avancé',
        overviewTitle: language === 'ar' ? 'نظرة عامة' : language === 'en' ? 'Overview' : 'Aperçu',
        overviewDesc1: language === 'ar' 
          ? 'تتمتع المدرسة الوطنية للمواصلات السلكية واللاسلكية بمرافق حديثة وشاملة مصممة لتوفير أفضل بيئة تعليمية للطلاب والموظفين.' 
          : language === 'en'
          ? 'The National School of transmissionss boasts modern and comprehensive facilities designed to provide the best educational environment for students and staff.'
          : 'L\'École Nationale des Transmissions dispose de installations modernes et complètes conçues pour offrir le meilleur environnement éducatif aux étudiants et au personnel.',
        overviewDesc2: language === 'ar'
          ? 'تجمع المدرسة الوطنية بين التكنولوجيا المتقدمة والتصميم المعماري  ليخلق فضاءً محفزاً للتعلم والابتكار.'
          : language === 'en'
          ? 'The campus combines advanced technology and modern architectural design to create a stimulating space for learning and innovation.'
          : 'Le campus combine la technologie avancée et la conception architecturale moderne pour créer un espace stimulant pour l\'apprentissage et l\'innovation.',
        facilitiesTitle: language === 'ar' ? 'المرافق والخدمات' : language === 'en' ? 'Facilities & Services' : 'Installations et Services',
        facilitiesDesc: language === 'ar' 
          ? 'نقدم مجموعة شاملة من المرافق الحديثة لدعم رحلة التعلم'
          : language === 'en'
          ? 'We offer a comprehensive range of modern facilities to support the learning journey'
          : 'Nous offrons une gamme complète d\'installations modernes pour soutenir le parcours d\'apprentissage',
        smartClassrooms: language === 'ar' ? 'قاعات دراسية ذكية' : language === 'en' ? 'Smart Classrooms' : 'Salles de Classe Intelligentes',
        smartClassroomsDesc: language === 'ar' ? 'مجهزة بأحدث التقنيات التعليمية' : language === 'en' ? 'Equipped with latest educational technology' : 'Équipées de la technologie éducative la plus récente',
        laboratories: language === 'ar' ? 'مختبرات متخصصة' : language === 'en' ? 'Specialized Laboratories' : 'Laboratoires Spécialisés',
        laboratoriesDesc: language === 'ar' ? 'مزودة بمعدات احترافية للتدريب العملي' : language === 'en' ? 'Equipped with professional tools for practical training' : 'Dotés d\'équipements professionnels pour la formation pratique',
        amphitheaters: language === 'ar' ? 'قاعات محاضرات' : language === 'en' ? 'Lecture Halls' : 'salle de conférence',
        amphitheatersDesc: language === 'ar' ? 'قاعة واسعة لالقاء المحاضرات الكبيرة' : language === 'en' ? 'Large halls for major lectures' : 'Salles spacieuses pour les grands conférences',
        medicalCenter: language === 'ar' ? 'مركز طبي' : language === 'en' ? 'Medical Center' : 'Centre Médical',
        medicalCenterDesc: language === 'ar' ? 'خدمات صحية شاملة للطلاب والموظفين' : language === 'en' ? 'Comprehensive health services for students and staff' : 'Services de santé complets pour les étudiants et le personnel',
        footballStadium: language === 'ar' ? 'ملعب كرة قدم' : language === 'en' ? 'Football Stadium' : 'Stade de Football',
        footballStadiumDesc: language === 'ar' ? 'منشآت رياضية متقدمة' : language === 'en' ? 'Advanced sports facilities' : 'Installations sportives avancées',
        lifeOnCampus: language === 'ar' ? 'الحياة في الحرم' : language === 'en' ? 'Life on Campus' : 'La Vie sur le Campus',
        lifeOnCampusDesc: language === 'ar'
          ? 'توفر المدرسة بيئة شاملة تدعم التطور الأكاديمي والشخصي للطلاب'
          : language === 'en'
          ? 'The school provides a comprehensive environment that supports students\' academic and personal development'
          : 'L\'école offre un environnement complet qui soutient le développement académique et personnel des étudiants',
        exploreStudentLife: language === 'ar' ? 'استكشف حياة الطلاب' : language === 'en' ? 'Explore Student Life' : 'Explorez la Vie Étudiante',
        housing: language === 'ar' ? 'الإقامة' : language === 'en' ? 'Housing' : 'Logement',
        housingDesc: language === 'ar' ? 'سكن حديث وآمن للطلاب' : language === 'en' ? 'Modern and safe accommodation for students' : 'Logement moderne et sûr pour les étudiants',
        dining: language === 'ar' ? 'الطعام والتغذية' : language === 'en' ? 'Dining' : 'Restauration',
        diningDesc: language === 'ar' ? 'مطاعم وكافتيريات بمستويات عالية' : language === 'en' ? 'High-quality restaurants and cafeterias' : 'Restaurants et cafétérias de haute qualité',
        sportsCenter: language === 'ar' ? 'مركز رياضي' : language === 'en' ? 'Sports Center' : 'Centre Sportif',
        sportsCenterDesc: language === 'ar' ? 'منشآت رياضية متعددة الأنشطة' : language === 'en' ? 'Multi-activity sports facilities' : 'Installations sportives polyvalentes',
        cafeteria: language === 'ar' ? 'مقهى الحرم' : language === 'en' ? 'Campus Cafeteria' : 'Cafétéria du Campus',
        cafeteriaDesc: language === 'ar' ? 'أماكن استراحة مريحة وحديثة' : language === 'en' ? 'Comfortable and modern rest areas' : 'Espaces de détente confortables et modernes',
        ourLocation: language === 'ar' ? 'موقعنا' : language === 'en' ? 'Our Location' : 'Notre Localisation',
        locationAddress: language === 'ar' 
          ? 'المدرسة الوطنية للمواصلات السلكية واللاسلكية، الجزائر'
          : language === 'en'
          ? 'National School of transmissionss, Algeria'
          : 'École Nationale des Transmissions, Algérie',
        getDirections: language === 'ar' ? 'احصل على الاتجاهات' : language === 'en' ? 'Get Directions' : 'Obtenir les Directions'
    };

    return (
        <div ref={containerRef} className="relative w-full overflow-hidden bg-white">
            {/* BACKGROUND DECORATIONS */}
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

            {/* Hero Section */}
            <div className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src="/images/ent.jpg"
                        alt="Campus"
                        className="w-full h-full object-cover block"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#133059cc] via-[#133059b3] to-[#133059cc]" />
                </motion.div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-white mb-6"
                    >
                        {content.campusTitle}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-white/90"
                    >
                        {content.campusSubtitle}
                    </motion.p>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-20">

                {/* Overview Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 relative">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue mb-6">{content.overviewTitle}</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-gold to-blue rounded-full mb-8" />
                        <p className="text-lg text-slate-600 leading-relaxed mb-6">
                            {content.overviewDesc1}
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            {content.overviewDesc2}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-blue/10">
                            <img
                                src="/images/students.jpg"
                                alt="Students on campus"
                                className="w-full h-full object-cover block"
                            />
                        </div>
                        {/* Decorative element */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue/10 rounded-full blur-2xl -z-10" />
                    </motion.div>
                </div>

                {/* Facilities Grid */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue mb-4">{content.facilitiesTitle}</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-gold to-blue rounded-full mx-auto mb-8" />
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">{content.facilitiesDesc}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        <FacilityCard
                            icon={<GraduationCap className="w-10 h-10 text-blue" />}
                            title={content.smartClassrooms}
                            description={content.smartClassroomsDesc}
                            image="/images/classe.jpg"
                        />
                        <FacilityCard
                            icon={<Building2 className="w-10 h-10 text-blue" />}
                            title={content.laboratories}
                            description={content.laboratoriesDesc}
                            image="/images/installation.png"
                        />
                        <FacilityCard
                            icon={<Library className="w-10 h-10 text-blue" />}
                            title={content.amphitheaters}
                            description={content.amphitheatersDesc}
                            image="/images/conference.jpg"
                        />
                        <FacilityCard
                            icon={<Heart className="w-10 h-10 text-blue" />}
                            title={content.medicalCenter}
                            description={content.medicalCenterDesc}
                            image="https://images.pexels.com/photos/3845806/pexels-photo-3845806.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        />
                        <FacilityCard
                            icon={<Trophy className="w-10 h-10 text-blue" />}
                            title={content.footballStadium}
                            description={content.footballStadiumDesc}
                           image="/images/soprt.jpg"
                        />
                    </div>
                </div>

                {/* Life on Campus */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue mb-6">{content.lifeOnCampus}</h2>
                            <div className="h-1 w-20 bg-gradient-to-r from-gold to-blue rounded-full mb-6" />
                            <p className="text-slate-600 mb-8 leading-relaxed">
                                {content.lifeOnCampusDesc}
                            </p>
                            <Button className="w-full sm:w-auto bg-blue hover:bg-blue/90 text-white font-semibold py-3 px-6 rounded-xl">
                                {content.exploreStudentLife} <ArrowRight className={`ml-2 w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                            </Button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InfoCard
                            icon={<BedDouble className="w-6 h-6" />}
                            title={content.housing}
                            description={content.housingDesc}
                        />
                        <InfoCard
                            icon={<Utensils className="w-6 h-6" />}
                            title={content.dining}
                            description={content.diningDesc}
                        />
                        <InfoCard
                            icon={<Dumbbell className="w-6 h-6" />}
                            title={content.sportsCenter}
                            description={content.sportsCenterDesc}
                        />
                        <InfoCard
                            icon={<Coffee className="w-6 h-6" />}
                            title={content.cafeteria}
                            description={content.cafeteriaDesc}
                        />
                    </div>
                </div>

                {/* Map Section */}
               

            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none opacity-30" />
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue/20 rounded-full blur-3xl pointer-events-none opacity-20" />
        </div>
    );
};

// Sub-components
const FacilityCard = ({ icon, title, description, image }: any) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="group bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-md border border-blue/10 hover:border-gold/30 transition-all hover:shadow-lg"
    >
        <div className="h-48 overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="p-6">
            <div className="mb-4 p-3 bg-gradient-to-br from-blue/10 to-gold/10 rounded-lg w-fit text-blue">
                {icon}
            </div>
            <h3 className="text-lg font-serif font-bold text-blue mb-3">{title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
        </div>
    </motion.div>
);

const InfoCard = ({ icon, title, description }: any) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-blue/10 hover:border-gold/30 shadow-sm hover:shadow-lg transition-all"
    >
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue/10 to-gold/10 rounded-lg text-blue">
                {icon}
            </div>
            <h3 className="font-serif font-bold text-lg text-blue">{title}</h3>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
);

export default Campus;
