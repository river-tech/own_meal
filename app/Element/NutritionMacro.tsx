import React from "react";
import { View, Text, useColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  currentCarb: number;
  targetCarb: number;
  currentProtein: number;
  targetProtein: number;
  currentFat: number;
  targetFat: number;
  currentCalories: number;
  targetCalories: number;
}


const NutritionMacro= ({
  currentCarb,
  targetCarb,
  currentProtein,
  targetProtein,
  currentFat,
  targetFat,
  currentCalories,
  targetCalories,
}: Props) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const ProgressBar = ({
    current,
    target,
    color,
  }: {
    current: number;
    target: number;
    color: string;
  }) => {
    const percentage = Math.min((current / target) * 100, 100);
    return (
      <View className="w-full h-3 shadow-xl   bg-white border-white border rounded-full overflow-hidden mt-1 mb-2">
        <View style={{
          width: `${percentage}%`,
          backgroundColor: color,
          borderRadius: 9999, // bo góc tối đa
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 3, // Android shadow
        }}
        className="h-full"
      />
      </View>
    );
  };

  return (
    <View
      className={`mx-4 px-4 py-3 rounded-2xl  ${isDark ? "bg-[#2E2E2E]" : "bg-[#FFB373]"} shadow-md`}
    >
      <View className="flex-row justify-between mb-1">
        <View className="flex-1 flex items-center mr-2">
          <Text className="text-lg font-bold text-white">Carb</Text>
          <ProgressBar current={currentCarb} target={targetCarb} color="#F4A261" />
          <Text className="text-white text-sm font-semibold">{currentCarb} / {targetCarb} g</Text>
        </View>
        <View className="flex-1 flex items-center mx-1">
          <Text className="text-lg font-bold text-white">Protein</Text>
          <ProgressBar current={currentProtein} target={targetProtein} color="#B6474F" />
          <Text className="text-white text-sm font-semibold">{currentProtein} / {targetProtein} g</Text>
        </View>
        <View className="flex-1 flex items-center ml-2">
          <Text className="text-lg font-bold text-white">Fat</Text>
          <ProgressBar current={currentFat} target={targetFat} color="#FF8627" />
          <Text className="text-white text-sm font-semibold">{currentFat} / {targetFat} g</Text>
        </View>
      </View>

      {/* Tổng Calories */}
      <View className="mt-2">
        <ProgressBar current={currentCalories} target={targetCalories} color="#FB923C" />
        <Text className="text-center text-white font-bold text-md mt-1">
          {currentCalories} / {targetCalories} kcal
        </Text>
      </View>
    </View>
  );
};

export default NutritionMacro;
