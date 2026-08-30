# Online Asset and Maintenance Management System

Asset and maintenance management platform with role-based access (Admin, Staff, Technician).

## Deploy to Vercel

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for full steps.

**Using Prisma Postgres from the Vercel Marketplace?** You're mostly set — Vercel injects `DATABASE_URL` automatically. You still need to:

1. Connect the database to your Vercel project (Storage tab)
2. Set `JWT_SECRET` in environment variables
3. Redeploy (migrations run automatically on build)
4. Run `npm run db:seed` once against the production database

## Local development

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```
