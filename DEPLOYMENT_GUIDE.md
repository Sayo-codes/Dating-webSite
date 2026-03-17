# Velvet Signal Production Deployment Guide

Your application is now ready for production. I have pushed the latest updates to your GitHub repository, which will automatically trigger a build on Vercel.

## 1. Vercel Environment Variables
Go to your **Vercel Dashboard > Project Settings > Environment Variables** and add the following keys. Without these, the build might fail or auth won't work.

| Key | Value (Example) | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...` | Pooled connection from Neon |
| `DIRECT_URL` | `postgresql://...` | Direct connection from Neon (for migrations) |
| `JWT_SECRET` | `a_long_random_string_here` | Use a secure secret for user auth |
| `NEXT_PUBLIC_APP_ORIGIN` | `https://your-site.vercel.app` | Your primary Vercel production domain |
| `NEXT_PUBLIC_SOCKET_URL` | `https://your-socket-server.render.com` | URL of the socket server (see below) |
| `SOCKET_SERVER_SECRET` | `another_random_string` | Must match between Vercel and Socket Server |

---

## 2. Deploying the Socket Server (Render/Railway)
Vercel is "Serverless" and cannot run the Socket.io server. You need to host `server/socket-server.ts` on a platform that supports persistent Node.js processes.

### Recommended: [Render.com](https://render.com/)
1. **New Web Service**: Connect your GitHub repo.
2. **Runtime**: Node.
3. **Build Command**: `npm install`
4. **Start Command**: `npx tsx server/socket-server.ts`
5. **Environment Variables on Render**:
   - `PORT`: (Set automatically by Render)
   - `JWT_SECRET`: (Match Vercel)
   - `SOCKET_SERVER_SECRET`: (Match Vercel)
   - `NEXT_PUBLIC_APP_ORIGIN`: `https://your-site.vercel.app` (Your Vercel domain)

---

## 3. Database Migrations
Prisma is set to run during build. Ensure your Neon database allows the connection. If you need to manually apply migrations to production, run:
```bash
npx prisma migrate deploy
```

---

## ✅ Deployment Status
- [x] **Git Push**: All features (Creators, Admin, Luxury UI) pushed to `main`.
- [x] **Socket Code**: Optimized to support production ports and health checks.
- [x] **Git Ignore**: Cleaned up to exclude build artifacts.
- [ ] **Vercel Settings**: (Awaiting your environment variable setup)
- [ ] **Socket Server**: (Awaiting external hosting setup)

**Your site is now in the pipeline! once you add those environment variables and host the socket, everything will be fully functional.**
