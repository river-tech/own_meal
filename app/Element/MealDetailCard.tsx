import { useRouter } from "expo-router";
import React from "react";
import { Text, View, TouchableOpacity, useColorScheme } from "react-native";
import { PlusIcon } from "react-native-heroicons/outline";

interface FoodItem {
  name: string;
  quantity: number;
  carb: number;
  protein: number;
  fat: number;
  total: number;
}

interface Props {
  mealId: number;
  mealName: string;
  foodList: FoodItem[];
  
}

const MealCardWithFoodList = ({ mealId ,mealName, foodList }: Props) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const onAdd = (mealId: number) => () => {
    // Handle add food logic here
    console.log(`Add food to meal with ID: ${mealId}`);
    router.push(`/dashboard/FoodResearch?mealId=${mealId}`);
  }

  return (
    <View
      className={`rounded-2xl overflow-hidden mx-2 mt-4  shadow-md ${
        isDark ? "bg-[#2E2E2E]" : "bg-[#FFDAB9]"
      }`}
    >
      {/* Meal Header */}
      <View
        className={`px-4  py-4  ${
          isDark ? "border-gray-600 bg-[#FF7500]" : "border-white bg-[#FFD0A1]"
        }`}
      >
        <Text
          className={`text-xl font-bold ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          {mealName}
        </Text>
      </View>

      {/* Food list */}
      {foodList.map((item, index) => (
        <View
          key={index}
          
          className={`flex-row justify-between px-4 py-2 border-b ${
            isDark ? "border-gray-600 bg-[#2E2E2E]" : "border-gray-300 bg-white"
          }`}
        >
          <Text className={`text-sm ${isDark ? "text-white" : "text-black"}`}>
            {item.name} : {item.quantity}
          </Text>
          <Text className="text-sm">
            <Text className={isDark ? "text-white" : "text-black"}>C: </Text>
            <Text className="text-[#FF8C1A]">{item.carb} </Text>
            <Text className={isDark ? "text-white" : "text-black"}>P: </Text>
            <Text className="text-red-500">{item.protein} </Text>
            <Text className={isDark ? "text-white" : "text-black"}>F: </Text>
            <Text className="text-[#FF8C1A]">{item.fat} </Text>
            <Text className={isDark ? "text-white" : "text-black"}>
              Total:{" "}
            </Text>
            <Text className="text-orange-600 font-semibold">{item.total}</Text>
          </Text>
        </View>
      ))}

      {/* Add new food row */}
      <View className="flex-row items-center">
        <View className="flex-1 px-4 py-2">
          <Text className="text-md font-medium">
            <Text className={isDark ? "text-white" : "text-black"}>C: </Text>
            <Text className="text-[#FF8C1A]">50 </Text>
            <Text className={isDark ? "text-white" : "text-black"}>P: </Text>
            <Text className="text-red-500">6 </Text>
            <Text className={isDark ? "text-white" : "text-black"}>F: </Text>
            <Text className="text-[#FF8C1A]">0 </Text>
            <Text className={isDark ? "text-white" : "text-black"}>
              Total:{" "}
            </Text>
            <Text className="text-orange-600 font-semibold">260</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={onAdd(mealId)}
          className={`w-24 h-full py-2 justify-center flex-row gap-2 items-center ${
            isDark ? "bg-[#FF7500]" : "bg-[#FFB749]"
          } `}
        >
          <Text className="text-white font-bold text-base">Add</Text>
          <PlusIcon size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MealCardWithFoodList;
