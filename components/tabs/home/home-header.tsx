import { FYNLO_COLORS as colors } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

type HomeHeaderProps = {
  firstName: string | null | undefined;
  avatarUrl: string | undefined;
  budgetDisabled: boolean;
  onProfile: () => void;
  onSearch: () => void;
  onBudget: () => void;
};

export default function HomeHeader({
  firstName,
  avatarUrl,
  budgetDisabled,
  onProfile,
  onSearch,
  onBudget,
}: HomeHeaderProps) {
  return (
    <View className="flex-row items-center gap-2">
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Open profile"
        onPress={onProfile}
        className="h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-fynlo-surface"
      >
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="h-full w-full"
          />
        ) : (
          <Text className="font-poppins-semibold text-fynlo-title text-fynlo-primary">
            {firstName?.[0]?.toUpperCase() || "F"}
          </Text>
        )}
      </TouchableOpacity>
      <View className="flex-1">
        <Text
          numberOfLines={1}
          className="font-poppins-medium text-fynlo-body text-fynlo-text-primary"
        >
          {firstName ? `Hello, ${firstName}!` : getGreeting()}
        </Text>
        <Text className="font-poppins-regular text-fynlo-caption text-fynlo-text-secondary">
          Welcome back
        </Text>
      </View>
      <TouchableOpacity
        accessibilityLabel="Search transactions"
        accessibilityRole="button"
        onPress={onSearch}
        className="h-12 w-12 items-center justify-center rounded-full bg-fynlo-surface"
      >
        <Feather name="search" color={colors.textSecondary} size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityLabel="Manage monthly budget"
        accessibilityRole="button"
        disabled={budgetDisabled}
        onPress={onBudget}
        className="h-12 w-12 items-center justify-center rounded-full bg-fynlo-surface"
      >
        <Feather name="sliders" color={colors.textSecondary} size={18} />
      </TouchableOpacity>
    </View>
  );
}
