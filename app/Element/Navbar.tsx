import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  Image,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { BellIcon, Cog6ToothIcon } from "react-native-heroicons/outline";

export default function Navbar() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Set icon size dynamically based on color scheme
  const iconSize = isDark ? 20 : 24;
  const router = useRouter();

  return (
    <View className={`flex-row justify-between items-center px-4 mt-20`}>
      {/* Avatar + Name */}
      <View className="flex-row items-center">
        <TouchableOpacity className="flex-row items-center" >
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
            <Text className="font-semibold text-white text-lg">River</Text>
          </View>
        </TouchableOpacity>
        {/* Avatar */}
      </View>

      {/* Notification + Setting */}
      <View className="flex-row gap-5">
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
