import { AI_GRADIENT } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function ProcessingRing() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1100, easing: Easing.linear }),
      -1,
      false,
    );
  }, [rotation]);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={style} className="absolute w-24 h-24">
      <LinearGradient
        colors={[AI_GRADIENT[1], AI_GRADIENT[0], "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 96,
          height: 96,
          borderRadius: 48,
          padding: 3,
        }}
      >
        <View className="flex-1 rounded-full bg-[#161829]" />
      </LinearGradient>
    </Animated.View>
  );
}
