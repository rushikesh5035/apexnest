import FynloLogo from "@/assets/images/fynlo-logo.svg";
import AuthButton from "@/components/auth/AuthButton";
import { FYNLO_COLORS } from "@/constants/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-fynlo-canvas" style={{ paddingTop: insets.top }}>
      <StatusBar style="light" backgroundColor={FYNLO_COLORS.canvas} />

      <View className="flex-1 px-fynlo-page">
        <View className="flex-row items-center pt-fynlo-header">
          <FynloLogo width={30} height={30} accessibilityLabel="Fynlo" />
          <Text className="ml-1 font-poppins-semibold text-fynlo-title text-fynlo-text-primary">
            Fynlo
          </Text>
        </View>

        <View className="mt-fynlo-welcome-offset">
          <Text className="font-poppins-semibold text-fynlo-display text-fynlo-text-primary">
            Take control of{"\n"}
            every rupee.
          </Text>
          <Text className="mt-3 max-w-[330px] font-poppins-regular text-fynlo-body text-fynlo-text-secondary">
            Track your spending, build better habits, and make confident money
            decisions.
          </Text>
        </View>

        <View className="flex-1 items-center justify-center">
          <Image
            source={require("../../assets/images/welcome-illustration.png")}
            resizeMode="contain"
            className="h-[400px] w-full"
            accessibilityLabel="A secure wallet with rupee savings"
          />
        </View>

        <View style={{ paddingBottom: Math.max(insets.bottom, 32) }}>
          <AuthButton
            label="Get started"
            onPress={() => router.push("/(auth)/sign-in")}
            trailingIcon={
              <MaterialCommunityIcons
                name="arrow-right"
                size={22}
                color={FYNLO_COLORS.onPrimary}
              />
            }
          />
        </View>
      </View>
    </View>
  );
}
