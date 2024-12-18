import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { toast } from "@/components/ToastManager";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  getDataByTask,
  sendFeedback,
  completeTask,
} from "@/services/utilities/api";
import { useAuth } from "@/auth/useAuth";

const TaskDetails = () => {
  const { taskDetails, instanceId, taskId, subdataFirstId, action } =
    useLocalSearchParams();
  const router = useRouter();
  const { id } = useAuth();
  const taskName = taskDetails as string;
  const instance = instanceId as string;

  const [taskData, setTaskData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userInput, setUserInput] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCompleteLoading, setIsCompleteLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        setLoading(true);
        const response: any = await getDataByTask(instance, taskName);
        if (response?.data && response.data.length > 0) {
          setTaskData(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching task data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (instance && taskName) {
      fetchTaskData();
    }
  }, [instance, taskName]);

  const handleUserInputSubmit = async () => {
    if (userInput.trim() === "") {
      Alert.alert("Input Required", "Please feed in your issue.");
      return;
    }
    setIsLoading(true);
    try {
      const userId: any = id;
      const feedbackData = {
        instanceId: instanceId,
        feedbackId: "",
        taskKey: taskName,
        agentKey: "better-sleep",
        isSubmitted: true,
        questionAnswer: [
          {
            question: "What difficulty you are facing in this task?",
            answer: userInput,
          },
        ],
        feedbackBy: "USER_TASK",
      };

      const response: any = await sendFeedback({
        data: feedbackData,
        user_id: userId,
      });

      toast.success({
        title:
          "Thank you for your feedback. Our AI will generate a new version of this task tailored to your needs shortly.",
      });

      setUserInput("");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error({
        title: "Failed to submit your feedback. Please try again later.",
      });
      setIsModalVisible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTask = () => {
    Alert.alert(
      "Confirmation",
      "Do you want to mark this task as completed?",
      [
        {
          text: "No",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              setIsCompleteLoading(true);
              const payload = {
                taskId: taskId,
                taskDataID: subdataFirstId,
                message: "",
              };
              const response: any = await completeTask({
                data: payload,
                instace_id: instance,
              });
              toast.success({
                title: response?.data?.message,
              });
              router.back();
            } catch (error: any) {
              toast.error({
                title: error?.data?.message,
              });
            } finally {
              setIsCompleteLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-black flex-1 relative">
      <View className="absolute top-0 z-50 w-full"></View>
      <View className="flex-row justify-between items-center px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-secondary text-center tracking-wider text-xl uppercase font-semibold">
          {taskName}
        </Text>
        <TouchableOpacity>
          <FontAwesome6 name="clock" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View className="px-4 flex-1">
        <View className="flex-1 mb-6 py-4">
          {taskData ? (
            <View className="bg-primary p-4 rounded-lg">
              <Text className="text-white text-base">
                {taskData.jsonData?.text ||
                  taskData.jsonData?.task ||
                  "No text available"}
              </Text>
            </View>
          ) : (
            <Text className="text-white text-base">No data available</Text>
          )}
        </View>
        <TouchableOpacity
          className={`${
            action === "true" ? "bg-gray-800" : "bg-primary"
          } py-4 rounded-lg mb-4 ${taskData ? "block" : "hidden"}`}
          onPress={handleCompleteTask}
          disabled={isCompleteLoading || action === "true"}
        >
          {isCompleteLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : action === "true" ? (
            <Text className="text-secondary text-center tracking-wider font-bold uppercase">
              Completed
            </Text>
          ) : (
            <Text className="text-secondary text-center tracking-wider font-bold uppercase">
              Complete
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-primary py-4 rounded-lg mb-16"
          onPress={() => setIsModalVisible(true)}
        >
          <Text className="text-secondary text-center tracking-wider font-bold uppercase">
            Do you have something to say?
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-primary opacity-95">
          <View className="bg-primary w-11/12 rounded-lg p-6 relative">
            <Text className="text-white text-lg font-semibold mb-4 text-center">
              What’s the issue?
            </Text>
            <TextInput
              className="h-32 border border-gray-600 rounded-lg p-4 text-white bg-black"
              placeholder="Enter your input here"
              placeholderTextColor="#aaa"
              value={userInput}
              onChangeText={setUserInput}
              multiline={true}
              textAlignVertical="top"
            />
            <View className="flex-row justify-between mt-6">
              <TouchableOpacity
                className={`bg-gray-500 py-3 rounded-lg flex-1 mr-2 ${
                  isLoading ? "opacity-50" : ""
                }`}
                onPress={() => setIsModalVisible(false)}
                disabled={isLoading}
              >
                <Text className="text-white text-center font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`bg-blue-500 py-3 rounded-lg flex-1 ml-2 ${
                  isLoading ? "opacity-50" : ""
                }`}
                onPress={handleUserInputSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white text-center font-bold">
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TaskDetails;
