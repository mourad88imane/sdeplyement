import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeadBanner from '@/components/HeadBanner';
import { useLanguage } from '@/context/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { language } = useLanguage();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply direction based on language (RTL for Arabic)
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);

    // Set RTL direction for Arabic
    if (language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.body.classList.add('rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.body.classList.remove('rtl');
    }
  }, [language]);

  return (
    <div className="flex min-h-screen flex-col">
      <HeadBanner />
      <Navbar isScrolled={isScrolled} />
      <main className="flex-1 w-full max-w-full overflow-x-hidden bg-muted/30">
        {children}
      </main>

      
      <Footer />
    </div>
  );
};

export default Layout;