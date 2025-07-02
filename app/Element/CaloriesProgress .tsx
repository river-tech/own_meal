import React from "react";
import { View, Text, useColorScheme } from "react-native";
import Svg, { Circle } from "react-native-svg"; // Import SVG components
import { FireIcon } from "react-native-heroicons/outline"; // Flame icon

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
  const percentage = (consumedCalories / totalCalories) * 100;

  return (
    <View
      className={`flex-row justify-between items-center px-4 py-3 mx-auto rounded-xl mb-6 w-[90%] ${
        isDark ? "bg-[#3B3B3B] border border-[#FF6E6C]" : "bg-white  border border-[#FF6E6C]"
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
        <Svg width="50" height="50" viewBox="0 0 36 36">
        
          <Circle
            cx="18"
            cy="18"
            r="15"
            stroke={isDark ? "#2D2D2D" : "#E0E0E0"}
            strokeWidth="3"
            fill="none"
          />
       
          <Circle
            cx="18"
            cy="18"
            r="15"
            stroke={isDark ? "#FB923C" : "#FB923C"}
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${percentage} 100`} 
            strokeLinecap="round"
            transform="rotate(-90 18 18)" 
          />
        </Svg>

       
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
