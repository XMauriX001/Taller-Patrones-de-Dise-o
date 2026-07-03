# Spec 3 - Store Post

## Contexto
Los editores necesitan crear nuevos posts desde la API.

## Alcance
- Crear un post mediante `POST /posts`.
- Permitir enviar `title`, `content`, `excerpt`, `slug` y `status`.
- Generar `slug` automáticamente si no se envía.
- Asignar `draft` como estado por defecto si no se envía `status`.

## Criterios de aceptación
- Si se envían `title` y `content` válidos, responde **201 Created** con el post creado.
- Si falta `title` o `content`, responde **422 Unprocessable Entity**.
- Si no se envía `status`, el post se crea con estado `draft`.
- Si no se envía `slug`, el sistema genera uno automáticamente.
- Si se intenta crear directamente como `publish`, solo se permite si `title` y `content` no están vacíos.

## Restricciones
- Debe usar los códigos HTTP definidos en el Spec 0 - Foundation.
- Debe responder en formato JSON.
- Solo se aceptan estados definidos en Foundation.
- No incluye subida de imágenes.
- No incluye autenticación del autor.