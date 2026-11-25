import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FormSheetModal({
  visible,
  title,
  onClose,
  children,
  dark = false,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-end bg-black/40"
      >
        <View
          className={
            dark
              ? "rounded-t-2xl bg-fynlo-surface px-fynlo-page pt-5 pb-8"
              : "bg-brand-body rounded-t-2xl px-5 pt-5 pb-8"
          }
        >
          <Text
            className={
              dark
                ? "mb-4 font-poppins-semibold text-fynlo-title text-fynlo-text-primary"
                : "bg-brand-bg text-base font-semibold mb-4"
            }
          >
            {title}
          </Text>

          {children}

          <TouchableOpacity onPress={onClose} className="py-2 items-center">
            <Text className="text-brand-text-secondary text-sm">Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
