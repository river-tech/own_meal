import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useEffect } from "react";
import {
  useColorScheme,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import Navbar from "../Element/Navbar";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import DatePickerComponent from "../Element/DatePicker";
import NutritionMacro from "../Element/NutritionMacro";
import MealCardWithFoodList from "../Element/MealDetailCard";
import { MinusIcon, PlusIcon } from "react-native-heroicons/outline";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DailyOverview, IWaterIntake } from "model/macro";
import { IMealCard } from "model/meal";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const Detail = () => {
  const colorScheme = useColorScheme();
  const apiUrl = process.env.API_URL;
  const isDark = colorScheme === "dark";
  const lightGradientColors: [string, string] = ["#FFE4C4", "#FFF7ED"];
  const [water, setWater] = React.useState(500);
  const [currentWater, setCurrentWater] = React.useState(0);
  const targetWater = 2000; // Giả sử mục tiêu nước uống là 2000ml
  const darkBgColor = "#1E1E1E";
  const router = useRouter();
  const progress = useSharedValue(0);
  const [date, setDate] = React.useState(new Date());
  const [modalVisible, setModalVisible] = React.useState(false);
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

  const waterOptions = [100, 200, 300, 400, 500, 600, 700, 800, 1000];
  useEffect(() => {
    progress.value = withTiming(currentWater / targetWater, { duration: 300 });
  }, [currentWater]);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });
  const onDecrement = () => {
    if (currentWater > 0) {
      setCurrentWater(currentWater - water); // Giảm 100ml mỗi lần nhấn
    } else {
      setCurrentWater(0); // Đảm bảo không giảm dưới 0
    }
  };
  const onIncrement = () => {
    if (currentWater < targetWater) {
      setCurrentWater(currentWater + water); // Tăng 100ml mỗi lần nhấn
    }
  };

  const getMacroOverview = async () => {
    const userToken = await SecureStore.getItemAsync("userToken");
    const macros = await AsyncStorage.getItem("macroOverview");
    if (macros) {
      setMacroOverview(JSON.parse(macros));
    } else {
      try {
        const res = await axios.get(`${apiUrl}/macro/overview`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        if (res) {
          setMacroOverview(res.data);
          await AsyncStorage.setItem("macroOverview", JSON.stringify(res.data));
        }
      } catch (error) {
        // console.error("Error fetching macro overview:", error);
      }
    }
  };

  const getMealData = async () => {
    const userToken = await SecureStore.getItemAsync("userToken");
    const meals = await AsyncStorage.getItem("mealData");
    if (meals) {
      setMeals(JSON.parse(meals));
    } else {
      try {
        const res = await axios.get(`${apiUrl}/meals`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        if (res) {
          await AsyncStorage.setItem("mealData", JSON.stringify(res.data));
          setMeals(res.data);
        }
      } catch (error) {
        // console.error("Error fetching meal data:", error);
      }
    }
  };

  const getWaterIntake = async () => {
    const userToken = await SecureStore.getItemAsync("userToken");
    const waterIntake = await AsyncStorage.getItem("waterIntake");
    if (waterIntake) {
      setWaterIntake(JSON.parse(waterIntake));
    } else {
      try {
        const res = await axios.get(`${apiUrl}/water/intake`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        if (res) {
          await AsyncStorage.setItem("waterIntake", JSON.stringify(res.data));
          setWaterIntake(res.data);
        }
      } catch (error) {
        // console.error("Error fetching water intake:", error);
      }
    }
  };
  useEffect(() => {
    getMacroOverview();
    getMealData();
    getWaterIntake();
    
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
      console.log("Macro Overview for date:", macroForDate);
      console.log("Meals for date:", mealsForDate);
      console.log("Water Intake for date:", waterForDate);
    }, [date, macroOverview, meals, waterIntake]);
  return (
    <GestureHandlerRootView
      className={`${isDark ? "bg-[#1C1C1E]" : "bg-[#FFF7ED]"} flex-1`}
    >
      <LinearGradient
        colors={!isDark ? lightGradientColors : [darkBgColor, darkBgColor]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View className="absolute top-20 left-4 z-50">
          <TouchableOpacity
            className={`w-10 h-10 rounded-full ${isDark ? "border-[#fff]" : "border-[#FF7500]"}  border-2 dark:bg-[#333] items-center justify-center shadow-md`}
            onPress={() => {
              // TODO: navigation.goBack() nếu bạn dùng React Navigation
              router.back(); // Sử dụng router.back() để quay lại trang trước đó
            }}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              color={isDark ? "#FFF" : "#FF7500"}
              size={20}
            />
          </TouchableOpacity>
        </View>
        <View className="mt-16">
          <Navbar />
        </View>
        <DatePickerComponent
          onDateChange={(date: Date) => setDate(date)}
          initialDate={new Date().toISOString().split("T")[0]} // Format YYYY-MM-DD
        />
        <NutritionMacro
          currentCarb={macroRender ? macroRender.carb.consumed : 0}
          targetCarb={macroRender ? macroRender.carb.target : 0}
          currentProtein={macroRender ? macroRender.protein.consumed : 0}
          targetProtein={macroRender ? macroRender.protein.target : 0}
          currentFat={macroRender ? macroRender.fat.consumed : 0}
          targetFat={macroRender ? macroRender.fat.target : 0}
          currentCalories={macroRender ? macroRender.calories_today : 0}
          targetCalories={macroRender ? macroRender.calories_today : 0}
        />

        {/* Nội dung scroll */}
        <View className="flex-1 px-4 flex-col gap-2 py-2">
          {/* <ScrollView className="flex-1">
            {mealData.map((meal) => (
              <MealCardWithFoodList
                key={meal.id}
                mealId={meal.id}
                mealName={meal.mealName}
                foodList={meal.foodList}
              />
            ))}
          </ScrollView> */}

          {/* Water Tracker nằm dưới cùng */}
          <View className={`flex-col items-center px-6 pb-10 rounded-2xl mt-2`}>
            <View className="w-full flex-col items-center">
              <Text className="text-lg font-semibold">
                <Text className={isDark ? "text-white" : "text-black"}>
                  {currentWater}
                </Text>
                <Text className="text-gray-500"> / {targetWater} L</Text>
              </Text>

              <View className="mt-2 w-full flex-col justify-center items-center">
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => setModalVisible(true)}
                >
                  <Text className="font-semibold text-[#5AD2F4]">
                    {water} ml
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Modal visible={modalVisible} transparent animationType="fade">
              <View className="flex-1 justify-center items-center bg-black/50">
                <View
                  className={`w-64 rounded-lg p-4 ${isDark ? "bg-[#333]" : "bg-white"}`}
                >
                  <Text
                    className={`text-base font-semibold mb-2 ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    Chọn lượng nước:
                  </Text>
                  <FlatList
                    data={waterOptions}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => {
                          setWater(item);
                          setModalVisible(false);
                        }}
                        className="py-2"
                      >
                        <Text
                          className={`text-center ${
                            isDark ? "text-white" : "text-black"
                          }`}
                        >
                          {item} ml
                        </Text>
                      </Pressable>
                    )}
                  />
                  <TouchableOpacity
                    className="mt-2 p-2 rounded-md bg-red-400"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className="text-center text-white">Đóng</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <View className="flex-row items-center w-full justify-between mt-2">
              <TouchableOpacity
                onPress={onDecrement}
                className="w-8 h-8 border border-black rounded-full items-center justify-center"
              >
                <MinusIcon size={18} color={isDark ? "white" : "black"} />
              </TouchableOpacity>

              <View className="flex-1 mx-4">
                <View className="h-4 w-full bg-white rounded-full overflow-hidden border border-blue-300">
                  <Animated.View
                    className="h-full rounded-full"
                    style={[animatedStyle, { backgroundColor: "#5AD2F4" }]}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={onIncrement}
                className="w-8 h-8 border border-black rounded-full items-center justify-center"
              >
                <PlusIcon size={18} color={isDark ? "white" : "black"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

export default Detail;
