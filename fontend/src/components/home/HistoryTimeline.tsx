import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { HistoryItem } from '@/data/mockData';

interface HistoryTimelineProps {
  timeline: HistoryItem[];
}

const HistoryTimeline = ({ timeline }: HistoryTimelineProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  return (
    <div ref={ref} className="relative max-w-5xl mx-auto">
      {/* Center line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-border -translate-x-1/2"></div>
      
      {/* Timeline items */}
      {timeline.map((item, index) => (
        <motion.div
          key={item.id}
          className={`relative mb-16 md:mb-24 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.6, delay: index * 0.2 }
            }
          }}
        >
          <div 
            className={`flex items-center ${
              index % 2 === 0 
                ? 'md:flex-row-reverse' 
                : 'md:flex-row'
            }`}
          >
            {/* Content */}
            <div className={`md:w-[calc(50%-40px)] p-5 bg-background rounded-lg shadow-sm ${index % 2 === 0 ? 'md:mr-16' : 'md:ml-16'}`}>
              <div className="text-primary font-bold text-xl mb-2">{item.year}</div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
              
              {item.image && (
                <div className="mt-4 rounded-md overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              )}
            </div>
            
            {/* Circle in middle */}
            <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full border-4 border-background"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default HistoryTimeline;