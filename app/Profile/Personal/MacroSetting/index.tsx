import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  faArrowLeft,
  faFire,
  faChevronDown,
  faClock,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";
import moment from "moment"; // npm install moment
import {
  KeyboardAvoidingView,
  Platform,
  // ... các import còn lại
} from "react-native";
// import { EUserDietType } from "model/user";
import * as SecureStore from "expo-secure-store";
import { ImacroDetails, Imacros, IMealDefine } from "model/user";
import { IMeal } from "model/meal";

enum EUserDietType {
  Custom = "Custom",
  Balanced = "Balanced", // 50%C–30%F–20%P
  HighProtein = "HighProtein", // 40%C–30%F–30%P
  LowCarb = "LowCarb", // 25%C–35%F–40%P
  LowFat = "LowFat", // 60%C–15%F–25%P
  HighCarb = "HighCarb", // 65%C–20%F–15%P
}
const DietMacrosDescription: Record<EUserDietType, string> = {
  [EUserDietType.Custom]: "Define your own macros",
  [EUserDietType.Balanced]: "50%C–30%F–20%P",
  [EUserDietType.HighProtein]: "40%C–30%F–30%P",
  [EUserDietType.LowCarb]: "25%C–35%F–40%P",
  [EUserDietType.LowFat]: "60%C–15%F–25%P",
  [EUserDietType.HighCarb]: "65%C–20%F–15%P",
};

export default function MacroSettingsScreen() {
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(
    null
  );
  const darkMode = useColorScheme() === "dark";
  const router = useRouter();
  const [calorieTotal, setCalorieTotal] = useState(2000);
  const [carbPercent, setCarbPercent] = useState(30);
  const [proteinPercent, setProteinPercent] = useState(46);
  const [fatPercent, setFatPercent] = useState(24);
  const [water, setWater] = useState(2.0); // lít
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dietType, setDietType] = useState<EUserDietType>(
    EUserDietType.Balanced
  );
  const [isVisibleDietType, setIsVisibleDietType] = useState(true);
  const [mealNumber, setMealNumber] = useState(3); // Số lượng bữa ăn
  const labelStyle = `${darkMode ? "text-white" : "text-black"}`;

  const [meals, setMeals] = useState<IMealDefine[]>([
    { meal_name: "Meal 1", meal_time: "7:00 AM", percent_calories: 40 },
    { meal_name: "Meal 2", meal_time: "12:00 PM", percent_calories: 35 },
    { meal_name: "Meal 3", meal_time: "7:00 PM", percent_calories: 25 },
  ]);

  const [macroIndex, setMacroIndex] = useState([
    { name: "Carb", gram: 150, calories: 600, color: "#FFA500" },
    { name: "Protein", gram: 100, calories: 400, color: "#B22222" },
    { name: "Fat", gram: 70, calories: 630, color: "#FFA500" },
  ]);

  const getMacros = async () => {
    const macrosStr = await SecureStore.getItemAsync("macros");
    if (macrosStr) {
      const macros: Imacros = JSON.parse(macrosStr);
      setCalorieTotal(macros.calories);
    }
    const macrosData = await SecureStore.getItemAsync("macroDetails");
    if (macrosData) {
      const parsedMacros: ImacroDetails = JSON.parse(macrosData);
      console.log("Parsed Macros:", parsedMacros);
      setCarbPercent(parsedMacros.carb_percent);
      setProteinPercent(parsedMacros.protein_percent);
      setFatPercent(parsedMacros.fat_percent);
      setMealNumber(parsedMacros.meal_number);
      updateMacros(
        parsedMacros.carb_percent,
        parsedMacros.protein_percent,
        parsedMacros.fat_percent
      );
      setDietType(parsedMacros.diet_type);
      setWater(parsedMacros.water_target_ml);
      setMeals(
        parsedMacros.meals.map((meal) => ({
          meal_name: meal.meal_name,
          meal_time: meal.meal_time,
          percent_calories: meal.percent_calories,
        }))
      );
    }
    else{
      //call api to get macros
      try {
        
      } catch (error) {
        
      }
    }
  };
  useEffect(() => {
    getMacros();
  }, []);

  const updateMacros = (carb: number, protein: number, fat: number) => {
    const c = carb;
    const p = protein;
    const f = fat;

    const carbCal = (c / 100) * calorieTotal;
    const proteinCal = (p / 100) * calorieTotal;
    const fatCal = (f / 100) * calorieTotal;

    setMacroIndex([
      {
        name: "Carb",
        gram: Math.round(carbCal / 4),
        calories: Math.round(carbCal),
        color: "#FFA500",
      },
      {
        name: "Protein",
        gram: Math.round(proteinCal / 4),
        calories: Math.round(proteinCal),
        color: "#B22222",
      },
      {
        name: "Fat",
        gram: Math.round(fatCal / 9),
        calories: Math.round(fatCal),
        color: "#FFA500",
      },
    ]);
  };

  useEffect(() => {
    if (
      meals.map((m) => m.percent_calories).reduce((a, b) => a + b, 0) !== 100
    ) {
      setIsError(true);
      setErrorMessage("Tổng phần trăm của các bữa ăn phải bằng 100%");
    }
    if (carbPercent + proteinPercent + fatPercent !== 100) {
      setIsError(true);
      setErrorMessage("Tổng tỷ lệ phần trăm macro phải bằng 100%");
    } else {
      setIsError(false);
      setErrorMessage("");
    }
  }, [meals, carbPercent, proteinPercent, fatPercent]);

  const showTimePicker = (index: number) => {
    setSelectedMealIndex(index);
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
    setSelectedMealIndex(null);
  };
  function distributePercentEvenly(mealCount: number): number[] {
    const base = Math.floor(100 / mealCount);
    const remainder = 100 % mealCount;
    return Array.from({ length: mealCount }, (_, i) =>
      i < remainder ? base + 1 : base
    );
  }

  const handleConfirmTime = (date: Date) => {
    if (selectedMealIndex !== null) {
      const updatedMeals = [...meals];
      updatedMeals[selectedMealIndex].meal_time = moment(date).format("h:mm A");
      setMeals(updatedMeals);
    }
    hideTimePicker();
  };

  const handleSaveChanges = async () => {
    const macrosDetails: ImacroDetails = {
      diet_type: dietType,
      protein_percent: proteinPercent,
      fat_percent: fatPercent,
      carb_percent: carbPercent,
      water_target_ml: water,
      meal_number: mealNumber,
      meals: meals.map((meal: IMealDefine) => ({
        meal_name: meal.meal_name,
        meal_time: meal.meal_time,
        percent_calories: meal.percent_calories,
      })),
    };
    if (!isError) {
      await SecureStore.setItemAsync(
        "macroDetails",
        JSON.stringify(macrosDetails)
      );
    }
    console.log("Macros Details to Save:", macrosDetails);
  };

  const modalDietType = () => (
    <View className="absolute -top-[200px] -left-[20px] -right-[20px]  bottom-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <View className="bg-white rounded-lg p-4 w-4/5 max-w-md">
        <Text className="text-lg font-semibold mb-4 text-black text-center">
          Select Diet Type
        </Text>
        {Object.values(EUserDietType).map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => {
              setDietType(type);
              setIsVisibleDietType(true);
              // Nếu không phải Custom, cập nhật giá trị macro %
              switch (type) {
                case EUserDietType.Balanced:
                  setCarbPercent(50);
                  setFatPercent(30);
                  setProteinPercent(20);
                  updateMacros(50, 20, 30);
                  break;
                case EUserDietType.HighProtein:
                  setCarbPercent(40);
                  setFatPercent(30);
                  setProteinPercent(30);
                  updateMacros(40, 30, 30);
                  break;
                case EUserDietType.LowCarb:
                  setCarbPercent(25);
                  setFatPercent(35);
                  setProteinPercent(40);
                  updateMacros(25, 40, 35);
                  break;
                case EUserDietType.LowFat:
                  setCarbPercent(60);
                  setFatPercent(15);
                  setProteinPercent(25);
                  updateMacros(60, 25, 15);
                  break;
                case EUserDietType.HighCarb:
                  setCarbPercent(65);
                  setFatPercent(20);
                  setProteinPercent(15);
                  updateMacros(65, 15, 20);
                  break;
                default:
                  break;
              }
            }}
            className="py-3 px-4 border-b border-gray-200"
          >
            <Text className="text-black font-medium">
              {type} – {DietMacrosDescription[type]}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => setIsVisibleDietType(true)}
          className="mt-4 py-2 bg-orange-500 rounded-lg items-center"
        >
          <Text className="text-white font-bold">Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPercentInput = (
    placeholder: string,
    value: number,
    setValue: (v: number) => void,
    color?: string
  ) => (
    <TextInput
      keyboardType="numeric"
      value={value.toString()}
      onChangeText={(text) => setValue(Number(text))}
      placeholder={placeholder}
      className={`
      w-[30%] text-center rounded-lg px-3 py-2 border
      ${darkMode ? "text-white bg-[#2b2b2b]" : "text-black bg-white"}
    `}
      style={{
        borderColor: color ?? (darkMode ? "#4B5563" : "#D1D5DB"), // fallback border color
        borderWidth: 1,
      }}
    />
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className={`flex-1  pb-10 ${darkMode ? "bg-[#1e1e1e]" : "bg-[#f7e7d5]"}`}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="bg-[#FF7A00] rounded-b-3xl items-center py-16 relative">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-16 left-4 w-10 h-10 border-2 border-white rounded-full items-center justify-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} color="#FFF" size={20} />
          </TouchableOpacity>
          <Text className="text-3xl absolute top-20 font-semibold text-white">
            Macro settings
          </Text>
        </View>

        <View className="mt-10 gap-6 mx-5">
          {/* Tổng Calo */}
          <View className="flex-row justify-end w-full gap-2  items-center">
            <View className="flex-row justify-start items-center px-4 py-2 rounded-xl border border-orange-500 bg-white shadow-md">
              <Text className="text-xl font-bold text-black">
                {calorieTotal}
              </Text>

              <Text className="text-xl font-bold text-orange-500 ml-1 mr-2">
                {" "}
                kcal
              </Text>
            </View>
            <View className=" bg-orange-300 w-12 h-12 rounded-full items-center justify-center border-4 border-white shadow-md">
              <FontAwesomeIcon icon={faFire} size={20} color="red" />
            </View>
          </View>

          {/* Tỷ lệ phần trăm */}
          {carbPercent + proteinPercent + fatPercent !== 100 ? (
            <Text className="text-red-500 text-center mx-auto text-sm">
              Tổng tỷ lệ phần trăm phải bằng 100%
            </Text>
          ) : (
            <View className="flex-row w-full overflow-hidden border border-white rounded-xl mt-4">
              {[
                {
                  percent: carbPercent,
                  color: "#FFA500",
                  rounded: "rounded-l-xl",
                }, // Carb
                { percent: proteinPercent, color: "#B22222", rounded: "" }, // Protein
                {
                  percent: fatPercent,
                  color: "#FFCC99",
                  rounded: "rounded-r-xl",
                }, // Fat
              ].map(({ percent, color, rounded }, idx) => (
                <View
                  key={idx}
                  className={`py-3 items-center justify-center ${rounded}`}
                  style={{
                    backgroundColor: color,
                    width: `${percent}%` as unknown as number,
                  }}
                >
                  <Text className="text-white text-base font-semibold">
                    {percent} %
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Carb - Protein - Fat */}
          <View className="flex-row justify-between px-2 bg-white rounded-lg py-4 mt-2 shadow-lg">
            {macroIndex.map((macro, idx) => (
              <View key={idx} className="flex-1 items-center gap-1">
                <Text
                  className="text-lg font-semibold"
                  style={{ color: macro.color }}
                >
                  {macro.name}
                </Text>
                <Text className="font-semibold" style={{ color: macro.color }}>
                  {macro.gram} g
                </Text>
                <Text style={{ color: macro.color }}>
                  {macro.calories} kcal
                </Text>
              </View>
            ))}
          </View>

          {/* Diet Type */}
          <View className="flex-row items-center justify-between mt-2">
            <Text className={`font-semibold ${labelStyle}`}>Diet Type</Text>
            <TouchableOpacity
              onPress={() => setIsVisibleDietType(false)}
              className="flex-row items-center bg-orange-500 rounded-full px-4 py-2 gap-2"
            >
              <Text className="text-white font-semibold">{dietType}</Text>
              <FontAwesomeIcon color="white" icon={faChevronDown} size={12} />
            </TouchableOpacity>
          </View>

          {/* Macro % Input */}
          {dietType === EUserDietType.Custom && (
            <View className="flex-col gap-2 mt-2">
              <Text className={`font-semibold mb-1 ${labelStyle}`}>
                Macro Percent
              </Text>
              <View className="flex-row justify-between">
                {renderPercentInput(
                  "Carb",
                  carbPercent,
                  setCarbPercent,
                  "#FFA500"
                )}
                {renderPercentInput(
                  "Protein",
                  proteinPercent,
                  setProteinPercent,
                  "#B22222"
                )}
                {renderPercentInput(
                  "Fat",
                  fatPercent,
                  setFatPercent,
                  "#FFA500"
                )}
              </View>
            </View>
          )}

          {/* Water */}
          <View className="flex-row items-center justify-between gap-2 mt-4">
            <Text className={`font-semibold ${labelStyle}`}>Water Goal</Text>
            <View className="flex-row items-center gap-2">
              <TextInput
                keyboardType="numeric"
                value={water.toString()}
                onChangeText={(text) => setWater(Number(text))}
                placeholder="0.0"
                className={`w-20 h-10 px-3 rounded-lg text-center border ${
                  darkMode
                    ? "bg-[#2b2b2b] text-white border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
              />
              <Text
                className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-600"}`}
              >
                L
              </Text>
            </View>
          </View>

          {/* Meals settings */}

          <View className="flex-row items-center justify-between gap-2 mt-4">
            <Text className={`font-semibold mb-1 ${labelStyle}`}>
              Meal number
            </Text>
            <View className="flex-row items-center gap-2">
              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  onPress={() => {
                    if (mealNumber > 1) {
                      const newNumber = mealNumber - 1;
                      setMealNumber(newNumber);
                      const distributedPercents =
                        distributePercentEvenly(newNumber);
                      const updatedMeals = meals
                        .slice(0, newNumber)
                        .map((meal, index) => ({
                          ...meal,
                          name: `Meal ${index + 1}`,
                          percent_calories: distributedPercents[index],
                        }));
                      console.log("Updated Meals:", updatedMeals);
                      setMeals(updatedMeals);
                    }
                  }}
                  className="bg-gray-200 rounded-full p-2"
                >
                  <FontAwesomeIcon icon={faMinus} />
                </TouchableOpacity>

                <TextInput
                  keyboardType="numeric"
                  value={mealNumber.toString() || ""}
                  onChangeText={(text) => {
                    const num = parseInt(text);
                    if (!text || isNaN(num) || num <= 0) {
                      setMealNumber(0);
                      setMeals([]);
                      return;
                    }

                    setMealNumber(num);
                    const updatedMeals = [...Array(num)].map((_, index) => ({
                      meal_name: `Meal ${index + 1}`,
                      meal_time: meals[index]?.meal_time || "",
                      percent_calories: Math.round(100 / num),
                    }));
                    setMeals(updatedMeals);
                  }}
                  className={`border rounded-lg px-4 py-2 text-center ${
                    darkMode
                      ? "bg-[#2b2b2b] text-white border-gray-600"
                      : "bg-white text-black border-gray-300"
                  }`}
                />

                <TouchableOpacity
                  onPress={() => {
                    const newNumber = mealNumber + 1;
                    setMealNumber(newNumber);
                    const distributedPercents =
                      distributePercentEvenly(newNumber);
                    const updatedMeals = [...Array(newNumber)].map(
                      (_, index) => ({
                        meal_name: `Meal ${index + 1}`,
                        meal_time: meals[index]?.meal_time || "",
                        percent_calories: distributedPercents[index],
                      })
                    );
                    setMeals(updatedMeals);
                  }}
                  className="bg-gray-200 rounded-full p-2"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </TouchableOpacity>
              </View>

              <Text className={`${darkMode ? "text-white" : " text-black"}`}>
                meals
              </Text>
            </View>
          </View>

          <View>
            <Text className={`font-semibold mb-4 ${labelStyle}`}>
              Meals detail:
            </Text>
            {meals.map((meal, idx) => (
              <View
                key={idx}
                className={`flex-row items-center justify-between px-3 py-2 rounded-lg mb-2 ${
                  darkMode ? "bg-[#2b2b2b]" : "bg-white"
                }`}
              >
                {/* Số thứ tự */}
                <Text
                  className={`w-5 text-center ${darkMode ? "text-white" : "text-black"}`}
                >
                  {idx + 1}
                </Text>

                {/* Input tên bữa ăn */}
                <View className=" ml-2 flex-row items-center flex-1   gap-2">
                  <TextInput
                    value={meal.meal_name}
                    onChangeText={(text) => {
                      const newMeals = [...meals];
                      newMeals[idx].meal_name = text;
                      setMeals(newMeals);
                    }}
                    placeholder="Meal name"
                    className={`w-[100px] ml-2 mr-1 border rounded-md px-2 py-1 text-sm ${
                      darkMode
                        ? "text-white bg-[#1e1e1e] border-gray-600"
                        : "text-black bg-white border-gray-300"
                    }`}
                  />

                  {/* Input % */}
                  <View className="flex-row items-center gap-[3px]">
                    <TextInput
                      value={meal.percent_calories?.toString() || ""}
                      onChangeText={(text) => {
                        const newMeals = [...meals];
                        const val = parseFloat(text);
                        newMeals[idx].percent_calories = isNaN(val) ? 0 : val;
                        setMeals(newMeals);
                      }}
                      placeholder="%"
                      keyboardType="numeric"
                      className={`w-14 text-center border rounded-md px-1 py-1 text-sm mr-1 ${
                        darkMode
                          ? "text-white bg-[#1e1e1e] border-gray-600"
                          : "text-black bg-white border-gray-300"
                      }`}
                    />
                    <Text
                      className={`${darkMode ? "text-white" : "text-black"} text-sm`}
                    >
                      %
                    </Text>
                  </View>
                </View>

                {/* Giờ ăn */}
                <Text
                  className={`ml-2 text-xs ${darkMode ? "text-white" : "text-black"}`}
                >
                  {meal.meal_time || "7:00 AM"}
                </Text>

                {/* Nút chọn thời gian */}
                <TouchableOpacity
                  className="ml-2"
                  onPress={() => showTimePicker(idx)}
                >
                  <FontAwesomeIcon
                    icon={faClock}
                    size={16}
                    color={darkMode ? "#fff" : "#000"}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {isError && (
            <View className="mt-1 flex-row items-center justify-center">
              <Text className="text-red-500 text-sm font-medium">
                {errorMessage}
              </Text>
            </View>
          )}
          {/* Save */}
          <TouchableOpacity
            onPress={() => handleSaveChanges()}
            className="bg-orange-500 mb-10 py-3 rounded-xl items-center mt-2"
          >
            <Text className="text-white font-bold text-lg">Save</Text>
          </TouchableOpacity>

          {!isVisibleDietType && modalDietType()}
        </View>
      </ScrollView>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={hideTimePicker}
        isDarkModeEnabled={darkMode}
      />
    </KeyboardAvoidingView>
  );
}
