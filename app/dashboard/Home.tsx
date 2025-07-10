import React, { useEffect } from "react";
import {
  View,
  Text,
  useColorScheme,
  FlatList,
  useAnimatedValue,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient"; // nếu dùng expo
import Navbar from "../Element/Navbar";
import DatePickerComponent from "../Element/DatePicker";
import CaloriesProgress from "../Element/CaloriesProgress ";
import NutritionOverview from "../Element/MacroPercent";
import MealCard from "../Element/MealCard";
import { IMealCard } from "../../model/meal";
import Animated from "react-native-reanimated"; // Đảm bảo bạn đã cài Reanimated
import WaterCard from "../Element/WaterProgress";
import { useRouter } from "expo-router";

const meal: IMealCard[] = [
  {
    mealId: 1,
    mealName: "Breakfast",
    currentKcal: 400,
    targetKcal: 500,
    currentCarbs: 100,
    targetCarbs: 120,
    currentProtein: 50,
    targetProtein: 60,
    currentFat: 30,
    targetFat: 40,
  },
  {
    mealId: 2,
    mealName: "Lunch",
    currentKcal: 600,
    targetKcal: 700,
    currentCarbs: 150,
    targetCarbs: 180,
    currentProtein: 70,
    targetProtein: 80,
    currentFat: 40,
    targetFat: 50,
  },
  {
    mealId: 3,
    mealName: "Dinner",
    currentKcal: 500,
    targetKcal: 600,
    currentCarbs: 120,
    targetCarbs: 150,
    currentProtein: 60,
    targetProtein: 70,
    currentFat: 30,
    targetFat: 40,
  },
];

const MealList = ({ meals }: { meals: IMealCard[] }) => {
  return (
    <Animated.FlatList
      data={meals}
      keyExtractor={(item) => item.mealName}
      renderItem={({ item }: { item: IMealCard }) => (
        <MealCard
          mealName={item.mealName}
          currentKcal={item.currentKcal}
          targetKcal={item.targetKcal}
          currentCarb={item.currentCarbs}
          targetCarb={item.targetCarbs}
          currentProtein={item.currentProtein}
          targetProtein={item.targetProtein}
          currentFat={item.currentFat}
          targetFat={item.targetFat}
        />
      )}
      horizontal={true} // Hiển thị các item theo dạng ngang
      showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
      pagingEnabled={true} // Bật tính năng cuộn theo trang
      contentContainerStyle={{ alignItems: "center" }} // Căn giữa các phần tử
      style={{ flex: 1 }} // Đảm bảo FlatList chiếm hết không gian có sẵn
      showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
    />
  );
};

export default function Home() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const lightGradientColors: [string, string] = ["#FFE4C4", "#FFF7ED"];
  const darkBgColor = "#1E1E1E";

  const router = useRouter();

  const [date, setDate] = React.useState(new Date()); // State to hold the selected date

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={!isDark ? lightGradientColors : [darkBgColor, darkBgColor]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Navbar />
        <View className="flex justify-between h-[80%]">
          <DatePickerComponent 
            onDateChange={(date : Date) => setDate(date)}
            initialDate={new Date().toISOString().split("T")[0]} // Format YYYY-MM-DD
          />
          {/* Ensure CaloriesProgress is placed below DatePickerComponent */}
          <CaloriesProgress totalCalories={2000} consumedCalories={80} />
          <NutritionOverview
            currentProtein={80}
            targetProtein={150}
            currentCarb={100}
            targetCarb={200}
            currentFat={70}
            targetFat={70}
          />

          <View className="flex-row justify-between items-center px-4 py-3 mx-auto rounded-xl mb-2 ">
            <MealList meals={meal} />
          </View>
          <View className="w-full flex-row justify-end">
            <TouchableOpacity
              onPress={() => router.push("/dashboard/Detail")}
              className={`px-2 py-3 w-[120px] h-12 rounded-xl items-center justify-center mr-10  ${
                colorScheme === "dark" ? "bg-[#FB923C]" : "bg-[#FF8A00]"
              }`}
            >
              <Text className="text-white font-bold text-lg">See all meal</Text>
            </TouchableOpacity>
          </View>
          <WaterCard currentWater={1} goalWater={2.5} />
        </View>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}
