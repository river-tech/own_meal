import React from "react";
import { View, Text, useColorScheme, Dimensions } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBowlRice, faDrumstickBite } from "@fortawesome/free-solid-svg-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const screenWidth = Dimensions.get("window").width;
const VerticalBar = ({
  current,
  target,
  color,
  icon,
}: {
  current: number;
  target: number;
  color: string;
  icon: React.ReactNode;
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  return (
    <View className="items-center mx-1">
      <View
        className="w-3 h-16 rounded-full overflow-hidden bg-white shadow-lg"
        style={{
          justifyContent: "flex-end",
          borderWidth: 1,
          borderColor: "#E5E5E5",
        }}
      >
        <View
          style={{
            height: `${percentage}%`,
            backgroundColor: color,
            width: "100%",
          }}
        />
      </View>
      <View
        className="mt-2 w-8 h-8 rounded-full items-center justify-center bg-white shadow-md"
        style={{ backgroundColor: "white" }}
      >
        {icon}
      </View>
    </View>
  );
};

const MealCard = ({
  mealName,
  currentKcal,
  targetKcal,
  currentCarb,
  targetCarb,
  currentProtein,
  targetProtein,
  currentFat,
  targetFat,
}: {
  mealName: string;
  currentKcal: number;
  targetKcal: number;
  currentCarb: number;
  targetCarb: number;
  currentProtein: number;
  targetProtein: number;
  currentFat: number;
  targetFat: number;
}) => {
  const percentageKcal = Math.min((currentKcal / targetKcal) * 100, 100);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      className={`rounded-2xl p-4 mb-4 mx-3 flex flex-row justify-between items-center shadow-lg ${
        isDark ? "bg-[#3B3B3B]" : "bg-white"
      }`}
      style={{
        backgroundColor: "#FDBA74",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        maxHeight: 200,
        overflow: "hidden",
       width: screenWidth-50, // Đặt chiều rộng cố định cho mỗi MealCard
      }}
    >
      <View className="mb-4 pl-1 pt-2 flex flex-col gap-2 w-[60%]">
        <Text className="text-xl text-white font-medium">{mealName}</Text>
        <Text className="text-base text-black shadow-transparent font-semibold mb-2">
          {currentKcal}/{targetKcal} Kcal
        </Text>

        {/* Horizontal Progress Bar */}
        <View className="w-[80%] h-2 bg-white/30 rounded-full mb-4 shadow-md">
          <View
            className="h-full rounded-full"
            style={{
              width: `${percentageKcal}%`,
              backgroundColor: "#FB923C",
            }}
          />
        </View>
      </View>

      {/* Macro Vertical Bars */}
      <View className="flex-row justify-end w-[40%] items-center">
        <VerticalBar
          current={currentCarb}
          target={targetCarb}
          color="#FBBF24"
          icon={<FontAwesomeIcon icon={faBowlRice} size={18} color="#FBBF24" />}
        />
        <VerticalBar
          current={currentProtein}
          target={targetProtein}
          color="#B91C1C"
          icon={
            <FontAwesomeIcon icon={faDrumstickBite} size={18} color="#B91C1C" />
          }
        />
        <VerticalBar
          current={currentFat}
          target={targetFat}
          color="#F87171"
          icon={
            <MaterialCommunityIcons name="peanut" size={18} color="#F87171" />
          }
        />
      </View>
    </View>
  );
};

export default MealCard;
