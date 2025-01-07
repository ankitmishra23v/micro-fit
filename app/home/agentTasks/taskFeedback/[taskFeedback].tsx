import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getScalFeedback, submitScalFeedback } from "@/services/utilities/api";
import { toast } from "@/components/ToastManager";

const TaskFeedback = () => {
  const { taskFeedback, name, instanceId } = useLocalSearchParams();
  const router = useRouter();
  const taskName = taskFeedback as string;
  const nameOfTask = name as string;
  const instance = instanceId as string;

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const response: any = await getScalFeedback({
          instance_id: instance,
          taskKey: taskName,
          params: {
            isSubmitted: false,
            feedbackBy: "SCALAIX_CALLBACK",
            limit: 1,
          },
        });

        const feedbackData = response.data[0];
        console.log("FEEEDDDBACKKK : ", feedbackData);
        setFeedbackId(feedbackData._id);
        const allQuestions = feedbackData.questionAnswer.map((qa: any) => ({
          id: qa._id,
          question: qa.question,
        }));

        setQuestions(allQuestions);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [instance, taskName]);

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [id]: value }));
  };

  const handleSubmitAnswers = async () => {
    if (!feedbackId) {
      console.error("Feedback ID not available");
      return;
    }

    try {
      setSubmitting(true);

      const formattedData = questions.map((q) => ({
        question: q.question,
        answer: answers[q.id] || "",
      }));

      const payload = {
        questionAnswer: formattedData,
        isSubmitted: true,
      };

      const response: any = await submitScalFeedback({
        feedback_id: feedbackId,
        data: payload,
      });

      toast.success({
        title: "Yay! Your feedback has been submitted successfully",
      });

      router.back();
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast.error({ title: error.error });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: "black" }}>
            {/* Back button and heading */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginTop: 16, padding: 8 }}
            >
              <Ionicons name="chevron-back" size={28} color="white" />
            </TouchableOpacity>
            <Text className="text-secondary text-xl font-bold mt-8 px-4">
              Please give your valuable feedback for task{" "}
              <Text className="text-orange-500 uppercase tracking-wider text-center">
                {nameOfTask}
              </Text>
            </Text>

            {/* Scrollable questions */}
            <ScrollView
              contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            >
              {loading ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
              ) : questions.length > 0 ? (
                questions.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      backgroundColor: "#1c1c1c",
                      padding: 16,
                      borderRadius: 8,
                      marginBottom: 16,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        marginBottom: 8,
                      }}
                    >
                      {item.question}
                    </Text>
                    <TextInput
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        padding: 8,
                        borderRadius: 8,
                        height: 40,
                      }}
                      placeholder="Type your answer here"
                      placeholderTextColor="#888"
                      value={answers[item.id] || ""}
                      onChangeText={(text) => handleAnswerChange(item.id, text)}
                    />
                  </View>
                ))
              ) : (
                <Text style={{ color: "white", fontSize: 16 }}>
                  No questions available.
                </Text>
              )}
            </ScrollView>
            {questions.length > 0 && (
              <View
                style={{
                  position: "absolute",
                  bottom: 12,
                  width: "100%",
                  backgroundColor: "black",
                  padding: 16,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: submitting ? "#555" : "#007bff",
                    paddingVertical: 12,
                    borderRadius: 8,
                  }}
                  onPress={handleSubmitAnswers}
                  disabled={submitting}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit Feedback"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TaskFeedback;
