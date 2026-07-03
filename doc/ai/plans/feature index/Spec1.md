# Spec 1 - Index Posts

## Contexto
Los usuarios necesitan consultar el listado de posts disponibles en el CMS.

## Alcance
- Listar posts mediante `GET /posts`.
- Permitir paginación con `page` y `per_page`.
- Permitir filtrar por `status`.

## Criterios de aceptación
- Si la solicitud es válida, responde **200 OK** con la lista de posts.
- La respuesta debe incluir la información de paginación.
- Si no existen posts, responde **200 OK** con una lista vacía.
- Si se envía un `status` inválido, responde **422 Unprocessable Entity**.

## Restricciones
- Debe usar los códigos HTTP definidos en el Spec 0 - Foundation.
- Debe responder en formato JSON.
- Solo se pueden filtrar estados válidos definidos en Foundation.