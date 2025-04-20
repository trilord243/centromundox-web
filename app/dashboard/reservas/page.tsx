'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import RequestForm from '../../components/RequestForm';
import UserRequests from '../../components/UserRequests';
import AdminRequests from '../../components/AdminRequests';

export default function ReservasPage() {
  const { user, isAdmin } = useAuth();
  
  useEffect(() => {
    // Información de diagnóstico
    console.log('Estado actual del usuario:', user);
    console.log('Usuario es admin:', isAdmin());
    console.log('Token almacenado:', localStorage.getItem('auth_token'));
  }, [user, isAdmin]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">
        Sistema de Reservas de Lentes
      </h1>
      
      {/* Información de diagnóstico */}
      {user ? (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <p><strong>Usuario actual:</strong> {user.email}</p>
          <p><strong>ID:</strong> {user.id || 'No disponible'}</p>
          <p><strong>Rol:</strong> {user.role || 'No disponible'}</p>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="font-medium">No se detectó información de usuario. Es posible que necesites iniciar sesión nuevamente.</p>
        </div>
      )}
      
      {isAdmin() ? (
        // Vista de administrador
        <div>
          <p className="text-gray-600 mb-6">
            Como administrador, puedes ver y gestionar todas las solicitudes de préstamo de lentes.
          </p>
          <AdminRequests />
        </div>
      ) : (
        // Vista de usuario normal
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              Solicitar Lentes
            </h2>
            <p className="text-gray-600 mb-4">
              Utiliza el siguiente formulario para solicitar un préstamo de lentes de realidad virtual.
            </p>
            <RequestForm />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              Mis Solicitudes
            </h2>
            <p className="text-gray-600 mb-4">
              Aquí puedes ver el estado de tus solicitudes anteriores.
            </p>
            <UserRequests />
          </div>
        </div>
      )}
    </div>
  );
} 