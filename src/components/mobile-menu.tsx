"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { Category } from "@/lib/categories";

export function MobileMenu({
  categories,
  authSlot,
}: {
  categories: Category[];
  authSlot: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative sm:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="-mr-2 flex h-9 w-9 items-center justify-center text-[var(--ink)]"
      >
        {open ? (
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M4 4l12 12M16 4L4 16" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M3 5h14M3 10h14M3 15h14" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div
            className="absolute top-full right-0 z-20 mt-2 w-60 rounded-2xl bg-[var(--surface-raised)] p-2 shadow-[var(--shadow-lg)]"
            onClick={() => setOpen(false)}
          >
            <div className="flex flex-col">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/leaderboard/${category.slug}`}
                  className="rounded-xl px-3 py-2 text-[14px] font-medium text-[var(--ink-soft)] hover:bg-[var(--surface-sunken)] hover:text-[var(--ink)]"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="my-2 h-px bg-[var(--surface-sunken)]" />
            <Link
              href="/submit"
              className="block rounded-xl px-3 py-2 text-[14px] font-medium text-[var(--ink)] hover:bg-[var(--surface-sunken)]"
            >
              Submit
            </Link>
            <div className="rounded-xl px-3 py-2 text-[14px]">{authSlot}</div>
          </div>
        </>
      )}
    </div>
  );
}
