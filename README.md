# 🚀 API Task Manager

API Task Manager (Nest.js + Postgres) con arquitectura hexagonal, TypeORM y Docker.

🛠️ **Stack:** NestJS · Postgres · TypeORM · Docker · SOLID · Hexagonal Architecture

## ⚡ Instalación rápida

```bash
npm install
```

## 🐳 Ejecutar con Docker

```bash
docker compose up --build
```

Swagger disponible en: [http://localhost:3000/api](http://localhost:3000/api) 🧭

## ▶️ Ejecutar el proyecto manualmente

```bash
# Modo desarrollo
npm run start

# Modo watch
npm run start:dev

# Modo producción
npm run start:prod
```

## 🧪 Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Cobertura
npm run test:cov
```

## 🧩 Arquitectura Hexagonal

- 🏛️ **Dominio (`domain/`):**
  - Entidades y contratos de repositorio.

- ⚙️ **Aplicación (`application/`):**
  - Servicios/casos de uso que orquestan la lógica de negocio.

- 🗄️ **Infraestructura (`infrastructure/`):**
  - Adaptadores concretos (TypeORM), controladores HTTP, DTOs, módulos.

🔑 **Principios SOLID:** separación de responsabilidades, inversión de dependencias mediante tokens

## 📚 Endpoints principales

- ➕ `POST /users` — Crear usuario
- 🔎 `GET /users/:id` — Obtener usuario por ID
- ➕ `POST /tasks` — Crear tarea
- 📋 `GET /tasks/user/:userId?status=&page=&limit=` — Listar tareas de usuario
- ✏️ `PATCH /tasks/:id` — Actualizar estado de tarea
- 🗑️ `DELETE /tasks/:id` — Eliminar tarea (soft delete)

🔗 **Contratos y ejemplos en Swagger**

---

## 📖 Recursos útiles

- [NestJS Docs](https://docs.nestjs.com)
- [Swagger](http://localhost:3000/api)

## 📝 Autor

David Morales
