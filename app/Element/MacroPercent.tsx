import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBowlRice, faDrumstickBite } from "@fortawesome/free-solid-svg-icons";
import { View, Text, useColorScheme } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Svg, { Circle } from "react-native-svg";
import AnimatedCircularProgress from "./CircleAnimation";

const NutritionCard = ({
  title,
  currentAmount,
  targetAmount,
  icon,
  color,
  unit,
}: {
  title: string;
  currentAmount: number;
  targetAmount: number;
  icon: React.ReactNode;
  color: string;
  unit: string;
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const percentage = Math.min((currentAmount / targetAmount) * 100, 100);

  return (
    <View
      className={`w-[30%] p-4 rounded-3xl shadow pb-5 ${isDark ? "bg-[#2D2D2D]" : "bg-white"} items-center`}
      style={{ borderColor: color, borderWidth: 2 }}
    >
      <Text
        className={`text-sm font-medium ${colorScheme === "dark" ? "text-white" : "text-black"} mb-1`}
      >
        {`${currentAmount} / ${targetAmount} ${unit}`}
      </Text>

      <Text className={`text-xl font-bold`} style={{ color }}>
        {title}
      </Text>

      {/* Circle + Icon */}
      <View className="mt-2 relative w-[60px] h-[60px] items-center justify-center">
        <AnimatedCircularProgress
          target={targetAmount}
          consumed={currentAmount}
          size={60}
          strokeWidth={3}
          color={color}
          backgroundColor={isDark ? "#2D2D2D" : "#E0E0E0"}
        />
        {/* Icon ở giữa */}
        <View className="absolute">{icon}</View>
      </View>

      {/* Progress Bar text */}
    </View>
  );
};

export default function NutritionOverview({
  currentCarb,
  targetCarb,
  currentProtein,
  targetProtein,
  currentFat,
  targetFat,
}: {
  currentCarb: number;
  targetCarb: number;
  currentProtein: number;
  targetProtein: number;
  currentFat: number;
  targetFat: number;
}) {
  return (
    <View className="flex-row justify-between mb-6 w-[90%] mx-auto">
      <NutritionCard
        title="Carb"
        currentAmount={currentCarb}
        targetAmount={targetCarb}
        icon={<FontAwesomeIcon icon={faBowlRice} size={24} color="#F4A261" />}
        color="#F4A261"
        unit="g"
      />

      <NutritionCard
        title="Protein"
        currentAmount={currentProtein}
        targetAmount={targetProtein}
        icon={
          <FontAwesomeIcon icon={faDrumstickBite} size={24} color="#B6474F" />
        }
        color="#B6474F"
        unit="g"
      />

      <NutritionCard
        title="Fat"
        currentAmount={currentFat}
        targetAmount={targetFat}
        icon={
          <MaterialCommunityIcons name="peanut" size={24} color="#F4A261" />
        }
        color="#F4A261"
        unit="g"
      />
    </View>
  );
}
