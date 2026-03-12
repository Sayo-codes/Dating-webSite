# How to run and test every feature

## 1. Get the app running (on your machine)

### Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** running locally or a hosted DB (e.g. Neon, Supabase)
- **npm** (or pnpm/yarn)

### One-time setup

1. **Copy env and set the database**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set `DATABASE_URL` to your Postgres connection string, e.g.:
   ```bash
   DATABASE_URL="postgresql://postgres:password@localhost:5432/website"
   ```

2. **Install and prepare DB**
   ```bash
   npm install
   npx prisma migrate dev
   npm run db:seed
   ```
   This creates 3 creators (eva, jessie, luna) with placeholder galleries, plus **dummy User accounts** you can use to test messaging:
   - **Creator logins** (reply as the creator): `eva@example.com`, `jessie@example.com`, `luna@example.com` — password: `password123`
   - **Test fan** (send messages to creators): `test@example.com` — password: `password123`

3. **Create an admin user (for admin tests)**  
   After you register your first user (step 4 below), promote them to admin in the DB:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```
   Or use Prisma Studio: `npm run db:studio` → open `User` → set `role` to `admin`.

### Run the app (two terminals)

**Terminal 1 – Next.js**
```bash
npm run dev
```
App: **http://localhost:3000**

**Terminal 2 – Socket server (for real-time chat)**
```bash
npm run dev:socket
```
Socket server: **http://localhost:3001**

If you skip the socket server, the site still works but new messages won’t appear in real time until refresh.

---

## 2. Test every feature (checklist)

### Public / no login

| What | How |
|------|-----|
| **Home** | Open http://localhost:3000 – hero, stats, featured creators. |
| **Creators list** | Click “Creators” or go to `/creators` – see eva, jessie, luna. |
| **Creator profile** | Go to `/creators/eva` (or jessie, luna) – bio, gallery, “Message” (will send to login if not logged in). |

### Auth

| What | How |
|------|-----|
| **Register** | `/register` – email, username, password. Then check email (or dev logs) for verification link. |
| **Verify email** | Use link from email or go to `/verify-email` and enter code (if your dev setup sends OTP/code). |
| **Login** | `/login` – email + password. |
| **Logout** | Use the logout control in the UI (or call `/api/auth/logout`). |
| **Current user** | While logged in, UI that shows “logged in” state; API: `GET /api/auth/me`. |

### User: messages (real-time chat)

| What | How |
|------|-----|
| **Conversations** | Login → **Messages** (`/messages`). Initially empty. |
| **Start a chat** | Go to `/creators/eva` → **Message** → creates a conversation and opens chat. |
| **Send text** | Type in the input and send. |
| **Real-time** | Open the same conversation in another browser/incognito (logged in as another user or same user); send a message from one – it should appear on the other if socket server is running. |
| **Media** | If S3 is configured: send image/video/voice via the upload flow in the message composer. Without S3, media upload will fail; text still works. |

**Quick test (dummy accounts from seed):**

1. Log in as **admin** (or as `test@example.com` / `password123`) → go to **Creators** → open **Eva** → click **Message** → send a message.
2. Log out; log in as **eva@example.com** / **password123** → go to **Messages** (or Creator dashboard). You should see the conversation and can reply as the creator.

### User: premium / payments

| What | How |
|------|-----|
| **Premium page** | Login → **Premium** (`/premium`) – paywalled content and “Unlock” button. |
| **Pay with PayPal** | Click unlock; if PayPal env vars are set (sandbox), complete sandbox payment. Otherwise button may be disabled or show error. |
| **Transaction history** | Same page or dedicated section – list of your payments. |
| **Unlock check** | After a successful payment for an item, that item should show as unlocked (no pay wall). |

### Creator dashboard

Use the **seed creator accounts**: `eva@example.com`, `jessie@example.com`, `luna@example.com` (password: `password123`). Each has a matching Creator profile and role `creator`.

Then:

| What | How |
|------|-----|
| **Creator dashboard** | Login as that user → go to `/creator/dashboard`. |
| **Profile** | Edit display name, bio, avatar (avatar needs S3). |
| **Gallery** | Add/remove/reorder images or videos (URLs; S3 optional for uploads). |
| **Creator messages** | From dashboard or messages UI – see conversations with fans and reply. Real-time works if socket server is running. |

### Admin

Only users with `role = 'admin'` can access admin. Use the user you set to admin in setup.

| What | How |
|------|-----|
| **Dashboard** | `/admin` – counts (users, creators, conversations, messages) and links. |
| **Creators** | `/admin/creators` – list, create new creator, edit (username, display name, bio, verified, etc.), add/remove gallery items. |
| **Messages** | `/admin/messages` – list conversations; open one to see messages; **Hide** a message (soft-delete). |
| **Analytics** | `/admin/analytics` – counts, recent users/conversations, messages-by-day chart. |

### Optional: uploads (S3)

Set in `.env`: `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_PUBLIC_URL` (and optionally `S3_REGION`, `S3_ENDPOINT`). Then:

- **Message media** – attach image/video/voice in chat.
- **Avatar** – creator or profile avatar upload.
- **Gallery** – creator gallery upload (or admin add-by-URL works without S3).

---

## 3. Can I give it to my friends to test?

**Short answer:**  
- **On your machine:** Yes – they can test from your network if you use your local IP (e.g. `http://192.168.1.x:3000`) and you keep both `npm run dev` and `npm run dev:socket` running.  
- **On the internet:** Only if you deploy it and fix a few things (see below).

**What works for “friends on your WiFi” (same network):**

1. Find your local IP (e.g. `ipconfig` on Windows, `ifconfig` on Mac/Linux).
2. In `.env` set:
   - `NEXT_PUBLIC_SOCKET_URL=http://YOUR_IP:3001`
   - `NEXT_PUBLIC_APP_ORIGIN=http://YOUR_IP:3000`
3. Run `npm run dev` and `npm run dev:socket` and tell friends to open `http://YOUR_IP:3000`.
4. They can register, message, and test. PayPal will only work if your PayPal app allows the redirect URL for that IP (sandbox often allows localhost only).

**Before sharing on the internet (deploying for friends):**

1. **Deploy** – e.g. Vercel (Next.js) + a hosted Postgres (Neon, Supabase, etc.). Socket server must run somewhere that allows WebSockets (e.g. a small Node host or a service that supports Socket.io).
2. **Env in production** – set `DATABASE_URL`, `JWT_SECRET` (strong random), `NEXT_PUBLIC_SOCKET_URL` and `NEXT_PUBLIC_APP_ORIGIN` to your real app URL, and optionally `SOCKET_SERVER_SECRET`.
3. **PayPal** – add your production domain and webhook URL in the PayPal app; point webhook to `https://yourdomain.com/api/payments/webhook`.
4. **Security** – ensure you don’t commit `.env`; use the platform’s env config. Keep `JWT_SECRET` and PayPal keys secret.

So: **local/WiFi testing with friends = yes, with the steps above.** **Public internet testing = deploy first and configure env + PayPal + socket server.**
