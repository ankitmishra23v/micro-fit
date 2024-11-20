import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { useAuth } from "@/auth/useAuth"; // Import AuthContext for signup functionality

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { signUp } = useAuth(); // Access signUp from AuthContext

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateInputs = () => {
    if (!email || !password || !confirmPassword || !firstName) {
      return "Please fill in all fields.";
    }
    if (!isValidEmail(email)) {
      return "Please enter a valid email address.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  };

  const handleSignup = async () => {
    const error = validateInputs();
    if (error) {
      setErrorMessage(error);
      return;
    }

    const payload = {
      email,
      firstName,
      password,
      loginType: "system", // Static loginType as per your requirements
    };

    try {
      const response = await signUp(payload);
      console.log(response);
      Alert.alert("Success", "Account created successfully!");

      router.push("/screens/signup/genderscreen");
    } catch (err: any) {
      setErrorMessage(err.message || "Signup failed. Please try again.");
    }
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (text: string) => {
      setter(text);
      setErrorMessage("");
    };

  return (
    <View className="flex-1 bg-black px-6 pt-8">
      <Header />
      <Text className="text-white text-4xl font-bold text-center mt-[30%] mb-4">
        Sign Up
      </Text>
      <Text className="text-white text-lg text-center mb-8">
        Create a new account on Micro.Fit
      </Text>
      <View>
        <TextInput
          className="h-12 border border-gray-600 rounded-lg mb-4 px-4 text-white"
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={handleChange(setEmail)}
        />
        <View className="relative">
          <TextInput
            className="h-12 border border-gray-600 rounded-lg mb-4 px-4 text-white"
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={handleChange(setPassword)}
          />
          <TouchableOpacity
            className="absolute right-4 top-4"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text className="text-white">{showPassword ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          className="h-12 border border-gray-600 rounded-lg mb-4 px-4 text-white"
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
          value={confirmPassword}
          onChangeText={handleChange(setConfirmPassword)}
        />
        <TextInput
          className="h-12 border border-gray-600 rounded-lg mb-4 px-4 text-white"
          placeholder="First Name"
          placeholderTextColor="#aaa"
          value={firstName}
          onChangeText={handleChange(setFirstName)}
        />
        {errorMessage && (
          <Text className="text-red-500 text-center mb-4">{errorMessage}</Text>
        )}
      </View>
      <TouchableOpacity
        className="bg-[#333333] py-3 rounded-lg mt-4"
        onPress={handleSignup}
      >
        <Text className="text-white text-lg font-bold text-center">
          CREATE ACCOUNT
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
