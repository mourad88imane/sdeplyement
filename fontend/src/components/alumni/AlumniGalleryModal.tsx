
export type Alumni = {
  id: number;
  name_fr?: string;
  name_ar?: string;
  name_en?: string;
  title_fr?: string;
  title_ar?: string;
  title_en?: string;
  story_fr?: string;
  story_ar?: string;
  story_en?: string;
  photo?: string;
  created_at: string;
  gallery?: AlumniPhoto[];
};

export type AlumniPhoto = {
  id: number;
  image: string;
  legend_fr?: string;
  legend_ar?: string;
  legend_en?: string;
  uploaded_at: string;
};

const AlumniGalleryModal = ({ open, onClose, alumni, lang }: { open: boolean; onClose: () => void; alumni: Alumni; lang: string }) => {
  if (!open || !alumni) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl font-bold text-gray-400 hover:text-primary">&times;</button>
        <h3 className="text-xl font-bold mb-4 text-center">
          {lang === 'ar' ? alumni.name_ar : lang === 'en' ? alumni.name_en : alumni.name_fr}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alumni.gallery?.length ? alumni.gallery.map(photo => (
            <div key={photo.id} className="flex flex-col items-center">
              <img src={photo.image.startsWith('http') ? photo.image : `http://localhost:8000${photo.image}`} alt={photo.legend_fr || ''} className="rounded-lg w-full max-h-64 object-cover mb-2" />
              <div className="text-xs text-muted-foreground text-center">
                {lang === 'ar' ? photo.legend_ar : lang === 'en' ? photo.legend_en : photo.legend_fr}
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center text-muted-foreground">No photos.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniGalleryModal;
