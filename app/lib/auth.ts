// Tipos para autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  lastName: string;
  email: string;
  cedula: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

// URL base de la API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Función para iniciar sesión
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Error al iniciar sesión');
  }

  return response.json();
}

// Función para registrar un nuevo usuario
export async function registerUser(userData: RegisterData): Promise<any> {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...userData,
      equipos_reservados: [],
      expectedTags: [],
      missingTags: [],
      presentTags: []
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Error al registrar usuario');
  }

  return response.json();
}

// Función para guardar el token en localStorage
export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

// Función para obtener el token de localStorage
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

// Función para eliminar el token (cerrar sesión)
export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

// Función para verificar si el usuario está autenticado
export function isAuthenticated(): boolean {
  const token = getToken();
  return !!token;
}

/**
 * Parsea un token JWT y devuelve el contenido decodificado.
 * @param token - El token JWT a decodificar
 * @returns El objeto decodificado del token
 */
export function parseJwt(token: string) {
  try {
    // Obtiene la parte del payload del token (segunda parte separada por punto)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    // Devuelve un objeto vacío en caso de error
    return {};
  }
}

/**
 * Verifica si un usuario tiene permisos de administrador
 * @param token - Token JWT del usuario
 * @returns Verdadero si el usuario tiene el rol de administrador
 */
export function isAdmin(token: string): boolean {
  try {
    const decoded = parseJwt(token);
    return decoded.role === 'admin';
  } catch (error) {
    return false;
  }
}

/**
 * Verifica si un token JWT es válido y no ha expirado
 * @param token - Token JWT a verificar
 * @returns Verdadero si el token es válido
 */
export function isValidToken(token: string): boolean {
  try {
    const decoded = parseJwt(token);
    // Verifica si el token tiene un tiempo de expiración
    if (!decoded.exp) return false;
    
    // Compara la expiración con el tiempo actual
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
} 