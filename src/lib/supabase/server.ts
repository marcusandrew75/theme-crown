import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * Supabase client for Server Components, Route Handlers, and Server
 * Actions — reads the user's session from request cookies, so queries run
 * as that user and are subject to RLS. Create a new client per request;
 * never share one across requests.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component render, which can't set
            // cookies. Harmless as long as a proxy/middleware also
            // refreshes the session — see supabase/README.md.
          }
        },
      },
    },
  );
}
