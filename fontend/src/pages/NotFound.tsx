import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold mt-6 mb-3">{t('pageNotFound')}</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {t('pageNotFoundDesc')}
        </p>
        <Button asChild>
          <Link to="/" className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('returnToHomepage')}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;