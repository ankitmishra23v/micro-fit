import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../auth/useAuth";

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = isAuthenticated();
      setLoading(false); // Stop showing splash screen
      if (authenticated) {
        router.replace("/screens/onboarding");
      } else {
        router.replace("/screens/welcome");
      }
    };

    checkAuth();
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>MICRO. FIT</Text>
      </View>
    );
  }

  return null; // Render nothing while redirecting
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
});
