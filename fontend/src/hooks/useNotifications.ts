import { useState, useEffect, useCallback } from 'react';

interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: 'info' | 'success' | 'warning' | 'error' | 'course' | 'news' | 'library' | 'system';
  link_url?: string;
  link_text?: string;
  is_read: boolean;
  is_important: boolean;
  created_at: string;
  expires_at?: string;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:8000/api/users/notifications/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.results || data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:8000/api/users/notifications/${notificationId}/read/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:8000/api/users/notifications/mark-all-read/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, is_read: true }))
        );
      }
    } catch (error) {
      console.error('Erreur lors du marquage global:', error);
    }
  }, []);

  // Charger les notifications au montage du composant
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Polling pour les nouvelles notifications (toutes les 30 secondes)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};
