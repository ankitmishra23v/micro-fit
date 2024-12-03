import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import googleLogo from "@/assets/images/google.png";

// Ensure that WebBrowser completes the auth session
WebBrowser.maybeCompleteAuthSession();

const WelcomeScreen = () => {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "201822959439-mfpo2ad2v8bhudlovov7fdoqj110mn20.apps.googleusercontent.com", // Replace with your actual Android Client ID
    iosClientId:
      "201822959439-boucbjei7o5cohufd644g878kshoolu7.apps.googleusercontent.com",
    webClientId:
      "201822959439-a8u0v20p9tk6vf1g5ilsi0u3ioqhq0um.apps.googleusercontent.com", // Replace with your actual Web Client ID
    scopes: ["profile", "email"],
  });

  console.log("Redirect URI:", request?.redirectUri);

  // Handle the Google Sign-In response
  useEffect(() => {
    console.log("RESPONSSEEEEEE", response);
    if (response?.type === "success" && response?.params?.code) {
      const authCode = response.params.code; // Extract the authorization code
      console.log("Authorization Code:", authCode);

      // Show a success message
      Alert.alert("Success", `Authorization Code: ${authCode}`);

      // TODO: Send the code to your backend
    } else if (response?.type === "error") {
      console.log("Error during authentication:", response.error);
      Alert.alert("Error", "Google authentication failed.");
    }
  }, [response]);

  const handleGoogleSignIn = async () => {
    const result = await promptAsync();

    console.log("RESUltttt", result);
    if (result.type === "success") {
      const { params } = result; // Access params directly from the JSON response
      // console.log("Full Response JSON:", JSON.stringify(result, null, 2));
      console.log("Authorization Code:", params.code);
      // router.push("/screens/login");
      // Show the extracted authorization code
      Alert.alert("Success", `Authorization Code: ${params.code}`);
    } else if (result.type === "error") {
      // console.log("Authentication Error:", result.error);
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
        {Platform.OS === "ios" && (
          <TouchableOpacity className="bg-white py-2 rounded-lg mb-4">
            <Text className="text-black text-lg font-bold text-center">
              SIGN UP WITH APPLE
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
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
        </TouchableOpacity>
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
