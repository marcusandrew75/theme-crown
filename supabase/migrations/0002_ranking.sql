-- ThemeCrown — log-curve ranking
--
-- score = ln(1 + total_bid_cents / 100)
-- Rank = sort by score desc within category + round, ties broken by the
-- earliest bid (rewards early conviction, not last-second sniping).
--
-- Rounds are weekly, aligned to Monday 00:00 UTC, and created lazily —
-- there's no cron job in v1. `ensure_current_round` creates this week's
-- row the first time anyone bids or views a category's leaderboard, so a
-- category with no traffic never accumulates empty future rounds.

-- ---------- per-template score for a given round ----------

create view template_round_scores as
select
  b.template_id,
  b.round_id,
  sum(b.amount_cents) as total_bid_cents,
  ln(1 + sum(b.amount_cents) / 100.0) as score,
  min(b.created_at) as first_bid_at
from bids b
group by b.template_id, b.round_id;

-- ---------- full leaderboard (every template x every round it's eligible for) ----------
-- Filter by round_id for a live leaderboard, or by template_id for one
-- template's rank history across rounds.

create view leaderboard as
select
  t.id as template_id,
  t.slug as template_slug,
  t.title,
  t.thumbnail_url,
  t.author_id,
  c.id as category_id,
  c.slug as category_slug,
  r.id as round_id,
  r.starts_at,
  r.ends_at,
  coalesce(s.total_bid_cents, 0) as total_bid_cents,
  coalesce(s.score, 0) as score,
  s.first_bid_at,
  rank() over (
    partition by r.id
    order by coalesce(s.score, 0) desc, s.first_bid_at asc nulls last
  ) as rank
from templates t
join categories c on c.id = t.category_id
join rounds r on r.category_id = c.id
left join template_round_scores s on s.template_id = t.id and s.round_id = r.id;

-- ---------- weekly round management ----------
-- security definer: rounds has no insert policy for regular users (see
-- 0001_init.sql), so this runs with the function owner's privileges to
-- create the row, while still preventing anyone from inserting rounds
-- directly.

create or replace function ensure_current_round(p_category_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_starts_at timestamptz := date_trunc('week', now() at time zone 'utc') at time zone 'utc';
  v_ends_at timestamptz := (date_trunc('week', now() at time zone 'utc') at time zone 'utc') + interval '7 days';
  v_round_id uuid;
begin
  insert into rounds (category_id, starts_at, ends_at)
  values (p_category_id, v_starts_at, v_ends_at)
  on conflict (category_id, starts_at) do nothing
  returning id into v_round_id;

  if v_round_id is null then
    select id into v_round_id
    from rounds
    where category_id = p_category_id and starts_at = v_starts_at;
  end if;

  return v_round_id;
end;
$$;

-- ---------- convenience lookup for the app ----------

create or replace function current_leaderboard(p_category_slug text)
returns setof leaderboard
language plpgsql
as $$
declare
  v_category_id uuid;
  v_round_id uuid;
begin
  select id into v_category_id from categories where slug = p_category_slug;
  if v_category_id is null then
    raise exception 'unknown category: %', p_category_slug;
  end if;

  v_round_id := ensure_current_round(v_category_id);

  return query
    select * from leaderboard where leaderboard.round_id = v_round_id order by leaderboard.rank;
end;
$$;
