import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Privileged Supabase client using the service role key — bypasses RLS
 * entirely. There is no user session here, so nothing scopes `user_id` for
 * you: only use this where the caller has already been verified some other
 * way (e.g. a Stripe webhook handler that checked the event signature and
 * reads the intended user/template/amount from the Checkout Session's
 * metadata, then inserts the bid itself).
 *
 * Never import this into a Client Component — the `server-only` import
 * above makes that a build error, not just a runtime leak.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
