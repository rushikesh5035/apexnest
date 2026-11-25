import { FYNLO_COLORS as colors } from "@/constants/theme";
import type { Transaction } from "@/lib/services/transactions";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TransactionRow from "./transaction-row";

type RecentActivityProps = {
  transactions: Transaction[];
  loading: boolean;
  transactionError: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onSeeAll: () => void;
};

export default function RecentActivity({
  transactions,
  loading,
  transactionError,
  refreshing,
  onRefresh,
  onSeeAll,
}: RecentActivityProps) {
  const recentTransactions = useMemo(
    () =>
      [...transactions].sort(
        (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
      ),
    [transactions],
  );

  const listMetrics = useRef({ viewport: 0, content: 0, offset: 0 });
  const [showFade, setShowFade] = useState(false);
  function updateFade(metrics: Partial<typeof listMetrics.current>) {
    Object.assign(listMetrics.current, metrics);
    const { content, viewport, offset } = listMetrics.current;
    setShowFade(viewport > 0 && content - viewport - Math.max(0, offset) > 1);
  }

  return (
    <View className="mt-5 flex-1 gap-2 overflow-hidden rounded-3xl bg-fynlo-surface px-4">
      <View className="h-1 w-10 self-center rounded-full bg-fynlo-border mt-2" />
      <View className="min-h-12 flex-row items-center justify-between gap-2">
        <Text
          accessibilityRole="header"
          className="flex-1 font-poppins-semibold text-fynlo-title text-fynlo-text-primary"
        >
          Recent activity
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="See all transactions"
          onPress={onSeeAll}
          className="min-h-12 justify-center"
        >
          <Text className="font-poppins-medium text-fynlo-caption text-fynlo-text-secondary">
            See all
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1">
        <FlatList
          data={recentTransactions}
          keyExtractor={(tx) => tx.id}
          renderItem={({ item }) => (
            <TransactionRow tx={item} appearance="home" />
          )}
          contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          onLayout={(event) =>
            updateFade({ viewport: event.nativeEvent.layout.height })
          }
          onContentSizeChange={(_, height) => updateFade({ content: height })}
          onScroll={({ nativeEvent }) =>
            updateFade({ offset: nativeEvent.contentOffset.y })
          }
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
              progressBackgroundColor={colors.surface}
            />
          }
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator size={27} color={colors.primary} />
            ) : transactionError ? null : (
              <Text className="py-2 font-poppins-regular text-fynlo-body text-fynlo-text-secondary">
                No transactions yet.
              </Text>
            )
          }
        />
        {showFade && (
          <LinearGradient
            pointerEvents="none"
            accessible={false}
            colors={[colors.surface + "00", colors.surface]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 32,
            }}
          />
        )}
      </View>
    </View>
  );
}
