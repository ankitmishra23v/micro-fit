import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "@/components/ToastManager";
import { createAgentInstance } from "@/services/utilities/api";
import { Ionicons } from "@expo/vector-icons";

const AgentDetailsScreen = () => {
  const { agentInstance } = useLocalSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    sleeping_hours: "",
    current_sleep_type: "",
    sleep_goal: "",
    diet: "",
    sleep_time: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.sleeping_hours ||
      !formData.current_sleep_type ||
      !formData.sleep_goal ||
      !formData.diet ||
      !formData.sleep_time
    ) {
      toast.error({ title: "Please fill all the fields." });
      return;
    }

    const payload = {
      input_data: formData,
    };

    try {
      setLoading(true);
      const response = await createAgentInstance({
        data: payload,
        agentId: agentInstance as string,
      });

      toast.success({ title: "Goal added successfully" });
      router.push("/home");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error({ title: "Failed to submit data. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-black h-full">
      <SafeAreaView>
        <View className="flex flex-row justify-start gap-[30%] items-center pt-5 px-5">
          <TouchableOpacity onPress={() => router.back()} className="max-w-8">
            <Ionicons name="chevron-back-sharp" size={24} color="white" />
          </TouchableOpacity>
          {/* <Header /> */}
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}>
        <View className="px-4">
          <Text className="text-white text-3xl font-bold text-center mb-12">
            Set Your Sleep Goal
          </Text>

          {/* Sleeping Hours Section */}
          <Text className="text-secondary text-m font-semibold tracking-wider mb-4 uppercase">
            How many hours do you usually sleep each night?
          </Text>
          <View className="flex flex-wrap flex-row justify-between mb-6">
            {["4", "6", "8", "10"].map((hour) => (
              <TouchableOpacity
                key={hour}
                className={`p-4 rounded-lg shadow-lg ${
                  formData.sleeping_hours === hour ? "bg-white" : "bg-[#292929]"
                } flex-1 mb-4 mr-4 min-w-[120px]`}
                onPress={() => handleInputChange("sleeping_hours", hour)}
              >
                <Text
                  className={`text-lg ${
                    formData.sleeping_hours === hour
                      ? "text-black"
                      : "text-white"
                  }`}
                >
                  {hour} hours
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Current Sleep Type Section */}
          <Text className="text-secondary text-m font-semibold  tracking-wider mb-4 uppercase">
            What type of sleep do you typically experience?
          </Text>
          <View className="flex flex-wrap flex-row justify-between mb-6">
            {["Light", "Deep", "Interrupted", "Restless"].map((type) => (
              <TouchableOpacity
                key={type}
                className={`p-4 rounded-lg shadow-lg ${
                  formData.current_sleep_type === type
                    ? "bg-white"
                    : "bg-[#292929]"
                } flex-1 mb-4 mr-4 min-w-[140px]`}
                onPress={() => handleInputChange("current_sleep_type", type)}
              >
                <Text
                  className={`text-lg ${
                    formData.current_sleep_type === type
                      ? "text-black"
                      : "text-white"
                  }`}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sleep Goal Section */}
          <Text className="text-secondary text-m font-semibold  tracking-wider mb-4 uppercase">
            What is your main sleep goal or improvement you'd like to achieve?
          </Text>
          <View className="flex flex-wrap flex-row justify-between mb-6">
            {[
              "Better quality of sleep",
              "Increase sleep duration",
              "Consistency in sleep schedule",
            ].map((goal) => (
              <TouchableOpacity
                key={goal}
                className={`p-4 rounded-lg shadow-lg ${
                  formData.sleep_goal === goal ? "bg-white" : "bg-[#292929]"
                } flex-1 mb-4 mr-4 min-w-[180px]`}
                onPress={() => handleInputChange("sleep_goal", goal)}
              >
                <Text
                  className={`text-lg ${
                    formData.sleep_goal === goal ? "text-black" : "text-white"
                  }`}
                >
                  {goal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Diet Section */}
          <Text className="text-secondary text-m font-semibold  tracking-wider mb-4 uppercase">
            What type of diet do you follow currently?
          </Text>
          <View className="flex flex-wrap flex-row justify-between mb-6">
            {["Veg", "Non-Veg", "Vegan", "Other"].map((diet) => (
              <TouchableOpacity
                key={diet}
                className={`p-4 rounded-lg shadow-lg ${
                  formData.diet === diet ? "bg-white" : "bg-[#292929]"
                } flex-1 mb-4 mr-4 min-w-[120px]`}
                onPress={() => handleInputChange("diet", diet)}
              >
                <Text
                  className={`text-lg ${
                    formData.diet === diet ? "text-black" : "text-white"
                  }`}
                >
                  {diet}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sleep Time Section */}
          <Text className="text-secondary text-m font-semibold tracking-wider mb-4 uppercase">
            What time do you usually go to bed each night?
          </Text>
          <View className="flex flex-wrap flex-row justify-between mb-6">
            {[
              "Before 9:00 PM",
              "9:00 PM - 11:00 PM",
              "11:00 PM - 1:00 AM",
              "After 1:00 AM",
            ].map((time) => (
              <TouchableOpacity
                key={time}
                className={`p-4 rounded-lg shadow-lg ${
                  formData.sleep_time === time ? "bg-white" : "bg-[#292929]"
                } flex-1 mb-4 mr-4 min-w-[140px]`}
                onPress={() => handleInputChange("sleep_time", time)}
              >
                <Text
                  className={`text-lg ${
                    formData.sleep_time === time ? "text-black" : "text-white"
                  }`}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Submit Button */}
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
    </View>
  );
};

export default AgentDetailsScreen;
