import React, { use, useEffect } from "react";
import { View, Text, useColorScheme, TouchableOpacity } from "react-native";
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
import { DailyOverview, IWaterIntake } from "model/macro";
import useAuth from "app/hooks/useAuth";


const MealList = ({ meals }: { meals: IMealCard[] }) => {
  return (
    <Animated.FlatList
      data={meals}
      keyExtractor={(item) => item.id.toString()}
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
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      contentContainerStyle={{ alignItems: "center" }}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <MealCard
          mealName="None data"
          currentKcal={0}
          targetKcal={0}
          currentCarb={0}
          targetCarb={0}
          currentProtein={0}
          targetProtein={0}
          currentFat={0}
          targetFat={0}
        />
      }
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
  const [macroOverview, setMacroOverview] = React.useState<DailyOverview[]>([]);
  const [meals, setMeals] = React.useState<IMealCard[]>([]);
  const [waterIntake, setWaterIntake] = React.useState<IWaterIntake[]>([]);
  const [macroRender, setMacroRender] = React.useState<DailyOverview | null>(
    null
  );
  const [mealRender, setMealRender] = React.useState<IMealCard[]>([]);
  const [waterRender, setWaterRender] = React.useState<IWaterIntake | null>(
    null
  );

  const { syncUser } = useAuth();
  useEffect(() => {
    (async () => {
      await syncUser();
    })();
  }, []);

  useEffect(() => {
    const selectedDate = date.toISOString().split("T")[0]; // Format YYYY-MM-DD
    const macroForDate = macroOverview.find(
      (item) => item.date === selectedDate
    );
    const mealsForDate = meals.filter((meal) => meal.date === selectedDate);
    const waterForDate = waterIntake.find((item) => item.date === selectedDate);

    setMacroRender(macroForDate || null);
    setMealRender(mealsForDate);
    setWaterRender(waterForDate || null);
  }, [date, macroOverview, meals, waterIntake]);

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
            onDateChange={(date: Date) => setDate(date)}
            initialDate={new Date().toISOString().split("T")[0]} // Format YYYY-MM-DD
          />
          {/* Ensure CaloriesProgress is placed below DatePickerComponent */}
          <CaloriesProgress
            totalCalories={
              macroRender ? macroRender.total_calories_consumed : 0
            }
            consumedCalories={macroRender ? macroRender.calories_today : 0}
          />
          <NutritionOverview
            currentProtein={macroRender ? macroRender.protein.consumed : 0}
            targetProtein={macroRender ? macroRender.protein.target : 0}
            currentCarb={macroRender ? macroRender.carb.consumed : 0}
            targetCarb={macroRender ? macroRender.carb.target : 0}
            currentFat={macroRender ? macroRender.fat.consumed : 0}
            targetFat={macroRender ? macroRender.fat.target : 0}
          />

          <View className="flex-row justify-between items-center px-4 py-3 mx-auto rounded-xl mb-2 ">
            <MealList meals={mealRender} />
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
          <WaterCard
            currentWater={waterRender ? waterRender.water_intake : 0}
            goalWater={waterRender ? waterRender.water_goal : 0}
          />
        </View>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}
