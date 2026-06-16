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

## Architecture

Next.js 15 App Router app with Supabase Auth (cookie-based via `@supabase/ssr`), shadcn/ui components, and Tailwind CSS.

### Supabase client pattern

There are three Supabase client factories — use the right one for each context:

- [lib/supabase/client.ts](lib/supabase/client.ts) — browser/Client Components (`createBrowserClient`)
- [lib/supabase/server.ts](lib/supabase/server.ts) — Server Components and Route Handlers (`createServerClient` with cookie store). **Always create a new instance per request — never store in a global variable.**
- [lib/supabase/proxy.ts](lib/supabase/proxy.ts) — Next.js proxy (runs `getClaims()` to refresh sessions)

### Auth flow

- [proxy.ts](proxy.ts) runs on every request (via Next.js middleware matcher) and calls `updateSession` from `lib/supabase/proxy.ts` to keep sessions alive. Routes under `/auth/*` and `/` are excluded from the auth redirect.
- [app/auth/confirm/route.ts](app/auth/confirm/route.ts) handles the email OTP verification callback (`token_hash` + `type` query params → `verifyOtp`).
- Auth pages live under [app/auth/](app/auth/) (login, sign-up, forgot-password, update-password, error, sign-up-success).
- [app/protected/](app/protected/) requires authentication — the layout wraps all authenticated pages. Server components check auth via `supabase.auth.getClaims()` and redirect to `/auth/login` on failure.

### Component organization

- [components/ui/](components/ui/) — shadcn/ui primitives (Button, Card, Input, Label, etc.)
- [components/](components/) — app-level components (LoginForm, SignUpForm, ForgotPasswordForm, UpdatePasswordForm, AuthButton, LogoutButton, ThemeSwitcher)
- [components/tutorial/](components/tutorial/) — starter tutorial steps (can be removed for production apps)

### Styling

Tailwind CSS v3 with `tailwind-merge` + `clsx` (exposed as `cn()` from [lib/utils.ts](lib/utils.ts)). Dark mode is handled by `next-themes` with the `class` strategy.
