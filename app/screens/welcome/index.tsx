import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/Header";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-around items-center bg-black px-6">
      <Header />
      <View>
        <Text className="text-white text-lg font-bold text-center mb-4">
          Welcome
        </Text>
        <Text className="text-white text-lg text-center mb-12">
          You’re only a few steps away to set and complete your goals.
        </Text>
      </View>
      <View className="w-full mb-8">
        <Text className="text-gray-400 text-sm text-center mb-3">
          ALREADY HAVE AN ACCOUNT?
        </Text>
        <TouchableOpacity
          className="bg-primary py-2 rounded-lg"
          onPress={() => router.push("/screens/login")}
        >
          <Text className="text-white text-lg font-bold text-center">
            LOGIN
          </Text>
        </TouchableOpacity>
      </View>
      <View className="w-full mb-12">
        <Text className="text-gray-400 text-sm text-center mb-3">
          NEW TO MICRO.FIT?
        </Text>
        <TouchableOpacity className="bg-white py-2 rounded-lg mb-4">
          <Text className="text-black text-lg font-bold text-center">
            SIGN UP WITH APPLE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-primary  py-2 rounded-lg"
          onPress={() => router.push("/screens/signup")}
        >
          <Text className="text-white  text-lg font-bold text-center">
            SIGN UP WITH EMAIL
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
