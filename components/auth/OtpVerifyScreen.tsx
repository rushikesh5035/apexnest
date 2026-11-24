import { verificationCodeFormSchemaType } from "@/lib/schemas/auth";
import { Control } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import AuthButton from "./AuthButton";
import AuthHeader from "./AuthHeader";
import AuthInput from "./AuthInput";
import AuthWrapper from "./AuthWrapper";

type Props = {
  email?: string;
  control: Control<verificationCodeFormSchemaType>;
  error?: string;
  clerkError?: string;
  isLoading: boolean;
  onVerify: () => void;
  onResend: () => void;
  onReset: () => void;
};

export default function OtpVerifyScreen({
  email,
  control,
  error,
  clerkError,
  isLoading,
  onVerify,
  onResend,
  onReset,
}: Props) {
  return (
    <AuthWrapper>
      <View className="flex-1 justify-center px-6 -mt-16">
        <AuthHeader
          title="Verify your account"
          subtitle={email ? `We sent a code to ${email}` : undefined}
        />
        <AuthInput
          control={control}
          name="verificationCode"
          placeholder="Verification Code"
          error={error || clerkError}
        />
        <AuthButton label="Verify" onPress={onVerify} isLoading={isLoading} />
        <TouchableOpacity onPress={onResend} className="py-2">
          <Text className="text-brand-blue text-base">I need a new code</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onReset} className="py-2">
          <Text className="text-brand-blue text-base">Start Over</Text>
        </TouchableOpacity>
      </View>
    </AuthWrapper>
  );
}
