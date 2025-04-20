// Tipos para solicitudes de lentes
export interface LensRequest {
  id?: string;
  _id?: string;  // Añadir soporte para _id de MongoDB
  userId: string;
  requestReason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  accessCode?: string;
  expiresAt?: string;
  rejectionReason?: string;
}

// URL base de la API
const API_URL = 'http://localhost:3000';

// Función para crear una nueva solicitud de lentes
export async function createLensRequest(requestReason: string): Promise<LensRequest> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('No estás autenticado');
  }
  
  try {
    const response = await fetch(`${API_URL}/lens-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ requestReason }),
    });

    // Manejar respuesta no exitosa
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al procesar la respuesta' }));
      console.error('Error de API:', errorData);
      throw new Error(errorData.message || `Error al crear la solicitud (${response.status})`);
    }

    return response.json();
  } catch (error) {
    console.error('Error en createLensRequest:', error);
    throw error;
  }
}

// Función para obtener todas las solicitudes del usuario autenticado
export async function getUserRequests(): Promise<LensRequest[]> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('No estás autenticado');
  }
  
  const response = await fetch(`${API_URL}/lens-requests/my-requests`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Error al obtener las solicitudes');
  }

  return response.json();
}

// Función para obtener todas las solicitudes (solo administradores)
export async function getAllRequests(status?: string, userId?: string): Promise<LensRequest[]> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('No estás autenticado');
  }
  
  let url = `${API_URL}/lens-requests/admin`;
  const params = new URLSearchParams();
  
  if (status) params.append('status', status);
  if (userId) params.append('userId', userId);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Error al obtener las solicitudes');
  }

  return response.json();
}

// Función para aprobar una solicitud (solo administradores)
export async function approveRequest(
  requestId: string,
  expirationDuration: { days: number; weeks: number; months: number }
): Promise<LensRequest> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('No estás autenticado');
  }
  
  try {
    // Asegurarse de que el requestId es una cadena válida
    if (!requestId || typeof requestId !== 'string') {
      throw new Error('ID de solicitud inválido');
    }

    // Verificar formato de MongoDB ObjectId (24 caracteres hexadecimales)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(requestId);
    if (!isValidObjectId) {
      console.error('ID no tiene formato de MongoDB ObjectId:', requestId);
      // Seguimos con la ejecución por si el backend maneja otros formatos
    }
    
    // Generar un código de acceso simple para pruebas
    const accessCode = `A${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    console.log('Enviando aprobación para solicitud:', requestId);
    console.log('URL completa:', `${API_URL}/lens-requests/${requestId}`);
    
    // Construir el payload con el formato correcto según lo visto en Postman
    const payload = {
      status: "approved",
      accessCode: "XYZ1238", // Código fijo para pruebas
      expiration: expirationDuration // Usar "expiration" en lugar de "expirationDuration"
    };
    
    console.log('Payload:', payload);
    
    const response = await fetch(`${API_URL}/lens-requests/${requestId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });
  
    // Analizar la respuesta
    const rawResponse = await response.text();
    console.log('Respuesta raw del servidor:', rawResponse);
    
    let responseData;
    try {
      responseData = JSON.parse(rawResponse);
    } catch (err) {
      console.error('Error al parsear respuesta JSON:', err);
      throw new Error(`Error al procesar la respuesta del servidor: ${rawResponse}`);
    }
  
    if (!response.ok) {
      console.error('Error de API:', responseData);
      throw new Error(responseData.message || `Error al aprobar la solicitud (${response.status}): ${rawResponse}`);
    }
  
    return responseData;
  } catch (error) {
    console.error('Error en approveRequest:', error);
    throw error;
  }
}

// Función para rechazar una solicitud (solo administradores)
export async function rejectRequest(
  requestId: string, 
  rejectionReason: string
): Promise<LensRequest> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('No estás autenticado');
  }
  
  try {
    // Asegurarse de que el requestId es una cadena válida
    if (!requestId || typeof requestId !== 'string') {
      throw new Error('ID de solicitud inválido');
    }

    // Verificar formato de MongoDB ObjectId (24 caracteres hexadecimales)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(requestId);
    if (!isValidObjectId) {
      console.error('ID no tiene formato de MongoDB ObjectId:', requestId);
      // Seguimos con la ejecución por si el backend maneja otros formatos
    }

    console.log('Enviando rechazo para solicitud:', requestId);
    
    const response = await fetch(`${API_URL}/lens-requests/${requestId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        status: 'rejected',
        rejectionReason
      }),
    });

    // Analizar la respuesta
    const rawResponse = await response.text();
    console.log('Respuesta raw del servidor:', rawResponse);
    
    let responseData;
    try {
      responseData = JSON.parse(rawResponse);
    } catch (err) {
      console.error('Error al parsear respuesta JSON:', err);
      throw new Error(`Error al procesar la respuesta del servidor: ${rawResponse}`);
    }

    if (!response.ok) {
      console.error('Error de API:', responseData);
      throw new Error(responseData.message || `Error al rechazar la solicitud (${response.status}): ${rawResponse}`);
    }

    return responseData;
  } catch (error) {
    console.error('Error en rejectRequest:', error);
    throw error;
  }
}

// Función para establecer la fecha de expiración para un usuario (solo administradores)
export async function setAccessExpiration(
  userId: string,
  duration: { days: number; weeks: number; months: number }
): Promise<any> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('No estás autenticado');
  }
  
  try {
    // Asegurarse de que el userId es una cadena válida
    if (!userId || typeof userId !== 'string') {
      throw new Error('ID de usuario inválido');
    }
    
    console.log('Enviando expiración para usuario:', userId, 'con duración:', duration);
    
    const response = await fetch(`${API_URL}/admin/users/${userId}/access-expiration`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(duration),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al procesar la respuesta' }));
      console.error('Error de API:', errorData);
      throw new Error(errorData.message || `Error al establecer fecha de expiración (${response.status})`);
    }

    return response.json();
  } catch (error) {
    console.error('Error en setAccessExpiration:', error);
    throw error;
  }
} 