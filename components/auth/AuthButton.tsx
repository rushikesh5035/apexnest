import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
};

export default function AuthButton({ label, onPress, isLoading }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-full items-center rounded-full bg-brand-primary py-3"
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="font-poppins-medium text-[16px] text-white">
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
