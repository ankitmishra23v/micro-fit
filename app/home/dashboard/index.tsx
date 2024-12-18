import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { getAgentInstances } from "@/services/utilities/api";
import { getFormattedUTCDate } from "@/components/constant";
import { useAuth } from "@/auth/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Dashboard = () => {
  const [instances, setInstances] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { id } = useAuth();
  const userId = id as string;
  const router = useRouter();

  useEffect(() => {
    const fetchAgentInstances = async () => {
      try {
        setLoading(true);
        setError(false);

        const dateParam = getFormattedUTCDate(0);

        const response: any = await getAgentInstances({
          userId,
          params: { date: dateParam },
        });

        setInstances(response.data || []);
      } catch (err) {
        console.error("Error fetching agent instances:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentInstances();
  }, []);

  const renderInstanceCard = ({ item }: { item: any }) => {
    return (
      <View className="bg-primary rounded-lg px-[4%] py-[2%] mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-lg font-bold">
            {item.agentData?.name || "Instance"}
          </Text>
          <Text className="text-secondary text-sm ">Everyday</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-4">
            {[...item.intervals]
              .reverse()
              .map((interval: any, index: number) => {
                const endDate = new Date(interval.endDate);
                const day = endDate.getDate();
                const weekDay = endDate.toLocaleDateString("en-US", {
                  weekday: "short",
                });

                return (
                  <View key={index} className="items-center">
                    <Text className="text-secondary text-sm mb-1 text-center">
                      {weekDay}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/home/dashboard/[dashboardDetails]",
                          params: {
                            dashboardDetails: item?._id,
                            date: interval.endDate,
                          },
                        })
                      }
                    >
                      <View className="items-center justify-center bg-[#E6B853] rounded-full w-12 h-12 mb-2">
                        <Text className="text-white text-sm font-bold">
                          {day}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView className="h-full bg-black">
      <View className="px-[4%] flex flex-col gap-8 pb-[4%] max-h-[99%]">
        <TouchableOpacity onPress={() => router.back()} className="max-w-8">
          <Ionicons name="chevron-back-sharp" size={24} color="white" />
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : error ? (
          <Text className="text-red-500 text-lg">Error fetching data</Text>
        ) : instances.length === 0 ? (
          <Text className="text-white text-lg">No instances available</Text>
        ) : (
          <FlatList
            data={instances}
            keyExtractor={(item) => item._id}
            renderItem={renderInstanceCard}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
