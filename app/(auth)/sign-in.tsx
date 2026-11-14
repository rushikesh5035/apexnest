import AuthButton from "@/components/auth/AuthButton";
import AuthFooter from "@/components/auth/AuthFooter";
import AuthInput from "@/components/auth/AuthInput";
import AuthWrapper from "@/components/auth/AuthWrapper";
import HostedAuthButton from "@/components/auth/HostedAuthButton";
import OtpVerifyScreen from "@/components/auth/OtpVerifyScreen";
import { COLORS } from "@/constants/theme";
import {
  sigInFormSchemaType,
  signInSchema,
  verificationCodeFormSchemaType,
  verificationCodeSchema,
} from "@/lib/schemas/auth";
import { useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const isLoading = fetchStatus === "fetching";

  const scrollToActiveField = () => {
    scrollViewRef.current?.scrollTo({ y: 250, animated: true });
  };

  useEffect(() => {
    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });

    return () => keyboardHideListener.remove();
  }, []);

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
    formState: { errors: verificationCodeErrors },
  } = useForm<verificationCodeFormSchemaType>({
    resolver: zodResolver(verificationCodeSchema),
    mode: "onBlur",
    defaultValues: { verificationCode: "" },
  });

  const finalizeSignIn = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) return;
        router.replace(decorateUrl("/") as any);
      },
    });
  };

  const onSignInPress = async (values: sigInFormSchemaType) => {
    const { error } = await signIn.password({
      emailAddress: values.email,
      password: values.password,
    });

    if (error) return;

    if (signIn.status === "complete") {
      await finalizeSignIn();
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailCodeFactor) await signIn.mfa.sendEmailCode();
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const onVerifyCodePress = async ({
    verificationCode,
  }: verificationCodeFormSchemaType) => {
    await signIn.mfa.verifyEmailCode({ code: verificationCode });

    if (signIn.status === "complete") {
      await finalizeSignIn();
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const onResendVerificationCodePress = async () => {
    await signIn.mfa.sendEmailCode();
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <OtpVerifyScreen
        control={verificationCodeControl}
        error={verificationCodeErrors.verificationCode?.message}
        clerkError={errors.fields.code?.message}
        isLoading={isLoading}
        onVerify={handleVerificationCodeSubmit(onVerifyCodePress)}
        onResend={onResendVerificationCodePress}
        onReset={() => signIn.reset()}
      />
    );
  }

  return (
    <AuthWrapper>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 bg-brand-primary"
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View
          className="h-[390px] px-6"
          style={{ paddingTop: insets.top + 14 }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 flex-row items-center"
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={25} color="white" />
            <Text className="ml-2 font-poppins-medium text-[16px] text-white">
              Back
            </Text>
          </TouchableOpacity>
          <Text className="mt-3 font-poppins-semibold text-[24px] leading-[32px] text-white">
            Log in to stay on top of your money.
          </Text>
          <Text className="mt-2 font-poppins-regular text-[14px] leading-5 text-white/80 w-[220px] ">
            See your spending clearly and keep your goals moving.
          </Text>
          <View className="absolute bottom-0 left-0 right-0 h-[230px] items-end justify-end">
            <Image
              source={require("../../assets/images/signin-illustration.png")}
              resizeMode="contain"
              className="h-[230px] w-[260px]"
              accessibilityLabel="A secure wallet with rupee savings"
            />
          </View>
        </View>

        <View className="-mt-4 flex-1 rounded-t-[30px] bg-white px-6 pb-8 pt-5">
          <View className="items-center gap-1  mb-4">
            <Text className="text-center font-poppins-semibold text-[24px] leading-8 text-brand-text-primary">
              Sign in
            </Text>
            <Text className="text-center font-poppins-regular text-[12px] leading-5 text-brand-text-secondary">
              Welcome back to Fynlo. Enter your details to continue.
            </Text>
          </View>
          <View className="mt-6 gap-2">
            {/* Email Input */}
            <AuthInput
              control={control}
              name="email"
              placeholder="Email address"
              autoCapitalize="none"
              keyboardType="email-address"
              icon="person-outline"
              onFocus={scrollToActiveField}
              error={
                formErrors.email?.message || errors.fields.identifier?.message
              }
              className="h-[46px] rounded-full border-brand-border px-3 font-poppins-regular text-[14px] text-brand-text-primary"
            />
            {/* Password Input */}
            <AuthInput
              control={control}
              name="password"
              placeholder="Password"
              secureTextEntry
              icon="lock-closed-outline"
              onFocus={scrollToActiveField}
              error={
                formErrors.password?.message || errors.fields.password?.message
              }
              className="h-[46px] rounded-full border-brand-border px-3 font-poppins-regular text-[14px] text-brand-text-primary"
            />
          </View>

          <View className="mt-4 gap-4">
            {/* Sign-in Button */}
            <AuthButton
              label="Sign in"
              onPress={handleSubmit(onSignInPress)}
              isLoading={isLoading}
            />

            <View className="mt-4 flex-row items-center gap-3">
              <View className="h-px flex-1 bg-brand-border-soft" />
              <Text className="font-poppins-regular text-[12px] text-brand-text-secondary">
                Or continue with
              </Text>
              <View className="h-px flex-1 bg-brand-border-soft" />
            </View>

            {/* Sign-in with Google Button*/}
            <HostedAuthButton mode="sign-in" />
          </View>

          <View className="mt-auto items-center pt-8">
            {/*  */}
            <AuthFooter
              label="Don't have an account?"
              linkText="Sign Up"
              href="/sign-up"
            />
          </View>
        </View>
      </ScrollView>
    </AuthWrapper>
  );
}
