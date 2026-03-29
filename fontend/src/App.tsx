import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { ReservationProvider } from '@/context/ReservationContext';
import '@/styles/day-picker-override.css';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Formation from '@/pages/Formation';
import EventsFiltered from '@/pages/Events-filtered';
import EventDetail from '@/pages/EventDetail';
import LifeStudy from '@/pages/LifeStudy';
import Bibliotheque from '@/pages/Bibliotheque';
import OHB from '@/pages/OHB';
import DirectorMessage from '@/pages/DirectorMessage';
import BoardOfDirectors from '@/pages/BoardOfDirectors';
import AboutSchool from '@/pages/AboutSchool';
import Team from '@/pages/Team';
import SteeringCommittee from '@/pages/SteeringCommittee';
import Museum from '@/pages/Museum';
import MuseumEquipment from '@/pages/MuseumEquipment';
import MuseumFigures from '@/pages/MuseumFigures';
import MuseumHistory from '@/pages/MuseumHistory';
import MuseumTraining from '@/pages/MuseumTraining';
import LegalTexts from '@/pages/LegalTexts';
import SpecializedTechnicalInspector from '@/pages/SpecializedTechnicalInspector';
import SpecializedTechnicalAssistant from '@/pages/SpecializedTechnicalAssistant';
import AgentExploitation from '@/pages/AgentExploitation';
import PreparatoryTraining from '@/pages/PreparatoryTraining';
import PrePromotionTraining from '@/pages/PrePromotionTraining';
import ContinuousTraining from '@/pages/ContinuousTraining';

import CourseDetail from '@/pages/CourseDetail';
import OHBCourseDetail from '@/pages/OHBCourseDetail';
import NewsDetail from '@/pages/NewsDetail';
//import SignIn from '@/pages/SignIn';
//import SignUp from '@/pages/SignUp';
//import Profile from '@/pages/Profile';
import AlumniSuccess from '@/pages/AlumniSuccess';
import AlumniDetail from '@/pages/AlumniDetail';
import Contact from '@/pages/Contact';
import Partnerships from '@/pages/Partnerships';
import Campus from '@/pages/Campus';
import BestCourses from '@/components/home/BestCourses';
import NotFound from '@/pages/NotFound';

import HackathonPage from '@/pages/HackathonPage';


function App() {
  // Set the document title
  useEffect(() => {
    document.title = "Ecole National des Transmission | Education Professionel";
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <LanguageProvider>
        <AuthProvider>
          <ReservationProvider>
            <BrowserRouter future={{ v7_startTransition: true }}>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/about/director" element={<DirectorMessage />} />
                  <Route path="/about/board" element={<BoardOfDirectors />} />
                  <Route path="/about/school" element={<AboutSchool />} />
                  <Route path="/about/team" element={<Team />} />
                  <Route path="/about/campus" element={<Campus />} />
                  <Route path="/about/committee" element={<SteeringCommittee />} />
                  <Route path="/about/museum" element={<Museum />} />
                  <Route path="/about/museum/equipment" element={<MuseumEquipment />} />
                  <Route path="/about/museum/figures" element={<MuseumFigures />} />
                  <Route path="/about/museum/history" element={<MuseumHistory />} />
                  <Route path="/about/museum/training" element={<MuseumTraining />} />
                  <Route path="/about/legal" element={<LegalTexts />} />
                  <Route path="/about/alumni-success" element={<AlumniSuccess />} />
                  <Route path="/about/alumni-success/:id" element={<AlumniDetail />} />
                  <Route path="/about/partnerships" element={<Partnerships />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/formation" element={<Formation />} />
                  <Route path="/formation/best-courses" element={<BestCourses />} />
                  <Route path="/formation/specialized-technical-inspector" element={<SpecializedTechnicalInspector />} />
                  
                  <Route path="/formation/specialized-technical-assistant" element={<SpecializedTechnicalAssistant />} />
                  <Route path="/formation/agent-exploitation" element={<AgentExploitation />} />
                  <Route path="/formation/preparatory-training" element={<PreparatoryTraining />} />
                  <Route path="/formation/pre-promotion-training" element={<PrePromotionTraining />} />
                  <Route path="/formation/continuous-training" element={<ContinuousTraining />} />
                  <Route path="/formation/course/:courseId" element={<CourseDetail />} />
                  <Route path="/events" element={<EventsFiltered />} />
                  <Route path="/events/:eventType" element={<EventsFiltered />} />
                   <Route path="/events/detail/:slug" element={<EventDetail />} />
                  
                   <Route path="/Hackathon" element={<HackathonPage />} />

                   
                   <Route path="/news/:slug" element={<NewsDetail />} />
                  <Route path="/life-study" element={<LifeStudy />} />
                  <Route path="/bibliotheque" element={<Bibliotheque />} />
                  <Route path="/ohb" element={<OHB />} />
                  <Route path="/ohb/formation/:slug" element={<OHBCourseDetail />} />
                  <Route path="/ohb/course/:courseId" element={<OHBCourseDetail />} />
                  {/* <Route path="/test" element={<TestPage />} /> */}
                  {/* <Route path="/sign-in" element={<SignIn />} />*/}
                  {/* <Route path="/sign-up" element={<SignUp />} />*/}
                 {/*  <Route path="/profile" element={<Profile />} />*/}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
              <Toaster />
            </BrowserRouter>
          </ReservationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;