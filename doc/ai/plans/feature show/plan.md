# Plan de Implementación y Verificación - Show Post

Este plan establece los pasos necesarios para implementar y verificar el endpoint de consulta del detalle de un post específico (`GET /posts/{id}`).

## Pasos de Implementación y Verificación

### 1. Validación de Formato de ID
- **Paso**: Validar que el parámetro `id` en la ruta tenga un formato UUID válido antes de consultar la base de datos.
- **Verificación**:
  - Realizar una petición a `GET /posts/123-no-es-uuid`.
  - Comprobar que responde con un código de estado HTTP `400 Bad Request` y un mensaje JSON descriptivo.

### 2. Control de Recursos No Encontrados
- **Paso**: Retornar error apropiado si el ID tiene formato válido de UUID pero no existe ningún registro con ese identificador.
- **Verificación**:
  - Realizar una petición utilizando un UUID inexistente, por ejemplo, `GET /posts/a0000000-b000-c000-d000-e00000000000`.
  - Comprobar que responde con un código de estado HTTP `404 Not Found` y un JSON descriptivo.

### 3. Obtención Exitosa del Post
- **Paso**: Consultar la base de datos por el ID único y retornar la información completa del post.
- **Verificación**:
  - Crear un post de prueba y registrar su `id` (UUID).
  - Realizar una petición a `GET /posts/{id}` con dicho identificador.
  - Comprobar que responde con un código de estado HTTP `200 OK` y devuelve un objeto JSON con los mismos datos del post creado (incluyendo `title`, `content`, `slug`, `status`, etc.).
