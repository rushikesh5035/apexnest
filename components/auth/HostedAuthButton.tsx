import { FYNLO_COLORS } from "@/constants/theme";
import { useHostedAuth } from "@clerk/expo/hosted-auth";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  mode: "sign-in" | "sign-up";
};

export default function HostedAuthButton({ mode }: Props) {
  const { startHostedAuth } = useHostedAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await startHostedAuth({ mode });
    } catch (error) {
      Alert.alert(
        "Authentication error",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isLoading}
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
      accessibilityState={{ disabled: isLoading, busy: isLoading }}
      android_ripple={{ color: FYNLO_COLORS.border, borderless: false }}
      className={`min-h-14 w-full flex-row items-center justify-center gap-3 overflow-hidden rounded-full border border-fynlo-border bg-fynlo-input px-6 ${isLoading ? "opacity-70" : ""}`}
      style={({ pressed }) => ({
        opacity: isLoading ? 0.7 : pressed ? 0.78 : 1,
      })}
    >
      {isLoading ? (
        <ActivityIndicator size={27} color={FYNLO_COLORS.primary} />
      ) : (
        <>
          <View accessible={false}>
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Path
                fill="#4285F4"
                d="M23.49 12.27c0-.78-.07-1.53-.2-2.25H12v4.26h6.44a5.5 5.5 0 0 1-2.39 3.61v2.77h3.87c2.27-2.09 3.57-5.17 3.57-8.39Z"
              />
              <Path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.93l-3.87-2.99c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.1-6.72-4.93H1.28v3.09A12 12 0 0 0 12 24Z"
              />
              <Path
                fill="#FBBC05"
                d="M5.28 14.3a7.2 7.2 0 0 1 0-4.6V6.61H1.28a12 12 0 0 0 0 10.78l4-3.09Z"
              />
              <Path
                fill="#EA4335"
                d="M12 4.77c1.77 0 3.35.61 4.6 1.81l3.45-3.45C17.94 1.18 15.24 0 12 0A12 12 0 0 0 1.28 6.61l4 3.09c.95-2.83 3.6-4.93 6.72-4.93Z"
              />
            </Svg>
          </View>
          <Text className="font-poppins-medium text-fynlo-body text-fynlo-text-primary">
            Google
          </Text>
        </>
      )}
    </Pressable>
  );
}
