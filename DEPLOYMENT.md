# Deploying to Vercel

This project deploys **frontend and backend together** on Vercel:

- **Frontend** — static React build (`frontend/dist`)
- **Backend** — Express API as a serverless function (`api/index.ts`)
- **Database** — Prisma Postgres via the Vercel Marketplace (recommended)

Local dev is unchanged: run the backend on port 3000 and the Vite dev server with its `/api` proxy.

---

## Prisma Postgres on Vercel (Marketplace)

If you already added **Prisma Postgres** from the Vercel Storage/Marketplace tab, most database setup is done for you.

### What Vercel sets automatically

| Variable | Set by integration |
|----------|-------------------|
| `DATABASE_URL` | Yes — pooled Prisma Postgres connection string |

Your app already reads `DATABASE_URL` via Prisma — no code changes needed for the connection.

### What you still need to set manually

In **Vercel → Project → Settings → Environment Variables**, add:

| Variable | Required | Example |
|----------|----------|---------|
| `JWT_SECRET` | Yes | Long random string (not the dev default) |
| `FRONTEND_URL` | Recommended | `https://your-app.vercel.app` |

Apply to **Production**, **Preview**, and **Development** as needed.

### Deploy steps

1. **Connect the database** to your Vercel project  
   Storage tab → your Prisma Postgres database → **Connect**

2. **Confirm root directory** is the **repo root** (not `frontend/`)

3. **Add `JWT_SECRET`** (and optionally `FRONTEND_URL`)

4. **Redeploy** — the build runs `prisma migrate deploy` automatically and creates tables

5. **Seed the database once** (first deploy only):

   ```bash
   # Pull Vercel env vars locally
   vercel env pull .env.vercel

   # Run seed against production DB
   cd backend
   export $(grep -v '^#' ../.env.vercel | xargs)
   npm run db:seed
   ```

   Or copy `DATABASE_URL` from the Vercel dashboard into a local `backend/.env` and run:

   ```bash
   cd backend && npm run db:seed
   ```

6. **Verify**
   - App: `https://your-app.vercel.app`
   - API: `https://your-app.vercel.app/api/stats`
   - Login: `admin@oamanagement.com` / `123` (if seeded)

### View / edit data

- **Vercel dashboard** — Storage → your database (built-in data browser for Prisma Postgres)
- **Prisma Studio** locally:

  ```bash
  vercel env pull .env.vercel
  cd backend
  export $(grep -v '^#' ../.env.vercel | xargs)
  npx prisma studio
  ```

### If migrations fail during build

Prisma Postgres provides a **pooled** `DATABASE_URL`. If `prisma migrate deploy` fails in the build log:

1. Open [Prisma Console](https://console.prisma.io/) → your database → **Connect**
2. Copy the **direct** connection string (host `db.prisma.io`, not `pooled.db.prisma.io`)
3. Add it in Vercel as `DIRECT_URL`
4. Update `backend/prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```

5. Redeploy

---

## Other PostgreSQL providers (Neon, Supabase, etc.)

If not using Vercel Prisma Postgres:

1. Create a hosted Postgres database
2. Set `DATABASE_URL` in Vercel env vars
3. Run migrations:

   ```bash
   cd backend
   DATABASE_URL="your-url" npx prisma migrate deploy
   DATABASE_URL="your-url" npx prisma db seed
   ```

Use a **pooled** connection string for serverless if your provider offers one.

---

## Vercel project settings

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Include source files outside Root Directory** | **Enabled** (Settings → General) |
| **Build / Output** | From `frontend/vercel.json` (auto) |
| **Output Directory** | `dist` |

The API lives at `frontend/api/index.ts` and imports the Express app from `../backend`. Vercel must be allowed to access files outside the `frontend` folder during the build.

---

## Environment variables summary

| Variable | Source |
|----------|--------|
| `DATABASE_URL` | Prisma Postgres integration (automatic) |
| `JWT_SECRET` | You set manually |
| `FRONTEND_URL` | You set manually (production URL) |
| `VERCEL_URL` | Vercel (automatic, used for CORS on previews) |
| `DIRECT_URL` | Optional — Prisma Console, only if migrations need it |

---

## Local development

```bash
# Terminal 1 — backend (uses local backend/.env)
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

To use the **remote** Prisma Postgres DB locally:

```bash
vercel env pull .env.vercel
# Copy DATABASE_URL into backend/.env, or symlink
```

The Vite proxy in `frontend/vite.config.ts` forwards `/api` to `http://localhost:3000`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| API 500 errors | Check Vercel **Functions** logs; confirm migrations ran and DB is seeded |
| Empty login / no users | Run `npm run db:seed` once against production `DATABASE_URL` |
| Build fails on migrate | Add `DIRECT_URL` (see above) |
| CORS errors | Set `FRONTEND_URL` to your production domain |
| Cold starts | First request after idle may be slow on free tier — normal for serverless |
