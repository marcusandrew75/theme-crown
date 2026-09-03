import "server-only";

import { cookies } from "next/headers";
import { categoryBySlug } from "@/lib/categories";
import { DEMO_LEADERBOARDS, type LeaderboardEntry } from "@/lib/demo-data";

/**
 * A self-contained "try it yourself" mode used only while Supabase isn't
 * configured — lets a visitor pick a dummy persona, submit a template, and
 * place bids, all stored in one browser cookie and scored with the exact
 * same log-curve formula the real ranking function uses. Nothing here is
 * shared across visitors or persisted anywhere real; it exists purely so
 * the core loop (submit → bid → rank) can be clicked through before a
 * real project is linked. Every entry point (getLeaderboard,
 * getTemplateBySlug, submitTemplate, createBidCheckout) already branches
 * on isSupabaseConfigured()/isStripeConfigured(), so this stops being used
 * automatically the moment real credentials are added — nothing to rip out.
 */

const COOKIE_NAME = "tc_sandbox";

export type SandboxPersona = { id: string; name: string; handle: string };

export const SANDBOX_PERSONAS: SandboxPersona[] = [
  { id: "alex", name: "Alex", handle: "@alexbuilds" },
  { id: "sam", name: "Sam", handle: "@samcodes" },
  { id: "jordan", name: "Jordan", handle: "@jordandraws" },
  { id: "river", name: "River", handle: "@rivermakes" },
];

type SandboxTemplate = {
  slug: string;
  title: string;
  categorySlug: string;
  authorHandle: string;
  thumbnailUrl: string | null;
};

type SandboxBid = {
  templateSlug: string;
  amountCents: number;
};

type SandboxState = {
  activePersonaId: string | null;
  templates: SandboxTemplate[];
  bids: SandboxBid[];
};

const EMPTY_STATE: SandboxState = {
  activePersonaId: null,
  templates: [],
  bids: [],
};

async function getSandboxState(): Promise<SandboxState> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return EMPTY_STATE;

  try {
    const parsed = JSON.parse(raw);
    return {
      activePersonaId:
        typeof parsed.activePersonaId === "string" ? parsed.activePersonaId : null,
      templates: Array.isArray(parsed.templates) ? parsed.templates : [],
      bids: Array.isArray(parsed.bids) ? parsed.bids : [],
    };
  } catch {
    return EMPTY_STATE;
  }
}

async function saveSandboxState(state: SandboxState) {
  const store = await cookies();
  store.set(COOKIE_NAME, JSON.stringify(state), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });
}

export async function getActivePersona(): Promise<SandboxPersona | null> {
  const state = await getSandboxState();
  if (!state.activePersonaId) return null;
  return SANDBOX_PERSONAS.find((p) => p.id === state.activePersonaId) ?? null;
}

export async function setActivePersona(personaId: string) {
  const state = await getSandboxState();
  await saveSandboxState({ ...state, activePersonaId: personaId });
}

function allKnownSlugs(state: SandboxState): Set<string> {
  const slugs = new Set<string>();
  for (const entries of Object.values(DEMO_LEADERBOARDS)) {
    for (const entry of entries) slugs.add(entry.slug);
  }
  for (const template of state.templates) slugs.add(template.slug);
  return slugs;
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function addSandboxTemplate(input: {
  title: string;
  categorySlug: string;
  url: string;
  thumbnailUrl: string | null;
}): Promise<{ slug: string } | { error: string }> {
  const persona = await getActivePersona();
  if (!persona) return { error: "Pick a dummy user first." };
  if (!categoryBySlug(input.categorySlug)) return { error: "Choose a category." };
  if (input.title.trim().length < 2) return { error: "Give your template a title." };
  if (!/^https?:\/\//.test(input.url)) {
    return { error: "The link needs to start with http:// or https://." };
  }

  const state = await getSandboxState();
  const taken = allKnownSlugs(state);
  const base = slugify(input.title) || "template";
  let slug = base;
  let attempt = 0;
  while (taken.has(slug) && attempt < 5) {
    attempt += 1;
    slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }
  if (taken.has(slug)) {
    return { error: "That title collides with an existing one — try another." };
  }

  const template: SandboxTemplate = {
    slug,
    title: input.title,
    categorySlug: input.categorySlug,
    authorHandle: persona.handle,
    thumbnailUrl: input.thumbnailUrl,
  };

  await saveSandboxState({ ...state, templates: [...state.templates, template] });
  return { slug };
}

export async function addSandboxBid(
  templateSlug: string,
  amountCents: number,
): Promise<{ error?: string }> {
  const persona = await getActivePersona();
  if (!persona) return { error: "Pick a dummy user first." };
  if (!Number.isFinite(amountCents) || amountCents < 100) {
    return { error: "Minimum bid is $1." };
  }

  const state = await getSandboxState();
  await saveSandboxState({
    ...state,
    bids: [...state.bids, { templateSlug, amountCents }],
  });
  return {};
}

function scoreAndRank(
  entries: {
    slug: string;
    title: string;
    authorHandle: string;
    thumbnailUrl: string | null;
    totalBidCents: number;
  }[],
): LeaderboardEntry[] {
  const scored = entries.map((entry) => ({
    ...entry,
    score: Math.log(1 + entry.totalBidCents / 100),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export async function getSandboxLeaderboard(
  categorySlug: string,
): Promise<LeaderboardEntry[]> {
  const state = await getSandboxState();

  const bidTotals = new Map<string, number>();
  for (const bid of state.bids) {
    bidTotals.set(
      bid.templateSlug,
      (bidTotals.get(bid.templateSlug) ?? 0) + bid.amountCents,
    );
  }

  const base = (DEMO_LEADERBOARDS[categorySlug] ?? []).map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    authorHandle: entry.authorHandle,
    thumbnailUrl: entry.thumbnailUrl ?? null,
    totalBidCents: entry.totalBidCents + (bidTotals.get(entry.slug) ?? 0),
  }));

  const submitted = state.templates
    .filter((template) => template.categorySlug === categorySlug)
    .map((template) => ({
      slug: template.slug,
      title: template.title,
      authorHandle: template.authorHandle,
      thumbnailUrl: template.thumbnailUrl,
      totalBidCents: bidTotals.get(template.slug) ?? 0,
    }));

  return scoreAndRank([...base, ...submitted]);
}

export async function findSandboxEntry(
  slug: string,
): Promise<{ entry: LeaderboardEntry; categorySlug: string } | null> {
  const state = await getSandboxState();

  const submitted = state.templates.find((template) => template.slug === slug);
  const categorySlug = submitted
    ? submitted.categorySlug
    : Object.entries(DEMO_LEADERBOARDS).find(([, entries]) =>
        entries.some((entry) => entry.slug === slug),
      )?.[0];

  if (!categorySlug) return null;

  const entries = await getSandboxLeaderboard(categorySlug);
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) return null;

  return { entry, categorySlug };
}
