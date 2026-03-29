import { API_BASE_URL } from './api';

export interface Review {
  id: number;
  author_name: string;
  author_role: string;
  content_fr: string;
  content_ar: string;
  rating?: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export class ReviewsService {
  static async list(): Promise<Review[]> {
    const res = await fetch(`${API_BASE_URL}/reviews/`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    const data = await res.json();
    // Handle both array and paginated response
    return Array.isArray(data) ? data : (data.results || []);
  }

  static async get(id: number): Promise<Review> {
    const res = await fetch(`${API_BASE_URL}/reviews/${id}/`);
    if (!res.ok) throw new Error('Failed to fetch review');
    return await res.json();
  }

  static async create(payload: Partial<Review>): Promise<Review> {
    const res = await fetch(`${API_BASE_URL}/reviews/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to create review');
    return await res.json();
  }

  static async update(id: number, payload: Partial<Review>): Promise<Review> {
    const res = await fetch(`${API_BASE_URL}/reviews/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to update review');
    return await res.json();
  }

  static async remove(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/reviews/${id}/`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to delete review');
  }
}
