import { FYNLO_COLORS as colors } from "@/constants/theme";
import { IconArrowUpRight, IconSparklesFilled } from "@tabler/icons-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";

export default function AiInsightCard({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      className="mt-5 overflow-hidden rounded-2xl"
    >
      <LinearGradient
        colors={[colors.primary, colors.insightGreen]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          padding: 14,
        }}
      >
        <View className="h-12 w-12 items-center justify-center rounded-full bg-fynlo-canvas">
          <IconSparklesFilled size={24} color={colors.white} />
        </View>
        <View className="flex-1">
          <Text className="font-poppins-semibold text-fynlo-body text-fynlo-on-primary">
            AI insight
          </Text>
          <Text className="font-poppins-regular text-fynlo-caption text-fynlo-on-primary">
            Explore your spending patterns
          </Text>
        </View>
        <IconArrowUpRight size={24} color={colors.onPrimary} />
      </LinearGradient>
    </TouchableOpacity>
  );
}
