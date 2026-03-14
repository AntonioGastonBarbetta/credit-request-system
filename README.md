# Credit Request System (Monorepo)

This repository is a starter monorepo for a multi-country credit request system.

Structure
- apps/backend — Node.js + TypeScript + Express backend skeleton
- apps/frontend — React + TypeScript frontend skeleton (Vite)
- packages/shared — Shared TypeScript types and enums

Quick start

1. Install dependencies for all packages:

```bash
npm run install:all
```

2. Run the backend (in a terminal):

```bash
npm run dev:backend
```

3. Run the frontend (in another terminal):

```bash
npm run dev:frontend
```

## Environment configuration

This project uses environment variables for database and queue configuration. To set up your local environment:

1. Copy the example file for the backend:

```bash
cp apps/backend/.env.example apps/backend/.env
```

2. Edit `apps/backend/.env` and fill in real values (database password, Redis URL, secrets).

3. Run the backend (example):

```bash
npm --prefix ./apps/backend run build
npm --prefix ./apps/backend run migrate
npm --prefix ./apps/backend run start
```

Security note: Do NOT commit your `apps/backend/.env` file. The repository contains `apps/backend/.env.example` as a template only.

Notes
- Backend logs the exact port at startup.
- The codebase is organized for country-specific rules, bank providers, Redis/BullMQ and Socket.IO to be added later without major refactors.
