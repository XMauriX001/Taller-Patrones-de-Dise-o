# Implementation Plan 0 - Foundation

## Objetivo
Preparar la base técnica del proyecto para que todos los endpoints trabajen bajo las mismas reglas.

## Pasos
1. Crear el proyecto con Express y TypeScript.
2. Configurar `tsconfig.json`.
3. Instalar dependencias necesarias para Express, TypeScript y PostgreSQL.
4. Configurar variables de entorno para la conexión a PostgreSQL.
5. Crear la estructura base de carpetas.
6. Crear la conexión a la base de datos.
7. Crear la tabla o modelo `posts`.
8. Definir los estados válidos: `draft`, `pending`, `publish`, `private`, `trash`.
9. Crear middleware global para manejo de errores.
10. Definir los códigos HTTP estándar que usará la API.
11. Configurar respuestas JSON.
12. Preparar scripts para correr el proyecto en desarrollo.