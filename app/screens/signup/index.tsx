import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router"; // Use the router for navigation

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter(); // Access the router object for navigation

  const handleSignup = () => {
    // Simple validation for demo purposes
    if (email && password && firstName) {
      // On successful signup, navigate to GenderScreen
      router.push("/screens/signup/genderscreen"); // Correct path
    } else {
      setErrorMessage("Please fill in all fields.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>
      <Text style={styles.subHeading}>Create a new account on Micro.Fit</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor="#aaa"
      />

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
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

export default SignupScreen;
