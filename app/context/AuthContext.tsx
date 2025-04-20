'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserFromToken, isValidToken, decodeToken } from '../utils/auth';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay un token guardado al cargar la página
    const token = localStorage.getItem('auth_token');
    
    if (token && isValidToken(token)) {
      const userData = getUserFromToken(token);
      console.log('Token decodificado:', decodeToken(token));
      console.log('Usuario obtenido del token:', userData);
      
      if (userData) {
        setUser(userData);
      } else {
        console.error('No se pudo obtener información de usuario del token');
        localStorage.removeItem('auth_token'); // Token inválido, eliminarlo
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Obtener el token (puede venir como token o access_token en la respuesta)
      const authToken = data.token || data.access_token;
      if (!authToken) {
        throw new Error('No se pudo obtener el token de autenticación');
      }
      
      // Guardar token y decodificar información
      localStorage.setItem('auth_token', authToken);
      console.log('Token recibido:', authToken);
      
      const decodedToken = decodeToken(authToken);
      console.log('Información en el token:', decodedToken);
      
      const userData = getUserFromToken(authToken);
      console.log('Usuario extraído del token:', userData);
      
      if (!userData || !userData.id) {
        throw new Error('El token no contiene la información necesaria del usuario');
      }
      
      setUser(userData);
    } catch (err: any) {
      console.error('Error de login:', err);
      setError(err.message || 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    router.push('/login');
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('auth_token');
    return token ? isValidToken(token) : false;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 