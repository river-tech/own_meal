import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Toast from "react-native-toast-message";
import {
  faArrowLeft,
  faClock,
  faTrash,
  faPen,
  faCheck,
  faArrowDown,
  faArrowUp,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";
import moment from "moment";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
enum WeightUnit {
  KG = "kg",
  LB = "lb",
}

const chartTabs = [
  {
    id: 1,
    name: "Weekly",
  },
  {
    id: 2,
    name: "Monthly",
  },
  {
    id: 3,
    name: "Yearly",
  },
];

interface WeightLog {
  id: number;
  log_date: Date;
  weight: number;
  weight_unit: WeightUnit;
}
const weightLogs: WeightLog[] = [
  {
    id: 1,
    log_date: new Date("2025-07-01"),
    weight: 72.5,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 2,
    log_date: new Date("2025-07-02"),
    weight: 72.4,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 3,
    log_date: new Date("2025-07-03"),
    weight: 72.3,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 4,
    log_date: new Date("2025-07-04"),
    weight: 72.2,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 5,
    log_date: new Date("2025-07-05"),
    weight: 72.1,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 6,
    log_date: new Date("2025-07-06"),
    weight: 72.0,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 7,
    log_date: new Date("2025-07-07"),
    weight: 71.9,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 8,
    log_date: new Date("2025-07-08"),
    weight: 71.9,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 9,
    log_date: new Date("2025-07-09"),
    weight: 71.8,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 10,
    log_date: new Date("2025-07-10"),
    weight: 71.7,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 11,
    log_date: new Date("2025-07-11"),
    weight: 71.7,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 12,
    log_date: new Date("2025-07-12"),
    weight: 71.6,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 13,
    log_date: new Date("2025-07-13"),
    weight: 71.5,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 14,
    log_date: new Date("2025-07-14"),
    weight: 71.5,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 15,
    log_date: new Date("2025-07-15"),
    weight: 71.4,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 16,
    log_date: new Date("2025-07-16"),
    weight: 71.3,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 17,
    log_date: new Date("2025-07-17"),
    weight: 71.3,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 18,
    log_date: new Date("2025-07-18"),
    weight: 71.2,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 19,
    log_date: new Date("2025-07-19"),
    weight: 71.2,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 20,
    log_date: new Date("2025-07-20"),
    weight: 71.1,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 21,
    log_date: new Date("2025-07-21"),
    weight: 71.1,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 22,
    log_date: new Date("2025-07-22"),
    weight: 71.0,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 23,
    log_date: new Date("2025-07-23"),
    weight: 71.0,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 24,
    log_date: new Date("2025-07-24"),
    weight: 70.9,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 25,
    log_date: new Date("2025-07-25"),
    weight: 70.8,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 26,
    log_date: new Date("2025-07-26"),
    weight: 70.8,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 27,
    log_date: new Date("2025-07-27"),
    weight: 70.7,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 28,
    log_date: new Date("2025-07-28"),
    weight: 70.6,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 29,
    log_date: new Date("2025-07-29"),
    weight: 70.6,
    weight_unit: WeightUnit.KG,
  },
  {
    id: 30,
    log_date: new Date("2025-07-30"),
    weight: 70.5,
    weight_unit: WeightUnit.KG,
  },
];

export default function WeightTrackingScreen() {
  const router = useRouter();
  const darkMode = useColorScheme() === "dark";
  const [logs, setLogs] = useState<WeightLog[]>(weightLogs);
  const [todayLogs, setTodayLogs] = useState<number>();
  const [isLogging, setIsLogging] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editLog, setEditLog] = useState<number>();
  const [open, setOpen] = useState(false);
  const [arrowRotation] = useState(new Animated.Value(0));
  const [chartTab, setChartTab] = useState(1);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [dataChart, setDataChart] = useState<WeightLog[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [unit, setUnit] = useState<WeightUnit>(WeightUnit.KG);
  const toggleArrowRotation = () => {
    Animated.timing(arrowRotation, {
      toValue: open ? 0 : 1, // Nếu mở thì xoay về 0, nếu đóng thì xoay 180 độ
      duration: 300, // Thời gian hiệu ứng xoay
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    toggleArrowRotation();
    if (open) {
      Animated.timing(fadeAnim, {
        toValue: 1, // Mức độ mờ dần từ 0 đến 1
        duration: 300, // Thời gian cho hiệu ứng fade-in
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0, // Trở lại 0 khi đóng
        duration: 300, // Thời gian fade-out
        useNativeDriver: true,
      }).start();
    }
  }, [open]);

  const groupByWeek = (date = new Date()) => {
    const day = date.getDay(); // 0 (Sun) to 6 (Sat)
    const diffToMonday = day === 0 ? -6 : 1 - day; // Nếu là Chủ Nhật → -6, còn lại → tính lùi về thứ Hai

    const weekStartDate = new Date(date);
    weekStartDate.setDate(date.getDate() + diffToMonday);
    weekStartDate.setHours(0, 0, 0, 0); // reset giờ

    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6); // Chủ Nhật
    weekEndDate.setHours(23, 59, 59, 999);

    const weekLogs = logs.filter(
      (log) => log.log_date >= weekStartDate && log.log_date <= weekEndDate
    );

    setDataChart(weekLogs);
    setStartDate(weekStartDate);
    setEndDate(weekEndDate);
    // console.log("Weekly data chart:", weekLogs);
  };

  const groupByMonth = (date = new Date()) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthStartDate = new Date(year, month, 1);
    const monthEndDate = new Date(year, month + 1, 0);
    const monthLogs = logs.filter(
      (log) => log.log_date >= monthStartDate && log.log_date <= monthEndDate
    );
    setDataChart(monthLogs);
    setStartDate(monthStartDate);
    setEndDate(monthEndDate);
    console.log("Monthly data chart:", monthLogs);
  };
  const groupByYear = (date = new Date()) => {
    const year = date.getFullYear();
    console.log("Current year:", year);

    // Lọc các logs trong năm hiện tại
    const yearLogs = logs.filter((log) => log.log_date.getFullYear() === year);

    // Cập nhật dữ liệu chart
    setDataChart(yearLogs);
    setStartDate(new Date(year, 0, 1)); // Ngày bắt đầu năm
    setEndDate(new Date(year, 11, 31)); // Ngày kết thúc năm

    // Kiểm tra lại dữ liệu trong console
    console.log("Yearly data chart:", yearLogs);
  };

  useEffect(() => {
    const today = new Date();
    switch (chartTab) {
      case 1:
        groupByWeek(today);
        break;
      case 2:
        groupByMonth(today);
        break;
      case 3:
        groupByYear(today);
        break;
      default:
        setDataChart(logs);
    }
    console.log("Initial data chart:", logs);
  }, [chartTab,logs]);

  // Get the week number of the year
  
  const nextChart = () => {
    if (!startDate || !endDate) return;

    const next = new Date(endDate);
    next.setDate(endDate.getDate() + 1);

    switch (chartTab) {
      case 1:
        groupByWeek(next);
        break;
      case 2:
        groupByMonth(
          new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1)
        );
        break;
      case 3:
        groupByYear(new Date(startDate.getFullYear() + 1, 0, 1));
        break;
      default:
        break;
    }
  };
  const previousChart = () => {
    if (!startDate || !endDate) return;

    switch (chartTab) {
      case 1:
        {
          const prev = new Date(startDate);
          prev.setDate(startDate.getDate() - 7);
          groupByWeek(prev);
        }
        break;
      case 2:
        groupByMonth(
          new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1)
        );
        break;
      case 3:
        groupByYear(new Date(startDate.getFullYear() - 1, 0, 1));
        break;
      default:
        break;
    }
  };

  // Chuyển đổi góc mũi tên
  const arrowRotate = arrowRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"], // Góc quay từ 0 độ đến 180 độ
  });

  useEffect(() => {
    const today = new Date().toDateString();
    const isLogged = weightLogs.some(
      (log) => new Date(log.log_date).toDateString() === today
    );
    setTodayLogs(
      weightLogs.find((log) => new Date(log.log_date).toDateString() === today)
        ?.weight || 0
    );

    setIsLogging(isLogged);
  }, [weightLogs]);

  const addWeightLog = (date: Date) => {
    if (!todayLogs) {
      Alert.alert("Warning", "Please enter a valid value", [{ text: "OK" }]);
      return;
    }

    const formattedDate = date.toDateString();

    const updatedLogs = [...logs];
    const existingIndex = updatedLogs.findIndex(
      (log) => new Date(log.log_date).toDateString() === formattedDate
    );

    const newEntry = {
      id: existingIndex >= 0 ? updatedLogs[existingIndex].id : logs.length + 1,
      log_date: date,
      weight: todayLogs,
      weight_unit: WeightUnit.KG,
    };

    if (existingIndex >= 0) {
      // Nếu log đã tồn tại → cập nhật
      updatedLogs[existingIndex] = newEntry;
    } else {
      // Nếu chưa có → thêm mới
      updatedLogs.push(newEntry);
    }

    setLogs(updatedLogs);
    setIsLogging(true);
    console.log("Updated logs:", updatedLogs);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className={`flex-1 ${darkMode ? "bg-[#1e1e1e]" : "bg-[#f7e7d5]"}`}
      >
        {/* Header */}
        <View className="bg-[#FF7A00] rounded-b-3xl items-center py-16 px-5 relative">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-14 left-4 w-10 h-10 border-2 border-white rounded-full items-center justify-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} color="#FFF" size={20} />
          </TouchableOpacity>
          <Text className="text-3xl absolute top-20 font-semibold text-white">
            Weight tracking
          </Text>
        </View>

        {/* Body */}
        <View className="px-4 mt-6">
          <Text
            className={`text-center text-base font-semibold mb-2 ${darkMode ? "text-orange-300" : "text-orange-600"}`}
          >
            {isLogging
              ? "You have already logged your weight today"
              : "Log your weight for today"}
          </Text>

          <View className="flex-row items-center justify-center gap-2 mb-4">
            <Text
              className={`text-base font-semibold ${darkMode ? "text-white" : "text-black"}`}
            >
              {moment().format("DD MMMM YYYY")}
            </Text>
          </View>

          <View className="flex-row items-center justify-center gap-2 mb-6">
            <TextInput
              keyboardType="numeric"
              placeholder="Enter weight"
              value={todayLogs?.toString() || ""}
              onChangeText={(text) => {
                const weight = parseFloat(text);
                if (!isNaN(weight)) {
                  setTodayLogs(weight);
                } else {
                  setTodayLogs(0);
                }
              }}
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className={`w-36 h-10 px-6 rounded-lg text-center border text-base font-semibold ${darkMode ? "bg-[#2b2b2b] text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
            />
            <TouchableOpacity className="rounded-lg bg-orange-500 p-2" onPress={() => setUnit(unit === WeightUnit.KG ? WeightUnit.LB : WeightUnit.KG)}>
              <Text
                className={`text-sm font-semibold text-white`}
              >
                {unit === WeightUnit.KG ? "KG" : "LB"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => addWeightLog(new Date())}
              className="bg-orange-500 px-4 py-2 rounded-md shadow-md"
            >
              <Text className="text-white font-semibold">Log</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View className="flex-row w-full rounded-xl overflow-hidden self-center shadow-md mb-6">
            {chartTabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                className={`flex-1 items-center py-2 ${
                  tab.id === chartTab ? "bg-orange-500" : "bg-white"
                }`}
                onPress={() => {
                  setChartTab(tab.id);
                  // Reset the chart data when switching tabs
                  setLogs(
                    weightLogs.filter(
                      (log) => log.log_date.getMonth() === new Date().getMonth()
                    )
                  );
                }}
              >
                <Text
                  className={`text-base font-semibold ${
                    tab.id === chartTab ? "text-white" : "text-black"
                  }`}
                >
                  {tab.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Chart */}
          <View className="flex-row justify-between mx-2 items-center ">
            <TouchableOpacity onPress={previousChart}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                color={darkMode ? "white" : "black"}
                size={20}
              />
            </TouchableOpacity>
            <View className="flex-col items-center mb-6">
              <Text
                className={`text-lg font-bold ${darkMode ? "text-white" : "text-black"}`}
              >
                {startDate && endDate
                  ? `${startDate.toLocaleDateString()} -  ${endDate.toLocaleDateString()}`
                  : "No data available"}
              </Text>
              <Text
                className={`text-sm ${darkMode ? "text-white" : "text-black"} mt-2`}
              >
                {dataChart.length > 0
                  ? `Total weight logs: ${dataChart.length}`
                  : "No weight logs available"}
              </Text>
            </View>
            <TouchableOpacity onPress={nextChart}>
              <FontAwesomeIcon
                icon={faArrowRight}
                color={darkMode ? "white" : "black"}
                size={20}
              />
            </TouchableOpacity>
          </View>
          {dataChart.length > 0 ? (
            <LineChart
              data={{
                labels: [],
                datasets: [
                  {
                    data: dataChart.map((log) => log.weight),
                  },
                ],
              }}
              width={screenWidth - 32}
              height={200}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(255, 122, 0, ${opacity})`,
                labelColor: () => (darkMode ? "black" : "#666"),
                propsForDots: {
                  r: "2",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{ borderRadius: 16 }}
            />
          ) : (
            <View className="bg-gray-100 dark:bg-[#2b2b2b] p-4 rounded-xl mt-4 mx-4 shadow-md items-center justify-center">
              <Text className="text-lg font-semibold text-center dark:text-white text-gray-700">
                No data available for this period
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Try selecting a different date range
              </Text>
            </View>
          )}

          {/* Weight History */}
          <View className="mt-8">
            <TouchableOpacity
              onPress={() => setOpen(!open)}
              className="flex-row items-start gap-2"
            >
              <Text
                className={`text-lg font-semibold mb-3 ${darkMode ? "text-white" : "text-orange-600"}`}
              >
                Weight history
              </Text>

              {/* Áp dụng Animated cho mũi tên */}
              <Animated.View style={{ transform: [{ rotate: arrowRotate }] }}>
                <FontAwesomeIcon
                  color={darkMode ? "white" : "orange"}
                  icon={open ? faArrowDown : faArrowDown}
                />
              </Animated.View>
            </TouchableOpacity>

            {open && (
              <Animated.View
                style={{
                  opacity: fadeAnim,
                }}
              >
                {dataChart.map((log, idx) => (
                  <View
                    key={idx}
                    className={`flex-row justify-between items-center px-4 py-3 mb-2 rounded-xl shadow-md ${darkMode ? "bg-[#2b2b2b]" : "bg-white"}`}
                  >
                    <View className="flex-col gap-2">
                      <Text
                        className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                      >
                        {log.log_date.toDateString()}
                      </Text>
                      {editIndex === log.id ? (
                        <TextInput
                          keyboardType="numeric"
                          value={editLog?.toString() || ""}
                          onChangeText={(text) => {
                            const weight = parseFloat(text);
                            if (!isNaN(weight)) {
                              setEditLog(weight);
                              console.log("Edit log weight:", weight);
                            } else {
                              setEditLog(0);
                            }
                          }}
                          className={`w-24 h-fit flex-row i py-1 px-4 rounded-lg text-center border text-lg font-bold ${darkMode ? "bg-[#2b2b2b] text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                        />
                      ) : (
                        <Text
                          className={`text-lg font-bold ${darkMode ? "text-white" : "text-black"}`}
                        >
                          {log.weight} KG
                        </Text>
                      )}
                    </View>

                    <View className="flex-row gap-6 mr-3">
                      {editIndex === log.id ? (
                        <TouchableOpacity
                          onPress={() => {
                            const updatedLogs = [...logs];
                            updatedLogs[log.id-1] = {
                              ...updatedLogs[log.id-1],
                              weight: editLog || 0,
                            };
                            setLogs(updatedLogs);
                            console.log("Updated log:", updatedLogs);
                            setEditIndex(null);
                            setEditLog(undefined);
                          }}
                          className="bg-green-500 p-2 flex-row items-center justify-center rounded-full"
                        >
                          <FontAwesomeIcon color="white" icon={faCheck} />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            setEditIndex(log.id);
                            setEditLog(log.weight);
                            console.log("Editing log:", log.id);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faPen}
                            size={20}
                            color="#FFA500"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </Animated.View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
