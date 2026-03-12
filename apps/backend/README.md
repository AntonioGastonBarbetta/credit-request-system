Backend
=======

This is the backend application (Express + TypeScript).

Run in development:

```bash
npm run dev
```

Configuration example available at `.env.example`.

Database migrations
-------------------

Run migrations (requires `DATABASE_URL` in env):

```bash
npm --prefix ./apps/backend run migrate
```

