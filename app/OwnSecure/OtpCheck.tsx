import React, { useState, useRef, useEffect } from "react";
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
import axios from "axios";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60); // Thời gian đếm ngược
  const colorScheme = useColorScheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const username = searchParams.get("username");
  const isSignUp = searchParams.get("isSignUp");
  const password = searchParams.get("password") ;



  useEffect(() => {
    // Thiết lập bộ đếm ngược
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0; // Dừng đếm ngược khi hết thời gian
        }
        return prev - 1;
      });
   
    }, 1000);

    // Dọn dẹp bộ đếm khi component unmount
       console.log("Time left:", timeLeft);
      console.log("username:", username);
      console.log("email:", email);
      console.log("isSignUp:", isSignUp);
      console.log("password:", password);
    return () => clearInterval(timer);
    
  }, []);

  // Sử dụng useRef để tham chiếu tới các TextInput
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const handleInputChange = ({
    text,
    index,
  }: {
    text: string;
    index: number;
  }) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Chuyển focus đến ô tiếp theo khi nhập
    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ key, index }: { key: string; index: number }) => {
    // Quay lại ô trước khi xóa
    if (key === "Backspace" && index > 0 && !otp[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPVerification =  async() => {
    // Xử lý xác minh OTP ở đây
    const otpCode = otp.join("");
    console.log("OTP Code:", otpCode);
    try {
      const res = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/verify-otp?email=${email}&otp=${otpCode}`)
      console.log(`${process.env.EXPO_PUBLIC_API_URL}/auth/verify-otp?email=${email}&otp=${otpCode}`)
      if(res && isSignUp){
        try {
          const res = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`,{
            email: email,
            username: username,
            password: password,
          })
          if(res){
            router.push('/authen/SignIn')
          }
        } catch (error) {
          console.error("", error);
          // Xử lý lỗi nếu cần
          return;
        }
      }
      else if(res && !isSignUp){
        router.push('/OwnSecure/ChangePassword?renew=true')
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // Xử lý lỗi nếu cần
      return; 
    }
    // Gọi API để xác minh OTP
    // Nếu thành công, chuyển hướng đến trang đổi mật khẩu hoặc trang chính
    router.push(`/OwnSecure/ChangePassword?renew=${true}`);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={50} // Adjust the offset if needed
    >
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
              Email verification
            </Text>
            <Text
              className={`text-lg ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"} mb-8`}
            >
              Enter the 6-digit code sent to:{" "}
              <Text
                style={{
                  fontWeight: "bold",
                  color: colorScheme === "dark" ? "#FF6F00" : "#FF6F00",
                }}
              >
                {email?.replace(/(.{2})(.*)(?=@)/, "$1*****$3")}
              </Text>
              {/* Ẩn một phần email */}
            </Text>

            {/* OTP Inputs */}
            <View className="flex-row mb-8 justify-center">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }} // Tham chiếu từng ô nhập liệu
                  value={digit}
                  onChangeText={(text) => handleInputChange({ text, index })}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress({ key: nativeEvent.key, index })
                  }
                  maxLength={1}
                  keyboardType="numeric"
                  style={{
                    width: 45,
                    height: 45,
                    marginHorizontal: 5,
                    textAlign: "center",
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: colorScheme === "dark" ? "#FF6F00" : "#FF6F00",
                    backgroundColor:
                      colorScheme === "dark" ? "#2D2D2D" : "#F5F5F5",
                    color: colorScheme === "dark" ? "#FFF" : "#000",
                    fontSize: 18,
                  }}
                />
              ))}
            </View>

            {/* Code expiration notice */}
            <Text
              className={`text-sm ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"} mb-6`}
            >
              {`This code will expire in ${timeLeft} seconds`}
            </Text>

            {/* Verify Code Button */}
            <TouchableOpacity onPress={()=>handleOTPVerification()} className="bg-orange-600 p-4 rounded-lg mb-6 shadow-lg w-full">
              <Text className="text-white text-center text-lg font-bold">
                Verify Code
              </Text>
            </TouchableOpacity>

            {/* Didn't receive the code? Link */}
            <View className="flex-row justify-center">
              {timeLeft <= 0 ? (
                <>
                  <Text
                    className={`text-${colorScheme === "dark" ? "gray-400" : "gray-600"} text-sm`}
                  >
                    Didn't receive the code?
                  </Text>
                  <TouchableOpacity>
                    <Text className="text-orange-600 text-sm ml-1 font-bold">
                      Resend
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <></>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default VerifyOTP;
