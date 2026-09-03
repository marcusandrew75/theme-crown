# ThemeCrown

A pay-to-rank leaderboard for Framer template authors, built so a $1 bid
still moves the needle. (Formerly "Framer Throne" — renamed so the brand
isn't locked to one marketplace, even though v1's schema and categories
are still Framer-specific by design.) See the [MVP spec](https://claude.ai/code/artifact/85a468a2-04c9-45a8-a2c6-06ef36da83b6)
for the full product design — this README only covers running the code.

## Stack

Next.js (App Router, TypeScript, Tailwind v4) · Supabase (Postgres + Auth) · Stripe

## Setup

1. Create a Supabase project (a free/dev one is fine to start).
2. Copy `.env.example` to `.env.local` and fill in the Supabase and Stripe
   keys from your project's dashboards. Use Stripe **test-mode** keys
   (`sk_test_...` / `pk_test_...`) until you're ready to take real payments.
3. Run the migrations against your Supabase project (via the SQL editor,
   or the Supabase CLI: `supabase db push`), in order:
   - `supabase/migrations/0001_init.sql` — schema: categories, templates,
     rounds, bids, and the RLS policies that let a user bid or list a
     template only as themself.
   - `supabase/migrations/0002_ranking.sql` — the log-curve ranking views
     and the `current_leaderboard(category_slug)` function the app queries.
   - `supabase/seed.sql` — the five launch categories.
4. Create a Stripe webhook endpoint pointing at
   `https://<your-domain>/api/stripe/webhook`, subscribed to
   `checkout.session.completed`, and copy its signing secret into
   `STRIPE_WEBHOOK_SECRET`. For local testing, use the Stripe CLI instead:
   `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
5. `npm install`
6. `npm run dev` and open http://localhost:3000

## How ranking works

Score is `ln(1 + total_bid_cents / 100)`, not raw dollars — see the spec's
"Ranking algorithm" section for why. Rounds are weekly (Monday 00:00 UTC)
and created lazily by `ensure_current_round()` the first time anyone bids
or views a category that week — there's no cron job to run.

## How bidding works

Placing a bid redirects to a Stripe-hosted Checkout page — the app never
handles card details itself. The bid is only recorded once Stripe confirms
payment, via a webhook (`/api/stripe/webhook`) rather than at checkout
creation time, using the service-role client since there's no user session
in a webhook. The webhook re-derives the category and current round from
the database rather than trusting anything passed through Checkout beyond
`template_id` and `user_id`, and is safe against Stripe's automatic retries
— `stripe_payment_id` is unique, so a redelivered event just no-ops.

## What's here vs. what's next

Built: the schema and ranking function, the submit-a-template flow, and
the bid/Stripe checkout flow — all three verified against a real Postgres
instance, not just inspected (see the migrations' inline comments and the
commit history for what was tested). Also: Supabase client wiring
(`src/lib/supabase/`, `src/proxy.ts`), magic-link sign-in (`/login`,
`/auth/callback`), and the landing/leaderboard/template pages, which fall
back to demo data whenever Supabase isn't configured.

Not yet built: thumbnail file uploads (submit currently takes an image
URL rather than a file, since that needs Supabase Storage wired up), and
the author/founder dashboards from the spec.
