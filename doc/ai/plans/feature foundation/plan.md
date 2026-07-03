# Plan de Implementación y Verificación - Foundation

Este plan establece los pasos necesarios para implementar y verificar la base técnica del proyecto (Express, TypeScript, Prisma, PostgreSQL).

## Pasos de Implementación y Verificación

### 1. Inicialización y Dependencias
- **Paso**: Crear `package.json` con dependencias base e instalar módulos de Node.
- **Verificación**: Ejecutar `npm install` y comprobar que se crea el directorio `node_modules` y que el comando compila correctamente.

### 2. Configuración de TypeScript
- **Paso**: Crear `tsconfig.json` con soporte para módulos de Node y tipado estricto.
- **Verificación**: Ejecutar `npx tsc --noEmit` para asegurar que el compilador no produce errores en el entorno.

### 3. Variables de Entorno
- **Paso**: Crear `.env.example` y el archivo local `.env` configurando el puerto del servidor (`PORT`) y la conexión a la base de datos (`DATABASE_URL`).
- **Verificación**: Comprobar la presencia de estos archivos y verificar que `.env` está registrado en `.gitignore`.

### 4. Configuración de Prisma y Base de Datos
- **Paso**: Configurar `prisma/schema.prisma` con el datasource PostgreSQL, el generador Prisma Client, el enum `PostStatus` y el modelo `Post`.
- **Verificación**: 
  1. Ejecutar `npx prisma generate` para compilar el cliente.
  2. Ejecutar `npx prisma migrate dev --name init` para crear la base de datos y la tabla correspondiente.
  3. Comprobar que en PostgreSQL la tabla `posts` cuenta con los campos requeridos (`id`, `title`, `content`, `excerpt`, `slug`, `status`, `author_id`, `created_at`, `updated_at`, `published_at`, `deleted_at`).

### 5. Estructura de Rutas y Endpoint de Salud
- **Paso**: Crear la estructura de directorios `src/controllers`, `src/routes` y `src/entities`. Implementar el endpoint `GET /health`.
- **Verificación**:
  1. Iniciar el servidor con `npm run dev`.
  2. Ejecutar `curl -i http://localhost:3000/health` y comprobar que la respuesta es `200 OK` con el JSON `{ "status": "ok" }`.
  3. Ejecutar las pruebas automatizadas con `npm test` para asegurar que pasa el test de salud.
