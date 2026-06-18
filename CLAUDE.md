# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server on localhost:3000
npm run build    # Production build
npm run lint     # ESLint check
```

No test suite is configured.

## Environment Setup

Copy `.env.example` to `.env.local` and fill in the Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Both values come from the Supabase project's API settings. The `PUBLISHABLE_KEY` accepts either the new publishable key or the legacy anon key.

## Database

The schema lives in [supabase/migrations/20240101000000_blog.sql](supabase/migrations/20240101000000_blog.sql). Run it in the Supabase SQL editor to set up the tables and RLS policies.

**Tables:**

- `posts` — `id`, `title`, `slug` (unique), `content`, `author_id`, `author_email`, `published`, `created_at`, `updated_at`
- `comments` — `id`, `post_id`, `user_id`, `user_email`, `content`, `created_at`

**RLS rules:** Published posts are public; authors can read their own drafts. Comments are public to read; creating requires auth. `author_email` and `user_email` are denormalized into each row at write time to avoid joins.

**TypeScript types:** [lib/types.ts](lib/types.ts) — `Post` and `Comment`.

## Architecture

Next.js 15 App Router app with Supabase Auth (cookie-based via `@supabase/ssr`), shadcn/ui components, and Tailwind CSS.

### Supabase client pattern

There are three Supabase client factories — use the right one for each context:

- [lib/supabase/client.ts](lib/supabase/client.ts) — browser/Client Components (`createBrowserClient`)
- [lib/supabase/server.ts](lib/supabase/server.ts) — Server Components and Route Handlers (`createServerClient` with cookie store). **Always create a new instance per request — never store in a global variable.**
- [lib/supabase/proxy.ts](lib/supabase/proxy.ts) — Next.js proxy (runs `getClaims()` to refresh sessions)

In Server Components, check auth with `supabase.auth.getClaims()` — it reads the JWT locally without a network round-trip. `getClaims().data.claims.sub` is the user ID; `claims.email` is the email. Use `getUser()` only in Client Components.

### Auth flow

- [proxy.ts](proxy.ts) runs on every request (via Next.js middleware matcher) and calls `updateSession` to keep sessions alive. Routes under `/auth/*` and `/` are excluded from the auth redirect.
- [app/auth/confirm/route.ts](app/auth/confirm/route.ts) — email OTP callback (`token_hash` + `type` → `verifyOtp`).
- [app/auth/callback/route.ts](app/auth/callback/route.ts) — OAuth callback; exchanges `code` for a session via `exchangeCodeForSession`, then redirects to `/`.
- Auth pages live under [app/auth/](app/auth/) (login, sign-up, forgot-password, update-password, error, sign-up-success).
- Google OAuth is wired in [components/login-form.tsx](components/login-form.tsx) via `signInWithOAuth({ provider: 'google' })`. Requires Google enabled in the Supabase dashboard and `http://localhost:3000/auth/callback` added to the allowed redirect URLs.

### Blog feature

The home page (`/`) is the blog listing. The blog routes are under `app/blog/` with their own layout:

- `app/page.tsx` — blog post listing (server component, public)
- `app/blog/[slug]/page.tsx` — post detail + comments (server component, public); params are `Promise<{ slug }>` per Next.js 15
- `app/blog/new/page.tsx` — create post form (server component, redirects to login if unauthenticated)

**Components** under [components/blog/](components/blog/):

- `PostCard` — post preview card used in the listing
- `PostForm` — client component; auto-generates slug from title, has publish toggle, calls `supabase.from('posts').insert()`
- `CommentSection` — client component; receives `initialComments` + `userId`/`userEmail` from the server, updates state optimistically on new comment

### Component organization

- [components/ui/](components/ui/) — shadcn/ui primitives (Button, Card, Input, Label, Checkbox, etc.)
- [components/](components/) — app-level components (LoginForm, SignUpForm, ForgotPasswordForm, UpdatePasswordForm, AuthButton, LogoutButton, ThemeSwitcher)
- [components/blog/](components/blog/) — blog-specific components (PostCard, PostForm, CommentSection)

### Styling

Tailwind CSS v3 with `tailwind-merge` + `clsx` (exposed as `cn()` from [lib/utils.ts](lib/utils.ts)). Dark mode via `next-themes` with the `class` strategy.
