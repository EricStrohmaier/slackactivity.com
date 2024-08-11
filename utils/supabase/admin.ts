// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context

import { Database } from "@/types/supabase_generated";
import { createBrowserClient } from "@supabase/ssr";

// as it has admin privileges and overwrites RLS policies!
export const supabaseAdmin = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
