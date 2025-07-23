import React, { useEffect } from "react";
import { View, Text, useColorScheme } from "react-native";
import Svg, { Circle } from "react-native-svg"; // Import SVG components
import { FireIcon } from "react-native-heroicons/outline"; // Flame icon
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import AnimatedCircularProgress from "./CircleAnimation";



const CaloriesProgress = ({
  totalCalories,
  consumedCalories,
}: {
  totalCalories: number;
  consumedCalories: number;
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Calculate the percentage of calories consumed
  const animatedStroke = useSharedValue(0);
  const radius = 15;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const percent =
      totalCalories === 0 ? 0 : (consumedCalories / totalCalories) * 100;

    const progressLength = (percent / 100) * circumference;

    // animate lên từ từ
    animatedStroke.value = withTiming(progressLength, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, [consumedCalories, totalCalories]);

  // animation props cho strokeDashoffset
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - animatedStroke.value,
  }));

  return (
    <View
      className={`flex-row justify-between items-center px-4 py-3 mx-auto rounded-xl mb-6 w-[90%] ${
        isDark
          ? "bg-[#3B3B3B] border border-[#FF6E6C]"
          : "bg-white  border border-[#FF6E6C]"
      }`}
    >
      {/* Calories text */}
      <View>
        <Text
          className={`text-2xl font-semibold ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          {consumedCalories}/{totalCalories} kcal
        </Text>
        <Text
          className={`text-sm font-medium ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Calories - Today
        </Text>
      </View>

      {/* Circular progress (flame icon with percentage) */}
      <View className="relative">
        <AnimatedCircularProgress
          target={totalCalories}
          consumed={consumedCalories}
          size={50}
          strokeWidth={3}
          color="#FB923C"
          backgroundColor={isDark ? "#2D2D2D" : "#E0E0E0"}
        />
        <View
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: [{ translateX: -12 }, { translateY: -12 }],
          }}
        >
          <FireIcon color={"#FF6E6C"} size={24} />
        </View>
      </View>
    </View>
  );
};

export default CaloriesProgress;
