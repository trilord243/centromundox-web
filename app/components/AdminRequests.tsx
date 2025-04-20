'use client';

import React, { useEffect, useState } from 'react';
import { getAllRequests, approveRequest, rejectRequest, setAccessExpiration, LensRequest } from '../lib/lensRequests';

export default function AdminRequests() {
  const [requests, setRequests] = useState<LensRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  
  // Estados para modal de aprobación
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [days, setDays] = useState(0);
  const [weeks, setWeeks] = useState(0);
  const [months, setMonths] = useState(1);
  
  // Estados para modal de rechazo
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Añadir un estado para mostrar información de depuración
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [selectedStatus]);

  // Verificar conexión con API
  useEffect(() => {
    const checkAPIConnection = async () => {
      try {
        const response = await fetch('http://localhost:3000/health', { method: 'GET' });
        const data = await response.json();
        console.log('API connection check:', data);
      } catch (error) {
        console.error('Error connecting to API:', error);
      }
    };
    
    checkAPIConnection();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await getAllRequests(selectedStatus || undefined);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las solicitudes');
    } finally {
      setIsLoading(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Obtener clase de estado
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Obtener texto de estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobada';
      case 'rejected':
        return 'Rechazada';
      default:
        return 'Pendiente';
    }
  };

  // Abrir modal de aprobación
  const openApproveModal = (requestId: string, userId: string) => {
    console.log('openApproveModal - requestId:', requestId, 'userId:', userId);
    if (!requestId) {
      setError('Error: No se puede aprobar una solicitud sin ID');
      return;
    }
    
    setSelectedRequestId(requestId);
    setSelectedUserId(userId);
    setDays(0);
    setWeeks(0);
    setMonths(1);
    setError(''); // Limpiar errores previos
    setIsApproveModalOpen(true);
  };

  // Abrir modal de rechazo
  const openRejectModal = (requestId: string) => {
    console.log('openRejectModal - requestId:', requestId);
    if (!requestId) {
      setError('Error: No se puede rechazar una solicitud sin ID');
      return;
    }
    
    setSelectedRequestId(requestId);
    setRejectionReason('');
    setError(''); // Limpiar errores previos
    setIsRejectModalOpen(true);
  };

  // Manejar aprobación de solicitud
  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que tengamos un ID de solicitud
    if (!selectedRequestId) {
      setError('Error: ID de solicitud no encontrado');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Configurar la duración para la expiración
      const expirationDuration = {
        days,
        weeks,
        months
      };
      
      console.log('Enviando datos:');
      console.log('ID de solicitud a aprobar:', selectedRequestId);
      console.log('URL completa:', `http://localhost:3000/lens-requests/${selectedRequestId}`);
      console.log('ID de usuario para expiración:', selectedUserId);
      console.log('Duración:', expirationDuration);
      
      // Primero, aprobar la solicitud
      await approveRequest(selectedRequestId, expirationDuration);
      console.log('Solicitud aprobada exitosamente');
      
      // Luego, establecer fecha de expiración para el usuario
      if (selectedUserId) {
        try {
          await setAccessExpiration(selectedUserId, expirationDuration);
          console.log('Fecha de expiración establecida exitosamente');
        } catch (expError) {
          console.error('Error al establecer la fecha de expiración:', expError);
          setError('La solicitud fue aprobada pero hubo un error al establecer la fecha de expiración');
        }
      }
      
      setIsApproveModalOpen(false);
      fetchRequests();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al aprobar la solicitud';
      console.error('Error en la aprobación:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar rechazo de solicitud
  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que tengamos un ID de solicitud
    if (!selectedRequestId) {
      setError('Error: ID de solicitud no encontrado');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      console.log('ID de solicitud a rechazar:', selectedRequestId);
      await rejectRequest(selectedRequestId, rejectionReason);
      console.log('Solicitud rechazada exitosamente');
      
      setIsRejectModalOpen(false);
      fetchRequests();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al rechazar la solicitud';
      console.error('Error en el rechazo:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && requests.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-dark-blue mb-4">
        Gestión de Solicitudes
      </h2>
      
      <div className="mb-4">
        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Filtrar por estado:
        </label>
        <select
          id="status-filter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
        >
          <option value="">Todos</option>
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobadas</option>
          <option value="rejected">Rechazadas</option>
        </select>
      </div>
      
      {requests.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No hay solicitudes que coincidan con el filtro actual.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motivo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => {
                // Obtener ID correcto (podría estar en id o _id)
                const requestId = request._id || request.id;
                // Validar que la solicitud tenga un ID válido
                const hasValidId = !!requestId && typeof requestId === 'string' && requestId.trim() !== '';
                // Validar que tenga userId
                const hasValidUserId = !!request.userId && typeof request.userId === 'string' && request.userId.trim() !== '';
                
                // Añadir console.log para depuración
                console.log('Solicitud:', {
                  id: request.id,
                  _id: request._id,
                  userId: request.userId,
                  hasValidId,
                  hasValidUserId,
                  status: request.status
                });

                return (
                  <tr key={hasValidId ? requestId : `request-${Math.random()}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.userId || 'N/A'}
                      {!request.userId && <span className="text-red-500"> (ID no disponible)</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {request.requestReason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          {hasValidId && hasValidUserId ? (
                            <button
                              onClick={() => openApproveModal(requestId, request.userId)}
                              className="px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-md"
                            >
                              Aprobar
                            </button>
                          ) : (
                            <button
                              disabled
                              className="px-3 py-1 text-gray-400 bg-gray-100 cursor-not-allowed rounded-md"
                              title={!hasValidId ? "No se puede aprobar: ID de solicitud inválido" : "No se puede aprobar: ID de usuario no disponible"}
                            >
                              Aprobar
                            </button>
                          )}
                          {hasValidId ? (
                            <button
                              onClick={() => openRejectModal(requestId)}
                              className="px-3 py-1 text-white bg-red-600 hover:bg-red-700 transition-colors rounded-md ml-2"
                            >
                              Rechazar
                            </button>
                          ) : (
                            <button
                              disabled
                              className="px-3 py-1 text-gray-400 bg-gray-100 cursor-not-allowed rounded-md ml-2"
                              title="No se puede rechazar: ID de solicitud inválido"
                            >
                              Rechazar
                            </button>
                          )}
                        </div>
                      )}
                      {request.status === 'approved' && (
                        <div>
                          <p><span className="font-medium">Código:</span> {request.accessCode || 'N/A'}</p>
                          <p><span className="font-medium">Expira:</span> {request.expiresAt ? formatDate(request.expiresAt) : 'N/A'}</p>
                        </div>
                      )}
                      {request.status === 'rejected' && (
                        <p><span className="font-medium">Razón:</span> {request.rejectionReason}</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modal de Aprobación */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Aprobar Solicitud</h3>
            
            <div className="mb-4 text-sm">
              <p className="text-gray-600 mb-2">
                <span className="font-medium">ID de solicitud:</span> {selectedRequestId}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">ID de usuario:</span> {selectedUserId || 'No disponible'}
              </p>
              <p className="text-gray-500 mb-2">
                Establece la duración del acceso. El código será generado automáticamente por el sistema.
              </p>
            </div>
            
            <form onSubmit={handleApprove}>
              <div className="mt-2">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="days" className="block text-sm font-medium text-gray-700">
                      Días
                    </label>
                    <input
                      type="number"
                      id="days"
                      value={days}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setDays(isNaN(value) ? 0 : Math.max(0, value));
                      }}
                      min="0"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="weeks" className="block text-sm font-medium text-gray-700">
                      Semanas
                    </label>
                    <input
                      type="number"
                      id="weeks"
                      value={weeks}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setWeeks(isNaN(value) ? 0 : Math.max(0, value));
                      }}
                      min="0"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="months" className="block text-sm font-medium text-gray-700">
                      Meses
                    </label>
                    <input
                      type="number"
                      id="months"
                      value={months}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setMonths(isNaN(value) ? 0 : Math.max(0, value));
                      }}
                      min="0"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsApproveModalOpen(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  disabled={isLoading || (days === 0 && weeks === 0 && months === 0) || !selectedUserId}
                >
                  {isLoading ? 'Procesando...' : 'Aprobar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal de Rechazo */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Rechazar Solicitud</h3>
            <form onSubmit={handleReject}>
              <div className="mt-2">
                <div className="mb-4">
                  <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">
                    Razón del Rechazo
                  </label>
                  <textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                  disabled={isLoading}
                >
                  {isLoading ? 'Procesando...' : 'Rechazar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Botón de depuración */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowDebugInfo(!showDebugInfo)}
          className="px-3 py-1 text-white bg-gray-600 hover:bg-gray-700 transition-colors rounded-md text-sm"
        >
          {showDebugInfo ? 'Ocultar info de depuración' : 'Mostrar info de depuración'}
        </button>
      </div>

      {/* Panel de depuración */}
      {showDebugInfo && (
        <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-md overflow-auto max-h-64">
          <h3 className="text-sm font-semibold mb-2">Información de depuración</h3>
          <p className="text-xs mb-1"><strong>API URL:</strong> http://localhost:3000</p>
          <p className="text-xs mb-1"><strong>Método para aprobar/rechazar:</strong> PATCH</p>
          <p className="text-xs mb-1"><strong>Ruta para aprobar/rechazar:</strong> /lens-requests/:id</p>
          <p className="text-xs mb-1"><strong>Token presente:</strong> {localStorage.getItem('auth_token') ? 'Sí' : 'No'}</p>
          
          <div className="mt-3">
            <h4 className="text-xs font-semibold mb-1">Ejemplo de payload para aprobar:</h4>
            <pre className="text-xs bg-gray-200 p-2 rounded">
{`{
  "status": "approved",
  "accessCode": "XYZ123",
  "expiresAt": "2025-12-31T23:59:59Z"
}`}
            </pre>
          </div>
          
          <div className="mt-3">
            <h4 className="text-xs font-semibold mb-1">Pruebas y solución de problemas:</h4>
            <ol className="text-xs list-decimal pl-4">
              <li>Asegúrate de que el backend esté ejecutándose en <code>http://localhost:3000</code></li>
              <li>Verifica que la ruta sea <code>/lens-requests/:id</code> (plural, no singular)</li>
              <li>Confirma que estás usando el método PATCH (no POST)</li>
              <li>El payload debe tener el formato exacto mostrado arriba</li>
              <li>En caso de error "expiresAt must be a Date instance", el backend podría estar esperando un formato específico de fecha</li>
            </ol>
            <button
              onClick={() => {
                // Prueba la conexión con el backend
                fetch('http://localhost:3000/health')
                  .then(res => res.json())
                  .then(data => console.log('API health check:', data))
                  .catch(err => console.error('API connection error:', err));
              }}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded mt-2"
            >
              Probar conexión API
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 