import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Image } from "react-native";
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
          router.replace("/home");
        } else {
          router.replace("/screens/welcome");
        }
      } catch (error) {
        console.error("Error determining authentication status:", error);
        router.replace("/screens/welcome");
      }
    };

    if (layoutReady) {
      redirectUser();
    }
  }, [layoutReady, isAuthenticated]);

  useEffect(() => {
    const timeout = setTimeout(() => setLayoutReady(true), 2500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/MICRO.FIT.gif")}
        style={styles.gif}
      />
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
  gif: {
    width: 300,
    height: 300,
  },
});
