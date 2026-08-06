import { createClient } from "@supabase/supabase-js";

const supabaseurl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

if (!supabaseurl || !supabaseAnonKey) {
  throw new Error(
    "Missing supabase env vars. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY to your .env file",
  );
}

export function createClerkSupabaseClient(
  getToken: () => Promise<string | null>,
) {
  return createClient(supabaseurl, supabaseAnonKey, {
    async accessToken() {
      return getToken();
    },
  });
}
