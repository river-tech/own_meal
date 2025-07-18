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
import { IMeal } from "model/meal";



const mealData : IMeal[] = [
  {
    id: 1,
    mealName: "Breakfast",
    foodList: [
      {
        id: 1,
        name: "Oatmeal",
        quantity: 150,
        carb: 30,
        protein: 5,
        fat: 3,
        total: 200,
      },
      {
        id: 2,
        name: "Banana",
        quantity: 100,
        carb: 27,
        protein: 1,
        fat: 0,
        total: 100,
      },
      {
        id: 3,
        name: "Eggs",
        quantity: 200,
        carb: 1,
        protein: 14,
        fat: 15,
        total: 250,
      },
    ],
  },
  {
    id: 2,
    mealName: "Lunch",
    foodList: [
      {
        id: 1,
        name: "Grilled Chicken",
        quantity: 200,
        carb: 0,
        protein: 43,
        fat: 6,
        total: 300,
      },
      {
        id: 2,
        name: "Steamed Rice",
        quantity: 150,
        carb: 40,
        protein: 4,
        fat: 1,
        total: 180,
      },
      {
        id: 3,
        name: "Broccoli",
        quantity: 100,
        carb: 7,
        protein: 3,
        fat: 0,
        total: 50,
      },
    ],
  },
  {
    id: 3,
    mealName: "Dinner",
    foodList: [
      {
        id: 1,
        name: "Salmon",
        quantity: 180,
        carb: 0,
        protein: 38,
        fat: 12,
        total: 320,
      },
      {
        id: 2,
        name: "Sweet Potato",
        quantity: 150,
        carb: 35,
        protein: 2,
        fat: 0,
        total: 140,
      },
      {
        id: 3,
        name: "Spinach",
        quantity: 100,
        carb: 4,
        protein: 3,
        fat: 0,
        total: 40,
      },
    ],
  },
];


const Detail = () => {
  const colorScheme = useColorScheme();
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
    }
    else{
      setCurrentWater(0); // Đảm bảo không giảm dưới 0
    }
  };

  const onIncrement = () => {
    if (currentWater < targetWater) {
      setCurrentWater(currentWater + water); // Tăng 100ml mỗi lần nhấn
    }
  };

  useEffect(() => {
    console.log("Selected date:", date.toISOString().split("T")[0]); // Log the selected date in YYYY-MM-DD format
  }, [date]);

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
          currentCarb={100}
          targetCarb={200}
          currentProtein={80}
          targetProtein={150}
          currentFat={70}
          targetFat={70}
          currentCalories={1800}
          targetCalories={2000}
        />

        {/* Nội dung scroll */}
        <View className="flex-1 px-4 flex-col gap-2 py-2">
          <ScrollView className="flex-1">
            {mealData.map((meal) => (
              <MealCardWithFoodList
                key={meal.id}
                mealId={meal.id}
                mealName={meal.mealName}
                foodList={meal.foodList}
               
              />
            ))}
          </ScrollView>

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
