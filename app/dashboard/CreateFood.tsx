import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const InputRow = ({ label, value, onChange, color }: any) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-row justify-between items-center border-b border-gray-500 py-1">
      <Text
        className={`text-sm ${color ?? (isDark ? "text-white" : "text-black")}`}
      >
        {label}
      </Text>
      <TextInput
        keyboardType="numeric"
        value={value.toString()}
        onChangeText={(val) => onChange(Number(val))}
        className={`w-20 px-2 py-1 rounded text-right ${
          isDark ? "bg-[#444] text-white" : "bg-gray-100 text-black"
        }`}
      />
    </View>
  );
};

export default function CreateFoodScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [foodName, setFoodName] = useState("");
  const [creator, setCreator] = useState("River");
  const [image, setImage] = useState<string | null>(null);

  const [nutrition, setNutrition] = useState({
    calories: 0,
    protein: 0,
    saturated: 0,
    unsaturated: 0,
    trans: 0,
    sugar: 0,
    fiber: 0,
    fat: 0,
    carbs: 0,
    salt: 0,
    potassium: 0,
    calcium: 0,
    iron: 0,
    vitaminA: 0,
    vitaminC: 0,
    sodium: 0,
  });

  const handleChange = (field: string, value: Number) => {
    setNutrition({ ...nutrition, [field]: value });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className={`flex-1   ${isDark ? "bg-[#383838]" : "bg-[#FFE6C7]"}`}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="items-center justify-center">
            {image ? (
              <View className="w-full h-60 rounded overflow-hidden mb-4">
                <Image
                  source={{ uri: image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View className="w-full h-60 bg-gray-300 dark:bg-[#444] rounded items-center justify-center mb-4">
                <Text className="text-gray-500">No Image Selected</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={pickImage}
              className="bg-orange-400 px-6 py-2 mt-5  rounded-xl shadow mb-4"
            >
              <Text className="text-white font-semibold">Upload</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-4 mb-4 mx-2 mt-5">
            {/* Food's name */}
            <View className="flex-row items-center gap-2">
              <View className="bg-orange-400 px-3 py-2 rounded-xl shadow">
                <Text className="text-white font-semibold text-sm">
                  Food’s name
                </Text>
              </View>
              <TextInput
                value={foodName}
                onChangeText={setFoodName}
                className={`flex-1 px-4 py-2 rounded-xl shadow ${
                  isDark ? "bg-[#444] text-white" : "bg-white text-black"
                }`}
                placeholder="Enter food’s name"
                placeholderTextColor={isDark ? "#aaa" : "#666"}
              />
            </View>
          </View>
          <View
            className={`px-4 ${isDark ? "bg-[#333]" : "bg-white"} pt-10 mt-5 `}
          >
            <Text className="text-base font-semibold mb-2 text-gray-400">
              Nutrition / 100g
            </Text>

            <InputRow
              label="Calories (kcal)"
              value={nutrition.calories}
              onChange={(val: Number) => handleChange("calories", val)}
              color="text-orange-400"
            />
            <InputRow
              label="Protein (g)"
              value={nutrition.protein}
              onChange={(val: Number) => handleChange("protein", val)}
              color="text-red-400"
            />

            <InputRow
              label="Fat (g)"
              value={nutrition.carbs}
              onChange={(val: number) => handleChange("fat", val)}
              color="text-orange-400"
            />
            <InputRow
              label="Saturated (g)"
              value={nutrition.saturated}
              onChange={(val: Number) => handleChange("saturated", val)}
            />
            <InputRow
              label="Unsaturated (g)"
              value={nutrition.unsaturated}
              onChange={(val: Number) => handleChange("unsaturated", val)}
            />
            <InputRow
              label="Trans fat (g)"
              value={nutrition.trans}
              onChange={(val: Number) => handleChange("trans", val)}
            />
            <InputRow
              label="Carbohydrate (g)"
              value={nutrition.carbs}
              onChange={(val: number) => handleChange("carbs", val)}
              color="text-orange-400"
            />
            <InputRow
              label="Sugar (g)"
              value={nutrition.sugar}
              onChange={(val: Number) => handleChange("sugar", val)}
            />
            <InputRow
              label="Fiber (g)"
              value={nutrition.fiber}
              onChange={(val: Number) => handleChange("fiber", val)}
            />

            <InputRow
              label="Salt (g)"
              value={nutrition.salt}
              onChange={(val: Number) => handleChange("salt", val)}
            />
            <InputRow
              label="Potassium (mg)"
              value={nutrition.potassium}
              onChange={(val: Number) => handleChange("potassium", val)}
            />
            <InputRow
              label="Calcium (mg)"
              value={nutrition.calcium}
              onChange={(val: Number) => handleChange("calcium", val)}
            />
            <InputRow
              label="Iron (mg)"
              value={nutrition.iron}
              onChange={(val: Number) => handleChange("iron", val)}
            />
            <InputRow
              label="Vitamin A (mg)"
              value={nutrition.vitaminA}
              onChange={(val: Number) => handleChange("vitaminA", val)}
            />
            <InputRow
              label="Vitamin C (mg)"
              value={nutrition.vitaminC}
              onChange={(val: Number) => handleChange("vitaminC", val)}
            />
            <InputRow
              label="Sodium (mg)"
              value={nutrition.sodium}
              onChange={(val: Number) => handleChange("sodium", val)}
            />
          </View>

          <View className="mt-6 px-10 pb-10 flex-row justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
            className="bg-red-500 px-6 py-2 rounded">
              <Text className="text-white font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-orange-500 px-6 py-2 rounded">
              <Text className="text-white font-bold">Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
