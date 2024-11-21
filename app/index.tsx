import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [layoutReady, setLayoutReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!layoutReady) return;

      try {
        if (isAuthenticated()) {
          router.replace("/screens/onboarding");
        } else {
          router.replace("/screens/welcome");
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
        router.replace("/screens/welcome");
      }
    };

    checkAuth();
  }, [isAuthenticated, layoutReady]);

  useEffect(() => {
    setTimeout(() => setLayoutReady(true), 2500);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MICRO. FIT</Text>
      <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "bold",
    letterSpacing: 5,
  },
  loader: {
    marginTop: 20,
  },
});
