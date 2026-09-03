"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { isSupabaseConfigured } from "@/lib/auth";
import { getActivePersona } from "@/lib/demo-sandbox";

export type BidState = { error?: string } | undefined;

async function getOrigin() {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}`;
}

export async function createBidCheckout(
  _prevState: BidState,
  formData: FormData,
): Promise<BidState> {
  const slug = String(formData.get("slug") ?? "");
  const amountCents = Number.parseInt(String(formData.get("amount_cents") ?? ""), 10);

  if (!Number.isFinite(amountCents) || amountCents < 100) {
    return { error: "Minimum bid is $1." };
  }
  if (amountCents > 100_000) {
    return {
      error: "That's more than we can take in one bid — try under $1,000.",
    };
  }

  if (!isSupabaseConfigured()) {
    const persona = await getActivePersona();
    if (!persona) {
      return { error: "Pick a dummy user first." };
    }
    redirect(
      `/demo-checkout?slug=${encodeURIComponent(slug)}&amount=${amountCents}`,
    );
  }

  if (!isStripeConfigured()) {
    return { error: "Bidding isn't live yet — Stripe isn't connected." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You need to sign in first." };
  }

  const { data: template, error: templateError } = await supabase
    .from("templates")
    .select("id, title")
    .eq("slug", slug)
    .single();

  if (templateError || !template) {
    return { error: "Couldn't find that template." };
  }

  const origin = await getOrigin();
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
          product_data: {
            name: `Bid on ${template.title}`,
          },
        },
        quantity: 1,
      },
    ],
    // The webhook re-derives everything else (category, current round) from
    // template_id at fulfillment time — this is deliberately the only
    // source of truth passed through checkout.
    metadata: {
      template_id: template.id,
      user_id: user.id,
    },
    success_url: `${origin}/t/${slug}?bid=success`,
    cancel_url: `${origin}/t/${slug}?bid=cancelled`,
  });

  if (!session.url) {
    return { error: "Couldn't start checkout. Try again." };
  }

  redirect(session.url);
}
