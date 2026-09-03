# Stripe application notes — read before flipping on real keys

ThemeCrown's core mechanic (pay to move your rank) sits close enough to
"auction" and "bidding" language that it's worth being deliberate about how
we describe the business to Stripe, and to our own users, before going live
with real payments. This doc is the reference for that — come back to it
before creating the Stripe account / submitting the application.

## The actual risk

Stripe's restricted-business list explicitly names **"pay-in auctions"** and
**"bidding fee auctions"** under its gambling category. Those terms — "bid,"
"auction," "leaderboard" — are exactly the words ThemeCrown's product uses,
so there's a real chance an underwriter (human or automated) pattern-matches
us into that bucket on a first read.

Polar's Acceptable Use Policy separately bars gambling/betting services
outright, so Polar is not a good fallback for this specific business model —
stick with Stripe (or another traditional processor) and get the framing
right, rather than switching processors.

## Why we're not actually a "bidding fee auction"

The gambling-restricted pattern (classic "penny auction" sites like the
old Swoopo/QuiBids) works like this: many people pay per bid, but only
**one winner** gets the item — everyone else's money is gone for nothing.
That's the uncertain-outcome, pooled-loss structure that makes it
gambling-adjacent.

ThemeCrown has none of that:

- **No pool.** Nobody's payment is redistributed to anyone else. Every
  dollar a user spends goes straight into that specific template's own
  score.
- **No chance.** The effect of a bid is 100% deterministic —
  `score = ln(1 + total_bid_cents / 100)` — same formula, same result,
  every time. There's no draw, no random outcome, nothing "won."
- **Guaranteed delivery.** You get exactly what you paid for (a ranking
  boost) immediately and permanently for that round. Nobody walks away
  having paid for nothing.

Structurally this is the same shape as paid-placement products that run on
Stripe without issue every day: Etsy "promoted listings," Fiverr "boosted
gigs," dating-app profile boosts, Google/Meta ad auctions (which literally
use the word "bid" for placement). The common thread across all of those:
you're buying guaranteed visibility, not a chance to win a prize.

## What to do differently when applying

1. **Business description wording.** Don't lead with "bidding" or
   "auction" in the Stripe application's business description. Use
   something like:

   > ThemeCrown is a marketplace-promotion platform for independent
   > software template authors. Authors and their supporters pay a
   > placement fee to boost a listing's visibility on a category
   > leaderboard. The fee's effect on ranking is calculated by a fixed,
   > publicly documented formula — there is no prize, no pooled funds,
   > and no chance-based outcome. Every payment guarantees an immediate,
   > deterministic increase to that listing's own score for the current
   > weekly ranking period.

   Adjust naming as needed once the app name / URL are final, but keep the
   substance: "placement fee," "deterministic," "no pool," "no chance."

2. **Avoid trigger words in anything Stripe-facing** (business description,
   support tickets, statement descriptor): "auction," "jackpot," "prize,"
   "win," "pot." Fine to keep "bid" in the product's own UI copy (users
   understand it as the ad-auction sense), just don't lean on it when
   describing the business to Stripe.

3. **Get ahead of it.** Before relying on the account for real volume,
   message Stripe support directly with the paragraph above (or similar)
   and ask them to confirm the model is acceptable. A slow "yes" up front
   beats a account freeze after launch — frozen funds mid-operation, with
   customers who've already paid, is the actual failure mode to avoid, not
   a slightly longer approval process.

4. **Keep the site's own copy consistent with this framing.** The
   "How it works" section on the homepage was updated (see commit history)
   to state explicitly that every dollar goes to the payer's own score,
   with no prize pool — worth pointing Stripe reviewers at that section
   directly if asked, since it makes the same argument publicly.

## Before going live — checklist

- [ ] Reread this doc once the app/company name is finalized
- [ ] Draft final business description using the wording above
- [ ] Create the Stripe account, fill in business description carefully
- [ ] Proactively message Stripe support describing the model before
      processing real volume, not after
- [ ] Set the statement descriptor to something neutral (e.g. "THEMECROWN
      PLACEMENT" rather than anything with "bid"/"auction" in it)
- [ ] If Stripe pushes back or asks for changes, revisit product language
      (site copy, ToS) together before resubmitting
- [ ] Once approved, keep this doc for reference in case of a future
      account review

## Sources

- [Stripe — Prohibited and Restricted Businesses](https://stripe.com/en-th/legal/restricted-businesses)
- [PayKings — Stripe Prohibited Businesses List](https://paykings.com/blog/stripe-prohibited-businesses/)
- [Polar — Acceptable Use Policy](https://polar.sh/legal/acceptable-use-policy)
