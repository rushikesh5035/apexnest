import { Link } from "expo-router";
import { Text, View } from "react-native";

type Props = {
  label: string;
  linkText: string;
  href: "/sign-in" | "/sign-up";
};

export default function AuthFooter({ label, linkText, href }: Props) {
  return (
    <View className="flex-row justify-center">
      <Text className="font-poppins-regular text-[12px] text-brand-text-primary">
        {label}{" "}
      </Text>
      <Link href={href}>
        <Text className="font-poppins-semibold text-[12px] text-brand-primary">
          {linkText}
        </Text>
      </Link>
    </View>
  );
}
