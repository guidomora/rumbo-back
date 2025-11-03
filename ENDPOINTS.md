# Documentación de Endpoints

Esta guía describe los endpoints disponibles en el servidor Express. Todas las rutas están prefijadas por defecto con la URL base del servidor.

- **URL base**: `http://localhost:3000`

## 📝 Usuarios (`/api/users`)

### Crear un usuario
- **Método**: `POST`
- **Ruta**: `http://localhost:3000/api/users`
- **Tipo de cuerpo**: `application/json`
- **Cuerpo requerido**:

  | Campo              | Tipo      | Obligatorio | Descripción |
  |--------------------|-----------|-------------|-------------|
  | `name`             | `string`  | Sí          | Nombre del usuario. |
  | `email`            | `string`  | Sí          | Correo electrónico del usuario. |
  | `phone`            | `string`  | Sí          | Número de teléfono del usuario. |
  | `password`         | `string`  | Sí          | Contraseña del usuario. |
  | `dni`              | `string`  | Sí          | Número de documento del usuario. |

- **Respuesta exitosa** (`201 Created`):
  ```json
  {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "dni": "string",
      "password": "string",
      "calificacionPromedio": 0,
      "ratingsCount": 0,
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```
- **Errores comunes** (`400 Bad Request`): Campos faltantes o formatos inválidos en la solicitud.

### Iniciar sesión
- **Método**: `POST`
- **Ruta**: `http://localhost:3000/api/users/login`
- **Tipo de cuerpo**: `application/json`
- **Cuerpo requerido**:

  | Campo      | Tipo     | Obligatorio | Descripción |
  |------------|----------|-------------|-------------|
  | `email`    | `string` | Sí          | Correo electrónico registrado del usuario. |
  | `password` | `string` | Sí          | Contraseña del usuario. |

- **Respuesta exitosa** (`200 OK`):
  ```json
  {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "dni": "string",
      "calificacionPromedio": 4.5,
      "ratingsCount": 3,
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```
- **Errores comunes** (`401 Unauthorized`): Credenciales inválidas.

### Obtener un usuario por ID
- **Método**: `GET`
- **Ruta**: `http://localhost:3000/api/users/:id`
- **Parámetros de ruta**:

  | Parámetro | Tipo     | Obligatorio | Descripción |
  |-----------|----------|-------------|-------------|
  | `id`      | `string` | Sí          | Identificador único del usuario (UUID). |

- **Respuesta exitosa** (`200 OK`):
  ```json
  {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "dni": "string",
      "calificacionPromedio": 4.5,
      "ratingsCount": 3,
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```
- **Errores comunes**:
  - `400 Bad Request`: El parámetro `id` está ausente o es inválido.
  - `404 Not Found`: No existe un usuario con el identificador indicado.

### Calificar a un usuario
- **Método**: `POST`
- **Ruta**: `http://localhost:3000/api/users/:id/ratings`
- **Tipo de cuerpo**: `application/json`
- **Cuerpo requerido**:

  | Campo      | Tipo     | Obligatorio | Descripción |
  |------------|----------|-------------|-------------|
  | `score`    | `number` | Sí          | Puntaje entre 1 y 5 (se admite decimal). |
  | `comment`  | `string` | No          | Comentario opcional de la calificación. |
  | `authorId` | `string` | No          | Identificador del usuario que emite la calificación. |

- **Respuesta exitosa** (`201 Created`):
  ```json
  {
    "rating": {
      "id": "string",
      "score": 5,
      "comment": "Excelente experiencia",
      "createdAt": "datetime",
      "ratedUserId": "string",
      "authorId": "string"
    },
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "dni": "string",
      "calificacionPromedio": 4.8,
      "ratingsCount": 5,
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

- **Errores comunes**:
  - `400 Bad Request`: Falta el puntaje o el formato es incorrecto.
  - `404 Not Found`: El usuario calificado o el autor no existen.

## 🚗 Viajes (`/api/trips`)

### Crear un viaje
- **Método**: `POST`
- **Ruta**: `http://localhost:3000/api/trips`
- **Tipo de cuerpo**: `application/json`
- **Cuerpo requerido**:

  | Campo              | Tipo      | Obligatorio | Descripción |
  |--------------------|-----------|-------------|-------------|
  | `driverId`         | `string`  | Sí          | Identificador del conductor. |
  | `origin`           | `string`  | Sí          | Punto de partida del viaje. |
  | `destination`      | `string`  | Sí          | Destino del viaje. |
  | `date`             | `string`  | Sí          | Fecha en formato `YYYY-MM-DD`. |
  | `time`             | `string`  | Sí          | Hora en formato `HH:mm` o `HH:mm:ss`. |
  | `availableSeats`   | `number`  | Sí          | Cantidad de asientos disponibles. Debe ser mayor que 0. |
  | `pricePerPerson`   | `number`  | Sí          | Precio por persona. No puede ser negativo. |
  | `vehicle`          | `string`  | Sí          | Información del vehículo utilizado. |
  | `createdByUserId`  | `string`  | No          | Identificador del usuario que crea el viaje (si es diferente del conductor). |
  | `music`            | `boolean` | No          | Indica si se permite música durante el viaje. |
  | `pets`             | `boolean` | No          | Indica si se permiten mascotas. |
  | `children`         | `boolean` | No          | Indica si se permite viajar con niños. |
  | `luggage`          | `boolean` | No          | Indica si se permite equipaje. |
  | `notes`            | `string`  | No          | Notas adicionales sobre el viaje. |

- **Respuesta exitosa** (`201 Created`):
  ```json
  {
    "message": "Viaje creado correctamente.",
    "data": { /* Objeto del viaje creado */ }
  }
  ```
- **Errores comunes** (`400 Bad Request`): Campos faltantes o formatos inválidos en la solicitud.

### Listar viajes publicados
- **Método**: `GET`
- **Ruta**: `http://localhost:3000/api/trips`
- **Parámetros**: ninguno.
- **Respuesta exitosa** (`200 OK`):
  ```json
  {
    "message": "Viajes publicados obtenidos correctamente.",
    "data": [ /* Lista de viajes */ ]
  }
  ```

- **Errores comunes** (`500 Internal Server Error`): Problemas al recuperar la información desde la base de datos.

### Obtener el último viaje de un usuario
- **Método**: `GET`
- **Ruta**: `http://localhost:3000/api/trips/users/:userId/last`
- **Parámetros de ruta**:

  | Parámetro | Tipo     | Obligatorio | Descripción |
  |-----------|----------|-------------|-------------|
  | `userId`  | `string` | Sí          | Identificador del usuario (conductor o creador del viaje). |

- **Respuesta exitosa** (`200 OK`):
  ```json
  {
    "message": "Último viaje obtenido correctamente.",
    "data": {
      "id": "string",
      "driverId": "string",
      "createdByUserId": "string | null",
      "origin": "string",
      "destination": "string",
      "date": "YYYY-MM-DD",
      "time": "HH:mm:ss",
      "availableSeats": "number",
      "pricePerPerson": "string",
      "vehicle": "string",
      "music": "boolean",
      "pets": "boolean",
      "children": "boolean",
      "luggage": "boolean",
      "notes": "string | null",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

- **Errores comunes**:
  - `400 Bad Request`: Falta el parámetro `userId`.
  - `404 Not Found`: El usuario no tiene viajes registrados.
  - `500 Internal Server Error`: Error inesperado al recuperar la información.

### Seleccionar viaje por id

- **Método**: `GET`
- **Ruta**: `http://localhost:3000/api/trips/api/trips/:id`
- **Parámetros**: id | Tipo String UUID que se obtiene de la DB de un viaje ya existente
- **Respuesta exitosa** (`200 OK`):

```json
{
  "id": "2f3381ef-5b60-45fd-8795-caae4533acb0",
  "driverId": "a5b3e5f2-7a21-4cf7-91b9-9a3c9f245d31",
  "createdByUserId": "c9d2a1b5-1234-4af7-b67f-f8b9e31a6e2a",
  "origin": "Buenos Aires",
  "destination": "Mar del Plata",
  "date": "2025-11-15",
  "time": "08:30:00",
  "availableSeats": 1,
  "pricePerPerson": "12000.00",
  "vehicle": "Toyota Corolla 2020",
  "music": true,
  "pets": false,
  "children": true,
  "luggage": true,
  "notes": "Salida puntual, se permite un bolso pequeño por persona.",
  "createdAt": "2025-10-08T01:26:59.174Z",
  "updatedAt": "2025-10-08T01:41:01.636Z"
}
```

### Reservar viaje por id

- **Método**: `POST`
- **Ruta**: `http://localhost:3000/api/trips/api/trips/:id/select`
- **Parámetros**: id | Tipo String UUID que se obtiene de la DB de un viaje ya existente
- **Request Body**: 

```json
{
    "userId": "5f47ac10-b58d-4373-a567-0e02b2c3d479",
    "seats": 1
}
```

- **Respuesta exitosa** (`201 Created`):

```json
{
  "message": "Viaje reservado correctamente.",
  "data": {
    "id": "2f3381ef-5b60-45fd-8795-caae4533acb0",
    "driverId": "a5b3e5f2-7a21-4cf7-91b9-9a3c9f245d31",
    "createdByUserId": "c9d2a1b5-1234-4af7-b67f-f8b9e31a6e2a",
    "origin": "Buenos Aires",
    "destination": "Mar del Plata",
    "date": "2025-11-15",
    "time": "08:30:00",
    "availableSeats": 5,
    "pricePerPerson": "12000.00",
    "vehicle": "Toyota Corolla 2020",
    "music": true,
    "pets": false,
    "children": true,
    "luggage": true,
    "notes": "Salida puntual, se permite un bolso pequeño por persona.",
    "createdAt": "2025-10-08T01:26:59.174Z",
    "updatedAt": "2025-10-08T02:28:43.205Z"
  }
}
```

## 🏠 Salud del servidor (`/`)

### Verificar estado del servidor
- **Método**: `GET`
- **Ruta**: `http://localhost:3000/`
- **Parámetros**: ninguno.
- **Respuesta exitosa** (`200 OK`):
  ```text
  Servidor Express con TypeScript funcionando 🚀
  ```

> **Nota**: Todas las rutas aceptan y devuelven datos en formato JSON, salvo la ruta de estado que responde con texto plano.
