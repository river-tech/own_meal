import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faMars,
  faVenus,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { Imacros } from "model/user";

export enum EUserGoal {
  WEIGHT_LOSS = "Weight Loss",
  WEIGHT_GAIN = "Weight Gain",
  MAINTAIN_WEIGHT = "Maintain Weight",
}

export default function PersonalInformationScreen() {
  const activityOptions = [
    { label: "Sedentary", value: 1.2 },
    { label: "Lightly Active", value: 1.375 },
    { label: "Moderately Active", value: 1.55 },
    { label: "Very Active", value: 1.725 },
    { label: "Extra Active", value: 1.9 },
  ];

  const router = useRouter();
  const darkMode = useColorScheme() === "dark";
  const apiUrl = process.env.API_URL;
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [gender, setGender] = useState<string>("Male");
  const [goal, setGoal] = useState<EUserGoal>(EUserGoal.MAINTAIN_WEIGHT);
  const [heightUnit, setHeightUnit] = useState<string>("Cm");
  const [weightUnit, setWeightUnit] = useState<string>("Kg");
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [unitType, setUnitType] = useState<"height" | "weight" | null>(null);
  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);
  const [bmr, setBMR] = useState(0);
  const [bmi, setBMI] = useState(0);
  const [calorieAdjustment, setCalorieAdjustment] = useState(0);
  const [activity, setActivity] = useState<{ label: string; value: number }>({
    label: "Select",
    value: 0,
  });
  const [change, setChange] = useState(false);
  const [activityLevel, setActivityLevel] = useState(1.2); // Default to Sedentary
  const [isVisibleMore, setIsVisibleMore] = useState(false);
  const [age, setAge] = useState(25); // mặc định hợp lý
  const [bodyfat, setBodyfat] = useState(20);
  const [isActivityModalVisible, setIsActivityModalVisible] = useState(false);
  const inputStyle = `flex-1 mr-2 px-4 py-2 rounded-lg ${darkMode ? "bg-[#2b2b2b] text-white" : "bg-white text-black"}`;
  const labelStyle = `font-semibold ${darkMode ? "text-white" : "text-black"}`;
  const boxStyle = `rounded-lg border border-gray-400 items-center justify-center ${darkMode ? "bg-[#444]" : "bg-white"}`;

  const getMacros = async () => {
    const macros = await SecureStore.getItemAsync("macros");
    if (!macros) {
      try {
        const res = await axios.get(`${apiUrl}/users/view/personal`);
        if (res) {
          const macrosData: Imacros = res.data;
          await SecureStore.setItemAsync("macros", JSON.stringify(macrosData));
        }
      } catch (error) {
        console.error("Error fetching macros:", error);
      }
    } else {
      const macrosData: Imacros = JSON.parse(macros);
      console.log("Fetched Macros:", macrosData);
      setGender(macrosData.gender);
      setHeight(macrosData.height);
      setWeight(macrosData.weight);
      setHeightUnit(macrosData.height_unit);
      setWeightUnit(macrosData.weight_unit);
      setGoal(macrosData.goal as unknown as EUserGoal);
      setBodyfat(macrosData.body_fat);
      const found = activityOptions.find(
        (opt) => opt.value === macrosData.activity_level
      );
      setActivity({
        label: found?.label ?? "Select",
        value: macrosData.activity_level,
      });
      setCalorieAdjustment(macrosData.calories);
    }
  };
  useEffect(() => {
    getMacros();
  }, []);

  const renderUnitModal = () => (
    <Modal
      visible={unitModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setUnitModalVisible(false)}
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View
          className={`w-full max-w-md rounded-xl p-6 ${darkMode ? "bg-[#2b2b2b]" : "bg-white"}`}
        >
          <Text className={`text-lg font-semibold mb-4 ${labelStyle}`}>
            Select Unit
          </Text>
          {(unitType === "height" ? ["Cm", "Ft"] : ["Kg", "Lbs"]).map((u) => (
            <TouchableOpacity
              key={u}
              onPress={() => {
                unitType === "height" ? setHeightUnit(u) : setWeightUnit(u);
                setUnitModalVisible(false);
              }}
              className="py-3 px-4 rounded-lg mb-2 bg-orange-500"
            >
              <Text className="text-white text-center">{u.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setUnitModalVisible(false)}
            className={`mt-4 py-2 px-4 rounded-lg ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}
          >
            <Text
              className={`${darkMode ? "text-white" : "text-black"} text-center`}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderGoalModal = () => (
    <Modal
      visible={isGoalModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setIsGoalModalVisible(false)}
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View
          className={`w-full max-w-md rounded-xl p-6 ${darkMode ? "bg-[#2b2b2b]" : "bg-white"}`}
        >
          <Text className={`text-lg font-semibold mb-4 ${labelStyle}`}>
            Select Your Goal
          </Text>
          {Object.values([
            EUserGoal.WEIGHT_LOSS,
            EUserGoal.WEIGHT_GAIN,
            EUserGoal.MAINTAIN_WEIGHT,
          ]).map((goalOption) => (
            <TouchableOpacity
              key={goalOption}
              onPress={() => {
                setGoal(goalOption);
                setIsGoalModalVisible(false);
              }}
              className="py-3 px-4 rounded-lg mb-2 bg-orange-500"
            >
              <Text className="text-white text-center">{goalOption}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setIsGoalModalVisible(false)}
            className={`mt-4 py-2 px-4 rounded-lg ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}
          >
            <Text
              className={`${darkMode ? "text-white" : "text-black"} text-center`}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  useEffect(() => {
    if (change) {
    }
    const rawWeight = weight;
    const rawHeight = height;
    const a = age;

    if (!rawWeight || !rawHeight || !a) return;

    // Chuyển đổi đơn vị sang kg và cm
    const w = weightUnit === "Lbs" ? rawWeight * 0.453592 : rawWeight;
    const h = heightUnit === "Ft" ? rawHeight * 30.48 : rawHeight;

    let bmrCalc = 0;

    if (gender === "Male") {
      bmrCalc = 88.362 + 13.397 * w + 4.799 * h - 5.677 * a;
    } else {
      bmrCalc = 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;
    }

    const heightInM = h / 100;
    const bmiCalc = w / (heightInM * heightInM);

    let calorieAdj = 0;
    if (goal === EUserGoal.WEIGHT_GAIN) calorieAdj = 250;
    else if (goal === EUserGoal.WEIGHT_LOSS) calorieAdj = -250;

    const tdee = bmrCalc * activityLevel + calorieAdj;

    setBMR(Math.round(bmrCalc)); // BMR gốc
    setBMI(parseFloat(bmiCalc.toFixed(1))); // chỉ 1 chữ số thập phân
    if (change) {
      setCalorieAdjustment(Math.round(tdee)); // tổng calo cần mỗi ngày
    }
    setChange(true);
  }, [
    height,
    weight,
    age,
    gender,
    goal,
    activityLevel,
    weightUnit,
    heightUnit,
  ]);

  const handleSaveChanges = async () => {
    const macrosData: Imacros = {
      height: height, // number
      height_unit: heightUnit, // "Cm" | "Ft"
      weight: weight, // number
      weight_unit: weightUnit, // "Kg" | "Lbs"
      gender: gender, // "Male" | "Female"
      goal: goal, // "GainWeight" | "MaintainWeight" | "LoseWeight"
      body_fat: bodyfat, // number
      activity_level: activity.value, // number
      bmi: bmi, // number
      bmr: bmr, // number
      calories: calorieAdjustment, // number
    };

    try {
      console.log("Saving macros data:", macrosData);
      await SecureStore.setItemAsync("macros", JSON.stringify(macrosData));
    } catch (e) {
      console.error("Error saving macros data:", e);
    }
  };

  const renderActivityModal = () => (
    <Modal
      visible={isActivityModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setIsActivityModalVisible(false)}
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View
          className={`w-full max-w-md rounded-xl p-6 ${darkMode ? "bg-[#2b2b2b]" : "bg-white"}`}
        >
          <Text className={`text-lg font-semibold mb-4 ${labelStyle}`}>
            Select Activity Level
          </Text>
          {activityOptions.map((activityOption) => (
            <TouchableOpacity
              key={activityOption.value}
              onPress={() => {
                setActivity(activityOption);
                setIsActivityModalVisible(false);
                setActivityLevel(activityOption.value);
              }}
              className="py-3 px-4 rounded-lg mb-2 bg-orange-500"
            >
              <Text className="text-white text-center">
                {activityOption.label} ({activityOption.value})
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setIsActivityModalVisible(false)}
            className={`mt-4 py-2 px-4 rounded-lg ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}
          >
            <Text
              className={`${darkMode ? "text-white" : "text-black"} text-center`}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className={`flex-1 ${darkMode ? "bg-[#1e1e1e]" : "bg-[#f7e7d5]"}`}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="bg-[#FF7A00] rounded-b-3xl items-center py-16 px-5 relative">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-16 left-4 w-10 h-10 border-2 border-white rounded-full items-center justify-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} color="#FFF" size={20} />
          </TouchableOpacity>
          <Text className="text-3xl absolute top-20 font-semibold text-white">
            Personal Information
          </Text>
        </View>

        <View className="mt-10 flex-col gap-4 px-4">
          {/* Height & Weight */}
          {[
            {
              label: "Height",
              value: height,
              setter: setHeight,
              unit: heightUnit,
              unitSetter: () => {
                setUnitType("height");
                setUnitModalVisible(true);
              },
            },
            {
              label: "Weight",
              value: weight,
              setter: setWeight,
              unit: weightUnit,
              unitSetter: () => {
                setUnitType("weight");
                setUnitModalVisible(true);
              },
            },
          ].map(({ label, value, setter, unit, unitSetter }) => (
            <View key={label} className="flex-row items-center justify-between">
              <Text className={`font-semibold w-1/4 ${labelStyle}`}>
                {label}
              </Text>
              <TextInput
                value={value.toString()}
                onChangeText={(text) => setter(parseFloat(text) || 0)}
                placeholder={`Enter your ${label.toLowerCase()}`}
                placeholderTextColor={darkMode ? "#aaa" : "#888"}
                keyboardType="numeric"
                className={inputStyle}
              />
              <TouchableOpacity
                onPress={unitSetter}
                className={`w-20 px-3 py-2 ${boxStyle}`}
              >
                <Text className={`${darkMode ? "text-white" : "text-black"}`}>
                  {unit.toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Gender */}
          <View className="flex-row items-center justify-between">
            <Text className={`font-semibold mb-2 ${labelStyle}`}>Gender</Text>
            <View className="flex-row gap-4 w-[50%]">
              {[
                { label: "Male", icon: faMars },
                { label: "Female", icon: faVenus },
              ].map(({ label, icon }) => (
                <TouchableOpacity
                  key={label}
                  onPress={() => setGender(label)}
                  className={`flex-1 flex-row justify-center gap-2 py-2 px-2 rounded-lg items-center ${gender === label ? "bg-orange-500" : darkMode ? "bg-[#333]" : "bg-white"}`}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    color={
                      gender === label ? "#fff" : darkMode ? "#fff" : "#000"
                    }
                  />
                  <Text
                    className={
                      gender === label
                        ? "text-white"
                        : darkMode
                          ? "text-white"
                          : "text-black"
                    }
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Goal */}
          <View>
            <Text className={`font-semibold mb-2 ${labelStyle}`}>Goal</Text>
            <TouchableOpacity
              onPress={() => setIsGoalModalVisible(true)}
              className={`rounded-lg px-4 py-3 ${darkMode ? "bg-[#2b2b2b]" : "bg-white"}`}
            >
              <Text className={`${darkMode ? "text-white" : "text-black"}`}>
                {goal}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setIsVisibleMore(!isVisibleMore)}>
            {isVisibleMore ? (
              <View className="flex-row items-center gap-2">
                <Text className={`${darkMode ? "text-white" : "text-black"}`}>
                  Close
                </Text>
                <FontAwesomeIcon
                  icon={faArrowUp}
                  color={darkMode ? "#fff" : "#000"}
                />
              </View>
            ) : (
              <View className="flex-row items-center gap-2">
                <Text className={`${darkMode ? "text-white" : "text-black"}`}>
                  More
                </Text>
                <FontAwesomeIcon
                  icon={faArrowDown}
                  color={darkMode ? "#fff" : "#000"}
                />
              </View>
            )}
          </TouchableOpacity>

          {isVisibleMore && (
            <View className="flex-col gap-4 mt-4">
              {/* Bodyfat */}
              <View className="flex-row items-center justify-between">
                <Text
                  className={`font-semibold w-1/3 ${darkMode ? "text-white" : "text-black"}`}
                >
                  Bodyfat
                </Text>
                <TextInput
                  placeholder="Enter your bodyfat"
                  keyboardType="numeric"
                  placeholderTextColor={darkMode ? "#aaa" : "#888"}
                  value={bodyfat.toString()}
                  onChangeText={(text) => setBodyfat(parseFloat(text) || 0)}
                  className={`flex-1 mr-2 px-4 py-2 rounded-lg ${darkMode ? "bg-[#2b2b2b] text-white" : "bg-white text-black"}`}
                />
                <View className="px-3 py-2 rounded-lg bg-orange-500">
                  <Text className="text-white font-bold">%</Text>
                </View>
              </View>

              {/* Activity Level */}
              <View>
                <Text
                  className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-black"}`}
                >
                  Activity Level
                </Text>
                <View
                  className={`rounded-lg px-4 py-3 ${darkMode ? "bg-[#2b2b2b]" : "bg-white"}`}
                >
                  <TouchableOpacity
                    onPress={() => setIsActivityModalVisible(true)}
                  >
                    <Text
                      className={`${darkMode ? "text-white" : "text-black"}`}
                    >
                      {activity.label} {activity.value}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* BMR & BMI */}
          <View className="flex-col gap-2 w-full mx-auto">
            {[
              { label: "BMR", value: bmr },
              { label: "BMI", value: bmi },
            ].map(({ label, value }) => (
              <View
                key={label}
                className={`flex-1 p-4 rounded-lg ${darkMode ? "bg-[#3a3a3a]" : "bg-white"}`}
              >
                <Text className="font-semibold text-orange-500">{label}</Text>
                <Text
                  className={`text-xl mt-1 ${darkMode ? "text-white" : "text-black"}`}
                >
                  {value}
                </Text>
              </View>
            ))}
          </View>
          <View
            className={`flex-1 p-4 rounded-lg ${darkMode ? "bg-[#3a3a3a]" : "bg-white"}`}
          >
            <Text className="font-semibold text-orange-500">Calorie</Text>
            <TextInput
              value={calorieAdjustment.toString()}
              onChangeText={(text) =>
                setCalorieAdjustment(parseFloat(text) || 0)
              }
              placeholder="Calorie Adjustment"
              keyboardType="numeric"
              className={`text-xl mt-1  rounded-lg ${darkMode ? " text-white" : " text-black"}`}
            />
          </View>

          {/* Save */}
          <View className="flex-col gap-5 items-end mt-6">
            {/* Macros Settings với underline và mũi tên */}
            <TouchableOpacity
              onPress={() => router.push("/Profile/Personal/MacroSetting")}
              className="flex-row justify-center items-center"
            >
              <Text
                className={`text-lg font-semibold  ${darkMode ? "text-white" : "text-black"}`}
              >
                Macros settings
              </Text>
              <FontAwesomeIcon
                icon={faArrowRight}
                color="#FF7A00"
                size={18}
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>

            {/* Save Button */}
            <TouchableOpacity
              onPress={() => handleSaveChanges()}
              className="bg-orange-500 py-2 px-10 rounded-xl border-2 border-white shadow-lg shadow-black/30"
            >
              <Text className="text-white font-bold text-lg">Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {renderGoalModal()}
        {renderUnitModal()}
        {renderActivityModal()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
