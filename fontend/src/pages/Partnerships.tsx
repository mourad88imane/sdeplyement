import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { PartnershipAPI, Partnership, getImageUrl } from '@/services/api';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Handshake, Award, Users, ArrowRight } from 'lucide-react';


const Partnerships = () => {
  const { language } = useLanguage();
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartnerships = async () => {
      try {
        setLoading(true);
        const data = await PartnershipAPI.getPartnerships();
        const partnershipsArray = Array.isArray(data) ? data : [];
        setPartnerships(partnershipsArray);
        setError(null);
      } catch (err) {
        console.error('Error fetching partnerships:', err);
        setError(language === 'ar' ? 'فشل تحميل الشراكات' : language === 'en' ? 'Failed to load partnerships' : 'Erreur lors du chargement des partenariats');
        setPartnerships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerships();
  }, [language]);


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
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* BACKGROUND DECORATIONS */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background: `
            radial-gradient(circle at 15% 25%, rgba(19, 48, 89, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 85% 75%, rgba(232, 201, 122, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(19, 48, 89, 0.05) 0%, transparent 80%)
          `,
        }}
      />

      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue via-gold to-blue opacity-30" />

      {/* HERO BANNER */}
      <section className="relative z-10 pt-24 pb-16 px-6 md:px-10 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue/20 bg-blue/5 backdrop-blur-sm hover:bg-blue/10 transition-colors mb-6"
          >
            <Handshake className="w-4 h-4 text-gold animate-pulse" />
            <span className="text-blue text-xs font-bold uppercase tracking-widest">
              {language === 'ar' ? '🤝 الشراكات الاستراتيجية' : language === 'en' ? '🤝 Strategic Partnerships' : '🤝 Partenariats Stratégiques'}
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-blue leading-[1.15] mb-6">
            {language === 'ar' ? 'شراكاتنا' : language === 'en' ? 'Our Partnerships' : 'Nos Partenariats'}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-gold to-blue rounded-full mx-auto mb-6" />
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'نتعاون مع المؤسسات والشركات الرائدة لتوفير أفضل الفرص التدريبية والمهنية لطلابنا'
              : language === 'en'
              ? 'We collaborate with leading institutions and companies to provide our students with exceptional training and career opportunities'
              : 'Nous collaborons avec les meilleures institutions et entreprises pour offrir à nos étudiants des opportunités de formation et de carrière exceptionnelles'}
          </p>
        </motion.div>
      </section>

      {/* STATS SECTION */}
      <section className="relative z-10 py-12 px-6 md:px-10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Stat 1 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-md border border-blue/10 hover:border-gold/30 transition-all hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue/10 to-gold/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Handshake className="w-8 h-8 text-blue" />
                </div>
                <div>
                  <p className="text-4xl font-serif font-bold text-blue">{partnerships.length}+</p>
                  <p className="text-slate-600 text-sm font-semibold uppercase tracking-widest mt-1">
                    {language === 'ar' ? 'شريك استراتيجي' : language === 'en' ? 'Strategic Partners' : 'Partenaires stratégiques'}
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Stat 2 */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-md border border-blue/10 hover:border-gold/30 transition-all hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gold/10 to-blue/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 text-gold" />
                </div>
                <div>
                  <p className="text-4xl font-serif font-bold text-blue">15+</p>
                  <p className="text-slate-600 text-sm font-semibold uppercase tracking-widest mt-1">
                    {language === 'ar' ? 'سنوات الخبرة' : language === 'en' ? "Years of Experience" : "Années d'expérience"}
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Stat 3 */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-md border border-blue/10 hover:border-gold/30 transition-all hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue/10 to-gold/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-8 h-8 text-blue" />
                </div>
                <div>
                  <p className="text-4xl font-serif font-bold text-blue">500+</p>
                  <p className="text-slate-600 text-sm font-semibold uppercase tracking-widest mt-1">
                    {language === 'ar' ? 'خريج ناجح' : language === 'en' ? 'Successful Graduates' : 'Diplômés employés'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PARTNERSHIPS GRID */}
      <section className="relative z-10 py-16 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-serif font-bold text-blue mb-2">
              {language === 'ar' ? 'شركاؤنا الاستراتيجيون' : language === 'en' ? 'Our Strategic Partners' : 'Nos Partenaires Stratégiques'}
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-gold to-blue rounded-full" />
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-blue/20 border-t-blue rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white/50 rounded-2xl border-2 border-red-200">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          ) : partnerships.length === 0 ? (
            <div className="text-center py-20 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-blue/10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue/10 to-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-10 h-10 text-blue/30" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-blue mb-2">
                {language === 'ar' ? 'لا توجد شراكات بعد' : language === 'en' ? 'No Partnerships Yet' : 'Aucun partenariat pour le moment'}
              </h3>
              <p className="text-slate-600">
                {language === 'ar' 
                  ? 'نحن نعمل على بناء شراكات جديدة. تابعونا!'
                  : language === 'en'
                  ? 'We are building new partnerships. Stay connected!'
                  : 'Nous travaillons à établir de nouvelles collaborations. Restez connectés!'}
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {partnerships.map((partner) => (
                <motion.div
                  key={partner.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-md border border-blue/10 hover:border-gold/30 transition-all hover:shadow-xl group"
                >
                  <div className="aspect-square relative mb-4 bg-gradient-to-br from-blue/5 to-gold/5 rounded-xl overflow-hidden flex items-center justify-center p-4">
                    {partner.logo ? (
                      <img 
                        src={getImageUrl(partner.logo)} 
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <Handshake className="w-12 h-12 text-blue/30" />
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-blue text-center mb-2">
                    {partner.name}
                  </h3>
                  {partner.description && (
                    <p className="text-xs text-slate-600 text-center line-clamp-2 mb-3 leading-relaxed">
                      {partner.description}
                    </p>
                  )}
                  {partner.website && (
                    <a 
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 mt-3 text-blue hover:text-gold transition-colors text-xs font-bold uppercase tracking-widest group/link"
                    >
                      {language === 'ar' ? 'زيارة الموقع' : language === 'en' ? 'Visit Website' : 'Visiter le site'}
                      <ExternalLink className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 py-16 px-6 md:px-10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-gradient-to-r from-blue to-blue/80 rounded-3xl p-8 md:p-12 text-white text-center shadow-xl border border-gold/30"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              {language === 'ar' ? 'هل تريد أن تصبح شريكاً؟' : language === 'en' ? 'Become a Partner?' : 'Vous souhaitez devenir partenaire?'}
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              {language === 'ar' 
                ? 'انضم إلى شبكتنا من الشركاء ووفر لطلابك فرص تدريب ووظائف متميزة'
                : language === 'en'
                ? 'Join our network of partners and provide your students with exceptional training and employment opportunities'
                : "Rejoignez notre réseau de partenaires et offrez à vos étudiants des opportunités de stage et d'emploi exceptionnelles"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-blue font-bold text-sm hover:bg-gold/20 transition-all duration-300 shadow-lg hover:shadow-white/30"
              >
                {language === 'ar' ? 'تواصل معنا' : language === 'en' ? 'Contact Us' : 'Contactez-nous'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white text-white font-bold text-sm hover:bg-white/10 transition-all duration-300"
              >
                {language === 'ar' ? 'معرفة المزيد عنا' : language === 'en' ? 'Learn More' : 'En savoir plus sur nous'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Back Button */}
      <section className="relative z-10 py-8 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <Link 
            to="/about" 
            className="inline-flex items-center gap-2 text-blue hover:text-gold transition-colors font-semibold group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {language === 'ar' ? 'العودة إلى حولنا' : language === 'en' ? 'Back to About' : "Retour à l'accueil à propos"}
          </Link>
        </div>
      </section>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none opacity-30" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue/20 rounded-full blur-3xl pointer-events-none opacity-20" />
    </div>
  );
};

export default Partnerships;
