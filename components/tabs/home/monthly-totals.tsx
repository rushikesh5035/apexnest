import { FYNLO_COLORS as colors } from "@/constants/theme";
import { formatPrice } from "@/lib/utils";
import { IconCreditCardFilled, IconCircleArrowUpRightFilled } from "@tabler/icons-react-native";
import { Text, View } from "react-native";

type MonthlyTotalsProps = {
  monthIncome: number;
  monthExpense: number;
  totalsUnavailable: boolean;
};

export default function MonthlyTotals({
  monthIncome,
  monthExpense,
  totalsUnavailable,
}: MonthlyTotalsProps) {
  return (
    <View className="mt-5 flex-row gap-4">
      {(
        [
          {
            title: "Expense",
            Icon: IconCreditCardFilled,
            amount: monthExpense,
          },
          {
            title: "Income",
            Icon: IconCircleArrowUpRightFilled,
            amount: monthIncome,
          },
        ] as const
      ).map((item) => (
        <View
          key={item.title}
          className="flex-1 flex-row items-center gap-4 rounded-2xl bg-fynlo-surface px-5 py-4"
        >
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-fynlo-border">
            <item.Icon size={24} color={colors.textSecondary} />
          </View>
          <View className="flex-1">
            <Text className="font-poppins-regular text-fynlo-caption text-fynlo-text-secondary">
              {item.title}
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              className="font-poppins-medium text-fynlo-body text-fynlo-text-primary"
            >
              {totalsUnavailable
                ? "—"
                : formatPrice(item.amount)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
