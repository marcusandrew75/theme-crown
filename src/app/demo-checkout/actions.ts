"use server";

import { redirect } from "next/navigation";
import { addSandboxBid } from "@/lib/demo-sandbox";

export async function confirmDemoPayment(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const amountCents = Number.parseInt(String(formData.get("amount_cents") ?? ""), 10);

  if (!slug) redirect("/");

  const result = await addSandboxBid(slug, amountCents);
  if (result.error) {
    redirect(`/t/${slug}?bid=cancelled`);
  }

  redirect(`/t/${slug}?bid=success`);
}
