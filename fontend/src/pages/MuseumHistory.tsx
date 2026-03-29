import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useCallback, useMemo } from 'react';
import {
  ArrowLeft,
  Radio,
  Mail,
  Phone,
  Wifi,
  Smartphone,
  Globe,
  Cpu,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MuseumHistory = () => {
  const { language: lang } = useLanguage();
  const isRtl = lang === 'ar';

  const t = useCallback(
    (ar: string, fr: string, en: string) =>
      lang === 'ar' ? ar : lang === 'en' ? en : fr,
    [lang],
  );

  const texts = useMemo(
    () => ({
      pageTitle: t(
        'تاريخ الاتصالات',
        'Histoire des transmissionss',
        'History of transmissionss',
      ),
      pageSubtitle: t(
        'اكتشف تطور تقنيات الاتصال من أول أجهزة التلغراف إلى الشبكات الحديثة',
        "Decouvrez l'evolution des technologies de communication depuis les premiers telegraphes jusqu'aux reseaux modernes.",
        'Discover the evolution of communication technologies from the first telegraphs to modern networks.',
      ),
      introTitle: t(
        'رحلة عبر الزمن',
        'Un Voyage a Travers le Temps',
        'A Journey Through Time',
      ),
      introText: t(
        'يعد قسم تاريخ الاتصالات نافذة على التطور المذهل لتقنيات الاتصال عبر القرون. من التلغراف الكهربائي إلى شبكات الجيل الخامس، شهدنا تحولات جذرية في طريقة تواصل البشر.',
        "La section histoire des transmissionss offre une fenetre sur l'evolution remarquable des technologies de communication a travers les siecles. Du telegraphe electrique aux reseaux 5G, nous avons ete temoins de transformations radicales dans la facon dont les humains communiquent.",
        'The transmissionss history section offers a window into the remarkable evolution of communication technologies across the centuries. From the electric telegraph to 5G networks, we have witnessed radical transformations in how humans communicate.',
      ),
      timelineTitle: t('المراحل الرئيسية', 'Etapes Cles', 'Key Milestones'),
      backToMuseum: t(
        'العودة إلى المتحف',
        'Retour au Musee',
        'Back to Museum',
      ),
      learnMore: t('اعرف المزيد', 'En savoir plus', 'Learn More'),
    }),
    [t],
  );

  const timeline = [
    {
      year: '1837',
      title: t(
        'التلغراف الكهربائي',
        'Le Telegraphe Electrique',
        'The Electric Telegraph',
      ),
      description: t(
        'طور Samuel Morse التلغراف الكهربائي والشفرة التي تحمل اسمه، مما أتاح نقل الرسائل عبر مسافات طويلة.',
        "Samuel Morse developpe le telegraphe electrique et le code qui porte son nom, permettant la transmission de messages sur de longues distances.",
        'Samuel Morse developed the electric telegraph and the code that bears his name, enabling message transmission over long distances.',
      ),
      icon: <Mail className="h-6 w-6" />,
      color: 'from-amber-600 to-orange-700',
    },
    {
      year: '1876',
      title: t('الهاتف', 'Le Telephone', 'The Telephone'),
      description: t(
        'يسجل ألكسندر غراهام بيل براءة اختراع الهاتف، مما أحدث ثورة في الاتصال الصوتي وقرب المجتمعات كما لم يحدث من قبل.',
        "Alexander Graham Bell depose le brevet du telephone, revolutionnant la communication vocale et rapprochant les communautes comme jamais auparavant.",
        'Alexander Graham Bell patents the telephone, revolutionizing voice communication and bringing communities closer than ever before.',
      ),
      icon: <Phone className="h-6 w-6" />,
      color: 'from-yellow-500 to-amber-600',
    },
    {
      year: '1895',
      title: t(
        'الاتصال اللاسلكي',
        'La Radiocommunication',
        'Radio Communication',
      ),
      description: t(
        'أجرى غولييلمو ماركوني أول اتصال لاسلكي عبر الأطلسي، مما فتح عصر الاتصال اللاسلكي.',
        "Guglielmo Marconi effectue la premiere transmission radio a travers l'Atlantique, ouvrant l'ere de la communication sans fil.",
        'Guglielmo Marconi performs the first radio transmission across the Atlantic, opening the era of wireless communication.',
      ),
      icon: <Radio className="h-6 w-6" />,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      year: '1920',
      title: t('البث الإذاعي', 'La Radiodiffusion', 'Broadcasting'),
      description: t(
        'ظهرت أولى محطات الإذاعة التجارية، جلبت الموسيقى والأخبار إلى المنازل حول العالم.',
        "Les premieres stations de radio commerciales apparaissent, apportant musique et nouvelles dans les foyers du monde entier.",
        'The first commercial radio stations appear, bringing music and news into homes around the world.',
      ),
      icon: <Globe className="h-6 w-6" />,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      year: '1969',
      title: t('العصر الرقمي', "L'Ere Numerique", 'The Digital Age'),
      description: t(
        'شهد العالم ولادة ARPANET، مقدمة للإنترنت، ربطت أجهزة الكمبيوتر الأولى وغيرت التواصل العالمي إلى الأبد.',
        "ARPANET voit le jour, precurseur d'Internet, reliant les premiers ordinateurs et changeant a jamais la communication mondiale.",
        'ARPANET is born, the precursor to the Internet, connecting the first computers and forever changing global communication.',
      ),
      icon: <Cpu className="h-6 w-6" />,
      color: 'from-violet-500 to-purple-700',
    },
    {
      year: '1991',
      title: t(
        'الشبكة العالمية',
        'Le World Wide Web',
        'The World Wide Web',
      ),
      description: t(
        'أطلق تيم بيرنرز لي الشبكة العالمية، مما جعل الإنترنت متاحًا لعامة الناس وديمقراطية المعلومات.',
        "Tim Berners-Lee lance le World Wide Web, rendant Internet accessible au grand public et democratisant l'information.",
        'Tim Berners-Lee launches the World Wide Web, making the Internet accessible to the general public and democratizing information.',
      ),
      icon: <Globe className="h-6 w-6" />,
      color: 'from-indigo-500 to-blue-700',
    },
    {
      year: '2007',
      title: t(
        'عصر الهاتف المحمول',
        "L'Ere Mobile",
        'The Mobile Era',
      ),
      description: t(
        'أحدث iPhone ثورة في الاتصال المحمول، يجمع بين الهاتف والإنترنت والكمبيوتر في جهاز محمول.',
        "L'iPhone revolutionne la communication mobile, combinant telephone, Internet et ordinateur dans un appareil portable.",
        'The iPhone revolutionizes mobile communication, combining phone, Internet, and computer in a portable device.',
      ),
      icon: <Smartphone className="h-6 w-6" />,
      color: 'from-slate-600 to-gray-800',
    },
    {
      year: '2019+',
      title: t('5G وما بعدها', '5G et Au-Dela', '5G and Beyond'),
      description: t(
        'تعد تقنية 5G والتقنيات الناشئة باتصال فوري وشامل للجميع.',
        "La 5G et les technologies emergentes promettent une connectivite instantanee et ubiquitaire pour tous.",
        '5G and emerging technologies promise instant and ubiquitous connectivity for all.',
      ),
      icon: <Wifi className="h-6 w-6" />,
      color: 'from-emerald-500 to-teal-700',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(19,48,89,0.04)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(232,201,122,0.05)_0%,transparent_50%)]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#133059]/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10">
        {/* HEADER */}
        <motion.div
          className="pt-32 pb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="mb-8">
            <Link
              to="/about/museum"
              className="inline-flex items-center gap-2 text-[#133059]/60 hover:text-[#e8c97a] transition-colors duration-300 text-sm font-medium group"
            >
              <ArrowLeft className={`h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300 ${isRtl ? 'rotate-180' : ''}`} />
              {texts.backToMuseum}
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/80 border border-[#e8c97a]/20 shadow-lg shadow-[#e8c97a]/5 backdrop-blur-md mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e8c97a]" />
            <span className="text-[#133059] text-[11px] font-bold uppercase tracking-[0.2em]">
              {t('تاريخ الاتصالات', 'Histoire', 'History')}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-serif font-bold text-[#133059] mb-6 tracking-tight leading-tight"
            style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
          >
            {texts.pageTitle}
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className={`flex items-center gap-4 mb-8 ${isRtl ? 'justify-start' : 'justify-start'}`}
          >
            <div className="h-px w-16 bg-gradient-to-r from-[#e8c97a] to-transparent" />
            <div className="w-2 h-2 rounded-full bg-[#e8c97a] shadow-sm shadow-[#e8c97a]/40" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#e8c97a]/60" />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-500 max-w-3xl leading-relaxed"
          >
            {texts.pageSubtitle}
          </motion.p>
        </motion.div>

        {/* INTRO SECTION */}
        <motion.div
          className="mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#133059]/[0.03] to-[#e8c97a]/[0.03] rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-10 md:p-14 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#133059] via-[#e8c97a]/60 to-transparent" />
              <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-[#e8c97a]/[0.04] to-transparent rounded-bl-full" />

              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#133059] mb-6 tracking-tight">
                  {texts.introTitle}
                </h2>
                <p className="text-[16px] md:text-[17px] text-slate-600 leading-relaxed">
                  {texts.introText}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* TIMELINE */}
        <motion.div
          className="mb-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants} className="mb-14">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-br from-[#133059]/10 to-[#133059]/5 rounded-xl border border-[#133059]/10">
                <Clock className="h-5 w-5 text-[#133059]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#133059] tracking-tight">
                {texts.timelineTitle}
              </h2>
            </div>
            <div className={`${isRtl ? 'mr-[52px]' : 'ml-[52px]'} h-0.5 w-12 bg-gradient-to-r from-[#133059] to-transparent rounded-full`} />
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className={`absolute ${isRtl ? 'right-8 md:right-1/2' : 'left-8 md:left-1/2'} top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#e8c97a] via-[#133059]/20 to-[#133059]/5`} />

            <motion.div
              className="space-y-10"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              {timeline.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`relative flex flex-col md:flex-row ${
                    idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } items-start gap-6`}
                >
                  {/* Card */}
                  <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-start' : 'md:text-end'} ${isRtl ? 'mr-16 md:mr-0' : 'ml-16 md:ml-0'}`}>
                    <div className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#133059]/[0.04] to-[#e8c97a]/[0.04] rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                        <div className={`absolute top-0 ${idx % 2 === 0 ? 'left-0' : 'right-0'} w-2 h-full bg-gradient-to-b ${item.color}`} />

                        <div className={`flex items-start gap-4 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                          <div className={`p-3 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-500 flex-shrink-0`}>
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <div className="inline-block px-3.5 py-1.5 bg-gradient-to-r from-[#133059] to-[#133059]/80 text-white text-xs font-bold rounded-full mb-3 shadow-sm">
                              {item.year}
                            </div>
                            <h3 className="text-xl font-bold text-[#133059] mb-3 tracking-tight">
                              {item.title}
                            </h3>
                            <p className="text-slate-500 leading-relaxed text-[15px]">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className={`absolute ${isRtl ? 'right-8 md:right-1/2' : 'left-8 md:left-1/2'} -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-br from-[#e8c97a] to-[#133059] border-4 border-white shadow-lg z-10`} />

                  {/* Spacer for opposite side */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Algeria Context Section */}
        <motion.div
          className="mb-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e8c97a]/[0.04] to-[#133059]/[0.04] rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-10 md:p-14 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e8c97a] via-[#133059]/30 to-transparent" />

              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#133059] mb-6 tracking-tight">
                    {t(
                      'الاتصالات في الجزائر',
                      'Les transmissionss en Algerie',
                      'transmissionss in Algeria',
                    )}
                  </h2>
                  <div className="space-y-5 text-slate-600 leading-relaxed">
                    <p className="text-[16px] md:text-[17px]">
                      {t(
                        'شهدت الجزائر تطورًا ملحوظًا في مجال الاتصالات منذ الاستقلال. من إنشاء أولى شبكات التلغراف إلى شبكات الهاتف المحمول الحديثة، لعبت المدرسة الوطنية للمواصلات السلكية واللاسلكية دورًا محوريًا في تكوين الكفاءات الوطنية.',
                        "L'Algerie a connu une evolution remarquable dans le domaine des transmissionss depuis l'independance. De la creation des premiers reseaux telegraphiques aux reseaux mobiles modernes, l'Ecole Nationale des Transmissions a joue un role central dans la formation des competences nationales.",
                        'Algeria has experienced remarkable development in transmissionss since independence. From establishing the first telegraph networks to modern mobile networks, the National School of Transmissions has played a central role in training national competencies.',
                      )}
                    </p>
                    <p className="text-[16px] md:text-[17px]">
                      {t(
                        'اليوم، تواصل الجزائر ريادتها في مجال التحول الرقمي في أفريقيا، مع استثمارات ضخمة في البنية التحتية للاتصالات.',
                        "Aujourd'hui, l'Algerie continue de mener la transformation numerique en Afrique, avec des investissements massifs dans les infrastructures de transmissionss.",
                        'Today, Algeria continues to lead digital transformation in Africa, with massive investments in transmissionss infrastructure.',
                      )}
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-1/3 flex-shrink-0">
                  <div className="bg-gradient-to-br from-[#133059] to-[#1a4a7a] rounded-2xl p-7 text-white shadow-lg">
                    <h3 className="font-bold text-lg mb-5">
                      {t('معلومات رئيسية', 'Points Cles', 'Key Facts')}
                    </h3>
                    <ul className="space-y-3.5">
                      {[
                        t('أول تلغراف في 1844', 'Premier telegraphe en 1844', 'First telegraph in 1844'),
                        t('أول هاتف في 1880', 'Premier telephone en 1880', 'First telephone in 1880'),
                        t('أول اتصال لاسلكي في 1907', 'Premiere radio en 1907', 'First radio in 1907'),
                        t('الإنترنت منذ 1995', 'Internet depuis 1995', 'Internet since 1995'),
                        t('شبكات 4G و 5G', 'Reseaux 4G et 5G', '4G and 5G Networks'),
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-sm">
                          <CheckCircle className="h-4 w-4 text-[#e8c97a] flex-shrink-0" />
                          <span className="text-white/90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="pb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center">
            <Link
              to="/about/museum"
              className="inline-flex items-center gap-3 px-9 py-4 bg-gradient-to-r from-[#133059] to-[#1a4a7a] text-white rounded-full font-semibold shadow-lg shadow-[#133059]/20 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {texts.backToMuseum}
              <ArrowRight className={`h-5 w-5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>
    </div>
  );
};

export default MuseumHistory;
