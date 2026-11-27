import { Feather } from "@expo/vector-icons";
import { FYNLO_COLORS as colors } from "@/constants/theme";
import { Pressable, Text, View } from "react-native";

export default function ProfileRow({
  icon,
  title,
  detail,
  value,
  danger,
  disabled,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  detail?: string;
  value?: string;
  danger?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      accessibilityState={{ disabled }}
      onPress={onPress}
      className="min-h-16 flex-row items-center gap-3 border-b border-fynlo-border px-4 py-3"
    >
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-fynlo-border">
        <Feather
          name={icon}
          size={18}
          color={danger ? colors.expense : colors.textPrimary}
        />
      </View>
      <View className="flex-1">
        <Text
          className={`font-poppins-medium text-fynlo-label ${danger ? "text-fynlo-expense" : "text-fynlo-text-primary"}`}
        >
          {title}
        </Text>
        {detail && (
          <Text className="font-poppins-regular text-fynlo-caption text-fynlo-text-secondary">
            {detail}
          </Text>
        )}
      </View>
      {value && (
        <Text
          style={{ maxWidth: "40%" }}
          className="font-poppins-medium text-fynlo-label text-fynlo-text-primary"
        >
          {value}
        </Text>
      )}
      {!danger && (
        <Feather name="chevron-right" size={16} color={colors.textSecondary} />
      )}
    </Pressable>
  );
}
