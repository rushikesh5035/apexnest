import { useState } from "react";
import { Alert, ActivityIndicator, Text, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { FYNLO_COLORS as colors } from "@/constants/theme";
import { useAccountsQuery } from "@/hooks/queries/useAccountsQuery";
import { useSetDefaultAccount } from "@/hooks/mutations/useAccountMutation";
import type { Account } from "@/lib/services/accounts";
import { formatPrice } from "@/lib/utils";
import AccountModal from "./AccountModal";
import ProfileRow from "./profile-row";

const types = {
  CASH: { icon: "briefcase", label: "Cash" },
  BANK: { icon: "home", label: "Bank" },
  CREDIT_CARD: { icon: "credit-card", label: "Credit card" },
  SAVINGS: { icon: "shield", label: "Savings" },
} as const;

export default function ProfileAccounts() {
  const {
    data: accounts = [],
    isLoading,
    isError,
    refetch,
  } = useAccountsQuery();
  const { mutateAsync: makeDefault } = useSetDefaultAccount();
  const [editing, setEditing] = useState<Account | "new" | null>(null);
  const [hidden, setHidden] = useState(false);
  const close = () => setEditing(null);
  const balance = (value: number) => (hidden ? "••••" : formatPrice(value));
  async function setDefault() {
    if (!editing || editing === "new") return;
    try {
      await makeDefault(editing.id);
      close();
    } catch {
      Alert.alert("Couldn't change the default account", "Please try again.");
    }
  }
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text
          accessibilityRole="header"
          className="font-poppins-semibold text-fynlo-title text-fynlo-text-primary"
        >
          Accounts
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setEditing("new")}
          className="min-h-12 flex-row items-center gap-1 px-2"
        >
          <Feather name="plus" size={16} color={colors.primary} />
          <Text className="font-poppins-medium text-fynlo-label text-fynlo-primary">
            Add account
          </Text>
        </Pressable>
      </View>
      <View className="overflow-hidden rounded-2xl bg-fynlo-surface">
        {isLoading ? (
          <ActivityIndicator style={{ margin: 20 }} color={colors.primary} />
        ) : isError ? (
          <ProfileRow
            title="Couldn't load accounts"
            detail="Tap to retry"
            icon="refresh-cw"
            onPress={() => refetch()}
          />
        ) : (
          <>
            <View className="flex-row items-center gap-2 border-b border-fynlo-border px-4 py-4">
              <View className="flex-1">
                <Text className="font-poppins-regular text-fynlo-caption text-fynlo-text-secondary">
                  Total balance
                </Text>
                <Text className="font-poppins-semibold text-fynlo-display text-fynlo-text-primary">
                  {balance(accounts.reduce((sum, a) => sum + a.balance, 0))}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  hidden ? "Show profile balances" : "Hide profile balances"
                }
                onPress={() => setHidden(!hidden)}
                className="h-12 w-12 items-center justify-center rounded-full bg-fynlo-border"
              >
                <Feather
                  name={hidden ? "eye-off" : "eye"}
                  size={18}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
            {accounts.length === 0 && (
              <Text className="p-4 font-poppins-regular text-fynlo-label text-fynlo-text-secondary">
                No accounts yet.
              </Text>
            )}
            {accounts.map((account) => (
              <ProfileRow
                key={account.id}
                icon={types[account.type].icon}
                title={account.name}
                detail={
                  types[account.type].label +
                  (account.is_default ? " · Default" : "")
                }
                value={balance(account.balance)}
                onPress={() => setEditing(account)}
              />
            ))}
          </>
        )}
      </View>
      {editing && (
        <AccountModal
          visible
          account={editing === "new" ? null : editing}
          onClose={close}
          onSaved={close}
          onDeleted={close}
          onMadeDefault={setDefault}
        />
      )}
    </View>
  );
}
