import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAgentInstanceById } from "@/services/utilities/api";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const AgentTasksScreen = () => {
  const { agentTasks: instanceId } = useLocalSearchParams();
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [instanceName, setInstanceName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInstanceDetails = async () => {
      try {
        setLoading(true);
        const response: any = await getAgentInstanceById(instanceId as string);
        const taskDetails = response.data?.agentData?.task_details;

        setInstanceName(response.data?.agentData?.name);
        setTasks(taskDetails);
      } catch (error) {
        console.error("Error fetching instance details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (instanceId) {
      fetchInstanceDetails();
    }
  }, [instanceId]);

  const renderTask = ({ item }: { item: any }) => (
    <View className="flex flex-row items-center justify-center bg-black px-4 py-5 rounded-lg mb-4">
      <View className="flex-1">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/home/agentTasks/taskDetails/[taskDetails]",
              params: {
                taskDetails: item.name,
                instanceId,
              },
            })
          }
        >
          <Text className="text-white text-lg">{item.name}</Text>
        </TouchableOpacity>
      </View>
      {item.feedbackCount > 0 && (
        <TouchableOpacity
          className="  px-4 rounded-lg ml-2"
          onPress={() =>
            router.push({
              pathname: "/home/agentTasks/taskFeedback/[taskFeedback]",
              params: {
                taskFeedback: item.name,
                instanceId,
              },
            })
          }
        >
          <MaterialIcons name="feedback" size={28} color="#CDCDCD" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView className="bg-black flex-1 flex flex-col justify-around  pb-[4%]">
      <View className="flex flex-col gap-8">
        <View className="flex flex-row items-center justify-between px-[4%] ">
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl tracking-wider font-bold uppercase">
            {instanceName}
          </Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="px-[4%]">
          <Text className="text-secondary text-sm uppercase tracking-wider mb-2">
            Goal Progress
          </Text>
          <View className="bg-primary rounded-lg p-4">
            <View className="w-full bg-black h-4 rounded-full overflow-hidden">
              <View className="bg-white h-full" style={{ width: "45%" }}></View>
            </View>
            <Text className="text-white text-sm mt-2">45%</Text>
            <Text className="text-secondary text-xs mt-1 uppercase tracking-wider">
              9 Days to Go
            </Text>
          </View>
        </View>
      </View>
      <View className="flex flex-col gap-8">
        <View className="px-[4%] py-[6%] mx-[4%] bg-primary rounded-lg overflow-scroll">
          {loading ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={(item) => item._id}
              renderItem={renderTask}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          )}

          <TouchableOpacity className="bg-[#2C2C2E] py-3 rounded-lg mt-[30%]">
            <Text className="text-white text-center uppercase text-md tracking-wider">
              Complete All
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AgentTasksScreen;
