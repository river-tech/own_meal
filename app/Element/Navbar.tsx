import { faWeightScale } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useRouter } from "expo-router";
import { IUser } from "model/user";
import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { BellIcon, Cog6ToothIcon } from "react-native-heroicons/outline";
import * as SecureStore from "expo-secure-store";

export default function Navbar() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Set icon size dynamically based on color scheme
  const iconSize = isDark ? 20 : 24;
  const router = useRouter();
  const [userInfo, setUserInfo] = React.useState<IUser | null>(null);
  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await SecureStore.getItemAsync("store");
      if (userInfo) {
        setUserInfo(JSON.parse(userInfo));
      }
    } 
  },[])
  

  return (
    <View className={`flex-row justify-between items-center px-4 mt-20`}>
      {/* Avatar + Name */}
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => router.push("/Profile/Personal")}
          className="flex-row items-center"
        >
          <View className="w-12 h-12 rounded-full border-2 border-white overflow-hidden mr-[10px] z-10 bg-white">
            <Image
              source={require("../../assets/images/avatar.png")} // Adjusted path
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Name badge */}
          <View
            className={`bg-orange-500 px-5 pl-45 py-1 rounded-full shadow-lg`}
          >
            <Text className="font-semibold text-white text-lg">{userInfo?.name}</Text>
          </View>
        </TouchableOpacity>
        {/* Avatar */}
      </View>

      {/* Notification + Setting */}
      <View className="flex-row gap-5">
        <TouchableOpacity
        onPress={() => router.push("/Profile/WeightLog")}
          className={`w-12 h-12 rounded-full shadow items-center justify-center ${isDark ? "bg-gray-700" : "bg-white"}`}
        >
          <FontAwesomeIcon color={isDark ? "#FB923C" : "#FB923C"} icon={faWeightScale} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/Profile/Notification")}
          className={`w-12 h-12 rounded-full shadow items-center justify-center ${isDark ? "bg-gray-700" : "bg-white"}`}
        >
          <BellIcon color={isDark ? "#FB923C" : "#FB923C"} size={iconSize} />
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-12 h-12 rounded-full shadow items-center justify-center ${isDark ? "bg-gray-700" : "bg-white"}`}
          onPress={() => router.push("/Profile/Setting")}
        >
          <Cog6ToothIcon
            color={isDark ? "#FB923C" : "#FB923C"}
            size={iconSize}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
