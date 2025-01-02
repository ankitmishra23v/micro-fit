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
import { createAgentInstance1 } from "@/services/utilities/api";
import { useAuth } from "@/auth/useAuth";

const AgentInstance1 = () => {
  const router = useRouter();
  const { firstName, lastName } = useAuth();
  const { agentInstanceNeoBeta, agentName } = useLocalSearchParams();

  const [formData, setFormData] = useState({
    name: `${firstName} ${lastName}`,
    country: "",
    age: "",
    aim: "",
    other_data: {},
  });
  const [loading, setLoading] = useState(false);

  const countryOptions = [
    "India",
    "United States",
    "United Kingdom",
    "Australia",
    "Japan",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCountrySelect = (country: string) => {
    setFormData((prev) => ({
      ...prev,
      country,
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
    const { name, country, age, aim } = formData;

    if (!name || !country || !age || !aim) {
      toast.error({ title: "Please fill all the fields." });
      return;
    }

    const payload = formData;

    try {
      setLoading(true);
      const response = await createAgentInstance1({
        data: payload,
        agentId: agentInstanceNeoBeta as string,
      });

      toast.success({ title: "Data submitted successfully!" });
      router.push("/home");
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

          <Text className="text-secondary text-m font-semibold tracking-wider mb-2 uppercase">
            What is your goal or aim for using this service?
          </Text>
          <TextInput
            placeholder="Your Aim"
            placeholderTextColor="#777"
            className="bg-[#292929] text-white p-4 rounded-lg mb-4 h-32"
            value={formData.aim}
            onChangeText={(value) => handleInputChange("aim", value)}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            className={`bg-primary py-3 rounded-md mt-6 ${
              loading ? "opacity-50" : ""
            }`}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
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

export default AgentInstance1;
