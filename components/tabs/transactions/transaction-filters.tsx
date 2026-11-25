import { FYNLO_COLORS as colors } from "@/constants/theme";
import type { Account } from "@/lib/services/accounts";
import { Feather } from "@expo/vector-icons";
import { IconSearch, IconXFilled } from "@tabler/icons-react-native";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

const types = ["All", "Income", "Expense"] as const;
export type TypeFilter = (typeof types)[number];

type Props = {
  search: string;
  onSearch: (value: string) => void;
  type: TypeFilter;
  onType: (value: TypeFilter) => void;
  accounts: Account[];
  accountId: string | null;
  onAccount: (id: string | null) => void;
};

export default function TransactionFilters({
  search,
  onSearch,
  type,
  onType,
  accounts,
  accountId,
  onAccount,
}: Props) {
  return (
    <View className="gap-2">
      <View className="min-h-12 flex-row items-center gap-3 rounded-xl bg-fynlo-surface px-4">
        <IconSearch size={22} color={colors.textSecondary} />
        <TextInput
          accessibilityLabel="Search transactions"
          placeholder="Search transactions"
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.primary}
          returnKeyType="search"
          value={search}
          onChangeText={onSearch}
          className="flex-1 py-2 font-poppins-regular text-fynlo-label text-fynlo-text-primary"
        />
        {!!search && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={10}
            onPress={() => onSearch("")}
          >
            <IconXFilled size={22} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>

      <View className="flex-row rounded-2xl bg-fynlo-surface p-1">
        {types.map((value) => {
          const selected = type === value;
          return (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onType(value)}
              className={`min-h-12 flex-1 items-center justify-center rounded-xl ${selected ? "bg-fynlo-primary" : ""}`}
            >
              <Text
                className={`font-poppins-medium text-fynlo-label ${selected ? "text-fynlo-on-primary" : "text-fynlo-text-secondary"}`}
              >
                {value}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        horizontal
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
      >
        <View className="flex-row gap-4">
          {[{ id: null, name: "All accounts" }, ...accounts].map(
            ({ id, name }) => {
              const selected = id === accountId;
              return (
                <Pressable
                  key={id ?? "all"}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => onAccount(id)}
                  className="min-h-12 flex-row items-center gap-2"
                >
                  {selected && (
                    <Feather name="check" size={16} color={colors.primary} />
                  )}
                  <Text
                    className={`font-poppins-medium text-fynlo-caption ${selected ? "text-fynlo-text-primary" : "text-fynlo-text-secondary"}`}
                  >
                    {name}
                  </Text>
                </Pressable>
              );
            },
          )}
        </View>
      </ScrollView>
    </View>
  );
}
