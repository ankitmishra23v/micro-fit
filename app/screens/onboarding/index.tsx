import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";

const OnboardingScreen = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    setLoading(true); // Show loader
    try {
      await logout();
      router.replace("/screens/welcome");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Micro.Fit</Text>
      <Text style={styles.subHeading}>Your fitness journey starts here.</Text>

      <View style={styles.content}>
        <Text style={styles.text}>
          Get personalized workout plans and track your progress with ease.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
      ) : (
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-primary py-4 rounded-lg "
        >
          <Text className="text-white text-center ">LOG OUT</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    padding: 20,
    paddingTop: 50,
  },
  heading: {
    fontSize: 32,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  content: {
    marginBottom: 40,
  },
  text: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
});

export default OnboardingScreen;
