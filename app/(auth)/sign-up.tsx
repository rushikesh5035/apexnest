import AuthButton from "@/components/auth/AuthButton";
import AuthFooter from "@/components/auth/AuthFooter";
import AuthInput from "@/components/auth/AuthInput";
import AuthTopBar from "@/components/auth/auth-top-bar";
import AuthWrapper from "@/components/auth/AuthWrapper";
import HostedAuthButton from "@/components/auth/HostedAuthButton";
import OtpVerifyScreen from "@/components/auth/OtpVerifyScreen";
import { FYNLO_COLORS } from "@/constants/theme";
import {
  signUpFormSchemaType,
  signUpSchema,
  verificationCodeFormSchemaType,
  verificationCodeSchema,
} from "@/lib/schemas/auth";
import { useAuth, useSignUp } from "@clerk/expo";
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

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const firstNameInputRef = useRef<TextInput>(null);
  const lastNameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const requestInFlightRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isLoading = fetchStatus === "fetching" || isProcessing;
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string>();
  const [verificationError, setVerificationError] = useState<string>();

  const getClerkErrorMessage = (error: any, fallback: string) =>
    error?.errors?.[0]?.longMessage ?? error?.errors?.[0]?.message ?? fallback;

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
  } = useForm<signUpFormSchemaType>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
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

  const finalizeSignUp = async () => {
    setVerificationError(undefined);
    try {
      const { error: finalizeError } = await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            setVerificationError(
              "Your account needs another step. Continue from sign in.",
            );
            return;
          }
          router.replace(decorateUrl("/") as any);
        },
      });

      if (finalizeError) {
        setVerificationError(
          getClerkErrorMessage(
            finalizeError,
            "Unable to complete sign up. Please try again.",
          ),
        );
      }
    } catch (error) {
      setVerificationError(
        getClerkErrorMessage(
          error,
          "Unable to finish signing in. Please retry.",
        ),
      );
    }
  };

  const onSignUpPress = async (values: signUpFormSchemaType) => {
    await runAuthRequest(async () => {
      setEmail(values.email);
      setFormError(undefined);
      setVerificationError(undefined);

      try {
        const { error } = await signUp.password({
          firstName: values.firstName,
          lastName: values.lastName,
          emailAddress: values.email,
          password: values.password,
        });

        if (error) {
          setFormError(
            getClerkErrorMessage(
              error,
              "Unable to create your account. Please try again.",
            ),
          );
          return;
        }

        const { error: emailCodeError } =
          await signUp.verifications.sendEmailCode();
        if (emailCodeError) {
          setFormError(
            getClerkErrorMessage(
              emailCodeError,
              "We couldn't send a verification code. Please try again.",
            ),
          );
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
    if (!/^\d{6}$/.test(code)) {
      setVerificationError("Enter the 6-digit verification code.");
      return;
    }

    await runAuthRequest(async () => {
      setVerificationError(undefined);

      try {
        const { error } = await signUp.verifications.verifyEmailCode({ code });

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

        if (signUp.status === "complete") {
          await finalizeSignUp();
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
        const { error } = await signUp.verifications.sendEmailCode();
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

  if (isSignedIn) return null;
  if (signUp.status === "complete") {
    return (
      <AuthWrapper>
        <View className="flex-1 justify-center gap-5 px-fynlo-page">
          <Text className="font-poppins-semibold text-fynlo-title text-fynlo-text-primary">
            Your email is verified
          </Text>
          {verificationError && (
            <Text accessibilityRole="alert" className="text-fynlo-error">
              {verificationError}
            </Text>
          )}
          <AuthButton
            label="Continue to Fynlo"
            isLoading={isLoading}
            onPress={() => runAuthRequest(finalizeSignUp)}
          />
          <AuthButton
            label="Go to sign in"
            onPress={() => router.replace("/sign-in")}
          />
        </View>
      </AuthWrapper>
    );
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <OtpVerifyScreen
        email={email}
        control={verificationCodeControl}
        error={verificationCodeErrors.verificationCode?.message}
        clerkError={verificationError || errors.fields.code?.message}
        isLoading={isLoading}
        onVerify={handleVerificationCodeSubmit(onVerifyCodePress)}
        onResend={onResendVerificationCodePress}
        onBack={() => {
          setVerificationError(undefined);
          signUp.reset();
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
        <AuthTopBar
          onBack={() =>
            router.canGoBack() ? router.back() : router.replace("/sign-in")
          }
        />

        <View className="mt-fynlo-form-offset">
          <Text className="font-poppins-semibold text-fynlo-display text-fynlo-text-primary">
            Create your account.
          </Text>
          <Text className="mt-3 max-w-[320px] font-poppins-regular text-fynlo-body text-fynlo-text-secondary">
            Set up Fynlo and take control of every rupee.
          </Text>
        </View>

        <View className="mt-10">
          <Text className="mb-2 font-poppins-medium text-fynlo-label text-fynlo-text-secondary">
            Your name
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <AuthInput
                control={control}
                name="firstName"
                placeholder="First name"
                autoCapitalize="words"
                icon="account-outline"
                autoComplete="given-name"
                inputRef={firstNameInputRef}
                returnKeyType="next"
                onFocus={() =>
                  scrollFocusedInputIntoView(firstNameInputRef.current)
                }
                onSubmitEditing={() => lastNameInputRef.current?.focus()}
                error={formErrors.firstName?.message}
                submitBehavior="submit"
              />
            </View>
            <View className="flex-1">
              <AuthInput
                control={control}
                name="lastName"
                placeholder="Last name"
                autoCapitalize="words"
                icon="account-outline"
                autoComplete="family-name"
                inputRef={lastNameInputRef}
                returnKeyType="next"
                onFocus={() =>
                  scrollFocusedInputIntoView(lastNameInputRef.current)
                }
                onSubmitEditing={() => emailInputRef.current?.focus()}
                error={formErrors.lastName?.message}
                submitBehavior="submit"
              />
            </View>
          </View>

          <Text className="mb-2 mt-5 font-poppins-medium text-fynlo-label text-fynlo-text-secondary">
            Email address
          </Text>
          <AuthInput
            control={control}
            name="email"
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            icon="email-outline"
            autoComplete="email"
            inputRef={emailInputRef}
            returnKeyType="next"
            submitBehavior="submit"
            onFocus={() => scrollFocusedInputIntoView(emailInputRef.current)}
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            error={
              formErrors.email?.message || errors.fields.emailAddress?.message
            }
          />

          <Text className="mb-2 mt-5 font-poppins-medium text-fynlo-label text-fynlo-text-secondary">
            Password
          </Text>
          <AuthInput
            control={control}
            name="password"
            placeholder="Create a password"
            secureTextEntry
            autoCapitalize="none"
            icon="lock-outline"
            autoComplete="new-password"
            inputRef={passwordInputRef}
            returnKeyType="done"
            submitBehavior="blurAndSubmit"
            onFocus={() => scrollFocusedInputIntoView(passwordInputRef.current)}
            onSubmitEditing={handleSubmit(onSignUpPress)}
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

          <View className="mt-7 gap-5">
            <AuthButton
              label="Sign up"
              onPress={handleSubmit(onSignUpPress)}
              isLoading={isLoading}
            />

            <View className="flex-row items-center gap-3">
              <View className="h-px flex-1 bg-fynlo-divider" />
              <Text className="font-poppins-regular text-fynlo-label text-fynlo-text-muted">
                Or continue with
              </Text>
              <View className="h-px flex-1 bg-fynlo-divider" />
            </View>
            <HostedAuthButton mode="sign-up" />

            <AuthFooter
              label="Already have an account?"
              linkText="Sign in"
              href="/sign-in"
            />
          </View>
        </View>

        <View nativeID="clerk-captcha" />
      </ScrollView>
    </AuthWrapper>
  );
}
