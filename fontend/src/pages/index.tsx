import  { useState, useEffect } from "react";
import HeadBanner from "../components/HeadBanner";
import Navbar from "../components/Navbar";

// Hero section with modern design
const Hero = () => (
  <section className="relative flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 py-4 md:py-8">
    {/* Decorative background shapes */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-16 -left-16 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-60 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full blur-2xl opacity-40 animate-pulse" />
    </div>
    <div className="md:w-1/2 mb-12 md:mb-0 z-10">
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight drop-shadow-lg">
        votre avenir <span className="text-indigo-600">avec nous</span>
      </h1>
      <p className="text-xl text-gray-700 mb-8 max-w-lg">
        Plateforme innovante pour l'éducation, la formation et la réussite.
        Découvrez nos services et rejoignez une communauté dynamique.
      </p>
      <a
        href="#"
        className="inline-block bg-gradient-to-r from-[#133059] to-[#0a2342] text-white px-8 py-4 rounded-xl shadow-lg hover:scale-105 hover:from-[#0a2342] hover:to-[#133059] transition-transform duration-200 font-semibold text-lg"
      >
        
      </a>
    </div>
    <div className="md:w-1/2 flex justify-center z-10">
      <div className="relative">
        <img
          src="https://source.unsplash.com/600x400/?education,technology,modern"
          alt="Hero"
          className="rounded-3xl shadow-2xl w-full max-w-md border-4 border-white"
        />
        <div className="absolute -bottom-6 -right-6 bg-white rounded-full p-4 shadow-xl">
          <svg
            className="w-8 h-8 text-indigo-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      </div>
    </div>
  </section>
);

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <HeadBanner />
      <Navbar isScrolled={isScrolled} />
      <Hero />
    </div>
  );
}
