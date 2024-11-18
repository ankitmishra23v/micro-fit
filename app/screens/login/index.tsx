import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router"; // Use the router for navigation

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter(); // Access the router object for navigation

  const handleLogin = () => {
    // Simple validation for demo purposes
    if (email === "user@example.com" && password === "password123") {
      router.push("/screens/onboarding"); // Navigate to onboarding screen
    } else {
      setErrorMessage("Invalid credentials. Please try again.");
    }
  };

  const handleChangeEmail = (text: string) => {
    setEmail(text);
    setErrorMessage(""); // Clear error message when user starts typing
  };

  const handleChangePassword = (text: string) => {
    setPassword(text);
    setErrorMessage(""); // Clear error message when user starts typing
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <Text style={styles.subHeading}>Welcome back to Micro.Fit</Text>

      <View className="mb-[4%]">
        <Text className="tracking-wide mb-2 text-md text-white">EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={handleChangeEmail} // Use the updated handler
          placeholderTextColor="#aaa"
        />
      </View>
      <Text className="tracking-wide mb-2 text-md text-white">PASSWORD</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={handleChangePassword} // Use the updated handler
        secureTextEntry
        placeholderTextColor="#aaa"
      />

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity
        className="mt-[20%] bg-[#333] rounded-lg p-4"
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
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
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    color: "#fff", // White text for inputs
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#333", // Dark button color
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
