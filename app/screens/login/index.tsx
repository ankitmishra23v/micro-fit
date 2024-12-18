import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Header from "@/components/Header";
import { useAuth } from "@/auth/useAuth";
import { toast } from "@/components/ToastManager";
import { Ionicons } from "@expo/vector-icons";

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

  const handleChangeEmail = (text: string) => setEmail(text);
  const handleChangePassword = (text: string) => setPassword(text);
  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex flex-row justify-start gap-[30%] items-center  pt-5 px-5">
          <TouchableOpacity onPress={() => router.back()} className=" max-w-8">
            <Ionicons name="chevron-back-sharp" size={24} color="white" />
          </TouchableOpacity>
          <Header />
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              backgroundColor: "#000",
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 24,
              }}
            >
              <Text className="text-white text-4xl font-bold text-center mb-4">
                Login
              </Text>
              <Text className="text-white text-lg text-center mb-8">
                Welcome back to Micro.Fit
              </Text>
              <View style={{ width: "100%", maxWidth: 400 }}>
                <TextInput
                  className="h-12 border border-gray-600 rounded-lg mb-4 px-4 text-white"
                  placeholder="Email"
                  placeholderTextColor="#aaa"
                  value={email}
                  onChangeText={handleChangeEmail}
                />
                <View className="relative">
                  <TextInput
                    className="h-12 border border-gray-600 rounded-lg mb-4 px-4 pr-12 text-white"
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={handleChangePassword}
                  />
                  <TouchableOpacity
                    className="absolute right-4 bottom-2 h-full flex items-center justify-center"
                    onPress={togglePasswordVisibility}
                  >
                    <FontAwesome6
                      name={passwordVisible ? "eye-slash" : "eye"}
                      size={16}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                className={`bg-[#333333] py-3 rounded-lg mt-4 w-full max-w-[400px] ${
                  loading ? "opacity-50" : ""
                }`}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white text-lg font-bold text-center">
                    LOGIN
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-[#333333] py-3 rounded-lg mt-4 w-full max-w-[400px]"
                onPress={() => router.push("/screens/signup")}
              >
                <Text className="text-white text-lg font-bold text-center">
                  SIGNUP
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
