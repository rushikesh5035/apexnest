import FynloLogo from "@/assets/images/fynlo-logo.svg";
import { COLORS } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-brand-primary">
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <View
        className="flex-1 items-center justify-center px-6 pb-2"
        style={{ paddingTop: insets.top }}
      >
        <View className="h-[250px] w-full items-center justify-center">
          <Image
            source={require("../../assets/images/fynlo-welcome.png")}
            resizeMode="contain"
            className="h-[450px] w-full"
            accessibilityLabel="A person building savings with rupee coins"
          />
        </View>
      </View>

      <View
        className="rounded-t-[34px] bg-white px-7 pb-7 pt-7"
        style={{ paddingBottom: Math.max(insets.bottom, 24) }}
      >
        <View className="mb-5 flex-row items-center justify-center gap-2">
          <FynloLogo width={36} height={32} accessibilityLabel="Fynlo" />
          <Text className="font-poppins-semibold text-[22px] leading-7 text-brand-text-primary">
            Fynlo
          </Text>
        </View>
        <Text className="text-center font-poppins-semibold text-[24px] leading-8 text-brand-text-primary">
          Make every rupee count
        </Text>
        <Text className="mt-2 text-center font-poppins-regular text-[14px] leading-[22px] text-brand-text-secondary">
          A clearer view of your money starts here.
        </Text>
        <Text className="mt-1 text-center font-poppins-regular text-[12px] leading-5 text-brand-text-muted">
          Track spending, manage your budget, and build better money habits.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/sign-in")}
          accessibilityRole="button"
          className="mt-10 mb-5 py-3 items-center rounded-full bg-brand-primary"
        >
          <Text className="font-poppins-medium text-[16px] text-white">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
