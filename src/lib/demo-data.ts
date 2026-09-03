// Placeholder content shown when Supabase isn't configured yet (see
// src/lib/leaderboard.ts). Numbers match the ranking-algorithm table in
// the MVP spec, so the log curve reads the same everywhere.

export type LeaderboardEntry = {
  rank: number;
  slug: string;
  title: string;
  authorHandle: string;
  totalBidCents: number;
  score: number;
  /** No real screenshots yet for demo entries — TemplateTile falls back
   * to the monogram tile when this is undefined. */
  thumbnailUrl?: string | null;
};

const BID_LADDER = [50000, 10000, 5000, 1000, 500, 100];

function scoreFor(cents: number) {
  return Math.log(1 + cents / 100);
}

function buildEntries(
  items: { title: string; authorHandle: string }[],
): LeaderboardEntry[] {
  return items.map((item, i) => {
    const totalBidCents = BID_LADDER[i];
    return {
      rank: i + 1,
      slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: item.title,
      authorHandle: item.authorHandle,
      totalBidCents,
      score: scoreFor(totalBidCents),
    };
  });
}

export const DEMO_LEADERBOARDS: Record<string, LeaderboardEntry[]> = {
  saas: buildEntries([
    { title: "Nimbus", authorHandle: "@mirabuilds" },
    { title: "Ledger", authorHandle: "@ashcreates" },
    { title: "Northwind", authorHandle: "@joeldraws" },
    { title: "Fathom", authorHandle: "@priyamakes" },
    { title: "Basecoat", authorHandle: "@tomdev" },
    { title: "Fernweh", authorHandle: "@ninastudio" },
  ]),
  portfolio: buildEntries([
    { title: "Studio No. 4", authorHandle: "@lucacodes" },
    { title: "Atelier", authorHandle: "@ravenwrites" },
    { title: "Monograph", authorHandle: "@dev.hana" },
    { title: "Afterglow", authorHandle: "@kbuilds" },
    { title: "Firstlight", authorHandle: "@sanadraws" },
    { title: "Paperweight", authorHandle: "@omarcodes" },
  ]),
  agency: buildEntries([
    { title: "Halcyon", authorHandle: "@studiobyzoe" },
    { title: "Foundry", authorHandle: "@markbuilds" },
    { title: "Vantage", authorHandle: "@leacodes" },
    { title: "Kindred", authorHandle: "@dev.imani" },
    { title: "Northbound", authorHandle: "@felixmakes" },
    { title: "Redletter", authorHandle: "@ayadraws" },
  ]),
  ecommerce: buildEntries([
    { title: "Sable", authorHandle: "@studiorei" },
    { title: "Marché", authorHandle: "@devbyoli" },
    { title: "Corner Store", authorHandle: "@junocodes" },
    { title: "Lucid Goods", authorHandle: "@westonmakes" },
    { title: "Thistle", authorHandle: "@ines.builds" },
    { title: "Kindling", authorHandle: "@sam_codes" },
  ]),
  "landing-waitlist": buildEntries([
    { title: "Signal", authorHandle: "@devwithari" },
    { title: "Runway", authorHandle: "@noahbuilds" },
    { title: "Threshold", authorHandle: "@studiomax" },
    { title: "Vellum", authorHandle: "@ellacodes" },
    { title: "Outpost", authorHandle: "@theo.dev" },
    { title: "Firstcall", authorHandle: "@junebuilds" },
  ]),
};

