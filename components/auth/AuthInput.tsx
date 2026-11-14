import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import {
  KeyboardTypeOptions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  placeholder: string;
  error?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "words" | "sentences";
  keyboardType?: KeyboardTypeOptions;
  className?: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  disableAutofill?: boolean;
  onFocus?: () => void;
};

export default function AuthInput<TFieldValues extends FieldValues>({
  control,
  name,
  placeholder,
  error,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
  className,
  icon,
  disableAutofill = false,
  onFocus,
}: Props<TFieldValues>) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur } }) => (
          <View className="relative">
            {icon && (
              <Ionicons
                name={icon}
                size={18}
                color={COLORS.textSecondary}
                style={{ position: "absolute", left: 14, top: 14, zIndex: 1 }}
              />
            )}
            <TextInput
              className={`mb-2 rounded-2xl border border-brand-border bg-white px-3 py-3 font-poppins-regular text-[14px] text-brand-text-primary ${icon ? "pl-11" : ""} ${secureTextEntry ? "pr-11" : ""} ${className}`}
              placeholder={placeholder}
              placeholderTextColor={COLORS.border}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              secureTextEntry={secureTextEntry && !passwordVisible}
              autoCapitalize={autoCapitalize}
              keyboardType={keyboardType}
              autoComplete={disableAutofill ? "off" : undefined}
              importantForAutofill={disableAutofill ? "no" : "auto"}
            />
            {secureTextEntry && (
              <TouchableOpacity
                onPress={() => setPasswordVisible((visible) => !visible)}
                accessibilityRole="button"
                accessibilityLabel={
                  passwordVisible ? "Hide password" : "Show password"
                }
                className="absolute right-3 top-2 h-8 w-8 items-center justify-center"
              >
                <Ionicons
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                  size={19}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      {error && (
        <Text className="mb-1 font-poppins-regular text-[12px] text-brand-error">
          {error}
        </Text>
      )}
    </>
  );
}
