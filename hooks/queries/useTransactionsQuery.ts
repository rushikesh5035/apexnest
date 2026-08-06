import { querykeys } from "@/lib/query/keys";
import {
  getTransactions,
  TransactionFilters,
} from "@/lib/services/transactions";
import { useUser } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "../useSupabase";

export function useTransactionsQuery(filters: TransactionFilters = {}) {
  const { user } = useUser();
  const supabase = useSupabase();

  return useQuery({
    queryKey: querykeys.transactions(user?.id, filters),
    queryFn: () => getTransactions(supabase, user!.id, filters),
    enabled: !!user, // only run the query if the user is logged in
  });
}
