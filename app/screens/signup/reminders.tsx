import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/Header";

const GenderAgeScreen = () => {
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const router = useRouter();

  const toggleSwitch = () =>
    setRemindersEnabled((previousState) => !previousState);

  const handleNext = () => {
    if (remindersEnabled) {
      router.push("/screens/signup/applehealth");
    } else {
      alert("Please enable reminders to proceed.");
    }
  };

  return (
    <View className="flex-1 bg-black px-6 pt-8">
      <View className="text-center">
        <Header />
      </View>
      {/* Reminder Section */}
      <View className="  mt-[40%] mb-[4%]">
        <Text className="text-white text-center font-bold text-2xl mb-4">
          Turn On Reminders
        </Text>
        <Text className="text-gray-400 text-lg mb-4 text-center">
          We can send you notifications to remind you when you have to start
          your routine.
        </Text>
        <View className="flex-row  gap-4 justify-center items-center my-[8%]">
          <Switch
            value={remindersEnabled}
            onValueChange={toggleSwitch}
            thumbColor={remindersEnabled ? "#f5dd4b" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
          />
          <Text className="text-white">Notifications</Text>
        </View>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        className="h-12 bg-[#333333] rounded-lg justify-center items-center mt-[20%]"
        onPress={handleNext}
      >
        <Text className="text-white text-lg font-bold">NEXT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GenderAgeScreen;
