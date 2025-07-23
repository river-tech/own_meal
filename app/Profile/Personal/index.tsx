import React, { act, use, useEffect, useState } from "react";
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
import { IPersonalDetails } from "model/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSearchParams } from "expo-router/build/hooks";

export enum EUserGoal {
  GAIN_WEIGHT = "GAIN_WEIGHT",
  MAINTAIN_WEIGHT = "MAINTAIN_WEIGHT",
  LOSE_WEIGHT = "LOSE_WEIGHT",
}

export enum EHeightUnit {
  CM = "CM",
  FT = "FT",
}

export enum EWeightUnit {
  KG = "KG",
  LBS = "LBS",
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
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const useParams = useSearchParams();
  const newUser = useParams.get("newUser");
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [gender, setGender] = useState<boolean | null>(null);
  const [goal, setGoal] = useState<EUserGoal>(EUserGoal.MAINTAIN_WEIGHT);
  const [heightUnit, setHeightUnit] = useState<EHeightUnit>(EHeightUnit.CM);
  const [weightUnit, setWeightUnit] = useState<EWeightUnit>(EWeightUnit.KG);
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
  const [age, setAge] = useState(0); // mặc định hợp lý
  const [bodyfat, setBodyfat] = useState(20);
  const [isActivityModalVisible, setIsActivityModalVisible] = useState(false);
  const inputStyle = `flex-1 mr-2 px-4 py-2 rounded-lg ${darkMode ? "bg-[#2b2b2b] text-white" : "bg-white text-black"}`;
  const labelStyle = `font-semibold ${darkMode ? "text-white" : "text-black"}`;
  const boxStyle = `rounded-lg border border-gray-400 items-center justify-center ${darkMode ? "bg-[#444]" : "bg-white"}`;
  const [err, setErr] = useState<string | null>(null);

  const getPersonalDetails = async () => {
    const personalDetails = await AsyncStorage.getItem("personalDetails");
    if (personalDetails) {
      const personalDetailsData: IPersonalDetails = JSON.parse(personalDetails);
      console.log("Fetched Personal Details:", personalDetailsData);
      setGender(personalDetailsData.gender);
      setHeight(personalDetailsData.height ?? 0);
      setWeight(personalDetailsData.weight ?? 0);
      setHeightUnit(personalDetailsData.heightUnit as EHeightUnit);
      setWeightUnit(personalDetailsData.weightUnit as EWeightUnit);
      setGoal(personalDetailsData.userGoal as unknown as EUserGoal);
      setAge(personalDetailsData.age ?? 0);
      setBodyfat(personalDetailsData.bodyFat ?? 0);
      const found = activityOptions.find(
        (opt) => opt.value === personalDetailsData.activityLevel
      );
      setActivity({
        label: found?.label ?? "Select",
        value: personalDetailsData.activityLevel ?? 1.2,
      });
      setCalorieAdjustment(personalDetailsData.caloriesIndex ?? 0);
      setBMR(personalDetailsData.bmrIndex ?? 0);
      setBMI(personalDetailsData.bmiIndex ?? 0);
    }
  };
  useEffect(() => {
    getPersonalDetails();
  }, []);

  // ô select của unit
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
          {(unitType === "height"
            ? [EHeightUnit.CM, EHeightUnit.FT]
            : [EWeightUnit.KG, EWeightUnit.LBS]
          ).map((u) => (
            <TouchableOpacity
              key={u}
              onPress={() => {
                if (unitType === "height") {
                  setHeightUnit(
                    u === EHeightUnit.CM ? EHeightUnit.CM : EHeightUnit.FT
                  );
                } else {
                  setWeightUnit(
                    u === EWeightUnit.KG ? EWeightUnit.KG : EWeightUnit.LBS
                  );
                }
                setUnitModalVisible(false);
              }}
              className="py-3 px-4 rounded-lg mb-2 bg-orange-500"
            >
              <Text className="text-white text-center">{u}</Text>
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

  // ô select goal
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
            EUserGoal.GAIN_WEIGHT,
            EUserGoal.LOSE_WEIGHT,
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

  // tự dộng tính calo
  useEffect(() => {
    if (change) {
    }
    const rawWeight = weight;
    const rawHeight = height;
    const a = age;

    if (!rawWeight || !rawHeight || !a) return;

    // Chuyển đổi đơn vị sang kg và cm
    const w = weightUnit === "LBS" ? rawWeight * 0.453592 : rawWeight;
    const h = heightUnit === "FT" ? rawHeight * 30.48 : rawHeight;

    const lbm = w * (1 - bodyfat / 100);

    let bmrCalc = 0;

    if (gender === true) {
      bmrCalc = 88.362 + 13.397 * w + 4.799 * h - 5.677 * a;
    } else {
      bmrCalc = 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;
    }

    const heightInM = h / 100;
    const bmiCalc = w / (heightInM * heightInM);

    let calorieAdj = 0;
    if (goal === EUserGoal.GAIN_WEIGHT) calorieAdj = 500;
    else if (goal === EUserGoal.LOSE_WEIGHT) calorieAdj = -500;

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
    const macrosData: IPersonalDetails = {
      height: height, // number
      age: age, // number
      heightUnit: heightUnit, // "Cm" | "Ft"
      weight: weight, // number
      weightUnit: weightUnit, // "Kg" | "Lbs"
      gender: gender, // "Male" | "Female"
      userGoal: goal, // "GainWeight" | "MaintainWeight" | "LoseWeight"
      bodyFat: bodyfat, // number
      activityLevel: activity.value, // number
      bmiIndex: bmi, // number
      bmrIndex: bmr, // number
      caloriesIndex: calorieAdjustment, // number
    };
    console.log("Macros Data:", {
      gender: gender,
      age: age,
      height: height,
      heightUnit: heightUnit,
      userGoal: goal,
      bodyfat: bodyfat || 15,
      activityLevel: activity.value,
      weight: weight,
      weightUnit: weightUnit,
    });

    if (
      !macrosData.height ||
      !macrosData.weight ||
      !macrosData.age ||
      !macrosData.gender ||
      !macrosData.userGoal ||
      !macrosData.bodyFat ||
      !macrosData.activityLevel ||
      !macrosData.bmiIndex ||
      !macrosData.bmrIndex ||
      !macrosData.caloriesIndex
    ) {
      setErr("Please fill in all fields");
      return;
    }
    setErr(null);
    const userToken = await SecureStore.getItemAsync("userToken");
    try {
      const method = newUser ? "POST" : "PUT";
      const url = `${apiUrl}/${newUser ? "users/create/personal" : "users/edit/personal"}`;

      // Gửi yêu cầu với phương thức phù hợp
      const res = await axios({
        method: method,
        url: url,
        data: {
          gender: gender,
          age: age,
          height: height,
          heightUnit: heightUnit,
          userGoal: goal,
          bodyFat: bodyfat || 15,
          activityLevel: activity.value,
          weight: weight,
          weightUnit: weightUnit,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (res) {
        console.log("Personal details saved successfully");
        await AsyncStorage.setItem(
          "personalDetails",
          JSON.stringify(macrosData)
        ); // Lưu thông tin vào AsyncStorage
        router.push("/Profile/Personal/MacroSetting"); // Chuyển hướng đến trang MacroSetting
      }
    } catch (e) {
      // console.error("Error saving personal data:", e);
      setErr("Failed to save personal data. Please try again.");
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
                {activityOption.label} (
                {activityOption.value === 0 ? "Select" : activityOption.value})
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
                  {unit}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
          {/* Age */}
          <View className="flex-row items-center justify-between">
            <Text className={`font-semibold w-1/4 ${labelStyle}`}>Age</Text>
            <TextInput
              value={age.toString()}
              onChangeText={(text) => setAge(parseInt(text, 10) || 0)}
              placeholder="Enter your age"
              placeholderTextColor={darkMode ? "#aaa" : "#888"}
              keyboardType="numeric"
              className={inputStyle}
            />
            <View className={`w-20 px-3 py-2 ${boxStyle}`}>
              <Text className={`${darkMode ? "text-white" : "text-black"}`}>
                Years
              </Text>
            </View>
          </View>

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
                  onPress={() => setGender(label === "Male")}
                  className={`flex-1 flex-row justify-center gap-2 py-2 px-2 rounded-lg items-center ${(gender === true && label === "Male") || (gender === false && label === "Female") ? "bg-orange-500" : darkMode ? "bg-[#333]" : "bg-white"}`}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    color={
                      gender === (label === "Male")
                        ? "#fff"
                        : darkMode
                          ? "#fff"
                          : "#000"
                    }
                  />
                  <Text
                    className={
                      gender === (label === "Male")
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
                {goal ? goal : "Select your goal"}
              </Text>
            </TouchableOpacity>
          </View>
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
            <View className="flex-row items-center justify-between mt-2">
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
                  <Text className={`${darkMode ? "text-white" : "text-black"}`}>
                    {activity.label} {activity.value}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

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
          <View>
            {err && <Text className="text-red-500 text-center ">{err}</Text>}
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
