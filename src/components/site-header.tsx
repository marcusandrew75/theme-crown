import Link from "next/link";
import { FoxMascot } from "./fox-mascot";
import { MobileMenu } from "./mobile-menu";
import { SignOutButton } from "./sign-out-button";
import { CATEGORIES } from "@/lib/categories";
import { getCurrentUser, isSupabaseConfigured } from "@/lib/auth";
import { getActivePersona } from "@/lib/demo-sandbox";

export async function SiteHeader() {
  const configured = isSupabaseConfigured();
  const user = configured ? await getCurrentUser() : null;
  const persona = configured ? null : await getActivePersona();

  const authSlot = configured ? (
    user ? (
      <SignOutButton />
    ) : (
      <Link
        href="/login"
        className="whitespace-nowrap text-[13px] text-[var(--ink-faint)] hover:text-[var(--ink)]"
      >
        Sign in
      </Link>
    )
  ) : persona ? (
    <Link
      href="/login"
      className="whitespace-nowrap text-[13px] text-[var(--ink-faint)] hover:text-[var(--ink)]"
      title="Switch dummy user"
    >
      {persona.name} · Switch
    </Link>
  ) : (
    <Link
      href="/login"
      className="whitespace-nowrap text-[13px] text-[var(--ink-faint)] hover:text-[var(--ink)]"
    >
      Sign in
    </Link>
  );

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1160px] items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-[family-name:var(--font-display)] text-[17px] font-semibold tracking-tight"
        >
          <FoxMascot className="h-7 w-7" />
          ThemeCrown
        </Link>

        <nav
          aria-label="Categories"
          className="no-scrollbar hidden min-w-0 flex-1 items-center gap-1.5 overflow-x-auto sm:flex"
        >
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/leaderboard/${category.slug}`}
              className="shrink-0 whitespace-nowrap rounded-[3px] border border-transparent px-3 py-2 text-[13.5px] font-medium text-[var(--ink-soft)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 sm:flex">
          <Link
            href="/submit"
            className="whitespace-nowrap text-[13.5px] font-medium text-[var(--ink)] hover:text-[var(--accent-deep)]"
          >
            Submit
          </Link>
          {authSlot}
        </div>

        <div className="ml-auto sm:hidden">
          <MobileMenu categories={CATEGORIES} authSlot={authSlot} />
        </div>
      </div>
    </header>
  );
}
