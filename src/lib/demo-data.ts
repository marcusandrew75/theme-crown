// Placeholder content shown when Supabase isn't configured yet (see
// src/lib/leaderboard.ts). Numbers match the ranking-algorithm table in
// the MVP spec, so the log curve reads the same everywhere.
//
// Titles, authors, thumbnails, and taglines are real templates pulled from
// the Framer Marketplace (framer.com/marketplace/templates/categories/<slug>/,
// "Trending" tab, plus each template's own <meta name="description"> for
// the tagline) so the demo leaderboard looks like a real one rather than
// placeholder text. Bid amounts (BID_LADDER) are entirely made up — they're
// not each template's real marketplace price, just a fixed ladder used to
// demonstrate the log-curve ranking. Thumbnails hotlink Framer's own CDN
// (mux.com / vercel-storage.com); if one of these authors ever wants their
// listing removed from this demo, swap the entry out.

export type LeaderboardEntry = {
  rank: number;
  slug: string;
  title: string;
  authorHandle: string;
  totalBidCents: number;
  score: number;
  thumbnailUrl?: string | null;
  /** Short one-line description — not set for live/sandbox-submitted
   * templates, only the built-in demo entries that have real copy to pull. */
  tagline?: string;
  /** Where to actually see/buy the template — the whole point of bidding
   * is to send traffic here, so this should always be set in practice
   * (submit requires it); optional only because older rows/paths that
   * predate this field shouldn't hard-fail on a missing value. */
  url?: string;
};

const BID_LADDER = [50000, 10000, 5000, 1000, 500, 100];

function scoreFor(cents: number) {
  return Math.log(1 + cents / 100);
}

function buildEntries(
  items: {
    slug: string;
    title: string;
    authorHandle: string;
    thumbnailUrl: string;
    tagline: string;
  }[],
): LeaderboardEntry[] {
  return items.map((item, i) => {
    const totalBidCents = BID_LADDER[i];
    return {
      rank: i + 1,
      slug: item.slug,
      title: item.title,
      authorHandle: item.authorHandle,
      totalBidCents,
      score: scoreFor(totalBidCents),
      thumbnailUrl: item.thumbnailUrl,
      tagline: item.tagline,
      // Every demo slug is the real Framer marketplace slug it was
      // scraped from, so the detail page can link straight to it.
      url: `https://www.framer.com/marketplace/templates/${item.slug}/`,
    };
  });
}

export const DEMO_LEADERBOARDS: Record<string, LeaderboardEntry[]> = {
  saas: buildEntries([
    {
      slug: "fintechx",
      title: "FintechX",
      authorHandle: "Salim from Webestica",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/media/54a3bc64-c491-4d5b-9e64-b06174a71a50/019f9461-7bdb-72be-984a-b714e9c8e5ef.jpg",
      tagline: "Finance & Fintech SaaS Template",
    },
    {
      slug: "dream-motion",
      title: "Dream Motion",
      authorHandle: "Dev Patel",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/media/14c2826b-386e-4222-bcc8-33cf2acc0f74/019fe86d-c1e4-727d-b473-6252abcb5baf.png",
      tagline: "AI Image & Video Gen Template",
    },
    {
      slug: "parley-agent",
      title: "Parley Agent",
      authorHandle: "Alex Prokhorov",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/media/b505b9dc-5fa4-42d6-ad8a-36ea114d98d6/019fb2b2-1362-70d7-8cd4-d50117fc070e.jpg",
      tagline: "AI SaaS & Startup Template",
    },
    {
      slug: "zova",
      title: "Zova",
      authorHandle: "Lunis Design",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/media/2a2c2a43-045d-4da6-bf1a-ca4b52f39be1/01a0146f-b036-70f9-82cd-58165fd3c60b.png",
      tagline: "Animated SaaS Landing Page",
    },
    {
      slug: "agentlab",
      title: "AgentLab",
      authorHandle: "Amani",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/media/002fd15f-569c-45ed-870e-354988c9191a/01a0306e-3d55-7087-a179-0b57746b96ad.png",
      tagline: "AI Agent & SaaS Template",
    },
    {
      slug: "platform",
      title: "Platform",
      authorHandle: "Tamas Bodo",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/templates/48558/platform-4YdRosaKHoKgNAI6l3cNvz3t9CFvUJ",
      tagline: "Modular SaaS & AI Landing Page",
    },
  ]),
  portfolio: buildEntries([
    {
      slug: "aerra",
      title: "Aerra",
      authorHandle: "Pawel Gola",
      thumbnailUrl:
        "https://image.mux.com/01RV2sm5mIlADL7r7gng000100gTBn1KBo98JWaJszJCDsk/thumbnail.webp",
      tagline: "Photography Portfolio Template",
    },
    {
      slug: "nudge",
      title: "Nudge",
      authorHandle: "Huehaus Studio",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/templates/61898/nudge-wdAGEa9o4Syg6QuRvWUJOoY5zy7L9q",
      tagline: "Premium Portfolio Template",
    },
    {
      slug: "tdmaxfolio",
      title: "TD_Maxfolio",
      authorHandle: "Tom D",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/templates/49975/tdmaxfolio-jZ5GHUZS8mgvBYln2TTvjMkHslAntl",
      tagline: "Personal Portfolio for Designers",
    },
    {
      slug: "vertical",
      title: "Vertical",
      authorHandle: "Tamas Bodo",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/templates/57417/vertical-jHUKj7Ubu1ETCuhg7EbPLvEKAKWpOf",
      tagline: "Editorial-Style Portfolio",
    },
    {
      slug: "mono-x",
      title: "Mōno X",
      authorHandle: "Deni from Flowmance",
      thumbnailUrl:
        "https://image.mux.com/3Sjc9mk4xe9kBbK1iQQ62GyEwXgWdgAqj5KDJoSwmW4/thumbnail.webp",
      tagline: "Multi—layout Agency Template",
    },
    {
      slug: "nolan-barret",
      title: "Nolan Barret",
      authorHandle: "ena supply",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/templates/52852/nolan-barret-BlGDsMMir4thWWh8dzh9hFOZwqXYd2",
      tagline: "Premium Portfolio Template",
    },
  ]),
  agency: buildEntries([
    {
      slug: "cohesion",
      title: "Cohesion",
      authorHandle: "Cristian Mielu",
      thumbnailUrl:
        "https://image.mux.com/tJWZKSUYLehBxqecm7oBrdfwGONVBShV02PR102vv7x9w/thumbnail.webp",
      tagline: "Dynamic Animated Portfolio",
    },
    {
      slug: "aldena",
      title: "Aldena",
      authorHandle: "Lunis Design",
      thumbnailUrl:
        "https://image.mux.com/tXHeQ3rTBE6mZIp02P6xxONN8lG1xnGb22IKtE2n1he00/thumbnail.webp",
      tagline: "Serif Brand & Editorial template",
    },
    {
      slug: "das-studio",
      title: "Das Studio",
      authorHandle: "Ava Thiery",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/templates/59961/das-studio-Euv2CmxIxCPNBAOqdDqDYz69r55UUK",
      tagline: "Professional Agency Template",
    },
    {
      slug: "fabrica",
      title: "Fabrica",
      authorHandle: "Anatolii Dmitrienko",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/media/e77c8d2c-881f-46e7-b945-68aebec62cb0/j084yk2i",
      tagline: "A refined studio website template",
    },
    {
      slug: "mondragon",
      title: "Mondragon",
      authorHandle: "Sabo Sugi",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/media/6f1fa339-e254-4bb5-a7b0-7ca6bdd8815f/01a047d0-9f38-7489-8da3-520b4f95cc82.jpg",
      tagline: "Creative Digital Agency Portfolio",
    },
    {
      slug: "spector",
      title: "Spector",
      authorHandle: "Tamas Bodo",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/templates/55318/spector-dZzr3mjyCLpn8HWhfhuGIsob69QpX9",
      tagline: "A Narrative Portfolio Template",
    },
  ]),
  ecommerce: buildEntries([
    {
      slug: "ecom",
      title: "ECOM",
      authorHandle: "Soyeb",
      thumbnailUrl:
        "https://image.mux.com/OFMQ3Yy7xXPWM01bqQmp00OX4vj8arVZE1huuSzRvzPYc/thumbnail.webp",
      tagline: "Free Ecommerce Fashion Template",
    },
    {
      slug: "av-lor",
      title: "Avélor",
      authorHandle: "Snowy Atiq",
      thumbnailUrl:
        "https://image.mux.com/Nov2F2JJjHtXI8DSIn5A7HGRcPNoSGqjWsJt87N00XmU/thumbnail.webp",
      tagline: "A Multi-Product Ecommerce Template",
    },
    {
      slug: "valen-ecom",
      title: "VALEN ECOM",
      authorHandle: "FrameSpace",
      thumbnailUrl:
        "https://image.mux.com/RNoUCDM5102cs1jJUZ4q00ofiMRrszB6z9i9lHgonrTHc/thumbnail.webp",
      tagline: "Online store connected to shopify",
    },
    {
      slug: "celesse",
      title: "Celesse",
      authorHandle: "DiverseKit",
      thumbnailUrl:
        "https://image.mux.com/hL01qYcOQrbISM69bzXFIvTU58ocmM01BGBKHN8U00RRsw/thumbnail.webp",
      tagline: "Jewelry E-commerce Framer Template",
    },
    {
      slug: "all-natural",
      title: "All Natural™",
      authorHandle: "ena supply",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/templates/51869/all-natural-mJmDWUJaBBZ9ufOJTjSfAfDBZ7i3Y3",
      tagline: "Premium E-Commerce Template",
    },
    {
      slug: "krona",
      title: "Krona",
      authorHandle: "Shreetech",
      thumbnailUrl:
        "https://image.mux.com/tqCrb5iy5eL8Aer7UTud01dNwoeMEx92ELLFYxORt0078/thumbnail.webp",
      tagline: "Sports & Outdoor Gear Store",
    },
  ]),
  "landing-waitlist": buildEntries([
    {
      slug: "waitlistkit",
      title: "WaitlistKit",
      authorHandle: "Stacy More",
      thumbnailUrl:
        "https://image.mux.com/Ib01SvTZuVpJIo7W9u00pJtD00cTmPVVoq2VxZ5loe1cCc/thumbnail.webp",
      tagline: "Waitlist Framer template for SaaS",
    },
    {
      slug: "okta-studio",
      title: "Okta Studio",
      authorHandle: "Mr. Frame",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/media/fc522000-8e41-4a7d-8465-71455de6f944/019ffbe5-2deb-737a-8d3e-4ace8d78ffbf.png",
      tagline: "Creative Studio & Portfolio",
    },
    {
      slug: "hedvig",
      title: "Hedvig",
      authorHandle: "Felix Clausen",
      thumbnailUrl:
        "https://image.mux.com/cPjl58iJs94Z58PG8oB1KSk8Rhx5da35oXXlIc0234Zo/thumbnail.webp",
      tagline: "Waitlist & Digital Products",
    },
    {
      slug: "comolio",
      title: "Comolio",
      authorHandle: "Abhilash Mahanta",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/media/00697ebb-ecb8-4759-b07b-101beea6c71a/01a018de-80b7-73a8-b166-d4bdb081073d.jpg",
      tagline: "Coming Soon Template",
    },
    {
      slug: "pillo",
      title: "Pillo",
      authorHandle: "Alex Prokhorov",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/media/b505b9dc-5fa4-42d6-ad8a-36ea114d98d6/01a03d6d-d872-717e-aca6-b40903eccfa9.jpg",
      tagline: "Cinematic app landing page",
    },
    {
      slug: "recall-waitlist",
      title: "Recall - Waitlist",
      authorHandle: "Hani",
      thumbnailUrl:
        "https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/media/8b5b6411-55a5-4287-9ff6-6879c6a5dd3f/01a0040c-83b5-7030-9a5d-fa5947a5e6ab.png",
      tagline: "Screenshots in. Waitlist out.",
    },
  ]),
};
