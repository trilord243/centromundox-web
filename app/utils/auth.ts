interface DecodedToken {
  id?: string;
  _id?: string;
  sub?: string;
  email?: string;
  role?: string;
  roles?: string;
  exp: number;
  iat: number;
  user?: {
    id?: string;
    _id?: string;
    sub?: string;
    email?: string;
    role?: string;
    roles?: string;
  };
}

/**
 * Decodifica un token JWT sin verificar la firma
 * @param token Token JWT
 * @returns Objeto con los datos del token decodificado o null si es inválido
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

/**
 * Verifica si un token es válido (no ha expirado)
 * @param token Token JWT
 * @returns true si el token es válido, false si es inválido o ha expirado
 */
export function isValidToken(token?: string): boolean {
  if (!token) return false;
  
  const decoded = decodeToken(token);
  if (!decoded) return false;
  
  // Verificar si ha expirado
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp > currentTime;
}

/**
 * Extrae información del usuario desde el token JWT
 * @param token Token JWT
 * @returns Objeto con id, email y role del usuario, o null si el token es inválido
 */
export function getUserFromToken(token?: string): { id: string, email: string, role: string } | null {
  if (!token) return null;
  
  try {
    const decoded = decodeToken(token);
    if (!decoded) return null;
    
    // El token puede tener diferentes estructuras:
    // 1. { id, email, role }
    // 2. { sub (como id), email, role }
    // 3. { _id (como id MongoDB), email, role }
    // 4. El usuario puede estar dentro de un campo 'user'
    
    // Intentar extraer el ID - podría estar en varios campos
    const userId = decoded.id || decoded.sub || decoded._id || 
                  (decoded.user && (decoded.user.id || decoded.user._id || decoded.user.sub));
    
    // Intentar extraer el email
    const userEmail = decoded.email || 
                     (decoded.user && decoded.user.email);
    
    // Intentar extraer el rol
    const userRole = decoded.role || decoded.roles || 
                    (decoded.user && (decoded.user.role || decoded.user.roles));
    
    if (!userId) {
      console.error('No se pudo extraer ID del token:', decoded);
      return null;
    }
    
    return {
      id: String(userId),
      email: String(userEmail || 'usuario@ejemplo.com'),
      role: String(userRole || 'user')
    };
  } catch (error) {
    console.error('Error al extraer usuario del token:', error);
    return null;
  }
}

/**
 * Verifica si el usuario tiene rol de administrador
 * @param token Token JWT
 * @returns true si el usuario es administrador, false en caso contrario
 */
export function isAdmin(token?: string): boolean {
  const user = getUserFromToken(token);
  return user?.role === 'admin';
} 