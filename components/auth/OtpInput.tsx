import { FYNLO_COLORS } from "@/constants/theme";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import DigitCells from "./DigitCells";

const OTP_LENGTH = 6;

type Props = {
  value: string;
  onChange: (value: string) => void;
  onComplete?: () => void;
  editable?: boolean;
  hasError?: boolean;
  focusRequest?: number;
};

export default function OtpInput({
  value,
  onChange,
  onComplete,
  editable = true,
  hasError = false,
  focusRequest = 0,
}: Props) {
  const input = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (editable && !value && (hasError || focusRequest > 0)) {
      const frame = requestAnimationFrame(() => input.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
  }, [editable, value, focusRequest, hasError]);

  const changeCode = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (digits === value) return;
    onChange(digits);
    if (digits.length === OTP_LENGTH) onComplete?.();
  };

  return (
    <View style={{ opacity: editable ? 1 : 0.65 }}>
      <DigitCells
        value={value}
        focused={focused && editable}
        hasError={hasError}
      />
      <TextInput
        ref={input}
        value={value}
        onChangeText={changeCode}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={onComplete}
        editable={editable}
        keyboardType="number-pad"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        autoCorrect={false}
        caretHidden
        selection={{ start: value.length, end: value.length }}
        returnKeyType="done"
        accessibilityLabel="Six-digit verification code"
        accessibilityState={{ disabled: !editable }}
        underlineColorAndroid="transparent"
        selectionColor={FYNLO_COLORS.primary}
        style={[
          StyleSheet.absoluteFillObject,
          { color: "transparent", backgroundColor: "transparent" },
        ]}
      />
    </View>
  );
}
