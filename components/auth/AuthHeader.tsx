import { Image, Text } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
};

export default function AuthHeader({ title, subtitle }: Props) {
  return (
    <>
      <Image
        source={require("../../assets/images/apexnest.png")}
        className="w-36 h-16 mb-8"
        resizeMode="contain"
      />
      <Text className="text-3xl font-bold text-[#1A1D26] mb-2 leading-tight">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-brand-text-muted text-base mb-8">{subtitle}</Text>
      )}
    </>
  );
}
