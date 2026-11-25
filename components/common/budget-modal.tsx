import AuthButton from "@/components/auth/AuthButton";
import { FYNLO_COLORS } from "@/constants/theme";
import { useUpsertBudget } from "@/hooks/mutations/useBudgetMutations";
import { Budget } from "@/lib/services/budgets";
import React, { useEffect, useState } from "react";
import { Text, TextInput } from "react-native";
import FormSheetModal from "./form-sheet-modal";

export default function BudgetModal({
  visible,
  budget,
  onClose,
  onSaved,
}: {
  visible: boolean;
  budget: Budget | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const { mutateAsync: upsertBudget, isPending: saving } = useUpsertBudget();

  useEffect(() => {
    if (visible) {
      setAmount(budget ? String(budget.amount) : "");
      setError("");
    }
  }, [visible, budget]);

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount.replace(/,/g, ""));

    if (!parsedAmount || parsedAmount <= 0) {
      setError("Enter a valid monthly budget.");
      return;
    }

    setError("");

    try {
      await upsertBudget(parsedAmount);
      onSaved();
    } catch (error) {
      console.error("Error while saving budget: ", error);
      setError("Something went wrong. Please try again");
    }
  };

  return (
    <FormSheetModal
      dark
      visible={visible}
      title={budget ? "Edit monthly budget" : "Set monthly budget"}
      onClose={onClose}
    >
      <Text className="font-poppins-medium text-fynlo-label text-fynlo-text-secondary mb-1.5">
        Amount in rupees
      </Text>

      <TextInput
        value={amount}
        onChangeText={(v) => {
          setError("");
          setAmount(v);
        }}
        placeholder="e.g. 50000"
        accessibilityLabel="Monthly budget in rupees"
        placeholderTextColor={FYNLO_COLORS.placeholder}
        keyboardType="numeric"
        autoFocus
        className="bg-fynlo-canvas border border-fynlo-border rounded-xl px-4 py-3 mb-5 font-poppins-medium text-fynlo-body text-fynlo-text-primary"
      />

      {error ? (
        <Text className="text-brand-coral text-xs mb-3">{error}</Text>
      ) : null}

      <AuthButton label="Save budget" onPress={handleSave} isLoading={saving} />
    </FormSheetModal>
  );
}
