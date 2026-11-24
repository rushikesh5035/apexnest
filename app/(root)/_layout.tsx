import AuthButton from "@/components/auth/AuthButton";
import { FYNLO_COLORS } from "@/constants/theme";
import { useUserSync } from "@/hooks/useUserSync";
import { useAuth } from "@clerk/expo";
import { Redirect, Slot, usePathname } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

export default function RootGroupLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const sync = useUserSync();

  if (isLoaded && !isSignedIn) return <Redirect href="/sign-in" />;
  if (sync.isError) {
    return (
      <View className="flex-1 justify-center gap-5 bg-fynlo-canvas px-fynlo-page">
        <Text
          accessibilityRole="alert"
          className="font-poppins-medium text-fynlo-body text-fynlo-text-primary"
        >
          We couldn’t load your account. Please try again.
        </Text>
        {__DEV__ && (
          <Text selectable className="font-poppins-regular text-fynlo-caption text-fynlo-text-secondary">
            {sync.error.message}
          </Text>
        )}
        <AuthButton
          label="Try again"
          isLoading={sync.isFetching}
          onPress={() => sync.refetch()}
        />
      </View>
    );
  }
  if (!isLoaded || sync.data === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-fynlo-canvas">
        <ActivityIndicator
          accessibilityLabel="Loading account"
          size="large"
          color={FYNLO_COLORS.primary}
        />
      </View>
    );
  }
  if (!sync.data && pathname !== "/onboarding")
    return <Redirect href="/(root)/onboarding" />;
  if (sync.data && pathname === "/onboarding")
    return <Redirect href="/(root)/(tabs)" />;
  return <Slot />;
}
