import { TransactionFilters } from "../services/transactions";

export const querykeys = {
  // this will cache's the data for a specific user and their filters to avoid refetching the same data multiple times
  onboarding: (userId?: string) => ["onboarding", userId] as const,

  accounts: (userId?: string) => ["accounts", userId] as const,

  transactions: (userId?: string, filters: TransactionFilters = {}) =>
    ["transactions", userId, filters] as const,

  budget: (userId?: string) => ["budgets", userId] as const,
};
