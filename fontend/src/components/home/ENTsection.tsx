import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Network, Shield, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';

const ENTsection: React.FC = () => {
  const { t, language } = useLanguage();

  // ✨ ANIMATIONS COHÉRENTES AVEC HEROSECTION
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const features = [
    {
      icon: <Network className="h-6 w-6 text-[#e8c97a]" />,
      title: t('entFeatureNetworks'),
      description: t('entFeatureNetworksDesc'),
    },
    {
      icon: <Shield className="h-6 w-6 text-[#e8c97a]" />,
      title: t('entFeatureCyber'),
      description: t('entFeatureCyberDesc'),
    },
    {
      icon: <Cpu className="h-6 w-6 text-[#e8c97a]" />,
      title: t('entFeatureTech'),
      description: t('entFeatureTechDesc'),
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-[#e8c97a]" />,
      title: t('entFeatureIntegration'),
      description: t('entFeatureIntegrationDesc'),
    },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* ✨ BACKGROUND DECORATIONS - COHÉRENT AVEC HEROSECTION */}
      <div className="absolute inset-0">
        {/* Background Image with Premium Overlay */}
        <img
          src="/images/ent.jpg"
          alt="Campus ENT"
          className="w-full h-full object-cover"
        />
        {/* Premium gradient overlay - cohérent avec HeroSection */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue/95 via-blue/85 to-blue-dark/90" />
        
        {/* Decorative orbs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* ✨ LEFT CONTENT - COHÉRENT AVEC HEROSECTION */}
          <motion.div className="text-center lg:text-left">
            {/* Badge - IDENTIQUE À HEROSECTION */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e8c97a]/30 bg-[#e8c97a]/10 backdrop-blur-sm hover:bg-[#e8c97a]/15 transition-colors mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#e8c97a] animate-pulse" />
              <span className="text-[#e8c97a] text-xs font-bold uppercase tracking-widest">
                🎓 {t('entBadge')}
              </span>
            </motion.div>

            {/* Main Title - IDENTIQUE À HEROSECTION */}
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-[1.1]"
            >
              {t('entSubtitle') }
            </motion.h2>

            {/* Decorative line - IDENTIQUE À HEROSECTION */}
            <motion.div 
              variants={itemVariants}
              className="h-1 w-20 bg-gradient-to-r from-[#e8c97a] to-[#133059] rounded-full mb-6 lg:ml-0 mx-auto lg:mx-0"
            />

            {/* Description - IDENTIQUE À HEROSECTION */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-xl leading-relaxed"
            >
              {t('entDescription') }
            </motion.p>

            {/* Features List */}
            <motion.div
              variants={itemVariants}
              className="space-y-3 mb-10"
            >
              {[
                t('entFeature1'),
                t('entFeature2'),
                t('entFeature3'),
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#e8c97a] flex-shrink-0" />
                  <span className="text-white/90 font-medium">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Button - COHÉRENT AVEC HEROSECTION */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
               <Link
                 to="/formation/best-courses"
                 className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#e8c97a] text-[#133059] font-black text-lg hover:shadow-2xl hover:shadow-[#e8c97a]/30 transition-all duration-300 hover:scale-105 active:scale-95"
               >
                 {t('entCta') || (language === 'ar' ? 'ابدأ التدريب' : 'Commencer')}
                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Link>
              
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-[#e8c97a]/50 text-[#e8c97a] font-bold hover:border-[#e8c97a] hover:bg-[#e8c97a]/10 transition-all duration-300"
              >
                {t('entLearnMore')}
              </Link>
            </motion.div>
          </motion.div>

          {/* ✨ RIGHT CONTENT - FEATURES GRID - COHÉRENT AVEC HEROSECTION */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-[#e8c97a]/20 hover:border-[#e8c97a]/40 hover:bg-white/15 transition-all duration-300"
              >
                {/* Icon Container */}
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 bg-gradient-to-br from-[#e8c97a]/30 to-[#e8c97a]/10 rounded-xl flex items-center justify-center mb-4 group-hover:from-[#e8c97a]/40 group-hover:to-[#e8c97a]/20 transition-all"
                >
                  {feature.icon}
                </motion.div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#e8c97a] transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-white/80 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Arrow indicator 
                <div className="mt-4 flex items-center gap-2 text-[#e8c97a] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-semibold uppercase">Découvrir</span>
                  <ArrowRight className="w-4 h-4" />
                </div>*/}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ✨ STATS BAR - COHÉRENT AVEC HEROSECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: '500+', label: language === 'ar' ? 'متدرب' : 'Apprenants' },
            { value: '50+', label: language === 'ar' ? 'دورة تدريبية' : 'Cours' },
            { value: '98%', label: language === 'ar' ? 'معدل الرضا' : 'Satisfaction' },
            { value: '24/7', label: language === 'ar' ? 'دعم فني' : 'Support' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur border border-[#e8c97a]/20 rounded-xl p-4 text-center hover:bg-white/10 transition-all"
            >
              <p className="text-2xl md:text-3xl font-black text-[#e8c97a] mb-1">{stat.value}</p>
              <p className="text-sm text-white/70 font-semibold uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ENTsection;
