import React, { useState, useEffect } from 'react';
import { motion} from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import {
  Trophy, Calendar, Clock, Users, Zap, Star, ArrowRight,
  Code2, Lightbulb, Target, Medal, Cpu, Globe, MapPin,
  AlertCircle, Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/* ─────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────── */
const API_BASE = 'http://10.10.10.10:8000';

const api = axios.create({ baseURL: API_BASE, timeout: 8000 });

const getMediaUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path.replace(/https?:\/\/localhost(:\d+)?/, API_BASE);
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
};

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type Lang = 'fr' | 'ar' | 'en';

interface HackathonEvent {
  id: number;
  title_fr: string;   title_ar: string;   title_en: string;
  subtitle_fr: string; subtitle_ar: string; subtitle_en: string;
  description_fr: string; description_ar: string; description_en: string;
  date_start: string;
  date_end: string;
  location_fr: string; location_ar: string; location_en: string;
  registration_deadline: string;
  max_teams: number;
  contact_email: string;
  banner: string | null;
  is_active: boolean;
}

interface Prize {
  id: number;
  place: number;
  title_fr: string; title_ar: string; title_en: string;
  amount: string;
  description_fr: string; description_ar: string; description_en: string;
  is_special: boolean;
}

interface TimelineItem {
  id: number;
  day: number;
  time: string;
  title_fr: string; title_ar: string; title_en: string;
  description_fr: string; description_ar: string; description_en: string;
  is_highlight: boolean;
}

interface HackathonData {
  event: HackathonEvent | null;
  prizes: Prize[];
  timeline: TimelineItem[];
}

/* ─────────────────────────────────────────────
   STATIC FALLBACK TRANSLATIONS (UI labels only)
───────────────────────────────────────────── */
const UI: Record<string, Record<Lang, string>> = {
  heroBadge:        { fr: '⚡ Hackathon ENT', ar: '⚡ هاكاثون المدرسة', en: '⚡ ENT Hackathon' },
  heroBtn1:         { fr: 'S\'inscrire maintenant', ar: 'سجّل الآن', en: 'Register Now' },
  heroBtn2:         { fr: 'En savoir plus', ar: 'اعرف أكثر', en: 'Learn More' },
  participants:     { fr: 'participants attendus', ar: 'مشارك متوقع', en: 'expected participants' },
  inPrizes:         { fr: 'en prix', ar: 'في جوائز', en: 'in prizes' },
  hoursNonstop:     { fr: 'heures non-stop', ar: 'ساعة متواصلة', en: 'non-stop hours' },
  countdown:        { fr: 'Compte à rebours', ar: 'العد التنازلي', en: 'Countdown' },
  days:             { fr: 'Jours', ar: 'أيام', en: 'Days' },
  hours:            { fr: 'Heures', ar: 'ساعات', en: 'Hours' },
  mins:             { fr: 'Mins', ar: 'دقائق', en: 'Mins' },
  secs:             { fr: 'Secs', ar: 'ثواني', en: 'Secs' },
  aboutBadge:       { fr: '🎯 À Propos', ar: '🎯 حول الفعالية', en: '🎯 About' },
  timelineBadge:    { fr: '🗓️ Programme', ar: '🗓️ البرنامج', en: '🗓️ Schedule' },
  timelineTitle:    { fr: 'Le déroulement du Hackathon', ar: 'سير الهاكاثون', en: 'Hackathon Schedule' },
  prizesBadge:      { fr: '🏆 Récompenses', ar: '🏆 الجوائز', en: '🏆 Prizes' },
  prizesTitle:      { fr: 'Ce que tu peux gagner', ar: 'ما يمكنك الفوز به', en: 'What you can win' },
  regBadge:         { fr: '📝 Inscription', ar: '📝 التسجيل', en: '📝 Registration' },
  regTitle:         { fr: 'Prêt à relever le défi ?', ar: 'مستعد لقبول التحدي؟', en: 'Ready to take the challenge?' },
  regDeadline:      { fr: 'Clôture des inscriptions', ar: 'نهاية التسجيل', en: 'Registration deadline' },
  regSpots:         { fr: 'Équipes maximum', ar: 'حد أقصى للفرق', en: 'Maximum teams' },
  regContact:       { fr: 'Contact', ar: 'التواصل', en: 'Contact' },
  regBtn:           { fr: 'Soumettre ma candidature', ar: 'قدّم طلبك', en: 'Submit your application' },
  joinUs:           { fr: 'Rejoins-nous', ar: 'انضم إلينا', en: 'Join us' },
  topPrize:         { fr: 'Top Prix', ar: 'الجائزة الكبرى', en: 'Top Prize' },
  specialAward:     { fr: 'Prix Spécial', ar: 'جائزة خاصة', en: 'Special Award' },
  day:              { fr: 'Jour', ar: 'اليوم', en: 'Day' },
  loading:          { fr: 'Chargement...', ar: 'جارٍ التحميل...', en: 'Loading...' },
  errorTitle:       { fr: 'Impossible de charger les données', ar: 'تعذّر تحميل البيانات', en: 'Unable to load data' },
  errorSub:         { fr: 'Vérifiez votre connexion ou réessayez plus tard.', ar: 'تحقق من اتصالك أو حاول مجدداً لاحقاً.', en: 'Check your connection or try again later.' },
  retry:            { fr: 'Réessayer', ar: 'إعادة المحاولة', en: 'Retry' },
  ourLocation:      { fr: 'Lieu', ar: 'الموقع', en: 'Location' },
};

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};
const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

/* ─────────────────────────────────────────────
   MEDAL EMOJI helper
───────────────────────────────────────────── */
const placeEmoji = (place: number) => ['🥇', '🥈', '🥉'][place - 1] ?? '🏅';

/* ─────────────────────────────────────────────
   COUNTDOWN HOOK
───────────────────────────────────────────── */
function useCountdown(targetDateStr: string | undefined) {
  const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    if (!targetDateStr) return;
    const target = new Date(targetDateStr).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDateStr]);
  return left;
}

/* ─────────────────────────────────────────────
   LOADING STATE
───────────────────────────────────────────── */
function LoadingScreen({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1e38] via-[#133059] to-[#0f2847] flex flex-col items-center justify-center gap-6">
      <Loader2 className="w-12 h-12 text-[#e8c97a] animate-spin" />
      <p className="text-white/60 text-sm tracking-widest uppercase">{label}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ERROR STATE
───────────────────────────────────────────── */
function ErrorScreen({ title, sub, retry, retryLabel }: {
  title: string; sub: string; retry: () => void; retryLabel: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1e38] via-[#133059] to-[#0f2847] flex flex-col items-center justify-center gap-6 px-6 text-center">
      <AlertCircle className="w-14 h-14 text-[#e8c97a]/60" />
      <div>
        <p className="text-white text-xl font-bold mb-2">{title}</p>
        <p className="text-white/50 text-sm">{sub}</p>
      </div>
      <button
        onClick={retry}
        className="px-6 py-3 rounded-xl bg-[#e8c97a] text-[#133059] font-bold hover:scale-105 transition-transform"
      >
        {retryLabel}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const HackathonPage: React.FC = () => {
  const { language } = useLanguage();
  const lang = (language ?? 'fr') as Lang;
  const isAr = lang === 'ar';
  const dir  = isAr ? 'rtl' : 'ltr';

  const ui = (key: string) => UI[key]?.[lang] ?? UI[key]?.fr ?? key;

  /* ── API State ── */
  const [data, setData]       = useState<HackathonData>({ event: null, prizes: [], timeline: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    Promise.all([
      api.get('/api/hackathon/events/').catch(() => ({ data: [] })),
      api.get('/api/hackathon/prizes/').catch(() => ({ data: [] })),
      api.get('/api/hackathon/timeline/').catch(() => ({ data: [] })),
    ])
      .then(([evRes, prRes, tlRes]) => {
        if (cancelled) return;

        const events: HackathonEvent[] = Array.isArray(evRes.data)
          ? evRes.data
          : evRes.data?.results ?? [];
        const prizes: Prize[] = Array.isArray(prRes.data)
          ? prRes.data
          : prRes.data?.results ?? [];
        const timeline: TimelineItem[] = Array.isArray(tlRes.data)
          ? tlRes.data
          : tlRes.data?.results ?? [];

        const event = events.find(e => e.is_active) ?? events[0] ?? null;

        setData({ event, prizes: prizes.sort((a, b) => a.place - b.place), timeline: timeline.sort((a, b) => a.day - b.day || a.time.localeCompare(b.time)) });
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) { setError(true); setLoading(false); }
      });

    return () => { cancelled = true; };
  }, [retryKey]);

  /* ── Localized helpers ── */
  const loc = (obj: Record<string, string>, key: string) =>
    obj[`${key}_${lang}`] ?? obj[`${key}_fr`] ?? '';

  const { event, prizes, timeline } = data;

  const countdown = useCountdown(event?.date_start);

  const formatDate = (iso: string | undefined) => {
    if (!iso) return '—';
    try {
      return new Intl.DateTimeFormat(
        lang === 'ar' ? 'ar-DZ' : lang === 'en' ? 'en-GB' : 'fr-FR',
        { day: 'numeric', month: 'long', year: 'numeric' }
      ).format(new Date(iso));
    } catch { return iso; }
  };

  if (loading) return <LoadingScreen label={ui('loading')} />;
  if (error)   return (
    <ErrorScreen
      title={ui('errorTitle')}
      sub={ui('errorSub')}
      retry={() => setRetryKey(k => k + 1)}
      retryLabel={ui('retry')}
    />
  );

  /* ── Derived values ── */
  const totalPrizeAmount = prizes
    .filter(p => !p.is_special)
    .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);

  const regularPrizes = prizes.filter(p => !p.is_special);
  const specialPrizes = prizes.filter(p => p.is_special);

  return (
    <div className="bg-white text-[#133059]" dir={dir}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#0a1e38] via-[#133059] to-[#0f2847]">

        {/* Banner image if available */}
        {event?.banner && (
          <div className="absolute inset-0">
            <img
              src={getMediaUrl(event.banner)}
              alt=""
              className="w-full h-full object-cover opacity-15"
            />
          </div>
        )}

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(232,201,122,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(232,201,122,0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Glowing orbs */}
        <div className="absolute top-20 left-10 w-80 h-80 bg-[#e8c97a]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#133059]/30 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-32 w-full">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-4xl">

            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e8c97a]/40 bg-[#e8c97a]/10 text-[#e8c97a] text-xs font-bold uppercase tracking-widest">
                <Zap className="w-3.5 h-3.5" />
                {ui('heroBadge')}
              </span>
            </motion.div>

            {/* Title from API */}
            <motion.div variants={fadeUp} className="mb-8">
              {event ? (
                <>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black leading-none text-white mb-4">
                    {loc(event as unknown as Record<string, string>, 'title')}
                  </h1>
                  <p className="text-2xl md:text-3xl text-[#e8c97a] font-semibold">
                    {loc(event as unknown as Record<string, string>, 'subtitle')}
                  </p>
                </>
              ) : (
                <h1 className="text-5xl md:text-7xl font-serif font-black text-white">
                  {ui('heroBadge')}
                </h1>
              )}
            </motion.div>

            {/* Description */}
            {event && (
              <motion.p variants={fadeUp} className="text-lg text-white/70 max-w-2xl mb-10 leading-relaxed">
                {loc(event as unknown as Record<string, string>, 'description')}
              </motion.p>
            )}

            {/* Stats */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-8 mb-12">
              {[
                { value: `${event?.max_teams ?? '—'} ×5`, label: ui('participants') },
                { value: totalPrizeAmount > 0 ? `${totalPrizeAmount.toLocaleString()} DA` : '—', label: ui('inPrizes') },
                { value: '48', label: ui('hoursNonstop') },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-[#e8c97a] font-serif">{stat.value}</div>
                  <div className="text-xs text-white/50 uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#e8c97a] text-[#133059] font-black text-base hover:shadow-2xl hover:shadow-[#e8c97a]/30 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {ui('heroBtn1')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-bold text-base hover:bg-white/10 transition-all duration-300"
              >
                {ui('heroBtn2')}
              </a>
            </motion.div>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className={`absolute bottom-24 ${isAr ? 'left-6 md:left-10' : 'right-6 md:right-10'}`}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-[#e8c97a]/20 rounded-2xl p-6">
              <p className="text-[#e8c97a]/70 text-xs uppercase tracking-widest mb-4 text-center font-semibold">
                {ui('countdown')}
              </p>
              <div className="flex gap-3">
                {[
                  { val: countdown.days,    label: ui('days') },
                  { val: countdown.hours,   label: ui('hours') },
                  { val: countdown.minutes, label: ui('mins') },
                  { val: countdown.seconds, label: ui('secs') },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-2xl md:text-3xl font-black text-white font-mono w-14 h-14 flex items-center justify-center bg-white/10 rounded-xl border border-[#e8c97a]/20">
                      {String(item.val).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Date & location bar */}
        {event && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#e8c97a]/10 backdrop-blur border-t border-[#e8c97a]/20">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-3 flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Calendar className="w-4 h-4 text-[#e8c97a]" />
                {formatDate(event.date_start)} – {formatDate(event.date_end)}
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <MapPin className="w-4 h-4 text-[#e8c97a]" />
                {loc(event as unknown as Record<string, string>, 'location')}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
          ABOUT
      ══════════════════════════════════════ */}
      {event && (
        <section id="about" className="py-24 md:py-32 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-20">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#133059]/20 bg-[#133059]/5 mb-6">
                <Target className="w-4 h-4 text-[#e8c97a]" />
                <span className="text-[#133059] text-xs font-bold uppercase tracking-widest">{ui('aboutBadge')}</span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#133059] mb-6">
                {loc(event as unknown as Record<string, string>, 'title')}
              </motion.h2>
              <motion.div variants={fadeUp} className="h-1 w-20 bg-gradient-to-r from-[#e8c97a] to-[#133059] rounded-full mx-auto mb-6" />
              <motion.p variants={fadeUp} className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                {loc(event as unknown as Record<string, string>, 'description')}
              </motion.p>
            </motion.div>

            {/* Info cards */}
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Users,    label: ui('regSpots'),    value: `${event.max_teams}` },
                { icon: Calendar, label: ui('regDeadline'), value: formatDate(event.registration_deadline) },
                { icon: Globe,    label: ui('regContact'),  value: event.contact_email },
              ].map(({ icon: Icon, label, value }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="p-7 rounded-2xl border border-slate-100 bg-slate-50 hover:border-[#e8c97a]/40 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e8c97a]/20 to-[#e8c97a]/5 border border-[#e8c97a]/30 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-[#133059]" />
                  </div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">{label}</p>
                  <p className="font-bold text-[#133059] text-sm">{value}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          TIMELINE
      ══════════════════════════════════════ */}
      {timeline.length > 0 && (
        <section className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #133059 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-20">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#133059]/20 bg-[#133059]/5 mb-6">
                <Clock className="w-4 h-4 text-[#e8c97a]" />
                <span className="text-[#133059] text-xs font-bold uppercase tracking-widest">{ui('timelineBadge')}</span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif font-bold text-[#133059] mb-4">
                {ui('timelineTitle')}
              </motion.h2>
              <motion.div variants={fadeUp} className="h-1 w-20 bg-gradient-to-r from-[#e8c97a] to-[#133059] rounded-full mx-auto" />
            </motion.div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#e8c97a]/60 via-[#133059]/20 to-transparent hidden lg:block" />

              <div className="space-y-8">
                {timeline.map((item, i) => {
                  const isLeft = i % 2 === 0;
                  const ICONS = [Zap, Code2, Target, Cpu, Lightbulb, Trophy, Star];
                  const Icon  = ICONS[i % ICONS.length];
                  return (
                    <motion.div
                      key={item.id}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-60px' }}
                      className={`flex flex-col lg:flex-row items-center gap-6 ${isLeft ? '' : 'lg:flex-row-reverse'}`}
                    >
                      <div className="w-full lg:w-5/12">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`p-6 rounded-2xl border transition-all duration-300 ${
                            item.is_highlight
                              ? 'bg-[#133059] border-[#133059] text-white'
                              : 'bg-white border-slate-100 hover:border-[#e8c97a]/40'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              item.is_highlight ? 'bg-[#e8c97a]/20 border border-[#e8c97a]/40' : 'bg-[#133059]/5 border border-[#133059]/10'
                            }`}>
                              <Icon className={`w-5 h-5 ${item.is_highlight ? 'text-[#e8c97a]' : 'text-[#133059]'}`} />
                            </div>
                            <div>
                              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${item.is_highlight ? 'text-[#e8c97a]/70' : 'text-[#e8c97a]'}`}>
                                {ui('day')} {item.day} · {item.time}
                              </p>
                              <h3 className={`font-bold text-base mb-2 ${item.is_highlight ? 'text-white' : 'text-[#133059]'}`}>
                                {loc(item as unknown as Record<string, string>, 'title')}
                              </h3>
                              <p className={`text-sm leading-relaxed ${item.is_highlight ? 'text-white/70' : 'text-slate-500'}`}>
                                {loc(item as unknown as Record<string, string>, 'description')}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Center dot */}
                      <div className="hidden lg:flex w-2/12 justify-center">
                        <div className={`w-5 h-5 rounded-full border-4 z-10 ${
                          item.is_highlight ? 'bg-[#e8c97a] border-[#133059]' : 'bg-white border-[#e8c97a]/60'
                        }`} />
                      </div>

                      <div className="hidden lg:block w-5/12" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          PRIZES
      ══════════════════════════════════════ */}
      {prizes.length > 0 && (
        <section className="py-24 md:py-32 bg-gradient-to-br from-[#0a1e38] via-[#133059] to-[#0f2847] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(232,201,122,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(232,201,122,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#e8c97a]/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-20">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e8c97a]/30 bg-[#e8c97a]/10 mb-6">
                <Trophy className="w-4 h-4 text-[#e8c97a]" />
                <span className="text-[#e8c97a] text-xs font-bold uppercase tracking-widest">{ui('prizesBadge')}</span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                {ui('prizesTitle')}
              </motion.h2>
              <motion.div variants={fadeUp} className="h-1 w-20 bg-gradient-to-r from-[#e8c97a] to-white/20 rounded-full mx-auto" />
            </motion.div>

            {/* Regular prizes */}
            {regularPrizes.length > 0 && (
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                {regularPrizes.map((prize, idx) => {
                  const highlight = prize.place === 1;
                  return (
                    <motion.div
                      key={prize.id}
                      variants={fadeUp}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -8 }}
                      className={`relative p-8 rounded-2xl border text-center transition-all duration-300 ${
                        highlight
                          ? 'bg-[#e8c97a] border-[#e8c97a] text-[#133059]'
                          : 'bg-white/5 border-white/10 text-white hover:border-[#e8c97a]/40'
                      }`}
                    >
                      {highlight && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-[#133059] text-[#e8c97a] text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                            {ui('topPrize')}
                          </span>
                        </div>
                      )}
                      <div className="text-5xl mb-4">{placeEmoji(prize.place)}</div>
                      <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${highlight ? 'text-[#133059]/60' : 'text-[#e8c97a]/70'}`}>
                        {loc(prize as unknown as Record<string, string>, 'title')}
                      </p>
                      <p className={`text-3xl font-black font-serif mb-3 ${highlight ? 'text-[#133059]' : 'text-[#e8c97a]'}`}>
                        {parseFloat(prize.amount).toLocaleString()} DA
                      </p>
                      <p className={`text-sm leading-relaxed ${highlight ? 'text-[#133059]/70' : 'text-white/50'}`}>
                        {loc(prize as unknown as Record<string, string>, 'description')}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Special prizes */}
            {specialPrizes.map((prize) => (
              <motion.div
                key={prize.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-6 rounded-2xl border border-[#e8c97a]/20 bg-white/5 backdrop-blur flex flex-wrap items-center gap-5 mb-4"
              >
                <div className="w-14 h-14 rounded-xl bg-[#e8c97a]/10 border border-[#e8c97a]/30 flex items-center justify-center shrink-0">
                  <Medal className="w-6 h-6 text-[#e8c97a]" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-base mb-1">{loc(prize as unknown as Record<string, string>, 'title')}</p>
                  <p className="text-white/50 text-sm">{loc(prize as unknown as Record<string, string>, 'description')}</p>
                </div>
                <div className="text-2xl font-black text-[#e8c97a] font-serif shrink-0">
                  {ui('specialAward')}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          REGISTRATION CTA
      ══════════════════════════════════════ */}
      {event && (
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">

            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-16">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#133059]/20 bg-[#133059]/5 mb-6">
                <Star className="w-4 h-4 text-[#e8c97a]" />
                <span className="text-[#133059] text-xs font-bold uppercase tracking-widest">{ui('regBadge')}</span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif font-bold text-[#133059] mb-4">
                {ui('regTitle')}
              </motion.h2>
              <motion.div variants={fadeUp} className="h-1 w-20 bg-gradient-to-r from-[#e8c97a] to-[#133059] rounded-full mx-auto mb-6" />
            </motion.div>

            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {[
                { icon: Calendar, label: ui('regDeadline'),  value: formatDate(event.registration_deadline) },
                { icon: Users,    label: ui('regSpots'),      value: `${event.max_teams} ${isAr ? 'فريق' : lang === 'en' ? 'teams' : 'équipes'}` },
                { icon: Globe,    label: ui('regContact'),    value: event.contact_email },
              ].map(({ icon: Icon, label, value }) => (
                <motion.div key={label} variants={fadeUp} className="flex items-center gap-5 p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:border-[#e8c97a]/40 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#133059]/10 to-[#e8c97a]/5 border border-[#e8c97a]/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#133059]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">{label}</p>
                    <p className="font-bold text-[#133059] text-sm">{value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Final CTA box */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#133059] to-[#0a1e38]" />
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(rgba(232,201,122,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(232,201,122,0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#e8c97a]/10 rounded-full blur-3xl" />
              <div className="relative z-10 p-12 md:p-20 text-center">
                <p className="text-[#e8c97a] text-xs font-bold uppercase tracking-[4px] mb-4">{ui('joinUs')}</p>
                <h3 className="text-3xl md:text-5xl font-serif font-black text-white mb-6 leading-tight">
                  {loc(event as unknown as Record<string, string>, 'title')}
                </h3>
                <p className="text-white/60 mb-10 max-w-xl mx-auto text-lg">
                  {loc(event as unknown as Record<string, string>, 'description')}
                </p>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-[#e8c97a] text-[#133059] font-black text-lg hover:shadow-2xl hover:shadow-[#e8c97a]/30 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  {ui('regBtn')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>
    </div>
  );
};

export default HackathonPage;
