# Rsdate – Design System (extracted from landing page)

This document is the single source of truth for the rest of the platform. **Do not redesign the landing page.** All new screens must use these tokens and components so the app feels like one product.

---

## 1. Color palette

| Role | Value | Usage |
|------|--------|--------|
| **Background base** | `#05060a` | Page background |
| **Background elevated** | `rgba(10, 11, 20, 0.82)` | Glass cards, modals |
| **Text primary** | `#ffffff` | Headings, key numbers |
| **Text secondary** | `rgba(255,255,255,0.72)` | Body copy |
| **Text muted** | `rgba(255,255,255,0.52)` | Labels, metadata |
| **Accent primary** | `#c778ff` | Primary CTAs, links |
| **Accent secondary** | `#ff6fae` | Gradients, highlights |
| **Accent tertiary** | `#4dd5ff` | Decorative, stats |
| **Status online** | `#3dff9a` | Online indicator |
| **Status offline** | `#ff4d6a` | Offline indicator |
| **Status warning** | `#ffc857` | Warnings, errors |

Use CSS variables from `globals.css` in styles (e.g. `var(--bg-base)`). Use `theme` from `@/shared/design-system/theme` in TypeScript when needed.

---

## 2. Typography

- **Heading font:** Plus Jakarta Sans (500, 600, 700) – `var(--font-heading)` or `font-[var(--font-heading)]`
- **Body font:** Inter – `var(--font-body)` or default sans

**Scale:**

- **Overline / label:** `text-xs` (0.75rem), `uppercase`, `tracking-[0.18em]`, muted color
- **Section heading:** `section-heading` class or `text-sm` + uppercase + tracking
- **Body:** `text-sm` or `text-base`, secondary color
- **Stat / number:** `text-2xl` or `text-3xl`, `font-semibold`, primary color
- **Hero H1:** `text-4xl sm:text-5xl`, `font-semibold`, `leading-tight`

---

## 3. Spacing system

Use Tailwind spacing that matches the 4/8/12/16/24/32/40/64px scale:

- `gap-1` (4px), `gap-2` (8px), `gap-3` (12px), `gap-4` (16px), `gap-6` (24px), `gap-8` (32px), `gap-10` (40px), `gap-16` (64px)
- Same for `p-*`, `m-*`, `space-y-*`, etc.

**Layout:**

- Page content max-width: `max-w-6xl`
- Page padding: `px-4 pb-16 pt-12 sm:px-6 lg:px-10`
- Section vertical rhythm: `gap-16` between major sections
- Section internal: `section-shell` (flex col, gap 1rem)

---

## 4. Button styles

- **Primary (main CTA):** `PrimaryButton` component → gradient pill, dark text, glow shadow. Use for one primary action per block.
- **Secondary (ghost):** `SecondaryButton` → rounded-full, border white/20, bg white/5, hover bg white/10. Use for Login, Cancel, secondary actions.

Always add `focus-outline` class for keyboard focus ring (purple glow).

---

## 5. Card components

- **Glass card:** Use `GlassCard` component or `.glass-card` class. Use for: stat cards, model cards, list items, modals, error/empty states.
- **Radius:** Always `var(--radius-card)` (22px) for cards; pill for buttons.

---

## 6. Layout grid

- **Landing main:** Single column, `flex flex-col gap-16`, centered `max-w-6xl`.
- **Hero:** Two-column grid on lg: `grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center`, `gap-10`.
- **Stats / lists:** `flex flex-wrap gap-4` for cards; horizontal scroll with `-mx-4 overflow-x-auto px-4` when needed.

Use `PageContainer` wrapper for consistent inner padding and max-width on other pages.

---

## 7. UI patterns (from landing)

- **Overline + heading:** Small uppercase label (Security, Verification) then body text.
- **Section:** `section-shell` + `section-heading` (h2) + content.
- **Status:** `StatusDot` with `online` | `offline`; pair with text "Online" / "Offline".
- **Tags/chips:** Rounded pill, `border border-fuchsia-400/40 bg-fuchsia-500/10`, small text.
- **Skeleton:** `skeleton` class on a container; use for loading states.
- **Focus:** `focus-outline` on all interactive elements.

---

## 8. Accessibility

- Use semantic HTML (`main`, `section`, `h1`–`h2`, `button`, `a`).
- Section headings linked via `aria-labelledby` and matching `id`.
- Buttons and links need visible focus (`.focus-outline`) and `aria-label` when the label isn’t visible.
- Error/empty states in `GlassCard` with clear, concise copy.
