import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
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
    if (!formData.sleeping_hours) {
      toast.error({ title: "Please provide your sleeping hours." });
      return;
    }
    if (!formData.current_sleep_type) {
      toast.error({ title: "Please provide your current sleep type." });
      return;
    }
    if (!formData.sleep_goal) {
      toast.error({ title: "Please provide your sleep goal." });
      return;
    }
    if (!formData.diet) {
      toast.error({ title: "Please provide your diet." });
      return;
    }
    if (!formData.sleep_time) {
      toast.error({ title: "Please provide your sleep time." });
      return;
    }

    const payload = {
      input_data: formData,
    };

    try {
      setLoading(true);
      const response = await createAgentInstance({
        data: payload,
        userId: agentInstance as string,
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
        <View className="flex flex-row justify-start gap-[30%] items-center  pt-5 px-5">
          <TouchableOpacity onPress={() => router.back()} className=" max-w-8">
            <Ionicons name="chevron-back-sharp" size={24} color="white" />
          </TouchableOpacity>
          <Header />
        </View>
      </SafeAreaView>

      <View className="px-6 pt-10">
        <Text className="text-white text-3xl font-bold text-center mb-6">
          Set your goal
        </Text>
        <View className="flex flex-col gap-4">
          <TextInput
            className="w-full h-12 border border-primary text-white px-4 rounded-md"
            placeholder="Sleeping Hours"
            placeholderTextColor="#888"
            value={formData.sleeping_hours}
            onChangeText={(text) => handleInputChange("sleeping_hours", text)}
          />
          <TextInput
            className="w-full h-12 border border-primary text-white px-4 rounded-md"
            placeholder="Current Sleep Type"
            placeholderTextColor="#888"
            value={formData.current_sleep_type}
            onChangeText={(text) =>
              handleInputChange("current_sleep_type", text)
            }
          />
          <TextInput
            className="w-full h-12 border border-primary text-white px-4 rounded-md"
            placeholder="Sleep Goal"
            placeholderTextColor="#888"
            value={formData.sleep_goal}
            onChangeText={(text) => handleInputChange("sleep_goal", text)}
          />
          <TextInput
            className="w-full h-12 border border-primary text-white px-4 rounded-md"
            placeholder="Diet"
            placeholderTextColor="#888"
            value={formData.diet}
            onChangeText={(text) => handleInputChange("diet", text)}
          />
          <TextInput
            className="w-full h-12 border border-primary text-white px-4 rounded-md"
            placeholder="Sleep Time"
            placeholderTextColor="#888"
            value={formData.sleep_time}
            onChangeText={(text) => handleInputChange("sleep_time", text)}
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
              <Text className="text-white text-center text-lg font-semibold">
                Submit
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AgentDetailsScreen;
