import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
  BackHandler,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import profileImage from "@/assets/images/user.png";
import runImage from "@/assets/images/person-running.png";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { useNotification } from "@/notification/notificationContext";
import {
  getAgentInstances,
  deleteAgentInstance,
} from "@/services/utilities/api";
import { toast } from "@/components/ToastManager";

const SkeletonCard = () => (
  <View className="bg-primary flex flex-row px-4 py-3 gap-8 items-center rounded-lg mb-4 animate-pulse">
    <View className="bg-gray-500 h-[9vh] w-[11vh] flex items-center justify-center rounded-xl" />
    <View className="flex-1">
      <View className="bg-gray-500 h-6 w-[70%] rounded-md mb-2" />
      <View className="bg-gray-500 h-4 w-[90%] rounded-md" />
    </View>
  </View>
);

const HomeScreen = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [agentInstances, setAgentInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
  const { id, logout, firstName, lastName } = useAuth();
  const router = useRouter();
  const userId = id as string;
  const screenHeight = Dimensions.get("window").height;

  const { notificationCount } = useNotification();

  useEffect(() => {
    const backAction = () => {
      if (drawerOpen) {
        setDrawerOpen(false);
        return true;
      } else {
        BackHandler.exitApp();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [drawerOpen]);

  useEffect(() => {
    if (!id) return;
    const fetchAgentInstances = async () => {
      try {
        setLoading(true);
        const response: any = await getAgentInstances({
          userId,
          params: {},
        });
        setAgentInstances(response.data || []);
      } catch (error: any) {
        toast.error({ title: error.error });
        setLoading(false);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgentInstances();
  }, [id]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setLoading(false);
      router.push("/screens/welcome");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
      await deleteAgentInstance(agentId);
      setAgentInstances((prev) =>
        prev.filter((item: any) => item._id !== agentId)
      );
      toast.success({ title: "Goal deleted successfully" });
    } catch (error: any) {
      toast.error({ title: error?.data?.message || "Unable to delete " });
    }
  };

  const renderAgentCard = ({ item }: { item: any }) => (
    <View className="bg-primary flex flex-row px-4 py-3 gap-8 items-center rounded-lg mb-4 relative">
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/home/agentTasks/[agentTasks]",
            params: { agentTasks: item._id },
          });
        }}
        className="flex-1 flex-row items-center gap-4"
      >
        <View className="bg-black h-[9vh] w-[11vh] flex items-center justify-center rounded-xl">
          <Image
            source={runImage}
            style={{
              height: "70%",
              width: "70%",
            }}
            resizeMode="contain"
          />
        </View>
        <View className="flex-1">
          <Text className="text-white text-l mb-2 font-bold uppercase">
            {item?.agentData?.name}
          </Text>
          <Text className="text-secondary text-md flex-wrap w-full">
            {item?.agentData?.description}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setDropdownVisible(dropdownVisible === item._id ? null : item._id);
        }}
        className="absolute top-4 right-4"
      >
        <Ionicons name="ellipsis-vertical" size={28} color="white" />
      </TouchableOpacity>
      {dropdownVisible === item._id && (
        <View className="absolute top-12 right-6 bg-red-500 px-4 py-2 rounded-lg shadow-lg">
          <TouchableOpacity
            onPress={() => {
              setDropdownVisible(null);
              Alert.alert(
                "Delete Agent",
                "Are you sure you want to delete this agent?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => handleDeleteAgent(item._id),
                  },
                ]
              );
            }}
          >
            <Text className="text-white">Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback
        onPress={() => {
          setDropdownVisible(null);
          Keyboard.dismiss();
        }}
      >
        {drawerOpen ? (
          <View className="flex h-full bg-black px-4 pt-6">
            <TouchableOpacity
              className="absolute top-6 left-2"
              onPress={() => setDrawerOpen(false)}
            >
              <Ionicons name="chevron-back-sharp" size={24} color="white" />
            </TouchableOpacity>
            <View className="mt-16">
              <View className="flex gap-4 justify-center items-center mb-12">
                <View className="w-24 h-24 border-4 border-primary rounded-full overflow-hidden">
                  <Image
                    source={profileImage}
                    className="w-full h-full p-2"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-white text-xl font-bold uppercase">
                  {firstName} {lastName}
                </Text>
              </View>
              <View className="flex flex-col gap-4">
                <TouchableOpacity
                  className="py-4 border-2 border-primary px-4 rounded-xl"
                  onPress={() => {
                    setDrawerOpen(false);
                    router.push("/home/profile");
                  }}
                >
                  <Text className="text-white text-lg">Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="py-4 border-2 border-primary px-4 rounded-xl"
                  onPress={() => {
                    // setDrawerOpen(false);
                    router.push("/home/dashboard");
                  }}
                >
                  <Text className="text-white text-lg">Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="py-4 border-2 border-primary px-4 rounded-xl"
                  onPress={() => {
                    // setDrawerOpen(false);
                    router.push("/home/logs");
                  }}
                >
                  <Text className="text-white text-lg">Agent messages</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="py-4 border-2 border-primary px-4 rounded-xl"
                  onPress={handleLogout}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-white text-lg">Logout</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View className="flex flex-col justify-between h-full bg-black px-4 pt-6">
            <View>
              <View className="flex-row justify-between items-center">
                <Text className="text-white text-2xl font-bold">
                  Welcome, {firstName}
                </Text>
                <View className="flex flex-row justify-between gap-2">
                  <TouchableOpacity
                    onPress={() => router.push("/home/notifications")}
                  >
                    <Ionicons
                      name="notifications-circle-outline"
                      size={40}
                      color="#CDCDCD"
                    />
                    {notificationCount > 0 && (
                      <View
                        style={{
                          position: "absolute",
                          top: -5,
                          right: -5,
                          backgroundColor: "red",
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          {notificationCount}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setDrawerOpen(true)}>
                    <View className="w-12 h-12 border-4 border-primary rounded-full overflow-hidden">
                      <Image
                        source={profileImage}
                        className="w-full h-full p-1"
                        resizeMode="contain"
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="mt-12 ">
                <Text className="text-secondary text-sm uppercase mb-2 tracking-wider">
                  Overall Progress
                </Text>
                <View className="bg-primary p-4 rounded-lg mt-2">
                  <Text className="text-white text-base">
                    Add a goal to track the progress
                  </Text>
                  <View className="w-full bg-black h-4 mt-3 rounded-2xl overflow-hidden">
                    <View
                      className="bg-orange-600  h-full"
                      style={{ width: "40%" }}
                    />
                  </View>
                  <Text className="text-gray-400 mt-1 text-sm">40%</Text>
                </View>
              </View>
            </View>

            <View className="mt-8">
              <Text className="text-secondary mb-[4%] text-sm uppercase tracking-wider">
                Your Goals
              </Text>
              {loading ? (
                <FlatList
                  data={Array(1).fill(null)}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={() => <SkeletonCard />}
                  contentContainerStyle={{
                    gap: 8,
                    paddingBottom: 16,
                  }}
                  showsVerticalScrollIndicator={true}
                  style={{
                    maxHeight: screenHeight * 0.4,
                  }}
                />
              ) : agentInstances.length > 0 ? (
                <FlatList
                  data={agentInstances}
                  keyExtractor={(item) => item._id}
                  renderItem={renderAgentCard}
                  contentContainerStyle={{
                    gap: 8,
                    paddingBottom: 16,
                  }}
                  showsVerticalScrollIndicator={true}
                  style={{
                    maxHeight: screenHeight * 0.4,
                  }}
                />
              ) : (
                <View className="mt-4">
                  <Text className="text-secondary italic text-center text-2xl">
                    <Text className="text-primary text-3xl ">❝</Text> The secret
                    of getting ahead is getting started.
                    <Text className="text-primary text-3xl">❞</Text>
                  </Text>
                  <Text className="text-gray-400 text-center mt-2">
                    Mark Twain
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              className="bg-primary py-3 rounded-md mt-[16%] mb-[10%]"
              onPress={() => router.push("/screens/onboarding")}
            >
              <Text className="text-white text-center text-lg uppercase">
                {agentInstances.length > 0
                  ? "Add a goal"
                  : loading
                  ? ""
                  : "Add your first goal"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default HomeScreen;
