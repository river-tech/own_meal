
import { useRouter } from "expo-router";
import React from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  useColorScheme,
} from "react-native";

export default function Index() {
  // Lấy chế độ sáng/tối của hệ thống
  const colorScheme = useColorScheme();

  // Xử lý ảnh nền cho chế độ sáng và tối
  const lightBackground = require("../assets/images/light_bg.png");
  const darkBackground = require("../assets/images/dark_bg.png");
  const router = useRouter();

  return (
    <ImageBackground
      source={colorScheme === "dark" ? darkBackground : lightBackground}
      className="flex-1 justify-evenly items-center w-full h-full" // Sử dụng Nativewind để thay thế style
    >
      <View className="flex flex-col items-center mb-10">
        <Image
          source={require("../assets/images/logo.png")} // Thay bằng đường dẫn logo thực tế của bạn
          className="w-32 h-32 mb-6" // Tăng kích thước logo cho dễ nhìn hơn trong chế độ sáng
        />
        <Text
          className={`text-5xl font-bold ${colorScheme === "dark" ? "text-orange-600" : "text-gray-900"} mb-3`} // Điều chỉnh kích thước chữ và màu sắc cho dễ nhìn hơn trong chế độ sáng
        >
          OWN MEAL
        </Text>

        <View
          className={`bg-orange-600 px-8 py-3 rounded-full mb-12 ${colorScheme === "dark" ? "bg-orange-600" : "bg-orange-400"}`}
        >
          <Text
            className={`text-white text-lg ${colorScheme === "dark" ? "text-white" : "text-gray-900"} text-center`}
          >
            Eat Right • Feel Great
          </Text>
        </View>
      </View>
      <View className="flex-row justify-evenly w-full mt-[50px]">
        <TouchableOpacity onPress={()=>router.push("/authen/SignIn")} className="bg-orange-600 px-12 py-4 rounded-2xl shadow-lg">
          <Text className="text-white text-center text-lg">SIGN IN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>router.push("/authen/SignUp")} className="bg-transparent border-2 border-orange-600 px-12 py-4 rounded-2xl shadow-lg">
          <Text className="text-orange-600 text-center text-lg">SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
