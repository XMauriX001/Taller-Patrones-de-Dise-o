# CMS Post REST API - Foundation Setup

Este es el proyecto base para la API REST del CMS, diseñado utilizando **Express**, **TypeScript**, **Prisma** y **PostgreSQL**.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu máquina:

- **Node.js** (versión 20 o superior recomendada)
- **npm** (gestor de paquetes de Node)
- **PostgreSQL** (servicio de base de datos ejecutándose localmente o en un contenedor)

---

## Pasos para la Inicialización y Configuración

Sigue estos pasos para configurar y ejecutar el proyecto en cualquier máquina local:

### 1. Clonar/Descargar el Proyecto
Asegúrate de que estás en la raíz del directorio del proyecto.

### 2. Instalar Dependencias
Instala los paquetes necesarios definidos en el `package.json`:
```bash
npm install
```

### 3. Configurar las Variables de Entorno
Copia el archivo de plantilla `.env.example` para crear tu archivo `.env` local:
```bash
cp .env.example .env
```
Abre el archivo `.env` recién creado y actualiza los valores según la configuración de tu entorno:
- `PORT`: El puerto en el cual correrá el servidor Express (por defecto `3000`).
- `DATABASE_URL`: La URL de conexión a tu base de datos PostgreSQL local. Ejemplo:
  ```env
  DATABASE_URL="postgresql://USUARIO:CONTRASENA@localhost:5432/NOMBRE_BD?schema=public"
  ```

### 4. Inicializar Prisma y la Base de Datos
Para generar el cliente de Prisma y aplicar las migraciones correspondientes en la base de datos local:

1. **Generar el cliente de Prisma:**
   ```bash
   npx prisma generate
   ```
2. **Aplicar las migraciones a la base de datos:**
   ```bash
   npx prisma migrate dev
   ```

---

## Comandos Disponibles

En el directorio del proyecto puedes ejecutar los siguientes comandos:

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo con recarga en vivo (`tsx watch`). |
| `npm test` | Ejecuta el conjunto de pruebas usando Jest. |
| `npm run build` | Compila el código TypeScript a JavaScript en la carpeta `dist`. |
| `npm start` | Ejecuta el código transpilado de producción en la carpeta `dist`. |

---

## Estructura del Proyecto

El código está estructurado de la siguiente forma:

- `prisma/` - Contiene la definición del esquema de base de datos (`schema.prisma`) y las migraciones.
- `src/`
  - `entities/` - Modelos y definiciones de dominio (ej. [Post.ts](file:///c:/Users/Laptop1/OneDrive/Desktop/Taller%20Patrones%20de%20Dise%C3%B1o/src/entities/Post.ts)).
  - `controllers/` - Controladores encargados de la lógica de los endpoints (ej. [health.controller.ts](file:///c:/Users/Laptop1/OneDrive/Desktop/Taller%20Patrones%20de%20Dise%C3%B1o/src/controllers/health.controller.ts)).
  - `routes/` - Definiciones de rutas y ruteador principal (ej. [health.routes.ts](file:///c:/Users/Laptop1/OneDrive/Desktop/Taller%20Patrones%20de%20Dise%C3%B1o/src/routes/health.routes.ts), [index.ts](file:///c:/Users/Laptop1/OneDrive/Desktop/Taller%20Patrones%20de%20Dise%C3%B1o/src/routes/index.ts)).
  - `app.ts` - Configuración principal de Express y middlewares.
  - `server.ts` - Punto de entrada del servidor.
- `tests/` - Pruebas de integración y unitarias (ej. [health.test.ts](file:///c:/Users/Laptop1/OneDrive/Desktop/Taller%20Patrones%20de%20Dise%C3%B1o/tests/health.test.ts)).
