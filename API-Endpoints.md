# API CentroMundoX - Documentación de Endpoints

## Tabla de Contenidos
- [Autenticación](#autenticación)
- [Usuarios](#usuarios)
- [Administrador](#administrador)
- [Solicitudes de Lentes](#solicitudes-de-lentes)
- [Productos](#productos)
- [Características Adicionales](#características-adicionales)

## Autenticación
### POST /auth/login
- **Descripción**: Iniciar sesión con email y contraseña
- **Body**: 
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }
  ```
- **Respuesta Exitosa**: 
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Códigos de Estado**:
  - `200 OK`: Login exitoso
  - `401 Unauthorized`: Credenciales inválidas

## Usuarios
### GET /users
- **Descripción**: Obtener todos los usuarios
- **Autenticación**: JWT Bearer Token
- **Respuesta**: Lista de usuarios
- **Códigos de Estado**:
  - `200 OK`: Lista de usuarios devuelta exitosamente
  - `401 Unauthorized`: No autenticado

### GET /users/profile/me
- **Descripción**: Obtener el perfil completo del usuario autenticado
- **Autenticación**: JWT Bearer Token
- **Respuesta**: 
  ```json
  {
    "id": "6507f200a1d91e3e982b1234",
    "name": "Nombre",
    "lastName": "Apellido",
    "email": "correo@ejemplo.com",
    "cedula": "1234567890",
    "codigo_acceso": "XYZ123",
    "accessCodeExpiresAt": "2025-12-31T23:59:59Z",
    "role": "user",
    "equipos_reservados": []
  }
  ```
- **Códigos de Estado**:
  - `200 OK`: Perfil del usuario devuelto exitosamente
  - `401 Unauthorized`: No autenticado
  - `404 Not Found`: Usuario no encontrado

### GET /users/access-code/me
- **Descripción**: Obtener únicamente la información del código de acceso del usuario autenticado
- **Autenticación**: JWT Bearer Token
- **Respuesta**: 
  ```json
  {
    "codigo_acceso": "XYZ123",
    "expiresAt": "2025-12-31T23:59:59Z",
    "isActive": true
  }
  ```
- **Notas**:
  - El campo `isActive` indica si el código está vigente (no ha expirado)
  - Si el usuario no tiene un código de acceso, `codigo_acceso` y `expiresAt` serán `null`
- **Códigos de Estado**:
  - `200 OK`: Información del código de acceso devuelta exitosamente
  - `401 Unauthorized`: No autenticado
  - `404 Not Found`: Usuario no encontrado

### GET /users/:id
- **Descripción**: Obtener usuario por ID
- **Autenticación**: JWT Bearer Token
- **Parámetros**:
  - `id`: ID del usuario
- **Respuesta**: Datos del usuario
- **Códigos de Estado**:
  - `200 OK`: Usuario encontrado
  - `401 Unauthorized`: No autenticado
  - `404 Not Found`: Usuario no encontrado

### POST /users
- **Descripción**: Crear un nuevo usuario
- **Autenticación**: JWT Bearer Token
- **Body**: 
  ```json
  {
    "name": "Nombre",
    "lastName": "Apellido",
    "email": "correo@ejemplo.com",
    "cedula": "1234567890",
    "equipos_reservados": [],
    "password": "contraseña123",
    "expectedTags": [],
    "missingTags": [],
    "presentTags": []
  }
  ```
- **Respuesta**: Usuario creado
- **Códigos de Estado**:
  - `201 Created`: Usuario creado exitosamente
  - `401 Unauthorized`: No autenticado
  - `400 Bad Request`: Datos inválidos

### DELETE /users/:id
- **Descripción**: Eliminar usuario por ID
- **Autenticación**: JWT Bearer Token
- **Parámetros**:
  - `id`: ID del usuario
- **Códigos de Estado**:
  - `200 OK`: Usuario eliminado exitosamente
  - `401 Unauthorized`: No autenticado
  - `404 Not Found`: Usuario no encontrado

## Administrador
### PATCH /admin/users/:id/access-expiration
- **Descripción**: Establecer fecha de caducidad del código de acceso de un usuario
- **Autenticación**: JWT Bearer Token (rol admin)
- **Parámetros**:
  - `id`: ID del usuario
- **Body**:
  ```json
  {
    "days": 30,
    "weeks": 0,
    "months": 0
  }
  ```
- **Códigos de Estado**:
  - `200 OK`: Fecha de caducidad actualizada
  - `401 Unauthorized`: No autenticado
  - `403 Forbidden`: No autorizado (no es admin)
  - `404 Not Found`: Usuario no encontrado

## Solicitudes de Lentes
### POST /lens-requests
- **Descripción**: Crear una nueva solicitud de lentes
- **Autenticación**: JWT Bearer Token
- **Body**:
  ```json
  {
    "requestReason": "Necesito los lentes para mi proyecto de investigación"
  }
  ```
- **Respuesta**: Solicitud creada
- **Códigos de Estado**:
  - `201 Created`: Solicitud creada exitosamente
  - `400 Bad Request`: Datos inválidos o ya existe una solicitud pendiente
  - `401 Unauthorized`: No autenticado

### GET /lens-requests/my-requests
- **Descripción**: Obtener todas las solicitudes del usuario autenticado
- **Autenticación**: JWT Bearer Token
- **Respuesta**: Lista de solicitudes del usuario
- **Códigos de Estado**:
  - `200 OK`: Lista de solicitudes devuelta exitosamente
  - `401 Unauthorized`: No autenticado

### GET /lens-requests/admin
- **Descripción**: Obtener todas las solicitudes (solo administradores)
- **Autenticación**: JWT Bearer Token (rol admin)
- **Parámetros Query (opcionales)**:
  - `status`: Estado de la solicitud (pending, approved, rejected)
  - `userId`: ID del usuario
- **Respuesta**: Lista de solicitudes
- **Códigos de Estado**:
  - `200 OK`: Lista de solicitudes devuelta exitosamente
  - `401 Unauthorized`: No autenticado
  - `403 Forbidden`: No autorizado (no es admin)

### GET /lens-requests/:id
- **Descripción**: Obtener una solicitud por ID
- **Autenticación**: JWT Bearer Token
- **Parámetros**:
  - `id`: ID de la solicitud
- **Respuesta**: Detalle de la solicitud
- **Códigos de Estado**:
  - `200 OK`: Solicitud encontrada
  - `401 Unauthorized`: No autenticado
  - `404 Not Found`: Solicitud no encontrada

### PATCH /lens-requests/:id
- **Descripción**: Actualizar una solicitud (solo administradores)
- **Autenticación**: JWT Bearer Token (rol admin)
- **Parámetros**:
  - `id`: ID de la solicitud
- **Body - Opción 1 (Usando formato de duración)**:
  ```json
  {
    "status": "approved",
    "accessCode": "XYZ123",
    "expiration": {
      "days": 0,
      "weeks": 0,
      "months": 1
    }
  }
  ```
- **Body - Opción 2 (Usando fecha directa)**:
  ```json
  {
    "status": "approved",
    "accessCode": "XYZ123",
    "expiresAt": "2025-12-31T23:59:59Z"
  }
  ```
- **Body - Opción 3 (Rechazar solicitud)**:
  ```json
  {
    "status": "rejected",
    "rejectionReason": "Falta información en la solicitud"
  }
  ```
- **Respuesta**: Solicitud actualizada
- **Notas**:
  - Al aprobar una solicitud, automáticamente se envía un correo electrónico al usuario con el código QR de acceso
  - El formato de duración (días, semanas, meses) es similar al endpoint de administración para establecer la expiración
- **Códigos de Estado**:
  - `200 OK`: Solicitud actualizada exitosamente
  - `400 Bad Request`: Datos inválidos o solicitud ya procesada
  - `401 Unauthorized`: No autenticado
  - `403 Forbidden`: No autorizado (no es admin)
  - `404 Not Found`: Solicitud no encontrada

### DELETE /lens-requests/:id
- **Descripción**: Eliminar una solicitud (solo administradores)
- **Autenticación**: JWT Bearer Token (rol admin)
- **Parámetros**:
  - `id`: ID de la solicitud
- **Códigos de Estado**:
  - `200 OK`: Solicitud eliminada exitosamente
  - `401 Unauthorized`: No autenticado
  - `403 Forbidden`: No autorizado (no es admin)
  - `404 Not Found`: Solicitud no encontrada

## Productos
### GET /products
- **Descripción**: Obtener todos los productos
- **Respuesta**: Lista de todos los productos
- **Códigos de Estado**:
  - `200 OK`: Lista de productos devuelta exitosamente

### GET /products/cabinet-inventory
- **Descripción**: Obtener productos disponibles en el gabinete
- **Respuesta**: Lista de productos en el gabinete
- **Códigos de Estado**:
  - `200 OK`: Lista de productos devuelta exitosamente

### POST /products
- **Descripción**: Crear un nuevo producto individual
- **Autenticación**: JWT Bearer Token (rol admin)
- **Body**:
  ```json
  {
    "name": "MetaQuest 3",
    "serialNumber": "MQ3-12345",
    "rfidTag": "3000E200000000000000001A",
    "type": "headset"
  }
  ```
  o
  ```json
  {
    "name": "Controller derecho MQ3",
    "serialNumber": "CTRL-R-67890",
    "rfidTag": "3000E200000000000000002B",
    "type": "controller",
    "headsetId": "6507f200a1d91e3e982b1234"
  }
  ```
- **Respuesta**: Producto creado
- **Códigos de Estado**:
  - `201 Created`: Producto creado exitosamente
  - `401 Unauthorized`: No autenticado
  - `403 Forbidden`: No autorizado (no es admin)

### POST /products/metaquest-set
- **Descripción**: Crear un set completo MetaQuest
- **Autenticación**: JWT Bearer Token (rol admin)
- **Body**:
  ```json
  {
    "headsetName": "MetaQuest 3",
    "headsetSerialNumber": "MQ3-12345",
    "headsetRfidTag": "3000E200000000000000001A",
    "controllers": [
      {
        "serialNumber": "CTRL-L-67890",
        "rfidTag": "3000E200000000000000002B"
      },
      {
        "serialNumber": "CTRL-R-67891",
        "rfidTag": "3000E200000000000000003C"
      }
    ]
  }
  ```
- **Códigos de Estado**:
  - `201 Created`: Set MetaQuest creado exitosamente
  - `401 Unauthorized`: No autenticado
  - `403 Forbidden`: No autorizado (no es admin)

### GET /products/rfid/:tag
- **Descripción**: Buscar producto por tag RFID
- **Parámetros**:
  - `tag`: Tag RFID del producto
- **Respuesta**: Datos del producto
- **Códigos de Estado**:
  - `200 OK`: Producto encontrado
  - `404 Not Found`: Producto no encontrado 

### POST /products/rfid/bulk
- **Descripción**: Buscar productos por múltiples tags RFID
- **Body**:
  ```json
  {
    "rfidTags": [
      "e280117000000208911b6a3c",
      "e280117000000208911b7b35",
      "35e017030b00000000114e0f"
    ]
  }
  ```
- **Respuesta**: Lista de resultados con información de cada tag RFID y su producto correspondiente
  ```json
  [
    {
      "rfidTag": "e280117000000208911b6a3c",
      "product": {
        "_id": "6507f200a1d91e3e982b5678",
        "name": "MetaQuest 3",
        "serialNumber": "MQ3-12345",
        "rfidTag": "e280117000000208911b6a3c",
        "type": "headset",
        "createdAt": "2023-09-18T10:30:24.123Z",
        "updatedAt": "2023-09-18T10:30:24.123Z",
        "isAvailable": true,
        "codigo": "H123456-MQ312345"
      }
    },
    {
      "rfidTag": "e280117000000208911b7b35",
      "product": {
        "_id": "6507f200a1d91e3e982b5679",
        "name": "Controller for MetaQuest 3",
        "serialNumber": "CTRL-L-67890",
        "rfidTag": "e280117000000208911b7b35",
        "type": "controller",
        "headsetId": "6507f200a1d91e3e982b5678",
        "createdAt": "2023-09-18T10:30:24.456Z",
        "updatedAt": "2023-09-18T10:30:24.456Z",
        "isAvailable": true,
        "codigo": "C654321-CTRLL67890"
      }
    },
    {
      "rfidTag": "35e017030b00000000114e0f",
      "error": "Producto no encontrado para el tag RFID: 35e017030b00000000114e0f"
    }
  ]
  ```
- **Códigos de Estado**:
  - `200 OK`: Consulta procesada correctamente (puede incluir productos encontrados y no encontrados)

## Características Adicionales

### Notificaciones por Email

El sistema envía automáticamente correos electrónicos en diversas situaciones:

#### Aprobación de Solicitud de Lentes

Cuando un administrador aprueba una solicitud de lentes, el sistema envía un correo al usuario con:

- **Diseño**: Utiliza los colores corporativos de CentroMundoX
  - Naranja primario: `#FF8200` (Pantone 151 C)
  - Azul oscuro: `#003087` (Pantone 287 C)
- **Contenido**:
  - Cabecera con el logo de CentroMundoX
  - Mensaje personalizado con el nombre del usuario
  - Código QR que contiene el código de acceso (sin mostrar el código en texto)
  - Fecha de validez del código
  - Pie de página con información de contacto
- **Remitente**: `f.escalona@symtechven.com`

Este correo permite al usuario acceder rápidamente a los equipos MetaQuest escaneando el código QR. 