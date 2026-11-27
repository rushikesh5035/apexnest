import { useUser } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { FYNLO_COLORS as colors } from "@/constants/theme";

export default function ProfileIdentity() {
  const { user } = useUser();
  const [busy, setBusy] = useState(false);
  const name =
    user?.fullName || user?.firstName || user?.username || "Your profile";
  async function changePhoto() {
    if (!user || busy) return;
    setBusy(true);
    try {
      if (!(await ImagePicker.requestMediaLibraryPermissionsAsync()).granted) {
        Alert.alert(
          "Photo library access",
          "Allow photo access to change your profile picture.",
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });
      if (result.canceled) return;
      const image = result.assets[0];
      if (!image.base64) throw new Error("Missing image data");
      await user.setProfileImage({
        file: "data:image/jpeg;base64," + image.base64,
      });
    } catch {
      Alert.alert("Couldn't update your photo", "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <View className="flex-row items-center gap-4 rounded-2xl bg-fynlo-surface p-5">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Change profile photo"
        disabled={busy || !user}
        onPress={changePhoto}
        className="h-16 w-16 items-center justify-center rounded-full bg-fynlo-border"
      >
        {busy ? (
          <ActivityIndicator color={colors.primary} />
        ) : user?.hasImage && user.imageUrl ? (
          <Image
            source={{ uri: user.imageUrl }}
            className="h-full w-full rounded-full"
          />
        ) : (
          <Text className="font-poppins-semibold text-fynlo-title text-fynlo-primary">
            {name[0].toUpperCase()}
          </Text>
        )}
        <View className="absolute bottom-0 right-0 h-6 w-6 items-center justify-center rounded-full bg-fynlo-primary">
          <Feather name="camera" size={13} color={colors.onPrimary} />
        </View>
      </Pressable>
      <View className="flex-1 gap-1">
        <Text className="font-poppins-semibold text-fynlo-title text-fynlo-text-primary">
          {name}
        </Text>
        <Text
          selectable
          className="font-poppins-regular text-fynlo-caption text-fynlo-text-secondary"
        >
          {user?.primaryEmailAddress?.emailAddress ??
            user?.emailAddresses[0]?.emailAddress}
        </Text>
      </View>
    </View>
  );
}
