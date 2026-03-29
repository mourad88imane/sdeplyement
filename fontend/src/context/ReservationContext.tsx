import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';

// Types pour les réservations
export interface BookReservation {
  id: string;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  bookCover?: string;
  bookIsbn: string;
  reservationDate: string;
  expiryDate: string;
  status: 'pending' | 'ready' | 'fulfilled' | 'cancelled' | 'expired';
  reserver_name: string;
  reserver_email: string;
  reserver_phone?: string;
  notes?: string;
}

interface ReservationContextType {
  reservations: BookReservation[];
  addReservation: (book: any, userInfo: { name: string; email: string; phone?: string }) => Promise<boolean>;
  cancelReservation: (reservationId: string) => void;
  getReservationsByStatus: (status: string) => BookReservation[];
  getTotalReservations: () => number;
  isBookReserved: (bookId: number) => boolean;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
};

interface ReservationProviderProps {
  children: React.ReactNode;
}

export const ReservationProvider: React.FC<ReservationProviderProps> = ({ children }) => {
  useLanguage();
  const { user } = useAuth();
  const [reservations, setReservations] = useState<BookReservation[]>([]);

  // Charger les réservations depuis le localStorage au démarrage
  useEffect(() => {
    const savedReservations = localStorage.getItem('bookReservations');
    if (savedReservations) {
      try {
        const parsed = JSON.parse(savedReservations);
        setReservations(parsed);
      } catch (error) {
        console.error('Erreur lors du chargement des réservations:', error);
      }
    }
  }, []);

  // Sauvegarder les réservations dans le localStorage
  useEffect(() => {
    localStorage.setItem('bookReservations', JSON.stringify(reservations));
  }, [reservations]);

  // Ajouter une nouvelle réservation
  const addReservation = async (book: any, userInfo: { name: string; email: string; phone?: string }): Promise<boolean> => {
    try {
      // Utiliser les données de l'utilisateur connecté si disponibles
      const reserverName = user ? `${user.first_name} ${user.last_name}` : userInfo.name;
      const reserverEmail = user ? user.email : userInfo.email;
      const reserverPhone = user?.profile?.phone || userInfo.phone;

      // Vérifier si le livre est déjà réservé par cet utilisateur
      const existingReservation = reservations.find(
        r => r.bookId === book.id && r.reserver_email === reserverEmail && r.status !== 'cancelled' && r.status !== 'expired'
      );

      if (existingReservation) {
        return false; // Déjà réservé
      }

      // Créer une nouvelle réservation
      const newReservation: BookReservation = {
        id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        bookId: book.id,
        bookTitle: book.title,
        bookAuthor: book.authors_list || 'Auteur inconnu',
        bookCover: book.cover_image,
        bookIsbn: book.isbn,
        reservationDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours
        status: 'pending',
        reserver_name: reserverName,
        reserver_email: reserverEmail,
        reserver_phone: reserverPhone,
        notes: `Réservation effectuée via l'interface web${user ? ` par l'utilisateur ${user.username}` : ''}`
      };

      setReservations(prev => [newReservation, ...prev]);

      // Log pour debug
      console.log('✅ Nouvelle réservation ajoutée:', {
        book: book.title,
        user: reserverName,
        email: reserverEmail,
        status: 'pending'
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réservation:', error);
      return false;
    }
  };

  // Annuler une réservation
  const cancelReservation = (reservationId: string) => {
    setReservations(prev =>
      prev.map(reservation =>
        reservation.id === reservationId
          ? { ...reservation, status: 'cancelled' as const }
          : reservation
      )
    );
  };

  // Obtenir les réservations par statut
  const getReservationsByStatus = (status: string): BookReservation[] => {
    return reservations.filter(reservation => reservation.status === status);
  };

  // Obtenir le nombre total de réservations actives
  const getTotalReservations = (): number => {
    return reservations.filter(r => r.status !== 'cancelled' && r.status !== 'expired').length;
  };

  // Vérifier si un livre est déjà réservé
  const isBookReserved = (bookId: number): boolean => {
    return reservations.some(r =>
      r.bookId === bookId &&
      (r.status === 'pending' || r.status === 'ready')
    );
  };

  // Mettre à jour automatiquement les réservations expirées
  useEffect(() => {
    const updateExpiredReservations = () => {
      const now = new Date();
      setReservations(prev =>
        prev.map(reservation => {
          if (reservation.status === 'pending' && new Date(reservation.expiryDate) < now) {
            return { ...reservation, status: 'expired' as const };
          }
          return reservation;
        })
      );
    };

    // Vérifier les réservations expirées toutes les heures
    const interval = setInterval(updateExpiredReservations, 60 * 60 * 1000);

    // Vérifier immédiatement au chargement
    updateExpiredReservations();

    return () => clearInterval(interval);
  }, []);

  const value: ReservationContextType = {
    reservations,
    addReservation,
    cancelReservation,
    getReservationsByStatus,
    getTotalReservations,
    isBookReserved
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};
