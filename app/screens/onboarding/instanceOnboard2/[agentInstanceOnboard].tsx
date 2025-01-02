import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  Animated,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { createAgentInstance1 } from "@/services/utilities/api";
import { toast } from "@/components/ToastManager";
import { Ionicons } from "@expo/vector-icons";

interface Answer {
  question: string;
  answer: string;
}

const AgentInstanceOnboard = () => {
  const { agentName, agentId, name, country, age, aim, other_data } =
    useLocalSearchParams();
  const parsedOtherData = other_data ? JSON.parse(other_data as string) : null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState<Boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [customAnswer, setCustomAnswer] = useState<string>("");
  const [translateY] = useState(new Animated.Value(100));
  const [opacity] = useState(new Animated.Value(0));
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    Animated.timing(opacity, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const handleNext = () => {
    const answer = selectedAnswer === "Other" ? customAnswer : selectedAnswer;
    setSelectedAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: parsedOtherData?.questions_answers[currentIndex]?.question,
        answer: answer || "",
      },
    ]);

    Animated.timing(opacity, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (currentIndex < parsedOtherData?.questions_answers.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setSelectedAnswer(null);
          setCustomAnswer("");
        } else {
          setIsComplete(true);
        }

        Animated.timing(translateY, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }).start();

        Animated.timing(opacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }).start();
      });
    });
  };

  const handleSkip = () => {
    setSelectedAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: parsedOtherData?.questions_answers[currentIndex]?.question,
        answer: "",
      },
    ]);
    handleNext();
  };

  const handleSubmit = async () => {
    const payload =
      agentName === "Improve productivity"
        ? {
            country,
            age,
            name,
            aim: "I want to improve my productivity",
            other_data: {
              type: parsedOtherData.type,
              questions_answers: selectedAnswers,
            },
          }
        : {
            country,
            age,
            name,
            aim: `I want to improve self-discipline on ${aim}`,
            other_data: {
              questions_answers: selectedAnswers,
            },
          };

    try {
      setLoading(true);
      await createAgentInstance1({
        data: payload,
        agentId: agentId as string,
      });
      toast.success({ title: "created successfully" });
      router.push("/home");
    } catch (error: any) {
      console.error("Error creating agent instance:", error);
      toast.error({ title: error.error });
    }
  };
  return (
    <>
      <SafeAreaView className="flex-1 bg-black">
        {isComplete && (
          <View>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Are you sure?",
                  "Do you not want to create this task?",
                  [
                    {
                      text: "Cancel",
                      onPress: () => null,
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => router.replace("/home"),
                    },
                  ]
                );
              }}
              className="mb-4 mt-[4%] px-4"
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="px-4">
              {!isComplete && (
                <Animated.View
                  style={{
                    transform: [{ translateY }],
                    opacity,
                  }}
                >
                  <Text className="text-secondary mb-5 text-lg tracking-wider font-semibold">
                    {parsedOtherData?.questions_answers[currentIndex]?.question}
                  </Text>

                  {Array.isArray(
                    parsedOtherData?.questions_answers[currentIndex]?.answer
                  ) &&
                    parsedOtherData?.questions_answers[
                      currentIndex
                    ]?.answer.map((ans: string, ansIndex: number) => (
                      <TouchableOpacity
                        key={ansIndex}
                        onPress={() => setSelectedAnswer(ans)}
                        className={`p-4 rounded-lg mb-4 ${
                          selectedAnswer === ans ? "bg-white" : "bg-[#292929]"
                        }`}
                      >
                        <Text
                          className={`text-${
                            selectedAnswer === ans ? "black" : "white"
                          }`}
                        >
                          {ans}
                        </Text>
                      </TouchableOpacity>
                    ))}

                  <TouchableOpacity
                    onPress={() => setSelectedAnswer("Other")}
                    className={`p-4 rounded-lg mb-4 ${
                      selectedAnswer === "Other" ? "bg-white" : "bg-[#292929]"
                    }`}
                  >
                    <Text
                      className={`text-${
                        selectedAnswer === "Other" ? "black" : "white"
                      }`}
                    >
                      Other
                    </Text>
                  </TouchableOpacity>

                  {selectedAnswer === "Other" && (
                    <TextInput
                      placeholder="Enter your custom answer"
                      placeholderTextColor="#777"
                      className="bg-[#292929] text-white p-4 rounded-lg mb-4"
                      value={customAnswer}
                      onChangeText={setCustomAnswer}
                    />
                  )}

                  <View className="flex-row justify-between my-5 gap-6">
                    <TouchableOpacity
                      onPress={handleSkip}
                      className="py-3 px-6 bg-secondary rounded-md w-[45%]"
                    >
                      <Text className="text-black text-lg text-center tracking-wider font-semibold uppercase">
                        Skip
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleNext}
                      disabled={
                        selectedAnswer === null ||
                        (selectedAnswer === "Other" &&
                          customAnswer.trim() === "")
                      }
                      className={`py-3 px-6 rounded-md w-[45%] ${
                        selectedAnswer &&
                        (selectedAnswer !== "Other" ||
                          customAnswer.trim() !== "")
                          ? "bg-primary"
                          : "bg-gray-500"
                      }`}
                    >
                      <Text className="text-white text-lg text-center tracking-wider font-semibold uppercase">
                        Next
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              )}
              {isComplete && (
                <View>
                  <View className="items-center justify-center p-5">
                    <Feather name="user-check" size={64} color="lightgreen" />
                    <Text className="text-white text-2xl font-bold text-center mb-4 mt-4">
                      Great job! You're almost there!
                    </Text>
                    <Text className="text-secondary text-lg text-center mb-6">
                      Submit your responses and complete the task.
                    </Text>
                    <TouchableOpacity
                      onPress={handleSubmit}
                      className="py-4 px-10 bg-primary rounded-lg shadow-lg flex-row items-center justify-center"
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text className="text-white text-center text-xl font-semibold uppercase">
                          Submit Now
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default AgentInstanceOnboard;
