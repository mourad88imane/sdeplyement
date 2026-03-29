import { motion } from 'framer-motion';
import { 
  BookOpen, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  FileText, 
  Info, 
  Send, 
  Loader2

} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
 
} from '@/components/ui/dialog';

interface RegistrationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  language: 'fr' | 'ar';
  isSubmitting: boolean;
  formData: {
    student_name: string;
    student_email: string;
    student_phone: string;
    notes: string;
  };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const RegistrationModal = ({
  isOpen,
  onOpenChange,
  courseTitle,
  language,
  isSubmitting,
  formData,
  onFormChange,
  onSubmit
}: RegistrationModalProps) => {
  const isArabic = language === 'ar';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white p-0 border-0 shadow-2xl">
        {/* Header - Gradient Background */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-[#133059] via-[#0a2342] to-[#133059] -mx-6 -mt-6 px-8 py-8 rounded-t-2xl relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8c97a]/10 rounded-full blur-2xl" />
          
          <div className="relative z-10 flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-14 h-14 bg-[#e8c97a]/20 border border-[#e8c97a]/40 rounded-full flex items-center justify-center shadow-lg"
            >
              <BookOpen className="w-7 h-7 text-[#e8c97a]" />
            </motion.div>
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-white font-bold text-xl leading-tight"
              >
                {isArabic ? 'التسجيل في الدورة' : 'Inscription à la formation'}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-[#e8c97a] text-sm font-semibold line-clamp-2 mt-1"
              >
                {courseTitle}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Dialog Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="px-8 pt-6"
        >
          <DialogDescription className={`text-[#133059]/80 text-sm leading-relaxed ${isArabic ? 'text-right' : ''}`}>
            {isArabic
              ? 'املأ النموذج أدناه للتسجيل. سنقوم بتأكيد تسجيلك عبر البريد الإلكتروني خلال 24 ساعة.'
              : 'Remplissez le formulaire ci-dessous. Nous confirmerons votre inscription par email dans les 24 heures.'}
          </DialogDescription>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={onSubmit}
          className="px-8 py-6 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Personal Information Section */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-[#133059]/5 to-[#e8c97a]/5 border border-[#133059]/10 rounded-2xl p-6 space-y-5"
          >
            <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-[#e8c97a]/20 flex items-center justify-center">
                <User className="w-4 h-4 text-[#133059]" />
              </div>
              <h3 className="font-bold text-[#133059] text-base">
                {isArabic ? 'المعلومات الشخصية' : 'Informations personnelles'}
              </h3>
            </div>

            <FormField
              id="student_name"
              name="student_name"
              label={isArabic ? 'الاسم الكامل' : 'Nom complet'}
              type="text"
              value={formData.student_name}
              onChange={onFormChange}
              placeholder={isArabic ? 'أدخل اسمك الكامل' : 'Entrez votre nom complet'}
              required
              isArabic={isArabic}
              icon={<User className="w-4 h-4" />}
            />

            <FormField
              id="student_email"
              name="student_email"
              label={isArabic ? 'البريد الإلكتروني' : 'Email'}
              type="email"
              value={formData.student_email}
              onChange={onFormChange}
              placeholder={isArabic ? 'exemple@email.com' : 'votre.email@exemple.com'}
              required
              isArabic={isArabic}
              icon={<Mail className="w-4 h-4" />}
            />

            <FormField
              id="student_phone"
              name="student_phone"
              label={isArabic ? 'رقم الهاتف' : 'Téléphone'}
              type="tel"
              value={formData.student_phone}
              onChange={onFormChange}
              placeholder={isArabic ? '+213 555 000 000' : '+33 6 00 00 00 00'}
              isArabic={isArabic}
              icon={<Phone className="w-4 h-4" />}
            />
          </motion.div>

          {/* Additional Info Section */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-[#e8c97a]/5 to-[#133059]/5 border border-[#e8c97a]/20 rounded-2xl p-6 space-y-4"
          >
            <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-[#e8c97a]/20 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-[#133059]" />
              </div>
              <h3 className="font-bold text-[#133059] text-base">
                {isArabic ? 'معلومات إضافية' : 'Informations supplémentaires'}
              </h3>
            </div>

            <div className="space-y-2.5">
              <Label className={`flex items-center gap-2 text-[#133059] font-semibold text-sm ${isArabic ? 'flex-row-reverse' : ''}`}>
                <FileText className="w-4 h-4 text-[#e8c97a]" />
                {isArabic ? 'ملاحظات' : 'Notes'} ({isArabic ? 'اختياري' : 'Optionnel'})
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={onFormChange}
                placeholder={isArabic ? 'شارك توقعاتك من الدورة...' : 'Partagez vos attentes concernant la formation...'}
                rows={4}
                className={`border-[#133059]/20 focus:border-[#e8c97a] focus:ring-[#e8c97a]/30 resize-none ${isArabic ? 'text-right' : ''} bg-white/50 hover:bg-white transition-colors`}
              />
            </div>
          </motion.div>

          {/* Info Alert Box */}
          <motion.div
            variants={itemVariants}
            className="bg-[#e8c97a]/10 border border-[#e8c97a]/30 rounded-xl p-4 flex items-start gap-3"
          >
            <Info className="w-5 h-5 text-[#e8c97a] flex-shrink-0 mt-0.5" />
            <p className={`text-sm text-[#133059]/80 leading-relaxed ${isArabic ? 'text-right' : ''}`}>
              {isArabic
                ? '✓ بيانات آمنة مشفرة • ✓ لا توجد رسوم مخفية • ✓ دعم 24/7'
                : '✓ Données sécurisées • ✓ Aucun frais caché • ✓ Support 24/7'}
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="DialogFooter gap-3 flex flex-col-reverse sm:flex-row pt-2"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full border-[#133059]/20 text-[#133059] hover:border-[#133059] hover:bg-[#133059]/5 font-semibold transition-all"
                disabled={isSubmitting}
              >
                {isArabic ? 'إلغاء' : 'Annuler'}
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                type="submit"
                disabled={isSubmitting || !formData.student_name || !formData.student_email}
                className="w-full bg-[#133059] hover:bg-[#0a2342] text-white font-bold gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isArabic ? 'جاري الإرسال...' : 'Envoi en cours...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{isArabic ? 'إرسال الطلب' : 'Envoyer ma demande'}</span>
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};

// FormField Component
interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  isArabic: boolean;
  icon?: React.ReactNode;
}

const FormField = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  isArabic,
  icon
}: FormFieldProps) => (
  <motion.div
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-2.5"
  >
    <Label
      htmlFor={id}
      className={`flex items-center gap-1.5 text-[#133059] font-semibold text-sm ${isArabic ? 'flex-row-reverse' : ''}`}
    >
      {icon && <span className="text-[#e8c97a]">{icon}</span>}
      {label}
      {required && <span className="text-red-500 font-bold">*</span>}
    </Label>
    <div className="relative group">
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`h-11 border-[#133059]/20 focus:border-[#e8c97a] focus:ring-[#e8c97a]/30 text-[#133059] placeholder:text-[#133059]/40 bg-white/70 hover:bg-white transition-colors font-medium ${
          isArabic ? 'text-right' : ''
        }`}
      />
      <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-[#e8c97a] to-[#133059] rounded-r opacity-0 group-focus-within:opacity-100 transition-opacity" />
    </div>
  </motion.div>
);

export default RegistrationModal;
