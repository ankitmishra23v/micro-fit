import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  getOnboardingQuestions,
  submitOnboardingQuestions,
} from "@/services/utilities/api";
import { toast } from "@/components/ToastManager";
import { useAuth } from "@/auth/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const OnboardingQuestions = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1); // Track the current page
  const [totalPages, setTotalPages] = useState<number>(1); // Track the total pages
  const [hasMorePages, setHasMorePages] = useState<boolean>(true); // Whether more pages exist
  const [currentPageId, setCurrentPageId] = useState<string | null>(null); // Track the _id of the current page
  const { id: userId } = useAuth();
  const router = useRouter();

  // Fetch questions for a specific page
  const fetchQuestions = async (page: number) => {
    try {
      setLoading(true);
      const response: any = await getOnboardingQuestions({
        user_id: userId as string,
        params: { limit: 1, page }, // Get questions for the current page
      });

      setTotalPages(response.pagination.totalPages);

      const unsubmittedData = response.data.find(
        (item: any) => item.isSubmitted === false
      );

      if (unsubmittedData) {
        setQuestions(unsubmittedData.questionAnswer);
        setCurrentPageId(unsubmittedData._id);
        setHasMorePages(true);
      } else {
        setHasMorePages(false);
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error fetching onboarding questions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if the previous page is already submitted when the component mounts
  useEffect(() => {
    const checkPageSubmission = async () => {
      try {
        setLoading(true); // Ensure loading state is true before making the request
        const response: any = await getOnboardingQuestions({
          user_id: userId as string,
          params: { limit: 1, page: 1 }, // Fetch questions for page 1
        });

        // Check if page 1 is submitted or not
        const page1Submitted = response.data.every(
          (item: any) => item.isSubmitted
        );

        if (page1Submitted) {
          // If page 1 is submitted, move to page 2
          setCurrentPage(2);
          fetchQuestions(2); // Fetch page 2
        } else {
          // If page 1 is not submitted, fetch questions for page 1
          setQuestions(response.data[0]?.questionAnswer || []);
          setCurrentPageId(response.data[0]?._id || null);
          setHasMorePages(true); // There are more pages to load
        }
      } catch (error) {
        console.error("Error checking page submission:", error);
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    // Start the page 1 check when the component mounts
    checkPageSubmission();
  }, [userId]);

  // Handle answer change for each question
  const handleAnswerChange = (id: string, value: string) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [id]: value }));
  };

  // Handle the submission of answers
  const handleSubmitAnswers = async () => {
    if (!questions || questions.length === 0 || !currentPageId) {
      toast.error({
        title: "No questions to submit.",
      });
      return;
    }

    try {
      setSubmitting(true);

      const formattedAnswers = questions.map((q) => ({
        question: q.question,
        answer: answers[q._id] || "", // Submit answer by question _id
      }));

      // Submit the answers for the entire page using the _id of the page (currentPageId)
      await submitOnboardingQuestions({
        id: currentPageId, // Use the _id from the page
        data: {
          questionAnswer: formattedAnswers,
          isSubmitted: true,
        },
      });

      toast.success({
        title: "Yay! Your responses have been submitted successfully.",
      });

      // Clear answers and move to the next page if available
      setAnswers({});
      if (currentPage < totalPages) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage); // Move to the next page
        fetchQuestions(nextPage); // Fetch the next page
      } else {
        setHasMorePages(false); // No more pages to load
      }
    } catch (error) {
      console.error("Error submitting onboarding answers:", error);
      toast.error({
        title: "Failed to submit your answers. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  if (questions.length === 0 && !hasMorePages) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-black">
        <View className="absolute top-2 px-4 left-0">
          <TouchableOpacity
            onPress={() => router.replace("/home")}
            style={{ marginTop: 16 }}
          >
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-white text-lg">
          Alright! All answers submitted
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <TouchableOpacity
        onPress={() => router.replace("/home")}
        style={{ marginTop: 16, padding: 8 }}
      >
        <Ionicons name="chevron-back" size={28} color="white" />
      </TouchableOpacity>
      <ScrollView className="p-4 mt-6">
        {questions.map((question) => (
          <View key={question._id} className="mb-4 p-4 bg-primary rounded-lg">
            <Text className="text-white text-base mb-2">
              {question.question}
            </Text>
            <TextInput
              className="bg-black text-white p-2 rounded-lg h-10"
              placeholder="Type your answer here"
              placeholderTextColor="#888"
              value={answers[question._id] || ""}
              onChangeText={(text) => handleAnswerChange(question._id, text)}
            />
          </View>
        ))}

        <TouchableOpacity
          className={`py-3 rounded-lg mt-4 ${
            submitting ? "bg-gray-600" : "bg-blue-600"
          }`}
          onPress={handleSubmitAnswers}
          disabled={submitting}
        >
          <Text className="text-white text-center font-bold uppercase">
            {submitting ? "Submitting..." : "Submit Answers"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OnboardingQuestions;
