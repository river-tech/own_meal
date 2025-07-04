import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, useColorScheme } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ArrowLeftIcon, ArrowRightIcon, CalendarDaysIcon } from "react-native-heroicons/outline";

const DatePickerComponent = ({
  onDateChange,
  initialDate,
}: {
  onDateChange: (date: Date) => void;
  initialDate?: string;
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Parse initial date or use today
  const parseInitialDate = () => {
    return initialDate ? new Date(initialDate) : new Date();
  };

  const [selectedDate, setSelectedDate] = useState<Date>(parseInitialDate());
  const [showPicker, setShowPicker] = useState(false);

  // Trigger onDateChange when component mounts
  useEffect(() => {
    onDateChange(selectedDate);
  }, []);

  const formatDate = (date: Date) => {
    return date.toDateString(); // You can change format here
  };

  const handleChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
      onDateChange(date);
    }
    setShowPicker(false);
  };

  const goToPrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  return (
    <View className="justify-start mt-5 items-center">
      <View
        className={`flex-row justify-around items-center px-4 py-3 rounded-xl mb-6 w-[90%] ${
          isDark ? "bg-[#3B3B3B]" : "bg-white"
        }`}
      >
        <TouchableOpacity
          onPress={goToPrevDay}
          className="w-10 h-10 bg-[#FF8C1A] rounded-full shadow items-center justify-center"
        >
          <ArrowLeftIcon size={24} color="white" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-2">
          <CalendarDaysIcon size={24} color={isDark ? "white" : "black"} />
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Text className={`text-lg font-semibold ${isDark ? "text-white" : "text-black"}`}>
              {formatDate(selectedDate)}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={goToNextDay}
          className="w-10 h-10 bg-[#FF8C1A] rounded-full shadow items-center justify-center"
        >
          <ArrowRightIcon size={24} color="white" />
        </TouchableOpacity>
      </View>

      {showPicker && (
        <Modal visible={showPicker} animationType="slide" transparent>
          <View
            className={`flex-1 justify-center items-center w-full ${
              isDark ? "bg-[#272727]" : "bg-[#FFE4C4]"
            }`}
          >
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleChange}
              style={{
                width: 400,
                marginBottom: 6,
                backgroundColor: isDark ? "#2D2D2D" : "#F5F5F5",
                borderRadius: 8,
              }}
            />
            <TouchableOpacity
              onPress={() => setShowPicker(false)}
              className="bg-orange-600 py-3 px-10 rounded-xl mt-4"
            >
              <Text className="text-white text-lg font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default DatePickerComponent;
