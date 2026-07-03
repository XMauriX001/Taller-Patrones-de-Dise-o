# Spec 5 - Delete Post

## Contexto
Los editores necesitan eliminar posts sin perder la información permanentemente.

## Alcance
- Eliminar un post mediante `DELETE /posts/{id}`.
- Mover el post al estado `trash`.
- Establecer `deleted_at`.

## Criterios de aceptación
- Si el post existe, responde **204 No Content**.
- El post cambia su estado a `trash`.
- Se establece el campo `deleted_at`.
- El post no se elimina físicamente.
- Si el post no existe, responde **404 Not Found**.

## Restricciones
- Debe usar los códigos HTTP definidos en el Spec 0 - Foundation.
- Debe responder en formato JSON cuando exista error.
- No se permite eliminación física del post.