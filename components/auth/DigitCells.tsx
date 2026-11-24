import { FYNLO_COLORS } from "@/constants/theme";
import { Text, View } from "react-native";

type Props = { value: string; focused: boolean; hasError: boolean };

export default function DigitCells({ value, focused, hasError }: Props) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      aria-hidden
      className="flex-row gap-2"
    >
      {Array.from({ length: 6 }, (_, index) => {
        const active = focused && index === Math.min(value.length, 5);
        return (
          <View
            key={index}
            className="min-h-14 flex-1 items-center justify-center rounded-xl border bg-fynlo-input"
            style={{
              borderColor: hasError
                ? FYNLO_COLORS.error
                : active
                  ? FYNLO_COLORS.primary
                  : FYNLO_COLORS.border,
            }}
          >
            <Text className="font-poppins-semibold text-fynlo-title text-fynlo-text-primary">
              {value[index] ?? " "}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
