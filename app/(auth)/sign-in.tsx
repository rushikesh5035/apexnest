import {
  sigInFormSchemaType,
  signInSchema,
  verificationCodeFormSchemaType,
  verificationCodeSchema,
} from "@/lib/schemas/auth";
import { useSignIn } from "@clerk/expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const isLoading = fetchStatus === "fetching";

  const {
    control,
    handleSubmit,
    formState: { errors: formErros },
  } = useForm<sigInFormSchemaType>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const {
    control: verificationCodeControl,
    handleSubmit: handleVerificationCodeSubmit,
    formState: { errors: verificationCodeError },
  } = useForm<verificationCodeFormSchemaType>({
    resolver: zodResolver(verificationCodeSchema),
    mode: "onBlur",
    defaultValues: {
      verificationCode: "",
    },
  });

  const onSignInPress = async (values: sigInFormSchemaType) => {
    const { error } = await signIn.password({
      emailAddress: values.email,
      password: values.password,
    });

    if (error) return;

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
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
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const onResendVerificationCodePress = async () => {
    await signIn.mfa.sendEmailCode();
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-brand-body"
      >
        <View className="flex-1 justify-center px-6 -mt-16">
          <Image
            source={require("../../assets/images/apexnest.png")}
            className="w-36 h-16 mb-8"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-[#1A1D26] mb-2 leading-tight">
            Verify your account
          </Text>

          <Controller
            control={verificationCodeControl}
            name="verificationCode"
            render={({ field: { value, onChange } }) => {
              return (
                <TextInput
                  className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 mb-2 text-[#1A1D26]"
                  placeholder="Verification Code"
                  placeholderTextColor={"#8A8D96"}
                  value={value}
                  onChangeText={onChange}
                />
              );
            }}
          />
          {verificationCodeError.verificationCode && (
            <Text className="text-brand-coral mb-4 text-sm">
              {verificationCodeError.verificationCode.message}
            </Text>
          )}
          {errors.fields.code && (
            <Text className="text-brand-coral mb-4 text-sm">
              {errors.fields.code.message}
            </Text>
          )}

          <TouchableOpacity
            onPress={handleVerificationCodeSubmit(onVerifyCodePress)}
            className="w-full bg-brand-blue py-4 rounded-xl items-center mb-4"
          >
            {isLoading ? (
              <ActivityIndicator color={"white"} />
            ) : (
              <Text className="text-white font-semibold text-base">Verify</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onResendVerificationCodePress}
            className="py-2"
          >
            <Text className="text-brand-blue text-base">I need a new code</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => signIn.reset()} className="py-2">
            <Text className="text-brand-blue text-base">Start Over</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-brand-body"
    >
      <View className="flex-1 justify-center px-6 -mt-16">
        <Image
          source={require("../../assets/images/apexnest.png")}
          className="w-36 h-16 mb-8"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-[#1A1D26] mb-2 leading-tight">
          Welcome back
        </Text>
        <Text className="text-brand-text-muted text-base mb-8">
          Sign in to your account
        </Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => {
            return (
              <TextInput
                className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 mb-2 text-[#1A1D26]"
                placeholder="Email Address"
                placeholderTextColor={"#8A8D96"}
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
              />
            );
          }}
        />
        {formErros.email && (
          <Text className="text-brand-coral mb-4 text-sm">
            {formErros.email.message}
          </Text>
        )}
        {errors.fields.identifier && (
          <Text className="text-brand-coral mb-4 text-sm">
            {errors.fields.identifier.message}
          </Text>
        )}

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => {
            return (
              <TextInput
                className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 mb-2 text-[#1A1D26]"
                placeholder="Password"
                placeholderTextColor={"#8A8D96"}
                value={value}
                onChangeText={onChange}
                secureTextEntry
              />
            );
          }}
        />
        {formErros.password && (
          <Text className="text-brand-coral mb-4 text-sm">
            {formErros.password.message}
          </Text>
        )}
        {errors.fields.password && (
          <Text className="text-brand-coral mb-4 text-sm">
            {errors.fields.password.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleSubmit(onSignInPress)}
          className="w-full bg-brand-blue py-4 rounded-xl items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <Text className="text-white font-semibold text-base">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-brand-text-muted">
            Don&apos;t have an account?{" "}
          </Text>
          <Link href={"/sign-up"}>
            <Text className="text-brand-blue font-semibold">Sign Up</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
