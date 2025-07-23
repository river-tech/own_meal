import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const colorScheme = useColorScheme();
  const router = useRouter();
  const handleEmailCheck = (text: string): string | null => {
    if (!text.trim()) {
      setError(true);
      setErrorText("Email cannot be empty");
      return "Email cannot be empty";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) {
      setError(true);
      setErrorText("Invalid email");
      return "Invalid email";
    }

    return null; // valid
  };

  const handleSendOTP = async () => {
    // Logic gửi OTP tới email
    const emailError = handleEmailCheck(email);
    if (emailError) {
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/request-password-reset?email=${email}`
      );
      if (res) {
        console.log("Email sent to:", email);
        router.push(`/OwnSecure/OtpCheck?email=${email}`); // Chuyển sang trang OTP với email làm tham số

      }
    } catch (error) {
      // console.error("Error sending OTP:", error);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            backgroundColor: colorScheme === "dark" ? "#272727" : "#FFE4C4", // Nền thay đổi theo chế độ sáng/tối
          }}
        >
          {/* Nút Back */}
          <View className="absolute top-20 left-6">
            <TouchableOpacity onPress={() => router.back()}>
              <Text
                className={`text-5xl ${colorScheme === "dark" ? "text-orange-600" : "text-black"}`}
              >
                ←
              </Text>
            </TouchableOpacity>
          </View>

          {/* Card Container */}
          <Text
            className={`text-5xl font-bold ${colorScheme === "dark" ? "text-orange-600" : "text-[#FF7500]"} mb-6`}
            style={{
              textShadowColor: colorScheme === "dark" ? "#FF6F00" : "#FF7500", // Màu bóng đổ của chữ
              textShadowOffset: { width: 2, height: 2 }, // Độ lệch của bóng đổ
              textShadowRadius: 5, // Độ mờ của bóng đổ
            }}
          >
            OWN SECURE
          </Text>

          {/* Header */}
          <View
            className={`w-full p-8 rounded-3xl shadow-xl ${colorScheme === "dark" ? "bg-gray-800" : "bg-white"}`}
            style={{
              shadowColor: colorScheme === "dark" ? "#000" : "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Text
              className={`text-2xl font-semibold ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"} mb-4`}
            >
              Forgot Password
            </Text>
            <Text
              className={`text-lg ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"} mb-8`}
            >
              Please enter your email account to send the verification code to
              reset your password
            </Text>

            {/* Email input */}
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={{
                fontFamily: "Nunito-Regular",
                padding: 12,
                backgroundColor: colorScheme === "dark" ? "#2D2D2D" : "#F5F5F5",
                color: colorScheme === "dark" ? "#FFF" : "#000",
                borderWidth: 2,
                borderColor: colorScheme === "dark" ? "#FF6F00" : "#FF6F00",
                borderRadius: 8,
                marginBottom: 20,
                width: "100%",
              }}
              placeholder="Enter your email"
              placeholderTextColor={colorScheme === "dark" ? "#B0B0B0" : "#555"}
              keyboardType="email-address"
            />
            <View>
              {
                error && (
                  <Text
                    className={`text-red-500 text-sm mb-4 ${
                      colorScheme === "dark" ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    {errorText}
                  </Text>
                )
              }
            </View>

            {/* Send OTP button */}
            <TouchableOpacity
              onPress={handleSendOTP}
              className="bg-orange-600 p-4 rounded-lg mb-6 w-full"
            >
              <Text className="text-white text-center text-lg font-bold">
                Send OTP
              </Text>
            </TouchableOpacity>

            {/* Link to Sign In */}
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

export default ForgotPassword;
