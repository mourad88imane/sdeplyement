import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { NewsAPI } from '@/services/api';

// Type definitions for alumni data
interface AlumniPhoto {
  id: number;
  image: string;
  caption_fr?: string;
  caption_ar?: string;
}

interface AlumniData {
  id: number;
  slug: string;
  title_fr: string;
  year?: number;
  published_at?: string;
  photos?: AlumniPhoto[];
}

interface PhotosAlumniState {
  slug: string;
  title_fr: string;
  photos: AlumniPhoto[];
}

const AdminAlumniList = () => {
  const { user, token } = useAuth() as any;
  const navigate = useNavigate();
  const [items, setItems] = useState<AlumniData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // photo modal state
  const [photosAlumni, setPhotosAlumni] = useState<PhotosAlumniState | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [captionFr, setCaptionFr] = useState('');
  const [captionAr, setCaptionAr] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await NewsAPI.getAlumni(true, token);
        setItems(data);
      } catch (e: any) {
        setError(e.message || 'Erreur');
      } finally {
        setLoading(false);
      }
    };
    if (user?.is_staff) load();
  }, [user, token]);

  const handleDelete = async (slug: string) => {
    if (!confirm('Supprimer cet élément ?')) return;
    try {
      await NewsAPI.deleteAlumni(token, slug);
      setItems(prev => prev.filter(i => i.slug !== slug));
    } catch (e: any) {
      alert(e.message || 'Erreur lors de la suppression');
    }
  };

  const openPhotos = async (item: any) => {
    if (!item?.slug) return;
    try {
      const data = await NewsAPI.getAlumniBySlug(item.slug, token);
      setPhotosAlumni(data);
      setFile(null);
      setCaptionFr('');
      setCaptionAr('');
    } catch (e: any) {
      alert(e.message || 'Erreur');
    }
  };

  const closePhotos = () => setPhotosAlumni(null);

  const onUpload = async () => {
    if (!file || !photosAlumni?.slug) return alert('Choisissez un fichier');
    try {
      await NewsAPI.uploadAlumniPhoto(token, photosAlumni.slug, file, { caption_fr: captionFr, caption_ar: captionAr });
      const data = await NewsAPI.getAlumniBySlug(photosAlumni.slug, token);
      setPhotosAlumni(data);
      setFile(null);
      setCaptionFr('');
      setCaptionAr('');
    } catch (e: any) {
      alert(e.message || 'Erreur upload');
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Supprimer la photo ?')) return;
    try {
      await NewsAPI.deleteAlumniPhoto(token, id);
      setPhotosAlumni((prev) => {
        if (!prev) return null;
        return { ...prev, photos: prev.photos.filter((p) => p.id !== id) };
      });
    } catch (e: any) {
      alert(e.message || 'Erreur');
    }
  };

  if (!user?.is_staff) return <div className="p-6">Accès refusé. Vous devez être un membre du personnel.</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Gérer les succès des anciens</h2>
        <button onClick={() => navigate('/admin/alumni/create')} className="bg-green-700 text-white px-4 py-2 rounded">Créer</button>
      </div>

      {loading && <div>Chargement…</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="text-left">
              <th className="w-1/3">Titre (FR)</th>
              <th className="w-1/6">Année</th>
              <th className="w-1/6">Publié</th>
              <th className="w-1/3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-t">
                <td className="py-3">{item.title_fr}</td>
                <td>{item.year}</td>
                <td>{item.published_at ? new Date(item.published_at).toLocaleString() : '—'}</td>
                <td>
                  <button onClick={() => navigate(`/admin/alumni/${item.slug}/edit`)} className="mr-2 px-3 py-1 bg-blue-600 text-white rounded">Modifier</button>
                  <button onClick={() => openPhotos(item)} className="mr-2 px-3 py-1 bg-gray-600 text-white rounded">Photos</button>
                  <button onClick={() => handleDelete(item.slug)} className="px-3 py-1 bg-red-600 text-white rounded">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Photos modal */}
      {photosAlumni && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 relative">
            <button onClick={closePhotos} className="absolute right-4 top-4 text-gray-600">Fermer ✕</button>
            <h3 className="text-lg font-semibold mb-4">Photos — {photosAlumni.title_fr}</h3>

            <div className="mb-4">
              <label className="block mb-2">Fichier</label>
              <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
              <div className="mt-2">
                <input placeholder="Caption FR" value={captionFr} onChange={e => setCaptionFr(e.target.value)} className="border p-2 rounded w-full mb-2" />
                <input placeholder="Caption AR" value={captionAr} onChange={e => setCaptionAr(e.target.value)} className="border p-2 rounded w-full" />
              </div>
              <button onClick={onUpload} className="mt-2 bg-green-700 text-white px-3 py-1 rounded">Upload</button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {photosAlumni.photos?.length ? photosAlumni.photos.map((p) => (
                <div key={p.id} className="border p-2 rounded">
                  <img src={p.image} alt={p.caption_fr || ''} className="w-full h-32 object-cover mb-2" />
                  <div className="text-sm mb-2">{p.caption_fr}</div>
                  <button onClick={() => onDelete(p.id)} className="bg-red-600 text-white px-2 py-1 rounded">Supprimer</button>
                </div>
              )) : <div>Aucune photo</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAlumniList;
