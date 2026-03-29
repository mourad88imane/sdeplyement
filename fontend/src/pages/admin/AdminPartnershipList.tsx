import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Partnership } from '@/data/PartnershipTypes';
import { partnershipService } from '@/services/PartnershipService';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const AdminPartnershipList = () => {
  useLanguage();
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchPartnerships();
  }, []);

  const fetchPartnerships = async () => {
    try {
      const data = await partnershipService.getAll();
      setPartnerships(data);
    } catch (err) {
      setError('Failed to load partnerships');
      console.error('Error fetching partnerships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this partnership?')) {
      return;
    }

    setDeletingId(id);
    try {
      await partnershipService.delete(id);
      setPartnerships(partnerships.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete partnership');
      console.error('Error deleting partnership:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="w-full max-w-7xl mx-auto px-6 rtl:px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Partnerships Management</h1>
            <p className="text-muted-foreground">Manage your organization's partnerships</p>
          </div>
          <Button asChild>
            <Link to="/admin/partners/create" className="inline-flex items-center">
              <Plus className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" />
              Add Partnership
            </Link>
          </Button>
        </div>

        {/* Partnerships List */}
        {partnerships.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground text-lg mb-4">No partnerships found</p>
            <Button asChild variant="outline">
              <Link to="/admin/partners/create">Create your first partnership</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerships.map((partnership, index) => (
              <motion.div
                key={partnership.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="aspect-square flex items-center justify-center mb-4 bg-muted/30 rounded-lg">
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${partnership.logo}`}
                      alt={partnership.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-logo.png';
                      }}
                    />
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg line-clamp-2">{partnership.name}</h3>

                    {partnership.website && (
                      <a
                        href={partnership.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:text-primary/80 text-sm transition-colors"
                      >
                        <ExternalLink className="mr-1 rtl:mr-0 rtl:ml-1 h-3 w-3" />
                        Website
                      </a>
                    )}

                    {partnership.description && (
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {partnership.description}
                      </p>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(partnership.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-4 flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to={`/admin/partners/${partnership.id}/edit`}>
                      <Edit className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(partnership.id)}
                    disabled={deletingId === partnership.id}
                    className="flex-1"
                  >
                    <Trash2 className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" />
                    {deletingId === partnership.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPartnershipList;