import React from "react";
import { View, Text, useColorScheme, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faDroplet } from "@fortawesome/free-solid-svg-icons";

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
  const percentage = Math.min((currentIntake / goalIntake) * 100, 100);

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
      <View className="flex-1 flex-col justify-end mt-5">
        <View
          className="h-4 rounded-full overflow-hidden mb-2"
          style={{ backgroundColor: progressBackground }}
        >
          <LinearGradient
            colors={["#38BDF8", "#60A5FA", "#BFDBFE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: `${percentage}%`, height: "100%" }}
          />
        </View>

        <Text className="text-center font-bold text-lg text-black dark:text-white">
          {currentIntake}/
          <Text className={`font-normal ${subTextColor}`}> {goalIntake} L</Text>
        </Text>
      </View>
    </View>
  );
}
