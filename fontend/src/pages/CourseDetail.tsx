import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { ArrowLeft, Clock, User, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { courses, Course } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement de données
    setLoading(true);
    
    // Trouver le cours correspondant à l'ID
    const foundCourse = courses.find(c => c.id === courseId);
    
    if (foundCourse) {
      setCourse(foundCourse);
    }
    
    setLoading(false);
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Button 
            variant="outline" 
            className="mb-8"
            onClick={() => navigate('/formation')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === 'ar' ? 'العودة إلى البرامج' : 'Retour aux programmes'}
          </Button>
          
          <div className="text-center py-16">
            <GraduationCap className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-4">
              {language === 'ar' ? 'البرنامج غير موجود' : 'Programme non trouvé'}
            </h1>
            <p className="text-muted-foreground mb-8">
              {language === 'ar' 
                ? 'عذراً، لم نتمكن من العثور على البرنامج الذي تبحث عنه.' 
                : 'Désolé, nous n\'avons pas pu trouver le programme que vous recherchez.'}
            </p>
            <Button onClick={() => navigate('/formation')}>
              {language === 'ar' ? 'استعرض جميع البرامج' : 'Voir tous les programmes'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Button 
          variant="outline" 
          className="mb-8"
          onClick={() => navigate('/formation')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === 'ar' ? 'العودة إلى البرامج' : 'Retour aux programmes'}
        </Button>
        
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className={`${language === 'ar' ? 'order-2 lg:order-1' : ''}`}>
            <div className="mb-4">
              <Badge>{course.category}</Badge>
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${language === 'ar' ? 'text-right' : ''}`}>
              {course.title}
            </h1>
            <p className={`text-lg text-muted-foreground mb-6 ${language === 'ar' ? 'text-right' : ''}`}>
              {course.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'المدرس' : 'Instructeur'}
                  </div>
                  <div className="font-medium">{course.instructor}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'المدة' : 'Durée'}
                  </div>
                  <div className="font-medium">{course.duration}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'المستوى' : 'Niveau'}
                  </div>
                  <div className="font-medium">{course.level}</div>
                </div>
              </div>
            </div>
            
            <Button size="lg">
              {language === 'ar' ? 'التسجيل في البرنامج' : 'S\'inscrire au programme'}
            </Button>
          </div>
          
          <div className={`rounded-xl overflow-hidden ${language === 'ar' ? 'order-1 lg:order-2' : ''}`}>
            <img 
              src={course.image} 
              alt={course.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Contenu du cours - Placeholder */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${language === 'ar' ? 'text-right' : ''}`}>
            {language === 'ar' ? 'محتوى البرنامج' : 'Contenu du programme'}
          </h2>
          
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'محتوى تفصيلي لهذا البرنامج سيكون متاحًا قريبًا.' 
                : 'Le contenu détaillé de ce programme sera disponible prochainement.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
