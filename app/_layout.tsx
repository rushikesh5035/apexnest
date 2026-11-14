import { queryClient } from "@/lib/query/client";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          <Slot />
        </ClerkProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
