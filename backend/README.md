# Guía rápida para correr el proyecto local

Este proyecto usa **Node.js**, **Express**, **Prisma** y **PostgreSQL**.  
Todo está listo para levantarse localmente sin enredos.

---

## 🚀 1. Instalar dependencias
```bash
pnpm install
```

---

## 🗄️ 2. Configurar variables de entorno
Crea un archivo **.env** en la raíz con tu conexión local a PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/tu_db?schema=public"
```

Asegurate de que la base de datos exista antes de continuar.

---

## 🧩 3. Generar Prisma Client
Prisma necesita generar su cliente antes de usarlo:

```bash
pnpm prisma generate
```

---

## 🟦 4. Levantar la API
Corre el proyecto en modo desarrollo:

```bash
pnpm dev
```

La API quedará disponible en:

```
http://localhost:3000
```

---

## 🐳 (Opcional) Levantar PostgreSQL con Docker

Si no tenés Postgres instalado localmente:

```bash
docker compose up -d
```

Esto crea un contenedor con PostgreSQL listo para conectar usando la misma `DATABASE_URL`.

---

## ✔️ ¡Listo!
Con esto ya podés usar la API sin más pasos adicionales.
