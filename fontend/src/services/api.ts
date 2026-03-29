// Configuration de l'API

// ==================== PRODUCTION CONFIG FOR SERVER ====================
export const API_BASE_URL = '/api';
export const BACKEND_URL = 'http://10.10.10.10';

console.log('🚀 PRODUCTION API CONFIG LOADED:', {
  API_BASE_URL,
  BACKEND_URL,
  mode: import.meta.env.MODE
});
//utilitaire pour construire les URLs d'images complètes
export function getImageUrl(path: string | null | undefined): string {
  if (!path) {
    return '/placeholder-image.png';
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/')) {
    return `${BACKEND_URL}${path}`;
  }

  return `${BACKEND_URL}/${path}`;
}

// Types pour les cours
export interface Course {
  id: number;
  title_fr: string;
  title_ar: string;
  slug: string;
  description_fr: string;
  description_ar: string;
  content_fr?: string;
  content_ar?: string;
  objectives_fr?: string;
  objectives_ar?: string;
  prerequisites_fr?: string;
  prerequisites_ar?: string;
  category_name_fr: string;
  category_name_ar: string;
  category_icon: string;
  level: string;
  level_display_fr: string;
  level_display_ar: string;
  duration_weeks: number;
  duration_hours?: number;
  max_students: number;
  image: string;
  pdf_file?: string;
  brochure_pdf?: string;
  price: string;
  is_free: boolean;
  registration_open: boolean;
  start_date?: string;
  end_date?: string;
  featured: boolean;
  views_count: number;
  instructor_count: number;
  module_count: number;
  enrollment_count: number;
  certificate?: boolean;
  modules_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CourseEnrollment {
  course: number;
  student_name: string;
  student_email: string;
  student_phone?: string;
  student_id?: string;
  motivation?: string;
  experience_level: string;
  expectations?: string;
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Service API pour les cours
export class CoursesAPI {
  // Récupérer tous les cours
  static async getCourses(type?: string): Promise<Course[]> {
    try {
      const url = type
        ? `${API_BASE_URL}/courses/?type=${type}`
        : `${API_BASE_URL}/courses/`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des cours');
      }
      const data: ApiResponse<Course> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erreur API getCourses:', error);
      throw error;
    }
  }

  // Récupérer un cours par ID
  static async getCourseById(id: number): Promise<Course> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}/`);
      if (!response.ok) {
        throw new Error('Cours non trouvé');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur API getCourseById:', error);
      throw error;
    }
  }

  // Récupérer les cours mis en avant
  static async getFeaturedCourses(): Promise<Course[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/featured/`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des cours mis en avant');
      }
      const data: ApiResponse<Course> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erreur API getFeaturedCourses:', error);
      throw error;
    }
  }

  // Récupérer les cours populaires
  static async getPopularCourses(): Promise<Course[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/popular/`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des cours populaires');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur API getPopularCourses:', error);
      throw error;
    }
  }

  // Récupérer un cours par slug
  static async getCourseBySlug(slug: string): Promise<Course> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${slug}/`);
      if (!response.ok) {
        throw new Error('Cours non trouvé');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur API getCourseBySlug:', error);
      throw error;
    }
  }

  // S'inscrire à un cours
  static async enrollInCourse(courseSlug: string, enrollmentData: CourseEnrollment): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseSlug}/enroll/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrollmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'inscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API enrollInCourse:', error);
      throw error;
    }
  }

  // Télécharger le PDF d'un cours
  static async downloadCoursePDF(courseSlug: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseSlug}/download/`);

      if (!response.ok) {
        throw new Error('Fichier PDF non disponible');
      }

      // Créer un blob et déclencher le téléchargement
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cours-${courseSlug}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur API downloadCoursePDF:', error);
      throw error;
    }
  }

  // Rechercher des cours
  static async searchCourses(query: string): Promise<Course[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/?search=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }
      const data: ApiResponse<Course> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erreur API searchCourses:', error);
      throw error;
    }
  }
}

// Service API pour les catégories
export class CategoriesAPI {
  static async getCategories(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/categories/`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur API getCategories:', error);
      throw error;
    }
  }
}

// Utilitaires
export const formatPrice = (price: string, isFree: boolean): string => {
  if (isFree) return 'Gratuit';
  return `${price} DA`;
};

export const formatDuration = (weeks: number, hours?: number): string => {
  let duration = `${weeks} semaine${weeks > 1 ? 's' : ''}`;
  if (hours) {
    duration += ` (${hours}h)`;
  }
  return duration;
};

export const formatLevel = (level: string): string => {
  const levels: { [key: string]: string } = {
    'beginner': 'Débutant',
    'intermediate': 'Intermédiaire',
    'advanced': 'Avancé',
    'expert': 'Expert'
  };
  return levels[level] || level;
};

// Types pour les actualités/événements
export interface NewsArticle {
  id: number;
  title_fr: string;
  title_ar: string;
  slug: string;
  summary_fr: string;
  summary_ar: string;
  content_fr: string;
  content_ar: string;
  category_name_fr: string;
  category_name_ar: string;
  category_color: string;
  priority: string;
  priority_display_fr: string;
  priority_display_ar: string;
  featured_image: string;
  image_alt_fr: string;
  image_alt_ar: string;
  featured: boolean;
  views_count: number;
  comment_count: number;
  reading_time: number;
  published_at: string;
  event_date?: string;
  author_name: string;
  created_at: string;
}

export interface NewsCategory {
  id: number;
  name_fr: string;
  name_ar: string;
  description_fr: string;
  description_ar: string;
  color: string;
  created_at: string;
}

// Service API pour les actualités/événements
export class NewsAPI {
  // Récupérer toutes les actualités
  static async getNews(): Promise<NewsArticle[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/news/`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();

      // Vérifier si la réponse a le format attendu
      if (data && Array.isArray(data.results)) {
        return data.results;
      } else if (Array.isArray(data)) {
        return data;
      } else {
        console.warn('Format de réponse inattendu pour getNews:', data);
        return [];
      }
    } catch (error) {
      console.error('Erreur API getNews:', error);
      throw error;
    }
  }

  // Récupérer les actualités mises en avant
  static async getFeaturedNews(): Promise<NewsArticle[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/news/featured/`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des actualités mises en avant');
      }
      const data: ApiResponse<NewsArticle> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erreur API getFeaturedNews:', error);
      throw error;
    }
  }

  // Récupérer les dernières actualités
  static async getLatestNews(): Promise<NewsArticle[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/news/latest/`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des dernières actualités');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur API getLatestNews:', error);
      throw error;
    }
  }

  // Récupérer les actualités populaires
  static async getPopularNews(): Promise<NewsArticle[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/news/popular/`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des actualités populaires');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur API getPopularNews:', error);
      throw error;
    }
  }

  // Récupérer une actualité par slug
  static async getNewsBySlug(slug: string): Promise<NewsArticle> {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${slug}/`);
      if (!response.ok) {
        throw new Error('Actualité non trouvée');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur API getNewsBySlug:', error);
      throw error;
    }
  }

  // Rechercher des actualités
  static async searchNews(query: string): Promise<NewsArticle[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/news/search/?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erreur API searchNews:', error);
      throw error;
    }
  }

  // Récupérer les catégories d'actualités
  static async getNewsCategories(): Promise<NewsCategory[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/news/categories/`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();

      // Vérifier si la réponse est un tableau
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.results)) {
        return data.results;
      } else {
        console.warn('Format de réponse inattendu pour getNewsCategories:', data);
        return [];
      }
    } catch (error) {
      console.error('Erreur API getNewsCategories:', error);
      throw error;
    }
  }

  // Récupérer les actualités par catégorie
  static async getNewsByCategory(categoryId: number): Promise<NewsArticle[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/news/category/${categoryId}/`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des actualités par catégorie');
      }
      const data: ApiResponse<NewsArticle> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erreur API getNewsByCategory:', error);
      throw error;
    }
  }

  // --- Alumni admin methods ---
  static async getAlumni(admin: boolean = false, token?: string): Promise<any[]> {
    try {
      const url = admin ? `${API_BASE_URL}/news/alumni/?admin=1` : `${API_BASE_URL}/news/alumni/`;
      const opts: RequestInit = {};
      if (token) opts.headers = { 'Authorization': `Bearer ${token}` } as any;
      const response = await fetch(url, opts);
      if (!response.ok) throw new Error('Erreur lors de la récupération des succès des anciens');
      const data = await response.json();
      // Support paginated or array responses
      if (data && Array.isArray(data.results)) return data.results;
      if (Array.isArray(data)) return data;
      return [];
    } catch (error) {
      console.error('Erreur API getAlumni:', error);
      throw error;
    }
  }

  static async getAlumniBySlug(slug: string, token?: string): Promise<any> {
    try {
      const opts: RequestInit = {};
      if (token) opts.headers = { 'Authorization': `Bearer ${token}` } as any;
      const response = await fetch(`${API_BASE_URL}/news/alumni/${slug}/`, opts);
      if (!response.ok) throw new Error('Succès des anciens non trouvé');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getAlumniBySlug:', error);
      throw error;
    }
  }

  static async createAlumni(token: string, data: any): Promise<any> {
    try {
      const hasFile = data?.featured_image instanceof File;
      let body: any;
      let headers: any = { 'Authorization': `Bearer ${token}` };

      if (hasFile) {
        body = new FormData();
        Object.keys(data).forEach(key => {
          const value = (data as any)[key];
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              body.append(key, value);
            } else {
              body.append(key, String(value));
            }
          }
        });
        // Let browser set Content-Type for multipart
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(data);
      }

      const response = await fetch(`${API_BASE_URL}/news/alumni/`, {
        method: 'POST',
        headers,
        body
      } as any);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw err;
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API createAlumni:', error);
      throw error;
    }
  }

  static async updateAlumni(token: string, slug: string, data: any): Promise<any> {
    try {
      const hasFile = data?.featured_image instanceof File;
      let body: any;
      let headers: any = { 'Authorization': `Bearer ${token}` };

      if (hasFile) {
        body = new FormData();
        Object.keys(data).forEach(key => {
          const value = (data as any)[key];
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              body.append(key, value);
            } else {
              body.append(key, String(value));
            }
          }
        });
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(data);
      }

      const response = await fetch(`${API_BASE_URL}/news/alumni/${slug}/`, {
        method: 'PUT',
        headers,
        body
      } as any);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw err;
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API updateAlumni:', error);
      throw error;
    }
  }

  static async deleteAlumni(token: string, slug: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/news/alumni/${slug}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur API deleteAlumni:', error);
      throw error;
    }
  }

  static async uploadAlumniPhoto(token: string, slug: string, file: File, captions?: { caption_fr?: string; caption_ar?: string }) {
    try {
      const body = new FormData();
      body.append('image', file);
      if (captions?.caption_fr) body.append('caption_fr', captions.caption_fr);
      if (captions?.caption_ar) body.append('caption_ar', captions.caption_ar);

      const response = await fetch(`${API_BASE_URL}/news/alumni/${slug}/photos/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body
      } as any);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Erreur lors de l\'upload');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API uploadAlumniPhoto:', error);
      throw error;
    }
  }

  static async deleteAlumniPhoto(token: string, id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/news/alumni/photos/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression de la photo');
    } catch (error) {
      console.error('Erreur API deleteAlumniPhoto:', error);
      throw error;
    }
  }
}

// Utilitaires pour les actualités
export const formatNewsDate = (dateString: string, language: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const formatPriority = (priority: string | null | undefined, language: string): string => {
  if (!priority) return '';
  const priorities: { [key: string]: { fr: string; ar: string } } = {
    'low': { fr: 'Faible', ar: 'منخفض' },
    'normal': { fr: 'Normal', ar: 'عادي' },
    'high': { fr: 'Élevé', ar: 'عالي' },
    'urgent': { fr: 'Urgent', ar: 'عاجل' }
  };
  return priorities[priority]?.[language as 'fr' | 'ar'] || priority;
};

// Types pour la bibliothèque
export interface BookCategory {
  id: number;
  name_fr: string;
  name_ar: string;
  description_fr?: string;
  description_ar?: string;
  icon: string;
  book_count: number;
}

export interface Author {
  id: number;
  first_name: string;
  last_name: string;
  bio_fr?: string;
  bio_ar?: string;
  birth_date?: string;
  death_date?: string;
  nationality?: string;
  photo?: string;
  website?: string;
  book_count: number;
}

export interface Publisher {
  id: number;
  name: string;
  address?: string;
  website?: string;
  email?: string;
  phone?: string;
  book_count: number;
}

export interface Book {
  id: number;
  title: string;
  subtitle?: string;
  authors_list: string;
  category_name_fr: string;
  category_name_ar: string;
  category_icon: string;
  publisher_name: string;
  isbn: string;
  publication_date: string;
  pages: number;
  language: string;
  description_fr: string;
  description_ar?: string;
  cover_image: string;
  status: string;
  copies_available: number;
  copies_total: number;
  is_available: boolean;
  average_rating: number | string | null;
  review_count: number;
  views_count: number;
  download_count: number;
  is_featured: boolean;
  is_new_arrival: boolean;
  allow_download: boolean;
  pdf_file: string | null;
  created_at: string;
}

// Service API pour la bibliothèque
export class LibraryAPI {
  // Récupérer tous les livres
  static async getBooks(): Promise<Book[]> {
    try {
      const url = `${API_BASE_URL}/library/books/`;
      console.log('📚 Fetching books from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des livres');
      }
      const data = await response.json();

      // Vérifier si la réponse a le format ApiResponse ou est directement un tableau
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.results)) {
        return data.results;
      } else {
        console.warn('Format de réponse inattendu pour getBooks:', data);
        return [];
      }
    } catch (error) {
      console.error('Erreur API getBooks:', error);
      throw error;
    }
  }

  // Récupérer les livres mis en avant
  static async getFeaturedBooks(): Promise<Book[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/library/books/featured/`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des livres mis en avant');
      }
      const data: ApiResponse<Book> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erreur API getFeaturedBooks:', error);
      throw error;
    }
  }

  // Récupérer les nouvelles acquisitions
  static async getNewArrivals(): Promise<Book[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/library/books/new-arrivals/`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des nouvelles acquisitions');
      }
      const data: ApiResponse<Book> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erreur API getNewArrivals:', error);
      throw error;
    }
  }

  // Récupérer les livres populaires
  static async getPopularBooks(): Promise<Book[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/library/books/popular/`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des livres populaires');
      }
      const data: ApiResponse<Book> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erreur API getPopularBooks:', error);
      throw error;
    }
  }

  // Récupérer un livre par ID
  static async getBookById(id: number): Promise<Book> {
    try {
      const response = await fetch(`${API_BASE_URL}/library/books/${id}/`);
      if (!response.ok) {
        throw new Error('Livre non trouvé');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur API getBookById:', error);
      throw error;
    }
  }

  // Rechercher des livres
  static async searchBooks(query: string): Promise<Book[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/library/books/?search=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }
      const data: ApiResponse<Book> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erreur API searchBooks:', error);
      throw error;
    }
  }

  // Récupérer les catégories de livres
  static async getBookCategories(): Promise<BookCategory[]> {
    try {
      const url = `${API_BASE_URL}/library/categories/`;
      console.log('📂 Fetching categories from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories');
      }
      const data = await response.json();

      // Vérifier si la réponse a le format ApiResponse ou est directement un tableau
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.results)) {
        return data.results;
      } else {
        console.warn('Format de réponse inattendu pour getBookCategories:', data);
        return [];
      }
    } catch (error) {
      console.error('Erreur API getBookCategories:', error);
      throw error;
    }
  }

  // Récupérer les livres par catégorie
  static async getBooksByCategory(categoryId: number): Promise<Book[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/library/books/category/${categoryId}/`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des livres par catégorie');
      }
      const data: ApiResponse<Book> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erreur API getBooksByCategory:', error);
      throw error;
    }
  }

  // Récupérer les auteurs
  static async getAuthors(): Promise<Author[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/library/authors/`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des auteurs');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur API getAuthors:', error);
      throw error;
    }
  }
}

// Utilitaires pour la bibliothèque
export const formatBookLanguage = (language: string): string => {
  const languages: { [key: string]: string } = {
    'fr': 'Français',
    'ar': 'Arabe',
    'en': 'Anglais',
    'es': 'Espagnol',
    'de': 'Allemand',
    'other': 'Autre'
  };
  return languages[language] || language;
};

export const formatBookStatus = (status: string): string => {
  const statuses: { [key: string]: string } = {
    'available': 'Disponible',
    'borrowed': 'Emprunté',
    'reserved': 'Réservé',
    'maintenance': 'En maintenance',
    'lost': 'Perdu'
  };
  return statuses[status] || status;
};

// Vérifier si une note est valide
export const isValidRating = (rating: number | string | null | undefined): boolean => {
  if (rating === null || rating === undefined) return false;

  const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
  return !isNaN(numRating) && numRating > 0 && numRating <= 5;
};

// Types pour l'authentification
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: number;
  user: number;
  phone?: string;
  address?: string;
  birth_date?: string;
  bio?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface ApiError {
  detail?: string;
  non_field_errors?: string[];
  [key: string]: any;
}

// Service API pour l'authentification
export class AuthAPI {
  // Inscription d'un nouvel utilisateur
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Registration error response:', errorData); // Debug log
        throw new Error(errorData.detail || errorData.non_field_errors?.[0] || JSON.stringify(errorData) || 'Erreur lors de l\'inscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API register:', error);
      throw error;
    }
  }

  // Connexion d'un utilisateur
  static async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('[AuthAPI.login] Payload:', data); // Ajout du log pour vérifier le payload
      const response = await fetch(`${API_BASE_URL}/users/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la connexion';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.non_field_errors?.[0] || errorData.error || JSON.stringify(errorData) || errorMessage;
        } catch (e) {
          // ignore JSON parse error
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API login:', error);
      throw error;
    }
  }

  // Récupérer le profil utilisateur actuel
  static async getCurrentUser(token: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API getCurrentUser:', error);
      throw error;
    }
  }

  // Mettre à jour le profil utilisateur
  static async updateProfile(token: string, data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de la mise à jour du profil');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API updateProfile:', error);
      throw error;
    }
  }

  // Rafraîchir le token
  static async refreshToken(refreshToken: string): Promise<{ access: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du rafraîchissement du token');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API refreshToken:', error);
      throw error;
    }
  }

  // Déconnexion
  static async logout(refreshToken: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
    } catch (error) {
      console.error('Erreur API logout:', error);
      // Ne pas lancer d'erreur pour la déconnexion
    }
  }

  // Changer le mot de passe
  static async changePassword(token: string, data: { old_password: string; new_password: string }): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      console.error('Erreur API changePassword:', error);
      throw error;
    }
  }
}

export const formatRating = (rating: number | string | null | undefined): string => {
  // Convertir en nombre et vérifier la validité
  const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;

  if (numRating === null || numRating === undefined || isNaN(numRating) || numRating <= 0) {
    return '0.0/5';
  }

  // S'assurer que la note est entre 0 et 5
  const clampedRating = Math.min(Math.max(numRating, 0), 5);

  return `${clampedRating.toFixed(1)}/5`;
};

// Types pour les événements et conférences
export interface Event {
  id: number;
  title?: string;
  title_fr?: string;
  title_ar?: string;
  title_en?: string;
  slug: string;
  description?: string;
  description_fr?: string;
  description_ar?: string;
  description_en?: string;
  content_fr?: string;
  content_ar?: string;
  category_name?: string;
  category_name_fr?: string;
  category_name_ar?: string;
  category_color?: string;
  event_type?: string;
  event_type_display_fr?: string;
  event_type_display_ar?: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  address?: string;
  room?: string;
  max_participants?: number;
  registration_required?: boolean;
  registration_fee?: number;
  priority?: string;
  priority_display_fr?: string;
  priority_display_ar?: string;
  is_featured?: boolean;
  is_public?: boolean;
  featured_image?: string;
  image_url?: string;
  image?: string;
  image_alt_fr?: string;
  image_alt_ar?: string;
  views_count?: number;
  organizer_name?: string;
  organizer_email?: string;
  created_at?: string;
  status?: {
    is_upcoming?: boolean;
    is_ongoing?: boolean;
    is_past?: boolean;
  };
}

export interface Conference {
  id: number;
  title?: string;
  title_fr?: string;
  title_ar?: string;
  title_en?: string;
  slug: string;
  description?: string;
  description_fr?: string;
  description_ar?: string;
  description_en?: string;
  content_fr?: string;
  content_ar?: string;
  category_name?: string;
  category_name_fr?: string;
  category_name_ar?: string;
  category_color?: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  address?: string;
  room?: string;
  max_participants?: number;
  registration_required: boolean;
  registration_fee: number;
  priority: string;
  priority_display_fr?: string;
  priority_display_ar?: string;
  is_featured?: boolean;
  is_public?: boolean;
  featured_image?: string;
  image_url?: string;
  image?: string;
  image_alt_fr?: string;
  image_alt_ar?: string;
  views_count?: number;
  organizer_name?: string;
  organizer_email?: string;
  created_at?: string;
  status?: {
    is_upcoming: boolean;
    is_ongoing: boolean;
    is_past: boolean;
  };
}

// Service API pour les événements
export class EventsAPI {
  // Récupérer tous les événements
  static async getEvents(): Promise<Event[]> {
    try {
      const url = `${API_BASE_URL}/events/events/`;
      console.log('🎉 Fetching events from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des événements');
      }
      const data = await response.json();

      // Vérifier si la réponse a le format ApiResponse ou est directement un tableau
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.results)) {
        return data.results;
      } else {
        console.warn('Format de réponse inattendu pour getEvents:', data);
        return [];
      }
    } catch (error) {
      console.error('Erreur API getEvents:', error);
      throw error;
    }
  }

  // Récupérer toutes les conférences
  static async getConferences(): Promise<Conference[]> {
    try {
      const url = `${API_BASE_URL}/events/conferences/`;
      console.log('🎤 Fetching conferences from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des conférences');
      }
      const data = await response.json();

      // Vérifier si la réponse a le format ApiResponse ou est directement un tableau
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.results)) {
        return data.results;
      } else {
        console.warn('Format de réponse inattendu pour getConferences:', data);
        return [];
      }
    } catch (error) {
      console.error('Erreur API getConferences:', error);
      throw error;
    }
  }

  // Récupérer les événements mis en avant
  static async getFeaturedEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/featured/`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des événements mis en avant');
      }
      const data: ApiResponse<Event> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erreur API getFeaturedEvents:', error);
      throw error;
    }
  }

  // Récupérer les conférences mises en avant
  static async getFeaturedConferences(): Promise<Conference[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/conferences/featured/`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des conférences mises en avant');
      }
      const data: ApiResponse<Conference> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erreur API getFeaturedConferences:', error);
      throw error;
    }
  }

  // Récupérer un événement par slug
  static async getEventBySlug(slug: string): Promise<Event> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${slug}/`);
      if (!response.ok) {
        throw new Error('Événement non trouvé');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur API getEventBySlug:', error);
      throw error;
    }
  }

  // Récupérer une conférence par slug
  static async getConferenceBySlug(slug: string): Promise<Conference> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/conferences/${slug}/`);
      if (!response.ok) {
        throw new Error('Conférence non trouvée');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur API getConferenceBySlug:', error);
      throw error;
    }
  }

  // Rechercher des événements
  static async searchEvents(query: string): Promise<Event[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/?search=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }
      const data: ApiResponse<Event> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erreur API searchEvents:', error);
      throw error;
    }
  }

  // Rechercher des conférences
  static async searchConferences(query: string): Promise<Conference[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/conferences/?search=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }
      const data: ApiResponse<Conference> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erreur API searchConferences:', error);
      throw error;
    }
  }

  // Récupérer les événements par type spécifique
  static async getEventsByType(eventType: string): Promise<Event[]> {
    try {
      // Mapping des types d'événements vers les noms de catégories dans la DB
      const categoryMap: Record<string, string> = {
        'conferences': 'Conférence',
        'workshops': 'Ateliers',
        'competitions': 'Competition',
      };
      
      const categoryName = categoryMap[eventType] || eventType;
      
      // Utiliser le chemin complet qui fonctionne (événements avec images)
      const url = `${API_BASE_URL}/events/events-simple/?category=${encodeURIComponent(categoryName)}`;
      console.log(`🎯 Fetching ${eventType} from:`, url);
      const response = await fetch(url);

      // Gérer les réponses d'erreur spécifiques
      if (!response.ok) {
        if (response.status === 400) {
          // Type d'événement non disponible
          const errorData = await response.json();
          console.warn(`⚠️ Type d'événement non disponible: ${eventType}`, errorData);

          // Retourner un tableau vide au lieu de lancer une erreur
          if (errorData.message) {
            console.info(`ℹ️ ${errorData.message}`);
          }
          return [];
        }
        throw new Error(`Erreur lors de la récupération des ${eventType}`);
      }

      const data = await response.json();

      // Vérifier si la réponse a le format ApiResponse ou est directement un tableau
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.results)) {
        return data.results;
      } else if (data && Array.isArray(data.events)) {
        // Handle backend response with 'events' key
        return data.events;
      } else {
        console.warn(`Format de réponse inattendu pour ${eventType}:`, data);
        return [];
      }
    } catch (error) {
      console.error(`Erreur API getEventsByType(${eventType}):`, error);
      throw error;
    }
  }

  // Méthodes spécialisées pour chaque type d'événement
  static async getConferencesOnly(): Promise<Event[]> {
    return this.getEventsByType('conferences');
  }

  static async getWorkshops(): Promise<Event[]> {
    return this.getEventsByType('workshops');
  }

  static async getCompetitions(): Promise<Event[]> {
    return this.getEventsByType('competitions');
  }

  static async getCulturalEvents(): Promise<Event[]> {
    return this.getEventsByType('cultural');
  }

  static async getSportsEvents(): Promise<Event[]> {
    return this.getEventsByType('sports');
  }

  static async getGraduationEvents(): Promise<Event[]> {
    return this.getEventsByType('graduation');
  }

  static async getSeminars(): Promise<Event[]> {
    return this.getEventsByType('seminars');
  }

  static async getHackathons(): Promise<Event[]> {
    return this.getEventsByType('hackathons');
  }
}

// Types pour le formulaire de contact
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    phone: string;
    created_at: string;
  };
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  working_hours: string;
}

// Service API pour le formulaire de contact
export class ContactAPI {
  // Soumettre un message de contact
  static async submitContact(data: ContactFormData): Promise<ContactResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de l\'envoi du message');
      }

      return result;
    } catch (error) {
      console.error('Erreur API submitContact:', error);
      throw error;
    }
  }

  // Obtenir les informations de contact
  static async getContactInfo(): Promise<ContactInfo> {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/info/`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations de contact');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Erreur API getContactInfo:', error);
      // Return default values if API fails
      return {
        email: 'contact@ent-dz.com',
        phone: '+213 70 123 456',
        address: 'École Nationale des Transmissions',
        city: 'Alger',
        country: 'Algerie',
        working_hours: 'Dimanche - Jeudi: 8h00 - 17h00'
      };
    }
  }
}

// Types pour les formations OHB
export interface Formation {
  id: number;
  title_fr: string;
  title_ar: string;
  slug: string;
  label: string;
  description_fr: string;
  description_ar: string;
  content_fr?: string;
  content_ar?: string;
  objectives_fr?: string;
  objectives_ar?: string;
  prerequisites_fr?: string;
  prerequisites_ar?: string;
  target_audience_fr?: string;
  target_audience_ar?: string;
  location_fr?: string;
  location_ar?: string;
  teaching_methods_fr?: string;
  teaching_methods_ar?: string;
  daily_organization_fr?: string;
  daily_organization_ar?: string;
  daily_program_fr?: string;
  daily_program_ar?: string;
  category: any;
  category_name_fr: string;
  category_name_ar: string;
  level: string;
  level_display_fr: string;
  level_display_ar: string;
  duration_weeks: number;
  duration_hours?: number;
  max_students: number;
  image?: string;
  pdf_file?: string;
  brochure_pdf?: string;
  price?: string;
  registration_open: boolean;
  start_date?: string;
  end_date?: string;
  status: string;
  featured: boolean;
  views_count: number;
  enrollment_count: number;
  modules_count?: number;
  certificate?: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormationCategory {
  id: number;
  name_fr: string;
  name_ar: string;
  description_fr: string;
  description_ar: string;
  icon: string;
}

export interface FormationEnrollment {
  formation: number;
  student_name: string;
  student_email: string;
  student_phone?: string;
  notes?: string;
}

// Service API pour les formations OHB
export class FormationAPI {
  // Récupérer toutes les formations
  static async getFormations(params?: {
    category?: string;
    level?: string;
    status?: string;
    search?: string;
    ordering?: string;
  }): Promise<Formation[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.set('category', params.category);
      if (params?.level) queryParams.set('level', params.level);
      if (params?.status) queryParams.set('status', params.status);
      if (params?.search) queryParams.set('search', params.search);
      if (params?.ordering) queryParams.set('ordering', params.ordering);

      const url = `${API_BASE_URL}/ohb-formations/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des formations');
      }
      
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error('Erreur API getFormations:', error);
      throw error;
    }
  }

  // Récupérer une formation par slug
  static async getFormationBySlug(slug: string): Promise<Formation> {
    try {
      const response = await fetch(`${API_BASE_URL}/ohb-formations/${slug}/`);
      
      if (!response.ok) {
        throw new Error('Formation non trouvée');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur API getFormationBySlug:', error);
      throw error;
    }
  }

  // Récupérer les formations mises en avant
  static async getFeaturedFormations(): Promise<Formation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ohb-formations/featured/`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des formations en vedette');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur API getFeaturedFormations:', error);
      throw error;
    }
  }

  // Récupérer les formations populaires
  static async getPopularFormations(): Promise<Formation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ohb-formations/popular/`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des formations populaires');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur API getPopularFormations:', error);
      throw error;
    }
  }

  // S'inscrire à une formation
  static async enrollInFormation(formationSlug: string, data: FormationEnrollment): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/ohb-formations/${formationSlug}/enroll/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || JSON.stringify(errorData) || 'Erreur lors de l\'inscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API enrollInFormation:', error);
      throw error;
    }
  }

  // Récupérer les catégories de formations
  static async getCategories(): Promise<FormationCategory[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ohb-formations/categories/`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur API getCategories:', error);
      throw error;
    }
  }
}

// Types pour les partenariats
export interface Partnership {
  id: number;
  name: string;
  logo: string;
  website?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// API pour les partenariats
export class PartnershipAPI {
  static async getPartnerships(): Promise<Partnership[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/partners/`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des partenaires');
      }
      
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error('Erreur API getPartnerships:', error);
      throw error;
    }
  }
}
