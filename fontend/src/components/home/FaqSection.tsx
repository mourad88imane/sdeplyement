import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import {
  HelpCircle,
  ChevronDown,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface FAQItem {
  id: number;
  question_fr: string;
  question_ar: string;
  question_en?: string;
  answer_fr: string;
  answer_ar: string;
  answer_en?: string;
}

interface FAQSectionProps {
  items?: FAQItem[];
}

/* ─────────────────────────────────────────────
   DEFAULT FAQ DATA
───────────────────────────────────────────── */
const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 1,
    question_fr: "Quels débouches proffessionnels apres une formation chez ENT ?",
    question_ar: 'ما هي الآفاق المهنية بعد تكوين في المدرسة؟',
    question_en: 'What are the career opportunities after training?',
    answer_fr:
      "La formation dispensée à l'école permet à ses adhérents d'accéder à des emplois dans le secteur de l'Intérieur et des collectivités locales — au niveau central ou local — ainsi que dans certains autres secteurs tels que la Présidence de la République, la Primature, le Ministère des Affaires étrangères et de la Communauté nationale à l'étranger, ainsi que les affaires africaines.",
    answer_ar:
      'التكوين في المدرسة يتيح للمنتسب اليها التوظيف في قطاع الداخلية و الجماعات المحلية -مركزيا أو محليا وكذا بعض القطاعات الأخرى كرئاسة الجمهورية -الوزارة الأولى -وزارة الشؤون الخارجية والجالية الوطنية بالخارج والشؤون الافريقية.',
    answer_en:
      'The training provided at the school allows its members to access jobs in the Interior sector and local authorities - at the central or local level - as well as in some other sectors such as the Presidency of the Republic, the Prime Ministry, the Ministry of Foreign Affairs and the National Community Abroad, and African Affairs.',
  },
  {
    id: 2,
    question_fr: "Comment l'ENT garantit-elle l'employabilité de ses diplômés ?",
    question_ar: 'كيف تضمن المدرسة توظيف خريجيها؟',
    question_en: 'How does the ENT guarantee the employability of its graduates?',
    answer_fr:
      "L'admission à l'école est conditionnée par la réussite au concours organisé par la Direction générale des transmissions nationales. Le recrutement est ensuite garanti conformément aux postes budgétaires disponibles.",
    answer_ar:
      'إن الإلتحاق بالمدرسة يكون بعد النجاح في المسابقة المنطمة من طرف المديرية العامة للمواصلات السلكية واللاسلكية والتوطيف بعدها يكون مضموناعلى حسب المناصب المالية المطلوبة.',
    answer_en:
      'Admission to the school is contingent upon successful completion of the examination organized by the National General Directorate of Transmissions. Employment is thereafter assured in accordance with the available budgeted positions.',
  },
  {
    id: 3,
    question_fr: 'Quelles liens avec les entreprises pendant la formation ?',
    question_ar: 'ما هي الروابط مع الشركات أثناء التدريب؟',
    question_en: 'What are the links with companies during the training?',
    answer_fr:
      "Durant la période de formation spécialisée, l'école organise des visites pédagogiques dans divers domaines et centres en lien avec son champ de spécialisation, tels que : l'École supérieure des transmissions à Kolea, ainsi que les sites de Baraki, Bou Ismaïl, Bouzaréah et Lakhdaria.",
    answer_ar:
      'تنظم المدرسة أثناء فترة التكوين المتخصص للطالب زيارات بيداغوجية إلى عديد الميادين و المراكز ذات الصلة بمجال تخصصها مثل :المدرسة العليا للإشارة-القليعة., براقي , بوسماعيل , بوزريعة , الأخضرية.',
    answer_en:
      'During the period of specialized training, the school organizes educational visits to various fields and centers related to its area of specialization, such as the Higher School of Signals in Kolea, as well as the sites of Baraki, Bou Ismaïl, Bouzaréah, and Lakhdaria.',
  },
];

/* ─────────────────────────────────────────────
   STEP DATA  (pure SVG paths, no foreignObject)
───────────────────────────────────────────── */
interface Step {
  id: number;
  iconPath: string;
  label: { fr: string; ar: string; en: string };
  cx: number;
  cy: number;
  labelAnchor: 'above' | 'below';
}

const STEPS: Step[] = [
  {
    id: 1,
    iconPath: 'M4,13 L4,1 M4,1 L12,4 L4,7',
    cx: 120, cy: 80,
    labelAnchor: 'above',
    label: { fr: 'Candidature', ar: 'التسجيل', en: 'Application' },
  },
  {
    id: 2,
    iconPath: 'M3,1 h6 l3,3 v9 H3 z M9,1 v3 h3 M5,7 h5 M5,10 h3',
    cx: 300, cy: 80,
    labelAnchor: 'above',
    label: { fr: 'Évaluation', ar: 'التقييم', en: 'Evaluation' },
  },
  {
    id: 3,
    iconPath: 'M1,7 l4,4 l8,-8',
    cx: 480, cy: 80,
    labelAnchor: 'above',
    label: { fr: 'Sélection', ar: 'الانتقاء', en: 'Selection' },
  },
  {
    id: 4,
    iconPath: 'M7,5 L1,8 L7,11 L13,8 Z M10,9.5 v3 M4,9.5 v2.5 Q7,14 10,12.5',
    cx: 480, cy: 230,
    labelAnchor: 'below',
    label: { fr: 'Formation', ar: 'التكوين', en: 'Training' },
  },
  {
    id: 5,
    iconPath: 'M7,1 l1.5,3.5 3.8,0.5 -2.7,2.6 0.6,3.8 L7,9.5 3.8,11.4 4.4,7.6 1.7,5 5.5,4.5 Z',
    cx: 300, cy: 230,
    labelAnchor: 'below',
    label: { fr: 'Diplôme', ar: 'التخرج', en: 'Graduation' },
  },
  {
    id: 6,
    iconPath: 'M1,13 V5 L7,1 L13,5 V13 M4,13 V9 h3 v4 M7,9 h3 v4 M5,5 h1 M8,5 h1 M5,7 h1 M8,7 h1',
    cx: 120, cy: 230,
    labelAnchor: 'below',
    label: { fr: 'Intégration', ar: 'التعيين', en: 'Placement' },
  },
];

/* ─────────────────────────────────────────────
   SNAKE PATH — 2 rows, correct segment order
───────────────────────────────────────────── */
const SNAKE_PATH = `
  M 120,80
  L 300,80
  L 480,80
  C 540,80 540,230 480,230
  L 300,230
  L 120,230
`;

/* ─────────────────────────────────────────────
   SNAKE FLOWCHART
   KEY FIX: use plain initial/animate (not whileInView)
   so dots always render — whileInView fails when the
   SVG is inside a card and already in the viewport
   on mount, or when overflow:hidden blocks detection.
───────────────────────────────────────────── */
function SnakeFlowchart({ lang }: { lang: string }) {
  const isAr = lang === 'ar';
  const t = (o: { fr: string; ar: string; en: string }) =>
    o[lang as 'fr' | 'ar' | 'en'] ?? o.fr;

  return (
    <div className="relative w-full" style={{ paddingBottom: '8px' }}>
      <svg
        viewBox="0 0 600 310"
        className="w-full"
        style={{ overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          <filter id="faq-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="faq-dotglow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <style>{`
            @keyframes faq-dash {
              to { stroke-dashoffset: -40; }
            }
            .faq-flow-path { animation: faq-dash 2.5s linear infinite; }
          `}</style>
        </defs>

        {/* Background track */}
        <path
          d={SNAKE_PATH}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Animated foreground path */}
        <path
          className="faq-flow-path"
          d={SNAKE_PATH}
          fill="none"
          stroke="rgba(232,201,122,0.5)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="8 6"
          filter="url(#faq-glow)"
        />

        {/* Steps — plain animate, no whileInView */}
        {STEPS.map((step, i) => {
          const isLast      = i === STEPS.length - 1;
          const labelY      = step.labelAnchor === 'above' ? step.cy - 58 : step.cy + 62;
          const lineNear    = step.labelAnchor === 'above' ? step.cy - 22 : step.cy + 22;
          const lineFar     = step.labelAnchor === 'above' ? step.cy - 38 : step.cy + 38;
          const iconOffsetY = step.labelAnchor === 'above' ? step.cy - 56 : step.cy + 38;

          return (
            <motion.g
              key={step.id}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: 'easeOut' }}
            >
              {/* Outer glow ring */}
              <circle
                cx={step.cx} cy={step.cy} r={22}
                fill="rgba(232,201,122,0.08)"
                stroke="rgba(232,201,122,0.2)"
                strokeWidth="1"
              />

              {/* Inner filled dot */}
              <circle
                cx={step.cx} cy={step.cy} r={14}
                fill={isLast ? '#e8c97a' : 'rgba(232,201,122,0.15)'}
                stroke="#e8c97a"
                strokeWidth="1.5"
                filter="url(#faq-dotglow)"
              />

              {/* Step number */}
              <text
                x={step.cx} y={step.cy + 5}
                textAnchor="middle"
                fontSize="10" fontWeight="800"
                fill={isLast ? '#133059' : '#e8c97a'}
                fontFamily="monospace"
              >
                {String(step.id).padStart(2, '0')}
              </text>

              {/* Pure-SVG icon — no foreignObject */}
              <g transform={`translate(${step.cx - 7}, ${iconOffsetY})`}>
                <path
                  d={step.iconPath}
                  fill="none"
                  stroke="#e8c97a"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              {/* Dashed connector */}
              <line
                x1={step.cx} y1={lineNear}
                x2={step.cx} y2={lineFar}
                stroke="rgba(232,201,122,0.25)"
                strokeWidth="1"
                strokeDasharray="2 2"
              />

              {/* Label */}
              <text
                x={step.cx} y={labelY}
                textAnchor="middle"
                fontSize="11" fontWeight="700"
                fill="rgba(255,255,255,0.9)"
                fontFamily="system-ui, sans-serif"
                style={{ direction: isAr ? 'rtl' : 'ltr' }}
              >
                {t(step.label)}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function FAQSection({ items = DEFAULT_FAQS }: FAQSectionProps) {
  const { language: lang } = useLanguage();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const isAr = lang === 'ar';

  const texts = useMemo(
    () => ({
      badge:
        lang === 'ar'
          ? '❓ الأسئلة الشائعة'
          : lang === 'en'
          ? '❓ Frequently Asked Questions'
          : '❓ Questions Fréquentes',
      title:
        lang === 'ar'
          ? 'أسئلتك عن برامجنا'
          : lang === 'en'
          ? 'Your Questions Answered'
          : 'Vos Questions sur Nos Programmes',
      subtitle:
        lang === 'ar'
          ? 'اكتشف الإجابات على كل استفساراتك'
          : lang === 'en'
          ? 'Find answers to all your inquiries'
          : 'Trouvez les réponses à toutes vos questions',
      flowBadge:
        lang === 'ar'
          ? '🗺️ مسار التوظيف'
          : lang === 'en'
          ? '🗺️ Career Pathway'
          : '🗺️ Parcours de Recrutement',
      ctaTitle:
        lang === 'ar'
          ? 'هل لديك أسئلة أخرى؟'
          : lang === 'en'
          ? 'Still have questions?'
          : "D'autres questions\u00a0?",
      ctaBody:
        lang === 'ar'
          ? 'فريقنا متاح للإجابة على جميع استفساراتك'
          : lang === 'en'
          ? 'Our team is available to answer all your inquiries'
          : 'Notre équipe est disponible pour répondre à toutes vos questions',
      ctaBtn:
        lang === 'ar' ? 'تواصل معنا' : lang === 'en' ? 'Contact Us' : 'Nous Contacter',
    }),
    [lang]
  );

  const getQuestion = (item: FAQItem) =>
    lang === 'ar'
      ? item.question_ar
      : lang === 'en'
      ? item.question_en ?? item.question_fr
      : item.question_fr;

  const getAnswer = (item: FAQItem) =>
    lang === 'ar'
      ? item.answer_ar
      : lang === 'en'
      ? item.answer_en ?? item.answer_fr
      : item.answer_fr;

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">

      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0">
        <img src="/images/ent.jpg" alt="Campus" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue/95 via-blue/85 to-blue-dark/90" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">

        {/* ── HEADER ── */}
        <motion.div
          className="text-center mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e8c97a]/30 bg-[#e8c97a]/10 backdrop-blur-sm hover:bg-[#e8c97a]/15 transition-colors mb-6"
          >
            <HelpCircle className="w-4 h-4 text-[#e8c97a] animate-pulse" />
            <span className="text-[#e8c97a] text-xs font-bold uppercase tracking-widest">
              {texts.badge}
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-[1.1]"
          >
            {texts.title}
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="h-1 w-20 bg-gradient-to-r from-[#e8c97a] to-[#133059] rounded-full mx-auto mb-6"
          />

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto"
          >
            {texts.subtitle}
          </motion.p>
        </motion.div>

        {/* ── TWO-COLUMN ── */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >

          {/* LEFT — FLOWCHART */}
          <motion.div variants={itemVariants} dir={isAr ? 'rtl' : 'ltr'}>
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e8c97a]/30 bg-[#e8c97a]/10 backdrop-blur-sm hover:bg-[#e8c97a]/15 transition-colors mb-6"
            >
              <span className="text-[#e8c97a] text-xs font-bold uppercase tracking-widest">
                {texts.flowBadge}
              </span>
            </motion.div>

            {/* Card — no overflow-hidden so SVG labels never get clipped */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-[#e8c97a]/20 hover:border-[#e8c97a]/35 transition-all duration-300">
              <div className="h-px bg-gradient-to-r from-transparent via-[#e8c97a]/50 to-transparent" />
              <div className="p-6 pb-4">
                <SnakeFlowchart lang={lang} />
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-[#e8c97a]/20 to-transparent" />
            </div>
          </motion.div>

          {/* RIGHT — FAQ ACCORDION */}
          <motion.div variants={containerVariants} className="space-y-3">
            {items.map((item, i) => {
              const open = expandedId === item.id;
              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="group"
                  dir={isAr ? 'rtl' : 'ltr'}
                >
                  <motion.button
                    onClick={() => setExpandedId(open ? null : item.id)}
                    whileHover={{ y: -2 }}
                    className={`w-full bg-white/10 backdrop-blur-xl rounded-2xl p-5 md:p-6 border transition-all duration-300 ${
                      open
                        ? 'border-[#e8c97a]/50 bg-white/15 shadow-lg shadow-[#e8c97a]/5 rounded-b-none'
                        : 'border-[#e8c97a]/20 hover:border-[#e8c97a]/40 hover:bg-white/15'
                    }`}
                  >
                    <div className={`flex items-center gap-4 ${isAr ? 'flex-row-reverse' : ''}`}>
                      <span
                        className={`text-xs font-black tracking-[2px] uppercase flex-shrink-0 font-mono transition-colors ${
                          open ? 'text-[#e8c97a]' : 'text-[#e8c97a]/35'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3
                        className={`flex-1 text-base font-bold transition-colors duration-300 ${
                          isAr ? 'text-right' : 'text-left'
                        } ${open ? 'text-[#e8c97a]' : 'text-white group-hover:text-[#e8c97a]'}`}
                      >
                        {getQuestion(item)}
                      </h3>
                      <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-colors ${
                            open ? 'text-[#e8c97a]' : 'text-[#e8c97a]/50'
                          }`}
                        />
                      </motion.div>
                    </div>
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="ans"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div
                          className={`bg-gradient-to-b from-white/10 to-[#133059]/20 border border-[#e8c97a]/20 border-t-0 rounded-b-2xl px-6 pb-5 pt-4 ${
                            isAr ? 'text-right' : 'text-left'
                          }`}
                        >
                          <p className="text-white/80 text-sm leading-relaxed">
                            {getAnswer(item)}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mt-20"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <div className="bg-white/5 backdrop-blur border border-[#e8c97a]/20 rounded-2xl p-10 md:p-14 text-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-14 h-14 bg-gradient-to-br from-[#e8c97a]/30 to-[#e8c97a]/10 rounded-xl flex items-center justify-center mx-auto mb-6 border border-[#e8c97a]/30"
            >
              <MessageCircle className="w-7 h-7 text-[#e8c97a]" />
            </motion.div>

            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
              {texts.ctaTitle}
            </h3>
            <div className="h-1 w-16 bg-gradient-to-r from-[#e8c97a] to-[#133059] rounded-full mx-auto mb-4" />
            <p className="text-white/80 mb-8 max-w-xl mx-auto leading-relaxed">
              {texts.ctaBody}
            </p>

            <Link
              to="/contact"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#e8c97a] text-[#133059] font-black text-lg hover:shadow-2xl hover:shadow-[#e8c97a]/30 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {texts.ctaBtn}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
