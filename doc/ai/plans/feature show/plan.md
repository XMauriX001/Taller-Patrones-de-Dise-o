# Implementation Plan 2 - Show Post

## Objetivo
Implementar el endpoint para obtener un post específico.

## Pasos
1. Crear la ruta `GET /posts/:id`.
2. Crear el controlador encargado de buscar un post por `id`.
3. Validar que el `id` tenga formato válido.
4. Consultar el post en PostgreSQL.
5. Si el post existe, devolver `200 OK` con la información del post.
6. Si el post no existe, devolver `404 Not Found`.
7. Manejar errores usando el formato definido en Foundation.