import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const WelcomeScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  return (
    <View className="flex-1 justify-around items-center bg-black px-6">
      <Text className="text-gray-400 text-xl tracking-widest font-bold mb-6 ">
        MICRO.FIT
      </Text>

      <View>
        <Text className="text-white text-3xl text-center mb-6">Welcome</Text>
        <Text className="text-white text-lg text-center mb-8">
          You’re only a few steps away to set and complete your goals.
        </Text>
      </View>
      <View>
        <Text className="text-white text-center text-sm tracking-wider mb-[4%]">
          ALREADY HAVE AN ACCOUNT?
        </Text>
        <TouchableOpacity
          className="bg-[rgba(51,51,51,1)] w-full  py-3 mb-[5%] rounded-lg"
          onPress={() => router.push("screens/login")}
        >
          <Text className="text-white text-center text-lg font-bold tracking-wider">
            LOGIN
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text className="text-white text-center text-sm tracking-wider mb-[4%]">
          NEW TO MICRO.FIT?
        </Text>
        <TouchableOpacity
          className="bg-[rgba(51,51,51,1)] w-full font-bold py-3 mb-6 rounded-lg"
          onPress={() => router.push("screens/signup")}
        >
          <Text className="text-white text-center text-lg tracking-wider">
            SIGN UP WITH EMAIL
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;
