'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { API_URL } from '../../lib/config';

// Definición extendida del tipo de usuario para incluir los campos adicionales
interface UserDetails {
  id: string;
  email: string;
  role: string;
  name?: string;
  lastName?: string;
  cedula?: string;
  codigo_acceso?: string;
  accessCodeExpiresAt?: string;
  equipos_reservados?: string[];
}

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsClient(true);
    
    // Cargar los detalles completos del usuario desde la API
    const fetchUserDetails = async () => {
      if (!authUser) return;
      
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        
        const response = await fetch(`${API_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error('Error al obtener detalles del usuario');
          // Usar al menos los datos básicos del contexto de auth
          setUser(authUser);
        }
      } catch (error) {
        console.error('Error:', error);
        setUser(authUser);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserDetails();
  }, [authUser]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando información de usuario...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Información personal */}
            <div className="md:w-2/3">
              <div className="bg-blue-50 p-5 rounded-lg">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Información Personal</h2>
                <div className="space-y-3">
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">Nombre:</span> {user.name || 'No especificado'}</p>
                  <p><span className="font-medium">Apellido:</span> {user.lastName || 'No especificado'}</p>
                  <p><span className="font-medium">Cédula:</span> {user.cedula || 'No especificada'}</p>
                  <p><span className="font-medium">Rol:</span> {user.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
                  {user.accessCodeExpiresAt && (
                    <p>
                      <span className="font-medium">Acceso válido hasta:</span>{' '}
                      {new Date(user.accessCodeExpiresAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Equipos reservados */}
              <div className="mt-6 bg-gray-50 p-5 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Mis Equipos Reservados</h2>
                {user.equipos_reservados && user.equipos_reservados.length > 0 ? (
                  <ul className="space-y-2">
                    {user.equipos_reservados.map((tag, index) => (
                      <li key={index} className="p-2 border-b">
                        <p className="font-mono text-sm">{tag}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No tienes equipos reservados actualmente.</p>
                )}
              </div>
            </div>
            
            {/* Código de acceso */}
            <div className="md:w-1/3">
              <div className="bg-orange-50 p-5 rounded-lg border border-orange-200">
                <h2 className="text-xl font-semibold text-orange-800 mb-4 text-center">Código de Acceso</h2>
                
                {isClient && user.codigo_acceso ? (
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-3 rounded-lg border-2 border-gray-200 mb-4">
                      <QRCodeSVG 
                        value={user.codigo_acceso} 
                        size={180}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <p className="text-2xl font-mono tracking-wider text-center text-orange-700">
                      {user.codigo_acceso}
                    </p>
                    <p className="mt-2 text-sm text-center text-gray-600">
                      Muestra este código para acceder al gabinete de lentes
                    </p>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">
                    {isClient 
                      ? "No tienes un código de acceso asignado" 
                      : "Cargando código de acceso..."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 