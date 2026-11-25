import TransactionFilters, {
  type TypeFilter,
} from "@/components/tabs/transactions/transaction-filters";
import TransactionLedger from "@/components/tabs/transactions/transaction-ledger";
import TransactionToolbar from "@/components/tabs/transactions/transaction-toolbar";
import { getCategoryConfig } from "@/constants/categories";
import { useDeleteTransaction } from "@/hooks/mutations/useTransactionMutation";
import { useAccountsQuery } from "@/hooks/queries/useAccountsQuery";
import { useTransactionsQuery } from "@/hooks/queries/useTransactionsQuery";
import { Transaction, TransactionType } from "@/lib/services/transactions";
import { exportTransactionsToCsv } from "@/lib/utils/exportTransactions";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Transactions() {
  const [activeFilter, setActiveFilter] = useState<TypeFilter>("All");
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);

  const router = useRouter();

  const typeFilter: TransactionType | null =
    activeFilter === "Income"
      ? "INCOME"
      : activeFilter === "Expense"
        ? "EXPENSE"
        : null;

  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    isRefetching: transactionsRefetching,
    isError: transactionsError,
    refetch: refetchTransactions,
  } = useTransactionsQuery({
    type: typeFilter,
    accountId: activeAccountId,
  });

  const { data: accounts = [], refetch: refetchAccounts } = useAccountsQuery();

  const { mutateAsync: removeTransaction } = useDeleteTransaction();

  const loading = transactionsLoading;
  const refreshing = transactionsRefetching;
  const error = transactionsError;

  // function to refetch transactions and accounts details
  const loadData = () => {
    refetchTransactions();
    refetchAccounts();
  };

  const filteredTransactions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter(
      (tx) =>
        tx.description?.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        getCategoryConfig(tx.category).label.toLowerCase().includes(q),
    );
  }, [transactions, search]);

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const { count } = await exportTransactionsToCsv(transactions);
      if (count === 0) {
        Alert.alert(
          "Nothing to export",
          "No transactions in the export window.",
        );
      }
    } catch (err) {
      console.error("Export failed:", err);
      Alert.alert("Error", "Couldn't export transactions.");
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = (tx: Transaction) => {
    Alert.alert(
      "Delete transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error: deleteError } = await removeTransaction(tx);
            if (deleteError) {
              Alert.alert("Error", "Couldn't delete this transaction.");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      className="flex-1 bg-fynlo-canvas"
      edges={["top", "left", "right"]}
    >
      <StatusBar style="light" />
      <TransactionToolbar
        exporting={exporting}
        onExport={handleExport}
        onAdd={() => router.push("/(root)/(tabs)/add-transaction")}
      />
      <TransactionLedger
        transactions={transactions}
        results={filteredTransactions}
        filtered={
          !!search.trim() || activeFilter !== "All" || activeAccountId !== null
        }
        loading={loading}
        error={error}
        refreshing={refreshing}
        onRefresh={loadData}
        onDelete={handleDelete}
        filters={
          <TransactionFilters
            search={search}
            onSearch={setSearch}
            type={activeFilter}
            onType={setActiveFilter}
            accountId={activeAccountId}
            onAccount={setActiveAccountId}
            accounts={accounts}
          />
        }
      />
    </SafeAreaView>
  );
}
