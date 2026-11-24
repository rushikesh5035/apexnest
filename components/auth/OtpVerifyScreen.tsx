import { FYNLO_COLORS } from "@/constants/theme";
import { verificationCodeFormSchemaType } from "@/lib/schemas/auth";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AuthTopBar from "./auth-top-bar";
import AuthButton from "./AuthButton";
import AuthInput from "./AuthInput";
import AuthWrapper from "./AuthWrapper";
import OtpInput from "./OtpInput";

type Props = {
  email?: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  codeInputMode?: "numeric" | "text";
  control: Control<verificationCodeFormSchemaType>;
  error?: string;
  clerkError?: string;
  isLoading: boolean;
  onVerify: () => void;
  onResend?: () => Promise<boolean>;
  resendCooldownSeconds?: number;
  onBack: () => void;
};

export default function OtpVerifyScreen({
  email,
  title = "Verify your account",
  subtitle,
  placeholder,
  codeInputMode = "numeric",
  control,
  error,
  clerkError,
  isLoading,
  onVerify,
  onResend,
  resendCooldownSeconds = 30,
  onBack,
}: Props) {
  const isNumericCode = codeInputMode === "numeric";
  const insets = useSafeAreaInsets();
  const [secondsRemaining, setSecondsRemaining] = useState(
    onResend ? resendCooldownSeconds : 0,
  );
  const [focusRequest, setFocusRequest] = useState(0);
  const message = error || clerkError;

  useEffect(() => {
    if (secondsRemaining === 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const handleResend = async () => {
    if (!onResend || secondsRemaining > 0 || isLoading) return;

    const didResend = await onResend();
    if (didResend) {
      setSecondsRemaining(resendCooldownSeconds);
      setFocusRequest((request) => request + 1);
    }
  };

  return (
    <AuthWrapper>
      <StatusBar style="light" backgroundColor={FYNLO_COLORS.canvas} />
      <ScrollView
        className="flex-1 bg-fynlo-canvas"
        contentContainerClassName="flex-grow px-fynlo-page"
        contentContainerStyle={{
          paddingTop: insets.top + 14,
          paddingBottom: Math.max(insets.bottom, 32),
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <AuthTopBar onBack={onBack} disabled={isLoading} />
        <View className="mt-fynlo-form-offset">
          <Text
            accessibilityRole="header"
            className="font-poppins-semibold text-fynlo-display text-fynlo-text-primary"
          >
            {title}
          </Text>
          <Text className="mt-3 font-poppins-regular text-fynlo-body text-fynlo-text-secondary">
            {subtitle ??
              (email
                ? `We sent a 6-digit code to ${email}`
                : "Enter the 6-digit code we sent you.")}
          </Text>

          <View className="mt-10">
            <Text className="mb-2 font-poppins-medium text-fynlo-label text-fynlo-text-secondary">
              {isNumericCode ? "Verification code" : "Backup code"}
            </Text>
            {isNumericCode ? (
              <Controller
                control={control}
                name="verificationCode"
                render={({ field: { value, onChange } }) => (
                  <OtpInput
                    value={value}
                    onChange={onChange}
                    onComplete={onVerify}
                    editable={!isLoading}
                    hasError={Boolean(message)}
                    focusRequest={focusRequest}
                  />
                )}
              />
            ) : (
              <AuthInput
                control={control}
                name="verificationCode"
                placeholder={placeholder ?? "Backup code"}
                error={message}
                autoCapitalize="none"
                autoComplete="off"
                returnKeyType="done"
                onSubmitEditing={onVerify}
                autoCorrect={false}
              />
            )}
            {isNumericCode && message && (
              <Text
                accessibilityRole="alert"
                className="mt-3 font-poppins-regular text-fynlo-caption text-fynlo-error"
              >
                {message}
              </Text>
            )}
          </View>

          <View className="mt-7">
            <AuthButton
              label="Verify code"
              onPress={onVerify}
              isLoading={isLoading}
            />
          </View>
          {onResend && (
            <Pressable
              onPress={handleResend}
              disabled={secondsRemaining > 0 || isLoading}
              accessibilityRole="button"
              accessibilityState={{
                disabled: secondsRemaining > 0 || isLoading,
              }}
              className="mt-3 min-h-12 items-center justify-center"
              style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}
            >
              <Text
                className={`font-poppins-medium text-fynlo-label ${secondsRemaining > 0 || isLoading ? "text-fynlo-text-secondary" : "text-fynlo-primary"}`}
              >
                {secondsRemaining > 0
                  ? `Resend code in ${secondsRemaining}s`
                  : "Resend code"}
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </AuthWrapper>
  );
}
