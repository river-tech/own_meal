import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, useColorScheme } from "react-native";

const notificationsData = [
  {
    id: 1,
    title: "Title",
    description:
      "Hãy kiểm tra các tính năng mới được cập nhật trong phiên bản 2.0.",
    read: false,
  },
  {
    id: 2,
    title: "Title",
    description:
      "Hãy kiểm tra các tính năng mới được cập nhật trong phiên bản 2.0.",
    read: true,
  },
];

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [filter, setFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false); // Modal state
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null); // Keep track of the notification to delete
  const [deleteAll, setDeleteAll] = useState(false); // Flag to check if deleting all

  const colorScheme = useColorScheme();
  const darkMode = colorScheme === "dark";

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "All") return true;
    return filter === "Read" ? notification.read : !notification.read;
  });

  const toggleReadStatus = (id: number) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id && !notification.read // Chỉ chuyển thành Read khi trạng thái là Unread
        ? { ...notification, read: true }
        : notification
    );
    setNotifications(updatedNotifications);
  };

  const markAsUnread = (id: number) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id && notification.read // Chỉ chuyển thành Unread khi trạng thái là Read
        ? { ...notification, read: false }
        : notification
    );
    setNotifications(updatedNotifications);
  };

  const deleteNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
    setModalVisible(false); // Close modal after delete all
  };

  const router = useRouter();

  return (
    <View className={`flex-1 ${darkMode ? "bg-[#1e1e1e]" : "bg-[#f7e7d5]"}`}>
      {/* Header */}
      <View className="bg-[#FF7A00] rounded-b-3xl items-center py-16 px-5 relative">
        {/* backbutton */}
        <View className="absolute top-16 left-4 z-50">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full border-2 border-white items-center justify-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} color={"#FFF"} size={20} />
          </TouchableOpacity>
        </View>
        <Text className="text-3xl absolute top-20 font-semibold text-white">
          Notifications
        </Text>
      </View>

      {/* Filter Buttons */}
      <View className="flex-row justify-start gap-2 mt-4 pl-2">
        {/* All Button */}
        <TouchableOpacity
          onPress={() => setFilter("All")}
          className={`px-6 py-2 w-fit  rounded-lg ${filter === "All" ? "bg-orange-500 border-orange-600" : "bg-white border-gray-300"}`}
        >
          <Text
            className={`${filter === "All" ? "text-white" : "text-orange-500"}`}
          >
            All
          </Text>
        </TouchableOpacity>

        {/* Read Button */}
        <TouchableOpacity
          onPress={() => setFilter("Read")}
          className={`px-6 py-2 w-fit  rounded-lg ${filter === "Read" ? "bg-orange-500 border-orange-600" : "bg-white border-gray-300"}`}
        >
          <Text
            className={`${filter === "Read" ? "text-white" : "text-orange-500"}`}
          >
            Read
          </Text>
        </TouchableOpacity>

        {/* Unread Button */}
        <TouchableOpacity
          onPress={() => setFilter("Unread")}
          className={`px-6 py-2 w-fit  rounded-lg ${filter === "Unread" ? "bg-orange-500 border-orange-600" : "bg-white border-gray-300"}`}
        >
          <Text
            className={`${filter === "Unread" ? "text-white" : "text-orange-500"}`}
          >
            Unread
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        className="mx-2"
        data={filteredNotifications}
        renderItem={({ item }) => (
          <View
            className={`p-4 rounded-xl my-2 ${item.read ? "bg-gray-200" : "bg-orange-50"}`}
          >
            <TouchableOpacity onPress={() => toggleReadStatus(item.id)}>
              <Text
                className={`font-bold text-xl py-2 text--black `}
              >
                {item.title}
              </Text>
              <Text
                className={`text-gray-600`}
              >
                {item.description}
              </Text>
              <View className="flex-row justify-between items-center mt-2 ">
                <View className="mt-4">
                  {item.read && (
                    <TouchableOpacity
                      onPress={() => {
                        markAsUnread(item.id);
                      }}
                      className={`${darkMode? "bg-gray-600":"bg-orange-400"} px-4 py-2 rounded-lg`}
                    >
                      <Text className="text-white font-bold">Mask as unread</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity onPress={() => {
                  setSelectedNotification(item.id);
                  setModalVisible(true);
                }}>
                  <FontAwesomeIcon color="#E63946" icon={faTrash} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Delete All Button */}
      <TouchableOpacity
        onPress={() => {
          setDeleteAll(true);
          setModalVisible(true);
        }}
        className="flex-row absolute bottom-5 right-5 transform bg-red-500 p-3 rounded-full justify-center items-center"
      >
        <FontAwesomeIcon color="#fff" icon={faTrash} />
        <Text className="text-white ml-2">Delete All</Text>
      </TouchableOpacity>

      {/* Modal for Confirmation */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setDeleteAll(false); // Reset deleteAll to false on modal close
        }}
      >
       <View className="flex-1 items-center justify-center px-4 h-screen  bg-black/30">

          <View className="bg-white p-6 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4">
              Are you sure you want to {deleteAll ? "delete all" : "delete this item"}?
            </Text>
            <View className="flex-row mt-2 justify-between">
              <TouchableOpacity
                onPress={() => {
                  deleteAll ? deleteAllNotifications() : (selectedNotification !== null && deleteNotification(selectedNotification));
                  setModalVisible(false);
                  setDeleteAll(false); // Reset deleteAll after confirming
                }}
                className="bg-red-500 px-8 py-2 rounded-lg"
              >
                <Text className="text-white">Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setDeleteAll(false); // Reset deleteAll on cancel
                }}
                className="bg-gray-300 px-8 py-2 rounded-lg"
              >
                <Text className="text-black">No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NotificationScreen;
