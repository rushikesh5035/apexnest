import { FYNLO_COLORS as colors } from "@/constants/theme";
import { formatPrice } from "@/lib/utils";
import { Feather } from "@expo/vector-icons";
import { IconArrowUpRight, IconCamera, IconMicrophoneFilled, IconSquareRoundedPlusFilled } from "@tabler/icons-react-native";
import { Text, TouchableOpacity, View } from "react-native";

const QUICK_ACTIONS = [
  {
    Icon: IconCamera,
    label: "Scan receipt",
    action: "scan",
  },
  {
    Icon: IconMicrophoneFilled,
    label: "Voice entry",
    action: "voice",
  },
  {
    Icon: IconSquareRoundedPlusFilled,
    label: "Add manually",
    action: "manual",
  },
] as const;

type BalanceCardProps = {
  balance: string;
  monthIncome: number;
  monthExpense: number;
  totalsUnavailable: boolean;
  onTransactions: () => void;
  onAction: (action: (typeof QUICK_ACTIONS)[number]["action"]) => void;
};

export default function BalanceCard({
  balance,
  monthIncome,
  monthExpense,
  totalsUnavailable,
  onTransactions,
  onAction,
}: BalanceCardProps) {
  return (
    <View className="mt-5 overflow-hidden rounded-2xl bg-fynlo-surface p-5">
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Total balance ${balance}. View transactions`}
        onPress={onTransactions}
        className="rounded-b-xl"
      >
        <View className="flex-row justify-between items-center ">
          <Text className="font-poppins-regular text-fynlo-label text-fynlo-text-secondary">
            Total balance
          </Text>
          <IconArrowUpRight size={24} color={colors.textSecondary} />
        </View>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          className="my-1 font-poppins-medium text-fynlo-display text-fynlo-text-primary"
        >
          {balance}
        </Text>
        <View className="flex-row flex-wrap items-center gap-2">
          <Feather
            name={
              monthIncome >= monthExpense ? "trending-up" : "trending-down"
            }
            size={16}
            color={
              monthIncome >= monthExpense ? colors.income : colors.expense
            }
          />
          <Text
            className="font-poppins-medium text-fynlo-caption"
            style={{
              color:
                monthIncome >= monthExpense
                  ? colors.income
                  : colors.expense,
            }}
          >
            {totalsUnavailable
              ? "—"
              : (monthIncome > monthExpense ? "+" : "") +
                formatPrice(monthIncome - monthExpense)}
          </Text>
          <Text className="font-poppins-regular text-fynlo-caption text-fynlo-text-secondary">
            Net this month
          </Text>
        </View>
      </TouchableOpacity>
      <View className="flex-row gap-3 mt-5">
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.action}
            accessibilityRole="button"
            onPress={() => onAction(action.action)}
            className="min-h-20 flex-1 items-center justify-center gap-1 rounded-xl bg-fynlo-border p-1"
          >
            <action.Icon size={22} color={colors.textPrimary} />
            <Text className="text-center font-poppins-regular text-fynlo-caption text-fynlo-text-primary">
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
