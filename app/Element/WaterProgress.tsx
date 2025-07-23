import React from "react";
import { View, Text, useColorScheme, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faDroplet } from "@fortawesome/free-solid-svg-icons";
import AnimatedHorizontalBar from "./BarAnimation";

export default function WaterCard({
  currentWater,
  goalWater,
}: {
  currentWater: number;
  goalWater: number;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const currentIntake = currentWater; // L
  const goalIntake = goalWater; // L
  const percentage = goalIntake === 0 ? 0 : (currentIntake / goalIntake) * 100;

  const bgColor = isDark ? "#12232E" : "#BFDBFE";
  const progressBackground = isDark ? "#0F172A" : "#EFF6FF";
  const iconBgColor = isDark ? "#3B82F6" : "#E0F2FE";
  const subTextColor = isDark ? "text-gray-300" : "text-gray-500";

  return (
    <View
      className={`rounded-3xl px-4 py-3  mt-4 flex-row w-[90%] mx-auto items-center`}
      style={{
        backgroundColor: bgColor,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      {/* Icon */}
      <View
        className="rounded-full w-16 h-16 items-center justify-center mr-4 shadow-md"
        style={{ backgroundColor: iconBgColor }}
      >
        <FontAwesomeIcon size={24} color="#22C3E6" icon={faDroplet} />
      </View>

      {/* Content */}
      <View className="flex-1 flex-col justify-end gap-2 mt-5">
        <AnimatedHorizontalBar
          width={250} // Full width of the bar
          height={10}
          consumed={currentIntake}
          target={goalIntake}
          color="#22C3E6"
          backgroundColor={progressBackground}
          borderRadius={5}
        />

        <Text className="text-center font-bold text-lg text-black dark:text-white">
          {currentIntake}/
          <Text className={`font-normal ${subTextColor}`}> {goalIntake} L</Text>
        </Text>
      </View>
    </View>
  );
}
