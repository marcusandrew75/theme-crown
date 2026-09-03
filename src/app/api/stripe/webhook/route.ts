import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Fulfillment happens here, not in the Server Action that creates the
 * Checkout Session — a bid is only ever recorded once Stripe confirms the
 * payment actually went through, using the admin client since there's no
 * user session in a webhook. template_id/user_id come from the session's
 * metadata; everything else (category, current round) is re-derived from
 * the database rather than trusted from the client at checkout time.
 */
export async function POST(request: NextRequest) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const templateId = session.metadata?.template_id;
  const userId = session.metadata?.user_id;
  const amountCents = session.amount_total;

  if (!templateId || !userId || !amountCents) {
    return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: template } = await supabase
    .from("templates")
    .select("category_id")
    .eq("id", templateId)
    .maybeSingle();

  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const { data: roundId, error: roundError } = await supabase.rpc(
    "ensure_current_round",
    { p_category_id: template.category_id },
  );

  if (roundError || !roundId) {
    return NextResponse.json({ error: "Could not resolve round" }, { status: 500 });
  }

  const { error: insertError } = await supabase.from("bids").insert({
    template_id: templateId,
    round_id: roundId,
    user_id: userId,
    amount_cents: amountCents,
    stripe_payment_id: session.id,
  });

  // stripe_payment_id is unique — a retried delivery of the same event
  // just no-ops on the second attempt instead of double-counting the bid.
  if (insertError && insertError.code !== "23505") {
    return NextResponse.json({ error: "Could not record bid" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
