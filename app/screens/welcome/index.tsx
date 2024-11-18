import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>MICRO.FIT</Text>
      <View>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.description}>
          You’re only a few steps away to set and complete your goals.
        </Text>
      </View>
      <View style={styles.actionContainer}>
        <Text style={styles.actionText}>ALREADY HAVE AN ACCOUNT?</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/screens/login")}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionContainer}>
        <Text style={styles.actionText}>NEW TO MICRO.FIT?</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/screens/signup")}
        >
          <Text style={styles.buttonText}>SIGN UP WITH EMAIL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#000",
    paddingHorizontal: 24,
  },
  logoText: {
    color: "#666",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 3,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 32,
  },
  actionContainer: {
    width: "100%",
  },
  actionText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#333",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
});

export default WelcomeScreen;
