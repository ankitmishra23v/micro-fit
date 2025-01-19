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
import Checkbox from "expo-checkbox";
import { getFormattedUTCDate } from "@/components/constant";
import { toast } from "@/components/ToastManager";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const AgentTasksScreen = () => {
  const { agentTasks: instanceId } = useLocalSearchParams();
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [agentName, setAgentName] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<"today" | "yesterday">(
    "today"
  );
  const [instanceName, setInstanceName] = useState<string>("");
  const [checkedTasks, setCheckedTasks] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const loadSelectedTab = async () => {
      const savedTab = await AsyncStorage.getItem("selectedTab");
      if (savedTab) {
        setSelectedTab(savedTab === "yesterday" ? "yesterday" : "today");
      }
    };

    loadSelectedTab();
  }, []);

  useEffect(() => {
    const fetchInstanceDetails = async () => {
      try {
        setLoading(true);
        setError(false);

        const dateParam =
          selectedTab === "today"
            ? getFormattedUTCDate(0)
            : getFormattedUTCDate(-1);

        const response: any = await getAgentInstanceById({
          instanceId: instanceId as string,
          params: { date: dateParam },
        });

        const Name = response.data
          ?.flatMap((item: any) => item.agentData?.agentContextName)
          .join(", ");

        setAgentName(Name);

        const taskDetails = response.data?.flatMap(
          (item: any) => item.agentData?.taskDetails || []
        );

        const filteredTasks = taskDetails.filter(
          (task: any) => task.subdata?.length > 0
        );

        const initialCheckedState: { [key: string]: boolean } = {};
        filteredTasks.forEach((task: any) => {
          const firstSubdata = task.subdata?.[0];
          initialCheckedState[task._id] = firstSubdata?.action || false;
        });

        setCheckedTasks(initialCheckedState);
        setInstanceName(response?.data[0]?.agentData?.name);
        setTasks(filteredTasks || []);
      } catch (error: any) {
        toast.error({ title: error.error });
        console.error("Error fetching instance details:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInstanceDetails();
  }, [instanceId, selectedTab]);

  const toggleCheckbox = (taskId: string) => {
    setCheckedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleTabChange = async (tab: "today" | "yesterday") => {
    setSelectedTab(tab);
    await AsyncStorage.setItem("selectedTab", tab); // Save the selected tab to AsyncStorage
  };

  const renderSkeleton = () => {
    return (
      <View className="flex-1">
        {[...Array(3)].map((_, index) => (
          <View key={index} className="bg-black px-4 py-5 rounded-lg mb-4 ">
            <View className="flex-row items-center justify-between animate-pulse">
              <View className="w-6 h-6 bg-primary rounded-full animate-pulse"></View>

              <View className="flex-1 ml-4">
                <View className="h-5 bg-primary rounded mb-2 animate-pulse"></View>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderTask = ({ item }: { item: any }) => {
    const isChecked = checkedTasks[item._id] || false;

    return (
      <View className="bg-black px-4 py-5 rounded-lg mb-4">
        <View className="flex-row items-center justify-between">
          <Checkbox
            value={isChecked}
            onValueChange={() => {}}
            color={isChecked ? "orange" : "#FFFFFF"}
          />
          <TouchableOpacity
            className="flex-1 ml-4"
            onPress={() => {
              const hasSubdata =
                Array.isArray(item.subdata) && item.subdata.length > 0;

              const taskId = item._id;
              const subdataFirstId = hasSubdata ? item.subdata[0]._id : null;

              const action = hasSubdata
                ? item.subdata[0]?.action === true
                  ? "true"
                  : item.subdata[0]?.action === false
                  ? "false"
                  : null
                : null;

              const dateParam =
                selectedTab === "today"
                  ? getFormattedUTCDate(0)
                  : getFormattedUTCDate(-1);

              router.push({
                pathname: "/home/agentTasks/taskDetails/[taskDetails]",
                params: {
                  taskDetails: item.taskContextName,
                  name: item.name,
                  instanceId,
                  taskId,
                  subdataFirstId,
                  action,
                  date: dateParam,
                  agentName,
                },
              });
            }}
          >
            <Text className="text-white text-lg">{item.name}</Text>
          </TouchableOpacity>

          {item.feedbackCount > 0 && (
            <TouchableOpacity
              className="px-4 rounded-lg"
              onPress={() =>
                router.push({
                  pathname: "/home/agentTasks/taskFeedback/[taskFeedback]",
                  params: {
                    taskFeedback: item.taskContextName,
                    name: item.name,
                    instanceId,
                  },
                })
              }
            >
              <MaterialIcons name="feedback" size={28} color="#CDCDCD" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="bg-black flex flex-col justify-start gap-8 h-full pb-[4%]">
      <View className="flex flex-row items-center justify-between px-[4%] pt-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl tracking-wider font-bold uppercase">
          {instanceName}
        </Text>
        <Ionicons name="ellipsis-vertical" size={24} color="white" />
      </View>
      <View className="px-[4%] pt-4 ">
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

      <View className="mx-[4%] flex-row justify-between mt-[2%] bg-[#101010] rounded-lg px-3 py-1.5">
        <TouchableOpacity
          className={`w-1/2 py-2 items-center rounded-xl ${
            selectedTab === "yesterday" ? "bg-primary" : "bg-transparent"
          }`}
          onPress={() => handleTabChange("yesterday")}
        >
          <Text
            className={`uppercase text-sm tracking-wider ${
              selectedTab === "yesterday"
                ? "text-white font-bold"
                : "text-secondary"
            }`}
          >
            Yesterday
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-1/2 py-2 items-center rounded-xl ${
            selectedTab === "today" ? "bg-primary" : "bg-transparent"
          }`}
          onPress={() => handleTabChange("today")}
        >
          <Text
            className={`uppercase text-sm tracking-wider ${
              selectedTab === "today"
                ? "text-white font-bold"
                : "text-secondary"
            }`}
          >
            Today
          </Text>
        </TouchableOpacity>
      </View>

      <View
        className={`px-[4%] py-[6%] mx-[4%] mt-[5%] h-1/2 bg-primary rounded-lg flex flex-col gap-4 `}
      >
        {loading ? (
          renderSkeleton()
        ) : // <ActivityIndicator size="large" color="#FFFFFF" />
        error || tasks.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-lg">No tasks available</Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item._id}
            renderItem={renderTask}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AgentTasksScreen;
