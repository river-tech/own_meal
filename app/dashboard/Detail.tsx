import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { useColorScheme, View, TouchableOpacity } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import Navbar from "../Element/Navbar";
import { LinearGradient } from "expo-linear-gradient";

const Detail = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const lightGradientColors: [string, string] = ["#FFE4C4", "#FFF7ED"];

  const darkBgColor = "#1E1E1E";

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

        {/* Nội dung scroll */}
        <ScrollView className="px-4 py-2">
          {/* Nội dung khác sẽ đặt ở đây */}
        </ScrollView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

export default Detail;
