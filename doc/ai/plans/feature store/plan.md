# Plan de Implementación y Verificación - Store Post

Este plan establece los pasos necesarios para implementar y verificar el endpoint de creación de nuevos posts (`POST /posts`).

## Pasos de Implementación y Verificación

### 1. Validación de Campos Obligatorios
- **Paso**: Validar que el cuerpo de la petición contenga los campos `title` y `content` y que estos no sean cadenas vacías o solo espacios en blanco.
- **Verificación**:
  - Enviar una petición `POST /posts` con un cuerpo vacío o con `{ "content": "only content" }`.
  - Comprobar que responde con un código de estado HTTP `422 Unprocessable Entity`.
  - Enviar una petición con `{ "title": "only title" }` y verificar que también responde `422 Unprocessable Entity`.

### 2. Validación de Estado y Valor por Defecto
- **Paso**:
  - Validar que el valor del campo `status` (si se provee) sea uno de los estados válidos.
  - Asignar el estado `draft` por defecto si el campo `status` es omitido.
- **Verificación**:
  - Enviar una petición `POST /posts` con `{ "title": "T", "content": "C", "status": "invalid_status" }` y comprobar que responde `422 Unprocessable Entity`.
  - Enviar una petición con `{ "title": "T", "content": "C" }` (sin `status`) y comprobar que el post se crea exitosamente (código `201 Created`) y que en la respuesta el campo `status` es `"draft"` y `published_at` es `null`.

### 3. Generación y Unicidad del Slug
- **Paso**:
  - Crear un ayudante de slugify (`src/utils/slugify.ts`) que limpie y convierta el título a formato URL-safe si no se provee `slug`.
  - Garantizar la unicidad del `slug` consultando colisiones en la base de datos y agregando sufijos autoincrementales (ej. `post-1`, `post-2`) si es necesario.
- **Verificación**:
  - **Generación**: Enviar `POST /posts` con `{ "title": "Hola Mundo!" }`. Comprobar que responde `201 Created` con `slug: "hola-mundo"`.
  - **Colisión**: Enviar otra petición `POST /posts` con el mismo título `{ "title": "Hola Mundo!" }`. Comprobar que la respuesta contiene `slug: "hola-mundo-1"` y no produce un error de base de datos.

### 4. Establecimiento de Fecha de Publicación
- **Paso**: Si un post se crea directamente con estado `publish`, se debe establecer la fecha actual en el campo `published_at`.
- **Verificación**:
  - Enviar una petición `POST /posts` con `{ "title": "P", "content": "C", "status": "publish" }`.
  - Comprobar que responde `201 Created` y que en el cuerpo de la respuesta el atributo `published_at` contiene la fecha/hora actual (no nula).
