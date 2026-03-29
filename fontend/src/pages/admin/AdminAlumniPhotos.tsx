import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { NewsAPI } from '@/services/api';

interface AlumniPhoto {
  id: number;
  image: string;
  caption_fr?: string;
  caption_ar?: string;
}

interface AlumniData {
  title_fr?: string;
  photos: AlumniPhoto[];
}

const AdminAlumniPhotos = () => {
  const { slug } = useParams();
  const { user, token } = useAuth() as any;
  const [alumni, setAlumni] = useState<AlumniData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [captionFr, setCaptionFr] = useState('');
  const [captionAr, setCaptionAr] = useState('');

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const data = await NewsAPI.getAlumniBySlug(slug, token);
        setAlumni(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [slug, token]);

  if (!user?.is_staff) return <div className="p-6">Accès refusé. Vous devez être un membre du personnel.</div>;

  const onUpload = async () => {
    if (!file || !slug) return alert('Choisissez un fichier');
    try {
      await NewsAPI.uploadAlumniPhoto(token, slug, file, { caption_fr: captionFr, caption_ar: captionAr });
      // refresh
      const data = await NewsAPI.getAlumniBySlug(slug, token);
      setAlumni(data);
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
      setAlumni((prev: AlumniData | null) => {
        if (!prev) return null;
        return { ...prev, photos: prev.photos.filter((p: AlumniPhoto) => p.id !== id) };
      });
    } catch (e: any) {
      alert(e.message || 'Erreur');
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">Photos — {alumni?.title_fr}</h2>

      <div className="mb-6">
        <label className="block mb-2">Fichier</label>
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
        <div className="mt-2">
          <input placeholder="Caption FR" value={captionFr} onChange={e => setCaptionFr(e.target.value)} className="border p-2 rounded w-full mb-2" />
          <input placeholder="Caption AR" value={captionAr} onChange={e => setCaptionAr(e.target.value)} className="border p-2 rounded w-full" />
        </div>
        <button onClick={onUpload} className="mt-2 bg-green-700 text-white px-3 py-1 rounded">Upload</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {alumni?.photos?.length ? alumni.photos.map((p: AlumniPhoto) => (
          <div key={p.id} className="border p-2 rounded">
            <img src={p.image} alt={p.caption_fr || ''} className="w-full h-32 object-cover mb-2" />
            <div className="text-sm mb-2">{p.caption_fr}</div>
            <button onClick={() => onDelete(p.id)} className="bg-red-600 text-white px-2 py-1 rounded">Supprimer</button>
          </div>
        )) : <div>Aucune photo</div>}
      </div>
    </div>
  );
};

export default AdminAlumniPhotos;
