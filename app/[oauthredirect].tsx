import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth"; // Replace with your actual auth hook
import { signUp } from "@/services/utilities/api";

const OAuthRedirect = () => {
  const [loading, setLoading] = useState(false);
  const params = useLocalSearchParams(); // Extract query parameters
  console.log("PARAMSSS: ", params);
  const router = useRouter();
  const { signUp } = useAuth(); // Assuming useAuth is your custom hook for login

  // const handleOAuthLogin = async (code: string) => {
  //   if (loading) return;

  //   setLoading(true);
  //   try {
  //     // Call your existing login function with the authorization code and loginType
  //     await signUp({
  //       code,
  //       loginType: "google",
  //     });

  //     router.replace("/home"); // Navigate to the home screen on success
  //   } catch (err: any) {
  //     console.error("Login Error:", err);
  //     const errorMessage =
  //       err.message || "An error occurred while logging in. Please try again.";
  //     Alert.alert("Login Failed", errorMessage);
  //     setLoading(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    router.replace("/screens/welcome");
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Text>Redirecting...</Text>
      )}
    </View>
  );
};

export default OAuthRedirect;
