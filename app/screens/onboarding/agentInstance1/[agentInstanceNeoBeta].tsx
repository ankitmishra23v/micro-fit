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
  const { firstName, lastName, age: Age, country: Country } = useAuth();
  const { agentInstanceNeoBeta } = useLocalSearchParams();

  const [formData, setFormData] = useState({
    name: `${firstName} ${lastName}`,
    age: `${Age}`,
    country: Country,
    aim: "",
    other_data: {},
  });
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questions = [
    {
      type: "aim",
      question: "What is your goal or aim for using this service?",
      placeholder: "Your Aim",
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const { country, aim } = formData;

    if (!country || !aim) {
      toast.error({ title: "Please fill all the fields." });
      return;
    }

    const payload = formData;
    console.log("PAYLLL ", payload);

    try {
      setLoading(true);
      await createAgentInstance1({
        data: payload,
        agentId: agentInstanceNeoBeta as string,
      });
      toast.success({ title: "Data submitted successfully!" });
      router.push("/home");
    } catch (error) {
      console.error("ERRROR: ", error);
      toast.error({ title: "Failed to submit data. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isFormComplete = Object.values(formData).every((value) => value);

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <TouchableOpacity
        className="pt-[5%] px-5"
        onPress={currentQuestionIndex === 0 ? router.back : handlePrevious}
      >
        <Ionicons
          name={
            currentQuestionIndex === 0
              ? "chevron-back-sharp"
              : "arrow-back-sharp"
          }
          size={24}
          color="white"
        />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="px-5">
          <View>
            {currentQuestionIndex === 0 && (
              <Text className="text-white text-2xl font-bold px-1 mb-4 mt-8">
                Hi {firstName}, Let's create a task
              </Text>
            )}
          </View>
          <View className={`${currentQuestionIndex > 0 ? "py-24" : ""}`}>
            {currentQuestion.type === "aim" && (
              <View>
                <Text className="text-secondary text-m font-semibold tracking-wider mb-2 uppercase">
                  {currentQuestion.question}
                </Text>
                <TextInput
                  placeholder={currentQuestion.placeholder}
                  placeholderTextColor="#777"
                  className="bg-[#292929] text-white p-4 rounded-lg mb-4 h-32"
                  value={formData.aim}
                  onChangeText={(value) => handleInputChange("aim", value)}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            )}
            <View className="flex-row justify-between mb-4">
              {currentQuestionIndex < questions.length - 1 && (
                <TouchableOpacity
                  className={`bg-primary py-3 px-4 w-full rounded-md mt-6 ${
                    loading ? "opacity-50" : ""
                  }`}
                  onPress={handleNext}
                  disabled={loading}
                >
                  <Text className="text-white text-center text-lg font-semibold uppercase">
                    Next
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {currentQuestionIndex === questions.length - 1 && (
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
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AgentInstance1;
