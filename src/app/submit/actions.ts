"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { categoryBySlug } from "@/lib/categories";
import { isSupabaseConfigured } from "@/lib/auth";
import { addSandboxTemplate } from "@/lib/demo-sandbox";

export type SubmitState = { error?: string } | undefined;

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 6);
}

export async function submitTemplate(
  _prevState: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const title = String(formData.get("title") ?? "").trim();
  const categorySlug = String(formData.get("category") ?? "");
  const url = String(formData.get("url") ?? "").trim();
  const thumbnailUrl = String(formData.get("thumbnail_url") ?? "").trim();
  const confirmed = formData.get("confirm") === "on";

  if (title.length < 2) {
    return { error: "Give your template a title." };
  }
  const category = categoryBySlug(categorySlug);
  if (!category) {
    return { error: "Choose a category." };
  }
  if (!/^https?:\/\//.test(url)) {
    return { error: "The link needs to start with http:// or https://." };
  }
  if (!confirmed) {
    return { error: "Confirm you own this template's listing." };
  }

  if (!isSupabaseConfigured()) {
    const result = await addSandboxTemplate({
      title,
      categorySlug: category.slug,
      url,
      thumbnailUrl: thumbnailUrl || null,
    });
    if ("error" in result) return { error: result.error };
    redirect(`/t/${result.slug}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to sign in first." };
  }

  const { data: categoryRow, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", category.slug)
    .single();

  if (categoryError || !categoryRow) {
    return { error: "That category isn't available right now." };
  }

  const baseSlug = slugify(title) || "template";
  let slug = baseSlug;

  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: inserted, error: insertError } = await supabase
      .from("templates")
      .insert({
        author_id: user.id,
        category_id: categoryRow.id,
        slug,
        title,
        url,
        thumbnail_url: thumbnailUrl || null,
      })
      .select("slug")
      .single();

    if (!insertError && inserted) {
      redirect(`/t/${inserted.slug}`);
    }

    // Unique-violation on the slug — try again with a short random suffix.
    if (insertError?.code === "23505") {
      slug = `${baseSlug}-${randomSuffix()}`;
      continue;
    }

    return { error: "Something went wrong listing your template. Try again." };
  }

  return {
    error: "That title collides with an existing one — try something more specific.",
  };
}
