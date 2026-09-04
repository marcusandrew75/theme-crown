// Mirrors supabase/seed.sql exactly — the five launch categories.

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  /** Framer's own marketplace category slug, used only by the
   * marketplace-pulse snapshot collector to know which public Framer page
   * to fetch. Null when there's no direct match in Framer's actual
   * taxonomy (checked live — Framer has no landing/waitlist category) —
   * that category is skipped by the collector rather than mapped to a
   * mismatched proxy, which would misrepresent the data. */
  framerCategorySlug: string | null;
};

export const CATEGORIES: Category[] = [
  { slug: "saas", name: "SaaS", tagline: "landing & product", framerCategorySlug: "saas" },
  { slug: "portfolio", name: "Portfolio", tagline: "personal & creative", framerCategorySlug: "portfolio" },
  { slug: "agency", name: "Agency", tagline: "studio & consultancy", framerCategorySlug: "agency" },
  { slug: "ecommerce", name: "E-commerce", tagline: "storefront", framerCategorySlug: "ecommerce" },
  { slug: "landing-waitlist", name: "Landing / Waitlist", tagline: "pre-launch", framerCategorySlug: null },
];

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
