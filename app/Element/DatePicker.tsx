import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, useColorScheme } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ArrowLeftIcon, ArrowRightIcon, CalendarDaysIcon } from "react-native-heroicons/outline";

const DatePickerComponent = () => {
  const [selectedDate, setSelectedDate] = useState<string>(""); // State to hold the selected date
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [datePickerVisible, setDatePickerVisible] = useState(false); // Control visibility of DateTimePicker
  const colorScheme = useColorScheme(); // Get current color scheme (light or dark)
  const isDark = colorScheme === "dark"; // Check if the theme is dark

  // Initialize selected date with today's date
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toDateString();
    setSelectedDate(formattedDate);
  }, []);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toDateString();
      setSelectedDate(formattedDate); // Set selected date
    }
    setDatePickerVisible(false); // Close the picker on any change (either OK or Cancel)
  };

  // Handle previous date
  const handleDatePrev = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1); // Subtract one day
    setSelectedDate(prevDate.toDateString());
  };

  // Handle next date
  const handleDateNext = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1); // Add one day
    setSelectedDate(nextDate.toDateString());
  };

  return (
    <View className={` justify-start mt-10 items-center`}>
      {/* Date display */}
      <View
        className={`flex-row justify-around items-center px-4 py-3 rounded-xl mb-6 w-[90%] ${isDark ? "bg-[#3B3B3B]" : "bg-white"}`}
      >
        {/* Previous Date Button */}
        <TouchableOpacity
          onPress={handleDatePrev}
          className={`w-10 h-10 bg-[#FF8C1A] rounded-full shadow items-center justify-center`}
        >
          <ArrowLeftIcon size={24} color="white" />
        </TouchableOpacity>

        {/* Date Display */}
        <View className="flex-row items-center gap-2">
          <CalendarDaysIcon size={24} color={isDark ? "white" : "black"} />
          <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
            <Text className={`text-lg font-semibold ${isDark ? "text-white" : "text-black"}`}>
              {selectedDate ? selectedDate : "Select Date"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Next Date Button */}
        <TouchableOpacity
          onPress={handleDateNext}
          className={`w-10 h-10 bg-[#FF8C1A] rounded-full shadow items-center justify-center`}
        >
          <ArrowRightIcon size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal for DatePicker */}
      {datePickerVisible && (
        <Modal visible={datePickerVisible} animationType="slide">
          <View
            className={`flex-1 justify-center items-center w-full ${isDark ? "bg-[#272727]" : "bg-[#FFE4C4]"}`}
          >
            <DateTimePicker
              style={{
                width: 400,
                marginBottom: 6,
                backgroundColor: isDark ? "#2D2D2D" : "#F5F5F5",
                borderRadius: 8,
              }}
              value={new Date(selectedDate || Date.now())}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
            <TouchableOpacity onPress={() => setDatePickerVisible(false)} className="bg-orange-600 py-3 px-10 rounded-xl mt-4">
              <Text className="text-white text-lg font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default DatePickerComponent;
