import React from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router"; // Use the router for navigation

const OnboardingScreen = () => {
  const router = useRouter(); // Access the router object for navigation

  const handleNext = () => {
    // Navigate to the next screen (could be a dashboard or home screen)
    router.push("/screens/welcome");
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

      <Button title="Start Now" onPress={handleNext} color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Dark background color
    justifyContent: "center",
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 40,
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
});

export default OnboardingScreen;
