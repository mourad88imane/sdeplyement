import { useEffect, useState } from 'react';
import { Linkedin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';


interface TeamMember {
  id: number;
  name_fr: string;
  name_ar?: string;
  name_en?: string;
  role_fr: string;
  role_ar?: string;
  role_en?: string;
  bio_fr: string;
  bio_ar?: string;
  bio_en?: string;
  photo?: string;
  linkedin?: string;
  email?: string;
}

const Team = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    fetch('http://localhost:8000/api/team/')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTeam(data);
        else if (data && Array.isArray(data.results)) setTeam(data.results);
        else setTeam([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-[250px] bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-green-900 mb-8">
          {lang === 'ar' ? 'فريقنا' : lang === 'en' ? 'Our Team' : 'Notre Équipe'}
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {lang === 'ar'
            ? 'تعرف على أعضاء الفريق الذين يدفعون مؤسستنا إلى الأمام باحترافية وابتكار.'
            : lang === 'en'
            ? 'Meet the passionate team members driving our institution forward with professionalism and innovation.'
            : 'Découvrez les membres passionnés qui font avancer notre institution avec professionnalisme et innovation.'}
        </p>
        {loading ? (
          <div className="text-center text-gray-500">
            {lang === 'ar' ? 'جاري التحميل...' : lang === 'en' ? 'Loading...' : 'Chargement...'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {team.map(member => {
              let name = member.name_fr;
              let role = member.role_fr;
              let bio = member.bio_fr;
              if (lang === 'ar') {
                name = member.name_ar || member.name_fr;
                role = member.role_ar || member.role_fr;
                bio = member.bio_ar || member.bio_fr;
              } else if (lang === 'en') {
                name = member.name_en || member.name_fr;
                role = member.role_en || member.role_fr;
                bio = member.bio_en || member.bio_fr;
              }
              return (
                <div key={member.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow">
                  <div className="w-28 h-28 mb-4 rounded-full overflow-hidden border-4 border-green-200 bg-gray-100 flex items-center justify-center">
                    {member.photo ? (
                      <img src={member.photo.startsWith('http') ? member.photo : `http://localhost:8000${member.photo}`} alt={name} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-5xl text-green-900 font-bold">{name ? name[0] : '?'}</span>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-green-900 mb-1 text-center">{name}</h2>
                  <h3 className="text-green-700 text-sm font-medium mb-2 text-center">{role}</h3>
                  <p className="text-gray-600 text-center text-sm mb-3 line-clamp-3">{bio}</p>
                  <div className="flex gap-3 mt-auto">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-900">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-green-700 hover:text-green-900 text-sm underline">Email</a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Team;
