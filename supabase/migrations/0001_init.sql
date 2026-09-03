-- ThemeCrown — core schema
-- Entities: categories, templates, rounds, bids (users live in auth.users)

create extension if not exists "pgcrypto";

-- ---------- categories ----------

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

-- ---------- templates ----------

create table templates (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references categories (id) on delete restrict,
  slug text not null unique,
  title text not null,
  url text not null,
  thumbnail_url text,
  created_at timestamptz not null default now()
);

create index templates_category_id_idx on templates (category_id);
create index templates_author_id_idx on templates (author_id);

-- ---------- rounds ----------
-- One row per category per week. A round is "current" when now() falls
-- between starts_at and ends_at; the weekly reset is just moving to the
-- next row, never deleting bid history.

create table rounds (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories (id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint rounds_ends_after_starts check (ends_at > starts_at),
  constraint rounds_category_starts_unique unique (category_id, starts_at)
);

create index rounds_category_id_idx on rounds (category_id);
create index rounds_active_window_idx on rounds (category_id, starts_at, ends_at);

-- ---------- bids ----------
-- $1 minimum (100 cents). Bids are immutable and non-refundable by design —
-- there is deliberately no status/refunded column.

create table bids (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references templates (id) on delete cascade,
  round_id uuid not null references rounds (id) on delete restrict,
  user_id uuid not null references auth.users (id) on delete restrict,
  amount_cents integer not null check (amount_cents >= 100),
  stripe_payment_id text not null unique,
  created_at timestamptz not null default now()
);

create index bids_template_round_idx on bids (template_id, round_id);
create index bids_round_id_idx on bids (round_id);
create index bids_user_id_idx on bids (user_id);

-- ---------- row level security ----------

alter table categories enable row level security;
alter table templates enable row level security;
alter table rounds enable row level security;
alter table bids enable row level security;

-- Categories and rounds are public read-only reference data.
create policy categories_public_read on categories for select using (true);
create policy rounds_public_read on rounds for select using (true);

-- Templates: publicly visible; an author can only list their own template.
create policy templates_public_read on templates for select using (true);
create policy templates_author_insert on templates
  for insert with check (author_id = auth.uid());

-- Bids: publicly visible (leaderboards are public); a user can only place
-- a bid as themselves. Bids are never updated or deleted — no policy for
-- either, which denies both by default under RLS.
create policy bids_public_read on bids for select using (true);
create policy bids_user_insert on bids
  for insert with check (user_id = auth.uid());
