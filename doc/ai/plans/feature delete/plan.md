# Plan de Implementación y Verificación - Delete Post

Este plan establece los pasos necesarios para implementar y verificar el endpoint de eliminación de posts (`DELETE /posts/{id}`).

## Pasos de Implementación y Verificación

### 1. Validación de Formato de ID y Existencia
- **Paso**: Validar que el parámetro `id` sea un UUID válido (400) y que el post exista en base de datos (404).
- **Verificación**:
  - Enviar una petición a `DELETE /posts/invalid-id` y verificar que responde `400 Bad Request`.
  - Enviar una petición a `DELETE /posts/a0000000-b000-c000-d000-e00000000000` y verificar que responde `404 Not Found`.

### 2. Borrado Lógico (Soft Delete)
- **Paso**:
  - Al recibir una solicitud válida de eliminación, el post no debe ser borrado físicamente del almacenamiento.
  - El post debe actualizar su `status` a `"trash"`.
  - Se debe registrar el timestamp actual en el campo `deleted_at`.
  - Retornar un código HTTP `204 No Content` sin cuerpo de respuesta.
- **Verificación**:
  - Crear un post de prueba.
  - Enviar una petición `DELETE /posts/{id}` para ese post.
  - Comprobar que responde con el código de estado HTTP `204 No Content` (sin contenido en la respuesta).
  - Consultar el post directamente en la base de datos (o mediante `GET /posts/{id}`) y verificar que el registro aún existe, su estado ahora es `"trash"` y el campo `deleted_at` contiene una fecha/hora válida.
