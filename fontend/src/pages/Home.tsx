

import HeroSection from '@/components/home/HeroSection';


import ENTsection from '@/components/home/ENTsection';
import DirectorSection from '@/components/home/DirectorSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import EventsNews from '@/components/home/Events-new';
import FaqSection from '@/components/home/FaqSection';

const Home = () => {
 
  return (
    // 1. Removed text-white from here to let components manage their own colors
    <div className="min-h-screen bg-white overflow-x-hidden">
      
      {/* 2. Hero Section: Removed h-screen to prevent layout breaking */}
      <section className="relative w-full">
        <HeroSection />
      </section>
      <DirectorSection />
      {/* 3. Main Content: Added spacing between sections */}
      <main className="flex flex-col gap-10 md:gap-20">
         <ENTsection />
        <div className="bg-slate-50 py-16">
           <EventsNews />
        </div>
      {/* Sections grouped for a logical user journey */}
         <FaqSection />

        <ReviewsSection />

      </main>
    </div>
  );
};

export default Home;
