import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, GraduationCap, MessageSquare} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { Course, CoursesAPI, CourseEnrollment } from '@/services/api';

interface EnrollmentModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ course, isOpen, onClose }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CourseEnrollment>({
    course: course.id,
    student_name: '',
    student_email: '',
    student_phone: '',
    student_id: '',
    motivation: '',
    experience_level: 'beginner',
    expectations: '',
  });

  const title = language === 'ar' ? course.title_ar : course.title_fr;

  const handleInputChange = (field: keyof CourseEnrollment, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.student_name || !formData.student_email) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Erreur',
        description: language === 'ar' 
          ? 'يرجى ملء الحقول المطلوبة'
          : 'Veuillez remplir les champs requis',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await CoursesAPI.enrollInCourse(course.slug, formData);
      
      toast({
        title: language === 'ar' ? 'تم التسجيل بنجاح' : 'Inscription réussie',
        description: language === 'ar' 
          ? 'تم إرسال طلب التسجيل بنجاح. سيتم التواصل معك قريباً'
          : 'Votre demande d\'inscription a été envoyée avec succès. Nous vous contacterons bientôt',
      });
      
      onClose();
      setFormData({
        course: course.id,
        student_name: '',
        student_email: '',
        student_phone: '',
        student_id: '',
        motivation: '',
        experience_level: 'beginner',
        expectations: '',
      });
    } catch (error) {
      toast({
        title: language === 'ar' ? 'خطأ في التسجيل' : 'Erreur d\'inscription',
        description: language === 'ar' 
          ? 'فشل في إرسال طلب التسجيل. يرجى المحاولة مرة أخرى'
          : 'Échec de l\'envoi de la demande d\'inscription. Veuillez réessayer',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className={`text-2xl font-bold ${language === 'ar' ? 'text-right' : ''}`}>
                  {language === 'ar' ? 'طلب التسجيل' : 'Demande d\'inscription'}
                </h2>
                <p className={`text-muted-foreground ${language === 'ar' ? 'text-right' : ''}`}>
                  {title}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${language === 'ar' ? 'text-right flex-row-reverse' : ''}`}>
                  <User className="w-5 h-5" />
                  {language === 'ar' ? 'المعلومات الشخصية' : 'Informations personnelles'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="student_name" className={language === 'ar' ? 'text-right block' : ''}>
                      {language === 'ar' ? 'الاسم الكامل *' : 'Nom complet *'}
                    </Label>
                    <Input
                      id="student_name"
                      value={formData.student_name}
                      onChange={(e) => handleInputChange('student_name', e.target.value)}
                      placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Entrez votre nom complet'}
                      required
                      className={language === 'ar' ? 'text-right' : ''}
                    />
                  </div>

                  <div>
                    <Label htmlFor="student_email" className={language === 'ar' ? 'text-right block' : ''}>
                      {language === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
                    </Label>
                    <Input
                      id="student_email"
                      type="email"
                      value={formData.student_email}
                      onChange={(e) => handleInputChange('student_email', e.target.value)}
                      placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Entrez votre email'}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="student_phone" className={language === 'ar' ? 'text-right block' : ''}>
                      {language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}
                    </Label>
                    <Input
                      id="student_phone"
                      value={formData.student_phone}
                      onChange={(e) => handleInputChange('student_phone', e.target.value)}
                      placeholder={language === 'ar' ? 'أدخل رقم هاتفك' : 'Entrez votre numéro'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="student_id" className={language === 'ar' ? 'text-right block' : ''}>
                      {language === 'ar' ? 'رقم الطالب' : 'Numéro étudiant'}
                    </Label>
                    <Input
                      id="student_id"
                      value={formData.student_id}
                      onChange={(e) => handleInputChange('student_id', e.target.value)}
                      placeholder={language === 'ar' ? 'رقم الطالب (اختياري)' : 'Numéro étudiant (optionnel)'}
                    />
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${language === 'ar' ? 'text-right flex-row-reverse' : ''}`}>
                  <GraduationCap className="w-5 h-5" />
                  {language === 'ar' ? 'مستوى الخبرة' : 'Niveau d\'expérience'}
                </h3>

                <div>
                  <Label className={language === 'ar' ? 'text-right block' : ''}>
                    {language === 'ar' ? 'مستواك في هذا المجال' : 'Votre niveau dans ce domaine'}
                  </Label>
                  <Select
                    value={formData.experience_level}
                    onValueChange={(value) => handleInputChange('experience_level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">
                        {language === 'ar' ? 'مبتدئ' : 'Débutant'}
                      </SelectItem>
                      <SelectItem value="intermediate">
                        {language === 'ar' ? 'متوسط' : 'Intermédiaire'}
                      </SelectItem>
                      <SelectItem value="advanced">
                        {language === 'ar' ? 'متقدم' : 'Avancé'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Motivation and Expectations */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${language === 'ar' ? 'text-right flex-row-reverse' : ''}`}>
                  <MessageSquare className="w-5 h-5" />
                  {language === 'ar' ? 'معلومات إضافية' : 'Informations supplémentaires'}
                </h3>

                <div>
                  <Label htmlFor="motivation" className={language === 'ar' ? 'text-right block' : ''}>
                    {language === 'ar' ? 'دافعك للتسجيل' : 'Votre motivation'}
                  </Label>
                  <Textarea
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    placeholder={language === 'ar' 
                      ? 'لماذا تريد التسجيل في هذا الكورس؟'
                      : 'Pourquoi souhaitez-vous vous inscrire à ce cours ?'
                    }
                    rows={3}
                    className={language === 'ar' ? 'text-right' : ''}
                  />
                </div>

                <div>
                  <Label htmlFor="expectations" className={language === 'ar' ? 'text-right block' : ''}>
                    {language === 'ar' ? 'توقعاتك من الكورس' : 'Vos attentes du cours'}
                  </Label>
                  <Textarea
                    id="expectations"
                    value={formData.expectations}
                    onChange={(e) => handleInputChange('expectations', e.target.value)}
                    placeholder={language === 'ar' 
                      ? 'ما الذي تتوقع تعلمه من هذا الكورس؟'
                      : 'Que espérez-vous apprendre de ce cours ?'
                    }
                    rows={3}
                    className={language === 'ar' ? 'text-right' : ''}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  {language === 'ar' ? 'إلغاء' : 'Annuler'}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {language === 'ar' ? 'جاري الإرسال...' : 'Envoi en cours...'}
                    </div>
                  ) : (
                    language === 'ar' ? 'إرسال الطلب' : 'Envoyer la demande'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EnrollmentModal;
