# Platform Architecture

Single reference for the Velvet Signal platform. Tech stack: **Next.js (App Router)**, **TypeScript**, **PostgreSQL**, **Prisma**, **TailwindCSS**, **Socket.io**. Only stable, production-grade libraries are used.

---

## 1. Database schema

**Database:** PostgreSQL. **ORM:** Prisma. Schema lives in `prisma/schema.prisma`.

### 1.1 Entities and relationships

| Entity | Purpose |
|--------|--------|
| **User** | End-user (payer). Email, emailVerified, passwordHash. No PII beyond what’s needed for auth and billing. |
| **Session** | Auth session: userId, token (opaque), expiresAt. One row per login; revoked on logout. |
| **Model** | Creator/VIP. slug (URL), displayName, email, passwordHash, profile fields (bio, location, height, weight, profession, education), avatarUrl, status (ONLINE/OFFLINE), verifiedFace, vip. |
| **SavedReply** | Model’s quick replies (admin UX). modelId, label, body. |
| **Conversation** | 1:1 chat. Unique (userId, modelId). No direct “room” id for Socket.io; use conversationId. |
| **Message** | One message in a conversation. senderType (USER | MODEL), body (optional), mediaUrl, mediaType (IMAGE | VIDEO | VOICE), deliveredAt, readAt, createdAt. |
| **Media** | Model’s media library. modelId, url, type. Used for “send photo/video” from library. |
| **Payment** | Payment record. payerId (User), amountCents, currency, status (PENDING | COMPLETED | FAILED | REFUNDED), optional conversationId, stripePaymentId for idempotency. |

### 1.2 Indexes and constraints

- **User:** unique email.
- **Session:** unique token; index on userId, expiresAt (for cleanup).
- **Model:** unique slug, unique email.
- **Conversation:** unique (userId, modelId); index on userId and modelId for list queries.
- **Message:** index on conversationId, createdAt for pagination.
- **Payment:** index on payerId, createdAt; unique stripePaymentId.

### 1.3 Data retention and cleanup

- Expired sessions: periodic job (cron or serverless) deletes `Session` where `expiresAt < now()`.
- Soft-delete is not required for MVP; hard delete with Prisma `onDelete: Cascade` where appropriate (e.g. Session when User is deleted).

---

## 2. API routes

**Base:** Next.js App Router Route Handlers under `src/app/api/`. All JSON; errors return `{ error: string }` and appropriate status.

### 2.1 Public (no auth)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Liveness. Returns `{ status: "ok" }`. |

### 2.2 Auth (no session required for request)

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | `{ email, password }` | Validate (email format, password strength, 18+ if stored client-side). Hash password (bcrypt). Create User (emailVerified: false). Send OTP (email). Return `{ requiresVerification: true }`. |
| POST | `/api/auth/verify-otp` | `{ email, code }` | Verify OTP. Set User.emailVerified = true. Create Session. Set HTTP-only cookie (session token). Return `{ user: { id, email } }`. |
| POST | `/api/auth/login` | `{ email, password }` | Verify password. Create Session. Set HTTP-only cookie. Return `{ user: { id, email } }`. |
| POST | `/api/auth/logout` | — | Clear session cookie; optionally delete Session row. Return 204. |

### 2.3 Protected (require valid session)

Session is read from HTTP-only cookie. If missing or invalid, return 401.

| Method | Path | Body / Query | Description |
|--------|------|--------------|-------------|
| GET | `/api/me` | — | Return current user (id, email, emailVerified). |
| GET | `/api/models` | `?status=online&featured=true` | List models (public profile fields only). Paginate (e.g. limit/offset or cursor). |
| GET | `/api/models/[slug]` | — | Get one model public profile by slug. 404 if not found. |
| GET | `/api/conversations` | — | List conversations for current user; include last message and model summary. |
| POST | `/api/conversations` | `{ modelId }` | Find or create conversation (userId from session, modelId). Return conversation + model summary. |
| GET | `/api/conversations/[id]/messages` | `?limit=50&before=<cursor>` | List messages in conversation; verify user owns conversation. Cursor = message id. |
| POST | `/api/conversations/[id]/messages` | `{ body?, mediaUrl?, mediaType? }` | Create message (senderType USER). Notify via Socket.io. Return created message. |
| POST | `/api/uploads/presign` | `{ filename, contentType, conversationId? }` | Return presigned URL and key for client upload. See §6. |
| POST | `/api/payments` | `{ amountCents, currency, conversationId? }` | Create Stripe PaymentIntent (or similar). Return `{ clientSecret }` for client-side confirm. Webhook updates Payment row. |

### 2.4 Admin / operator (separate auth later)

Reserved paths, e.g. `/api/admin/*`, with role check (model or super-admin). Not in scope for this document; define when building admin.

### 2.5 Request/response and errors

- **Request:** JSON where applicable. Validate with Zod (or similar) in route handler; reject invalid with 400 and `{ error: "Validation failed", details?: [...] }`.
- **Response:** JSON. Use consistent shapes (e.g. `{ data: T }` or direct T for lists).
- **401:** Missing or invalid session.
- **403:** Valid session but not allowed (e.g. conversation not owned).
- **404:** Resource not found.
- **429:** Rate limited (see §5).

---

## 3. Project folder structure

```
src/
├── app/
│   ├── api/                    # Route Handlers only
│   │   ├── health/
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   └── verify-otp/
│   │   ├── me/
│   │   ├── models/
│   │   │   ├── route.ts
│   │   │   └── [slug]/route.ts
│   │   ├── conversations/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts     # GET conversation (optional)
│   │   │       └── messages/route.ts
│   │   ├── uploads/
│   │   │   └── presign/route.ts
│   │   └── payments/
│   │       └── route.ts
│   ├── (marketing)/
│   │   └── page.tsx             # Landing (existing)
│   ├── (app)/                   # Authenticated app shell
│   │   ├── layout.tsx           # Session check, nav, bottom bar
│   │   ├── models/
│   │   ├── chat/
│   │   ├── profile/
│   │   └── ...
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── error.tsx
│   └── loading.tsx
├── features/
│   ├── landing/                 # Existing; do not redesign
│   ├── auth/
│   ├── models/
│   ├── chat/
│   ├── payments/
│   └── admin/
├── shared/
│   ├── design-system/
│   ├── ui/
│   └── lib/
│       ├── prisma.ts
│       ├── auth.ts              # Session read/verify, getCurrentUser
│       ├── validation/          # Zod schemas reused by API and forms
│       └── storage.ts           # Presign logic, bucket config
├── lib/
│   └── types/
├── server/                      # Optional: custom server for Socket.io
│   └── socket.ts                # Only if not using serverless Socket.io
prisma/
├── schema.prisma
docs/
├── ARCHITECTURE.md              # This file
```

**Conventions:**

- **app/api:** Thin handlers; parse body, call shared/lib functions (auth, services), return response.
- **shared/lib:** Auth (session read from cookie, verify token against DB), Prisma client, validation schemas, storage/presign helpers. No UI.
- **features/*:** Domain-specific UI and client-side logic; may call API routes or server actions.
- **Stable libraries only:** e.g. `bcrypt` (or `bcryptjs`), `jose` for JWT if needed, `zod` for validation, `@prisma/client`, `socket.io` (server + client).

---

## 4. Authentication strategy

### 4.1 Model

- **Sessions in DB:** Session table with userId, opaque token (crypto.randomBytes), expiresAt. No JWT in DB; token is the secret.
- **Cookie:** On login/verify-otp, set HTTP-only, Secure, SameSite=Strict cookie (e.g. `session=<token>`). Path=/. Max-Age = desired session length (e.g. 30 days).
- **No JWT required for web:** Cookie-based session is enough. If you add a mobile app later, you can add a separate “API key” or JWT flow for that client.

### 4.2 Registration flow

1. POST `/api/auth/register` with email, password.
2. Validate email format and password strength (e.g. min length, complexity). Optionally require 18+ (client + server if stored).
3. Hash password with **bcrypt** (or bcryptjs); store in User.passwordHash.
4. Create User with emailVerified = false.
5. Generate OTP (e.g. 6 digits), store in memory/Redis/DB with short TTL (e.g. 10 min) keyed by email.
6. Send OTP via email (SendGrid, Resend, or similar).
7. Return 201 `{ requiresVerification: true }`. No cookie yet.

### 4.3 Verification and login

1. POST `/api/auth/verify-otp` with email, code. Verify OTP; set User.emailVerified = true. Create Session; set cookie; return user.
2. POST `/api/auth/login` with email, password. Verify with bcrypt.compare; create Session; set cookie; return user.

### 4.4 Protected routes

1. In API: middleware or helper (e.g. `getSession()`) reads cookie, looks up Session by token, checks expiresAt. If invalid, return 401.
2. In app (app router): in `(app)/layout.tsx` or a wrapper, call an API or server action that uses the same `getSession()`; redirect to login if no session.

### 4.5 Logout

POST `/api/auth/logout`: clear session cookie; optionally delete Session row. Return 204.

### 4.6 Libraries

- **Password hashing:** `bcrypt` (native) or `bcryptjs` (pure JS). Stable and widely used.
- **Opaque token:** `crypto.randomBytes(32).toString('hex')` (Node) or Web Crypto. No custom JWT unless you need it for mobile/third-party.

---

## 5. Security best practices

### 5.1 General

- **HTTPS only:** Secure cookie; redirect HTTP → HTTPS in production.
- **Environment:** Secrets (DB URL, Stripe keys, email API key) in env vars only; never in code or client.
- **Dependencies:** Keep Prisma, Next.js, and other deps updated; run `npm audit` and fix high/critical.

### 5.2 Auth and session

- HTTP-only cookie so JS cannot read it (XSS cannot steal session).
- SameSite=Strict to reduce CSRF; for state-changing APIs that are not cookie-based from same site, consider CSRF token if you add form-based flows that need it.
- Short session expiry and sliding window optional; at least set a reasonable Max-Age.

### 5.3 Input validation and injection

- **Validate all inputs** (body, query, params) with Zod (or similar) before use. Reject invalid with 400.
- **Prisma:** Parameterized queries only; no raw SQL with user input. Avoid `Prisma.raw` with string interpolation.
- **XSS:** React escapes by default; avoid `dangerouslySetInnerHTML` unless sanitized (e.g. DOMPurify). Store and display only safe content for bio/messages.

### 5.4 Rate limiting

- **Auth:** Limit requests per IP for `/api/auth/register`, `/api/auth/login`, `/api/auth/verify-otp` (e.g. 5–10 per minute). Use Upstash Redis or in-memory store (e.g. `rate-limiter-flexible` or similar) keyed by IP.
- **API:** Optional global or per-route limit for protected routes (e.g. per user id) to avoid abuse.
- Return 429 with `Retry-After` when limited.

### 5.5 Headers and CORS

- **Security headers:** Use Next.js config or middleware to set e.g. X-Content-Type-Options: nosniff, X-Frame-Options: DENY (or SAMEORIGIN), Referrer-Policy. Consider CSP when you have time.
- **CORS:** If API is same-origin (same domain as app), no special CORS needed. If you later expose API to another domain, allow only that origin and required methods/headers.

### 5.6 Payments

- **Stripe:** Use server-side PaymentIntent creation; never trust amount from client alone—revalidate on server. Use webhooks to update Payment status; verify webhook signature.
- **PCI:** Do not store raw card numbers; Stripe handles card data.

---

## 6. Media uploads

### 6.1 Model

- **Stored URLs only in DB:** Message.mediaUrl, Media.url point to object storage (e.g. S3-compatible). No binary in PostgreSQL.
- **Storage:** AWS S3, Cloudflare R2, or any S3-compatible bucket. Bucket private; access via presigned URLs or a proxy that checks auth.

### 6.2 Flow (recommended: presigned URL)

1. **Client** requests upload capability: POST `/api/uploads/presign` with `{ filename, contentType, conversationId? }` (and optionally message type). Body validated (e.g. allowed MIME types, max size intent).
2. **Server** generates a unique key (e.g. `uploads/{userIdOrConversationId}/{uuid}-{sanitizedFilename}`), calls S3 `getSignedUrl('putObject', ...)` with short expiry (e.g. 5–10 min), optionally stores key in DB later when message is created.
3. **Server** returns `{ uploadUrl, key, expiresIn }` to client.
4. **Client** PUTs file to `uploadUrl` (no auth header needed for presigned PUT). Then client calls POST `/api/conversations/[id]/messages` with `{ mediaUrl: key }` (or full URL if you serve via CDN). Server resolves key to public or signed URL when storing in Message.
5. **Serving:** Either store public CDN URLs in DB after upload, or generate signed GET URLs when returning messages (prefer CDN + public URL for performance).

### 6.3 Limits and validation

- **File size:** Enforce server-side (e.g. 10–20 MB for images, 50–100 MB for video). Presign only if size (if sent in body) and contentType are allowed.
- **Content types:** Allow list (e.g. image/jpeg, image/png, image/webp, video/mp4). Reject others with 400.
- **Virus scan:** Optional; integrate ClamAV or cloud scan (e.g. S3 trigger) before marking media as available.

### 6.4 Libraries

- **AWS SDK v3** (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`) or equivalent for your provider. Stable and production-ready.

---

## 7. Real-time chat (Socket.io)

### 7.1 Role of Socket.io

- **Real-time delivery:** New message pushed to other participant without polling.
- **Presence and typing:** Optional “model online”, “typing…” indicators.
- **Read/delivered receipts:** Optional; update Message.deliveredAt / readAt and emit to sender.

REST remains source of truth: message creation and history via POST/GET; Socket.io for live delivery and presence.

### 7.2 Connection and auth

- **Client:** Use `socket.io-client` (stable). Connect to same origin (e.g. `window.location.origin`) or dedicated WebSocket URL if you run Socket.io on a separate server.
- **Auth:** On connection, client sends session token (e.g. in handshake auth object). Server validates token (same as API: lookup Session, check userId). If invalid, disconnect. Do not rely on cookie for Socket.io if the socket is to a different subdomain or port; use token in handshake then.

### 7.3 Rooms and events

- **Room = conversationId:** When a user opens a conversation, client joins room `conversation_<id>`. Server ensures user is a participant (userId in Conversation) before allowing join.
- **Events (server → client):**
  - `message:new` – payload: full message object. Emit to room (other participant).
  - `message:delivered` – optional; payload: messageId. Emit to sender.
  - `message:read` – optional; payload: messageId or conversationId. Emit to sender.
  - `typing:start` / `typing:stop` – optional; payload: conversationId, userId. Emit to room.
- **Events (client → server):**
  - `conversation:join` – payload: conversationId. Server verifies membership, then socket.join(room).
  - `conversation:leave` – payload: conversationId. socket.leave(room).
  - `typing:start` / `typing:stop` – server rebroadcasts to room.

Message creation stays in REST: client POSTs to `/api/conversations/[id]/messages`; API handler creates Message in DB, then (from API route or from a shared message bus) triggers Socket.io emit to the conversation room. So one source of truth (DB) and one code path for creating messages.

### 7.4 Scaling (multi-instance)

- **Single instance:** Socket.io in-process with Next.js (custom server) or in a separate Node server that shares the same DB and session validation.
- **Multiple instances:** Use **Socket.io Redis adapter** (`@socket.io/redis-adapter`). All instances connect to same Redis; rooms and emits are broadcast via Redis. Same schema: join by conversationId; emit to room.

### 7.5 Next.js integration options

- **Option A – Custom server:** Run a Node server that starts Next.js (e.g. `next custom server`) and mounts Socket.io on the same process. Single deployment; Socket.io and Next share the same port or you proxy.
- **Option B – Separate service:** Run Socket.io server as a separate app (e.g. on another port or container). Next.js API and front-end stay serverless if needed. Client connects to Socket.io server URL. Use Redis adapter if you run multiple Socket.io instances.
- **Option C – Serverless/edge:** Socket.io does not run on serverless/edge in the standard way. Use a dedicated Node server (A or B) for Socket.io; keep REST on Next.js.

### 7.6 Reconnection and ordering

- Client uses default Socket.io reconnection. On reconnect, re-auth and re-join rooms. Messages missed during disconnect are loaded via GET `/api/conversations/[id]/messages` (cursor pagination); no need to persist Socket.io events in DB beyond what REST already stores.

---

## 8. Summary

| Area | Decision |
|------|----------|
| **Database** | PostgreSQL + Prisma; schema in `prisma/schema.prisma` with User, Session, Model, Conversation, Message, Media, Payment. |
| **API** | Next.js Route Handlers under `app/api/`; REST only; session via HTTP-only cookie; validation with Zod. |
| **Auth** | Cookie-based session; opaque token in DB; bcrypt for passwords; OTP for email verification. |
| **Security** | HTTPS, env secrets, rate limit auth, validate input, Stripe server-side + webhooks. |
| **Media** | Presigned S3 (or compatible) PUT; store URL in DB; allow list for type/size. |
| **Real-time** | Socket.io; auth via token in handshake; room = conversationId; REST creates messages; Socket.io for delivery and optional typing/read. |
| **Libraries** | Prisma, bcrypt/bcryptjs, zod, jose if needed, @aws-sdk for S3, socket.io and socket.io-client. |

This document is the architecture baseline. Implement in code to match it; adjust the doc when you change a decision.
