import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

/* ── Custom Fax Icon (lucide-react style) ── */
const Fax = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M5 12h10" />
    <path d="M5 16h10" />
    <path d="M5 20h10" />
  </svg>
);

/* ── Footer-specific translations (AR / FR / EN) ── */

type Language = 'en' | 'fr' | 'ar';

const footerTranslations: Record<string, Record<Language, string>> = {
  schoolLine1: {
    en: 'National School of',
    fr: 'École Nationale des',
    ar: 'المدرسة الوطنية',
  },
  schoolLine2: {
    en: 'Transmissions',
    fr: 'Transmissions',
    ar: 'للمواصلات السلكية و اللاسلكية',
  },
  description: {
    en: 'An institution dedicated to excellence, innovation, and advancing the future of communications.',
    fr: "Une institution dédiée à l'excellence, l'innovation et l'avancement de l'avenir des communications.",
    ar: 'مؤسسة مكرسة للتميز والابتكار والنهوض بمستقبل الاتصالات.',
  },
  address: {
    en: '16 Hales Said Street, El Mouradia, Algiers',
    fr: '16 rue Hales Said, El Mouradia, Alger',
    ar: '16 شارع حالس السعيد، المرادية، الجزائر',
  },
  home: { en: 'Home', fr: 'Accueil', ar: 'الرئيسية' },
  aboutUs: { en: 'About Us', fr: 'À propos', ar: 'من نحن' },
  formation: { en: 'Formation', fr: 'Formation', ar: 'التكوين' },
  studentLife: { en: 'Student Life', fr: 'Vie Étudiante', ar: 'الحياة الطلابية' },
  library: { en: 'Library', fr: 'Bibliothèque', ar: 'المكتبة' },
  ohb: { en: 'OHB', fr: 'OHB', ar: 'OHB' },
  academicCalendar: { en: 'Academic Calendar', fr: 'Calendrier Académique', ar: 'التقويم الأكاديمي' },
  newsEvents: { en: 'News & Events', fr: 'Actualités & Événements', ar: 'الأخبار والفعاليات' },
  careers: { en: 'Careers', fr: 'Carrières', ar: 'الوظائف' },
  support: { en: 'Support', fr: 'Support', ar: 'الدعم' },
  faq: { en: 'FAQ', fr: 'FAQ', ar: 'الأسئلة الشائعة' },
  contactUs: { en: 'Contact Us', fr: 'Contactez-nous', ar: 'اتصل بنا' },
  
  emailPlaceholder: {
    en: 'Your email address',
    fr: 'Votre adresse e-mail',
    ar: 'بريدك الإلكتروني',
  },
  followUs: { en: 'Follow Us', fr: 'Suivez-nous', ar: 'تابعنا' },
  createdBy: {
    en: 'Designed & developed by',
    fr: 'Conçu et développé par',
    ar: 'تصميم وتطوير بواسطة',
  },
  supervisedBy: {
    en: 'Head of Projects',
    fr: 'Responsable des Projets',
    ar: 'رئيسة المشاريع',
  },
};

/* ── Animation variants (matching Navbar) ── */

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ── Component ── */

const Footer = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const lang = (language ?? 'en') as Language;

  const ft = (key: string): string =>
    footerTranslations[key]?.[lang] ?? footerTranslations[key]?.en ?? key;

  const quickLinks = [
    { href: '/', label: ft('home') },
    { href: '/about', label: ft('aboutUs') },
    { href: '/formation', label: ft('formation') },
    { href: '/life-study', label: ft('studentLife') },
    { href: '/bibliotheque', label: ft('library') },
    { href: '/ohb', label: ft('ohb') },
  ];

  const resourceLinks = [
   
    { href: '/Events', label: ft('newsEvents') },
    { href: '/contact', label: ft('contactUs') },
  ];

  const socialLinks = [
    { icon: <Facebook className="h-3.5 w-3.5" />, label: 'Facebook' },
    { icon: <Twitter className="h-3.5 w-3.5" />, label: 'Twitter' },
    { icon: <Instagram className="h-3.5 w-3.5" />, label: 'Instagram' },
    { icon: <Linkedin className="h-3.5 w-3.5" />, label: 'LinkedIn' },
    { icon: <Youtube className="h-3.5 w-3.5" />, label: 'YouTube' },
  ];

  

  

  return (
    <footer
      className={cn(
        'relative text-white w-full overflow-hidden',
        'bg-gradient-to-b from-[#133059] to-[#0f2847]',
        isRtl && 'rtl'
      )}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top accent line — matches Navbar gold accent */}
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#e8c97a]/60 to-transparent" />

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 pt-16 pb-10"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        {/* ── Top section: Brand + Map ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-14">
           {/* Brand block */}
           <motion.div
             className="relative lg:col-span-1 flex flex-col justify-between"
             variants={fadeInUp}
           >
            
             
             <div
               className="absolute inset-0 opacity-[0.03] pointer-events-none"
               style={{
                 //backgroundImage: 'url(/images/logo.jpg), radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                 backgroundSize: 'cover, 40px 40px',
                 backgroundPosition: 'center, 0 0',
                 backgroundRepeat: 'no-repeat, repeat',
               }}
             />
             <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0 bg-[#e8c97a]/10 border border-[#e8c97a]/20">
                  <img
                    src="/images/logo.jpg"
                    alt="Campus ENT"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs tracking-[0.2em] uppercase text-[#e8c97a]/70 font-medium leading-none mb-0.5">
                    {ft('schoolLine1')}
                  </div>
                  <div className="text-base font-bold tracking-wide text-white leading-none">
                    {ft('schoolLine2')}
                  </div>
                </div>
              </div>

              <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
                {ft('description')}
              </p>
            </div>

            <div className="space-y-3">
              <ContactItem
                icon={<MapPin className="h-3.5 w-3.5" />}
                text={ft('address')}
              />
              <ContactItem
                icon={<Phone className="h-3.5 w-3.5" />}
                text="+213 23 48 83 81"
              />
              <ContactItem
                icon={<Fax className="h-3.5 w-3.5" />}
                text="+213 23 48 83 82"
              />
              <ContactItem
                icon={<Mail className="h-3.5 w-3.5" />}
                text="contact@ent-dz.com"
              />
            </div>
          </motion.div>

          {/* Map */}
          <motion.div className="lg:col-span-2" variants={fadeInUp}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-3.5 w-3.5 text-[#e8c97a]" />
              <span className="text-xs tracking-[0.15em] uppercase text-[#e8c97a]/70 font-medium">
                {t('ourLocation')}
              </span>
            </div>
            <div
              className="rounded-lg overflow-hidden w-full border border-[#e8c97a]/10"
              style={{
                height: '180px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.0775261174495!2d3.050799976103064!3d36.74471017226301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb27f3bc56e6b%3A0xb7038b1b67ca27c5!2sNational%20School%20Of%20Transmissions!5e0!3m2!1sen!2sdz!4v1765658061039!5m2!1sen!2sdz"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(40%) contrast(1.1)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${ft('schoolLine1')} ${ft('schoolLine2')}`}
              />
            </div>
          </motion.div>
        </div>

        {/* Divider — gold tinted like Navbar borders */}
        <div className="w-full h-px mb-14 bg-gradient-to-r from-transparent via-[#e8c97a]/20 to-transparent" />

        {/* ── Links + Newsletter ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Quick Links */}
          <motion.div variants={staggerContainer}>
            <SectionLabel>{t('quickLinks')}</SectionLabel>
            <motion.ul className="space-y-2.5" variants={staggerContainer}>
              {quickLinks.map(({ href, label }) => (
                <motion.li key={href} variants={staggerItem}>
                  <FooterLink href={href} label={label} isRtl={isRtl} />
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={staggerContainer}>
            <SectionLabel>{t('resources')}</SectionLabel>
            <motion.ul className="space-y-2.5" variants={staggerContainer}>
              {resourceLinks.map(({ href, label }) => (
                <motion.li key={href} variants={staggerItem}>
                  <FooterLink href={href} label={label} isRtl={isRtl} />
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div className="sm:col-span-2" variants={fadeInUp}>
            
            

            {/* Social */}
            <div className="mt-8">
              <SectionLabel>{ft('followUs')}</SectionLabel>
              <div className="flex gap-2.5 mt-3">
                {socialLinks.map(({ icon, label }) => (
                  <motion.a
                    key={label}
                    href="#"
                    aria-label={label}
                    className={cn(
                      'h-8 w-8 rounded-lg flex items-center justify-center',
                      'text-white/60 transition-all duration-300',
                      'bg-white/5 border border-white/10',
                      'hover:bg-[#e8c97a]/10 hover:border-[#e8c97a]/25 hover:text-[#e8c97a]'
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[#e8c97a]/10"
          variants={fadeInUp}
        >
          <p className="text-white/35 text-xs tracking-wide">{t('copyright')}</p>

          {/* Creator credit */}
          <div className="flex flex-col items-center md:items-end gap-1.5">
            <p className="text-white/30 text-xs tracking-wide flex items-center gap-1.5 flex-wrap justify-center md:justify-end">
              {ft('createdBy')}{' '}
              <a
                href="https://www.linkedin.com/in/ben-moussa-imane"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#e8c97a]/60 hover:text-[#e8c97a] transition-colors duration-200 font-semibold"
              >
                <Linkedin className="h-3 w-3" />
                BEN MOUSSA Imane
              </a>
            </p>
            <p className="text-white/25 text-xs tracking-wide flex items-center gap-1.5 flex-wrap justify-center md:justify-end">
              <span className="text-[#e8c97a]/30">{ft('supervisedBy')}</span>
              <span className="text-white/40 font-semibold">Mme N. Sehili</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

/* ── Helper components ── */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="h-px w-4 rounded-full bg-gradient-to-r from-[#e8c97a]/60 to-transparent" />
    <h3 className="text-xs tracking-[0.18em] uppercase font-semibold text-[#e8c97a]/70">
      {children}
    </h3>
  </div>
);

const ContactItem = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <div className="flex items-start gap-2.5">
    <span className="text-[#e8c97a]/50 mt-0.5 shrink-0">{icon}</span>
    <span className="text-white/45 text-xs leading-relaxed" dir="ltr">{text}</span>
  </div>
);

const FooterLink = ({
  href,
  label,
  isRtl,
}: {
  href: string;
  label: string;
  isRtl: boolean;
}) => (
  <Link
    to={href}
    className={cn(
      'group flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-semibold transition-all duration-200',
      'hover:bg-[#e8c97a]/5 rounded-lg px-3 py-1.5 -mx-3'
    )}
  >
    <span
      className={cn(
        'h-px w-0 group-hover:w-3 transition-all duration-200 rounded-full shrink-0 bg-[#e8c97a]',
        isRtl && 'order-last'
      )}
    />
    {label}
  </Link>
);

export default Footer;
