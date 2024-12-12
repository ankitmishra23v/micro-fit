import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getScalFeedback, submitScalFeedback } from "@/services/utilities/api";
import { toast } from "@/components/ToastManager";

const TaskFeedback = () => {
  const { taskFeedback, instanceId } = useLocalSearchParams();
  const router = useRouter();
  const taskName = taskFeedback as string;
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
        title: "Yay ! Your feedback has been submitted successfully",
      });
      console.log("Feedback submitted successfully!", response.data);
      router.back();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = ({ item }: { item: any }) => (
    <View className="bg-primary p-4 rounded-lg mb-4">
      <Text className="text-white text-lg mb-2">{item.question}</Text>
      <TextInput
        className="bg-black text-white p-2 rounded-lg"
        placeholder="Type your answer here"
        placeholderTextColor="#888"
        value={answers[item.id] || ""}
        onChangeText={(text) => handleAnswerChange(item.id, text)}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="bg-black flex-1 px-4 pt-[2%]">
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-secondary text-xl font-bold mb-4 mt-8">
          Please give your valuable feedback for task{" "}
          <Text className="text-orange-500 uppercase tracking-wider text-center">
            {taskName}
          </Text>
        </Text>
        <View style={{ flex: 1, marginBottom: 24 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : questions.length > 0 ? (
            <>
              <FlatList
                data={questions}
                keyExtractor={(item) => item.id}
                renderItem={renderQuestion}
                contentContainerStyle={{ paddingBottom: 16 }}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
              />
              <TouchableOpacity
                className={`py-3 px-4 rounded-lg mt-4 ${
                  submitting ? "bg-gray-500" : "bg-blue-500 "
                }`}
                onPress={handleSubmitAnswers}
                disabled={submitting}
              >
                <Text className="text-white text-center font-bold  tracking-wider uppercase">
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text className="text-white text-md">No questions available.</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TaskFeedback;
