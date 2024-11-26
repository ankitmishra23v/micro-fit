import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Header from "@/components/Header";
import { useAuth } from "@/auth/useAuth";
import { toast } from "@/components/ToastManager";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await login({ email, password });
      router.replace("/home");
    } catch (err: any) {
      const errorMessage =
        err.message || "An error occurred. Please try again.";
      toast.error({ title: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = (text: string) => {
    setEmail(text);
  };

  const handleChangePassword = (text: string) => {
    setPassword(text);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
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
          className="h-12 border border-gray-600 rounded-lg mb-2 px-4 text-white"
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={handleChangeEmail}
        />
      </View>
      <Text className="text-white text-l mb-2">PASSWORD</Text>
      <View className="flex-row items-center border border-gray-600 rounded-lg mb-4 px-4 h-12">
        <TextInput
          className="flex-1 text-white"
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          secureTextEntry={!passwordVisible}
          onChangeText={handleChangePassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <FontAwesome6
            name={passwordVisible ? "eye-slash" : "eye"}
            size={16}
            color="white"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        className={`bg-[#333333] py-2 rounded-lg mb-4 mt-[8%] flex justify-center items-center ${
          loading ? "opacity-50" : ""
        }`}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text className="text-white text-lg font-bold text-center">
            LOGIN
          </Text>
        )}
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
