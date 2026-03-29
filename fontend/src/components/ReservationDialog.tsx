import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, User, Mail, Phone, MessageSquare } from 'lucide-react';

interface ReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userInfo: { name: string; email: string; phone?: string; notes?: string }) => void;
  book: {
    id: number;
    title: string;
    authors_list: string;
    cover_image?: string;
    isbn: string;
  } | null;
}

const ReservationDialog: React.FC<ReservationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  book
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user ? `${user.first_name} ${user.last_name}` : '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    notes: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = language === 'ar' ? 'الاسم مطلوب' : 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onConfirm(formData);
      onClose();
      // Réinitialiser le formulaire
      setFormData({
        name: user ? `${user.first_name} ${user.last_name}` : '',
        email: user?.email || '',
        phone: user?.profile?.phone || '',
        notes: ''
      });
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!book) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md ${language === 'ar' ? 'text-right' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <BookOpen className="h-5 w-5 text-green-600" />
            {language === 'ar' ? 'تأكيد الحجز' : 'Confirmer la réservation'}
          </DialogTitle>
          <DialogDescription className={language === 'ar' ? 'text-right' : ''}>
            {language === 'ar'
              ? 'يرجى تأكيد معلوماتك لإتمام حجز الكتاب'
              : 'Veuillez confirmer vos informations pour finaliser la réservation du livre'
            }
          </DialogDescription>
        </DialogHeader>

        {/* Informations du livre */}
        <div className={`bg-gray-50 p-4 rounded-lg mb-4 ${language === 'ar' ? 'text-right' : ''}`}>
          <div className={`flex gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            {book.cover_image ? (
              <img
                src={book.cover_image}
                alt={book.title}
                className="w-12 h-16 object-cover rounded"
              />
            ) : (
              <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-sm line-clamp-2">{book.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{book.authors_list}</p>
              <p className="text-xs text-gray-500 mt-1">ISBN: {book.isbn}</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="name" className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <User className="h-4 w-4" />
              {language === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Entrez votre nom complet'}
              className={`${language === 'ar' ? 'text-right' : ''} ${errors.name ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className={`text-sm text-red-500 ${language === 'ar' ? 'text-right' : ''}`}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Mail className="h-4 w-4" />
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Entrez votre email'}
              className={`${language === 'ar' ? 'text-right' : ''} ${errors.email ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className={`text-sm text-red-500 ${language === 'ar' ? 'text-right' : ''}`}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Phone className="h-4 w-4" />
              {language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}
              <span className="text-gray-400 text-sm">
                ({language === 'ar' ? 'اختياري' : 'optionnel'})
              </span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder={language === 'ar' ? 'أدخل رقم هاتفك' : 'Entrez votre numéro de téléphone'}
              className={language === 'ar' ? 'text-right' : ''}
              disabled={isSubmitting}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <MessageSquare className="h-4 w-4" />
              {language === 'ar' ? 'ملاحظات' : 'Notes'}
              <span className="text-gray-400 text-sm">
                ({language === 'ar' ? 'اختياري' : 'optionnel'})
              </span>
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder={language === 'ar' ? 'أي ملاحظات إضافية...' : 'Toute note supplémentaire...'}
              className={language === 'ar' ? 'text-right' : ''}
              rows={3}
              disabled={isSubmitting}
            />
          </div>
        </form>

        <DialogFooter className={`gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {language === 'ar' ? 'إلغاء' : 'Annuler'}
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting
              ? (language === 'ar' ? 'جاري الحجز...' : 'Réservation...')
              : (language === 'ar' ? 'تأكيد الحجز' : 'Confirmer la réservation')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDialog;
