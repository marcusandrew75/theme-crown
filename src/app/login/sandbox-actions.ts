"use server";

import { redirect } from "next/navigation";
import { setActivePersona } from "@/lib/demo-sandbox";

export async function chooseSandboxPersona(formData: FormData) {
  const personaId = String(formData.get("personaId") ?? "");
  const next = String(formData.get("next") ?? "/submit");

  if (personaId) {
    await setActivePersona(personaId);
  }

  redirect(next);
}
