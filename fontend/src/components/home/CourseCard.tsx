import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { Course } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, Clock, User, Star } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  index?: number;
}

const CourseCard = ({ course, index = 0 }: CourseCardProps) => {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  // ✨ MEMOIZATION
  const levelConfig = useMemo(() => {
    const configs: Record<string, { color: string; bg: string; text: string }> = {
      'Advanced': { color: '#e8c97a', bg: 'from-[#e8c97a]/20 to-[#e8c97a]/0', text: 'Advanced Level' },
      'Intermediate': { color: '#133059', bg: 'from-[#133059]/20 to-[#133059]/0', text: 'Intermediate Level' },
      'Beginner': { color: '#64748b', bg: 'from-[#64748b]/20 to-[#64748b]/0', text: 'Beginner Level' },
    };
    return configs[course.level] || configs['Beginner'];
  }, [course.level]);

  const ctalabels = useMemo(() => ({
    en: 'Learn More',
    ar: 'اعرف المزيد',
    fr: 'En Savoir Plus',
  }), []);

  const handleClick = () => {
    if (course.id === 'course-specialized-inspector') {
      navigate('/formation/specialized-technical-inspector');
    } else if (course.id === 'course-specialized-assistant') {
      navigate('/formation/specialized-technical-assistant');
    } else {
      navigate(`/formation/course/${course.id}`);
    }
  };

  // ✨ ANIMATION VARIANTS
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: 'easeOut',
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  const ratingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const starVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="h-full"
    >
      <div className="relative h-full bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer" onClick={handleClick}>
        
        {/* ✨ IMAGE SECTION */}
        <motion.div
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300"
        >
          {/* Image with lazy loading */}
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
            decoding="async"
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 group-hover:from-black/40 group-hover:to-black/60 transition-all duration-500" />
          
          {/* Decorative corner on hover */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-[#e8c97a]/30 to-[#e8c97a]/0 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Level Badge */}
          <motion.div
            className="absolute top-4 right-4 z-10"
            whileHover={{ scale: 1.05 }}
          >
            <div
              className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest border-2 backdrop-blur-md transition-all duration-300 ${
                course.level === 'Advanced'
                  ? 'bg-gradient-to-r from-[#e8c97a]/90 to-[#d4a574]/90 text-[#133059] border-[#e8c97a]'
                  : course.level === 'Intermediate'
                  ? 'bg-gradient-to-r from-[#133059]/90 to-[#0a2342]/90 text-white border-[#133059]'
                  : 'bg-gradient-to-r from-slate-600/90 to-slate-700/90 text-white border-slate-600'
              }`}
              style={{ boxShadow: `0 8px 16px ${levelConfig.color}33` }}
            >
              {course.level}
            </div>
          </motion.div>

          {/* Category Tag - Floating */}
          <motion.div
            className="absolute bottom-4 left-4 z-10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/90 text-[#133059] backdrop-blur-md border border-white/50">
              {course.category}
            </span>
          </motion.div>
        </motion.div>

        {/* ✨ CONTENT SECTION */}
        <div className="flex flex-col h-[calc(100%-14rem)] p-6 md:p-7">
          
          {/* Title */}
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-lg md:text-xl font-bold text-[#133059] mb-3 line-clamp-2 leading-tight group-hover:text-[#e8c97a] transition-colors duration-300"
          >
            {course.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1 group-hover:text-slate-700 transition-colors duration-300"
          >
            {course.description}
          </motion.p>

          {/* Instructor & Duration */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-4 border-b border-slate-200/50"
          >
            <div className="flex items-center gap-2">
              <User size={14} className="text-[#e8c97a]" />
              <span className="font-medium text-slate-700 truncate">{course.instructor}</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Clock size={14} className="text-[#e8c97a]" />
              <span className="font-medium text-slate-700">{course.duration}</span>
            </div>
          </motion.div>

          {/* Rating */}
          <motion.div
            className="flex items-center justify-between mb-5"
            variants={ratingVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="flex gap-1.5">
              {[...Array(5)].map((_, i) => (
                <motion.div key={i} variants={starVariants}>
                  <Star
                    size={18}
                    className={`transition-all duration-300 ${
                      i < Math.round(course.rating || 5)
                        ? 'fill-[#e8c97a] text-[#e8c97a] drop-shadow-lg'
                        : 'text-slate-300 opacity-50'
                    }`}
                  />
                </motion.div>
              ))}
            </motion.div>
            <span className="text-xs font-bold text-[#133059] bg-[#e8c97a]/15 px-3 py-1 rounded-full border border-[#e8c97a]/30">
              {course.rating || 5}.0
            </span>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: '0 12px 24px rgba(19, 48, 89, 0.25)',
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#133059] to-[#0a2342] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg group/btn"
            onClick={handleClick}
          >
            <span className="text-sm">{lang === 'ar' ? ctalabels.ar : lang === 'en' ? ctalabels.en : ctalabels.fr}</span>
            <motion.div
              className="group-hover/btn:translate-x-1 transition-transform duration-300"
              whileHover={{ x: 4 }}
            >
              <ArrowRight size={18} />
            </motion.div>
          </motion.button>
        </div>

        {/* ✨ DECORATIVE ELEMENTS */}
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#e8c97a]/10 to-[#e8c97a]/0 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-[#133059]/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      <style>{`
        /* ✨ PERFORMANCE OPTIMIZATIONS */
        img {
          content-visibility: auto;
          contain-intrinsic-size: auto 224px;
        }

        .group:hover {
          transform: none;
        }

        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-xl {
            backdrop-filter: blur(10px);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default CourseCard;
