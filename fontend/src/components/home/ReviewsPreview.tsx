import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ReviewsService } from '@/services/ReviewsService';
import ReviewCard from '@/components/reviews/ReviewCard';
import { Link } from 'react-router-dom';

const ReviewsPreview: React.FC = () => {
  const { language } = useLanguage();
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await ReviewsService.list();
        setReviews(data.filter((r: any) => r.is_published).slice(0, 6));
      } catch (err) {
        console.error('Failed to load reviews', err);
      }
    };
    load();
  }, []);

  if (!reviews.length) return null;

  return (
    <section className="mt-12">
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
            <h1>imane reviews</h1>
          <h3 className="text-2xl font-bold">{language === 'ar' ? 'آراء و شهادات' : 'Avis & Témoignages'}</h3>
          <Link to="/reviews" className="text-sm text-blue-600">{language === 'ar' ? 'المزيد' : 'Voir plus'}</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r: any) => (
            <ReviewCard key={r.id} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsPreview;
