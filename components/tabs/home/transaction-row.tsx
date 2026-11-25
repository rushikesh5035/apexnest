import { getCategoryConfig } from "@/constants/categories";
import { FYNLO_COLORS as colors } from "@/constants/theme";
import { Transaction } from "@/lib/services/transactions";
import { formatPrice } from "@/lib/utils";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

const INPUT_METHOD_ICON: Record<
  Transaction["input_method"],
  keyof typeof Feather.glyphMap
> = {
  MANUAL: "edit-3",
  RECEIPT_SCAN: "camera",
  VOICE: "mic",
};

export default function TransactionRow({
  tx,
  onDelete,
  appearance,
}: {
  tx: Transaction;
  onDelete?: () => void;
  appearance?: "home";
}) {
  const config = getCategoryConfig(tx.category);
  const isIncome = tx.type === "INCOME";

  const date = new Date(tx.date);
  const row = (
    <View
      className={
        appearance === "home"
          ? "flex-row items-center gap-2 rounded-xl bg-fynlo-border p-3"
          : "min-h-20 flex-row items-center gap-3 border-b border-fynlo-border bg-fynlo-canvas py-2 px-1"
      }
    >
      <View className="h-11 w-11 items-center justify-center rounded-lg bg-fynlo-surface">
        <Text className="text-xl">{config.icon}</Text>
      </View>
      <View className="flex-1">
        <Text
          numberOfLines={1}
          className="font-poppins-medium text-fynlo-label text-fynlo-text-primary"
        >
          {tx.description || config.label}
        </Text>
        <Text className="mt-1 font-poppins-regular text-fynlo-caption text-fynlo-text-secondary">
          {tx.description && tx.description !== config.label
            ? `${config.label} · `
            : ""}
          {date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: appearance === "home" ? undefined : "numeric",
          })}
        </Text>
        {tx.is_flagged && <Text className="text-fynlo-error">Flagged</Text>}
      </View>
      <View style={{ maxWidth: "42%" }} className="items-end">
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          className={`font-poppins-medium text-fynlo-label ${isIncome ? "text-fynlo-primary" : "text-fynlo-expense"}`}
        >
          {isIncome ? "+" : "−"}
          {formatPrice(tx.amount)}
        </Text>
        <Text className="mt-1 font-poppins-regular text-fynlo-caption text-fynlo-text-secondary">
          {isIncome ? "Received" : "Spent"}
        </Text>
      </View>
    </View>
  );
  if (!onDelete) return row;
  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        <View className="w-16 items-center justify-center border-b border-fynlo-border">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Delete transaction"
            onPress={onDelete}
            className="h-12 w-12 items-center justify-center rounded-full bg-fynlo-surface"
          >
            <Feather name="trash-2" size={20} color={colors.expense} />
          </TouchableOpacity>
        </View>
      )}
    >
      <View
        accessible
        accessibilityActions={[{ name: "delete", label: "Delete transaction" }]}
        onAccessibilityAction={({ nativeEvent }) => {
          if (nativeEvent.actionName === "delete") onDelete();
        }}
      >
        {row}
      </View>
    </Swipeable>
  );
}
