import { FYNLO_COLORS as colors } from "@/constants/theme";
import type { Transaction } from "@/lib/services/transactions";
import { formatPrice } from "@/lib/utils";
import { eachDayOfInterval, format, startOfMonth } from "date-fns";
import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

export default function CashFlowChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const today = format(new Date(), "yyyy-MM-dd");
  const days = useMemo(() => {
    const end = new Date(today + "T00:00:00");
    const values = eachDayOfInterval({ start: startOfMonth(end), end }).map(
      (date) => ({
        date,
        income: 0,
        expense: 0,
      }),
    );
    const byDate = new Map(
      values.map((day) => [format(day.date, "yyyy-MM-dd"), day]),
    );
    for (const tx of transactions) {
      const day = byDate.get(format(new Date(tx.date), "yyyy-MM-dd"));
      if (day) day[tx.type === "INCOME" ? "income" : "expense"] += tx.amount;
    }
    return values;
  }, [today, transactions]);
  const peak = Math.max(
    1,
    ...days.map((day) => Math.max(day.income, day.expense)),
  );
  return (
    <View className="gap-3 rounded-2xl bg-fynlo-surface p-4">
      <View className="flex-row flex-wrap items-center justify-between gap-2">
        <Text
          accessibilityRole="header"
          className="font-poppins-semibold text-fynlo-body text-fynlo-text-primary"
        >
          Daily cash flow
        </Text>
        <Text className="font-poppins-regular text-fynlo-caption text-fynlo-text-secondary">
          {format(days[0].date, "MMMM yyyy")}
        </Text>
      </View>
      <View className="flex-row gap-4">
        {(["Income", "Expense"] as const).map((label) => (
          <View key={label} className="flex-row items-center gap-2">
            <View
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  label === "Income" ? colors.income : colors.expense,
              }}
            />
            <Text className="font-poppins-regular text-fynlo-caption text-fynlo-text-secondary">
              {label}
            </Text>
          </View>
        ))}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {days.map(({ date, income, expense }) => (
          <View
            key={date.getTime()}
            accessible
            accessibilityLabel={
              format(date, "d MMMM") +
              ", income " +
              formatPrice(income) +
              ", expense " +
              formatPrice(expense)
            }
            className="w-8 items-center"
          >
            <View className="h-20 w-full flex-row items-end justify-center gap-1 border-b border-fynlo-border">
              <View
                className="w-2 rounded-t-sm bg-fynlo-primary"
                style={{ height: (76 * income) / peak }}
              />
              <View
                className="w-2 rounded-t-sm bg-fynlo-expense"
                style={{ height: (76 * expense) / peak }}
              />
            </View>
            <Text className="pt-1 font-poppins-regular text-fynlo-caption text-fynlo-text-secondary">
              {format(date, "d")}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
