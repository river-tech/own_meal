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
import { useSearchParams } from "expo-router/build/hooks";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const useParams = useSearchParams();
  const renew = useParams.get("renew"); // Kiểm tra xem có tham số renew không


  const colorScheme = useColorScheme();
  const router = useRouter();

 const handleSave = () => {
  if (newPassword.trim() === "" || confirmPassword.trim() === "") {
   
    return;
  }

  if (newPassword === confirmPassword) {

    console.log("Password changed successfully");
    if (renew) {
      router.push("/authen/SignIn");
    } else {
      console.log("Current password:", currentPassword);
      console.log("New password:", newPassword);
    }
  } else {
    
    console.log("Passwords do not match");
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
              Change Password
            </Text>

            <Text
              className={`text-lg ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"} mb-8`}
            >
              Please enter your current and new password.
            </Text>
            {!renew && (
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder="Enter current password"
                placeholderTextColor={
                  colorScheme === "dark" ? "#B0B0B0" : "#555"
                }
                style={{
                  fontFamily: "Nunito-Regular",
                  padding: 12,
                  backgroundColor:
                    colorScheme === "dark" ? "#2D2D2D" : "#F5F5F5",
                  color: colorScheme === "dark" ? "#FFF" : "#000",
                  borderWidth: 1,
                  borderColor: colorScheme === "dark" ? "#FF6F00" : "#FF6F00",
                  borderRadius: 8,
                  marginBottom: 20,
                  width: "100%",
                }}
              />
            )}
            {/* Current password input */}

            {/* New password input */}
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Enter new password"
              placeholderTextColor={colorScheme === "dark" ? "#B0B0B0" : "#555"}
              style={{
                fontFamily: "Nunito-Regular",
                padding: 12,
                backgroundColor: colorScheme === "dark" ? "#2D2D2D" : "#F5F5F5",
                color: colorScheme === "dark" ? "#FFF" : "#000",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "#FF6F00" : "#FF6F00",
                borderRadius: 8,
                marginBottom: 20,
                width: "100%",
              }}
            />

            {/* Confirm password input */}
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Enter confirm password"
              placeholderTextColor={colorScheme === "dark" ? "#B0B0B0" : "#555"}
              style={{
                fontFamily: "Nunito-Regular",
                padding: 12,
                backgroundColor: colorScheme === "dark" ? "#2D2D2D" : "#F5F5F5",
                color: colorScheme === "dark" ? "#FFF" : "#000",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "#FF6F00" : "#FF6F00",
                borderRadius: 8,
                marginBottom: 20,
                width: "100%",
              }}
            />
            {confirmPassword !== "" &&
              newPassword !== "" &&
              confirmPassword !== newPassword && (
                <Text className="text-red-600 mb-4">
                  Passwords do not match!
                </Text>
              )}

            {/* Show password toggle */}

            {/* Save button */}
            <TouchableOpacity
              onPress={handleSave}
              className="bg-orange-600 p-4 rounded-lg mb-6 mt-3"
            >
              <Text className="text-white text-center text-lg font-bold">
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ChangePassword;
