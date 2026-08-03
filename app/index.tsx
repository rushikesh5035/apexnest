import { Redirect } from "expo-router";

export default function Index() {
  // const isSigned = true;

  // if (isSigned) return <Redirect href={"/(root)/(tabs)/index"} />;

  return <Redirect href={"/(root)/(tabs)"} />;
}
