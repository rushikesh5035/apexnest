import AuthButton from "@/components/auth/AuthButton";
import AuthFooter from "@/components/auth/AuthFooter";
import AuthInput from "@/components/auth/AuthInput";
import AuthWrapper from "@/components/auth/AuthWrapper";
import HostedAuthButton from "@/components/auth/HostedAuthButton";
import OtpVerifyScreen from "@/components/auth/OtpVerifyScreen";
import { COLORS } from "@/constants/theme";
import {
  signUpFormSchemaType,
  signUpSchema,
  verificationCodeFormSchemaType,
  verificationCodeSchema,
} from "@/lib/schemas/auth";
import { useAuth, useSignUp } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
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

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const isLoading = fetchStatus === "fetching";
  const [email, setEmail] = useState("");

  const scrollToActiveField = () => {
    scrollViewRef.current?.scrollTo({ y: 290, animated: true });
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
  } = useForm<signUpFormSchemaType>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
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

  const onSignUpPress = async (values: signUpFormSchemaType) => {
    setEmail(values.email);

    const { error } = await signUp.password({
      firstName: values.firstName,
      lastName: values.lastName,
      emailAddress: values.email,
      password: values.password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    await signUp.verifications.sendEmailCode();
  };

  const onVerifyCodePress = async ({
    verificationCode,
  }: verificationCodeFormSchemaType) => {
    await signUp.verifications.verifyEmailCode({ code: verificationCode });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          router.replace(decorateUrl("/") as any);
        },
      });
    } else {
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  const onResendVerificationCodePress = async () => {
    await signUp.verifications.sendEmailCode();
  };

  if (signUp.status === "complete" || isSignedIn) return null;

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
        clerkError={errors.fields.code?.message}
        isLoading={isLoading}
        onVerify={handleVerificationCodeSubmit(onVerifyCodePress)}
        onResend={onResendVerificationCodePress}
        onReset={() => signUp.reset()}
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
            Start building better money habits.
          </Text>
          <Text className="mt-2 w-[230px] font-poppins-regular text-[14px] leading-5 text-white/80">
            Create your account and take charge of every rupee.
          </Text>
          <View className="absolute bottom-0 left-0 right-0 h-[200px] items-end justify-end">
            <Image
              source={require("../../assets/images/signup-illustration.png")}
              resizeMode="contain"
              className="h-[230px] w-[260px]"
              accessibilityLabel="A person setting up a rupee budget"
            />
          </View>
        </View>

        <View className="-mt-4 flex-1 rounded-t-[30px] bg-white px-6 pb-8 pt-5">
          <View className="mb-4 items-center gap-1">
            <Text className="text-center font-poppins-semibold text-[24px] leading-8 text-brand-text-primary">
              Create account
            </Text>
            <Text className="text-center font-poppins-regular text-[12px] leading-5 text-brand-text-secondary">
              Set up Fynlo and start managing your money.
            </Text>
          </View>

          <View className="mt-6 gap-2">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <AuthInput
                  control={control}
                  name="firstName"
                  placeholder="First name"
                  autoCapitalize="words"
                  icon="person-outline"
                  disableAutofill
                  onFocus={scrollToActiveField}
                  error={formErrors.firstName?.message}
                  className="h-[46px] rounded-full border-brand-border px-3 font-poppins-regular text-[14px] text-brand-text-primary"
                />
              </View>
              <View className="flex-1">
                <AuthInput
                  control={control}
                  name="lastName"
                  placeholder="Last name"
                  autoCapitalize="words"
                  icon="person-outline"
                  disableAutofill
                  onFocus={scrollToActiveField}
                  error={formErrors.lastName?.message}
                  className="h-[46px] rounded-full border-brand-border px-3 font-poppins-regular text-[14px] text-brand-text-primary"
                />
              </View>
            </View>
            <AuthInput
              control={control}
              name="email"
              placeholder="Email address"
              autoCapitalize="none"
              keyboardType="email-address"
              icon="mail-outline"
              disableAutofill
              onFocus={scrollToActiveField}
              error={
                formErrors.email?.message || errors.fields.emailAddress?.message
              }
              className="h-[46px] rounded-full border-brand-border px-3 font-poppins-regular text-[14px] text-brand-text-primary"
            />
            <AuthInput
              control={control}
              name="password"
              placeholder="Password"
              secureTextEntry
              icon="lock-closed-outline"
              disableAutofill
              onFocus={scrollToActiveField}
              error={
                formErrors.password?.message || errors.fields.password?.message
              }
              className="h-[46px] rounded-full border-brand-border px-3 font-poppins-regular text-[14px] text-brand-text-primary"
            />
          </View>

          <View className="mt-4 gap-4">
            <AuthButton
              label="Sign up"
              onPress={handleSubmit(onSignUpPress)}
              isLoading={isLoading}
            />
            <View className="mt-4 flex-row items-center gap-3">
              <View className="h-px flex-1 bg-brand-border-soft" />
              <Text className="font-poppins-regular text-[12px] text-brand-text-secondary">
                Or continue with
              </Text>
              <View className="h-px flex-1 bg-brand-border-soft" />
            </View>
            <HostedAuthButton mode="sign-up" />
          </View>

          <View className="mt-auto items-center pt-8">
            <AuthFooter
              label="Already have an account ?"
              linkText="Sign In"
              href="/sign-in"
            />
          </View>
          <View nativeID="clerk-captcha" />
        </View>
      </ScrollView>
    </AuthWrapper>
  );
}
