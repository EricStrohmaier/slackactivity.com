// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context

import { Database } from "@/types/supabase_generated";
import { createClient } from "@supabase/supabase-js";

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
// as it has admin privileges and overwrites RLS policies!
export const supabaseAdmin = () =>
  createClient<Database>(supabase_url, service_role_key);

const supabase = createClient(supabase_url, service_role_key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Access auth admin api
const adminAuthClient = supabase.auth.admin;
