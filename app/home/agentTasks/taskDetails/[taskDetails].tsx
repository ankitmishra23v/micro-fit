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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
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
  const {
    taskDetails,
    name,
    instanceId,
    taskId,
    subdataFirstId,
    action,
    date,
    agentName,
  } = useLocalSearchParams();
  const router = useRouter();
  const { id } = useAuth();
  const taskName = taskDetails as string;
  const instance = instanceId as string;
  const selectedDate = date as string;

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
        const params = selectedDate ? { date: selectedDate } : {};
        const response: any = await getDataByTask({
          instanceId: instance,
          task: taskName,
          params,
        });
        if (response?.data && response.data.length > 0) {
          setTaskData(response.data);
        } else {
          setTaskData([]);
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
  }, [instance, taskName, selectedDate]);

  const handleUserInputSubmit = async () => {
    if (userInput.trim() === "") {
      Alert.alert("Input Required", "Please feed in your issue.");
      return;
    }

    setIsLoading(true);

    try {
      if (taskName === "better-sleep") {
        // Logic for "better-sleep"
        const userId: any = id;
        const feedbackData = {
          instanceId: instanceId,
          feedbackId: "",
          taskKey: taskName,
          agentKey: taskName,
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
      } else {
        const currentTime = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        const payload = {
          taskId: taskId,
          taskDataID: subdataFirstId,
          message: userInput,
          current_time: currentTime,
        };

        const response: any = await completeTask({
          data: payload,
          instace_id: instance,
        });

        toast.success({
          title: response?.data?.message || "Task marked as completed!",
        });

        setUserInput("");
        setIsModalVisible(false);
        router.back();
      }
    } catch (error: any) {
      toast.error({
        title:
          error?.data?.message ||
          "Failed to submit your feedback. Please try again later.",
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
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              setIsCompleteLoading(true);

              const currentTime = new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
              const payload = {
                taskId: taskId,
                taskDataID: subdataFirstId,
                message: "completed",
                current_time:
                  agentName !== "better-sleep" ? currentTime : undefined,
              };

              const response: any = await completeTask({
                data: payload,
                instace_id: instance,
              });

              toast.success({
                title: response?.data?.message || "Task marked as completed!",
              });
              router.back();
            } catch (error: any) {
              toast.error({
                title:
                  error?.data?.message ||
                  "Failed to mark the task as completed. Please try again later.",
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

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-black flex-1">
      <View className="flex-row justify-between items-center px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-secondary text-center tracking-wider text-xl uppercase font-semibold">
          {name}
        </Text>
        <TouchableOpacity>
          <FontAwesome6 name="clock" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView
        className="px-4 flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {taskData && taskData.length > 0 ? (
          taskData.map((task: any, index: number) => (
            <View key={index} className="bg-primary p-4 rounded-lg mb-4">
              <View className="absolute top-0 right-0 px-2 py-1 rounded-lg">
                <Text className="text-white text-xs">
                  {formatDate(task?.createdAt)}
                </Text>
              </View>
              <Text className="text-white text-base mt-4">
                {task.jsonData[0]?.text ||
                  task.jsonData?.text ||
                  task.jsonData?.task ||
                  "No text available"}
              </Text>
            </View>
          ))
        ) : (
          <Text className="text-white text-base">No data available</Text>
        )}
      </ScrollView>
      <View className="px-4 pb-4">
        <TouchableOpacity
          className={`${
            action === "true" ? "bg-gray-800" : "bg-secondary"
          } py-4 rounded-lg mb-4`}
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
            <Text className="text-black text-center tracking-wider font-bold uppercase">
              Complete
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className={` py-4 rounded-lg ${
            agentName !== "better-sleep" && action === "true"
              ? "bg-gray-800"
              : "bg-primary"
          }`}
          onPress={() => setIsModalVisible(true)}
          disabled={agentName !== "better-sleep" && action === "true"}
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View className="flex-1 justify-center items-center bg-primary opacity-95">
              <View className="bg-primary w-11/12 rounded-lg p-6">
                <Text className="text-white text-m font-semibold mb-4 text-center">
                  Got any concerns or feedback about your task?
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
                    className="bg-gray-500 py-3 rounded-lg flex-1 mr-2"
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text className="text-white text-center font-bold">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-blue-500 py-3 rounded-lg flex-1 ml-2"
                    onPress={handleUserInputSubmit}
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
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default TaskDetails;
