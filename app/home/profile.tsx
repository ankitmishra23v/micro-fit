import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, SafeAreaView, Text, TouchableOpacity } from "react-native";

const UserProfile = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black  ">
      <TouchableOpacity className="mt-12" onPress={() => router.back()}>
        <Ionicons name="chevron-back-sharp" size={24} color="white" />
      </TouchableOpacity>
      <View className=" m-auto">
        <Text className="text-secondary text-xl text-center">Coming soon</Text>
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;
