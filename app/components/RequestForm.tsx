'use client';

import React, { useState } from 'react';
import { createLensRequest } from '../lib/lensRequests';
import { useAuth } from '../context/AuthContext';

export default function RequestForm() {
  const { user } = useAuth();
  const [requestReason, setRequestReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !user.id) {
      setError('No se puede enviar la solicitud: ID de usuario no disponible');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      await createLensRequest(requestReason);
      setSuccess(true);
      setRequestReason(''); // Limpiar el formulario
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-dark-blue mb-4">
        Solicitar Préstamo de Lentes
      </h2>
      
      {!user || !user.id ? (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          Usuario con ID {user?.id || 'null'} no encontrado
        </div>
      ) : null}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          ¡Solicitud enviada con éxito! Te notificaremos cuando sea procesada.
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="requestReason" className="block mb-2 text-sm font-medium text-dark-blue">
            Motivo de la Solicitud
          </label>
          <textarea
            id="requestReason"
            value={requestReason}
            onChange={(e) => setRequestReason(e.target.value)}
            rows={4}
            className="w-full p-3 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange"
            placeholder="Explica brevemente para qué necesitas los lentes y durante cuánto tiempo..."
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !requestReason.trim() || !user?.id}
          className="py-3 px-6 bg-primary-orange text-white font-bold rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </form>
    </div>
  );
} 