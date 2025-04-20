'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">CentroMundoX Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Hola, {user?.email || 'Usuario'}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Bienvenido a la plataforma CentroMundoX</h2>
          <p className="text-gray-600 mb-6">
            Desde aquí podrás gestionar tu experiencia en el metaverso y acceder a todas las funcionalidades disponibles.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tarjeta de Perfil */}
            <div className="bg-gray-50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-blue-600 mb-2">Mi Perfil</h3>
              <p className="text-sm text-gray-600 mb-4">Gestiona tu información personal y preferencias</p>
              <button 
                onClick={() => router.push('/dashboard/profile')}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Ir a mi perfil →
              </button>
            </div>
            
            {/* Tarjeta de Reservas */}
            <div className="bg-gray-50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-blue-600 mb-2">Reserva de Lentes</h3>
              <p className="text-sm text-gray-600 mb-4">Solicita y gestiona préstamos de lentes de realidad virtual</p>
              <button 
                onClick={() => router.push('/dashboard/reservas')}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Gestionar reservas →
              </button>
            </div>
            
            {/* Tarjeta de Recursos */}
            <div className="bg-gray-50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-blue-600 mb-2">Recursos Educativos</h3>
              <p className="text-sm text-gray-600 mb-4">Accede a material educativo sobre el metaverso</p>
              <button 
                onClick={() => router.push('/dashboard/resources')}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Explorar recursos →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 