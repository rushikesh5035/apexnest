import { FYNLO_COLORS } from "@/constants/theme";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

type Props = {
  label: string;
  linkText: string;
  href: "/sign-in" | "/sign-up";
};

export default function AuthFooter({ label, linkText, href }: Props) {
  return (
    <View className="min-h-12 flex-row items-center justify-center">
      <Text className="font-poppins-regular text-fynlo-label text-fynlo-text-secondary">
        {label}{" "}
      </Text>
      <Link href={href} asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={linkText}
          android_ripple={{ color: FYNLO_COLORS.border, borderless: false }}
          className="min-h-12 justify-center rounded-full px-2"
          style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}
        >
          <Text className="font-poppins-semibold text-fynlo-label text-fynlo-primary">
            {linkText}
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
