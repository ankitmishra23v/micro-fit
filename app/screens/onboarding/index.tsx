import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import betterSleepImage from "@/assets/images/MoonStars.png";
import { getAllAgents } from "@/services/utilities/api";
import { toast } from "@/components/ToastManager";

const SkeletonCard = () => (
  <View className="bg-primary rounded-xl m-2 w-[45%] h-[180px] p-4 justify-between animate-pulse">
    <View className="bg-gray-500 h-6 w-3/4 rounded-md" />
    <View className="bg-gray-500 h-[50%] rounded-md mt-4" />
  </View>
);

const OnboardingScreen = () => {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const router = useRouter();

  const fetchOptions = async (currentPage: number, isInitialFetch: boolean) => {
    if (!hasMore && !isInitialFetch) return;
    if (isInitialFetch) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const response: any = await getAllAgents({
        params: { page: currentPage, limit: 10, active: true },
      });
      const { data, pagination } = response;
      setOptions((prevOptions) =>
        isInitialFetch ? data : [...prevOptions, ...data]
      );
      if (pagination.page >= pagination.pages) {
        setHasMore(false);
      }
    } catch (error) {
      setError(true);
      toast.error({ title: "Failed to fetch agents" });
      setLoading(false);
    } finally {
      if (isInitialFetch) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    fetchOptions(1, true);
  }, []);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchOptions(nextPage, false);
  };

  const handleAgentPress = (
    agentId: string,
    agentName: string,
    agentContextName: string
  ) => {
    if (agentName === "Better sleep" || agentContextName === "better-sleep") {
      router.push({
        pathname: "/screens/onboarding/[agentInstance]",
        params: { agentInstance: agentId },
      });
    } else if (agentName === "Neo Beta v1" || agentContextName === "neo-beta") {
      router.push({
        pathname: "/screens/onboarding/agentInstance1/[agentInstanceNeoBeta]",
        params: { agentInstanceNeoBeta: agentId, agentName },
      });
    } else {
      router.push({
        pathname: "/screens/onboarding/agentInstance2/[agentInstance2]",
        params: { agentInstance2: agentId, agentName, agentContextName },
      });
    }
  };

  const renderOption = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="bg-primary rounded-xl flex justify-center px-2 m-2 overflow-hidden"
      style={{ width: "45%", aspectRatio: 0.85 }}
      onPress={() =>
        handleAgentPress(item._id, item.name, item.agentContextName)
      }
    >
      <View className="h-[45%]">
        <Text className="text-[1.3rem] pl-2 font-bold text-white mt-2 uppercase">
          {item.name}
        </Text>
      </View>
      <View className="relative h-[20%] flex-1 justify-center items-center mb-4 mt-2">
        <Image
          source={betterSleepImage}
          className="object-cover absolute right-0"
        />
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <ActivityIndicator
          size="small"
          color="#FFFFFF"
          style={{ margin: 16 }}
        />
      );
    }
    if (hasMore && !loading && !error) {
      return (
        <TouchableOpacity
          className="bg-secondary rounded-lg py-2 px-4 mx-auto mb-4 mt-4 w-[40%]"
          onPress={handleLoadMore}
        >
          <Text className="text-black font-bold text-center">Load More</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-black ">
      <TouchableOpacity
        className="pt-[5%] px-[4%] "
        onPress={() => router.push("/home")}
      >
        <Ionicons name="chevron-back-sharp" size={24} color="white" />
      </TouchableOpacity>
      <Text className="text-[3vh] text-secondary font-bold px-[4%]  mt-6 mb-[8%]">
        What do you want to improve?
      </Text>
      {loading ? (
        <FlatList
          data={Array(4).fill(null)}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          renderItem={() => <SkeletonCard />}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 8,
            paddingBottom: 8,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
        />
      ) : (
        <FlatList
          data={options}
          keyExtractor={(item) => item._id.toString()}
          numColumns={2}
          renderItem={renderOption}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 8,
            paddingBottom: 8,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          ListFooterComponent={renderFooter}
        />
      )}
    </SafeAreaView>
  );
};

export default OnboardingScreen;
