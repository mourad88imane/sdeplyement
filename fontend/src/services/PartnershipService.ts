import { Partnership, PartnershipFormData } from '@/data/PartnershipTypes';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class PartnershipService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': token ? `Token ${token}` : '',
      'Content-Type': 'application/json',
    };
  }

  async getAll(): Promise<Partnership[]> {
    const response = await fetch(`${API_BASE_URL}/partners/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch partnerships');
    }

    const data = await response.json();
    // Handle paginated response from Django REST framework
    return Array.isArray(data) ? data : data.results || [];
  }

  async getById(id: number): Promise<Partnership> {
    const response = await fetch(`${API_BASE_URL}/partners/${id}/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch partnership');
    }

    return response.json();
  }

  async create(data: PartnershipFormData): Promise<Partnership> {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.logo) {
      formData.append('logo', data.logo);
    }
    if (data.website) {
      formData.append('website', data.website);
    }
    if (data.description) {
      formData.append('description', data.description);
    }

    const response = await fetch(`${API_BASE_URL}/partners/`, {
      method: 'POST',
      headers: {
        'Authorization': this.getAuthHeaders()['Authorization'],
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create partnership');
    }

    return response.json();
  }

  async update(id: number, data: PartnershipFormData): Promise<Partnership> {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.logo) {
      formData.append('logo', data.logo);
    }
    if (data.website) {
      formData.append('website', data.website);
    }
    if (data.description) {
      formData.append('description', data.description);
    }

    const response = await fetch(`${API_BASE_URL}/partners/${id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': this.getAuthHeaders()['Authorization'],
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update partnership');
    }

    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/partners/${id}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete partnership');
    }
  }
}

export const partnershipService = new PartnershipService();