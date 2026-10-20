# Hail Lions Website & Scheduler

Mobile paintless dent repair for greater Houston — marketing site + photo-first booking.

**Phone:** (281) 352-5434  
**Stack:** Next.js 15 · Tailwind CSS · TypeScript · Supabase (optional)

## Run locally

```bash
cp .env.example .env.local
# fill Supabase keys when ready (optional for UI-only)
npm install
npm run dev
```

Open http://localhost:3000

## Deploy on Vercel

1. Import this repo in Vercel  
2. Framework: Next.js  
3. Env vars (optional until backend is live):

| Name | Required for |
|------|----------------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs |
| `NEXT_PUBLIC_SUPABASE_URL` | Save bookings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client (if used) |
| `SUPABASE_SERVICE_ROLE_KEY` | API route inserts |

Without Supabase env vars, `/book` still works in **demo mode** (success UI, request not stored).

## Supabase setup

1. Create a project at https://supabase.com  
2. SQL Editor → run `supabase/schema.sql`  
3. Copy Project URL + anon key + service role key into Vercel env  
4. Redeploy  

## Main routes

| Path | Description |
|------|-------------|
| `/` | Homepage |
| `/book` | 5-step photo booking |
| `/api/book` | Booking API |
| `/services/*` | Service pages |
| `/areas/*` | Local SEO city pages |
| `/about` | About |
| `/guarantee` | Guarantee |
| `/contact` | Contact |

Built exclusively for Hail Lions LLC.
