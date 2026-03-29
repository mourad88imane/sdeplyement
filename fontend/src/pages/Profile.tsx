import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr, ar } from 'date-fns/locale';
import {
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  User,
  Mail,
  Phone,
  Badge as BadgeIcon,


} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useReservations } from '@/context/ReservationContext';

const Profile = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { reservations, cancelReservation, getReservationsByStatus, getTotalReservations } = useReservations();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign-in');
    }
  }, [isAuthenticated, navigate]);

  const handleCancelReservation = (reservationId: string, bookTitle: string) => {
    cancelReservation(reservationId);
    toast({
      title: language === 'ar' ? 'تم إلغاء الحجز' : 'Réservation annulée',
      description: language === 'ar'
        ? `تم إلغاء حجز "${bookTitle}" بنجاح`
        : `La réservation de "${bookTitle}" a été annulée avec succès`,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800',
        text_fr: 'En attente',
        text_ar: 'في الانتظار'
      },
      ready: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800',
        text_fr: 'Prêt',
        text_ar: 'جاهز'
      },
      fulfilled: {
        icon: CheckCircle,
        color: 'bg-blue-100 text-blue-800',
        text_fr: 'Récupéré',
        text_ar: 'تم الاستلام'
      },
      cancelled: {
        icon: XCircle,
        color: 'bg-red-100 text-red-800',
        text_fr: 'Annulé',
        text_ar: 'ملغي'
      },
      expired: {
        icon: AlertCircle,
        color: 'bg-gray-100 text-gray-800',
        text_fr: 'Expiré',
        text_ar: 'منتهي الصلاحية'
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {language === 'ar' ? config.text_ar : config.text_fr}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'ar' ? ar : fr;
    return format(date, 'dd MMM yyyy', { locale });
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  // Statistiques des réservations
  const activeReservations = getReservationsByStatus('pending').length + getReservationsByStatus('ready').length;
  const totalReservations = getTotalReservations();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className={`mb-12 ${language === 'ar' ? 'text-right' : ''}`}>
          <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${language === 'ar' ? 'md:flex-row-reverse' : ''}`}>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {language === 'ar' ? 'الملف الشخصي' : 'Mon Profil'}
              </h1>
              <div className={`flex items-center gap-2 text-muted-foreground ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <User className="h-4 w-4" />
                <span>{user.first_name} {user.last_name}</span>
              </div>
              <div className={`flex items-center gap-2 text-muted-foreground ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              {user.profile?.phone && (
                <div className={`flex items-center gap-2 text-muted-foreground ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Phone className="h-4 w-4" />
                  <span>{user.profile.phone}</span>
                </div>
              )}
            </div>
            <Button variant="outline">
              {language === 'ar' ? 'تعديل الملف الشخصي' : 'Modifier le profil'}
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'ar' ? 'الحجوزات النشطة' : 'Réservations actives'}
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeReservations}</div>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'حجوزات في الانتظار أو جاهزة' : 'En attente ou prêtes'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'ar' ? 'إجمالي الحجوزات' : 'Total des réservations'}
              </CardTitle>
              <BadgeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReservations}</div>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'جميع الحجوزات' : 'Toutes les réservations'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'ar' ? 'الحجوزات المكتملة' : 'Réservations récupérées'}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getReservationsByStatus('fulfilled').length}</div>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'كتب تم استلامها' : 'Livres récupérés'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reservations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <BookOpen className="h-5 w-5" />
                {language === 'ar' ? 'حجوزات الكتب' : 'Mes Réservations de Livres'}
              </CardTitle>
              <CardDescription>
                {language === 'ar'
                  ? 'إدارة حجوزات الكتب الخاصة بك'
                  : 'Gérez vos réservations de livres'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reservations.length > 0 ? (
                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="active">
                      {language === 'ar' ? 'نشطة' : 'Actives'} ({activeReservations})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      {language === 'ar' ? 'مكتملة' : 'Terminées'} ({getReservationsByStatus('fulfilled').length})
                    </TabsTrigger>
                    <TabsTrigger value="all">
                      {language === 'ar' ? 'الكل' : 'Toutes'} ({reservations.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="active" className="mt-6">
                    <div className="space-y-4">
                      {[...getReservationsByStatus('pending'), ...getReservationsByStatus('ready')].map((reservation) => (
                        <div key={reservation.id} className="border rounded-lg p-4">
                          <div className={`flex gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                            {reservation.bookCover ? (
                              <img
                                src={reservation.bookCover}
                                alt={reservation.bookTitle}
                                className="w-16 h-20 object-cover rounded"
                              />
                            ) : (
                              <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                                <BookOpen className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className={`flex items-start justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                <div>
                                  <h3 className={`font-semibold text-lg ${language === 'ar' ? 'text-right' : ''}`}>
                                    {reservation.bookTitle}
                                  </h3>
                                  <p className={`text-gray-600 ${language === 'ar' ? 'text-right' : ''}`}>
                                    {reservation.bookAuthor}
                                  </p>
                                  <p className={`text-sm text-gray-500 ${language === 'ar' ? 'text-right' : ''}`}>
                                    ISBN: {reservation.bookIsbn}
                                  </p>
                                </div>
                                {getStatusBadge(reservation.status)}
                              </div>
                              <div className={`mt-3 grid grid-cols-2 gap-4 text-sm ${language === 'ar' ? 'text-right' : ''}`}>
                                <div>
                                  <span className="text-gray-500">
                                    {language === 'ar' ? 'تاريخ الحجز:' : 'Date de réservation:'}
                                  </span>
                                  <br />
                                  <span className="font-medium">{formatDate(reservation.reservationDate)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">
                                    {language === 'ar' ? 'تاريخ انتهاء الصلاحية:' : 'Date d\'expiration:'}
                                  </span>
                                  <br />
                                  <span className="font-medium">{formatDate(reservation.expiryDate)}</span>
                                </div>
                              </div>
                              {reservation.status === 'pending' && (
                                <div className={`mt-4 ${language === 'ar' ? 'text-left' : 'text-right'}`}>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                      >
                                        <Trash2 className="mr-1 h-4 w-4" />
                                        {language === 'ar' ? 'إلغاء الحجز' : 'Annuler'}
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          {language === 'ar' ? 'إلغاء الحجز؟' : 'Annuler la réservation?'}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          {language === 'ar'
                                            ? `هل أنت متأكد من إلغاء حجز "${reservation.bookTitle}"؟ لا يمكن التراجع عن هذا الإجراء.`
                                            : `Êtes-vous sûr de vouloir annuler votre réservation pour "${reservation.bookTitle}"? Cette action ne peut pas être annulée.`
                                          }
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          {language === 'ar' ? 'إلغاء' : 'Annuler'}
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleCancelReservation(reservation.id, reservation.bookTitle)}
                                          className="bg-red-500 hover:bg-red-600"
                                        >
                                          {language === 'ar' ? 'نعم، إلغاء الحجز' : 'Oui, annuler'}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {activeReservations === 0 && (
                        <div className="text-center py-8">
                          <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">
                            {language === 'ar' ? 'لا توجد حجوزات نشطة' : 'Aucune réservation active'}
                          </h3>
                          <p className="text-muted-foreground">
                            {language === 'ar'
                              ? 'جميع حجوزاتك مكتملة أو ملغية'
                              : 'Toutes vos réservations sont terminées ou annulées'
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="completed" className="mt-6">
                    <div className="space-y-4">
                      {getReservationsByStatus('fulfilled').map((reservation) => (
                        <div key={reservation.id} className="border rounded-lg p-4 bg-green-50">
                          <div className={`flex gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                            {reservation.bookCover ? (
                              <img
                                src={reservation.bookCover}
                                alt={reservation.bookTitle}
                                className="w-16 h-20 object-cover rounded"
                              />
                            ) : (
                              <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                                <BookOpen className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className={`flex items-start justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                <div>
                                  <h3 className={`font-semibold text-lg ${language === 'ar' ? 'text-right' : ''}`}>
                                    {reservation.bookTitle}
                                  </h3>
                                  <p className={`text-gray-600 ${language === 'ar' ? 'text-right' : ''}`}>
                                    {reservation.bookAuthor}
                                  </p>
                                </div>
                                {getStatusBadge(reservation.status)}
                              </div>
                              <div className={`mt-3 text-sm ${language === 'ar' ? 'text-right' : ''}`}>
                                <span className="text-gray-500">
                                  {language === 'ar' ? 'تم الاستلام في:' : 'Récupéré le:'}
                                </span>
                                <span className="font-medium ml-2">{formatDate(reservation.reservationDate)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {getReservationsByStatus('fulfilled').length === 0 && (
                        <div className="text-center py-8">
                          <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">
                            {language === 'ar' ? 'لا توجد حجوزات مكتملة' : 'Aucune réservation terminée'}
                          </h3>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="all" className="mt-6">
                    <div className="space-y-4">
                      {reservations.map((reservation) => (
                        <div key={reservation.id} className="border rounded-lg p-4">
                          <div className={`flex gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                            {reservation.bookCover ? (
                              <img
                                src={reservation.bookCover}
                                alt={reservation.bookTitle}
                                className="w-16 h-20 object-cover rounded"
                              />
                            ) : (
                              <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                                <BookOpen className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className={`flex items-start justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                <div>
                                  <h3 className={`font-semibold text-lg ${language === 'ar' ? 'text-right' : ''}`}>
                                    {reservation.bookTitle}
                                  </h3>
                                  <p className={`text-gray-600 ${language === 'ar' ? 'text-right' : ''}`}>
                                    {reservation.bookAuthor}
                                  </p>
                                </div>
                                {getStatusBadge(reservation.status)}
                              </div>
                              <div className={`mt-3 text-sm ${language === 'ar' ? 'text-right' : ''}`}>
                                <span className="text-gray-500">
                                  {language === 'ar' ? 'تاريخ الحجز:' : 'Réservé le:'}
                                </span>
                                <span className="font-medium ml-2">{formatDate(reservation.reservationDate)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-10">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {language === 'ar' ? 'لا توجد حجوزات' : 'Aucune réservation'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {language === 'ar'
                      ? 'قم بزيارة المكتبة لتصفح الكتب وحجزها'
                      : 'Visitez notre bibliothèque pour parcourir et réserver des livres'
                    }
                  </p>
                  <Button asChild>
                    <a href="/bibliotheque" onClick={() => navigate('/bibliotheque')}>
                      {language === 'ar' ? 'تصفح المكتبة' : 'Parcourir la bibliothèque'}
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;