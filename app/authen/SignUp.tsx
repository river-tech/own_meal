import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

const SignUp = () => {
  const [agreeTerm, setAgreeTerm] = useState(false);
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#F5F5F5", // Nền thay đổi theo chế độ sáng/tối
          }}
          keyboardShouldPersistTaps="handled" // Đảm bảo sự kiện nhấn không bị chặn
        >
          {/* Nút Back */}
          <View className="absolute top-20 left-6">
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text
                className={`text-5xl ${colorScheme === "dark" ? "text-orange-600" : "text-black"} font-bold`}
              >
                ←
              </Text>
            </TouchableOpacity>
          </View>

          <View
            className={`w-full p-6 rounded-3xl shadow-xl ${colorScheme === "dark" ? "bg-gray-800" : "bg-white"}`}
          >
            {/* Header */}
            <View className="flex-row items-center mb-6">
              <Text
                className={`text-4xl font-bold ${colorScheme === "dark" ? "text-orange-600" : "text-black"} `}
              >
                Sign up
              </Text>
            </View>
            <Text
              className={`text-lg ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"} mb-8`}
            >
              Create new account
            </Text>

            {/* Email input */}
            <TextInput
              style={{ fontFamily: "Nunito-Regular", outline: "none" }} // Loại bỏ outline
              placeholder="Enter email"
              placeholderTextColor={colorScheme === "dark" ? "#B0B0B0" : "#555"}
              className={`bg-${colorScheme === "dark" ? "gray-800" : "gray-100"} text-white p-4 mb-4 rounded-lg shadow-md  ${colorScheme === "light" ? "border-2 border-gray-300" : ""}`}
              keyboardType="email-address"
            />

            {/* Username input */}
            <TextInput
              style={{ fontFamily: "Nunito-Regular", outline: "none" }} // Loại bỏ outline
              placeholder="Enter username"
              placeholderTextColor={colorScheme === "dark" ? "#B0B0B0" : "#555"}
              className={`bg-${colorScheme === "dark" ? "gray-800" : "gray-100"} text-white p-4 mb-4 rounded-lg shadow-md  ${colorScheme === "light" ? "border-2 border-gray-300" : ""}`}
            />

            {/* Password input */}
            <TextInput
              style={{ fontFamily: "Nunito-Regular", outline: "none" }} // Loại bỏ outline
              placeholder="Enter password"
              secureTextEntry
              placeholderTextColor={colorScheme === "dark" ? "#B0B0B0" : "#555"}
              className={`bg-${colorScheme === "dark" ? "gray-800" : "gray-100"} text-white p-4 mb-4 rounded-lg shadow-md  ${colorScheme === "light" ? "border-2 border-gray-300" : ""}`}
            />

            {/* Confirm Password input */}
            <TextInput
              style={{ fontFamily: "Nunito-Regular", outline: "none" }} // Loại bỏ outline
              placeholder="Confirm password"
              secureTextEntry
              placeholderTextColor={colorScheme === "dark" ? "#B0B0B0" : "#555"}
              className={`bg-${colorScheme === "dark" ? "gray-800" : "gray-100"} text-white p-4 mb-4 rounded-lg shadow-md  ${colorScheme === "light" ? "border-2 border-gray-300" : ""}`}
            />

            {/* Agree With Term checkbox */}
            <View className="flex-row items-center mb-6">
              <TouchableOpacity
                onPress={() => setAgreeTerm(!agreeTerm)}
                className={`w-5 h-5 border-2 ${agreeTerm ? "bg-orange-600" : "bg-white"} rounded-md`}
              />
              <Text
                className={`ml-2 text-${colorScheme === "dark" ? "gray-400" : "gray-600"} text-sm`}
              >
                I Agree With The Term
              </Text>
            </View>

            {/* Sign Up button */}
            <TouchableOpacity className="bg-orange-600 p-4 rounded-lg mb-6 shadow-lg">
              <Text className="text-white text-center text-lg font-bold">
                SIGN UP
              </Text>
            </TouchableOpacity>

            {/* Sign In link */}
            <View className="flex-row justify-center">
              <Text
                className={`text-${colorScheme === "dark" ? "gray-400" : "gray-600"} text-sm`}
              >
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/authen/SignIn")}>
                <Text className="text-orange-600 text-sm ml-1 font-bold">
                  Signin
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
