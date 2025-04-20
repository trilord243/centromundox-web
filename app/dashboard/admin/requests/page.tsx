'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../../lib/config';

interface LensRequest {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  requestReason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  accessCode?: string;
  expiresAt?: string;
  rejectionReason?: string;
}

export default function AdminRequestsPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<LensRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    days: 0,
    weeks: 0,
    months: 1,
    accessCode: `A${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
  });
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Verificar si el usuario es administrador
  useEffect(() => {
    if (user && !isAdmin()) {
      router.push('/dashboard');
    }
  }, [user, isAdmin, router]);

  // Cargar solicitudes
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('No estás autenticado');
        }
        
        const response = await fetch(`${API_URL}/lens-requests/admin`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error al obtener solicitudes: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ordenar por fecha de creación (más recientes primero)
        const sortedRequests = data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setRequests(sortedRequests);
      } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        setError('No se pudieron cargar las solicitudes');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (requestId: string) => {
    setSelectedRequest(requestId);
    setFormData({
      ...formData,
      accessCode: `A${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    });
  };

  const handleSubmitApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setProcessingId(selectedRequest);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No estás autenticado');
      }
      
      const response = await fetch(`${API_URL}/lens-requests/${selectedRequest}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'approved',
          accessCode: formData.accessCode,
          expiration: {
            days: formData.days,
            weeks: formData.weeks,
            months: formData.months
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error al aprobar solicitud: ${response.status}`);
      }
      
      const updatedRequest = await response.json();

      // Actualizar la lista de solicitudes
      setRequests(requests.map(req => 
        req._id === selectedRequest 
          ? { ...req, status: 'approved', accessCode: formData.accessCode } 
          : req
      ));

      setSuccess(`Solicitud aprobada con éxito. Código de acceso: ${formData.accessCode}`);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
      setError('Error al aprobar la solicitud');
    } finally {
      setProcessingId(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'accessCode' ? value : parseInt(value, 10)
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 py-8 flex items-center justify-center">
        <p>Cargando solicitudes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Administración de Solicitudes</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}
          
          {selectedRequest && (
            <div className="mb-6 p-4 border rounded-lg bg-blue-50">
              <h2 className="text-lg font-semibold mb-3">Aprobar Solicitud</h2>
              <form onSubmit={handleSubmitApproval} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Código de Acceso</label>
                    <input
                      type="text"
                      name="accessCode"
                      value={formData.accessCode}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Días</label>
                    <input
                      type="number"
                      name="days"
                      min="0"
                      value={formData.days}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Semanas</label>
                    <input
                      type="number"
                      name="weeks"
                      min="0"
                      value={formData.weeks}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Meses</label>
                    <input
                      type="number"
                      name="months"
                      min="0"
                      value={formData.months}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={processingId === selectedRequest}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {processingId === selectedRequest ? 'Aprobando...' : 'Aprobar Solicitud'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-left">Usuario</th>
                  <th className="py-2 px-4 text-left">Motivo</th>
                  <th className="py-2 px-4 text-left">Estado</th>
                  <th className="py-2 px-4 text-left">Fecha</th>
                  <th className="py-2 px-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      No hay solicitudes pendientes
                    </td>
                  </tr>
                ) : (
                  requests.map(request => (
                    <tr key={request._id} className={
                      request.status === 'approved' ? 'bg-green-50' :
                      request.status === 'rejected' ? 'bg-red-50' : ''
                    }>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{request.userName}</p>
                          <p className="text-sm text-gray-600">{request.userEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">{request.requestReason}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status === 'approved' ? 'Aprobada' :
                           request.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                        </span>
                        {request.status === 'approved' && request.accessCode && (
                          <p className="text-xs mt-1">Código: {request.accessCode}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        {request.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(request._id)}
                            disabled={processingId === request._id}
                            className="text-blue-600 hover:text-blue-800 mr-3 disabled:opacity-50"
                          >
                            Aprobar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 