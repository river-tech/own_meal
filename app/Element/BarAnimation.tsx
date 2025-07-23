import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface AnimatedHorizontalBarProps {
  width?: number; // full bar width
  height?: number;
  consumed: number;
  target: number;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
}

const AnimatedHorizontalBar = ({
  width = 100,
  height = 10,
  consumed,
  target,
  color = "#F4A261",
  backgroundColor = "#E0E0E0",
  borderRadius = 5,
}: AnimatedHorizontalBarProps) => {

  const progress = useSharedValue(0);

  useEffect(() => {
    const newWidth = target === 0 ? 0 : Math.min(consumed / target, 1) * width;

    progress.value = withTiming(newWidth, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });
  }, [consumed, target]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: progress.value,
  }));

  return (
    <View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={[
          {
            height,
            borderRadius,
            backgroundColor: color,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

export default AnimatedHorizontalBar;
