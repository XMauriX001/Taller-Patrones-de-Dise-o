# Spec 0 - Foundation

## Contexto

Se requiere establecer el contrato base para una API REST que gestione publicaciones (posts) de un CMS.

Este spec define el recurso principal, las reglas generales, el formato de errores y el setup técnico base que usarán las demás funcionalidades: Index, Show, Store, Update y Delete.

## Alcance

Este spec incluye:

- Definición del recurso `Post`.
- Estados válidos del post.
- Reglas generales del ciclo de vida.
- Formato estándar de errores.
- Setup base del framework.
- Convenciones generales de la API.

## Criterios de aceptación

### Recurso Post

Todo post debe manejar los siguientes campos:

- `id`
- `title`
- `content`
- `excerpt`
- `slug`
- `status`
- `author_id`
- `created_at`
- `updated_at`
- `published_at`
- `deleted_at`

### Estados válidos

Solo se aceptan los siguientes estados:

- `draft`
- `pending`
- `publish`
- `private`
- `trash`

## Formato de errores y respuestas HTTP

Todos los endpoints deberán utilizar los siguientes códigos de estado HTTP de forma consistente:

| Código | Uso |
|--------|-----|
| 200 OK | La solicitud fue procesada correctamente. |
| 201 Created | Se creó un nuevo recurso correctamente. |
| 204 No Content | La operación fue exitosa y no devuelve contenido. |
| 400 Bad Request | La solicitud tiene un formato inválido. |
| 404 Not Found | El recurso solicitado no existe. |
| 422 Unprocessable Entity | Los datos enviados no cumplen las reglas de validación. |
| 500 Internal Server Error | Ocurrió un error inesperado en el servidor. |

### Setup del framework

- Express + TypeScript
- Prisma + PostgreSQL
- Estructura: src/routes, src/entities, src/controllers
- Variables de entorno con .env (conexión DB, puerto)
- Criterio de aceptación: un test de "health check" (GET /health → 200) pasando en verde.
- Fuera de alcance de este spec: autenticación real, subida de imágenes, cualquier lógica de status transitions.
