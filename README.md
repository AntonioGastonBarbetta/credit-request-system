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

Notes
- Backend logs the exact port at startup.
- The codebase is organized for country-specific rules, bank providers, Redis/BullMQ and Socket.IO to be added later without major refactors.
