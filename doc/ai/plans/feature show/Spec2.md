# Spec 2 - Show Post

## Contexto
Los usuarios necesitan consultar el detalle de un post específico.

## Alcance
- Obtener un post mediante `GET /posts/{id}`.
- Devolver toda la información del recurso `Post`.

## Criterios de aceptación
- Si el post existe, responde **200 OK** con la información del post.
- Si el post no existe, responde **404 Not Found**.
- Si el `id` tiene formato inválido, responde **400 Bad Request**.

## Restricciones
- Debe usar los códigos HTTP definidos en el Spec 0 - Foundation.
- Debe responder en formato JSON.
- No incluye autenticación ni permisos.