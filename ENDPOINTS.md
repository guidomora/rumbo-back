# Documentación de Endpoints

Esta guía describe los endpoints disponibles en el servidor Express. Todas las rutas están prefijadas por defecto con la URL base del servidor.

- **URL base**: `http://localhost:3000`

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
