import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Sponsor } from '@/data/mockData';

interface SponsorsSliderProps {
  sponsors: Sponsor[];
}

const SponsorsSlider = ({ sponsors }: SponsorsSliderProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <div ref={ref} className="overflow-hidden py-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="flex justify-center flex-wrap gap-8 md:gap-12"
      >
        {sponsors.map((sponsor) => (
          <motion.div
            key={sponsor.id}
            variants={itemVariants}
            className="flex flex-col items-center"
          >
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-background p-4 flex items-center justify-center shadow-sm overflow-hidden">
              <img 
                src={sponsor.logo} 
                alt={sponsor.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-3 text-sm text-muted-foreground">{sponsor.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SponsorsSlider;