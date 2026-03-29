import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  Download,
  ShoppingCart,
  Printer,
  Users,
  Award,
  FileText,
  Star,
  Loader2
} from 'lucide-react';
import { Course, CoursesAPI, FormationAPI, Formation, FormationEnrollment } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { RegistrationModal } from './RegistrationModal';

// Shared button class for consistency
const ACTION_BUTTON_CLASS = "bg-white border border-[#e8c97a] text-[#133059] font-semibold hover:bg-[#133059] hover:border-[#133059] hover:text-[#e8c97a] transition-all duration-300 shadow-sm hover:shadow-lg";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 }
};

// Level translations
const LEVEL_TRANSLATIONS: Record<string, { fr: string; ar: string }> = {
  beginner: { fr: 'Débutant', ar: 'مبتدئ' },
  intermediate: { fr: 'Intermédiaire', ar: 'متوسط' },
  advanced: { fr: 'Avancé', ar: 'متقدم' },
  expert: { fr: 'Expert', ar: 'خبير' }
};

// Typed course accessor helper
type CourseData = Course | Formation;

const getLocalizedField = (course: CourseData, field: string, language: string): string => {
  const suffix = language === 'ar' ? '_ar' : '_fr';
  return ((course as unknown as Record<string, unknown>)[`${field}${suffix}`] || '') as string;
};

const getCourseField = <T,>(course: CourseData, field: string): T => {
  return (course as unknown as Record<string, unknown>)[field] as T;
};

// Memoized sub-components
const InfoCard = memo(({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <motion.div {...scaleIn} className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
    <div className="flex justify-center mb-2 text-[#e8c97a]">{icon}</div>
    <p className="text-xs text-[#133059]/70 font-medium mb-1">{label}</p>
    <p className="text-sm font-bold text-[#133059]">{value}</p>
  </motion.div>
));
InfoCard.displayName = 'InfoCard';

const DetailCard = memo(({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) => (
  <motion.div {...fadeInUp}>
    <Card className="border-slate-200 shadow-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#e8c97a]">
          <span className="text-[#e8c97a]">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[#e8c97a]/70 font-bold text-sm whitespace-pre-line leading-relaxed">
          {content}
        </p>
      </CardContent>
    </Card>
  </motion.div>
));
DetailCard.displayName = 'DetailCard';

const ActionButton = memo(({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) => (
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Button onClick={onClick} variant="outline" className={ACTION_BUTTON_CLASS}>
      {icon}
      {label}
    </Button>
  </motion.div>
));
ActionButton.displayName = 'ActionButton';

const LoadingState = memo(({ language }: { language: string }) => (
  <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gradient-to-br from-white via-[#133059]/2 to-[#e8c97a]/5">
    <motion.div {...fadeIn} className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-4 inline-block"
      >
        <Loader2 className="h-8 w-8 text-[#133059]" />
      </motion.div>
      <p className="text-[#133059]/70 font-medium">
        {language === 'ar' ? 'جاري تحميل تفاصيل الدورة...' : 'Chargement des détails de la formation...'}
      </p>
    </motion.div>
  </div>
));
LoadingState.displayName = 'LoadingState';

const ErrorState = memo(({ language, error, onBack, onRetry }: { 
  language: string; 
  error: string | null; 
  onBack: () => void; 
  onRetry: () => void;
}) => (
  <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gradient-to-br from-white via-[#133059]/2 to-[#e8c97a]/5">
    <motion.div {...fadeInUp} className="text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">❌</span>
      </div>
      <h2 className="text-xl font-bold text-[#133059] mb-2">
        {language === 'ar' ? 'خطأ في التحميل' : 'Erreur de chargement'}
      </h2>
      <p className="text-[#133059]/60 mb-6">{error}</p>
      <div className="flex gap-4 justify-center">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'ar' ? 'العودة' : 'Retour'}
        </Button>
        <Button onClick={onRetry} className="bg-[#133059] hover:bg-[#0a2342] text-white">
          {language === 'ar' ? 'إعادة المحاولة' : 'Réessayer'}
        </Button>
      </div>
    </motion.div>
  </div>
));
ErrorState.displayName = 'ErrorState';

// Custom hook for course data fetching
const useCourseData = (courseId?: string, slug?: string, language?: string) => {
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!courseId && !slug) return;

    const fetchFormation = async () => {
      try {
        setLoading(true);
        const formationData = slug
          ? await FormationAPI.getFormationBySlug(slug)
          : await CoursesAPI.getCourseById(parseInt(courseId!));

        if (formationData) {
          setCourse(formationData);
          setEnrollmentCount(getCourseField<number>(formationData, 'enrollment_count') || 0);
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la formation:', err);
        const errorMsg = language === 'ar'
          ? 'فشل في تحميل تفاصيل الدورة'
          : 'Échec du chargement des détails de la formation';
        setError(errorMsg);
        toast({
          title: language === 'ar' ? 'خطأ' : 'Erreur',
          description: language === 'ar'
            ? 'فشل في تحميل تفاصيل الدورة من الخادم'
            : 'Échec du chargement des détails de la formation depuis le serveur',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFormation();
  }, [courseId, slug, language, toast]);

  return { course, loading, error, enrollmentCount, setEnrollmentCount };
};

const OHBCourseDetail = () => {
  const { courseId, slug } = useParams<{ courseId?: string; slug?: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();

  const { course, loading, error, enrollmentCount, setEnrollmentCount } = useCourseData(courseId, slug, language);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    student_name: '',
    student_email: '',
    student_phone: '',
    notes: ''
  });

  // Memoized values
  const isArabic = language === 'ar';
  const textAlign = isArabic ? 'text-right' : '';
  const flexDir = isArabic ? 'justify-end' : '';

  const localizedContent = useMemo(() => {
    if (!course) return null;
    return {
      title: getLocalizedField(course, 'title', language),
      description: getLocalizedField(course, 'description', language),
      objectives: getLocalizedField(course, 'objectives', language),
      prerequisites: getLocalizedField(course, 'prerequisites', language),
      targetAudience: getLocalizedField(course, 'target_audience', language),
    };
  }, [course, language]);

  const formatDuration = useCallback((weeks: number, hours: number) => {
    return isArabic ? `${weeks} أسابيع، ${hours} ساعات` : `${weeks} semaines, ${hours} heures`;
  }, [isArabic]);

  const formatLevel = useCallback((level: string) => {
    const lang = isArabic ? 'ar' : 'fr';
    return LEVEL_TRANSLATIONS[level]?.[lang] || level;
  }, [isArabic]);

  // Event handlers
  const handleBack = useCallback(() => navigate('/ohb'), [navigate]);
  const handlePrint = useCallback(() => window.print(), []);
  const handleRetry = useCallback(() => window.location.reload(), []);
  const handleOrder = useCallback(() => setIsModalOpen(true), []);

  const handleDownloadPDF = useCallback(() => {
    if (course?.pdf_file) {
      window.open(course.pdf_file, '_blank');
    } else {
      toast({
        title: isArabic ? 'غير متوفر' : 'Non disponible',
        description: isArabic
          ? 'ملف PDF غير متوفر لهذه الدورة'
          : 'Fichier PDF non disponible pour ce cours',
        variant: 'destructive',
      });
    }
  }, [course?.pdf_file, isArabic, toast]);

  const handleDownloadBrochure = useCallback(() => {
    const brochurePdf = getCourseField<string>(course!, 'brochure_pdf');
    if (!brochurePdf) return;

    const brochureUrl = brochurePdf.startsWith('http') 
      ? brochurePdf 
      : `http://localhost:8000${brochurePdf}`;

    const link = document.createElement('a');
    link.href = brochureUrl;
    link.download = '';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: isArabic ? 'تحميل الكتيب' : 'Téléchargement de la brochure',
      description: isArabic ? 'جاري تحميل الكتيب...' : 'Téléchargement de la brochure...',
    });
  }, [course, isArabic, toast]);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmitEnrollment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !course) return;

    setIsSubmitting(true);
    try {
      const enrollmentData: FormationEnrollment = {
        formation: getCourseField<number>(course, 'id'),
        ...formData
      };

      const result = await FormationAPI.enrollInFormation(slug, enrollmentData);
      
      setEnrollmentCount(result.enrollment_count || enrollmentCount + 1);
      setIsModalOpen(false);
      setFormData({ student_name: '', student_email: '', student_phone: '', notes: '' });
      
      toast({
        title: isArabic ? 'تم التسجيل بنجاح' : 'Inscription réussie',
        description: isArabic 
          ? `تم إرسال طلبك بنجاح. رقم التسجيل: ${result.id}`
          : `Votre demande a été envoyée avec succès. Numéro d'inscription: ${result.id}`,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : (isArabic ? 'فشل في إرسال الطلب' : 'Échec de l\'envoi de la demande');
      toast({
        title: isArabic ? 'خطأ في التسجيل' : 'Erreur d\'inscription',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [slug, course, formData, enrollmentCount, setEnrollmentCount, isArabic, toast]);

  // Render states
  if (loading) return <LoadingState language={language} />;
  if (error || !course) return <ErrorState language={language} error={error} onBack={handleBack} onRetry={handleRetry} />;

  const { title, description, objectives, prerequisites, targetAudience } = localizedContent!;
  const registrationOpen = getCourseField<boolean>(course, 'registration_open');
  const modulesCount = getCourseField<number>(course, 'modules_count');
  const hasCertificate = getCourseField<boolean>(course, 'certificate');

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-white via-[#133059]/2 to-[#e8c97a]/5 relative overflow-hidden print:bg-white">
      {/* Background decoration */}
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 bg-[#e8c97a]/20 rounded-full blur-3xl pointer-events-none print:hidden"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Navigation */}
          <motion.div {...fadeInUp} className="mb-8 print:hidden">
            <ActionButton 
              onClick={handleBack} 
              icon={<ArrowLeft className="w-4 h-4 mr-2" />} 
              label={isArabic ? 'العودة إلى OHB' : 'Retour à OHB'} 
            />
          </motion.div>

          {/* Course Header */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="mb-12">
            {/* Badges */}
            <div className={`flex flex-wrap gap-3 mb-6 ${flexDir}`}>
              <Badge className="bg-[#e8c97a] text-[#133059] font-semibold text-xs">
                {formatLevel(course.level)}
              </Badge>
              {registrationOpen && (
                <Badge className="bg-[#133059] text-white font-semibold text-xs">
                  {isArabic ? 'التسجيل مفتوح' : 'Inscription ouverte'}
                </Badge>
              )}
            </div>

            {/* Title & Description */}
            <h1 className={`text-4xl sm:text-5xl font-bold text-[#133059] leading-tight mb-6 ${textAlign}`}>
              {title}
            </h1>
            <p className={`text-lg text-[#133059]/70 mb-8 leading-relaxed ${textAlign}`}>
              {description}
            </p>

            {/* Course Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              <InfoCard icon={<Clock className="w-5 h-5" />} label={isArabic ? 'المدة' : 'Durée'} value={formatDuration(course.duration_weeks, course.duration_hours || 0)} />
              <InfoCard icon={<BookOpen className="w-5 h-5" />} label={isArabic ? 'الوحدات' : 'Modules'} value={modulesCount || '-'} />
              <InfoCard icon={<Calendar className="w-5 h-5" />} label={isArabic ? 'البداية' : 'Début'} value={course.start_date ? new Date(course.start_date).toLocaleDateString(isArabic ? 'ar-SA' : 'fr-FR') : '-'} />
              <InfoCard icon={<Award className="w-5 h-5" />} label={isArabic ? 'شهادة' : 'Certificat'} value={hasCertificate ? (isArabic ? 'نعم' : 'Oui') : (isArabic ? 'لا' : 'Non')} />
              <InfoCard icon={<Users className="w-5 h-5" />} label={isArabic ? 'المسجلين' : 'Inscrits'} value={enrollmentCount} />
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-wrap gap-3 print:hidden ${flexDir}`}>
              <ActionButton onClick={handleOrder} icon={<ShoppingCart className="w-4 h-4" />} label={isArabic ? 'طلب التسجيل' : 'Commander'} />
              <ActionButton onClick={handleDownloadBrochure} icon={<Download className="w-4 h-4" />} label={isArabic ? 'الكتيب' : 'Brochure'} />
              {course.pdf_file && (
                <ActionButton onClick={handleDownloadPDF} icon={<FileText className="w-4 h-4" />} label="PDF" />
              )}
              <ActionButton onClick={handlePrint} icon={<Printer className="w-4 h-4" />} label={isArabic ? 'طباعة' : 'Imprimer'} />
            </div>
          </motion.div>

          {/* Course Details */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DetailCard icon={<Star />} title={isArabic ? 'الأهداف' : 'Objectifs'} content={objectives} />
            <DetailCard icon={<BookOpen />} title={isArabic ? 'المتطلبات' : 'Prérequis'} content={prerequisites} />
            {targetAudience && <DetailCard icon={<Users />} title={isArabic ? 'الفئة المستهدفة' : 'Public cible'} content={targetAudience} />}
          </motion.div>
        </div>
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        courseTitle={title}
        language={language === 'en' ? 'fr' : language}
        isSubmitting={isSubmitting}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleSubmitEnrollment}
      />
    </div>
  );
};

export default OHBCourseDetail;