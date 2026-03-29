import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useState } from 'react';


const LegalTexts = () => {
  const { language } = useLanguage();
  // Helper for trilingual text
  const tr = (fr: string, ar: string, en?: string) => {
    if (language === 'ar') return ar;
    if (language === 'en') return en || fr;
    return fr;
  };
  const [searchTerm] = useState('');
  const [categoryFilter] = useState('all');
  const [yearFilter] = useState('all');

  // Données des textes juridiques et réglementaires
  const legalTexts = [
    {
      id: 1,
      titleFr: "Décret n° 73-160 du 1er octobre 1973",
      titleAr: "المرسوم رقم 73-160 المؤرخ في 1 أكتوبر 1973",
      titleEn: "Decree No. 73-160 of October 1, 1973",
      descriptionFr: "Portant création et organisation de l'École Nationale des Transmissions.",
      descriptionAr: "المتضمن إنشاء وتنظيم المدرسة الوطنية للمواصلات السلكية واللاسلكية.",
      descriptionEn: "Establishing and organizing the National School of transmissionss.",
      categoryFr: "Décret de création",
      categoryAr: "مرسوم الإنشاء",
      categoryEn: "Founding Decree",
      year: "1973",
      filePath: "/documents/decret-73-160.pdf"
    },
    {
      id: 2,
      titleFr: "Décret n° 82-186 du 22 mai 1982",
      titleAr: "المرسوم رقم 82-186 المؤرخ في 22 ماي 1982",
      titleEn: "Decree No. 82-186 of May 22, 1982",
      descriptionFr: "Modifiant l'organisation de l'École Nationale des Transmissions selon les nouvelles dispositions définies dans la loi générale des travailleurs.",
      descriptionAr: "المعدل لتنظيم المدرسة الوطنية للمواصلات السلكية واللاسلكية وفقًا للترتيبات الجديدة المحددة في القانون العام للعمال.",
      descriptionEn: "Amending the organization of the National School of transmissionss according to new provisions defined in the general labor law.",
      categoryFr: "Décret modificatif",
      categoryAr: "مرسوم تعديلي",
      categoryEn: "Amending Decree",
      year: "1982",
      filePath: "/documents/decret-82-186.pdf"
    },
    {
      id: 3,
      titleFr: "Arrêté ministériel du 15 mars 1990",
      titleAr: "القرار الوزاري المؤرخ في 15 مارس 1990",
      titleEn: "Ministerial Order of March 15, 1990",
      descriptionFr: "Fixant les modalités d'organisation des études et des examens au sein de l'École Nationale des Transmissions.",
      descriptionAr: "المحدد لكيفيات تنظيم الدراسات والامتحانات في المدرسة الوطنية للمواصلات السلكية واللاسلكية.",
      descriptionEn: "Setting the modalities for organizing studies and exams at the National School of transmissionss.",
      categoryFr: "Arrêté ministériel",
      categoryAr: "قرار وزاري",
      categoryEn: "Ministerial Order",
      year: "1990",
      filePath: "/documents/arrete-15-03-1990.pdf"
    },
    {
      id: 4,
      titleFr: "Règlement intérieur de l'École (2005)",
      titleAr: "النظام الداخلي للمدرسة (2005)",
      titleEn: "School Internal Regulations (2005)",
      descriptionFr: "Définissant les règles de fonctionnement interne, les droits et obligations des étudiants et du personnel de l'École.",
      descriptionAr: "المحدد لقواعد التشغيل الداخلية وحقوق وواجبات الطلاب والموظفين في المدرسة.",
      descriptionEn: "Defining internal operating rules, rights and obligations of students and staff at the School.",
      categoryFr: "Règlement intérieur",
      categoryAr: "النظام الداخلي",
      categoryEn: "Internal Regulations",
      year: "2005",
      filePath: "/documents/reglement-interieur-2005.pdf"
    },
    {
      id: 5,
      titleFr: "Décision n° 42 du 10 septembre 2010",
      titleAr: "القرار رقم 42 المؤرخ في 10 سبتمبر 2010",
      titleEn: "Decision No. 42 of September 10, 2010",
      descriptionFr: "Relative à l'organisation des stages pratiques pour les étudiants de l'École Nationale des Transmissions.",
      descriptionAr: "المتعلق بتنظيم التدريبات العملية لطلاب المدرسة الوطنية للمواصلات السلكية واللاسلكية.",
      descriptionEn: "Regarding the organization of practical internships for students at the National School of transmissionss.",
      categoryFr: "Décision administrative",
      categoryAr: "قرار إداري",
      categoryEn: "Administrative Decision",
      year: "2010",
      filePath: "/documents/decision-42-2010.pdf"
    },
    {
      id: 6,
      titleFr: "Circulaire n° 18 du 5 février 2015",
      titleAr: "المنشور رقم 18 المؤرخ في 5 فبراير 2015",
      titleEn: "Circular No. 18 of February 5, 2015",
      descriptionFr: "Portant sur les modalités d'admission et d'inscription à l'École Nationale des Transmissions.",
      descriptionAr: "المتعلق بإجراءات القبول والتسجيل في المدرسة الوطنية للمواصلات السلكية واللاسلكية.",
      descriptionEn: "Regarding admission and registration procedures at the National School of transmissionss.",
      categoryFr: "Circulaire",
      categoryAr: "منشور",
      categoryEn: "Circular",
      year: "2015",
      filePath: "/documents/circulaire-18-2015.pdf"
    },
    {
      id: 7,
      titleFr: "Arrêté interministériel du 20 juillet 2018",
      titleAr: "القرار الوزاري المشترك المؤرخ في 20 جويلية 2018",
      titleEn: "Joint Ministerial Order of July 20, 2018",
      descriptionFr: "Fixant les programmes de formation spécialisée dispensée par l'École Nationale des Transmissions.",
      descriptionAr: "المحدد لبرامج التكوين المتخصص التي تقدمها المدرسة الوطنية للمواصلات السلكية واللاسلكية.",
      descriptionEn: "Setting the specialized training programs provided by the National School of transmissionss.",
      categoryFr: "Arrêté interministériel",
      categoryAr: "قرار وزاري مشترك",
      categoryEn: "Joint Ministerial Order",
      year: "2018",
      filePath: "/documents/arrete-20-07-2018.pdf"
    },
    {
      id: 8,
      titleFr: "Décision n° 76 du 12 décembre 2020",
      titleAr: "القرار رقم 76 المؤرخ في 12 ديسمبر 2020",
      titleEn: "Decision No. 76 of December 12, 2020",
      descriptionFr: "Relative à la mise en place d'un système d'assurance qualité au sein de l'École Nationale des Transmissions.",
      descriptionAr: "المتعلق بإنشاء نظام ضمان الجودة في المدرسة الوطنية للمواصلات السلكية واللاسلكية.",
      descriptionEn: "Regarding the implementation of a quality assurance system at the National School of transmissionss.",
      categoryFr: "Décision administrative",
      categoryAr: "قرار إداري",
      categoryEn: "Administrative Decision",
      year: "2020",
      filePath: "/documents/decision-76-2020.pdf"
    }
  ];

  // Obtenir les catégories uniques
  
  // Obtenir les années uniques

  // Filtrer les textes en fonction des critères de recherche et de filtrage
  const filteredTexts = legalTexts.filter(text => {
    const matchesSearch = (
      tr(text.titleFr, text.titleAr, text.titleEn).toLowerCase().includes(searchTerm.toLowerCase()) ||
      tr(text.descriptionFr, text.descriptionAr, text.descriptionEn).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesCategory = categoryFilter === 'all' || 
      tr(text.categoryFr, text.categoryAr, text.categoryEn) === categoryFilter;
    
    const matchesYear = yearFilter === 'all' || text.year === yearFilter;
    
    return matchesSearch && matchesCategory && matchesYear;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Bannière */}
      <div className="bg-blue text-white py-16 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`max-w-3xl mx-auto ${language === 'ar' ? 'text-right' : 'text-center'}`}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {tr('Textes Juridiques et Réglementaires', 'نصوص قانونية وتنظيمية', 'Legal and Regulatory Texts')}
            </h1>
            <p className="text-lg text-white/80">
              {tr(
                "Décrets, arrêtés et textes réglementaires relatifs à l'École Nationale des Transmissions",
                'المراسيم والقرارات والنصوص التنظيمية المتعلقة بالمدرسة الوطنية للمواصلات السلكية واللاسلكية',
                'Decrees, orders, and regulatory texts related to the National School of transmissionss'
              )}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filtres et recherche 
      <section className="py-8 px-6 bg-blue/5">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className={`flex flex-col md:flex-row gap-4 ${language === 'ar' ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className="relative">
                  <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-blue h-4 w-4`} />
                  <Input
                    type="text"
                    placeholder={language === 'ar' ? 'البحث عن نص...' : 'Rechercher un texte...'}
                    className={`pl-10 ${language === 'ar' ? 'text-right pr-10 pl-3' : ''}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-40">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder={tr('Catégorie', 'الفئة', 'Category')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{tr('Toutes les catégories', 'جميع الفئات', 'All categories')}</SelectItem>
                      {categories.map((category, index) => (
                        <SelectItem key={index} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-32">
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder={tr('Année', 'السنة', 'Year')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{tr('Toutes les années', 'جميع السنوات', 'All years')}</SelectItem>
                      {years.map((year, index) => (
                        <SelectItem key={index} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>*/}

      {/* Liste des textes */}
      <section className="py-12 px-6 bg-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <FileText className="h-8 w-8 text-gold" />
              <h2 className="text-2xl font-bold text-blue">
                  {tr('Liste des Textes', 'قائمة النصوص', 'List of Texts')}
              </h2>
            </div>

            {filteredTexts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  {tr('Aucun résultat ne correspond à vos critères de recherche', 'لا توجد نتائج مطابقة لمعايير البحث', 'No results match your search criteria')}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredTexts.map((text) => (
                  <motion.div
                    key={text.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gold/10"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className={language === 'ar' ? 'text-right' : ''}>
                          <h3 className="font-semibold text-lg text-blue mb-2 group-hover:text-gold transition-colors">
                            {tr(text.titleFr, text.titleAr, text.titleEn)}
                          </h3>
                          <p className="text-blue-dark/80 mb-3">
                            {tr(text.descriptionFr, text.descriptionAr, text.descriptionEn)}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="inline-flex items-center text-xs bg-gold/10 text-gold px-2 py-1 rounded font-bold">
                              <Filter className="h-3 w-3 mr-1 text-gold" />
                              {tr(text.categoryFr, text.categoryAr, text.categoryEn)}
                            </span>
                            <span className="inline-flex items-center text-xs bg-blue/10 text-blue px-2 py-1 rounded font-bold">
                              <Calendar className="h-3 w-3 mr-1 text-blue" />
                              {text.year}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Button
                            asChild
                            variant="outline"
                            className="flex items-center gap-3 px-6 py-3 rounded-full bg-blue text-white border-2 border-gold font-bold shadow-lg hover:bg-gold hover:text-blue hover:border-gold transition-all text-base"
                          >
                            <a href={text.filePath} target="_blank" rel="noopener noreferrer">
                              <Download className="h-5 w-5 text-gold" />
                              {tr('Télécharger', 'تحميل', 'Download')}
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalTexts;
