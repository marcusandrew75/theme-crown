// Mirrors supabase/seed.sql exactly — the five launch categories.

export type Category = {
  slug: string;
  name: string;
  tagline: string;
};

export const CATEGORIES: Category[] = [
  { slug: "saas", name: "SaaS", tagline: "landing & product" },
  { slug: "portfolio", name: "Portfolio", tagline: "personal & creative" },
  { slug: "agency", name: "Agency", tagline: "studio & consultancy" },
  { slug: "ecommerce", name: "E-commerce", tagline: "storefront" },
  { slug: "landing-waitlist", name: "Landing / Waitlist", tagline: "pre-launch" },
];

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
