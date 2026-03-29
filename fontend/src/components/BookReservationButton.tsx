import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  X,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

/* ═══════════════════ TYPES ═══════════════════ */
interface Book {
  id: number;
  title: string;
  status: string;
  copies_available: number;
  is_available: boolean;
}

interface Reservation {
  id: number;
  status: string;
  status_display: string;
  reservation_date: string;
  expiry_date: string;
  pickup_date?: string;
}

interface BookReservationButtonProps {
  book: Book;
  userEmail?: string;
  onReservationChange?: () => void;
}

/* ═══════════════════ STATUS COLORS ═══════════════════ */
const STATUS_COLORS: Record<
  string,
  { badge: string; label: { ar: string; fr: string; en: string } }
> = {
  pending: {
    badge: 'bg-amber-100 text-amber-700 border-amber-200/60',
    label: { ar: 'قيد الانتظار', fr: 'En attente', en: 'Pending' },
  },
  ready: {
    badge: 'bg-[#133059] text-white border-[#133059]',
    label: { ar: 'جاهز للاستلام', fr: 'Pret a retirer', en: 'Ready for Pickup' },
  },
  fulfilled: {
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200/60',
    label: { ar: 'تم الاستلام', fr: 'Retire', en: 'Fulfilled' },
  },
  cancelled: {
    badge: 'bg-slate-100 text-slate-600 border-slate-200/60',
    label: { ar: 'ملغي', fr: 'Annule', en: 'Cancelled' },
  },
  expired: {
    badge: 'bg-red-100 text-red-700 border-red-200/60',
    label: { ar: 'منتهي', fr: 'Expire', en: 'Expired' },
  },
};

const DEFAULT_STATUS_COLOR = {
  badge: 'bg-slate-100 text-slate-600 border-slate-200/60',
  label: { ar: 'غير معروف', fr: 'Inconnu', en: 'Unknown' },
};

/* ═══════════════════ ANIMATION ═══════════════════ */
const reservationVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

/* ═══════════════════ COMPONENT ═══════════════════ */
const BookReservationButton: React.FC<BookReservationButtonProps> = ({
  book,
  userEmail,
  onReservationChange,
}) => {
  const { language: lang } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [hasReservation, setHasReservation] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    reserver_name: '',
    reserver_email: userEmail || '',
    reserver_phone: '',
    notes: '',
  });
  const { toast } = useToast();

  const t = useCallback(
    (ar: string, fr: string, en: string) =>
      lang === 'ar' ? ar : lang === 'en' ? en : fr,
    [lang],
  );

  useEffect(() => {
    if (userEmail) {
      checkReservationStatus();
    }
  }, [book.id, userEmail]);

  const checkReservationStatus = async () => {
    if (!userEmail) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/library/books/${book.id}/reservation-status/?email=${userEmail}`,
      );
      const data = await response.json();

      setHasReservation(data.has_reservation);
      if (data.has_reservation) {
        setReservation(data.reservation);
      }
    } catch (error) {
      console.error('Error checking reservation status:', error);
    }
  };

  const handleReservation = async () => {
    setIsLoading(true);

    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);

      const response = await fetch(
        `http://localhost:8000/api/library/books/${book.id}/reserve/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            expiry_date: expiryDate.toISOString(),
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: t(
            'تم تأكيد الحجز!',
            'Reservation confirmee !',
            'Reservation Confirmed!',
          ),
          description: t(
            `تم تسجيل حجزك لـ "${book.title}" بنجاح.`,
            `Votre reservation pour "${book.title}" a ete enregistree avec succes.`,
            `Your reservation for "${book.title}" has been successfully registered.`,
          ),
          duration: 5000,
        });

        setIsDialogOpen(false);
        setHasReservation(true);
        checkReservationStatus();
        onReservationChange?.();

        setFormData({
          reserver_name: '',
          reserver_email: userEmail || '',
          reserver_phone: '',
          notes: '',
        });
      } else {
        toast({
          title: t(
            'خطأ في الحجز',
            'Erreur de reservation',
            'Reservation Error',
          ),
          description:
            data.message ||
            t(
              'حدث خطأ أثناء الحجز.',
              'Une erreur est survenue lors de la reservation.',
              'An error occurred during reservation.',
            ),
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: t('خطأ في الاتصال', 'Erreur de connexion', 'Connection Error'),
        description: t(
          'تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.',
          'Impossible de contacter le serveur. Veuillez reessayer.',
          'Unable to contact the server. Please try again.',
        ),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!reservation || !userEmail) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/library/reservations/${reservation.id}/cancel/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail }),
        },
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: t(
            'تم إلغاء الحجز',
            'Reservation annulee',
            'Reservation Cancelled',
          ),
          description: t(
            'تم إلغاء حجزك بنجاح.',
            'Votre reservation a ete annulee avec succes.',
            'Your reservation has been cancelled successfully.',
          ),
        });

        setHasReservation(false);
        setReservation(null);
        onReservationChange?.();
      } else {
        toast({
          title: t('خطأ', 'Erreur', 'Error'),
          description:
            data.error ||
            t(
              'تعذر إلغاء الحجز.',
              "Impossible d'annuler la reservation.",
              'Unable to cancel reservation.',
            ),
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: t('خطأ في الاتصال', 'Erreur de connexion', 'Connection Error'),
        description: t(
          'تعذر الاتصال بالخادم.',
          'Impossible de contacter le serveur.',
          'Unable to contact the server.',
        ),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) =>
    STATUS_COLORS[status] || DEFAULT_STATUS_COLOR;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {hasReservation && reservation ? (
          <motion.div
            key="reserved"
            variants={reservationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-3"
          >
            {/* Active Reservation */}
            <motion.div
              className="w-full p-4 rounded-2xl border border-[#e8c97a]/20 bg-[#e8c97a]/[0.03]"
              whileHover={{ borderColor: 'rgba(232,201,122,0.4)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="flex-shrink-0 p-1.5 bg-[#e8c97a]/10 rounded-lg"
                >
                  <Clock className="h-4 w-4 text-[#e8c97a]" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#133059] text-sm tracking-tight">
                    {t(
                      'حجز نشط',
                      'Reservation active',
                      'Active Reservation',
                    )}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {reservation.status_display}
                  </p>
                </div>
                <Badge
                  className={`${getStatusConfig(reservation.status).badge} border font-bold text-[10px] backdrop-blur-sm`}
                >
                  {lang === 'ar'
                    ? getStatusConfig(reservation.status).label.ar
                    : lang === 'en'
                      ? getStatusConfig(reservation.status).label.en
                      : getStatusConfig(reservation.status).label.fr}
                </Badge>
              </div>

              {/* Dates */}
              <div className="space-y-1.5 text-[11px] text-slate-500 bg-white/60 p-3 rounded-xl border border-slate-100/60">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">
                    {t('تاريخ الحجز:', 'Reserve le:', 'Reserved on:')}
                  </span>
                  <span className="text-slate-600">
                    {new Date(
                      reservation.reservation_date,
                    ).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">
                    {t('تاريخ الانتهاء:', 'Expire le:', 'Expires on:')}
                  </span>
                  <span className="font-bold text-[#e8c97a]">
                    {new Date(reservation.expiry_date).toLocaleDateString(
                      'fr-FR',
                    )}
                  </span>
                </div>
                {reservation.pickup_date && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">
                      {t('تاريخ الاستلام:', 'Retrait:', 'Pickup:')}
                    </span>
                    <span className="text-slate-600">
                      {new Date(
                        reservation.pickup_date,
                      ).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Cancel Button */}
            {reservation.status === 'pending' && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelReservation}
                  disabled={isLoading}
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 font-semibold border border-red-200/60 rounded-xl text-xs"
                >
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  {isLoading
                    ? t('جاري الإلغاء...', 'Annulation...', 'Cancelling...')
                    : t(
                        'إلغاء الحجز',
                        'Annuler la reservation',
                        'Cancel Reservation',
                      )}
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="unreserved"
            variants={reservationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    disabled={book.is_available}
                    className="w-full bg-[#133059] hover:bg-[#0a2342] text-white font-bold shadow-sm transition-all duration-300 flex items-center justify-center gap-2 rounded-xl"
                  >
                    <Calendar className="h-4 w-4" />
                    {book.is_available
                      ? t('متاح', 'Disponible', 'Available')
                      : t('حجز', 'Reserver', 'Reserve')}
                  </Button>
                </motion.div>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px] rounded-3xl border-slate-200/80 shadow-2xl">
                {/* Header */}
                <DialogHeader className="border-b border-slate-100/80 pb-4">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <DialogTitle
                      className="text-2xl font-serif font-bold text-[#133059] tracking-tight"
                      style={{
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                      }}
                    >
                      {t(
                        'حجز الكتاب',
                        'Reserver le livre',
                        'Reserve This Book',
                      )}
                    </DialogTitle>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <DialogDescription className="text-slate-400 mt-2 text-sm">
                      {t(
                        `املأ بياناتك لحجز "${book.title}". سيتم إخطارك عند توفره.`,
                        `Remplissez vos informations pour reserver "${book.title}". Vous serez notifie(e) des qu'il sera disponible.`,
                        `Fill in your details to reserve "${book.title}". You'll be notified once it's available.`,
                      )}
                    </DialogDescription>
                  </motion.div>
                </DialogHeader>

                {/* Form */}
                <motion.div
                  className="grid gap-5 py-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Name */}
                  <motion.div
                    className="grid gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Label
                      htmlFor="name"
                      className="font-bold text-[#133059] text-sm"
                    >
                      {t('الاسم الكامل', 'Nom complet', 'Full Name')}{' '}
                      <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.reserver_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          reserver_name: e.target.value,
                        }))
                      }
                      placeholder={t(
                        'اسمك الكامل',
                        'Votre nom complet',
                        'Your full name',
                      )}
                      className="border-slate-200/80 focus:border-[#e8c97a] focus:ring-[#e8c97a]/20 placeholder:text-slate-300 rounded-xl"
                      required
                    />
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    className="grid gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label
                      htmlFor="email"
                      className="font-bold text-[#133059] text-sm"
                    >
                      {t('البريد الإلكتروني', 'Email', 'Email')}{' '}
                      <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.reserver_email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          reserver_email: e.target.value,
                        }))
                      }
                      placeholder={t(
                        'بريدك الإلكتروني',
                        'votre.email@example.com',
                        'your.email@example.com',
                      )}
                      className="border-slate-200/80 focus:border-[#e8c97a] focus:ring-[#e8c97a]/20 placeholder:text-slate-300 rounded-xl"
                      required
                    />
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    className="grid gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Label
                      htmlFor="phone"
                      className="font-bold text-[#133059] text-sm"
                    >
                      {t('الهاتف', 'Telephone', 'Phone')}
                    </Label>
                    <Input
                      id="phone"
                      value={formData.reserver_phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          reserver_phone: e.target.value,
                        }))
                      }
                      placeholder={t(
                        'رقم هاتفك',
                        'Votre numero de telephone',
                        'Your phone number',
                      )}
                      className="border-slate-200/80 focus:border-[#e8c97a] focus:ring-[#e8c97a]/20 placeholder:text-slate-300 rounded-xl"
                    />
                  </motion.div>

                  {/* Notes */}
                  <motion.div
                    className="grid gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label
                      htmlFor="notes"
                      className="font-bold text-[#133059] text-sm"
                    >
                      {t('ملاحظات', 'Notes', 'Notes')}{' '}
                      <span className="text-[10px] text-slate-300 font-normal">
                        ({t('اختياري', 'optionnel', 'optional')})
                      </span>
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder={t(
                        'معلومات إضافية...',
                        'Informations supplementaires...',
                        'Additional information...',
                      )}
                      rows={3}
                      className="border-slate-200/80 focus:border-[#e8c97a] focus:ring-[#e8c97a]/20 placeholder:text-slate-300 resize-none rounded-xl"
                    />
                  </motion.div>
                </motion.div>

                {/* Footer */}
                <DialogFooter className="border-t border-slate-100/80 pt-4 gap-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="border-slate-200/80 text-slate-500 hover:bg-slate-50 rounded-xl"
                    >
                      {t('إلغاء', 'Annuler', 'Cancel')}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      onClick={handleReservation}
                      disabled={
                        isLoading ||
                        !formData.reserver_name ||
                        !formData.reserver_email
                      }
                      className="w-full bg-[#133059] hover:bg-[#0a2342] text-white font-bold shadow-sm transition-all duration-300 rounded-xl"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t('جاري الحجز...', 'Reservation...', 'Reserving...')}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {t(
                            'تأكيد الحجز',
                            'Confirmer la reservation',
                            'Confirm Reservation',
                          )}
                        </>
                      )}
                    </Button>
                  </motion.div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookReservationButton;
