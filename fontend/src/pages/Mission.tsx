import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Target, Eye, Shield, Users, Lightbulb, TrendingUp, CheckCircle2 } from 'lucide-react';

const Mission = () => {
    const { language } = useLanguage();

    const values = [
        {
            icon: <Shield className="h-6 w-6 text-green-600" />,
            titleFr: "Intégrité",
            titleAr: "النزاهة",
            descFr: "Nous adhérons aux normes éthiques les plus élevées dans toutes nos actions.",
            descAr: "نلتزم بأعلى المعايير الأخلاقية في جميع أعمالنا."
        },
        {
            icon: <Lightbulb className="h-6 w-6 text-green-600" />,
            titleFr: "Innovation",
            titleAr: "الابتكار",
            descFr: "Nous encourageons la créativité et l'adoption de nouvelles technologies.",
            descAr: "نشجع الإبداع وتبني التقنيات الجديدة."
        },
        {
            icon: <Users className="h-6 w-6 text-green-600" />,
            titleFr: "Collaboration",
            titleAr: "التعاون",
            descFr: "Nous croyons en la force du travail d'équipe et du partage des connaissances.",
            descAr: "نؤمن بقوة العمل الجماعي وتبادل المعرفة."
        },
        {
            icon: <TrendingUp className="h-6 w-6 text-green-600" />,
            titleFr: "Excellence",
            titleAr: "التميز",
            descFr: "Nous visons l'excellence académique et professionnelle.",
            descAr: "نسعى للتميز الأكاديمي والمهني."
        }
    ];

    const objectives = [
        {
            fr: "Assurer une formation de qualité conforme aux standards internationaux.",
            ar: "ضمان تكوين ذو جودة مطابق للمعايير الدولية."
        },
        {
            fr: "Développer des partenariats avec le secteur industriel et technologique.",
            ar: "تطوير شراكات مع القطاع الصناعي والتكنولوجي."
        },
        {
            fr: "Promouvoir la recherche scientifique appliquée.",
            ar: "تعزيز البحث العلمي التطبيقي."
        },
        {
            fr: "Contribuer à la souveraineté numérique nationale.",
            ar: "المساهمة في السيادة الرقمية الوطنية."
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-16">
            {/* Bannière */}
            <div className="bg-green-900 text-white py-16 px-6">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`max-w-3xl mx-auto ${language === 'ar' ? 'text-right' : 'text-center'}`}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'ar' ? 'المهام والرؤية' : 'Missions et Vision'}
                        </h1>
                        <p className="text-lg text-white/80">
                            {language === 'ar'
                                ? 'تعرف على رسالتنا ورؤيتنا الاستراتيجية للمستقبل'
                                : 'Découvrez notre mission et notre vision stratégique pour l\'avenir'}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">

                {/* Mission Section */}
                <section className="mb-16">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <Target className="h-8 w-8 text-green-600" />
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        {language === 'ar' ? 'رسالتنا' : 'Notre Mission'}
                                    </h2>
                                </div>
                                <div className={`prose prose-lg text-gray-600 ${language === 'ar' ? 'text-right' : ''}`}>
                                    <p>
                                        {language === 'ar'
                                            ? 'تتمثل رسالة المدرسة الوطنية للمواصلات في إعداد وتكوين كوادر مؤهلة في ميادين المواصلات السلكية واللاسلكية وتكنولوجيا المعلومات، قادرة على مواكبة التطورات التقنية المتسارعة وتلبية احتياجات الدفاع الوطني والقطاعات الاستراتيجية الأخرى.'
                                            : 'La mission de l\'École Nationale des Transmissions est de préparer et de former des cadres qualifiés dans les domaines des télécommunications et des technologies de l\'information, capables de suivre les développements techniques rapides et de répondre aux besoins de la défense nationale et d\'autres secteurs stratégiques.'}
                                    </p>
                                    <p className="mt-4">
                                        {language === 'ar'
                                            ? 'نحن نلتزم بتقديم برامج تكوينية شاملة تجمع بين الجانب النظري والتطبيقي، مع التركيز على تنمية المهارات القيادية والأخلاق المهنية.'
                                            : 'Nous nous engageons à fournir des programmes de formation complets alliant théorie et pratique, en mettant l\'accent sur le développement des compétences en leadership et de l\'éthique professionnelle.'}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                        <div className="md:w-1/2 bg-green-50 p-8 rounded-2xl border border-green-100 shadow-sm">
                            {/* Illustration placeholder or simplified visual */}
                            <div className="grid grid-cols-1 gap-4">
                                {objectives.slice(0, 2).map((obj, i) => (
                                    <div key={i} className="flex gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                                        <p className="text-gray-700 font-medium">
                                            {language === 'ar' ? obj.ar : obj.fr}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vision Section */}
                <section className="mb-16 bg-gray-50 -mx-6 px-6 py-12">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                            <div className="md:w-1/2">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <Eye className="h-8 w-8 text-green-600" />
                                        <h2 className="text-3xl font-bold text-gray-900">
                                            {language === 'ar' ? 'رؤيتنا' : 'Notre Vision'}
                                        </h2>
                                    </div>
                                    <div className={`prose prose-lg text-gray-600 ${language === 'ar' ? 'text-right' : ''}`}>
                                        <p>
                                            {language === 'ar'
                                                ? 'نطمح أن نكون القطب المرجعي بامتياز في التكوين والبحث والتطوير في مجال الاتصالات وتكنولوجيات الإعلام، على المستوى الوطني والإقليمي.'
                                                : 'Nous aspirons à être le pôle de référence par excellence en matière de formation, de recherche et de développement dans le domaine des télécommunications et des technologies de l\'information, aux niveaux national et régional.'}
                                        </p>
                                        <p className="mt-4">
                                            {language === 'ar'
                                                ? 'نسعى لبناء مجتمع معرفي متطور يساهم بفعالية في التنمية المستدامة والأمن السيبراني، من خلال خريجين متميزين وبحوث مبتكرة.'
                                                : 'Nous cherchون à bâtir une société du savoir avancée qui contribue efficacement au développement durable et à la cybersécurité, grâce à des diplômés distingués et des recherches innovantes.'}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                            <div className="md:w-1/2">
                                {/* Visual content for vision */}
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="space-y-4">
                                        {objectives.slice(2, 4).map((obj, i) => (
                                            <div key={i} className="flex gap-3">
                                                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                                                <p className="text-gray-700 font-medium">
                                                    {language === 'ar' ? obj.ar : obj.fr}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            {language === 'ar' ? 'قيمنا' : 'Nos Valeurs'}
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            {language === 'ar'
                                ? 'نستند في عملنا إلى مجموعة من القيم الراسخة التي توجه سلوكنا وتفاعلاتنا.'
                                : 'Nous nous appuyons dans notre travail sur un ensemble de valeurs fondamentales qui guident notre comportement et nos interactions.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {language === 'ar' ? value.titleAr : value.titleFr}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {language === 'ar' ? value.descAr : value.descFr}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Mission;
