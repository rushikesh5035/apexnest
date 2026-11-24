import { View } from "react-native";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View className="flex-1 bg-fynlo-canvas">{children}</View>;
}
