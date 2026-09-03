"use client";

import { signOut } from "@/app/login/actions";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="shrink-0 whitespace-nowrap text-[13px] text-[var(--ink-faint)] hover:text-[var(--ink)]"
    >
      Sign out
    </button>
  );
}
