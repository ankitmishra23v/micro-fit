import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  FlatList,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { getAgentInstanceById } from "@/services/utilities/api";

const DashboardDetails = () => {
  const router = useRouter();
  const { dashboardDetails, date } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [taskDetails, setTaskDetails] = useState<any[]>([]);

  useEffect(() => {
    const fetchAgentInstanceDetails = async () => {
      try {
        setLoading(true);
        setError(false);

        const formattedDate = new Date(date as string);
        const isoString = formattedDate.toISOString();
        const formattedDateWithoutMilliseconds = isoString.replace(
          /\.\d{3}Z$/,
          "Z"
        );

        const response: any = await getAgentInstanceById({
          instanceId: dashboardDetails as string,
          params: { date: formattedDateWithoutMilliseconds },
        });

        if (response?.data && response.data.length > 0) {
          const firstElement = response.data[0];
          const agentData = firstElement.agentData;
          if (agentData && agentData.taskDetails) {
            setTaskDetails(agentData.taskDetails);
          }
        }
      } catch (err) {
        console.error("Error fetching instance details: ", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentInstanceDetails();
  }, [dashboardDetails, date]);

  const renderTaskItem = ({ item }: { item: any }) => {
    return (
      <View className="bg-primary mx-[2%] mb-4 rounded-lg">
        <View className="px-4 py-4">
          <Text className="text-white font-bold">Task Name: {item.name}</Text>
          <Text className="text-white">
            Feedback Count: {item.feedbackCount}
          </Text>
          <Text className="text-white">
            Your feedbacks: {item.feedbackByUserTask}
          </Text>
          <Text className="text-white">
            Feedback by agent: {item.feedbackByScalaixCallback}
          </Text>
          <Text className="text-white">
            Submitted Feedbacks: {item.isSubmittedFeedbackCount}
          </Text>
          <Text className="text-white">
            Not Submitted Feedbacks: {item.notSubmittedFeedbackCount}
          </Text>
          <Text className="text-white">
            Is Submitted & agent feedback: {item.isSubmittedAndScalaixCallback}
          </Text>
          <Text className="text-white">
            Your Submitted Feedbacks: {item.isSubmittedAndUserFeedback}
          </Text>
          <Text className="text-white">
            Not Submitted & agent feedbacks:{" "}
            {item.isNotSubmittedAndScalaixCallback}
          </Text>
          <Text className="text-white">
            Is Not Submitted & User Feedback:{" "}
            {item.isNotSubmittedAndUserFeedback}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="h-full bg-black px-[4%] pt-[4%]">
      <TouchableOpacity
        onPress={() => router.back()}
        className="max-w-8 mb-12 pl-1"
      >
        <Ionicons name="chevron-back-sharp" size={24} color="white" />
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#FFFFFF" />
      ) : error ? (
        <Text className="text-red-500 text-lg">Error fetching data</Text>
      ) : (
        <FlatList
          data={taskDetails}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item._id}
        />
      )}
    </SafeAreaView>
  );
};

export default DashboardDetails;
