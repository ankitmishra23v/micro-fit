import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { getDataByTask } from "@/services/utilities/api";

const TaskDetails = () => {
  const { taskDetails, instanceId } = useLocalSearchParams();

  const router = useRouter();
  const taskName = taskDetails as string;
  const instance = instanceId as string;

  const [taskData, setTaskData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        setLoading(true);
        const response: any = await getDataByTask(instance, taskName);
        if (response?.data) {
          setTaskData(response.data);
        } else {
          console.error("Invalid response format:", response);
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

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-black flex-1">
      {/* Header */}
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
        <View className=" mb-6 py-4 flex">
          {taskData.length > 0 ? (
            <FlatList
              data={taskData}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View className=" bg-primary p-4 rounded-lg mb-4">
                  <Text className="text-white text-base">
                    {item.jsonData?.text || "No text available"}
                  </Text>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text className="text-white text-base">No data available</Text>
          )}
        </View>
        <TouchableOpacity className="bg-primary py-4 rounded-lg mt-4">
          <Text className="text-secondary text-center tracking-wider font-bold uppercase">
            Complete
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TaskDetails;
