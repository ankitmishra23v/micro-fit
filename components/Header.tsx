import React from "react";
import { SafeAreaView, Text, View } from "react-native";

const Header = () => {
  return (
    <SafeAreaView className="bg-black mt-10">
      <View className="items-center mb-6">
        <Text className="text-gray-400 text-xl font-bold tracking-wider uppercase">
          MICRO. FIT
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Header;
