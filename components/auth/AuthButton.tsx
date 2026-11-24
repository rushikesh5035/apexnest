import { FYNLO_COLORS } from "@/constants/theme";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  trailingIcon?: React.ReactNode;
};

export default function AuthButton({
  label,
  onPress,
  isLoading,
  trailingIcon,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{
        disabled: Boolean(isLoading),
        busy: Boolean(isLoading),
      }}
      android_ripple={{ color: FYNLO_COLORS.canvas, borderless: false }}
      className={`min-h-14 w-full flex-row items-center justify-center overflow-hidden rounded-full bg-fynlo-primary px-6 ${isLoading ? "opacity-70" : ""}`}
      style={({ pressed }) => ({
        opacity: isLoading ? 0.7 : pressed ? 0.86 : 1,
      })}
    >
      {isLoading ? (
        <ActivityIndicator size={27} color={FYNLO_COLORS.onPrimary} />
      ) : (
        <View className="flex-row items-center">
          <Text className="font-poppins-semibold text-fynlo-action text-fynlo-on-primary">
            {label}
          </Text>
          {trailingIcon && <View className="ml-3">{trailingIcon}</View>}
        </View>
      )}
    </Pressable>
  );
}
