import AuthTopBar from "@/components/auth/auth-top-bar";
import AuthButton from "@/components/auth/AuthButton";
import AuthFooter from "@/components/auth/AuthFooter";
import AuthInput from "@/components/auth/AuthInput";
import AuthWrapper from "@/components/auth/AuthWrapper";
import HostedAuthButton from "@/components/auth/HostedAuthButton";
import OtpVerifyScreen from "@/components/auth/OtpVerifyScreen";
import { FYNLO_COLORS } from "@/constants/theme";
import {
  sigInFormSchemaType,
  signInSchema,
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
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type VerificationStrategy =
  "email_code" | "phone_code" | "totp" | "backup_code";

const verificationStrategies: VerificationStrategy[] = [
  "phone_code",
  "email_code",
  "totp",
  "backup_code",
];

const getClerkErrorMessage = (error: any, fallback: string) =>
  error?.errors?.[0]?.longMessage ?? error?.errors?.[0]?.message ?? fallback;

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const requestInFlightRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isLoading = fetchStatus === "fetching" || isProcessing;
  const [formError, setFormError] = useState<string>();
  const [verificationError, setVerificationError] = useState<string>();
  const [verificationStrategy, setVerificationStrategy] =
    useState<VerificationStrategy>();

  const runAuthRequest = async <T,>(request: () => Promise<T>) => {
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

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<sigInFormSchemaType>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const {
    control: verificationCodeControl,
    handleSubmit: handleVerificationCodeSubmit,
    resetField: resetVerificationCodeField,
    formState: { errors: verificationCodeErrors },
  } = useForm<verificationCodeFormSchemaType>({
    resolver: zodResolver(verificationCodeSchema),
    mode: "onBlur",
    defaultValues: { verificationCode: "" },
  });

  const finalizeSignIn = async () => {
    try {
      const { error } = await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          router.replace(decorateUrl("/") as any);
        },
      });

      return error
        ? getClerkErrorMessage(
            error,
            "Unable to complete sign in. Please try again.",
          )
        : undefined;
    } catch (error) {
      return getClerkErrorMessage(
        error,
        "Unable to complete sign in. Please try again.",
      );
    }
  };

  const onSignInPress = async (values: sigInFormSchemaType) => {
    await runAuthRequest(async () => {
      setFormError(undefined);
      setVerificationError(undefined);

      try {
        const { error } = await signIn.password({
          emailAddress: values.email,
          password: values.password,
        });

        if (error) {
          setFormError(
            getClerkErrorMessage(error, "Unable to sign in. Please try again."),
          );
          return;
        }

        if (signIn.status === "complete") {
          const finalizeError = await finalizeSignIn();
          if (finalizeError) setFormError(finalizeError);
        } else if (signIn.status === "needs_second_factor") {
          const strategy = verificationStrategies.find((candidate) =>
            signIn.supportedSecondFactors.some(
              (factor) => factor.strategy === candidate,
            ),
          );

          if (!strategy) {
            setFormError(
              "This account requires a verification method that Fynlo cannot use yet.",
            );
            return;
          }

          if (strategy === "phone_code") {
            const { error: phoneCodeError } = await signIn.mfa.sendPhoneCode();
            if (phoneCodeError) {
              setFormError(
                getClerkErrorMessage(
                  phoneCodeError,
                  "We couldn't send a verification code. Please try again.",
                ),
              );
              return;
            }
          } else if (strategy === "email_code") {
            const { error: emailCodeError } = await signIn.mfa.sendEmailCode();
            if (emailCodeError) {
              setFormError(
                getClerkErrorMessage(
                  emailCodeError,
                  "We couldn't send a verification code. Please try again.",
                ),
              );
              return;
            }
          }

          setVerificationStrategy(strategy);
        } else if (signIn.status === "needs_client_trust") {
          const emailCodeFactor = signIn.supportedSecondFactors.find(
            (factor) => factor.strategy === "email_code",
          );
          if (!emailCodeFactor) {
            setFormError("Email verification is unavailable for this device.");
            return;
          }

          const { error: emailCodeError } = await signIn.mfa.sendEmailCode();
          if (emailCodeError) {
            setFormError(
              getClerkErrorMessage(
                emailCodeError,
                "We couldn't send a verification code. Please try again.",
              ),
            );
            return;
          }

          setVerificationStrategy("email_code");
        } else {
          setFormError("We couldn't complete sign in. Please try again.");
        }
      } catch (error) {
        setFormError(
          getClerkErrorMessage(error, "Unable to connect. Please try again."),
        );
      }
    });
  };

  const onVerifyCodePress = async ({
    verificationCode,
  }: verificationCodeFormSchemaType) => {
    const code = verificationCode.trim();
    const requiresSixDigits = verificationStrategy !== "backup_code";

    if (requiresSixDigits && !/^\d{6}$/.test(code)) {
      setVerificationError("Enter the 6-digit verification code.");
      return;
    }

    await runAuthRequest(async () => {
      setVerificationError(undefined);

      try {
        const result =
          verificationStrategy === "phone_code"
            ? await signIn.mfa.verifyPhoneCode({ code })
            : verificationStrategy === "totp"
              ? await signIn.mfa.verifyTOTP({ code })
              : verificationStrategy === "backup_code"
                ? await signIn.mfa.verifyBackupCode({ code })
                : await signIn.mfa.verifyEmailCode({ code });

        if (result.error) {
          resetVerificationCodeField("verificationCode");
          setVerificationError(
            getClerkErrorMessage(
              result.error,
              "That code isn't valid. Check it and try again.",
            ),
          );
          return;
        }

        if (signIn.status === "complete") {
          const finalizeError = await finalizeSignIn();
          if (finalizeError) setVerificationError(finalizeError);
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

  const onResendVerificationCodePress = async () => {
    const didResend = await runAuthRequest(async () => {
      setVerificationError(undefined);

      try {
        const result =
          verificationStrategy === "phone_code"
            ? await signIn.mfa.sendPhoneCode()
            : await signIn.mfa.sendEmailCode();

        if (result.error) {
          setVerificationError(
            getClerkErrorMessage(
              result.error,
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

  if (
    (signIn.status === "needs_client_trust" ||
      signIn.status === "needs_second_factor") &&
    verificationStrategy
  ) {
    const isPhoneCode = verificationStrategy === "phone_code";
    const isTotp = verificationStrategy === "totp";
    const isBackupCode = verificationStrategy === "backup_code";

    return (
      <OtpVerifyScreen
        title={
          isBackupCode
            ? "Use a backup code"
            : isTotp
              ? "Enter your authenticator code"
              : signIn.status === "needs_client_trust"
                ? "Verify this device"
                : "Two-step verification"
        }
        subtitle={
          isBackupCode
            ? "Enter one of your saved backup codes."
            : isTotp
              ? "Open your authenticator app and enter the current code."
              : isPhoneCode
                ? "We sent a code to your phone."
                : "We sent a code to your email."
        }
        placeholder={isBackupCode ? "Backup code" : undefined}
        codeInputMode={isBackupCode ? "text" : "numeric"}
        control={verificationCodeControl}
        error={verificationCodeErrors.verificationCode?.message}
        clerkError={verificationError || errors.fields.code?.message}
        isLoading={isLoading}
        onVerify={handleVerificationCodeSubmit(onVerifyCodePress)}
        onResend={
          isTotp || isBackupCode ? undefined : onResendVerificationCodePress
        }
        onBack={() => {
          setVerificationError(undefined);
          setVerificationStrategy(undefined);
          signIn.reset();
        }}
      />
    );
  }

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
        <AuthTopBar onBack={() => router.back()} />

        <View className="mt-fynlo-form-offset">
          <Text className="font-poppins-semibold text-fynlo-display text-fynlo-text-primary">
            Welcome back.
          </Text>
          <Text className="mt-3 max-w-[310px] font-poppins-regular text-fynlo-body text-fynlo-text-secondary">
            Sign in to continue managing your money with clarity.
          </Text>
        </View>

        <View className="mt-10">
          <Text className="mb-2 font-poppins-medium text-fynlo-label text-fynlo-text-secondary">
            Email address
          </Text>
          <AuthInput
            control={control}
            name="email"
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            icon="email-outline"
            inputRef={emailInputRef}
            returnKeyType="next"
            submitBehavior="submit"
            onFocus={() => scrollFocusedInputIntoView(emailInputRef.current)}
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            error={
              formErrors.email?.message || errors.fields.identifier?.message
            }
          />

          <Text className="mb-2 mt-5 font-poppins-medium text-fynlo-label text-fynlo-text-secondary">
            Password
          </Text>
          <AuthInput
            control={control}
            name="password"
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="current-password"
            icon="lock-outline"
            inputRef={passwordInputRef}
            returnKeyType="done"
            submitBehavior="blurAndSubmit"
            onFocus={() => scrollFocusedInputIntoView(passwordInputRef.current)}
            onSubmitEditing={handleSubmit(onSignInPress)}
            error={
              formErrors.password?.message || errors.fields.password?.message
            }
          />

          {formError && (
            <Text
              accessibilityRole="alert"
              className="mt-3 font-poppins-regular text-fynlo-caption text-fynlo-error"
            >
              {formError}
            </Text>
          )}

          <Pressable
            onPress={() => router.push("/forgot-password")}
            accessibilityRole="button"
            accessibilityLabel="Forgot password"
            android_ripple={{ color: FYNLO_COLORS.border, borderless: false }}
            className="mt-3 min-h-12 self-end justify-center rounded-full px-2"
            style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}
          >
            <Text className="font-poppins-medium text-fynlo-label text-fynlo-primary">
              Forgot password?
            </Text>
          </Pressable>

          <View className="mt-7 gap-5">
            <AuthButton
              label="Sign in"
              onPress={handleSubmit(onSignInPress)}
              isLoading={isLoading}
            />

            <View className="flex-row items-center gap-3">
              <View className="h-px flex-1 bg-fynlo-divider" />
              <Text className="font-poppins-regular text-fynlo-label text-fynlo-text-muted">
                Or continue with
              </Text>
              <View className="h-px flex-1 bg-fynlo-divider" />
            </View>

            <HostedAuthButton mode="sign-in" />

            <AuthFooter
              label="Don't have an account ?"
              linkText="Sign up"
              href="/sign-up"
            />
          </View>
        </View>
      </ScrollView>
    </AuthWrapper>
  );
}
