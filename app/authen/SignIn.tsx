import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme,
  Animated,
} from "react-native";
import Axios from "axios";
import axios from "axios";
import { faFaceSadTear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as SecureStore from "expo-secure-store";

const SignIn = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL; // Lấy URL API từ biến môi trường

  // Lấy chế độ sáng/tối của hệ thống
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const [fadeAnim] = useState(new Animated.Value(0));
  const handleSignIn = async () => {
    // Xử lý đăng nhập ở đây
    console.log("Username:", username);
    console.log("Password:", password);

    console.log("Remember Me:", rememberMe);
    console.log("API URL:", apiUrl);

    try {
      const res = await axios.post(`${apiUrl}/auth/login`, {
        username: username,
        password: password,
      });

      console.log("Đăng nhập thành công:");
      // Chuyển hướng đến trang chính hoặc thực hiện hành động khác sau khi đăng nhập thành công
      
      if (res) {
        router.push("/dashboard/Home"); // Giả sử bạn muốn chuyển hướng về trang chính
        if (rememberMe) {
          await SecureStore.setItemAsync("rememberMe", "true"); // Lưu trạng thái Remember Me
        }
        await SecureStore.setItemAsync("userToken", res.data.token); // Lưu token vào SecureStore♫
      }
    } catch (error) {
      setError(true);
      // setTimeout(() => setError(false), 2000);
      router.push("/dashboard/Home");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding" // Điều chỉnh hành vi khi bàn phím xuất hiện
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFE4C4", // Nền thay đổi tùy theo chế độ sáng/tối
          }}
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

          {/* Card Container */}
          <View
            className={`w-full p-6 rounded-3xl shadow-xl ${colorScheme === "dark" ? "bg-gray-800" : "bg-white"}`}
            style={{
              shadowColor: colorScheme === "dark" ? "#000" : "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Text
              className={`text-4xl font-bold ${colorScheme === "dark" ? "text-orange-600" : "text-black"} mb-4`}
            >
              Sign In
            </Text>
            <Text
              className={`text-lg ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"} mb-8`}
            >
              Welcome back
            </Text>

            {/* Username input */}
            <TextInput
              style={{ fontFamily: "Nunito-Regular" }}
              placeholder="Enter username"
              onChangeText={(text) => setUsername(text)}
              placeholderTextColor={colorScheme === "dark" ? "#B0B0B0" : "#555"}
              className={`bg-${colorScheme === "dark" ? "gray-800" : "white"} p-4 mb-4 rounded-lg shadow-lg ${
                colorScheme === "light"
                  ? "border-2 border-gray-300 text-black"
                  : " text-white"
              }`}
            />

            {/* Password input */}
            <TextInput
              style={{ fontFamily: "Nunito-Regular" }}
              placeholder="Enter password"
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              placeholderTextColor={colorScheme === "dark" ? "#B0B0B0" : "#555"}
              className={`bg-${colorScheme === "dark" ? "gray-800" : "white"} p-4 mb-4 rounded-lg shadow-lg ${
                colorScheme === "light"
                  ? "border-2 border-gray-300 text-black"
                  : "text-white"
              }`}
            />

            {/* Remember me checkbox */}
            <View className="flex-row items-center mb-6">
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                className={`w-5 h-5 border-2 ${rememberMe ? "bg-orange-600" : "bg-white"} rounded-md`}
              />
              <Text
                className={`ml-2 text-${colorScheme === "dark" ? "gray-400" : "gray-600"} text-sm`}
              >
                Remember Me
              </Text>
            </View>
            <View>
              {error && (
                <Text
                  className={`text-red-500 text-sm mb-4 ${colorScheme === "dark" ? "text-red-400" : "text-red-600"}`}
                >
                  Invalid username or password
                </Text>
              )}
            </View>

            {/* Forgot Password link */}
            <TouchableOpacity
              onPress={() => router.push(`/OwnSecure/EmailCheck`)}
              className="mb-6"
            >
              <Text
                className={`text-${colorScheme === "dark" ? "orange-600" : "orange-700"} text-md text-center`}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Sign In button */}
            <TouchableOpacity
              onPress={() => handleSignIn()}
              className="bg-orange-600 p-4 rounded-lg mb-6"
            >
              <Text className="text-white text-center text-lg font-bold">
                SIGN IN
              </Text>
            </TouchableOpacity>

            {/* Sign Up link */}
            <View className="flex-row justify-center">
              <Text
                className={`text-${colorScheme === "dark" ? "gray-400" : "gray-600"} text-sm`}
              >
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/authen/SignUp")}>
                <Text className="text-orange-600 text-sm ml-1 font-bold">
                  Signup
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
