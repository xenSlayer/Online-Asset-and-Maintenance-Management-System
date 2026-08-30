# Online Asset and Maintenance Management System

Asset and maintenance management platform with role-based access (Admin, Staff, Technician).

## Deploy to Vercel

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for full steps.

**Using Prisma Postgres from the Vercel Marketplace?** You're mostly set — Vercel injects `DATABASE_URL` automatically. You still need to:

1. Set **Root Directory** to `frontend` in Vercel project settings
2. Enable **Include source files outside of the Root Directory in the Build Step**
3. Connect the database to your Vercel project (Storage tab)
4. Set `JWT_SECRET` in environment variables
5. Redeploy (migrations run automatically on build)

## Local development

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```
