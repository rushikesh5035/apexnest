import FynloLogo from "@/assets/images/fynlo-logo.svg";
import AuthButton from "@/components/auth/AuthButton";
import { FYNLO_COLORS } from "@/constants/theme";
import { useSupabase } from "@/hooks/useSupabase";
import {
  OnboardingFormSchemaType,
  onboardingSchema,
} from "@/lib/schemas/onboarding";
import { useUserStore } from "@/store/userStore";
import { useUser } from "@clerk/expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const INDIAN_RUPEE = "INR";

export default function OnboardingScreen() {
  const { user } = useUser();
  const authSupabase = useSupabase();
  const setCurrency = useUserStore((state) => state.setCurrency);
  const setNeedsOnboarding = useUserStore((state) => state.setNeedsOnboarding);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [focused, setFocused] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<OnboardingFormSchemaType>({
    resolver: zodResolver(onboardingSchema),
    mode: "onBlur",
    defaultValues: { startingBalance: "" },
  });

  const handleSave = async ({ startingBalance }: OnboardingFormSchemaType) => {
    if (!user || saving) return;

    const parsedBalance = Number.parseFloat(startingBalance.replace(/,/g, ""));
    setSaving(true);
    setError("");

    try {
      const { error: updateError } = await authSupabase
        .from("users")
        .update({ currency: INDIAN_RUPEE })
        .eq("clerk_id", user.id);

      if (updateError) throw updateError;

      const { data: defaultAccount, error: accountFetchError } =
        await authSupabase
          .from("accounts")
          .select("id, balance")
          .eq("user_id", user.id)
          .eq("is_default", true)
          .single();

      if (accountFetchError || !defaultAccount) {
        throw accountFetchError ?? new Error("Default account not found");
      }

      const { error: transactionError } = await authSupabase
        .from("transactions")
        .insert({
          user_id: user.id,
          account_id: defaultAccount.id,
          type: "INCOME",
          amount: parsedBalance,
          category: "other_income",
          description: "Starting balance",
          date: new Date().toISOString(),
          input_method: "MANUAL",
        });

      if (transactionError) throw transactionError;

      const { error: balanceError } = await authSupabase
        .from("accounts")
        .update({ balance: defaultAccount.balance + parsedBalance })
        .eq("id", defaultAccount.id);

      if (balanceError) throw balanceError;

      setCurrency(INDIAN_RUPEE);
      setNeedsOnboarding(false);
      router.replace("/(root)/(tabs)");
    } catch (saveError) {
      console.error("Unable to save onboarding details:", saveError);
      setError("We couldn't save your balance. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const message = formErrors.startingBalance?.message || error;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-fynlo-canvas"
    >
      <StatusBar style="light" backgroundColor={FYNLO_COLORS.canvas} />
      <ScrollView
        contentContainerClassName="flex-grow px-fynlo-page"
        contentContainerStyle={{
          paddingTop: insets.top + 14,
          paddingBottom: Math.max(insets.bottom, 32),
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <View
          accessible
          accessibilityLabel="Fynlo"
          className="min-h-12 flex-row items-center"
        >
          <FynloLogo width={26} height={30} />
          <Text className="ml-1 font-poppins-semibold text-fynlo-title text-fynlo-text-primary">
            Fynlo
          </Text>
        </View>
        <View className="mt-fynlo-form-offset">
          <Text
            accessibilityRole="header"
            className="font-poppins-semibold text-fynlo-display text-fynlo-text-primary"
          >
            Set your starting balance
          </Text>
          <Text className="mt-3 max-w-[330px] font-poppins-regular text-fynlo-body text-fynlo-text-secondary">
            Enter the amount you have in your Cash account today.
          </Text>
        </View>

        <Text className="mb-2 mt-10 font-poppins-medium text-fynlo-label text-fynlo-text-secondary">
          Starting balance
        </Text>
        <View
          className="min-h-12 flex-row items-center rounded-2xl border bg-fynlo-input px-4"
          style={{
            borderColor: message
              ? FYNLO_COLORS.error
              : focused
                ? FYNLO_COLORS.primary
                : FYNLO_COLORS.border,
          }}
        >
          <Text
            className="mr-2 font-poppins-medium text-fynlo-body text-fynlo-text-secondary"
            style={{ includeFontPadding: false }}
          >
            ₹
          </Text>
          <Controller
            control={control}
            name="startingBalance"
            render={({ field: { value, onBlur, onChange } }) => (
              <TextInput
                value={value}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  setFocused(false);
                  onBlur();
                }}
                onChangeText={(text) => {
                  setError("");
                  onChange(text);
                }}
                editable={!saving}
                accessibilityLabel="Starting balance in Indian rupees"
                keyboardType="decimal-pad"
                returnKeyType="done"
                autoCorrect={false}
                onSubmitEditing={handleSubmit(handleSave)}
                placeholder="0.00"
                placeholderTextColor={FYNLO_COLORS.placeholder}
                selectionColor={FYNLO_COLORS.primary}
                underlineColorAndroid="transparent"
                className="h-14 rounded-full flex-1 self-stretch p-0 font-poppins-medium text-fynlo-body text-fynlo-text-primary"
                style={{
                  includeFontPadding: false,
                  textAlignVertical: "center",
                }}
              />
            )}
          />
        </View>
        {message && (
          <Text
            accessibilityRole="alert"
            className="mt-3 font-poppins-regular text-fynlo-caption text-fynlo-error"
          >
            {message}
          </Text>
        )}
        <View className="mt-7">
          <AuthButton
            label="Continue to Fynlo"
            onPress={handleSubmit(handleSave)}
            isLoading={saving}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
