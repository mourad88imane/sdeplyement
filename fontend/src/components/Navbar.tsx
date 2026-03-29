import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import MegaMenu from '@/components/nav/MegaMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '@/services/api';

interface Banner {
  image_left?: string;
  title?: string;
}

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar = ({ isScrolled }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [, setBanner] = useState<Banner | null>(null);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState<string | null>(null);
  
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  //const { isAuthenticated, user, logout } = useAuth();

  // Fetch Banner Data
  useEffect(() => {
    fetch(`${API_BASE_URL}/banner/active/`)
      .then(res => res.json())
      .then(data => {
        if (data && data.results && data.results.length > 0) {
          setBanner(data.results[0]);
        } else {
          setBanner(null);
        }
      })
      .catch(() => setBanner(null));
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMegaMenu(null);
    setIsHoveringDropdown(null);
  }, [location.pathname]);

  // Lock scroll for mobile menu
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const toggleMegaMenu = (id: string) => {
    setActiveMegaMenu(activeMegaMenu === id ? null : id);
  };

  const navItems = [
    { label: t('home') || 'Home', href: '/', hasDropdown: false },
    { label: t('about') || 'About', hasDropdown: true, dropdownId: 'about' },
    { label: t('formation') || 'Formation', hasDropdown: true, dropdownId: 'formation' },
    { label: t('events') || 'Events', hasDropdown: true, dropdownId: 'events' },
    { label: t('bibliotheque') || 'Library', href: '/bibliotheque' },
    { label: t('lifeStudy') || 'Life & Study', href: '/life-study' },
    { label: t('ohb') || 'OHB', href: '/ohb' },
  ];

  const isItemActive = (item: typeof navItems[0]) => {
    if (item.href) {
      return item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href);
    }
    return false;
  };

  // Animation variants
  const navbarVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  const navItemVariants = {
    hover: {
      backgroundColor: "rgba(232, 201, 122, 0.05)",
      transition: { duration: 0.3 }
    }
  };

  const mobileMenuVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.3 }
  };

  const languageButtonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);


const cancelClose = () => {
  if (closeTimeout.current) {
    clearTimeout(closeTimeout.current);
    closeTimeout.current = null;
  }
};

  return (
    <header
      className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-500",
        "bg-gradient-to-b from-[#133059] to-[#0f2847] border-b border-[#e8c97a]/10",
        isScrolled && "bg-[#133059]/95 backdrop-blur-md shadow-lg border-[#e8c97a]/20"
      )}
    >
      <motion.div
        className="w-full max-w-[1400px] px-6 md:px-10 mx-auto flex items-center justify-between h-20"
        variants={navbarVariants}
        initial="initial"
        animate="animate"
      >
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = isItemActive(item);
            const isOpen = item.hasDropdown && activeMegaMenu === item.dropdownId;
            const isHovering = item.hasDropdown && isHoveringDropdown === item.dropdownId;
            const shouldHighlight = isOpen || isHovering || (isActive && !activeMegaMenu);

            return item.hasDropdown ? (
              <motion.div
                key={item.dropdownId}
                className="relative group"
              >
                <motion.button
                  onClick={() => toggleMegaMenu(item.dropdownId!)}
                  className={cn(
                    "px-5 py-3 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                    "relative group overflow-hidden",
                    shouldHighlight
                      ? "text-[#e8c97a]"
                      : "text-white/70 hover:text-white"
                  )}
                  variants={navItemVariants}
                  whileHover="hover"
                >
                  {/* Background gradient effect */}
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    "bg-gradient-to-r from-[#e8c97a]/5 to-transparent"
                  )} />
                  
                  <span className="relative z-10">{item.label}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>

                  {/* Bottom border indicator */}
                  {shouldHighlight && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#e8c97a] to-transparent"
                      layoutId="navIndicator"
                    />
                  )}
                </motion.button>
              </motion.div>
            ) : (
              <Link
                key={item.label}
                to={item.href!}
                className={cn(
                  "px-5 py-3 rounded-lg text-sm font-semibold transition-all relative group overflow-hidden",
                  isActive
                    ? "text-[#e8c97a]"
                    : "text-white/70 hover:text-white"
                )}
              >
                {/* Background gradient effect */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  "bg-gradient-to-r from-[#e8c97a]/5 to-transparent"
                )} />
                
                <span className="relative z-10">{item.label}</span>

                {/* Bottom border indicator */}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#e8c97a] to-transparent"
                    layoutId="navIndicator"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side - Language Switcher & Auth & Mobile Menu Button */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Sign In / User Menu 
          {isAuthenticated ? (
            <motion.div
              className="relative flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={() => navigate('/profile')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#e8c97a] text-[#133059] font-semibold text-sm hover:bg-[#d4b06a] transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="max-w-[120px] truncate">{user?.first_name || user?.username}</span>
              </button>
              <button
                onClick={async () => { await logout(); navigate('/'); }}
                className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm"
                title={language === 'ar' ? 'تسجيل الخروج' : language === 'en' ? 'Logout' : 'Déconnexion'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/sign-in"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-[#e8c97a] text-[#e8c97a] font-semibold text-sm hover:bg-[#e8c97a] hover:text-[#133059] transition-colors"
              >
                <LogIn className="w-4 h-4" />
                {language === 'ar' ? 'تسجيل الدخول' : language === 'en' ? 'Sign In' : 'Connexion'}
              </Link>
            </motion.div>
          )}*/}

          {/* Language Switcher - Desktop */}
          <motion.div
            className="hidden sm:flex gap-1 rounded-lg p-1.5 bg-white/5 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {(['fr', 'ar', 'en'] as const).map((l) => (
              <motion.button
                key={l}
                onClick={() => setLanguage(l)}
                variants={languageButtonVariants}
                whileHover="hover"
                whileTap="tap"
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-300",
                  "relative overflow-hidden",
                  language === l
                    ? "text-[#133059] bg-[#e8c97a] shadow-lg shadow-[#e8c97a]/20"
                    : "text-white/60 hover:text-white/80 hover:bg-white/5"
                )}
              >
                <span className="relative z-10">{l.toUpperCase()}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-lg hover:bg-white/5 transition-colors text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      {/* Desktop Mega Menus Dropdown */}
      <AnimatePresence>
        {activeMegaMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute w-full left-0 right-0 top-full"
            onMouseEnter={cancelClose}
           // onMouseLeave={() => {
            //  setActiveMegaMenu(null);
            //  setIsHoveringDropdown(null);
           // }
         //</AnimatePresence> }
          >
           {/* <MegaMenu id={activeMegaMenu} onClose={() => setActiveMegaMenu(null)} />*/}
            <MegaMenu id={activeMegaMenu} onClose={() => {
        cancelClose();
        setActiveMegaMenu(null);
        setIsHoveringDropdown(null);
      }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden bg-gradient-to-b from-[#133059] to-[#0f2847] border-t border-[#e8c97a]/10"
            variants={mobileMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="px-6 py-6 space-y-3 max-h-[calc(100vh-80px)] overflow-y-auto">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.hasDropdown ? (
                    <button
                      onClick={() => toggleMegaMenu(item.dropdownId!)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-lg text-base font-semibold transition-all flex items-center justify-between",
                        "hover:bg-[#e8c97a]/10 group",
                        activeMegaMenu === item.dropdownId ? "text-[#e8c97a] bg-[#e8c97a]/5" : "text-white/80"
                      )}
                    >
                      <span>{item.label}</span>
                      <motion.span
                        animate={{ rotate: activeMegaMenu === item.dropdownId ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.span>
                    </button>
                  ) : (
                    <Link
                      to={item.href!}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-lg text-base font-semibold transition-all",
                        "hover:bg-[#e8c97a]/10",
                        isItemActive(item) ? "text-[#e8c97a] bg-[#e8c97a]/5" : "text-white/80"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Mobile Mega Menu */}
                  <AnimatePresence>
                    {item.hasDropdown && activeMegaMenu === item.dropdownId && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 bg-white/5 rounded-lg overflow-hidden"
                      >
                        <MegaMenu id={item.dropdownId!} onClose={() => setActiveMegaMenu(null)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Mobile Language Switcher */}
              <motion.div
                className="mt-6 pt-6 border-t border-white/10 flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: navItems.length * 0.05 }}
              >
                {(['fr', 'ar', 'en'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLanguage(l);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all",
                      language === l
                        ? "text-[#133059] bg-[#e8c97a]"
                        : "text-white/60 bg-white/5 hover:bg-white/10"
                    )}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </motion.div>

              {/* Mobile Sign In / User Button 
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                >
                  <button
                    onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#e8c97a] text-[#133059] font-semibold"
                  >
                    <User className="w-5 h-5" />
                    <span>{user?.first_name || user?.username}</span>
                  </button>
                  <button
                    onClick={async () => { await logout(); navigate('/'); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-lg text-white/70 hover:bg-white/10"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{language === 'ar' ? 'تسجيل الخروج' : language === 'en' ? 'Logout' : 'Déconnexion'}</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                >
                  <Link
                    to="/sign-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-[#e8c97a] text-[#e8c97a] font-semibold"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>{language === 'ar' ? 'تسجيل الدخول' : language === 'en' ? 'Sign In' : 'Connexion'}</span>
                  </Link>
                </motion.div>
              )}*/}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top accent line */}
      {isScrolled && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#e8c97a] via-[#e8c97a]/50 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: "left" }}
        />
      )}
    </header>
  );
};

export default Navbar;
