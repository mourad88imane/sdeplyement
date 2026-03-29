import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
// 1. Import des icônes nécessaires
import { Facebook, Linkedin, Twitter } from 'lucide-react';
import { API_BASE_URL, BACKEND_URL } from '@/services/api';

type Language = 'fr' | 'ar' | 'en';
type BannerTextField = 'text1' | 'text2' | 'text3';
type BannerTextKey = `${BannerTextField}_${Language}`;

interface Banner {
  id: number;
  text1_fr?: string; text1_en?: string; text1_ar?: string;
  text2_fr?: string; text2_en?: string; text2_ar?: string;
  text3_fr?: string; text3_en?: string; text3_ar?: string;
  image_left?: string;
  image_right?: string;
  is_active: boolean;
}

const HeadBanner = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    fetch(`${API_BASE_URL}/banner/active/`)
      .then(res => res.json())
      .then(data => { if (data?.results?.length > 0) setBanner(data.results[0]); });
  }, []);

  if (!banner) return null;

  const getTxt = (f: BannerTextField): string => {
    const key = `${f}_${language}` as BannerTextKey;
    return banner[key] || '';
  };

  return (
    <div className="w-full bg-[#002b5c] text-white py-2 px-6 md:px-10 border-b border-[#c9a84c]/30">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        
        {/* Logos & Réseaux Sociaux (Gauche) */}
        <div className="flex items-center gap-6 flex-1">
          {banner.image_left && (
            <img src={banner.image_left.startsWith('http') ? banner.image_left : `${BACKEND_URL}${banner.image_left}`} className="h-10 md:h-12 object-contain" alt="Logo L" />
          )}
          <div className="hidden lg:flex items-center gap-3 border-l border-white/20 pl-6 text-[#c9a84c]">
            <Facebook size={16} className="hover:text-white cursor-pointer" />
            <Twitter size={16} className="hover:text-white cursor-pointer" />
            <Linkedin size={16} className="hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Texte Centralisé (Empilé) */}
        <div className="flex flex-col items-center text-center flex-[2] gap-0.5">
          <span className="text-[10px] md:text-xs font-bold text-[#c9a84c] uppercase tracking-widest leading-none">
            {getTxt('text1')}
          </span>
          <span className="text-[9px] md:text-[11px] text-white font-medium leading-none">
            {getTxt('text2')}
          </span>
          <span className="text-lg md:text-xl font-bold text-[#c9a84c] mt-1 border-b-2 border-primary  italic leading-none inline-block pb-1 ">
            {getTxt('text3')}
          </span>
        </div>

        {/* Logo Droite */}
        <div className="flex-1 flex justify-end">
          {banner.image_right && (
            <img src={banner.image_right.startsWith('http') ? banner.image_right : `${BACKEND_URL}${banner.image_right}`} className="h-10 md:h-12 object-contain" alt="Logo R" />
          )}
        </div>
      </div>
    </div>
  );
};

export default HeadBanner;