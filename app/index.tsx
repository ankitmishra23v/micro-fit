// /app/_app.js
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
