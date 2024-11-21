import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  Button,
  useColorScheme,
} from "react-native";

export default function HomeScreen() {
  const theme = useColorScheme() ?? "light";
  return (
    <View
      className={`flex-1 justify-center items-center ${
        theme === "light" ? "bg-white" : "bg-black"
      } `}
    >
      <Text
        className={`text-lg font-bold text-center ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }  tracking-widest p-4 rounded`}
      >
        MICRO.FIT
      </Text>
      <View className="mt-4 mb-14">
        <Text className="text-yellow-400 text-lg">Explore fitness options</Text>
      </View>
    </View>
  );
}
