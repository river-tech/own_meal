import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  Image,
  useColorScheme,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBell,
  faPalette,
  faKey,
  faSignOutAlt,
  faCamera,
  faArrowLeft,
  faEnvelope,
  faUser,
  faX,
  faPen,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { IUser } from "model/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const CLOUD_NAME = "dqupovatf"; // ví dụ: "myapp123"
const UPLOAD_PRESET = "demo_frame_print"; // ví dụ: "expo_upload"

export default function SettingsScreen() {
  const isDark = useColorScheme() === "dark";
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const textColor = isDark ? "text-white" : "text-black";
  const bgColor = isDark ? "bg-[#1e1e1e]" : "bg-[#fff4e6]";
  const cardBg = isDark ? "bg-[#2c2c2e]" : "bg-[#fff]";
  const router = useRouter();
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [name, setName] = useState("");
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [avatar, setAvatar] = useState("");
  const [isEditName, setIsEditName] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const getUserInfo = async () => {
      const personalSettings = await AsyncStorage.getItem("personalSettings");
      console.log("Personal Settingssssss:", personalSettings);
      if (personalSettings) {
        const parsedUserInfo: IUser = JSON.parse(personalSettings);
        setUserInfo(parsedUserInfo);
        setName(parsedUserInfo.username || "");
        setAvatar(parsedUserInfo.avatar || ""); // Set avatar from user info
        setNotificationEnabled(parsedUserInfo.notification === "true");
        // console.log("User info:", parsedUserInfo);
      }
    };
    getUserInfo();
  }, []);

  const handleSaveChanges = async () => {
    const token = await SecureStore.getItemAsync("userToken");
    if(name.trim() === "") {
      setError("Name cannot be empty");
      return false;
    }
    try {
      const res = await axios.put(
        `${API_URL}/users/edit/setting`,
        {
          username: name,
          avatar: avatar,
          notification: notificationEnabled,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res) {
        console.log("User settings updated:", res.data);
        const updatedUser: IUser = {
          ...userInfo,
          username: name,
          avatar: avatar,
          notification: notificationEnabled ? "true" : "false",
          userId: userInfo?.userId,
          email: userInfo?.email ?? null,
        };
        setUserInfo(updatedUser);      
        await AsyncStorage.setItem(
          "personalSettings",
          JSON.stringify(updatedUser)
        );
        setIsEditName(false); // Đóng chế độ chỉnh sửa tên
        return true;
      }
    } catch (error) {
      console.error("Error saving user settings:", error);
      return false;
    }
  };

  const handleBackPress = async () => {
    const isUpdated = await handleSaveChanges();
    if (isUpdated) {
      router.push("/dashboard/Home");
    }
  };

  const handleChangePassword = async () => {
    const isUpdated = await handleSaveChanges();
    if (isUpdated) {
      router.push(`/OwnSecure/OtpCheck?email=${userInfo?.email}`);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      uploadToCloudinary(result.assets[0].uri); // Gửi ảnh lên Cloudinary
    }
  };
  const uploadToCloudinary = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "image/jpeg",
        name: "upload.jpg",
      } as any);
      formData.append("upload_preset", UPLOAD_PRESET);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        setAvatar(data.secure_url); // Gửi URL về component cha
        console.log("Cloudinary response:", data.secure_url);
      } else {
        console.error("Cloudinary error:", data);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const CustomToggle = ({
    value,
    onToggle,
  }: {
    value: boolean;
    onToggle: () => void;
  }) => {
    return (
      <TouchableOpacity
        onPress={onToggle}
        className={`w-12 h-6 rounded-full border-lg border-black px-1 py-0.5 ${value ? "bg-[#FF7A00]" : "bg-gray-400"}`}
      >
        <View
          className={`w-5 h-5 rounded-full bg-[#ffffff] transform duration-200 border border-gray-300 ${
            value ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </TouchableOpacity>
    );
  };

  const signOut = async () => {
    setUserInfo(null);
    await SecureStore.deleteItemAsync("userToken");
    await AsyncStorage.removeItem("personalDetails");
    await AsyncStorage.removeItem("personalSettings");
    await AsyncStorage.removeItem("userInfo");
    await AsyncStorage.removeItem("macroDetails");
    router.push("/");
  };

  return (
    <View className={`flex-1 ${bgColor}`}>
      {/* Header */}
      <View className="bg-[#FF7A00] rounded-b-3xl items-center py-16 px-5 relative">
        {/* backbutton */}
        <View className="absolute top-16 left-4 z-50">
          <TouchableOpacity
            onPress={() => handleBackPress()}
            className="w-10 h-10 rounded-full border-2 border-white items-center justify-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} color={"#FFF"} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Avatar tràn nửa trên + nửa dưới */}
      <View className="items-center -mt-10">
        <View className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden border-[4px] border-white">
          <Image
            source={{
              uri: avatar
                ? avatar
                : "https://i.pinimg.com/736x/62/74/8d/62748d84867c925f8d21ad7fdb475f7b.jpg",
            }}
            className="w-full h-full"
          />
        </View>
        <View className="w-[200px] py-2">
          {isEditName ? (
            <View className="flex-row items-center justify-center mt-2 w-full">
              <TextInput
                value={name || ""}
                onChangeText={(text) => setName(text)}
                className={`text-xl font-semibold flex-1 border-b border-gray-300 ${textColor}`}
                placeholder="Your Name"
                placeholderTextColor={isDark ? "#ccc" : "#888"}
              />
              <TouchableOpacity
                onPress={() => setIsEditName(false)}
                className="ml-2 bg-[#FF7A00] p-2 rounded-full"
              >
                <FontAwesomeIcon icon={faCheck} color="white" size={14} />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row items-center justify-center mt-2 w-full">
              <Text className={`text-xl font-semibold ${textColor}`}>
                {name || "Your Name"}
              </Text>
              <TouchableOpacity
                onPress={() => setIsEditName(true)}
                className="ml-2 bg-[#FF7A00] p-2 rounded-full"
              >
                <FontAwesomeIcon icon={faPen} color="white" size={14} />
              </TouchableOpacity>
            </View>
          )}
          <View className="flex-row items-center justify-center mt-2">
            {error && (
              <Text className="text-red-500 text-sm mt-1">{error}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={pickImage}
          className="mt-2 bg-[#FF7A00] px-4 py-2 rounded-lg shadow"
        >
          <Text className="text-white font-semibold">Change avatar</Text>
        </TouchableOpacity>
      </View>
      {/* Settings */}
      <View
        className={`${cardBg} flex-col gap-2  mx-5 mt-8 pt-5 rounded-xl  p-4 shadow-md`}
      >
        <View className="flex-row gap-y-10 justify-between items-center mb-4">
          <View className="flex-row gap-3 items-center">
            <FontAwesomeIcon size={20} icon={faBell} color="#FF7A00" />
            <Text className={`font-medium ${textColor}`}>Notification</Text>
          </View>
          <CustomToggle
            value={notificationEnabled}
            onToggle={() => setNotificationEnabled(!notificationEnabled)}
          />
        </View>

        <TouchableOpacity
          onPress={() => handleChangePassword()}
          className="flex-row gap-3 items-center mb-6"
        >
          <FontAwesomeIcon icon={faKey} color="#FF7A00" />
          <Text className={textColor}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={signOut}
          className="flex-row gap-3 items-center"
        >
          <FontAwesomeIcon icon={faSignOutAlt} color="#FF7A00" />
          <Text className={textColor}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
