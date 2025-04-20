import { API_URL } from './config';

export interface UserProfile {
  id: string;
  name: string;
  lastName: string;
  email: string;
  cedula: string;
  codigo_acceso: string | null;
  accessCodeExpiresAt: string | null;
  role: 'user' | 'admin';
  equipos_reservados: string[];
}

export interface AccessCode {
  codigo_acceso: string | null;
  expiresAt: string | null;
  isActive: boolean;
}

/**
 * Obtiene el perfil completo del usuario autenticado
 */
export async function getUserProfile(): Promise<UserProfile> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('No estás autenticado');
  }
  
  try {
    const response = await fetch(`${API_URL}/users/profile/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener perfil: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    throw error;
  }
}

/**
 * Obtiene solo el código de acceso del usuario
 */
export async function getUserAccessCode(): Promise<AccessCode> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('No estás autenticado');
  }
  
  try {
    const response = await fetch(`${API_URL}/users/access-code/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener código de acceso: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener código de acceso:', error);
    throw error;
  }
} 