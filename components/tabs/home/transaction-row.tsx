import { Transaction } from "@/lib/services/transactions";
import React from "react";
import { Text, View } from "react-native";

export default function TransactionRow({
  tx,
  onDelete,
}: {
  tx: Transaction;
  onDelete?: () => void;
}) {
  return (
    <View>
      <Text>TransactionRow</Text>
    </View>
  );
}
