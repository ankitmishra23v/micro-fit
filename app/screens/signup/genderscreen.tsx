// /app/screens/gender-age/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

const GenderAgeScreen = () => {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const router = useRouter(); // Use the router for navigation

  const handleNext = () => {
    if (gender && age) {
      router.push("/reminders"); // Navigate to the next screen (Turn On Reminders)
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <View style={styles.container}>
      <Text className="text-lg text-white ">Tell Us More About You</Text>

      <Text style={styles.label}>What's your gender?</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity onPress={() => setGender("Male")}>
          <Text
            style={[
              styles.radioText,
              gender === "Male" && styles.selectedRadio,
            ]}
          >
            Male
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setGender("Female")}>
          <Text
            style={[
              styles.radioText,
              gender === "Female" && styles.selectedRadio,
            ]}
          >
            Female
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setGender("Other")}>
          <Text
            style={[
              styles.radioText,
              gender === "Other" && styles.selectedRadio,
            ]}
          >
            Other
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>What's your Age?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>NEXT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    padding: 20,
  },
  heading: {
    fontSize: 32,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  radioText: {
    color: "#fff",
    fontSize: 16,
  },
  selectedRadio: {
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    color: "#fff",
  },
  button: {
    backgroundColor: "#333",
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GenderAgeScreen;
