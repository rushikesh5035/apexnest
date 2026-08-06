import { SupabaseClient } from "@supabase/supabase-js";

export type AccountType = "CASH" | "BANK" | "CREDIT_CARD" | "SAVINGs";

export type Account = {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  balance: number;
  is_default: boolean;
  created_at: string;
};

// get all accounts for a specific user
export async function getAccounts(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data as Account[];
}
