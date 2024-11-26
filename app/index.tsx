import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [layoutReady, setLayoutReady] = useState(false);

  useEffect(() => {
    const redirectUser = async () => {
      try {
        if (isAuthenticated()) {
          router.replace("/home"); // Redirect to home if authenticated
        } else {
          router.replace("/screens/welcome"); // Redirect to welcome if not authenticated
        }
      } catch (error) {
        console.error("Error determining authentication status:", error);
        router.replace("/screens/welcome"); // Fallback in case of error
      }
    };

    if (layoutReady) {
      redirectUser();
    }
  }, [layoutReady, isAuthenticated]);

  // Simulate layout readiness
  useEffect(() => {
    const timeout = setTimeout(() => setLayoutReady(true), 2500);
    return () => clearTimeout(timeout); // Cleanup timeout on unmount
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
