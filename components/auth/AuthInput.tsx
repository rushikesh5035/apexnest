import { FYNLO_COLORS } from "@/constants/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { type RefObject, useState } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import {
  KeyboardTypeOptions,
  Pressable,
  Text,
  TextInput,
  TextInputProps,
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
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  disableAutofill?: boolean;
  autoComplete?: TextInputProps["autoComplete"];
  autoCorrect?: boolean;
  maxLength?: number;
  returnKeyType?: TextInputProps["returnKeyType"];
  submitBehavior?: TextInputProps["submitBehavior"];
  inputRef?: RefObject<TextInput | null>;
  onFocus?: TextInputProps["onFocus"];
  onSubmitEditing?: TextInputProps["onSubmitEditing"];
  accessibilityLabel?: string;
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
  autoComplete,
  autoCorrect = false,
  maxLength,
  returnKeyType,
  submitBehavior,
  inputRef,
  onFocus,
  onSubmitEditing,
  accessibilityLabel,
}: Props<TFieldValues>) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur } }) => (
          <View className="relative w-full">
            {icon && (
              <View
                pointerEvents="none"
                className="absolute bottom-0 left-4 top-0 z-10 justify-center"
              >
                <MaterialCommunityIcons
                  name={icon}
                  size={20}
                  color={FYNLO_COLORS.textMuted}
                />
              </View>
            )}
            <TextInput
              ref={inputRef}
              accessibilityLabel={accessibilityLabel ?? placeholder}
              className={`h-14 w-full rounded-full border border-fynlo-border bg-fynlo-input px-4 py-0 font-poppins-regular text-fynlo-body text-fynlo-text-primary ${icon ? "pl-12" : ""} ${secureTextEntry ? "pr-14" : ""} ${className}`}
              placeholder={placeholder}
              placeholderTextColor={FYNLO_COLORS.placeholder}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              secureTextEntry={secureTextEntry && !passwordVisible}
              autoCapitalize={autoCapitalize}
              keyboardType={keyboardType}
              autoComplete={disableAutofill ? "off" : autoComplete}
              autoCorrect={autoCorrect}
              maxLength={maxLength}
              returnKeyType={returnKeyType}
              submitBehavior={submitBehavior}
              onSubmitEditing={onSubmitEditing}
              importantForAutofill={disableAutofill ? "no" : "auto"}
              selectionColor={FYNLO_COLORS.primary}
              style={{ textAlignVertical: "center" }}
            />
            {secureTextEntry && (
              <Pressable
                onPress={() => setPasswordVisible((visible) => !visible)}
                accessibilityRole="button"
                accessibilityLabel={
                  passwordVisible ? "Hide password" : "Show password"
                }
                android_ripple={{
                  color: FYNLO_COLORS.border,
                  borderless: false,
                }}
                className="absolute right-1 top-0 h-14 w-12 items-center justify-center rounded-full"
                style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}
              >
                <MaterialCommunityIcons
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={FYNLO_COLORS.textMuted}
                />
              </Pressable>
            )}
          </View>
        )}
      />
      {error && (
        <Text
          accessibilityRole="alert"
          className="mt-1 px-3 font-poppins-regular text-fynlo-caption text-fynlo-error"
        >
          {error}
        </Text>
      )}
    </>
  );
}
