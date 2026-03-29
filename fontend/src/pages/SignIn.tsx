import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Lock, User, ArrowRight, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';

import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { LoginRequest } from '@/services/api';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { login, loading } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const searchParams = new URLSearchParams(location.search);
  const nextUrl = searchParams.get('next') || '/';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = language === 'ar' ? 'اسم المستخدم أو البريد الإلكتروني مطلوب' : 'Nom d\'utilisateur ou email requis';
    }

    if (!formData.password) {
      newErrors.password = language === 'ar' ? 'كلمة المرور مطلوبة' : 'Mot de passe requis';
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
      const loginData: LoginRequest = {
        username: formData.username,
        password: formData.password
      };

      const success = await login(loginData);

      if (success) {
        toast({
          title: language === 'ar' ? '✅ مرحباً بعودتك!' : '✅ Connexion réussie !',
          description: language === 'ar'
            ? 'تم تسجيل دخولك بنجاح. مرحباً بعودتك إلى المدرسة الوطنية للاتصالات!'
            : 'Vous êtes connecté avec succès. Bon retour à l\'École Nationale des Télécommunications !',
          duration: 4000,
        });

        setTimeout(() => {
          navigate(nextUrl);
        }, 1500);
      } else {
        toast({
          title: language === 'ar' ? 'فشل في تسجيل الدخول' : 'Échec de la connexion',
          description: language === 'ar'
            ? 'اسم المستخدم أو كلمة المرور غير صحيحة'
            : 'Nom d\'utilisateur ou mot de passe incorrect',
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      toast({
        title: language === 'ar' ? 'خطأ' : 'Erreur',
        description: error.message || (language === 'ar'
          ? 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.'
          : 'Une erreur s\'est produite lors de la connexion. Veuillez réessayer.'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 bg-gradient-to-br from-white via-[#133059]/2 to-[#e8c97a]/5 relative overflow-hidden">
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

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Logo & Header */}
          <motion.div variants={itemVariants} className={`text-center ${language === 'ar' ? 'text-right' : ''}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#133059] shadow-lg mb-6">
              <BookOpen className="h-8 w-8 text-[#e8c97a]" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[#133059] mb-3 leading-tight">
              {language === 'ar' ? 'مرحباً بك' : 'Bienvenue'}
            </h1>

            <p className="text-[#133059]/70 text-lg max-w-sm mx-auto">
              {language === 'ar'
                ? 'تسجيل الدخول إلى مدرستك الوطنية للاتصالات'
                : 'Connectez-vous à votre école nationale des télécommunications'
              }
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username/Email Field */}
              <motion.div
                variants={itemVariants}
                className="space-y-2.5"
              >
                <label htmlFor="username" className="text-sm font-semibold text-[#133059] block">
                  {language === 'ar' ? 'اسم المستخدم أو البريد الإلكتروني' : 'Nom d\'utilisateur ou Email'}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative group">
                  <User className={`absolute top-1/2 transform -translate-y-1/2 text-[#133059]/50 h-5 w-5 ${language === 'ar' ? 'right-4' : 'left-4'} transition-colors group-focus-within:text-[#e8c97a]`} />
                  <Input
                    id="username"
                    name="username"
                    className={`${language === 'ar' ? 'pr-12 text-right' : 'pl-12'} h-11 border-[#133059]/20 focus:border-[#e8c97a] focus:ring-[#e8c97a]/30 text-[#133059] placeholder:text-[#133059]/40 ${errors.username ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder={language === 'ar' ? 'اسم_المستخدم@مثال.com' : 'utilisateur@exemple.com'}
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-sm text-red-500 font-medium ${language === 'ar' ? 'text-right' : ''}`}
                  >
                    {errors.username}
                  </motion.p>
                )}
              </motion.div>

              {/* Password Field */}
              <motion.div
                variants={itemVariants}
                className="space-y-2.5"
              >
                <label htmlFor="password" className="text-sm font-semibold text-[#133059] block">
                  {language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative group">
                  <Lock className={`absolute top-1/2 transform -translate-y-1/2 text-[#133059]/50 h-5 w-5 ${language === 'ar' ? 'right-4' : 'left-4'} transition-colors group-focus-within:text-[#e8c97a]`} />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className={`${language === 'ar' ? 'pr-12 text-right' : 'pl-12'} h-11 border-[#133059]/20 focus:border-[#e8c97a] focus:ring-[#e8c97a]/30 text-[#133059] placeholder:text-[#133059]/40 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-sm text-red-500 font-medium ${language === 'ar' ? 'text-right' : ''}`}
                  >
                    {errors.password}
                  </motion.p>
                )}
                <div className={`flex justify-end ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <motion.a
                    href="/forgot-password"
                    className="text-sm font-semibold text-[#133059] hover:text-[#e8c97a] transition-colors"
                    whileHover={{ x: language === 'ar' ? -2 : 2 }}
                  >
                    {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Mot de passe oublié ?'}
                  </motion.a>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="pt-4">
                <motion.button
                  type="submit"
                  disabled={isSubmitting || loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-11 bg-[#133059] hover:bg-[#0a2342] text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#133059]/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting || loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      </motion.div>
                      <span>{language === 'ar' ? 'جاري التحقق...' : 'Vérification...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'ar' ? 'تسجيل الدخول' : 'Se connecter'}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-slate-500 font-medium">
                  {language === 'ar' ? 'أو' : 'ou'}
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <motion.div variants={itemVariants} className={`text-center ${language === 'ar' ? 'text-right' : ''}`}>
              <p className="text-sm text-slate-600">
                {language === 'ar' ? 'ليس لديك حساب؟' : 'Vous n\'avez pas de compte ?'}{' '}
                <Link
                  to="/sign-up"
                  className="font-bold text-[#133059] hover:text-[#e8c97a] transition-colors"
                >
                  {language === 'ar' ? 'إنشاء حساب جديد' : 'Créer un compte'}
                </Link>
              </p>
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-6 text-xs text-[#133059]/60 font-medium"
          >
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#e8c97a]" />
              <span>{language === 'ar' ? 'آمن تماماً' : 'Sécurisé'}</span>
            </div>
            <div className="w-px h-4 bg-[#133059]/20"></div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#e8c97a]" />
              <span>{language === 'ar' ? 'مشفر' : 'Chiffré'}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;
