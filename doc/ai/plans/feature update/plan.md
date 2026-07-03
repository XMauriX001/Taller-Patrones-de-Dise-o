# Plan de Implementación y Verificación - Update Post

Este plan establece los pasos necesarios para implementar y verificar el endpoint de modificación de posts existentes (`PUT /posts/{id}` o `PATCH /posts/{id}`).

## Pasos de Implementación y Verificación

### 1. Validación de Formato de ID y Existencia
- **Paso**: Validar formato UUID para el parámetro `id` (400) y verificar la presencia del post (404).
- **Verificación**:
  - Enviar petición a `PUT /posts/invalid-id` y recibir `400 Bad Request`.
  - Enviar petición a `PUT /posts/a0000000-b000-c000-d000-e00000000000` y recibir `404 Not Found`.

### 2. Validación de Contenido de Edición
- **Paso**: Si se envían `title`, `content` o `status`, aplicar las mismas reglas de validación que en el almacenamiento (no vacíos, status dentro de la lista permitida).
- **Verificación**:
  - Intentar actualizar un post enviando `{ "title": "  " }` o `{ "status": "invalid" }`.
  - Comprobar que responde con `422 Unprocessable Entity`.

### 3. Restricciones del Estado de Papelera (Trash)
- **Paso**:
  - Si un post tiene actualmente el estado `trash` en la base de datos, impedir modificaciones en sus atributos (como `title` o `content`) a menos que se restaure cambiando su `status` a otro valor.
  - Al restaurar un post desde `trash`, se debe limpiar el campo `deleted_at` (establecer a `null`).
- **Verificación**:
  - **Bloqueo**: Modificar un post directamente en base de datos para que tenga estado `trash`. Enviar una petición `PUT /posts/{id}` con `{ "title": "New Title" }` (sin cambiar el estado). Comprobar que responde `422 Unprocessable Entity`.
  - **Restauración**: Enviar una petición con `{ "status": "draft", "title": "New Title" }`. Comprobar que la petición es exitosa (código `200 OK`) y en la base de datos el post tiene estado `draft`, el nuevo título, y `deleted_at: null`.

### 4. Fecha de Publicación Inicial
- **Paso**: Si el post pasa por primera vez al estado `publish` (su valor actual de `published_at` es `null`), se debe rellenar dicho campo con la fecha actual. Si ya estaba publicado, se debe mantener el valor inicial.
- **Verificación**:
  - Crear un post en estado `draft` (con `published_at: null`).
  - Actualizar su estado a `publish`: `PUT /posts/{id}` con `{ "status": "publish" }`. Verificar que la respuesta contiene `published_at` con la fecha actual.
  - Volver a realizar una actualización del post en estado `publish` (ej. cambiar título). Verificar que el valor del campo `published_at` se mantiene idéntico al primero y no se sobrescribe.

### 5. Actualización de Slug y Unicidad
- **Paso**: Si se provee un nuevo `slug`, verificar su unicidad frente a otros posts en la base de datos y resolver colisiones añadiendo un sufijo autoincremental si fuera necesario.
- **Verificación**:
  - Crear Post A con `slug: "post-a"` y Post B con `slug: "post-b"`.
  - Actualizar Post B enviando `{ "slug": "post-a" }`.
  - Verificar que el Post B se actualiza a `200 OK` y su nuevo slug asignado es `"post-a-1"`.
