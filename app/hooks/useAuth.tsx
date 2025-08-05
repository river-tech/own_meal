import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useCallback } from "react";
import { IPersonalDetails, IUser } from "model/user";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function useAuth() {
  const router = useRouter();

  /* ---------- helper ---------- */
  const getToken = async () => {
    const res = await SecureStore.getItemAsync("userToken");
    return JSON.parse(res || "{}");
  };

  // check token validity

  const refreshToken = useCallback(async () => {
    const [username, password] = await Promise.all([
      SecureStore.getItemAsync("username"),
      SecureStore.getItemAsync("password"),
    ]);
    if (!username || !password) return false;

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      await SecureStore.setItemAsync("userToken", JSON.stringify(res.data));
      return true;
    } catch {
      return false;
    }
  }, []);

  /* ---------- 1. Fetch PROFILE ---------- */
  const fetchProfile =
    useCallback(async (): Promise<IPersonalDetails | null> => {
      const cached = await AsyncStorage.getItem("personalDetails");
      if (cached) return JSON.parse(cached);
      

      let token = await getToken();
      try {
        const { data } = await axios.get<IPersonalDetails>(
          `${API_URL}/users/view/personal`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await AsyncStorage.setItem("personalDetails", JSON.stringify(data));
        return data;
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        if (err.response?.status === 401 && (await refreshToken())) {
          token = await getToken();
          const { data } = await axios.get<IPersonalDetails>(
            `${API_URL}/users/view/personal`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          await AsyncStorage.setItem("personalDetails", JSON.stringify(data));
          return data;
        }
        
        return null;
      }
    }, []);

  /* ---------- 2. Fetch SETTINGS ---------- */
  const fetchSettings = useCallback(async (): Promise<IUser | null> => {
    const cached = await AsyncStorage.getItem("personalSettings");
    if (cached) return JSON.parse(cached);

    let token = await getToken();
    try {
      const { data } = await axios.get<IUser>(`${API_URL}/users/view/setting`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await AsyncStorage.setItem("personalSettings", JSON.stringify(data));
      return data;
    } catch (err: any) {
      if (err.response?.status === 401 && (await refreshToken())) {
        token = await getToken();
        const { data } = await axios.get<IUser>(
          `${API_URL}/users/view/setting`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await AsyncStorage.setItem("personalSettings", JSON.stringify(data));
        return data;
      }
      console.error("Error fetching settings:", err);
      return null;
    }
  }, []);

  /* ---------- 3. Sync cả hai (tuỳ dùng) ---------- */
  const syncUser = useCallback(async () => {
    const profile = await fetchProfile();
    if (profile && profile.caloriesIndex == null) {
      router.replace("/Profile/Personal?newUser=true");
    }
    await fetchSettings();
  }, [fetchProfile, fetchSettings]);

  return {
    getToken,
    fetchProfile,
    fetchSettings,
    syncUser,
    refreshToken,
  };
}
