import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { toast } from "@/components/ToastManager";
import axios from "axios";
import { useAuth } from "@/auth/useAuth";

interface Question {
  field: string;
  type: "select" | "text";
  label: string;
  placeholder?: string;
  options?: string[];
  examples?: string[];
}

const CustomProgressBar = ({ progress }: { progress: number }) => {
  return (
    <View
      style={{
        width: "100%",
        height: 10,
        backgroundColor: "#1C1C1E",
        borderRadius: 5,
      }}
    >
      <View
        style={{
          height: "100%",
          backgroundColor: "#D97706",
          width: `${progress}%`,
          borderRadius: 5,
        }}
      />
    </View>
  );
};

const AgentInstance2: React.FC = () => {
  const router = useRouter();
  const { firstName, lastName, age: Age, country: Country } = useAuth();
  const { agentInstance2, agentName } = useLocalSearchParams<{
    agentInstance2: string;
    agentName: string;
  }>();

  const [formData, setFormData] = useState<any>({
    name: `${firstName} ${lastName}`,
    country: Country,
    age: `${Age}`,
    aim:
      agentName === "Improve Productivity"
        ? "I want to improve my productivity"
        : "",
    other_data: { type: "", user: "" },
  });

  const [answeredQuestions, setAnsweredQuestions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmAdditionalInputs, setConfirmAdditionalInputs] =
    useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false); // State for submitting status

  const productivityTypeOptions: string[] = [
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
    "Stress Management",
    "Work-Life Balance",
    "Mindfulness and Meditation",
    "Leadership Skills",
    "Team Collaboration",
    "Public Speaking",
  ];

  const selfDisciplineQuestions: Question[] = [
    {
      field: "aim",
      type: "text",
      label: "What specific area of self-discipline do you want to improve?",
      placeholder: "Describe the area you'd like to improve",
      examples: [
        "Consistency in exercise",
        "Sticking to a study schedule",
        "Reducing procrastination",
      ],
    },
  ];

  const productivityQuestions: Question[] = [
    {
      field: "type",
      type: "select",
      label: "Select a Productivity type which matches your need",
      options: productivityTypeOptions,
    },
    {
      field: "user",
      type: "text",
      label: "Additional Information about your task",
      placeholder: "Enter details",
    },
  ];

  const questions: Question[] =
    agentName === "Self Discipline"
      ? selfDisciplineQuestions
      : productivityQuestions;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleNextQuestion = () => {
    if (!formData[questions[answeredQuestions]?.field]) {
      toast.error({ title: "Please fill out this field before continuing." });
      return;
    }
    setAnsweredQuestions((prev) => prev + 1);
  };

  const handlePreviousQuestion = () => {
    if (answeredQuestions > 0) {
      setAnsweredQuestions((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    setSubmitting(true); // Set submitting to true after clicking submit
    setTimeout(() => {
      setLoading(false);
      setConfirmAdditionalInputs(true);
    }, 1000);
  };

  const handleFinalSubmit = async () => {
    console.log("BUTTON CLICKED");
    try {
      setLoading(true);

      const payload = {
        ...formData,
        aim:
          agentName === "Self Discipline"
            ? `I want to improve self discipline on ${formData.aim}`
            : formData.aim,
        other_data: { type: formData.type || "", user: formData.user || "" },
      };

      delete payload.type;
      delete payload.user;

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
        aim: payload.aim,
        other_data: {
          questions_answers: questionAnswers,
          type: formData.type || "",
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
      toast.error({ title: "Failed to submit data. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[answeredQuestions] || null;
  const progress = (answeredQuestions / questions.length) * 100;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView className="flex-1 bg-black">
          {!submitting && (
            <TouchableOpacity
              className="mt-[5%] px-5"
              onPress={
                answeredQuestions > 0 ? handlePreviousQuestion : router.back
              }
            >
              <Ionicons
                name={
                  answeredQuestions > 0
                    ? "arrow-back-sharp"
                    : "chevron-back-sharp"
                }
                size={24}
                color="white"
              />
            </TouchableOpacity>
          )}

          <ScrollView
            contentContainerStyle={{ paddingBottom: 60, paddingTop: 16 }}
          >
            <View
              className={`px-5 ${
                answeredQuestions === 0 ? "py-[10%]" : "py-[25%]"
              }`}
            >
              {answeredQuestions === 0 && !submitting && (
                <Text className="text-white text-2xl font-bold px-1 mb-8 mt-8">
                  Hi {`${firstName}`}, let's create a task
                </Text>
              )}

              {/* Progress bar
              {!submitting && <CustomProgressBar progress={progress} />} */}
              {!submitting && (
                <Text className="text-white text-sm mb-4">
                  {answeredQuestions + 1} / {questions.length}
                </Text>
              )}

              {submitting ? (
                <View className="flex justify-center items-center h-[90%]">
                  <View className="items-center justify-center p-5">
                    <Ionicons
                      name="save-outline"
                      size={64}
                      color="lightgreen"
                    />
                    <Text className="text-white text-2xl font-bold text-start mb-4 mt-4">
                      Your input has been successfully saved!
                    </Text>
                    <Text className="text-secondary text-lg text-start mb-6">
                      To personalize your tasks, I just need a couple more
                      details.
                    </Text>
                  </View>
                </View>
              ) : (
                currentQuestion && (
                  <>
                    <Text className="text-secondary text-m mt-4 font-semibold tracking-wider mb-4 uppercase">
                      {currentQuestion.label}
                    </Text>

                    {currentQuestion.type === "select" && (
                      <View className="flex flex-wrap flex-row mb-6">
                        {currentQuestion.options?.map((option) => (
                          <TouchableOpacity
                            key={option}
                            className={`p-4 rounded-lg shadow-lg ${
                              formData[currentQuestion.field] === option
                                ? "bg-white"
                                : "bg-[#292929]"
                            } flex-1 mb-4 mr-4 min-w-[140px]`}
                            onPress={() =>
                              handleInputChange(currentQuestion.field, option)
                            }
                          >
                            <Text
                              className={`text-lg ${
                                formData[currentQuestion.field] === option
                                  ? "text-black"
                                  : "text-white"
                              }`}
                            >
                              {option}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {currentQuestion.type === "text" && (
                      <>
                        <TextInput
                          placeholder={currentQuestion.placeholder}
                          placeholderTextColor="#777"
                          multiline={true}
                          className="bg-[#292929] text-white p-4 rounded-lg mb-4 min-h-24"
                          value={formData[currentQuestion.field]}
                          onChangeText={(value) =>
                            handleInputChange(currentQuestion.field, value)
                          }
                        />
                        {currentQuestion.examples && (
                          <View className="bg-primary p-4 rounded-lg mb-6">
                            <Text className="text-gray-400 text-sm mb-3">
                              Examples to inspire you:
                            </Text>
                            {currentQuestion.examples.map((example, index) => (
                              <TouchableOpacity
                                key={index}
                                className={`flex-row items-center mb-2 bg-[#3a3a3c] p-3 rounded-md ${
                                  formData[currentQuestion.field] === example
                                    ? "border border-white"
                                    : ""
                                }`}
                                onPress={() =>
                                  handleInputChange(
                                    currentQuestion.field,
                                    example
                                  )
                                }
                              >
                                <Ionicons
                                  name="bulb"
                                  size={20}
                                  color={
                                    formData[currentQuestion.field] === example
                                      ? "white"
                                      : "#888"
                                  }
                                />
                                <Text
                                  className={`text-sm ml-3 ${
                                    formData[currentQuestion.field] === example
                                      ? "text-white font-semibold"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {example}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </>
                    )}
                  </>
                )
              )}
              {!submitting && (
                <TouchableOpacity
                  className={`bg-primary py-3 rounded-md mt-6 ${
                    loading ? "opacity-50" : ""
                  }`}
                  onPress={
                    answeredQuestions < questions.length - 1
                      ? handleNextQuestion
                      : handleSubmit
                  }
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white text-center text-lg font-semibold uppercase">
                      {answeredQuestions < questions.length - 1
                        ? "Next"
                        : "Submit"}
                    </Text>
                  )}
                </TouchableOpacity>
              )}

              {submitting && (
                <TouchableOpacity
                  className={`bg-primary py-3 rounded-md mt-6 ${
                    loading ? "opacity-50" : ""
                  }`}
                  onPress={handleFinalSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white text-center text-lg font-semibold uppercase">
                      Proceed
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AgentInstance2;
