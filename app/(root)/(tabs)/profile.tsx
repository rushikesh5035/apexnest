import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/expo";
import BudgetModal from "@/components/common/budget-modal";
import ProfileIdentity from "@/components/tabs/profile/profile-identity";
import ProfileAccounts from "@/components/tabs/profile/profile-accounts";
import ProfileRow from "@/components/tabs/profile/profile-row";
import { useBudgetQuery } from "@/hooks/queries/useBudgetQuery";
import { formatPrice } from "@/lib/utils";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [editingBudget, setEditingBudget] = useState(false);
  const budget = useBudgetQuery();
  const closeBudget = () => setEditingBudget(false);

  function confirmSignOut() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/sign-in");
          } catch {
            Alert.alert("Couldn't sign out", "Please try again.");
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-fynlo-canvas"
    >
      <StatusBar style="light" />
      <Text
        accessibilityRole="header"
        className="px-4 pt-3 pb-4 font-poppins-semibold text-fynlo-title text-fynlo-text-primary"
      >
        Profile
      </Text>
      <ScrollView
        contentContainerClassName="gap-5 px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <ProfileIdentity />
        <ProfileAccounts />
        <View className="gap-3">
          <Text
            accessibilityRole="header"
            className="font-poppins-semibold text-fynlo-title text-fynlo-text-primary"
          >
            Settings
          </Text>
          <View className="overflow-hidden rounded-2xl bg-fynlo-surface">
            <ProfileRow
              icon="sliders"
              title="Monthly budget"
              disabled={budget.isLoading}
              detail={
                budget.isError
                  ? "Couldn't load budget · Tap to retry"
                  : undefined
              }
              value={
                budget.isError
                  ? undefined
                  : budget.isLoading
                    ? "Loading…"
                    : budget.data
                      ? formatPrice(budget.data.amount)
                      : "Set budget"
              }
              onPress={() => {
                if (budget.isError) void budget.refetch();
                else setEditingBudget(true);
              }}
            />
            <ProfileRow
              icon="log-out"
              title="Sign out"
              danger
              onPress={confirmSignOut}
            />
          </View>
        </View>
      </ScrollView>
      {editingBudget && (
        <BudgetModal
          visible
          budget={budget.data ?? null}
          onClose={closeBudget}
          onSaved={closeBudget}
        />
      )}
    </SafeAreaView>
  );
}
