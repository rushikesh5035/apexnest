import { TransactionFilters } from "../services/transactions";

export const querykeys = {
  // this will cache's the data for a specific user and their filters to avoid refetching the same data multiple times
  accounts: (userId?: string) => ["accounts", userId] as const,

  transactions: (userId?: string, filters: TransactionFilters = {}) =>
    ["transactions", userId, filters] as const,

  budget: (userId?: string) => ["budgets", userId] as const,
};
