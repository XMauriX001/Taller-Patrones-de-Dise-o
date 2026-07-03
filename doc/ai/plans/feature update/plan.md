# Implementation Plan 4 - Update Post

## Objetivo
Implementar el endpoint para actualizar un post existente.

## Pasos
1. Crear la ruta `PUT /posts/:id` o `PATCH /posts/:id`.
2. Crear el controlador encargado de actualizar posts.
3. Validar que el `id` tenga formato válido.
4. Buscar el post en PostgreSQL.
5. Si el post no existe, devolver `404 Not Found`.
6. Si el post está en `trash`, impedir la actualización directa.
7. Leer los campos enviados en el body.
8. Validar que `status`, si se envía, sea válido.
9. Validar que un post solo pueda pasar a `publish` si tiene `title` y `content`.
10. Si pasa por primera vez a `publish`, establecer `published_at`.
11. Si sale de `trash`, limpiar `deleted_at`.
12. Actualizar `updated_at`.
13. Guardar los cambios en PostgreSQL.
14. Devolver `200 OK` con el post actualizado.
15. Manejar errores usando el formato definido en Foundation.