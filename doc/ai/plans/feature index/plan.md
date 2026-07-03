# Implementation Plan 1 - Index Posts

## Objetivo
Implementar el endpoint para listar posts.

## Pasos
1. Crear la ruta `GET /posts`.
2. Crear el controlador encargado de listar posts.
3. Leer los parámetros `page`, `per_page` y `status`.
4. Validar que `page` y `per_page` sean valores numéricos válidos.
5. Validar que `status`, si se envía, sea uno de los estados permitidos.
6. Consultar los posts en PostgreSQL aplicando paginación.
7. Aplicar filtro por `status` cuando corresponda.
8. Devolver respuesta `200 OK` con la lista de posts.
9. Incluir metadata de paginación en la respuesta.
10. Manejar errores usando el formato definido en Foundation.