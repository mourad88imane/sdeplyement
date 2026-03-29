import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, User, Phone, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { RegisterRequest } from '@/services/api';

const SignUp = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { register, loading } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validation du nom d'utilisateur
    if (!formData.username.trim()) {
      newErrors.username = language === 'ar' ? 'اسم المستخدم مطلوب' : 'Le nom d\'utilisateur est requis';
    } else if (formData.username.length < 3) {
      newErrors.username = language === 'ar' ? 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' : 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }

    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Email invalide';
    }

    // Validation du prénom
    if (!formData.first_name.trim()) {
      newErrors.first_name = language === 'ar' ? 'الاسم الأول مطلوب' : 'Le prénom est requis';
    }

    // Validation du nom de famille
    if (!formData.last_name.trim()) {
      newErrors.last_name = language === 'ar' ? 'اسم العائلة مطلوب' : 'Le nom de famille est requis';
    }

    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = language === 'ar' ? 'كلمة المرور مطلوبة' : 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = language === 'ar' ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Le mot de passe doit contenir au moins 8 caractères';
    }

    // Validation de la confirmation du mot de passe
    if (!formData.password_confirm) {
      newErrors.password_confirm = language === 'ar' ? 'تأكيد كلمة المرور مطلوب' : 'La confirmation du mot de passe est requise';
    } else if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const registerData: RegisterRequest = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone || undefined
      };

      const success = await register(registerData);

      if (success) {
        // Marquer comme succès
        setIsSuccess(true);

        // Message de succès plus visible et informatif
        toast({
          title: language === 'ar' ? '🎉 تم إنشاء الحساب بنجاح!' : '🎉 Inscription réussie !',
          description: language === 'ar'
            ? 'مرحباً بك في المدرسة الوطنية للاتصالات! تم إنشاء حسابك بنجاح ويمكنك الآن الوصول إلى جميع الخدمات.'
            : 'Bienvenue à l\'École Nationale des Télécommunications ! Votre compte a été créé avec succès et vous pouvez maintenant accéder à tous nos services.',
          duration: 6000, // Afficher plus longtemps
        });

        // Attendre un peu avant la redirection pour que l'utilisateur voie le message
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        toast({
          title: language === 'ar' ? 'فشل في التسجيل' : 'Échec de l\'inscription',
          description: language === 'ar'
            ? 'حدث خطأ أثناء إنشاء حسابك. يرجى المحاولة مرة أخرى.'
            : 'Une erreur s\'est produite lors de la création de votre compte. Veuillez réessayer.',
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      toast({
        title: language === 'ar' ? 'خطأ' : 'Erreur',
        description: error.message || (language === 'ar'
          ? 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.'
          : 'Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer.'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-4">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-muted/30 rounded-lg p-8 shadow-sm ${language === 'ar' ? 'text-right' : ''}`}
        >
          {/* Header */}
          <div className={`text-center mb-8 ${language === 'ar' ? 'text-right' : ''}`}>
            <div className="flex justify-center mb-4">
              {isSuccess ? (
                <CheckCircle className="h-10 w-10 text-green-600" />
              ) : (
                <BookOpen className="h-10 w-10 text-green-600" />
              )}
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {isSuccess
                ? (language === 'ar' ? '🎉 تم إنشاء الحساب بنجاح!' : '🎉 Inscription réussie !')
                : (language === 'ar' ? 'إنشاء حساب جديد' : 'Créer un compte')
              }
            </h1>
            <p className="text-muted-foreground">
              {isSuccess
                ? (language === 'ar'
                  ? 'مرحباً بك في المدرسة الوطنية للاتصالات! سيتم توجيهك إلى الصفحة الرئيسية قريباً...'
                  : 'Bienvenue à l\'École Nationale des Télécommunications ! Vous allez être redirigé vers la page d\'accueil...'
                )
                : (language === 'ar'
                  ? 'أنشئ حساباً للوصول إلى جميع الميزات'
                  : 'Créez un compte pour accéder à toutes les fonctionnalités'
                )
              }
            </p>
          </div>

          {/* Message de succès */}
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6"
            >
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className={`${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-lg font-semibold text-green-800">
                    {language === 'ar' ? 'تم إنشاء حسابك بنجاح!' : 'Votre compte a été créé avec succès !'}
                  </h3>
                  <p className="text-green-700 mt-1">
                    {language === 'ar'
                      ? 'يمكنك الآن الوصول إلى جميع خدمات المدرسة الوطنية للاتصالات.'
                      : 'Vous pouvez maintenant accéder à tous les services de l\'École Nationale des Télécommunications.'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Form */}
          {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nom d'utilisateur */}
            <div className="space-y-2">
              <label htmlFor="username" className={`text-sm font-medium block ${language === 'ar' ? 'text-right' : ''}`}>
                {language === 'ar' ? 'اسم المستخدم' : 'Nom d\'utilisateur'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <User className={`absolute top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                <Input
                  id="username"
                  name="username"
                  className={`${language === 'ar' ? 'pr-10 text-right' : 'pl-10'} ${errors.username ? 'border-red-500' : ''}`}
                  placeholder={language === 'ar' ? 'اسم_المستخدم' : 'nom_utilisateur'}
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {errors.username && (
                <p className={`text-sm text-red-500 ${language === 'ar' ? 'text-right' : ''}`}>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Prénom et Nom */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="first_name" className={`text-sm font-medium block ${language === 'ar' ? 'text-right' : ''}`}>
                  {language === 'ar' ? 'الاسم الأول' : 'Prénom'}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <User className={`absolute top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                  <Input
                    id="first_name"
                    name="first_name"
                    className={`${language === 'ar' ? 'pr-10 text-right' : 'pl-10'} ${errors.first_name ? 'border-red-500' : ''}`}
                    placeholder={language === 'ar' ? 'أحمد' : 'Jean'}
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.first_name && (
                  <p className={`text-sm text-red-500 ${language === 'ar' ? 'text-right' : ''}`}>
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="last_name" className={`text-sm font-medium block ${language === 'ar' ? 'text-right' : ''}`}>
                  {language === 'ar' ? 'اسم العائلة' : 'Nom de famille'}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <User className={`absolute top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                  <Input
                    id="last_name"
                    name="last_name"
                    className={`${language === 'ar' ? 'pr-10 text-right' : 'pl-10'} ${errors.last_name ? 'border-red-500' : ''}`}
                    placeholder={language === 'ar' ? 'محمد' : 'Dupont'}
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.last_name && (
                  <p className={`text-sm text-red-500 ${language === 'ar' ? 'text-right' : ''}`}>
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className={`text-sm font-medium block ${language === 'ar' ? 'text-right' : ''}`}>
                {language === 'ar' ? 'البريد الإلكتروني' : 'Adresse email'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <Mail className={`absolute top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className={`${language === 'ar' ? 'pr-10 text-right' : 'pl-10'} ${errors.email ? 'border-red-500' : ''}`}
                  placeholder={language === 'ar' ? 'البريد@المثال.com' : 'votre@email.com'}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className={`text-sm text-red-500 ${language === 'ar' ? 'text-right' : ''}`}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <label htmlFor="phone" className={`text-sm font-medium block ${language === 'ar' ? 'text-right' : ''}`}>
                {language === 'ar' ? 'رقم الهاتف' : 'Numéro de téléphone'}
                <span className="text-gray-400 text-sm ml-1">
                  ({language === 'ar' ? 'اختياري' : 'optionnel'})
                </span>
              </label>
              <div className="relative">
                <Phone className={`absolute top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`${language === 'ar' ? 'pr-10 text-right' : 'pl-10'}`}
                  placeholder={language === 'ar' ? '+213 123 456 789' : '+33 1 23 45 67 89'}
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <label htmlFor="password" className={`text-sm font-medium block ${language === 'ar' ? 'text-right' : ''}`}>
                {language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <Lock className={`absolute top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className={`${language === 'ar' ? 'pr-10 text-right' : 'pl-10'} ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {errors.password && (
                <p className={`text-sm text-red-500 ${language === 'ar' ? 'text-right' : ''}`}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirmation du mot de passe */}
            <div className="space-y-2">
              <label htmlFor="password_confirm" className={`text-sm font-medium block ${language === 'ar' ? 'text-right' : ''}`}>
                {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirmer le mot de passe'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <Lock className={`absolute top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                <Input
                  id="password_confirm"
                  name="password_confirm"
                  type="password"
                  className={`${language === 'ar' ? 'pr-10 text-right' : 'pl-10'} ${errors.password_confirm ? 'border-red-500' : ''}`}
                  placeholder="********"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {errors.password_confirm && (
                <p className={`text-sm text-red-500 ${language === 'ar' ? 'text-right' : ''}`}>
                  {errors.password_confirm}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading
                ? (language === 'ar' ? 'جاري التسجيل...' : 'Inscription en cours...')
                : (language === 'ar' ? 'إنشاء الحساب' : 'Créer le compte')
              }
            </Button>
          </form>
          )}

          {/* Sign In Link */}
          {!isSuccess && (
          <div className={`text-center mt-6 ${language === 'ar' ? 'text-right' : ''}`}>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Vous avez déjà un compte ?'}{' '}
              <Link to="/sign-in" className="text-green-600 hover:underline">
                {language === 'ar' ? 'تسجيل الدخول' : 'Se connecter'}
              </Link>
            </p>
          </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;