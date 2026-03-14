Backend
=======

This is the backend application (Express + TypeScript).

Run in development:

```bash
npm run dev
```

Configuration example available at `.env.example`.

Environment
-----------

Create a local environment file from the example and edit it with real values:

```bash
cp .env.example .env
```

Do not commit `.env` to git. The repository's `.gitignore` ignores environment files.

Database migrations
-------------------

Run migrations (requires `DATABASE_URL` in env):

```bash
npm --prefix ./apps/backend run migrate
```

