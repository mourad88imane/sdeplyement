const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) {
    return path.replace('http://localhost:8000', API_BASE).replace('http://127.0.0.1:8000', API_BASE);
  }
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}
