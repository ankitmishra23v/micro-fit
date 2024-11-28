import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Dimensions,
  BackHandler,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import profileImage from "@/assets/images/user.png";
import runImage from "@/assets/images/person-running.png";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAgentInstances } from "@/services/utilities/api";

const HomeScreen = () => {
  const [userName, setUserName] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [agentInstances, setAgentInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id, logout } = useAuth();
  const router = useRouter();
  const screenHeight = Dimensions.get("window").height;

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
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("__user_data");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUserName(userData.firstName || "User");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchAgentInstances = async () => {
      try {
        setLoading(true);
        const response: any = await getAgentInstances(id as string);
        setAgentInstances(response.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgentInstances();
  }, [id]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/screens/welcome");
    } catch (error) {
      console.error(error);
    }
  };

  const renderAgentCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/home/agentTasks/[agentTasks]",
          params: { agentTasks: item._id },
        });
      }}
      className="bg-primary  flex flex-row px-4 py-3  gap-8 items-center rounded-lg mb-4"
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
      <View>
        <Text className="text-white text-xl font-bold uppercase">
          {item?.agentData?.name}
        </Text>
        <Text className="text-secondary text-md">
          {item?.agentData?.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
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
                {userName}
              </Text>
            </View>

            <View className="flex flex-col gap-4">
              <TouchableOpacity
                className="py-4 border-2 border-primary px-4 rounded-xl"
                onPress={() => {
                  setDrawerOpen(false);
                  router.push("/screens/profile");
                }}
              >
                <Text className="text-white text-lg">Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-4 border-2 border-primary px-4 rounded-xl"
                onPress={handleLogout}
              >
                <Text className="text-white text-lg">Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View className="flex flex-col justify-between h-full bg-black px-4 pt-6">
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-2xl font-bold">
              Welcome, {userName}
            </Text>
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
          <View className="mt-4 ">
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
          <View className="mt-8">
            <Text className="text-secondary mb-[4%] text-sm uppercase tracking-wider">
              Your Goals
            </Text>
            {loading ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : agentInstances.length > 0 ? (
              <FlatList
                data={agentInstances}
                keyExtractor={(item) => item._id}
                renderItem={renderAgentCard}
                contentContainerStyle={{
                  gap: 8,
                  paddingBottom: 16,
                }}
                showsVerticalScrollIndicator={false}
                style={{
                  maxHeight: screenHeight * 0.27,
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
            className="bg-primary py-3 rounded-md mt-[16%]"
            onPress={() => router.push("/screens/onboarding")}
          >
            <Text className="text-white text-center text-lg uppercase">
              {agentInstances.length > 0 ? "Add a goal" : "Add your first goal"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-between items-center px-6 mt-10 mb-9">
            <TouchableOpacity className="items-center">
              <FontAwesome5 name="home" size={16} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity className="items-center">
              <FontAwesome5 name="dumbbell" size={16} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity className="items-center">
              <FontAwesome5 name="award" size={16} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
