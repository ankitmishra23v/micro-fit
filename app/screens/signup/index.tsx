import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ToastAndroid,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/auth/useAuth";

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();
  const { signUp } = useAuth();

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
    return regex.test(password);
  };

  const validateInputs = () => {
    if (!email || !password || !confirmPassword || !firstName) {
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
  const showError = (message: string) => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      ToastAndroid.show(message, ToastAndroid.LONG); // Use Toast for Android
    } else {
      setErrorMessage(message); // For web, show as a normal error message
    }
  };

  const handleSignup = async () => {
    const error = validateInputs();
    if (error) {
      showError(error); // Use `showError` for all platforms
      return;
    }

    setLoading(true); // Set loading state to true when API call starts

    const payload = {
      email,
      firstName,
      password,
      loginType: "system",
    };

    try {
      const response = await signUp(payload);

      if (Platform.OS === "android" || Platform.OS === "ios") {
        ToastAndroid.show("Account created successfully!", ToastAndroid.SHORT);
      } else {
        Alert.alert("Success", "Account created successfully!"); // Optional for web
      }

      router.push("/screens/signup/genderscreen");
    } catch (err: any) {
      showError(err.message || "Signup failed. Please try again."); // Use `showError` for consistent error handling
    } finally {
      setLoading(false); // Reset loading state after API call finishes
    }
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (text: string) => {
      setter(text);
      if (errorMessage) {
        setErrorMessage("");
      }
    };

  return (
    <View className="flex-1 bg-black px-6 pt-8  ">
      <Header />
      <Text className="text-white text-4xl font-bold text-center mt-[30%] md:mt-[5%] mb-4">
        Sign Up
      </Text>
      <Text className="text-white text-lg text-center mb-8">
        Create a new account on Micro.Fit
      </Text>
      <View className="w-full md:w-[30%] mx-auto">
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
          <TouchableOpacity
            className="absolute right-4 bottom-2 h-full flex items-center justify-center"
            onPress={() => setShowPassword(!showPassword)}
          >
            {!showPassword ? (
              <FontAwesome6 name="eye" size={14} color="white" />
            ) : (
              <Ionicons name="eye-off-outline" size={16} color="white" />
            )}
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
          <Text className="text-red-700 text-center mb-4">{errorMessage}</Text>
        )}
      </View>

      <TouchableOpacity
        className={`bg-[#333333] py-3 rounded-lg mt-4 w-full md:w-[30%] mx-auto ${
          loading ? "opacity-50" : ""
        }`}
        onPress={handleSignup}
        disabled={loading} // Disable button when loading
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-white text-lg font-bold text-center">
            CREATE ACCOUNT
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
