import { FYNLO_COLORS as colors, FYNLO_RADIUS } from "@/constants/theme";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import {
  IconCreditCardFilled,
  IconHomeFilled,
  IconSparklesFilled,
  IconSquareRoundedPlusFilled,
  IconUserFilled,
} from "@tabler/icons-react-native";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

import { Platform, View } from "react-native";
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabs = [
  { name: "index", title: "Home", glyph: IconHomeFilled, symbol: "house.fill" },
  {
    name: "transactions",
    title: "Transactions",
    glyph: IconCreditCardFilled,
    symbol: "creditcard.fill",
  },
  {
    name: "add-transaction",
    title: "Add transaction",
    glyph: IconSquareRoundedPlusFilled,
    symbol: "plus.square.fill",
  },
  {
    name: "assistant",
    title: "AI Assistant",
    glyph: IconSparklesFilled,
    symbol: "sparkles",
  },
  {
    name: "profile",
    title: "Profile",
    glyph: IconUserFilled,
    symbol: "person.fill",
  },
] as const;

const pressTiming = {
  duration: 120,
  easing: Easing.out(Easing.quad),
  reduceMotion: ReduceMotion.System,
};

function TabButton({
  children,
  onPressIn,
  onPressOut,
  ...props
}: BottomTabBarButtonProps) {
  const scale = useSharedValue(1);
  const feedback = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <PlatformPressable
      {...props}
      onPressIn={(event) => {
        scale.value = withTiming(0.97, pressTiming);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.value = withTiming(1, pressTiming);
        onPressOut?.(event);
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          {
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          },
          feedback,
        ]}
      >
        {children}
      </Animated.View>
    </PlatformPressable>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  if (Platform.OS === "ios") {
    return (
      <NativeTabs
        backgroundColor={colors.surface}
        tintColor={colors.primary}
        iconColor={{ default: colors.textSecondary, selected: colors.primary }}
      >
        {tabs.map(({ name, title, symbol }) => (
          <NativeTabs.Trigger key={name} name={name}>
            <Label hidden>{title}</Label>
            <Icon sf={symbol} />
          </NativeTabs.Trigger>
        ))}
      </NativeTabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "none",
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarButton: (props) => <TabButton {...props} />,
        tabBarStyle: {
          backgroundColor: colors.canvas,
          borderTopWidth: 0,
          elevation: 0,
          height: 68 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom + 8,
          paddingHorizontal: 16,
        },
      }}
    >
      {tabs.map(({ name, title, glyph: Glyph }, index) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarAccessibilityLabel: title,
            tabBarItemStyle: {
              backgroundColor: colors.surface,
              borderTopLeftRadius: index === 0 ? FYNLO_RADIUS.pill : 0,
              borderBottomLeftRadius: index === 0 ? FYNLO_RADIUS.pill : 0,
              borderTopRightRadius:
                index === tabs.length - 1 ? FYNLO_RADIUS.pill : 0,
              borderBottomRightRadius:
                index === tabs.length - 1 ? FYNLO_RADIUS.pill : 0,
              overflow: "hidden",
            },
            tabBarIconStyle: { width: "100%", height: "100%" },
            tabBarIcon: ({ focused }) => (
              <View
                className={`h-12 w-14 items-center justify-center rounded-full ${focused ? "bg-fynlo-primary" : ""}`}
              >
                <Glyph
                  size={28}
                  color={focused ? colors.onPrimary : colors.textSecondary}
                />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
