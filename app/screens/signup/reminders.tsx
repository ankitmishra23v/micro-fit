import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const GenderAgeScreen = () => {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const router = useRouter();

  const handleNext = () => {
    if (gender && age) {
      router.push("/screens/reminders");
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <Text className="text-white text-center text-xl font-semibold mb-10">
        Tell us more about you
      </Text>

      {/* Gender Section */}
      <View className="mb-8">
        <Text className="text-white text-lg mb-4">What’s your gender?</Text>
        <View className="flex-row justify-between">
          {["Male", "Female", "Other"].map((option) => (
            <TouchableOpacity
              key={option}
              className={`flex-1 h-12 mx-1 rounded-lg border border-gray-600 justify-center items-center ${
                gender === option ? "bg-gray-600 border-white" : "bg-gray-900"
              }`}
              onPress={() => setGender(option)}
            >
              <Text
                className={`text-base ${
                  gender === option ? "text-white font-bold" : "text-gray-400"
                }`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Age Section */}
      <View className="mb-8 ">
        <Text className="text-white text-lg mb-4">What’s your age?</Text>
        <TextInput
          className="h-16 border border-2 border-gray-800 rounded-lg p-4 text-white bg-black"
          placeholder="Enter your age"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
      </View>

      {/* Next Button */}
      <TouchableOpacity
        className="h-12 bg-[#6e6969] rounded-lg justify-center items-center mt-4"
        onPress={handleNext}
      >
        <Text className="text-white text-lg font-semibold">NEXT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GenderAgeScreen;
