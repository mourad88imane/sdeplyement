import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AuthAPI, User, LoginRequest, RegisterRequest, AuthResponse } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  token: string | null;
  login: (data: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem('access_token');
        const savedRefreshToken = localStorage.getItem('refresh_token');

        if (savedToken) {
          setToken(savedToken);

          try {
            // Essayer de récupérer le profil utilisateur
            const userData = await AuthAPI.getCurrentUser(savedToken);
            setUser(userData);
            setIsAuthenticated(true);
          } catch (error) {
            // Token expiré, essayer de le rafraîchir
            if (savedRefreshToken) {
              try {
                const refreshResponse = await AuthAPI.refreshToken(savedRefreshToken);
                const newToken = refreshResponse.access;

                localStorage.setItem('access_token', newToken);
                setToken(newToken);

                const userData = await AuthAPI.getCurrentUser(newToken);
                setUser(userData);
                setIsAuthenticated(true);
              } catch (refreshError) {
                // Impossible de rafraîchir, déconnecter
                console.error('Impossible de rafraîchir le token:', refreshError);
                await logout();
              }
            } else {
              // Pas de refresh token, déconnecter
              await logout();
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: LoginRequest): Promise<boolean> => {
    try {
      setLoading(true);
      const response: AuthResponse = await AuthAPI.login(data);

      // Sauvegarder les tokens
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);

      // Mettre à jour l'état
      setToken(response.access);
      setUser(response.user);
      setIsAuthenticated(true);

      console.log('✅ Connexion réussie:', response.user);
      return true;
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<boolean> => {
    try {
      setLoading(true);
      const response: AuthResponse = await AuthAPI.register(data);

      // Sauvegarder les tokens
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);

      // Mettre à jour l'état
      setToken(response.access);
      setUser(response.user);
      setIsAuthenticated(true);

      console.log('✅ Inscription réussie:', response.user);
      return true;
    } catch (error) {
      console.error('❌ Erreur d\'inscription:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await AuthAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer l'état local
      setUser(null);
      setIsAuthenticated(false);
      setToken(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      console.log('✅ Déconnexion effectuée');
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (!token) return;

    try {
      const userData = await AuthAPI.getCurrentUser(token);
      setUser(userData);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du profil:', error);
    }
  };

  const updateProfile = async (data: any): Promise<boolean> => {
    if (!token) return false;

    try {
      await AuthAPI.updateProfile(token, data);
      await refreshUser(); // Rafraîchir les données utilisateur
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        token,
        login,
        logout,
        register,
        refreshUser,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}