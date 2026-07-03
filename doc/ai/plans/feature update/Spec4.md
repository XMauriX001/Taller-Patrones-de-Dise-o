# Spec 4 - Update Post

## Contexto
Los editores necesitan modificar posts existentes en el CMS.

## Alcance
- Actualizar un post mediante `PUT /posts/{id}` o `PATCH /posts/{id}`.
- Permitir modificar `title`, `content`, `excerpt`, `slug` y `status`.
- Aplicar las reglas de ciclo de vida definidas en Foundation.

## Criterios de aceptación
- Si el post existe y los datos son válidos, responde **200 OK** con el post actualizado.
- Si el post no existe, responde **404 Not Found**.
- Si los datos enviados no cumplen validaciones, responde **422 Unprocessable Entity**.
- Si el post está en `trash`, no puede actualizarse directamente.
- Si el post pasa por primera vez a `publish`, se establece `published_at`.
- Si el post sale de `trash`, se limpia `deleted_at`.

## Restricciones
- Debe usar los códigos HTTP definidos en el Spec 0 - Foundation.
- Debe responder en formato JSON.
- No se puede actualizar un post en `trash` sin restaurarlo.
- Solo se aceptan estados definidos en Foundation.