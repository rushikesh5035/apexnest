import BudgetModal from "@/components/common/budget-modal";
import AiInsightCard from "@/components/tabs/home/ai-insight-card";
import BalanceCard from "@/components/tabs/home/balance-card";
import HomeHeader from "@/components/tabs/home/home-header";
import MonthlyTotals from "@/components/tabs/home/monthly-totals";
import RecentActivity from "@/components/tabs/home/recent-activity";
import { useAccountsQuery } from "@/hooks/queries/useAccountsQuery";
import { useBudgetQuery } from "@/hooks/queries/useBudgetQuery";
import { useTransactionsQuery } from "@/hooks/queries/useTransactionsQuery";
import { formatPrice } from "@/lib/utils";
import { useUser } from "@clerk/expo";
import { isSameMonth } from "date-fns";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [budgetModalOpen, setBudgetModalOpen] = useState(false);

  const {
    data: accounts = [],
    isLoading: accountLoading,
    isError: accountError,
    isRefetching: accountRefetching,
    refetch: refetchAccounts,
  } = useAccountsQuery();

  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    isError: transactionError,
    isRefetching: transactionsRefetching,
    refetch: refetchTransactions,
  } = useTransactionsQuery();

  const {
    data: budget = null,
    isError: budgetError,
    isLoading: budgetLoading,
    refetch: refetchBudget,
  } = useBudgetQuery();

  const loading = accountLoading || transactionsLoading;
  const refreshing = accountRefetching || transactionsRefetching;

  const onRefresh = () => {
    refetchAccounts();
    refetchTransactions();
    refetchBudget();
  };

  const totalBalance = useMemo(
    () => accounts.reduce((sum, account) => sum + account.balance, 0),
    [accounts],
  );

  const monthTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((tx) => isSameMonth(new Date(tx.date), now));
  }, [transactions]);

  const monthIncome = useMemo(
    () =>
      monthTransactions
        .filter((tx) => tx.type === "INCOME")
        .reduce((sum, tx) => sum + tx.amount, 0),
    [monthTransactions],
  );

  const monthExpense = useMemo(
    () =>
      monthTransactions
        .filter((tx) => tx.type === "EXPENSE")
        .reduce((sum, tx) => sum + tx.amount, 0),
    [monthTransactions],
  );

  const totalsUnavailable = transactionsLoading || transactionError;
  const openTransactions = () => router.push("/(root)/(tabs)/transactions");

  const unavailable = accountError || transactionError || budgetError;
  const balance =
    accountLoading || accountError ? "—" : formatPrice(totalBalance);

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-fynlo-canvas"
    >
      <StatusBar style="light" />
      <View className="flex-1 px-4 pt-3">
        <HomeHeader
          firstName={user?.firstName}
          avatarUrl={user?.hasImage ? user.imageUrl : undefined}
          budgetDisabled={budgetError || budgetLoading}
          onProfile={() => router.push("/(root)/(tabs)/profile")}
          onSearch={openTransactions}
          onBudget={() => setBudgetModalOpen(true)}
        />
        <BalanceCard
          balance={balance}
          monthIncome={monthIncome}
          monthExpense={monthExpense}
          totalsUnavailable={totalsUnavailable}
          onTransactions={openTransactions}
          onAction={(action) =>
            router.push({
              pathname: "/(root)/(tabs)/add-transaction",
              params: { action },
            })
          }
        />
        <MonthlyTotals
          monthIncome={monthIncome}
          monthExpense={monthExpense}
          totalsUnavailable={totalsUnavailable}
        />
        <AiInsightCard
          onPress={() => router.push("/(root)/(tabs)/assistant")}
        />
        <RecentActivity
          transactions={transactions}
          loading={loading}
          transactionError={transactionError}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onSeeAll={openTransactions}
        />
        {unavailable && (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={onRefresh}
            className="mt-5 py-3"
          >
            <Text className="font-poppins-medium text-fynlo-label text-fynlo-primary">
              Some details couldn’t load. Tap to retry.
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {user && (
        <BudgetModal
          visible={budgetModalOpen}
          budget={budget}
          onClose={() => setBudgetModalOpen(false)}
          onSaved={() => setBudgetModalOpen(false)}
        />
      )}
    </SafeAreaView>
  );
}
