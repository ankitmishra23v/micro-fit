import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  BackHandler,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import googleLogo from "@/assets/images/google.png";

WebBrowser.maybeCompleteAuthSession();

const WelcomeScreen = () => {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (response?.type === "success" && response?.params?.code) {
      const authCode = response.params.code;
      console.log("Authorization Code:", authCode);

      Alert.alert("Success", `Authorization Code: ${authCode}`);
    } else if (response?.type === "error") {
      console.log("Error during authentication:", response.error);
      Alert.alert("Error", "Google authentication failed.");
    }
  }, [response]);

  const handleGoogleSignIn = async () => {
    const result = await promptAsync();

    console.log("RESUltttt", result);
    if (result.type === "success") {
      const { params } = result;
      console.log("Authorization Code:", params.code);

      Alert.alert("Success", `Authorization Code: ${params.code}`);
    } else if (result.type === "error") {
      Alert.alert("Error", "Google authentication failed.");
    }
  };

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
        {/* {Platform.OS === "ios" && (
          <TouchableOpacity className="bg-white py-2 rounded-lg mb-4">
            <Text className="text-black text-lg font-bold text-center">
              SIGN UP WITH APPLE
            </Text>
          </TouchableOpacity>
        )} */}
        {/* <TouchableOpacity
          className="bg-white flex flex-row items-center justify-between py-2 px-4 rounded-lg mb-4"
          onPress={handleGoogleSignIn}
          disabled={!request}
        >
          <Image
            source={googleLogo}
            style={{ width: 24, height: 24, resizeMode: "contain" }}
          />
          <Text className="flex-1 text-black text-lg font-bold text-center">
            SIGN UP WITH GOOGLE
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          className="bg-primary py-2 rounded-lg"
          onPress={() => router.push("/screens/signup")}
        >
          <Text className="text-white text-lg font-bold text-center">
            SIGN UP WITH EMAIL
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;
