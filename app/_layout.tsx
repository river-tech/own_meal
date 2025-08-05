import { Stack } from "expo-router";
import "../global.css"
import { useEffect } from "react";
// import * as SecureStore from "expo-secure-store";

export default function RootLayout() {


  return <Stack screenOptions={{ headerShown: false }} />;
}
