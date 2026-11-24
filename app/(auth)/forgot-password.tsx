import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import AuthWrapper from "@/components/auth/AuthWrapper";
import OtpVerifyScreen from "@/components/auth/OtpVerifyScreen";
import AuthTopBar from "@/components/auth/auth-top-bar";
import { FYNLO_COLORS } from "@/constants/theme";
import {
  forgotPasswordFormSchemaType,
  forgotPasswordSchema,
  resetPasswordFormSchemaType,
  resetPasswordSchema,
  verificationCodeFormSchemaType,
  verificationCodeSchema,
} from "@/lib/schemas/auth";
import { useSignIn } from "@clerk/expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  findNodeHandle,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ResetStep = "email" | "code" | "password";

const getClerkErrorMessage = (error: any, fallback: string) =>
  error?.errors?.[0]?.longMessage ?? error?.errors?.[0]?.message ?? fallback;

export default function ForgotPasswordScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const requestInFlightRef = useRef(false);
  const [step, setStep] = useState<ResetStep>("email");
  const [emailAddress, setEmailAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [verificationError, setVerificationError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const isLoading = fetchStatus === "fetching" || isProcessing;

  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<forgotPasswordFormSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    defaultValues: { email: "" },
  });

  const {
    control: verificationCodeControl,
    handleSubmit: handleVerificationSubmit,
    resetField: resetVerificationCodeField,
    formState: { errors: verificationCodeErrors },
  } = useForm<verificationCodeFormSchemaType>({
    resolver: zodResolver(verificationCodeSchema),
    mode: "onBlur",
    defaultValues: { verificationCode: "" },
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm<resetPasswordFormSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const runRequest = async <T,>(request: () => Promise<T>) => {
    if (requestInFlightRef.current) return;

    requestInFlightRef.current = true;
    setIsProcessing(true);
    try {
      return await request();
    } finally {
      requestInFlightRef.current = false;
      setIsProcessing(false);
    }
  };

  const scrollFocusedInputIntoView = (input: TextInput | null) => {
    const inputHandle = findNodeHandle(input);
    if (!inputHandle) return;

    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollResponderScrollNativeHandleToKeyboard(
        inputHandle,
        72,
        true,
      );
    });
  };

  const onSendCode = async ({ email }: forgotPasswordFormSchemaType) => {
    await runRequest(async () => {
      setFormError(undefined);
      try {
        const { error: createError } = await signIn.create({
          identifier: email,
        });
        if (createError) {
          setFormError(
            getClerkErrorMessage(
              createError,
              "We couldn't start your password reset. Please try again.",
            ),
          );
          return;
        }

        const { error: sendCodeError } =
          await signIn.resetPasswordEmailCode.sendCode();
        if (sendCodeError) {
          setFormError(
            getClerkErrorMessage(
              sendCodeError,
              "We couldn't send a reset code. Please try again.",
            ),
          );
          return;
        }

        setEmailAddress(email.trim());
        setStep("code");
      } catch (error) {
        setFormError(
          getClerkErrorMessage(error, "Unable to connect. Please try again."),
        );
      }
    });
  };

  const onVerifyCode = async ({
    verificationCode,
  }: verificationCodeFormSchemaType) => {
    const code = verificationCode.trim();
    if (!/^\d{6}$/.test(code)) {
      setVerificationError("Enter the 6-digit verification code.");
      return;
    }

    await runRequest(async () => {
      setVerificationError(undefined);
      try {
        const { error } = await signIn.resetPasswordEmailCode.verifyCode({
          code,
        });
        if (error) {
          resetVerificationCodeField("verificationCode");
          setVerificationError(
            getClerkErrorMessage(
              error,
              "That code isn't valid. Check it and try again.",
            ),
          );
          return;
        }

        if (signIn.status === "needs_new_password") {
          setStep("password");
        } else {
          setVerificationError(
            "Verification isn't complete yet. Please try again.",
          );
        }
      } catch (error) {
        setVerificationError(
          getClerkErrorMessage(error, "Unable to connect. Please try again."),
        );
      }
    });
  };

  const onResendCode = async () => {
    const didResend = await runRequest(async () => {
      setVerificationError(undefined);
      try {
        const { error } = await signIn.resetPasswordEmailCode.sendCode();
        if (error) {
          setVerificationError(
            getClerkErrorMessage(
              error,
              "We couldn't send a new code. Please try again.",
            ),
          );
          return false;
        }

        resetVerificationCodeField("verificationCode");
        return true;
      } catch (error) {
        setVerificationError(
          getClerkErrorMessage(error, "Unable to connect. Please try again."),
        );
        return false;
      }
    });

    return didResend ?? false;
  };

  const onSetNewPassword = async ({
    password,
  }: resetPasswordFormSchemaType) => {
    await runRequest(async () => {
      setPasswordError(undefined);
      try {
        const { error } = await signIn.resetPasswordEmailCode.submitPassword({
          password,
          signOutOfOtherSessions: true,
        });
        if (error) {
          setPasswordError(
            getClerkErrorMessage(
              error,
              "We couldn't update your password. Please try again.",
            ),
          );
          return;
        }

        if (signIn.status === "complete") {
          const { error: finalizeError } = await signIn.finalize({
            navigate: ({ session, decorateUrl }) => {
              if (session?.currentTask) {
                setPasswordError(
                  "Your password was updated, but one more account step is required.",
                );
                return;
              }

              router.replace(decorateUrl("/") as any);
            },
          });

          if (finalizeError) {
            setPasswordError(
              getClerkErrorMessage(
                finalizeError,
                "Your password was updated, but we couldn't finish signing you in.",
              ),
            );
          }
          return;
        }

        setPasswordError(
          "We couldn't finish resetting your password. Please try again.",
        );
      } catch (error) {
        setPasswordError(
          getClerkErrorMessage(error, "Unable to connect. Please try again."),
        );
      }
    });
  };

  const resetToEmail = () => {
    signIn.reset();
    setVerificationError(undefined);
    setPasswordError(undefined);
    setStep("email");
  };

  if (step === "code") {
    return (
      <OtpVerifyScreen
        email={emailAddress}
        title="Enter verification code"
        subtitle={`We sent a 6-digit reset code to ${emailAddress}.`}
        control={verificationCodeControl}
        error={verificationCodeErrors.verificationCode?.message}
        clerkError={verificationError || errors.fields.code?.message}
        isLoading={isLoading}
        onVerify={handleVerificationSubmit(onVerifyCode)}
        onResend={onResendCode}
        onBack={resetToEmail}
      />
    );
  }

  const isEmailStep = step === "email";
  const submit = isEmailStep
    ? handleEmailSubmit(onSendCode)
    : handlePasswordSubmit(onSetNewPassword);
  const errorMessage = isEmailStep ? formError : passwordError;

  return (
    <AuthWrapper>
      <StatusBar style="light" backgroundColor={FYNLO_COLORS.canvas} />
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 bg-fynlo-canvas"
        contentContainerClassName="flex-grow px-fynlo-page"
        contentContainerStyle={{
          paddingTop: insets.top + 14,
          paddingBottom: Math.max(insets.bottom, 32),
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <AuthTopBar
          disabled={isLoading}
          onBack={
            isEmailStep
              ? () =>
                  router.canGoBack()
                    ? router.back()
                    : router.replace("/sign-in")
              : resetToEmail
          }
        />

        <View className="mt-fynlo-form-offset">
          <Text
            accessibilityRole="header"
            className="font-poppins-semibold text-fynlo-display text-fynlo-text-primary"
          >
            {isEmailStep ? "Reset your password" : "Create a new password"}
          </Text>
          <Text className="mt-3 max-w-[310px] font-poppins-regular text-fynlo-body text-fynlo-text-secondary">
            {isEmailStep
              ? "Enter your email and we’ll send you a six-digit reset code."
              : "Use at least 6 characters for your new password."}
          </Text>
        </View>

        <View className="mt-10">
          {isEmailStep ? (
            <>
              <Text className="mb-2 font-poppins-medium text-fynlo-label text-fynlo-text-secondary">
                Email address
              </Text>
              <AuthInput
                control={emailControl}
                name="email"
                accessibilityLabel="Email address"
                placeholder="you@example.com"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                icon="email-outline"
                inputRef={emailInputRef}
                returnKeyType="send"
                onFocus={() =>
                  scrollFocusedInputIntoView(emailInputRef.current)
                }
                onSubmitEditing={handleEmailSubmit(onSendCode)}
                error={
                  emailErrors.email?.message ||
                  errors.fields.identifier?.message
                }
              />
            </>
          ) : (
            <>
              <Text className="mb-2 font-poppins-medium text-fynlo-label text-fynlo-text-secondary">
                New password
              </Text>
              <AuthInput
                control={passwordControl}
                name="password"
                placeholder="New password"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                icon="lock-outline"
                inputRef={passwordInputRef}
                returnKeyType="next"
                onFocus={() =>
                  scrollFocusedInputIntoView(passwordInputRef.current)
                }
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                error={passwordErrors.password?.message}
              />
              <Text className="mb-2 mt-5 font-poppins-medium text-fynlo-label text-fynlo-text-secondary">
                Confirm new password
              </Text>
              <AuthInput
                control={passwordControl}
                name="confirmPassword"
                placeholder="Confirm new password"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                icon="lock-outline"
                inputRef={confirmPasswordInputRef}
                returnKeyType="done"
                onFocus={() =>
                  scrollFocusedInputIntoView(confirmPasswordInputRef.current)
                }
                onSubmitEditing={handlePasswordSubmit(onSetNewPassword)}
                error={passwordErrors.confirmPassword?.message}
              />
            </>
          )}
          {errorMessage && (
            <Text
              accessibilityRole="alert"
              className="mt-3 font-poppins-regular text-fynlo-caption text-fynlo-error"
            >
              {errorMessage}
            </Text>
          )}
          <View className="mt-7">
            <AuthButton
              label={isEmailStep ? "Send reset code" : "Change password"}
              onPress={submit}
              isLoading={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </AuthWrapper>
  );
}
