# Velvet Signal – Folder structure

Production layout for Next.js App Router, TypeScript, Prisma, Tailwind, Socket.io. Landing page stays as-is; new features follow this structure.

```
website/
├── prisma/
│   └── schema.prisma          # PostgreSQL schema (User, Model, Conversation, Message, Payment, etc.)
├── public/
├── src/
│   ├── app/
│   │   ├── api/               # REST API routes
│   │   │   ├── health/
│   │   │   ├── auth/
│   │   │   │   ├── register/
│   │   │   │   ├── login/
│   │   │   │   └── verify-otp/
│   │   │   ├── models/
│   │   │   │   ├── route.ts           # GET list
│   │   │   │   └── [slug]/route.ts   # GET profile
│   │   │   ├── conversations/
│   │   │   │   ├── route.ts           # GET list, POST create
│   │   │   │   └── [id]/
│   │   │   │       └── messages/route.ts  # GET list, POST send
│   │   │   └── payments/
│   │   │       └── route.ts           # POST create intent
│   │   ├── (marketing)/       # optional group for landing
│   │   │   └── page.tsx       # current landing (or move here)
│   │   ├── (app)/             # authenticated app shell (layout, nav)
│   │   │   ├── layout.tsx
│   │   │   ├── models/
│   │   │   ├── chat/
│   │   │   ├── profile/
│   │   │   └── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx           # landing
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   └── globals.css
│   ├── features/
│   │   ├── landing/           # existing – do not redesign
│   │   │   ├── components/
│   │   │   └── index.ts
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── api/
│   │   │   └── hooks/
│   │   ├── models/
│   │   │   ├── components/
│   │   │   ├── api/
│   │   │   └── hooks/
│   │   ├── chat/
│   │   │   ├── components/
│   │   │   ├── api/
│   │   │   └── hooks/
│   │   ├── payments/
│   │   └── admin/
│   ├── shared/
│   │   ├── design-system/
│   │   │   ├── theme.ts
│   │   │   └── DESIGN_SYSTEM.md
│   │   ├── ui/
│   │   │   ├── GlassCard.tsx
│   │   │   ├── PrimaryButton.tsx
│   │   │   ├── SecondaryButton.tsx
│   │   │   ├── StatusDot.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Section.tsx
│   │   │   ├── PageContainer.tsx
│   │   │   └── index.ts
│   │   └── lib/               # auth helpers, db client, socket client
│   │       ├── prisma.ts
│   │       └── auth.ts
│   └── lib/
│       └── types/
│           └── model.ts
├── .env.example
├── FOLDER_STRUCTURE.md
├── next.config.ts
├── package.json
├── tailwind.config.ts (if used)
└── tsconfig.json
```

## Conventions

- **app/** – Routes and route handlers only. Use layout.tsx for app shell and nav.
- **features/** – One folder per domain (landing, auth, models, chat, payments, admin). Each can have components/, api/ (client-side or server actions), hooks/.
- **shared/** – Design system (theme, docs) and UI primitives used across features. No feature logic.
- **lib/** – Global types, Prisma client singleton, auth helpers. API route handlers live under app/api/.
- **API** – REST under app/api/. Auth: register, login, verify-otp. Resources: models, conversations, messages, payments. Add Socket.io server in a custom server or API route for real-time messages.

## Adding Socket.io

- Use a custom Node server that runs Next.js and Socket.io, or mount Socket.io in a Next.js API route (e.g. app/api/socket/route or a separate serverless WebSocket endpoint per your host).
- Keep Socket.io events aligned with API: e.g. message:send, message:delivered, typing:start, typing:stop. Auth via same session token as REST.
