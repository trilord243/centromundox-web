// Funciones para interactuar con MongoDB a través de API Routes

// Obtener el usuario actual con todos sus detalles
export async function getCurrentUser(userId: string) {
  try {
    const response = await fetch(`/api/mongodb?action=getCurrentUser&userId=${userId}`);
    if (!response.ok) {
      throw new Error('Error al obtener usuario');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
}

// Obtener todos los usuarios
export async function getAllUsers() {
  try {
    const response = await fetch(`/api/mongodb?action=getAllUsers`);
    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

// Obtener el estado del gabinete (productos presentes)
export async function getCabinetStatus() {
  try {
    const response = await fetch(`/api/mongodb?action=getCabinetStatus`);
    if (!response.ok) {
      throw new Error('Error al obtener estado del gabinete');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener estado del gabinete:', error);
    throw error;
  }
}

// Obtener todos los productos
export async function getAllProducts() {
  try {
    const response = await fetch(`/api/mongodb?action=getAllProducts`);
    if (!response.ok) {
      throw new Error('Error al obtener productos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
}

// Obtener todos los objetos (lentes y otros dispositivos físicos)
export async function getAllObjects() {
  try {
    const response = await fetch(`/api/mongodb?action=getAllObjects`);
    if (!response.ok) {
      throw new Error('Error al obtener objetos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener objetos:', error);
    throw error;
  }
}

// Obtener las solicitudes de lentes
export async function getLensRequests() {
  try {
    const response = await fetch(`/api/mongodb?action=getLensRequests`);
    if (!response.ok) {
      throw new Error('Error al obtener solicitudes de lentes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener solicitudes de lentes:', error);
    throw error;
  }
}

// Aprobar una solicitud de lentes
export async function approveLensRequest(requestId: string, data: any) {
  try {
    const response = await fetch(`/api/mongodb`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'approveLensRequest',
        data: {
          requestId,
          accessCode: data.accessCode,
          expiration: data.expiration,
          processedBy: data.processedBy
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error('Error al aprobar solicitud');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al aprobar solicitud:', error);
    throw error;
  }
} 