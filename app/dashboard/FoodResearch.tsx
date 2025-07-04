import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "expo-router/build/hooks";

const tabs: ("Explore" | "My food" | "Favorites")[] = [
  "Explore",
  "My food",
  "Favorites",
];

const mockData = {
  Explore: Array(5).fill({
    name: "Rice",
    quantity: "200g",
    carbs: 50,
    protein: 6,
    fat: 0,
    total: 260,
  }),
  "My food": Array(8).fill({
    name: "Rice",
    quantity: "200g",
    carbs: 50,
    protein: 6,
    fat: 0,
    total: 260,
  }),
  Favorites: [],
};

const FoodResearch = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "Explore" | "My food" | "Favorites"
  >("Explore");
  const theme = useColorScheme();
  const searchParams = useSearchParams();
  const mealId = searchParams.get("mealId");
  const router = useRouter();
    useEffect(() => {
        if (mealId) {
        // Handle mealId logic if needed
        console.log(`Meal ID: ${mealId}`);
        }
    }, [mealId]);

  const handleTabPress = (tab: "Explore" | "My food" | "Favorites") =>
    setActiveTab(tab);

  const filteredData = mockData[activeTab].filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const isDark = theme === "dark";

  return (
    <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}>
      {/* Back Button */}
      <View className="absolute top-20 left-4 z-50">
        <TouchableOpacity
          className={`w-10 h-10 rounded-full border-white border-2 items-center justify-center shadow-md `}
          onPress={() => router.back()}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            color={"#fff"}
            size={20}
          />
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View className={`bg-orange-400 ${!isDark ? "bg-[#F4A261]": " bg-[#FF7500]"} px-4 py-5 `}>
        <View className="flex-row justify-center items-center py-6">
          
          <Text className="text-white text-2xl mt-10 font-bold">Find your food</Text>
         
        </View>
        <View
          className={`rounded-full px-4 py-3 flex-row items-center bg-white`}
        >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          <TextInput
            className={`ml-2 flex-1 text-black`}
            placeholder="Enter food's name"
            placeholderTextColor={isDark ? "#888" : "#aaa"}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-around ">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => handleTabPress(tab)}
              className={`flex-1 py-3 ${isActive ? "bg-[#FF7A00]" : "bg-orange-200"}`}
            >
              <Text
                className={`text-center font-bold ${isActive ? "text-white" : "text-orange-600"}`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List */}
       <FlatList
        data={filteredData}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity className="flex-row justify-between items-center px-4 py-3 border-b border-gray-300">
            <Text className={isDark ? "text-white" : "text-black"}>{`${item.name} : ${item.quantity}`}</Text>
             <Text className="font-medium">
              <Text className={isDark ? "text-white" : "text-black"}>C: </Text>
              <Text className="text-[#FF8C1A]">{item.carbs} </Text>
              <Text className={isDark ? "text-white" : "text-black"}>P: </Text>
              <Text className="text-red-500">{item.protein} </Text>
              <Text className={isDark ? "text-white" : "text-black"}>F: </Text>
              <Text className="text-[#FF8C1A]">{item.fat} </Text>
              <Text className={isDark ? "text-white" : "text-black"}>Total: </Text>
              <Text className="text-orange-500">{item.total}</Text>
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-center mt-6 text-gray-400">No data found</Text>
        }
      />
    </View>
  );
};

export default FoodResearch;
