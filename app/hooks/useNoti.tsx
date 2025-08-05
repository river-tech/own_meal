import { useState, useEffect, useCallback } from "react";
import { Platform, Alert } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { router } from "expo-router";

// Set up the notification handler to process notifications in background and foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true, // Play sound
    shouldSetBadge: false, // Don't change the badge
    shouldShowBanner: true, // Show banner when notification arrives
    shouldShowList: true, // Add to notification list
  }),
});

export default function useNoti() {
  const [token, setToken] = useState<string | "">(""); // Store the expo push token
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined); // To store incoming notification

  useEffect(() => {
    // Register for push notifications when the app is mounted
    registerForPushNotificationsAsync().then((token) => {
      setToken(token || "");
    });

    // Set up listeners to handle notifications while the app is in foreground or background
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification); // Store the notification when it is received
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:", response);
      });

    // Clean up the listeners when the component is unmounted
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  // Function to schedule a push notification after a delay
  const schedulePushNotification = useCallback(
    async ({ title, body }: { title?: string; body?: string }) => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { data: "goes here", test: { test1: "more data" } },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2, // Use provided seconds or default to 2
        },
      });
    },
    [] // Empty dependency array means it will be created only once.
  );
  return {
    token,
    notification,
    schedulePushNotification, // Expose the function to schedule notifications
  };
}

// Function to register the device for push notifications and get the token
async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert(
        "Push Notification",
        "Failed to get push token for push notification!"
      );
      return;
    }

    try {
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ||
        process.env.EXPO_PROJECT_ID;
      if (!projectId) {
        throw new Error("Project ID not found");
      }

      // Fetch the Expo Push Token
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("Push token:", token); // Log the token for debugging
    } catch (e) {
      console.error("Error fetching push token:", e);
      token = `${e}`;
    }
  } else {
    Alert.alert(
      "Device Error",
      "Must use physical device for Push Notifications"
    );
  }

  return token;
}
