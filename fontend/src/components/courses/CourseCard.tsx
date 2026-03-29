import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  Download,
  ShoppingCart,
  Star,
  Eye,
  Calendar,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { Course, CoursesAPI, formatPrice, formatDuration, getImageUrl } from '@/services/api';
import EnrollmentModal from './EnrollmentModal';

interface CourseCardProps {
  course: Course;
  index?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, index = 0 }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const title = language === 'ar' ? course.title_ar : course.title_fr;
  const description = language === 'ar' ? course.description_ar : course.description_fr;
  const categoryName = language === 'ar' ? course.category_name_ar : course.category_name_fr;
  const levelDisplay = language === 'ar' ? course.level_display_ar : course.level_display_fr;

  const handleDownloadPDF = async () => {
    if (!course.pdf_file) {
      toast({
        title: language === 'ar' ? 'غير متوفر' : 'Non disponible',
        description: language === 'ar'
          ? 'لا يوجد ملف PDF متاح لهذا الكورس'
          : 'Aucun fichier PDF disponible pour ce cours',
        variant: 'destructive',
      });
      return;
    }

    setIsDownloading(true);
    try {
      await CoursesAPI.downloadCoursePDF(course.slug);
      toast({
        title: language === 'ar' ? 'تم التحميل' : 'Téléchargement réussi',
        description: language === 'ar'
          ? 'تم تحميل ملف الكورس بنجاح'
          : 'Le fichier du cours a été téléchargé avec succès',
      });
    } catch (error) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Erreur',
        description: language === 'ar'
          ? 'فشل في تحميل الملف'
          : 'Échec du téléchargement du fichier',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEnrollment = () => {
    if (!course.registration_open) {
      toast({
        title: language === 'ar' ? 'التسجيل مغلق' : 'Inscription fermée',
        description: language === 'ar'
          ? 'التسجيل في هذا الكورس غير متاح حالياً'
          : 'L\'inscription à ce cours n\'est pas disponible actuellement',
        variant: 'destructive',
      });
      return;
    }
    setIsEnrollmentModalOpen(true);
  };

  const handleDownloadBrochure = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher la navigation vers la page de détail

    if (course.brochure_pdf) {
      // Télécharger la brochure depuis le backend
      const brochureUrl = `http://localhost:8000/api/courses/${course.id}/brochure/`;
      window.open(brochureUrl, '_blank');

      toast({
        title: language === 'ar' ? 'تحميل الكتيب' : 'Téléchargement de la brochure',
        description: language === 'ar'
          ? 'جاري تحميل كتيب الدورة...'
          : 'Téléchargement de la brochure du cours...',
      });
    } else {
      // Simuler le téléchargement si pas de brochure
      toast({
        title: language === 'ar' ? 'غير متوفر' : 'Non disponible',
        description: language === 'ar'
          ? 'كتيب الدورة غير متوفر حالياً'
          : 'Brochure du cours non disponible actuellement',
        variant: 'destructive',
      });
    }
  };

  const handleViewDetails = () => {
    // Navigation vers la page de détail
    navigate(`/ohb/course/${course.id}`);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 group">
          <CardHeader className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={getImageUrl(course.image)}
                alt={title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Badges overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {course.featured && (
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    {language === 'ar' ? 'مميز' : 'Mis en avant'}
                  </Badge>
                )}
                <Badge variant="secondary" className={getLevelColor(course.level)}>
                  {levelDisplay}
                </Badge>
              </div>

              {/* Price badge */}
              <div className="absolute top-4 right-4">
                <Badge className={course.is_free ? 'bg-green-500' : 'bg-blue-500'}>
                  {formatPrice(course.price, course.is_free)}
                </Badge>
              </div>

              {/* Views counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {course.views_count}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-6">
            <div className="mb-3">
              <Badge variant="outline" className="mb-2">
                {categoryName}
              </Badge>
              <h3 className={`text-xl font-bold mb-2 line-clamp-2 ${language === 'ar' ? 'text-right' : ''}`}>
                {title}
              </h3>
              <p className={`text-muted-foreground text-sm line-clamp-3 ${language === 'ar' ? 'text-right' : ''}`}>
                {description}
              </p>
            </div>

            {/* Course info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(course.duration_weeks, course.duration_hours)}</span>
              </div>



              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>
                  {course.module_count} {language === 'ar' ? 'وحدات' : 'modules'}
                </span>
              </div>

              {course.start_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {language === 'ar' ? 'يبدأ في' : 'Début'}: {new Date(course.start_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0 flex flex-col gap-3">

            {/* Action buttons */}
            <div className="flex flex-col gap-2 w-full">
              {/* Première ligne : Commander et Télécharger brochure */}
              <div className="flex gap-2 w-full">
                <Button
                  onClick={handleEnrollment}
                  disabled={!course.registration_open}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'طلب التسجيل' : 'Commander'}
                </Button>

                <Button
                  onClick={handleDownloadBrochure}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تحميل الكتيب' : 'Télécharger brochure'}
                </Button>
              </div>

              {/* Deuxième ligne : Voir détails et PDF */}
              <div className="flex gap-2 w-full">
                <Button
                  onClick={handleViewDetails}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'عرض التفاصيل' : 'Voir détails'}
                </Button>

                {course.pdf_file && (
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isDownloading ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    ) : (
                      language === 'ar' ? 'PDF' : 'PDF'
                    )}
                  </Button>
                )}
              </div>
            </div>

            {!course.registration_open && (
              <p className="text-xs text-red-500 text-center">
                {language === 'ar' ? 'التسجيل مغلق' : 'Inscription fermée'}
              </p>
            )}
          </CardFooter>
        </Card>
      </motion.div>

      <EnrollmentModal
        course={course}
        isOpen={isEnrollmentModalOpen}
        onClose={() => setIsEnrollmentModalOpen(false)}
      />
    </>
  );
};

export default CourseCard;
