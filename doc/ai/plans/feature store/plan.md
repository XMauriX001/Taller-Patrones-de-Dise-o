# Implementation Plan 3 - Store Post

## Objetivo
Implementar el endpoint para crear un nuevo post.

## Pasos
1. Crear la ruta `POST /posts`.
2. Crear el controlador encargado de crear posts.
3. Leer del body los campos `title`, `content`, `excerpt`, `slug` y `status`.
4. Validar que `title` y `content` sean obligatorios.
5. Validar que `status`, si se envía, sea válido.
6. Si no se envía `status`, asignar `draft`.
7. Si no se envía `slug`, generarlo automáticamente a partir del `title`.
8. Si el post se crea como `publish`, establecer `published_at`.
9. Guardar el post en PostgreSQL.
10. Devolver `201 Created` con el post creado.
11. Manejar errores de validación con `422 Unprocessable Entity`.