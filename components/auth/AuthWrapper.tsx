import { KeyboardAvoidingView } from "react-native";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-brand-body">
      {children}
    </KeyboardAvoidingView>
  );
}
