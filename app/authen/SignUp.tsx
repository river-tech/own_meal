import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme,
} from "react-native";

const SignUp = () => {
  const [agreeTerm, setAgreeTerm] = useState(false);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const handleSignUp = async () => {
    // Xử lý đăng ký ở đây
    console.log("Email:", email);
    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    console.log("Agree to Terms:", agreeTerm);
    if (!agreeTerm) {
      setError(true);
      setErrorText("You must agree to the terms and conditions.");
      return;
    }
    if (password !== confirmPassword) {
      setError(true);
      setErrorText("Passwords do not match.");
      return;
    }
    // Giả sử đăng ký thành công
    setError(false);
    try {
      const res =  await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/signup`, {
        Email: email,
        Username: username,
        Password: password,
      }); // Gọi API đăng ký
      if(res){
        console.log("Đăng ký thành công:", res.data);
        setError(false);
        setErrorText("");
        router.push(`/OwnSecure/OtpCheck?email=${email}`); // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
      }
    } catch (error) {
      // console.error('Error during sign up:', error);
      setError(true);
      setErrorText("An error occurred during sign up. Please try again.");
        router.push(`/OwnSecure/OtpCheck?email=${email}`);
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding" // Đảm bảo tránh bàn phím
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
              Sign Up
            </Text>
            <Text
              className={`text-lg ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"} mb-8`}
            >
              Create new account
            </Text>

            {/* Email input */}
            <TextInput
              style={{ fontFamily: "Nunito-Regular" }}
              placeholder="Enter email"
              placeholderTextColor={colorScheme === "dark" ? "#B0B0B0" : "#555"}
              className={`bg-${colorScheme === "dark" ? "gray-800" : "white"} p-4 mb-4 rounded-lg shadow-md  ${
                colorScheme === "light"
                  ? "border-2 border-gray-300 text-black"
                  : " text-white"
              }`}
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />

            {/* Username input */}
            <TextInput
              style={{ fontFamily: "Nunito-Regular" }}
              placeholder="Enter username"
              placeholderTextColor={colorScheme === "dark" ? "#B0B0B0" : "#555"}
              className={`bg-${colorScheme === "dark" ? "gray-800" : "white"} p-4 mb-4 rounded-lg shadow-md  ${
                colorScheme === "light"
                  ? "border-2 border-gray-300 text-black"
                  : " text-white"
              }`}
              value={username}
              onChangeText={(text) => setUsername(text)}
            />

            {/* Password input */}
            <TextInput
              style={{ fontFamily: "Nunito-Regular" }}
              placeholder="Enter password"
              secureTextEntry
              placeholderTextColor={colorScheme === "dark" ? "#B0B0B0" : "#555"}
              className={`bg-${colorScheme === "dark" ? "gray-800" : "white"} p-4 mb-4 rounded-lg shadow-md  ${
                colorScheme === "light"
                  ? "border-2 border-gray-300 text-black"
                  : " text-white"
              }`}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />

            {/* Confirm Password input */}
            <TextInput
              style={{ fontFamily: "Nunito-Regular" }}
              placeholder="Confirm password"
              secureTextEntry
              placeholderTextColor={colorScheme === "dark" ? "#B0B0B0" : "#555"}
              className={`bg-${colorScheme === "dark" ? "gray-800" : "white"} p-4 mb-4 rounded-lg shadow-md  ${
                colorScheme === "light"
                  ? "border-2 border-gray-300 text-black"
                  : " text-white"
              }`}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
            {
              error && (
                <Text
                  className={`text-red-500 text-sm mb-4 ${colorScheme === "dark" ? "text-red-400" : "text-red-600"}`}
                >
                  {errorText}
                </Text>
              )
            }

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
            <TouchableOpacity
              onPress={() => handleSignUp()}
              className="bg-orange-600 p-4 rounded-lg mb-6 shadow-lg"
            >
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
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
