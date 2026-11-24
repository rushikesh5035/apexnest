import FynloLogo from "@/assets/images/fynlo-logo.svg";
import { FYNLO_COLORS } from "@/constants/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, Text, View } from "react-native";

type Props = {
  onBack: () => void;
};

export default function AuthTopBar({ onBack }: Props) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <FynloLogo width={26} height={30} accessibilityLabel="Fynlo" />
        <Text className="ml-1 font-poppins-semibold text-fynlo-title text-fynlo-text-primary">
          Fynlo
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        android_ripple={{ color: FYNLO_COLORS.border, borderless: false }}
        className="min-h-12 min-w-12 flex-row items-center justify-center rounded-full px-2"
        onPress={onBack}
        style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={24}
          color={FYNLO_COLORS.textSecondary}
        />
        <Text className="ml-0.5 font-poppins-medium text-fynlo-label text-fynlo-text-secondary">
          Back
        </Text>
      </Pressable>
    </View>
  );
}
