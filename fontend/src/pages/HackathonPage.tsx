import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Zap, Code2, Target, Cpu, Lightbulb, Trophy, Star,
  Calendar, MapPin, Users, Mail, Clock, Award, Medal,
  ArrowRight, RefreshCw, Loader2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getMediaUrl } from '@/utils';
import PastEditionCard from './PastEditionCard';
import type {
  HackathonEvent, Prize, TimelineItem, Winner, GalleryItem, Theme,
} from '@/types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const tl = (lang: string, fr: string, ar: string, en: string) =>
  lang === 'ar' ? ar : lang === 'en' ? en : fr;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const timelineIcons = [Zap, Code2, Target, Cpu, Lightbulb, Trophy, Star];

function extract<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object' && 'results' in data && Array.isArray((data as Record<string, unknown>).results))
    return (data as Record<string, unknown>).results as T[];
  return [];
}

/* ───── Countdown Hook ───── */
function useCountdown(target: string | undefined) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!target) return { days: 0, hours: 0, mins: 0, secs: 0 };
  const diff = Math.max(0, new Date(target).getTime() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  };
}

export default function HackathonPage() {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const [events, setEvents] = useState<HackathonEvent[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(false);
    Promise.all([
      axios.get(`${API_BASE}/hackathon/events/`, { timeout: 10000 }).catch(() => null),
      axios.get(`${API_BASE}/hackathon/prizes/`, { timeout: 10000 }).catch(() => null),
      axios.get(`${API_BASE}/hackathon/timeline/`, { timeout: 10000 }).catch(() => null),
      axios.get(`${API_BASE}/hackathon/winners/`, { timeout: 10000 }).catch(() => null),
      axios.get(`${API_BASE}/hackathon/gallery/`, { timeout: 10000 }).catch(() => null),
      axios.get(`${API_BASE}/hackathon/themes/`, { timeout: 10000 }).catch(() => null),
    ]).then(([evRes, prRes, tlRes, wiRes, gaRes, thRes]) => {
      if (!evRes && !prRes && !tlRes && !wiRes && !gaRes && !thRes) {
        setError(true);
      } else {
        if (evRes) setEvents(extract<HackathonEvent>(evRes.data));
        if (prRes) setPrizes(extract<Prize>(prRes.data));
        if (tlRes) setTimeline(extract<TimelineItem>(tlRes.data));
        if (wiRes) setWinners(extract<Winner>(wiRes.data));
        if (gaRes) setGallery(extract<GalleryItem>(gaRes.data));
        if (thRes) setThemes(extract<Theme>(thRes.data));
      }
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, []);

  const activeEvent = useMemo(() => events.find((e) => e.is_active) || null, [events]);
  const pastEvents = useMemo(
    () => events.filter((e) => !e.is_active).sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime()),
    [events],
  );
  const activePrizes = useMemo(
    () => (activeEvent ? prizes.filter((p) => p.event === activeEvent.id) : []),
    [prizes, activeEvent],
  );
  const activeTimeline = useMemo(
    () => (activeEvent ? timeline.filter((t) => t.event === activeEvent.id) : []),
    [timeline, activeEvent],
  );

  const regularPrizes = activePrizes.filter((p) => !p.is_special).sort((a, b) => a.place - b.place);
  const specialPrizes = activePrizes.filter((p) => p.is_special);
  const totalPrize = activePrizes.reduce((s, p) => s + Number(p.amount || 0), 0);

  const countdown = useCountdown(activeEvent?.date_start);

  /* ───── Loading / Error ───── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#133059]">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#e8c97a] mx-auto mb-4" />
          <p className="text-white text-lg">{tl(language, 'Chargement...', '\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0645\u064a\u0644...', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#133059]">
        <div className="text-center">
          <p className="text-white text-lg mb-4">{tl(language, 'Erreur de chargement', '\u062e\u0637\u0623 \u0641\u064a \u0627\u0644\u062a\u062d\u0645\u064a\u0644', 'Loading error')}</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#e8c97a] text-[#133059] rounded-full font-semibold hover:bg-[#d4b56a] transition-colors"
          >
            <RefreshCw size={18} />
            {tl(language, 'R\u00e9essayer', '\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629', 'Retry')}
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(language === 'ar' ? 'ar-DZ' : language === 'en' ? 'en-US' : 'fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ═══════ 1. HERO ═══════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #133059 0%, #0a1e38 100%)' }}>
        {/* Gold grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(232,201,122,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(232,201,122,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glowing blur orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#e8c97a]/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#133059]/40 blur-3xl"
        />

        {/* Banner image overlay */}
        {activeEvent?.banner && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: `url(${getMediaUrl(activeEvent.banner)})` }}
          />
        )}

        <div className="relative z-10 container mx-auto px-6 py-24">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e8c97a]/10 border border-[#e8c97a]/30 text-[#e8c97a] text-sm font-medium mb-6">
                <Zap size={14} /> ENT Hackathon
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4">
              {activeEvent ? tl(language, activeEvent.title_fr, activeEvent.title_ar, activeEvent.title_en) : 'ENT Hackathon'}
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-[#e8c97a] font-medium mb-6">
              {activeEvent ? tl(language, activeEvent.subtitle_fr, activeEvent.subtitle_ar, activeEvent.subtitle_en) : ''}
            </motion.p>

            {/* Description */}
            <motion.p variants={fadeUp} className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
              {activeEvent ? tl(language, activeEvent.description_fr, activeEvent.description_ar, activeEvent.description_en) : ''}
            </motion.p>

            {/* Stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
              {[
                { value: activeEvent ? activeEvent.max_teams * 5 : 0, label: tl(language, 'Participants', '\u0645\u0634\u0627\u0631\u0643', 'Participants') },
                { value: totalPrize ? `${totalPrize.toLocaleString()} DA` : '0 DA', label: tl(language, 'Prix total', '\u0627\u0644\u062c\u0627\u0626\u0632\u0629 \u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a\u0629', 'Total Prize') },
                { value: '48', label: tl(language, 'Heures', '\u0633\u0627\u0639\u0629', 'Hours') },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-[#e8c97a]">{typeof s.value === 'number' ? s.value.toString() : s.value}</div>
                  <div className="text-white/60 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#e8c97a] text-[#133059] rounded-full font-bold text-lg hover:bg-[#d4b56a] transition-colors shadow-lg shadow-[#e8c97a]/20"
              >
                {tl(language, "S'inscrire", '\u0627\u0644\u062a\u0633\u062c\u064a\u0644', 'Register')}
                <ArrowRight size={20} />
              </Link>
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-full font-bold text-lg hover:border-[#e8c97a] hover:text-[#e8c97a] transition-colors"
              >
                {tl(language, 'En savoir plus', '\u0627\u0639\u0631\u0641 \u0627\u0644\u0645\u0632\u064a\u062f', 'Learn More')}
              </a>
            </motion.div>
          </motion.div>

          {/* Countdown */}
          {activeEvent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className={`absolute bottom-24 ${isRtl ? 'left-6' : 'right-6'}`}
            >
              <div className="flex gap-3">
                {[
                  { v: countdown.days, l: tl(language, 'Jours', '\u0623\u064a\u0627\u0645', 'Days') },
                  { v: countdown.hours, l: tl(language, 'Heures', '\u0633\u0627\u0639\u0627\u062a', 'Hours') },
                  { v: countdown.mins, l: tl(language, 'Min', '\u062f\u0642\u0627\u0626\u0642', 'Mins') },
                  { v: countdown.secs, l: tl(language, 'Sec', '\u062b\u0648\u0627\u0646\u064a', 'Secs') },
                ].map((c, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center border border-white/10 min-w-16">
                    <div className="text-2xl font-bold text-[#e8c97a]">{String(c.v).padStart(2, '0')}</div>
                    <div className="text-white/50 text-xs">{c.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom bar */}
        {activeEvent && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-t border-white/10">
            <div className="container mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-[#e8c97a]" />
                {formatDate(activeEvent.date_start)} - {formatDate(activeEvent.date_end)}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-[#e8c97a]" />
                {tl(language, activeEvent.location_fr, activeEvent.location_ar, activeEvent.location_en)}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* ═══════ 2. ABOUT ═══════ */}
      {activeEvent && (
        <section id="about" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#133059]/5 text-[#133059] text-sm font-medium mb-4">
                  <Zap size={14} className="text-[#e8c97a]" />
                  {tl(language, "\u00c0 propos", '\u062d\u0648\u0644', 'About')}
                </span>
              </motion.div>

              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-serif font-bold text-[#133059] mb-4">
                {tl(language, activeEvent.title_fr, activeEvent.title_ar, activeEvent.title_en)}
              </motion.h2>

              <motion.div variants={fadeUp} className="w-20 h-1 bg-[#e8c97a] mx-auto mb-8 rounded-full" />

              <motion.p variants={fadeUp} className="text-slate-600 text-lg leading-relaxed mb-12">
                {tl(language, activeEvent.description_fr, activeEvent.description_ar, activeEvent.description_en)}
              </motion.p>

              <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div whileHover={{ y: -6 }} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <Users size={32} className="text-[#e8c97a] mx-auto mb-3" />
                  <div className="text-2xl font-bold text-[#133059]">{activeEvent.max_teams}</div>
                  <div className="text-slate-500 text-sm">{tl(language, '\u00c9quipes max', '\u0623\u0642\u0635\u0649 \u0639\u062f\u062f \u0627\u0644\u0641\u0631\u0642', 'Max Teams')}</div>
                </motion.div>
                <motion.div whileHover={{ y: -6 }} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <Clock size={32} className="text-[#e8c97a] mx-auto mb-3" />
                  <div className="text-lg font-bold text-[#133059]">
                    {activeEvent.registration_deadline ? formatDate(activeEvent.registration_deadline) : 'N/A'}
                  </div>
                  <div className="text-slate-500 text-sm">{tl(language, 'Date limite', '\u0627\u0644\u0645\u0648\u0639\u062f \u0627\u0644\u0646\u0647\u0627\u0626\u064a', 'Deadline')}</div>
                </motion.div>
                <motion.div whileHover={{ y: -6 }} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <Mail size={32} className="text-[#e8c97a] mx-auto mb-3" />
                  <div className="text-lg font-bold text-[#133059]">{activeEvent.contact_email}</div>
                  <div className="text-slate-500 text-sm">{tl(language, 'Contact', '\u0627\u0644\u062a\u0648\u0627\u0635\u0644', 'Contact')}</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════ 3. TIMELINE ═══════ */}
      {activeTimeline.length > 0 && (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle, #133059 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#133059]/5 text-[#133059] text-sm font-medium mb-4">
                  <Calendar size={14} className="text-[#e8c97a]" />
                  {tl(language, 'Programme', '\u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062c', 'Schedule')}
                </span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-serif font-bold text-[#133059]">
                {tl(language, 'Chronologie', '\u0627\u0644\u062c\u062f\u0648\u0644 \u0627\u0644\u0632\u0645\u0646\u064a', 'Timeline')}
              </motion.h2>
            </motion.div>

            {/* Timeline items */}
            <div className="relative max-w-4xl mx-auto">
              {/* Center line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#133059]/20 -translate-x-1/2 hidden md:block" />

              {activeTimeline.map((item, idx) => {
                const Icon = timelineIcons[idx % timelineIcons.length];
                const isLeft = idx % 2 === 0;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7, delay: idx * 0.05 }}
                    className={`relative flex items-center mb-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    {/* Card */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`w-full md:w-5/12 ${
                        item.is_highlight
                          ? 'bg-[#0f2847] text-white border-[#e8c97a]/30'
                          : 'bg-white hover:border-[#e8c97a] text-[#133059]'
                      } rounded-2xl p-6 border shadow-sm transition-colors`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${item.is_highlight ? 'bg-[#e8c97a]/20' : 'bg-slate-100'}`}>
                          <Icon size={16} className={item.is_highlight ? 'text-[#e8c97a]' : 'text-[#133059]'} />
                        </div>
                        <span className={`text-xs font-medium ${item.is_highlight ? 'text-[#e8c97a]' : 'text-slate-400'}`}>
                          {tl(language, `Jour ${item.day}`, `\u0627\u0644\u064a\u0648\u0645 ${item.day}`, `Day ${item.day}`)} &middot; {item.time}
                        </span>
                      </div>
                      <h4 className={`font-serif font-bold text-lg mb-1 ${item.is_highlight ? 'text-white' : ''}`}>
                        {tl(language, item.title_fr, item.title_ar, item.title_en)}
                      </h4>
                      <p className={`text-sm ${item.is_highlight ? 'text-white/70' : 'text-slate-500'}`}>
                        {tl(language, item.description_fr, item.description_ar, item.description_en)}
                      </p>
                    </motion.div>

                    {/* Center dot */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#e8c97a] bg-white z-10" />

                    {/* Spacer */}
                    <div className="hidden md:block w-5/12" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ 4. PRIZES ═══════ */}
      {activePrizes.length > 0 && (
        <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2847 0%, #0a1e38 100%)' }}>
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'linear-gradient(rgba(232,201,122,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(232,201,122,0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e8c97a]/10 text-[#e8c97a] text-sm font-medium mb-4">
                  <Award size={14} /> {tl(language, 'R\u00e9compenses', '\u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062a', 'Rewards')}
                </span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-serif font-bold text-white">
                {tl(language, 'Prix & R\u00e9compenses', '\u0627\u0644\u062c\u0648\u0627\u0626\u0632 \u0648\u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062a', 'Prizes & Rewards')}
              </motion.h2>
            </motion.div>

            {/* Regular prizes grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8"
            >
              {regularPrizes.map((prize) => (
                <motion.div
                  key={prize.id}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className={`rounded-2xl p-8 text-center relative ${
                    prize.place === 1
                      ? 'bg-gradient-to-br from-[#e8c97a] to-[#d4b56a] text-[#133059]'
                      : 'bg-white/5 backdrop-blur-sm border border-white/10 text-white'
                  }`}
                >
                  {prize.place === 1 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#133059] text-[#e8c97a] text-xs font-bold rounded-full">
                      {tl(language, 'Top Prix', '\u0627\u0644\u062c\u0627\u0626\u0632\u0629 \u0627\u0644\u0643\u0628\u0631\u0649', 'Top Prize')}
                    </div>
                  )}
                  <Trophy size={36} className={`mx-auto mb-4 ${prize.place === 1 ? 'text-[#133059]' : 'text-[#e8c97a]'}`} />
                  <h3 className="font-serif font-bold text-xl mb-2">
                    {tl(language, prize.title_fr, prize.title_ar, prize.title_en)}
                  </h3>
                  <div className={`text-3xl font-bold mb-2 ${prize.place === 1 ? 'text-[#133059]' : 'text-[#e8c97a]'}`}>
                    {Number(prize.amount).toLocaleString()} DA
                  </div>
                  <p className={`text-sm ${prize.place === 1 ? 'text-[#133059]/70' : 'text-white/60'}`}>
                    {tl(language, prize.description_fr, prize.description_ar, prize.description_en)}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Special prizes */}
            {specialPrizes.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={stagger}
                className="max-w-4xl mx-auto space-y-4"
              >
                {specialPrizes.map((prize) => (
                  <motion.div
                    key={prize.id}
                    variants={fadeUp}
                    className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-[#e8c97a]/20"
                  >
                    <Medal size={28} className="text-[#e8c97a] flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-serif font-bold text-white text-lg">
                        {tl(language, prize.title_fr, prize.title_ar, prize.title_en)}
                      </h4>
                      <p className="text-white/60 text-sm">
                        {tl(language, prize.description_fr, prize.description_ar, prize.description_en)}
                      </p>
                    </div>
                    <div className="text-[#e8c97a] font-bold text-xl">
                      {Number(prize.amount).toLocaleString()} DA
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ═══════ 5. REGISTRATION CTA ═══════ */}
      {activeEvent && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={stagger}
            >
              {/* Info cards */}
              <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
                  <Clock size={28} className="text-[#e8c97a] mx-auto mb-3" />
                  <div className="font-bold text-[#133059]">
                    {activeEvent.registration_deadline ? formatDate(activeEvent.registration_deadline) : 'N/A'}
                  </div>
                  <div className="text-slate-500 text-sm">{tl(language, 'Date limite', '\u0627\u0644\u0645\u0648\u0639\u062f \u0627\u0644\u0646\u0647\u0627\u0626\u064a', 'Deadline')}</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
                  <Users size={28} className="text-[#e8c97a] mx-auto mb-3" />
                  <div className="font-bold text-[#133059]">{activeEvent.max_teams}</div>
                  <div className="text-slate-500 text-sm">{tl(language, '\u00c9quipes max', '\u0623\u0642\u0635\u0649 \u0639\u062f\u062f \u0627\u0644\u0641\u0631\u0642', 'Max Teams')}</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
                  <Mail size={28} className="text-[#e8c97a] mx-auto mb-3" />
                  <div className="font-bold text-[#133059] text-sm">{activeEvent.contact_email}</div>
                  <div className="text-slate-500 text-sm">{tl(language, 'Contact', '\u0627\u0644\u062a\u0648\u0627\u0635\u0644', 'Contact')}</div>
                </div>
              </motion.div>

              {/* CTA Box */}
              <motion.div
                variants={fadeUp}
                className="relative rounded-3xl overflow-hidden max-w-4xl mx-auto"
                style={{ background: 'linear-gradient(135deg, #133059 0%, #0a1e38 100%)' }}
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(232,201,122,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(232,201,122,0.3) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#e8c97a]/10 blur-3xl"
                />
                <div className="relative z-10 p-12 text-center">
                  <h3 className="text-3xl font-serif font-bold text-white mb-4">
                    {tl(language, 'Pr\u00eat \u00e0 relever le d\u00e9fi ?', '\u0647\u0644 \u0623\u0646\u062a \u0645\u0633\u062a\u0639\u062f \u0644\u0644\u062a\u062d\u062f\u064a\u061f', 'Ready for the challenge?')}
                  </h3>
                  <p className="text-white/70 mb-8 max-w-lg mx-auto">
                    {tl(
                      language,
                      "Inscrivez votre \u00e9quipe d\u00e8s maintenant et participez \u00e0 une exp\u00e9rience unique.",
                      '\u0633\u062c\u0644 \u0641\u0631\u064a\u0642\u0643 \u0627\u0644\u0622\u0646 \u0648\u0634\u0627\u0631\u0643 \u0641\u064a \u062a\u062c\u0631\u0628\u0629 \u0641\u0631\u064a\u062f\u0629.',
                      'Register your team now and participate in a unique experience.',
                    )}
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-10 py-4 bg-[#e8c97a] text-[#133059] rounded-full font-bold text-lg hover:bg-[#d4b56a] transition-colors shadow-lg shadow-[#e8c97a]/20"
                  >
                    {tl(language, "S'inscrire maintenant", '\u0633\u062c\u0644 \u0627\u0644\u0622\u0646', 'Register Now')}
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════ 6. PAST EDITIONS ═══════ */}
      {pastEvents.length > 0 && (
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#133059]/5 text-[#133059] text-sm font-medium mb-4">
                  <Star size={14} className="text-[#e8c97a]" />
                  {tl(language, 'Archives', '\u0627\u0644\u0623\u0631\u0634\u064a\u0641', 'Archives')}
                </span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-serif font-bold text-[#133059] mb-4">
                {tl(language, '\u00c9ditions Pr\u00e9c\u00e9dentes', '\u0627\u0644\u0646\u0633\u062e \u0627\u0644\u0633\u0627\u0628\u0642\u0629', 'Past Editions')}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-500 max-w-lg mx-auto">
                {tl(
                  language,
                  'D\u00e9couvrez les projets et gagnants des \u00e9ditions pr\u00e9c\u00e9dentes.',
                  '\u0627\u0643\u062a\u0634\u0641 \u0645\u0634\u0627\u0631\u064a\u0639 \u0648\u0641\u0627\u0626\u0632\u064a \u0627\u0644\u0646\u0633\u062e \u0627\u0644\u0633\u0627\u0628\u0642\u0629.',
                  'Discover the projects and winners from previous editions.',
                )}
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {pastEvents.map((ev) => (
                <PastEditionCard
                  key={ev.id}
                  event={ev}
                  prizes={prizes.filter((p) => p.event === ev.id)}
                  winners={winners.filter((w) => w.event === ev.id)}
                  gallery={gallery.filter((g) => g.event === ev.id)}
                  themes={themes.filter((t) => t.event === ev.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
