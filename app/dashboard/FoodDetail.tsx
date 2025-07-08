import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar, faX } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "expo-router/build/hooks";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";

export default function FoodDetailScreen() {
  const isDark = useColorScheme() === "dark";
  const textColor = isDark ? "text-white" : "text-black";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-600";
  const bgHighlight = isDark ? "bg-black/20" : "bg-orange-100";

  const router = useRouter();
  const searchParams = useSearchParams();
  const mealId = searchParams.get("mealId");
  const foodId = searchParams.get("foodId");
  const [rating, setRating] = useState(true);
  const [ratingIndex, setRatingIndex] = useState(10);
  const [size, setSize] = useState(100);

  useEffect(() => {
    console.log(`Meal ID: ${mealId}, Food ID: ${foodId}`);
  }, []);

  const food = {
    name: "Rice",
    creator: "Rivernguyen",
    image:
      "https://i.pinimg.com/736x/79/73/27/797327703f639923c3a3a89ac58fb37d.jpg",
    nutrition: {
      calories: 260,
      protein: 6,
      fat: 0,
      saturated: 0,
      unsaturated: 0,
      trans: 0,
      carbs: 50,
      sugar: 0,
      fiber: 0,
      salt: 0,
      potassium: 0,
      calcium: 0,
      iron: 0,
      vitaminA: 0,
      vitaminC: 0,
      sodium: 0,
    },
  };

  const [nutrition, setNutrition] = useState<INutrition>(food.nutrition);
useEffect(() => {
  const scaleFactor = size / 100;
  setNutrition({
    calories: Math.round(food.nutrition.calories * scaleFactor),
    protein: Math.round(food.nutrition.protein * scaleFactor),
    fat: Math.round(food.nutrition.fat * scaleFactor),
    saturated: Math.round(food.nutrition.saturated * scaleFactor),
    unsaturated: Math.round(food.nutrition.unsaturated * scaleFactor),
    trans: Math.round(food.nutrition.trans * scaleFactor),
    carbs: Math.round(food.nutrition.carbs * scaleFactor),
    sugar: Math.round(food.nutrition.sugar * scaleFactor),
    fiber: Math.round(food.nutrition.fiber * scaleFactor),
    salt: Math.round(food.nutrition.salt * scaleFactor),
    potassium: Math.round(food.nutrition.potassium * scaleFactor),
    calcium: Math.round(food.nutrition.calcium * scaleFactor),
    iron: Math.round(food.nutrition.iron * scaleFactor),
    vitaminA: Math.round(food.nutrition.vitaminA * scaleFactor),
    vitaminC: Math.round(food.nutrition.vitaminC * scaleFactor),
    sodium: Math.round(food.nutrition.sodium * scaleFactor),
  });
}, [size]);

  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        className={`flex-1 ${isDark ? "bg-[#1e1e1e]" : "bg-white"}`}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="relative">
          <Image
            source={{ uri: food.image }}
            className="w-full h-64"
            resizeMode="cover"
          />
          <View className="absolute top-12 left-4 z-50">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full border-2 border-white items-center justify-center"
            >
              <FontAwesomeIcon icon={faX} color="#fff" size={16} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4 mt-4 space-y-1">
          <View className="flex-row items-center justify-between">
            <View className="flex-row justify-between w-full items-center gap-3">
              <View className="flex-col justify-center gap-2">
                <Text className={`${textColor} text-xl font-bold`}>
                  {food.name}
                </Text>
                <Text className={`${subTextColor} text-sm mb-2`}>
                  {food.creator}
                </Text>
                <View className="flex-row justify-start items-end gap-2">
                  <TouchableOpacity
                    onPress={() => {
                      setRating(!rating);
                      if (rating) {
                        setRatingIndex(ratingIndex - 1);
                      } else {
                        setRatingIndex(ratingIndex + 1);
                      }
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faStar}
                      size={20}
                      color={rating ? "#FFB749" : "#ccc"}
                    />
                  </TouchableOpacity>
                  <Text className={`${textColor} text-sm font-semibold mb-1`}>
                    {ratingIndex}
                  </Text>
                </View>
              </View>

              <View className="flex-row h-10 items-center border border-gray-300 rounded-full overflow-hidden">
                <TextInput
                  placeholder="100"
                  value={size.toString()}
                  onChangeText={(text) => setSize(Number(text))}
                  keyboardType="numeric"
                  className="text-center py-1 text-sm w-16 border-r border-gray-300"
                  placeholderTextColor={isDark ? "#ccc" : "#888"}
                  style={{ color: isDark ? "#fff" : "#000" }}
                />

                <Text className="text-sm font-semibold text-orange-600 px-4">
                  gr
                </Text>
              </View>

              <TouchableOpacity className="bg-orange-500 px-8 py-2 rounded-xl">
                <Text className="text-white font-semibold">Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            className={`flex-row justify-between px-4 py-2 mt-5 rounded-xl ${bgHighlight}`}
          >
            <Text className="text-[#F4A261] font-semibold">
              {nutrition.carbs} g{"\n"}Carbohydrate
            </Text>
            <Text className="text-[#FF5E6A] font-semibold">
              {nutrition.protein} g{"\n"}Protein
            </Text>
            <Text className="text-[#FF9C4E] font-semibold">
              {nutrition.fat} g{"\n"}Fat
            </Text>
            <Text className="text-[#FF7500] font-semibold">
              {nutrition.calories}
              {"\n"}Calories
            </Text>
          </View>
        </View>

        <View className="mt-4 px-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className={`${textColor} font-semibold text-base`}>
              Nutrition
            </Text>
            <Text className="text-orange-400 font-semibold">100g</Text>
          </View>

          <View className="border-t flex-row justify-between border-gray-500 py-2">
            <Text className="text-orange-400 font-semibold">
              Calories (kcal)
            </Text>
            <Text className={textColor}>{nutrition.calories}</Text>
          </View>

          <View className="border-t flex-row justify-between border-gray-500 py-2">
            <Text className="text-pink-400 font-semibold">Protein (g)</Text>
            <Text className={textColor}>{nutrition.protein}</Text>
          </View>

          <View className="border-t gap-2 justify-between border-gray-500 py-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-orange-300 font-semibold">Fat (g)</Text>
              <Text className={textColor}>{nutrition.fat}</Text>
            </View>

            <View className="flex-row justify-between items-center ml-4">
              <Text className={textColor}>Saturated (g):</Text>
              <Text className={textColor}>{nutrition.saturated}</Text>
            </View>

            <View className="flex-row justify-between items-center ml-4">
              <Text className={textColor}>Unsaturated (g):</Text>
              <Text className={textColor}>{nutrition.unsaturated}</Text>
            </View>

            <View className="flex-row justify-between items-center ml-4">
              <Text className={textColor}>Trans fat (g):</Text>
              <Text className={textColor}>{nutrition.trans}</Text>
            </View>
          </View>

          <View className="border-t gap-2 border-gray-500 py-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-orange-300 font-semibold">
                Carbohydrate (g)
              </Text>
              <Text className={textColor}>{nutrition.carbs}</Text>
            </View>

            <View className="flex-row justify-between items-center ml-4">
              <Text className={textColor}>Sugar (g):</Text>
              <Text className={textColor}>{nutrition.sugar}</Text>
            </View>

            <View className="flex-row justify-between items-center ml-4">
              <Text className={textColor}>Fiber (g):</Text>
              <Text className={textColor}>{nutrition.fiber}</Text>
            </View>
          </View>

          {[
            ["Salt (g)", nutrition.salt],
            ["Potassium (mg)", nutrition.potassium],
            ["Calcium (mg)", nutrition.calcium],
            ["Iron (mg)", nutrition.iron],
            ["Vitamin A (mg)", nutrition.vitaminA],
            ["Vitamin C (mg)", nutrition.vitaminC],
            ["Sodium (mg)", nutrition.sodium],
          ].map(([label, value], index) => (
            <View
              key={index}
              className="border-t border-gray-500 py-2 flex-row justify-between"
            >
              <Text className={textColor}>{label}</Text>
              <Text className={textColor}>{value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}
