'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isValidToken } from '@/app/lib/auth';

interface AuthProtectedProps {
  children: React.ReactNode;
  adminRequired?: boolean;
}

/**
 * Componente que protege rutas que requieren autenticación
 * Redirige a la página de login si no hay token o si el token no es válido
 */
export default function AuthProtected({ 
  children, 
  adminRequired = false 
}: AuthProtectedProps) {
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    
    if (!token) {
      // No hay token, redirigir al login
      router.push('/login');
      return;
    }

    // Verificar validez del token
    if (!isValidToken(token)) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      router.push('/login');
      return;
    }

    // Si se requiere rol de admin, verificar
    if (adminRequired) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      if (decoded.role !== 'admin') {
        // No tiene permisos de administrador
        router.push('/dashboard');
      }
    }
  }, [router, adminRequired]);

  return <>{children}</>;
} 