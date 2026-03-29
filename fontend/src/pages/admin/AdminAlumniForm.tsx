import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { NewsAPI } from '@/services/api';

interface AlumniFormData {
  title_fr: string;
  title_ar: string;
  slug: string;
  summary_fr: string;
  summary_ar: string;
  content_fr: string;
  content_ar: string;
  year: string;
  featured: boolean;
  published_at: string;
  featured_image: File | null;
}

const AdminAlumniForm = () => {
  const { user, token } = useAuth() as any;
  const { slug } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<AlumniFormData>({
    title_fr: 'Succès par défaut',
    title_ar: 'نجاح افتراضي',
    slug: '',
    summary_fr: 'Résumé par défaut',
    summary_ar: 'ملخص افتراضي',
    content_fr: 'Contenu par défaut',
    content_ar: 'محتوى افتراضي',
    year: String(new Date().getFullYear()),
    featured: false,
    published_at: '',
    featured_image: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      (async () => {
        try {
          const data = await NewsAPI.getAlumniBySlug(slug, token);
          setForm((prev: AlumniFormData) => ({
            ...prev,
            ...data
          }));
        } catch (e) {
          console.error(e);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!user?.is_staff) return <div className="p-6">Accès refusé. Vous devez être un membre du personnel.</div>;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;
    if (type === 'checkbox') setForm((prev: AlumniFormData) => ({ ...prev, [name]: target.checked }));
    else if (type === 'file') setForm((prev: AlumniFormData) => ({ ...prev, [name]: target.files?.[0] ?? null }));
    else setForm((prev: AlumniFormData) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (slug) {
        await NewsAPI.updateAlumni(token, slug, form);
      } else {
        await NewsAPI.createAlumni(token, form);
      }
      navigate('/admin/alumni');
    } catch (err: any) {
      // Display structured validation errors from DRF when possible
      try {
        if (err && typeof err === 'object') {
          if (err.detail) {
            alert(err.detail);
          } else {
            const msgs = Object.entries(err).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`).join('\n');
            alert(msgs || 'Erreur');
          }
        } else {
          alert(err?.message || String(err) || 'Erreur');
        }
      } catch (e) {
        alert('Erreur');
      }
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">{slug ? 'Modifier' : 'Créer'} un succès d'ancien</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Titre (FR)</label>
          <input name="title_fr" value={form.title_fr} onChange={onChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Titre (AR)</label>
          <input name="title_ar" value={form.title_ar} onChange={onChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input name="slug" value={form.slug} onChange={onChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Année</label>
          <input name="year" value={form.year} onChange={onChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Résumé (FR)</label>
          <textarea name="summary_fr" value={form.summary_fr} onChange={onChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Résumé (AR)</label>
          <textarea name="summary_ar" value={form.summary_ar} onChange={onChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Contenu (FR)</label>
          <textarea name="content_fr" value={form.content_fr} onChange={onChange} className="w-full border rounded p-2 h-40" />
        </div>
        <div>
          <label className="block text-sm font-medium">Contenu (AR)</label>
          <textarea name="content_ar" value={form.content_ar} onChange={onChange} className="w-full border rounded p-2 h-40" />
        </div>
        <div>
          <label className="block text-sm font-medium">Image représentative</label>
          <input type="file" name="featured_image" onChange={onChange} />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" checked={form.featured} onChange={onChange} />
            Mettre en avant
          </label>
        </div>
        <div>
          <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'En cours…' : 'Enregistrer'}</button>
          <button type="button" onClick={() => navigate('/admin/alumni')} className="ml-2 px-4 py-2 rounded border">Annuler</button>
        </div>
      </form>
    </div>
  );
};

export default AdminAlumniForm;
