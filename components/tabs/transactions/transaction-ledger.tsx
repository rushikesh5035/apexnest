import TransactionRow from "@/components/tabs/home/transaction-row";
import CashFlowChart from "@/components/tabs/transactions/cash-flow-chart";
import { FYNLO_COLORS as colors } from "@/constants/theme";
import type { Transaction } from "@/lib/services/transactions";
import type { ReactElement } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

type Props = {
  transactions: Transaction[];
  results: Transaction[];
  filters: ReactElement;
  filtered: boolean;
  loading: boolean;
  error: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onDelete: (transaction: Transaction) => void;
};

export default function TransactionLedger({
  transactions,
  results,
  filters,
  filtered,
  loading,
  error,
  refreshing,
  onRefresh,
  onDelete,
}: Props) {
  const ready = !loading && !error;
  return (
    <FlatList
      data={ready ? results : []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TransactionRow tx={item} onDelete={() => onDelete(item)} />
      )}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
          progressBackgroundColor={colors.surface}
        />
      }
      ListHeaderComponent={
        <View className="gap-3">
          {filters}
          {ready && transactions.length > 0 && (
            <CashFlowChart transactions={transactions} />
          )}
          {ready && results.length > 0 && (
            <View className="flex-row items-baseline justify-between pt-2">
              <Text
                accessibilityRole="header"
                className="font-poppins-semibold text-fynlo-title text-fynlo-text-primary"
              >
                Activity
              </Text>
              <Text className="font-poppins-regular text-fynlo-caption text-fynlo-text-secondary">
                {results.length} {results.length === 1 ? "entry" : "entries"}
              </Text>
            </View>
          )}
        </View>
      }
      ListEmptyComponent={
        <View className="items-center gap-3 py-12">
          {loading ? (
            <ActivityIndicator
              size={27}
              accessibilityLabel="Loading transactions"
              color={colors.primary}
            />
          ) : (
            <>
              <Text className="text-center font-poppins-medium text-fynlo-body text-fynlo-text-primary">
                {error
                  ? "Couldn’t load transactions."
                  : filtered
                    ? "No matching transactions"
                    : "No transactions yet"}
              </Text>
              {error && (
                <Pressable
                  accessibilityRole="button"
                  onPress={onRefresh}
                  className="min-h-12 justify-center rounded-full bg-fynlo-primary px-5"
                >
                  <Text className="font-poppins-medium text-fynlo-label text-fynlo-on-primary">
                    Try again
                  </Text>
                </Pressable>
              )}
            </>
          )}
        </View>
      }
    />
  );
}
