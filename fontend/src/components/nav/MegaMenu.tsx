import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap, BookOpen, CalendarDays, School, Building, Users, Award,
  UserPlus, Archive, Presentation, Hammer, Medal, Music, Dumbbell,
  Sparkles, UserCircle, Landmark, Compass, ScrollText, Settings, Network,
  HelpCircle, TrendingUp
} from 'lucide-react';

interface MegaMenuProps {
  id: string;
  onClose: () => void;
}

const icons: Record<string, any> = {
  director: UserCircle,
  school: School,
  museum: Landmark,
  legal: ScrollText,
  team: Users,
  campus: Building,
  board: Landmark,
  committee: Compass,
  graduation: GraduationCap,
  research: BookOpen,
  partnerships: UserPlus,
  awards: Award,
  network: Network,
  help: HelpCircle,
  settings: Settings,
  trending: TrendingUp,
  calendar: CalendarDays,
  archive: Archive,
  presentation: Presentation,
  hammer: Hammer,
  medal: Medal,
  music: Music,
  dumbbell: Dumbbell,
};

const MenuLink = ({ to, icon, text, onClick }: {
  to: string;
  icon: string | React.ReactNode;
  text: string;
  onClick?: () => void;
}) => {
  const Icon = typeof icon === 'string' ? icons[icon] : null;
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className="flex items-center gap-3 py-2 px-4 rounded hover:bg-white/10 hover:text-[#e8c97a] transition-colors duration-200"
      >
        {Icon && <Icon size={18} className="text-[#e8c97a]" />}
        <span className="text-sm">{text}</span>
      </Link>
    </li>
  );
};

/* ── "En savoir plus" label in all 3 languages ── */
const LEARN_MORE: Record<string, string> = {
  fr: 'En savoir plus →',
  ar: 'اكتشف المزيد →',
  en: 'Learn more →',
};

const MegaMenu = ({ id, onClose }: MegaMenuProps) => {
  const { language, t } = useLanguage();
  const { user } = useAuth() as any;
  const menuRef = useRef<HTMLDivElement>(null);
  //const isAr = language === 'ar';
  const lang = language as 'fr' | 'ar' | 'en';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const sections = {
    about: {
      title: t('aboutTitle'),
      achievements: t('achievements'),
      whyTitle: t('whyChooseUs'),
      whyText: {
        fr: 'École nationale d\'excellence avec plus de 30 ans dans la formation en transmissions.',
        ar: 'مدرسة وطنية رائدة بأكثر من 30 سنة من التميز في التكوين في مجال المواصلات السلكية واللاسلكية.',
        en: 'A leading national school with over 30 years of excellence in transmissions training.',
      }[lang],
      left: [
        { to: '/about/director', icon: 'director', text: t('directorMessage') },
        { to: '/about', icon: 'school', text: t('aboutSchool') },
        { to: '/about/museum', icon: 'museum', text: t('museum') },
        { to: '/about/legal', icon: 'legal', text: t('legalTexts') },
        { to: '/about/team', icon: 'team', text: t('ourTeam') },
        { to: '/about/campus', icon: 'campus', text: t('campus') },
      ],
      right: [
        { to: '/about/board', icon: 'board', text: t('boardOfDirectors') },
        { to: '/about/committee', icon: 'committee', text: t('steeringCommittee') },
        { to: '/about/alumni-success', icon: 'graduation', text: t('alumniSuccess') },
        ...(user?.is_staff ? [{ to: '/admin/alumni', icon: 'settings', text: t('adminAlumni') }] : []),
        { to: '/about/partnerships', icon: 'partnerships', text: t('partnerships') },
      ],
    },
    formation: {
      leftTitle: t('specializedTraining'),
      rightTitle: t('continuingTraining'),
      featuredTitle: {
        fr: 'Programme rigoureusement élaboré et encadré par le ministère de l\'Intérieur',
        ar: 'برنامج مدروس بدقة ومسطر من طرف وزارة الداخلية',
        en: 'Program rigorously developed and supervised by the Ministry of Interior',
      }[lang],
      featuredText: t('advancedTransmissions'),
      featured: { to: '/formation', icon: 'graduation', text: t('allPrograms') },
      left: [
        { to: '/formation/specialized-technical-inspector', icon: 'network', text: t('specializedTechnicalInspector') },
        { to: '/formation/specialized-technical-assistant', icon: 'help', text: t('specializedTechnicalAssistant') },
        { to: '/formation/agent-exploitation', icon: 'settings', text: t('operationsAgent') },
      ],
      right: [
        { to: '/formation/preparatory-training', icon: 'graduation', text: t('preparatoryTraining') },
        { to: '/formation/pre-promotion-training', icon: 'trending', text: t('prePromotion') },
        { to: '/formation/continuous-training', icon: 'book', text: t('skillImprovement') },
      ],
    },
    events: {
      leftTitle: t('eventsByDate'),
      rightTitle: t('eventTypes'),
      featuredTitle: t('eventsFeatured'),
      featuredText: t('eventsHackathon'),
      featuredDesc: t('eventsHackathonDesc'),
      badge: t('new'),
      left: [
        { to: '/events/upcoming', icon: 'calendar', text: t('upcomingEvents') },
        { to: '/events/past', icon: 'archive', text: t('pastEvents') },
        { to: '/events/annual', icon: 'clock', text: t('annualEvents') },
      ],
      right: [
        { to: '/events/conferences', icon: 'presentation', text: t('eventsConferences') },
        { to: '/events/workshops', icon: 'hammer', text: t('eventsWorkshops') },
        { to: '/events/competitions', icon: 'medal', text: t('eventsCompetitions') },
        { to: '/events/cultural', icon: 'music', text: t('eventsCultural') },
        { to: '/events/sports', icon: 'dumbbell', text: t('eventsSports') },
        { to: '/events/graduation', icon: 'graduation', text: t('eventsGraduation') },
        { to: '/events/open-days', icon: 'building', text: t('eventsOpenDays') },
        { to: '/events/career-fair', icon: 'users', text: t('eventsCareerFair') },
      ],
    },
  }[id];

  if (!sections) return null;

  const isAbout = id === 'about';

  return (
    <div ref={menuRef} className="w-full bg-[#002b5c] border-t border-[#e8c97a]/30 shadow-2xl text-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
        <div className="grid md:grid-cols-3 gap-10">

          {/* Column 1 */}
          <div>
            <h3 className="text-[#e8c97a] font-bold text-lg mb-5 uppercase tracking-wide border-b border-[#e8c97a]/40 pb-2.5">
              {isAbout ? sections.title : sections.leftTitle || sections.title}
            </h3>
            <ul className="space-y-1.5">
              {sections.left?.map((item: any) => (
                <MenuLink key={item.to} {...item} onClick={onClose} />
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-[#e8c97a] font-bold text-lg mb-5 uppercase tracking-wide border-b border-[#e8c97a]/40 pb-2.5">
              {isAbout ? sections.achievements : sections.rightTitle || sections.achievements}
            </h3>
            <ul className="space-y-1.5">
              {sections.right?.map((item: any) => (
                <MenuLink key={item.to} {...item} onClick={onClose} />
              ))}
            </ul>
          </div>

          {/* Featured column */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-7 border border-[#e8c97a]/20">
            <h3 className="text-[#e8c97a] font-bold text-lg mb-4">
              {sections.featuredTitle || sections.whyTitle}
            </h3>
            <p className="text-white/85 text-sm mb-4 leading-relaxed">
              {sections.featuredText || sections.whyText}
            </p>

            {(id === 'formation' || id === 'events') && (
              <span className="inline-block bg-[#e8c97a]/15 text-[#e8c97a] text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
                {id === 'events' && <Sparkles size={14} className="inline mr-2" />}
                {sections.badge}
              </span>
            )}

            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              {sections.featuredDesc}
            </p>

            {/* ── Trilingual "learn more" link ── */}
            <Link
              to={
                id === 'formation' ? '/formation' :
                id === 'events'    ? '/Hackathon' :
                '/about'
              }
              onClick={onClose}
              className="inline-flex items-center gap-2 text-[#e8c97a] hover:text-white text-sm font-medium transition-colors"
            >
              {LEARN_MORE[lang]}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
