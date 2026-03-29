import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Phone, Linkedin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TeamMember {
    id: number;
    full_name: string;
    role_fr: string;
    role_ar: string;
    description_fr: string;
    description_ar: string;
    photo: string | null;
    email: string;
    phone: string;
    linkedin: string;
    is_director: boolean;
    courses_taught: string;
}


const OurTeam = () => {
    const { language } = useLanguage();
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get API URL from environment or default to localhost
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/users/team/`);
                let members: TeamMember[] = [];

                // Handle paginated response (DRF default) or flat array
                if (response.data.results) {
                    members = response.data.results;
                } else if (Array.isArray(response.data)) {
                    members = response.data;
                } else {
                    console.error("Unexpected API response format:", response.data);
                    members = [];
                }

                // Sort: Admin (Director) first, then by order (handled by backend)
                // Backend order is: order, created_at
                // We can just rely on backend order, or force director to top checks:
                members.sort((a, b) => {
                    if (a.is_director && !b.is_director) return -1;
                    if (!a.is_director && b.is_director) return 1;
                    return 0;
                });

                setTeamMembers(members);
            } catch (err) {
                setError('Erreur lors du chargement de l\'équipe.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    // if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-green-900 dark:text-green-100">
                        {language === 'ar' ? 'فريقنا' : 'Notre Équipe'}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {language === 'ar'
                            ? 'تعرف على الخبراء والمتخصصين الذين يقودون التميز في مدرستنا'
                            : 'Rencontrez les experts et professionnels qui font l\'excellence de notre école'}
                    </p>
                </div>

                {teamMembers.length === 0 && !error && (
                    <div className="text-center text-muted-foreground">
                        {language === 'ar' ? 'لا يوجد أعضاء في الفريق حاليا.' : 'Aucun membre d\'équipe pour le moment.'}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-green-100 dark:border-green-900"
                        >
                            <div className="relative h-64 bg-green-50 overflow-hidden">
                                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                                {member.photo ? (
                                    <img
                                        src={member.photo}
                                        alt={member.full_name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-green-200 text-6xl font-bold text-green-800">
                                        {member.full_name.charAt(0)}
                                    </div>
                                )}
                                {member.is_director && (
                                    <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                        {language === 'ar' ? 'المدير' : 'Directeur'}
                                    </div>
                                )}
                            </div>

                            <div className="p-6 text-center">
                                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                                    {member.full_name}
                                </h3>
                                <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
                                    {language === 'ar' ? member.role_ar : member.role_fr}
                                </Badge>

                                <p className="text-muted-foreground mb-4 text-sm line-clamp-3">
                                    {language === 'ar' ? member.description_ar : member.description_fr}
                                </p>

                                {member.courses_taught && (
                                    <div className="mb-6">
                                        <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                                            {language === 'ar' ? 'يدرس:' : 'Enseigne:'}
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {member.courses_taught}
                                        </p>
                                    </div>
                                )}


                                <div className="space-y-3 border-t pt-6 border-gray-100 dark:border-gray-800">
                                    {member.email && (
                                        <a href={`mailto:${member.email}`} className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-green-700 transition-colors">
                                            <Mail className="w-4 h-4" />
                                            {member.email}
                                        </a>
                                    )}
                                    {member.phone && (
                                        <a href={`tel:${member.phone}`} className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-green-700 transition-colors">
                                            <Phone className="w-4 h-4" />
                                            {member.phone}
                                        </a>
                                    )}
                                    {member.linkedin && (
                                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
                                            <Linkedin className="w-4 h-4" />
                                            LinkedIn
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default OurTeam;
