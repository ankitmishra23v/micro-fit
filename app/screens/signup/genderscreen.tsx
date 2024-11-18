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
  const router = useRouter();

  const handleNext = () => {
    if (gender && age) {
      router.push("/screens/signup/reminders");
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tell us more about you</Text>
      <View style={styles.section}>
        <Text style={styles.label}>What’s your gender?</Text>
        <View style={styles.genderOptions}>
          {["Male", "Female", "Other"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.genderButton,
                gender === option && styles.genderButtonSelected,
              ]}
              onPress={() => setGender(option)}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  gender === option && styles.genderButtonTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>What’s your age?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={age}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) {
              setAge(text);
            }
          }}
        />
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>NEXT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 12,
  },
  genderOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    height: 48,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#666",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  genderButtonSelected: {
    backgroundColor: "#666",
    borderColor: "#fff",
  },
  genderButtonText: {
    fontSize: 16,
    color: "#666",
  },
  genderButtonTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 8,
    paddingHorizontal: 16,
    color: "#fff",
    backgroundColor: "#1a1a1a",
  },
  nextButton: {
    height: 48,
    backgroundColor: "#6e6969",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default GenderAgeScreen;
