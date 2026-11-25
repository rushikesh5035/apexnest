import { FYNLO_COLORS as colors } from "@/constants/theme";
import { IconDownloadFilled, IconPlusFilled } from "@tabler/icons-react-native";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function TransactionToolbar({
  exporting,
  onExport,
  onAdd,
}: {
  exporting: boolean;
  onExport: () => void;
  onAdd: () => void;
}) {
  return (
    <View className="flex-row items-center gap-2 px-4 pb-4 pt-3">
      <Text
        accessibilityRole="header"
        className="flex-1 font-poppins-semibold text-fynlo-title text-fynlo-text-primary"
      >
        Transactions
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Export transactions as CSV"
        disabled={exporting}
        onPress={onExport}
        className="h-12 w-12 items-center justify-center rounded-full bg-fynlo-surface"
      >
        {exporting ? (
          <ActivityIndicator size={27} color={colors.primary} />
        ) : (
          <IconDownloadFilled size={22} color={colors.textPrimary} />
        )}
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add transaction"
        onPress={onAdd}
        className="h-12 w-12 items-center justify-center rounded-full bg-fynlo-primary"
      >
        <IconPlusFilled size={24} color={colors.onPrimary} />
      </Pressable>
    </View>
  );
}
