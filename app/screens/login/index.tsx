import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { useAuth } from "@/auth/useAuth"; // Import AuthContext

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { login } = useAuth(); // Get login function from AuthContext

  const handleLogin = async () => {
    try {
      await login({ email, password });
      router.push("/screens/onboarding"); // Navigate to onboarding on successful login
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid credentials. Please try again.");
    }
  };

  const handleChangeEmail = (text: string) => {
    setEmail(text);
    setErrorMessage("");
  };

  const handleChangePassword = (text: string) => {
    setPassword(text);
    setErrorMessage("");
  };

  return (
    <View className="flex-1 bg-black justify-center px-6">
      <Header />
      <Text className="text-white text-4xl font-bold text-center mb-4">
        Login
      </Text>
      <Text className="text-white text-lg text-center mb-8">
        Welcome back to Micro.Fit
      </Text>
      <View className="mb-6">
        <Text className="text-white text-l mb-2">EMAIL</Text>
        <TextInput
          className="h-12 border border-gray-600 rounded-lg mb-2 px-4 text-white "
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={handleChangeEmail}
        />
      </View>
      <Text className="text-white text-l mb-2">PASSWORD</Text>
      <TextInput
        className="h-12 border border-gray-600 rounded-lg mb-4 px-4 text-white "
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={handleChangePassword}
      />
      {errorMessage && (
        <Text className="text-red-500 text-center mb-4">{errorMessage}</Text>
      )}
      <TouchableOpacity
        className="bg-[#333333] py-2 rounded-lg mb-4 mt-[8%]"
        onPress={handleLogin}
      >
        <Text className="text-white text-lg font-bold text-center">LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-[#333333] py-2 rounded-lg"
        onPress={() => router.push("/screens/signup")}
      >
        <Text className="text-white text-lg font-bold text-center">SIGNUP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
