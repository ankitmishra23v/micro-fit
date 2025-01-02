import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { toast } from "@/components/ToastManager";
import axios from "axios";
import { useAuth } from "@/auth/useAuth";

const AgentInstance2 = () => {
  const router = useRouter();
  const { firstName, lastName } = useAuth();
  const { agentInstance2, agentName } = useLocalSearchParams();

  const [formData, setFormData] = useState({
    name: `${firstName} ${lastName}`,
    country: "",
    age: "",
    aim:
      agentName === "Improve Productivity"
        ? "I want to improve my productivity"
        : "",
    other_data: {
      type: "",
      user: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const countryOptions = [
    "India",
    "United States",
    "United Kingdom",
    "Australia",
    "Japan",
  ];

  const typeOptions = [
    "Time Management",
    "Task Management",
    "Focus and Attention",
    "Energy and Motivation",
    "Goal Setting and Achievement",
    "Workflow Optimization",
    "Personal Growth",
    "Communication and Collaboration",
    "Decision-Making",
    "Creativity and Innovation",
    "Digital Productivity",
    "Financial Productivity",
    "Health and Wellness",
    "Learning and Skill Development",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOtherDataChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      other_data: {
        ...prev.other_data,
        [field]: value,
      },
    }));
  };

  const handleCountrySelect = (country: string) => {
    setFormData((prev) => ({
      ...prev,
      country,
    }));
  };

  const handleTypeSelect = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      other_data: {
        ...prev.other_data,
        type,
      },
    }));
  };

  const handleAgeChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        age: value,
      }));
    }
  };

  const handleSubmit = async () => {
    const { name, country, age, aim, other_data } = formData;

    if (
      !name ||
      !country ||
      !age ||
      (agentName !== "Self Discipline" && !other_data.type) ||
      (agentName !== "Self Discipline" && !other_data.user)
    ) {
      toast.error({ title: "Please fill all the fields." });
      return;
    }

    const payload = {
      ...formData,
      aim:
        agentName === "Self Discipline"
          ? `I want to improve self discipline on ${formData.aim}`
          : formData.aim,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "https://agents.scalaix.com/api/v1.0/agent/onboarding/questions",
        payload
      );

      const questionAnswers = response.data.data;

      const nextScreenData: any = {
        agentName,
        agentId: agentInstance2,
        name: formData.name,
        country: formData.country,
        age: formData.age,
        aim: formData.aim,
        other_data: {
          questions_answers: questionAnswers,
          type: formData.other_data.type || "",
        },
      };

      router.push({
        pathname: "/screens/onboarding/instanceOnboard2/[agentInstanceOnboard]",
        params: {
          ...nextScreenData,
          other_data: JSON.stringify(nextScreenData.other_data),
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error({ title: "Failed to submit data. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <TouchableOpacity className="pt-[5%] px-5" onPress={() => router.back()}>
        <Ionicons name="chevron-back-sharp" size={24} color="white" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="px-5">
          <Text className="text-white text-2xl font-bold px-1 mb-4 mt-8">
            Let's create a task
          </Text>

          <TextInput
            placeholder="Name"
            placeholderTextColor="#777"
            className="bg-[#292929] text-white p-4 rounded-lg mb-4"
            value={formData.name}
            editable={false}
          />

          <Text className="text-secondary text-m font-semibold tracking-wider mb-4 uppercase">
            Select your country
          </Text>
          <View className="flex flex-wrap flex-row mb-6">
            {countryOptions.map((country) => (
              <TouchableOpacity
                key={country}
                className={`p-4 rounded-lg shadow-lg ${
                  formData.country === country ? "bg-white" : "bg-[#292929]"
                } flex-1 mb-4 mr-4 min-w-[140px]`}
                onPress={() => handleCountrySelect(country)}
              >
                <Text
                  className={`text-lg ${
                    formData.country === country ? "text-black" : "text-white"
                  }`}
                >
                  {country}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Age"
            placeholderTextColor="#777"
            className="bg-[#292929] text-white p-4 rounded-lg mb-4"
            value={formData.age}
            onChangeText={handleAgeChange}
            keyboardType="numeric"
          />

          {agentName === "Self Discipline" && (
            <>
              <Text className="text-secondary text-m font-semibold tracking-wider mb-4 uppercase">
                What specific area of self-discipline do you want to improve?
              </Text>
              <TextInput
                placeholder="Describe the area you'd like to improve"
                placeholderTextColor="#999"
                className="bg-[#1c1c1e] text-white px-4 py-4 rounded-lg text-base mb-4 shadow-lg"
                value={formData.aim}
                onChangeText={(value) => handleInputChange("aim", value)}
                multiline
                textAlignVertical="top"
              />

              <View className="bg-primary p-4 rounded-lg mb-6">
                <Text className="text-gray-400 text-sm mb-3">
                  Here are some examples to inspire you:
                </Text>
                <View className="space-y-3 ">
                  {[
                    "Consistency in exercise",
                    "Sticking to a study schedule",
                    "Reducing procrastination",
                  ].map((example, index) => (
                    <TouchableOpacity
                      key={index}
                      className={`flex-row items-center mb-2 bg-[#3a3a3c] p-3 rounded-md ${
                        formData.aim === example
                          ? "border border-green-500"
                          : ""
                      }`}
                      onPress={() => handleInputChange("aim", example)}
                    >
                      <Ionicons
                        name="bulb"
                        size={20}
                        color={formData.aim === example ? "#4caf50" : "#888"}
                      />
                      <Text
                        className={`text-sm ml-3 ${
                          formData.aim === example
                            ? "text-green-400"
                            : "text-white"
                        }`}
                      >
                        {example}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text className="text-gray-500 text-center text-sm italic">
                Your input helps us create a personalized experience.
              </Text>
            </>
          )}

          {agentName === "Improve Productivity" && (
            <>
              <Text className="text-secondary text-m font-semibold tracking-wider mb-4 uppercase">
                Select a Productivity type
              </Text>
              <View className="flex flex-wrap flex-row mb-6">
                {typeOptions.map((type) => (
                  <TouchableOpacity
                    key={type}
                    className={`p-4 rounded-lg shadow-lg ${
                      formData.other_data.type === type
                        ? "bg-white"
                        : "bg-[#292929]"
                    } flex-1 mb-4 mr-4 min-w-[140px]`}
                    onPress={() => handleTypeSelect(type)}
                  >
                    <Text
                      className={`text-lg ${
                        formData.other_data.type === type
                          ? "text-black"
                          : "text-white"
                      }`}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-secondary text-m font-semibold tracking-wider mb-2 uppercase">
                Additional Information about your task
              </Text>
              <TextInput
                placeholder="Enter details"
                placeholderTextColor="#777"
                className="bg-[#292929] text-white p-4 rounded-lg mb-4 h-32"
                value={formData.other_data.user}
                onChangeText={(value) => handleOtherDataChange("user", value)}
                multiline
                textAlignVertical="top"
              />
            </>
          )}

          <TouchableOpacity
            className={`bg-primary py-3 rounded-md mt-6 ${
              loading ? "opacity-50" : ""
            }`}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Text className="text-white text-center text-lg font-semibold uppercase">
                Generating Questions...
              </Text>
            ) : (
              <Text className="text-white text-center text-lg font-semibold uppercase">
                Submit
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AgentInstance2;
