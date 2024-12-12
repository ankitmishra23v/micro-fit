import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/Header";

const GenderAgeScreen = () => {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const router = useRouter();

  const handleNext = () => {
    if (gender && age) {
      router.push("/screens/login");
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <View className="flex-1 bg-black px-6 pt-8">
      <View>
        <Header />
      </View>
      <Text className="text-[#CDCDCD] text-sm tracking-wider font-bold  mt-[30%] mb-[4%] uppercase">
        Tell us more about you
      </Text>
      <View className="mb-6">
        <Text className="text-white text-2xl font-bold mb-4">
          What’s your gender?
        </Text>
        <View className="flex-row justify-between mb-[10%]">
          {["Male", "Female", "Other"].map((option) => (
            <TouchableOpacity
              key={option}
              className={`flex-1 h-12 mx-1 rounded-lg border ${
                gender === option
                  ? "bg-[#333333] border-white"
                  : "bg-gray-900 border-gray-600"
              } justify-center items-center`}
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
      <View className="mb-6">
        <Text className="text-white text-lg mb-4">What’s your age?</Text>
        <TextInput
          className="h-12 border border-gray-600 rounded-lg px-4 text-white "
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
      <TouchableOpacity
        className="h-12 bg-[#333333] rounded-lg justify-center items-center mt-4"
        onPress={handleNext}
      >
        <Text className="text-white text-lg font-bold">NEXT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GenderAgeScreen;
