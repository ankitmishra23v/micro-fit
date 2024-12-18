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
import Header from "@/components/Header";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useAuth } from "@/auth/useAuth";
import { toast } from "@/components/ToastManager";
import { Ionicons } from "@expo/vector-icons";

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); // New state for Last Name
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
    return regex.test(password);
  };

  const validateInputs = () => {
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      return "Please fill in all fields.";
    }
    if (!isValidEmail(email)) {
      return "Please enter a valid email address.";
    }
    if (!isValidPassword(password)) {
      return "Password must be 8-16 characters long, include at least one uppercase letter, and one special character.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  };

  const handleSignup = async () => {
    const error = validateInputs();
    if (error) {
      toast.error({ title: error });
      return;
    }

    setLoading(true);

    const payload = {
      email,
      firstName,
      lastName, // Include Last Name in the payload
      password,
      loginType: "system",
    };

    try {
      await signUp(payload);
      toast.success({ title: "Account created successfully!" });
      router.push("/screens/signup/genderscreen");
    } catch (err: any) {
      const errorMessage = err?.message || "An unexpected error occurred!";
      toast.error({ title: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (text: string) => {
      setter(text);
    };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex flex-row justify-start gap-[30%] items-center  pt-5 px-5">
          <TouchableOpacity onPress={() => router.back()} className="max-w-8">
            <Ionicons name="chevron-back-sharp" size={24} color="white" />
          </TouchableOpacity>
          <Header />
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 24,
                backgroundColor: "#000",
              }}
              keyboardShouldPersistTaps="handled"
            >
              <Text className="text-white text-4xl font-bold text-center mb-4">
                Sign Up
              </Text>
              <Text className="text-white text-lg text-center mb-8">
                Create a new account on Micro.Fit
              </Text>
              <View style={{ width: "100%", maxWidth: 400 }}>
                <TextInput
                  className="h-12 border border-gray-600 rounded-lg mb-4 px-4 text-white"
                  placeholder="Email"
                  placeholderTextColor="#aaa"
                  value={email}
                  onChangeText={handleChange(setEmail)}
                />
                <View className="relative">
                  <TextInput
                    className="h-12 border border-gray-600 rounded-lg mb-4 px-4 pr-12 text-white"
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={handleChange(setPassword)}
                  />
                </View>
                <View className="relative">
                  <TextInput
                    className="h-12 border border-gray-600 rounded-lg mb-4 px-4 pr-12 text-white"
                    placeholder="Confirm Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={handleChange(setConfirmPassword)}
                  />
                  <TouchableOpacity
                    className="absolute right-4 bottom-2 h-full flex items-center justify-center"
                    onPress={togglePasswordVisibility}
                  >
                    <FontAwesome6
                      name={showPassword ? "eye-slash" : "eye"}
                      size={16}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
                <TextInput
                  className="h-12 border border-gray-600 rounded-lg mb-4 px-4 text-white"
                  placeholder="First Name"
                  placeholderTextColor="#aaa"
                  value={firstName}
                  onChangeText={handleChange(setFirstName)}
                />
                <TextInput
                  className="h-12 border border-gray-600 rounded-lg mb-4 px-4 text-white"
                  placeholder="Last Name"
                  placeholderTextColor="#aaa"
                  value={lastName} // Bind the lastName state
                  onChangeText={handleChange(setLastName)} // Set Last Name
                />
              </View>
              <TouchableOpacity
                className={`bg-[#333333] py-3 rounded-lg mt-4 w-full max-w-[400px] ${
                  loading ? "opacity-50" : ""
                }`}
                onPress={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white text-lg font-bold text-center">
                    CREATE ACCOUNT
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
