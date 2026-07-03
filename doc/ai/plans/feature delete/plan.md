# Implementation Plan 5 - Delete Post

## Objetivo
Implementar el endpoint para eliminar un post sin borrarlo físicamente.

## Pasos
1. Crear la ruta `DELETE /posts/:id`.
2. Crear el controlador encargado de eliminar posts.
3. Validar que el `id` tenga formato válido.
4. Buscar el post en PostgreSQL.
5. Si el post no existe, devolver `404 Not Found`.
6. Cambiar el estado del post a `trash`.
7. Establecer `deleted_at` con la fecha actual.
8. Actualizar `updated_at`.
9. Guardar los cambios en PostgreSQL.
10. Devolver `204 No Content`.
11. Manejar errores usando el formato definido en Foundation.