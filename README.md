# Express TypeScript Starter (Drizzle + Docker)

A production-ready **Express + TypeScript starter** with clean folder structure, Drizzle ORM, PostgreSQL, Docker, rate limiting, and environment validation.

If you searched for **"express ts starter"**, this repository is exactly that.

## Features

- Express 5 + TypeScript 6
- Drizzle ORM + PostgreSQL (`postgres` driver)
- Global rate limiting (`express-rate-limit`)
- Security middleware (`helmet`, `cors`)
- Request logging (`morgan`)
- Environment validation (`zod` + `dotenv`)
- Docker multi-stage build
- Docker Compose for API + Postgres
- Clean modular structure for routes/services/models

## Folder Structure

```text
src/
  app.ts
  server.ts
  routes.ts
  config/
    env.ts
    index.ts
  db/
    client.ts
    schema.ts
  middlewares/
    auth.middleware.ts
    error.middleware.ts
    rate-limit.middleware.ts
  modules/
    health/
      health.controller.ts
      health.routes.ts
    user/
      user.controller.ts
      user.model.ts
      user.routes.ts
      user.service.ts
      user.types.ts
  types/
    index.ts
  utils/
    logger.ts
```

## Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Example `.env`:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/educrud
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_TOKEN=dev-secret-token
```

### 3. Run in development

```bash
pnpm dev
```

Server runs at `http://localhost:4000`.

## API Endpoints

- `GET /api/health`
- `GET /api/users`

## Drizzle Commands

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:push
pnpm db:studio
```

## Docker

### Development with Compose

```bash
docker compose up --build
```

### Production image

```bash
docker build -t express-ts-drizzle-starter .
docker run -p 4000:4000 --env-file .env express-ts-drizzle-starter
```

## Scripts

- `pnpm dev` - Run development server with watch mode
- `pnpm build` - Compile TypeScript
- `pnpm start` - Run compiled app

## Why This Starter

This template is designed to be easy to clone, easy to understand, and ready for real-world backend projects.

## License

ISC
