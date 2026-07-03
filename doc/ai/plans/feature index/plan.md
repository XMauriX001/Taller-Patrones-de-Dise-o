# Plan de Implementación y Verificación - Index Posts

Este plan establece los pasos necesarios para implementar y verificar el endpoint de listado y consulta de posts (`GET /posts`).

## Pasos de Implementación y Verificación

### 1. Cliente Prisma Compartido
- **Paso**: Crear una instancia única de `PrismaClient` en `src/prisma.ts` para ser reutilizada en toda la aplicación.
- **Verificación**: Asegurar que los controladores importan este cliente compartido en lugar de instanciar un nuevo `new PrismaClient()`.

### 2. Validación de Parámetro Status
- **Paso**: Validar que el parámetro `status` recibido en la query corresponde a un valor del enum `PostStatus` (`draft`, `pending`, `publish`, `private`, `trash`).
- **Verificación**:
  - Realizar una petición a `GET /posts?status=invalid_status`.
  - Comprobar que responde con un código de estado HTTP `422 Unprocessable Entity` y un mensaje JSON descriptivo de error.

### 3. Paginación de Resultados
- **Paso**: Implementar paginación utilizando los parámetros `page` (por defecto `1`) y `per_page` (por defecto `10`).
- **Verificación**:
  - Insertar al menos 3 posts de prueba.
  - Realizar una petición a `GET /posts?page=1&per_page=2`.
  - Verificar que responde con un código de estado HTTP `200 OK` y devuelve un JSON que contiene:
    1. Un arreglo `data` con exactamente 2 posts.
    2. Un objeto `meta` con los atributos `total: 3`, `page: 1`, `per_page: 2`, `total_pages: 2`.

### 4. Filtrado por Estado
- **Paso**: Implementar filtrado de registros en la consulta a la base de datos si el parámetro `status` está presente en la query.
- **Verificación**:
  - Realizar una petición a `GET /posts?status=draft`.
  - Comprobar que en el arreglo `data` devuelto, todos los posts tienen el atributo `status` igual a `"draft"`.

### 5. Base de Datos Vacía
- **Paso**: Controlar la respuesta cuando no existen posts registrados.
- **Verificación**:
  - Limpiar la tabla `posts` en la base de datos.
  - Realizar una petición a `GET /posts`.
  - Verificar que responde con un código de estado HTTP `200 OK` y devuelve un JSON con `data: []` y `meta` que indica `total: 0`, `total_pages: 0`.
