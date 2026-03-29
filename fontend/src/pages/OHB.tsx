import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { Search, Filter, Loader2, AlertCircle, BookOpen, Eye, FileText, Download, Users, Clock, Sparkles, Star, ArrowRight, ChevronDown } from 'lucide-react';
import { Formation, FormationAPI, getImageUrl } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

import { Link } from 'react-router-dom';
const OHB = () => {
  const { language } = useLanguage();
  const { toast } = useToast();

  const [formations, setFormations] = useState<Formation[]>([]);
  const [filteredFormations, setFilteredFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setLoading(true);
        const formationsData = await FormationAPI.getFormations();
        setFormations(formationsData);
        setFilteredFormations(formationsData);
      } catch (err) {
        setError(language === 'ar'
          ? 'فشل في تحميل التكوينات'
          : 'Échec du chargement des formations'
        );
        toast({
          title: language === 'ar' ? 'خطأ' : 'Erreur',
          description: language === 'ar'
            ? 'فشل في تحميل التكوينات من الخادم'
            : 'Échec du chargement des formations depuis le serveur',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, [language, toast]);

  useEffect(() => {
    let filtered = formations;

    if (searchQuery) {
      filtered = filtered.filter(formation => {
        const title = language === 'ar' ? formation.title_ar : formation.title_fr;
        const description = language === 'ar' ? formation.description_ar : formation.description_fr;
        const category = language === 'ar' ? formation.category?.name_ar : formation.category?.name_fr;

        return title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(formation => formation.level === selectedLevel);
    }

    setFilteredFormations(filtered);
  }, [formations, searchQuery, selectedLevel, language]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleLevelFilter = (value: string) => {
    setSelectedLevel(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gradient-to-br from-white via-[#133059]/2 to-[#e8c97a]/5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-4 inline-block"
          >
            <Loader2 className="w-8 h-8 text-[#133059]" />
          </motion.div>
          <p className="text-[#133059]/70 font-medium">
            {language === 'ar' ? 'جاري تحميل الدورات...' : 'Chargement des formations...'}
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gradient-to-br from-white via-[#133059]/2 to-[#e8c97a]/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-[#133059] mb-2">
            {language === 'ar' ? 'خطأ في التحميل' : 'Erreur de chargement'}
          </h2>
          <p className="text-[#133059]/60 mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-[#133059] hover:bg-[#0a2342] text-white"
          >
            {language === 'ar' ? 'إعادة المحاولة' : 'Réessayer'}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-white via-[#133059]/2 to-[#e8c97a]/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 bg-[#e8c97a]/20 rounded-full blur-3xl pointer-events-none"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#133059]/15 rounded-full blur-3xl pointer-events-none"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#133059]/30 to-transparent" />

      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`mb-16 ${language === 'ar' ? 'text-right' : 'text-center'}`}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#133059]/20 bg-[#133059]/5 backdrop-blur-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#e8c97a] animate-pulse" />
              <span className="text-[#133059] text-xs font-bold uppercase tracking-widest">
                {language === 'ar' ? '🎓 الدورات المتخصصة' : '🎓 Formations OHB'}
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl font-bold text-[#133059] leading-tight mb-6">
              {language === 'ar' ? 'دورات تخصصية خارج الميزانية' : 'Formations Spécialisées OHB'}
            </h1>

            <div className={`h-1 w-20 bg-gradient-to-r from-[#e8c97a] to-[#133059] rounded-full mb-6 ${language === 'ar' ? 'ml-auto mr-0' : 'mx-auto'}`} />

            <p className="text-[#133059]/70 text-lg max-w-2xl mx-auto leading-relaxed">
              {language === 'ar'
                ? 'دورات متخصصة في المواصلات السلكية و اللاسلكية وتقنيات حديثة مع مواد تعليمية شاملة'
                : 'Formations spécialisées en transmission et technologies modernes avec supports complets'
              }
            </p>
          </motion.div>

          {/* Search & Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative group">
                    <Search className={`absolute top-1/2 transform -translate-y-1/2 text-[#133059]/50 h-5 w-5 ${language === 'ar' ? 'right-4' : 'left-4'} transition-colors group-focus-within:text-[#e8c97a]`} />
                    <Input
                      placeholder={language === 'ar'
                        ? 'ابحث في الدورات...'
                        : 'Rechercher des formations...'
                      }
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className={`${language === 'ar' ? 'pr-12 text-right' : 'pl-12'} h-12 border-[#133059]/20 focus:border-[#e8c97a] focus:ring-[#e8c97a]/30 bg-white text-[#133059] placeholder:text-[#133059]/40`}
                    />
                  </div>
                </div>
                <div className="lg:max-w-xs">
                  <Select value={selectedLevel} onValueChange={handleLevelFilter}>
                    <SelectTrigger className="h-12 border-[#133059]/20 text-[#133059] focus:border-[#e8c97a] focus:ring-[#e8c97a]/30">
                      <Filter className="w-4 h-4 mr-2 text-[#e8c97a]" />
                      <SelectValue placeholder={language === 'ar' ? 'المستوى' : 'Niveau'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {language === 'ar' ? 'جميع المستويات' : 'Tous les niveaux'}
                      </SelectItem>
                      <SelectItem value="beginner">
                        {language === 'ar' ? 'مبتدئ' : 'Débutant'}
                      </SelectItem>
                      <SelectItem value="intermediate">
                        {language === 'ar' ? 'متوسط' : 'Intermédiaire'}
                      </SelectItem>
                      <SelectItem value="advanced">
                        {language === 'ar' ? 'متقدم' : 'Avancé'}
                      </SelectItem>
                      <SelectItem value="expert">
                        {language === 'ar' ? 'خبير' : 'Expert'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-[#133059]/70 font-medium"
                >
                  {language === 'ar'
                    ? `تم العثور على ${filteredFormations.length} تكوين`
                    : `${filteredFormations.length} formation${filteredFormations.length > 1 ? 's' : ''} trouvée${filteredFormations.length > 1 ? 's' : ''}`
                  }
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Formations Grid */}
          {filteredFormations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#133059]/10 mb-6">
                <BookOpen className="h-8 w-8 text-[#133059]/40" />
              </div>
              <h3 className="text-2xl font-bold text-[#133059] mb-2">
                {language === 'ar' ? 'لا توجد دورات' : 'Aucune formation trouvée'}
              </h3>
              <p className="text-[#133059]/60">
                {language === 'ar'
                  ? 'لا توجد دورات تطابق معايير البحث الخاصة بك'
                  : 'Aucune formation ne correspond à vos critères de recherche'
                }
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredFormations.map((formation) => (
                <FormationCard 
                  key={formation.id}
                  formation={formation}
                  language={language}
                  variants={itemVariants}
                />
              ))}
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-20 bg-gradient-to-br from-[#133059] to-[#0a2342] rounded-2xl p-8 sm:p-12 text-center text-white border border-[#e8c97a]/20"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {language === 'ar' ? '🎯 تحتاج مساعدة؟' : '🎯 Besoin d\'aide ?'}
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              {language === 'ar'
                ? 'فريقنا المتخصص جاهز لمساعدتك في اختيار الدورة المناسبة'
                : 'Notre équipe d\'experts est disponible pour vous aider à choisir la formation idéale'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/contact" className="w-full">
                  <Button size="lg" className="bg-[#e8c97a] hover:bg-[#e8c97a]/90 text-[#133059] font-bold">
                    {language === 'ar' ? '📞 اتصل بنا' : '📞 Contactez-nous'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
              
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <FAQSection language={language} />
      </div>
    </div>
  );
};

// Formation Card Component
const FormationCard = ({ 
  formation, 
  language,
  variants 
}: { 
  formation: Formation;
  language: string;
  variants: any;
}) => {
  const title = language === 'ar' ? formation.title_ar : formation.title_fr;
  const description = language === 'ar' ? formation.description_ar : formation.description_fr;
  const levelDisplay = language === 'ar' ? formation.level_display_ar : formation.level_display_fr;

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'beginner': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'intermediate': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'advanced': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'expert': return 'bg-purple-50 border-purple-200 text-purple-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  return (
    <motion.div
      variants={variants}
      className="h-full"
    >
      <div className="h-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-slate-100">
          {formation.image ? (
            <motion.img
              src={getImageUrl(formation.image)}
              alt={title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#133059] to-[#0a2342] flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-[#e8c97a]/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#133059]/40 via-transparent to-transparent" />

          {/* Featured Badge */}
          {formation.featured && (
            <div className="absolute top-3 left-3">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-[#e8c97a] text-[#133059] text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1"
              >
                <Star className="h-3 w-3 fill-current" />
                {language === 'ar' ? 'مميز' : 'Featured'}
              </motion.div>
            </div>
          )}

          {/* Level Badge */}
          <div className="absolute top-3 right-3">
            <div className={`${getLevelColor(formation.level)} border px-3 py-1.5 rounded-full text-xs font-bold shadow-md`}>
              {levelDisplay}
            </div>
          </div>

          {/* Duration */}
          <div className="absolute bottom-3 right-3 bg-[#133059]/90 backdrop-blur-sm text-white text-xs font-semibold py-1.5 px-3 rounded-full flex items-center gap-1.5 shadow-lg">
            <Clock className="h-3.5 w-3.5 text-[#e8c97a]" />
            {formation.duration_weeks} {language === 'ar' ? 'أسابيع' : 'sem'}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Category */}
          {formation.category && (
            <div className="mb-3">
              <span className="bg-[#e8c97a]/15 text-[#133059] text-xs font-bold px-3 py-1 rounded-full">
                {language === 'ar' ? formation.category.name_ar : formation.category.name_fr}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-base font-bold text-[#133059] line-clamp-2 mb-2 leading-snug">
            {title}
          </h3>

          {/* Description */}
          <p className="text-xs text-[#133059]/70 line-clamp-2 mb-4 flex-grow">
            {description}
          </p>

          {/* Enrollment */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-t border-slate-100">
            <Users className="h-4 w-4 text-[#e8c97a]" />
            <span className="text-xs font-semibold text-[#133059]">
              {formation.enrollment_count}/{formation.max_students} {language === 'ar' ? 'مسجل' : 'inscrits'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="sm"
                className="w-full bg-[#133059] hover:bg-[#0a2342] text-white font-bold"
                onClick={() => window.location.href = `/ohb/formation/${formation.slug}`}
              >
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                {language === 'ar' ? 'التفاصيل' : 'Détails'}
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="sm"
                variant="outline"
                className="w-full border-[#e8c97a] text-[#e8c97a] hover:bg-[#e8c97a]/10 font-bold"
                onClick={() => window.location.href = `/ohb/formation/${formation.slug}?action=register`}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                {language === 'ar' ? 'تسجيل' : "S'inscrire"}
              </Button>
            </motion.div>

            {/* Download Buttons */}
            <div className="flex gap-2 pt-2">
              {formation.brochure_pdf && (
                <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full text-xs text-[#133059] hover:bg-slate-100"
                    onClick={() => window.open(getImageUrl(formation.brochure_pdf), '_blank')}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    {language === 'ar' ? 'كراسة' : 'Brochure'}
                  </Button>
                </motion.div>
              )}
              {formation.pdf_file && (
                <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full text-xs text-[#133059] hover:bg-slate-100"
                    onClick={() => window.open(getImageUrl(formation.pdf_file), '_blank')}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// FAQ Section Component
const FAQSection = ({ language }: { language: string }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  type FAQItem = {
    question_fr: string;
    question_ar: string;
    question_en: string;
    answer_fr: string;
    answer_ar: string;
    answer_en: string;
  };

  const faqs: FAQItem[] = [
    {
      question_fr: 'Comment s\'inscrire à une formation OHB?',
      question_ar: 'كيف التسجيل في تدريب OHB؟',
      question_en: 'How to register for OHB training?',
      answer_fr: 'Vous pouvez vous inscrire directement en ligne en cliquant sur le bouton "S\'inscrire" sur la page de la formation de votre choix.',
      answer_ar: 'يمكنك التسجيل مباشرة عبر الإنترنت بالنقر على زر "التسجيل" في صفحة التدريب المطلوبة.',
      answer_en: 'You can register directly online by clicking the "Register" button on the training page of your choice.',
    },
    {
      question_fr: 'Quelles sont les conditions d\'admission?',
      question_ar: 'ما هي شروط القبول؟',
      question_en: 'What are the admission requirements?',
      answer_fr: 'Les conditions d\'admission varient selon la formation. Consultez la page de chaque formation pour plus de détails.',
      answer_ar: 'تختلف شروط القبول حسب التدريب. راجع صفحة كل تدريب لمزيد من التفاصيل.',
      answer_en: 'Admission requirements vary depending on the training. See each training page for more details.',
    },
   
    {
      question_fr: 'Quelle est la durée des formations?',
      question_ar: 'ما هي مدة التدريب؟',
      question_en: 'How long do the trainings last?',
      answer_fr: 'La durée varie entre quelques semaines et plusieurs mois selon le programme choisi.',
      answer_ar: 'تختلف المدة بين عدة أسابيع وعدة أشهر حسب البرنامج المختار.',
      answer_en: 'Duration varies from a few weeks to several months depending on the program chosen.',
    },
   
  ];

  const getLocalizedContent = (item: FAQItem, field: 'question' | 'answer'): string => {
    const langKey = language === 'ar' ? 'ar' : language === 'en' ? 'en' : 'fr';
    const key = `${field}_${langKey}` as keyof FAQItem;
    const fallbackKey = `${field}_fr` as keyof FAQItem;
    return item[key] || item[fallbackKey] || '';
  };

  return (
    <div className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#133059] mb-4">
            {language === 'ar' ? 'الأسئلة الشائعة' : language === 'en' ? 'Frequently Asked Questions' : 'Questions Fréquemment Posées'}
          </h2>
          <p className="text-slate-600">
            {language === 'ar' 
              ? 'إجابات على الأسئلة الأكثر شيوعاً حول تدريبات OHB' 
              : language === 'en' 
              ? 'Answers to the most common questions about OHB training'
              : 'Réponses aux questions les plus fréquentes sur les formations OHB'}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-right"
              >
                <span className="font-semibold text-[#133059]">
                  {getLocalizedContent(faq, 'question')}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#133059] transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 text-slate-600">
                  {getLocalizedContent(faq, 'answer')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OHB;
