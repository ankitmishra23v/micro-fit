import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { UpdateUserDetails } from "@/services/utilities/api";
import { useAuth } from "@/auth/useAuth";
import { toast } from "@/components/ToastManager";
import storage from "@/services/utilities/storage";

const GenderAgeScreen = () => {
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState<boolean | undefined>(false);
  const [age, setAge] = useState<number | null>(null);
  const [showCountrySelection, setShowCountrySelection] = useState(false);
  const [country, setCountry] = useState("");
  const router = useRouter();
  const {
    id,
    setAge: setAuthAge,
    setGender: setAuthGender,
    setCountry: setAuthCountry,
  } = useAuth();

  const handleNext = () => {
    if (gender && age) {
      setShowCountrySelection(true);
    } else {
      toast.error({ title: "please fill the details before proceeding" });
    }
  };

  const handlePrevious = () => {
    setShowCountrySelection(false);
  };

  const handleProceed = async () => {
    if (country) {
      try {
        setLoading(true);
        const userDetails = {
          age,
          gender: gender.toUpperCase(),
          country,
        };

        await UpdateUserDetails({
          data: userDetails,
          userId: id as string,
        });
        await storage.setUserData(userDetails);
        setAuthAge(age);
        setAuthGender(gender);
        setAuthCountry(country);
        setLoading(false);
        router.push("/home");
      } catch (error: any) {
        toast.error({ title: error.error });
        setLoading(false);
      }
    } else {
      alert("Please select your country");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-black px-6 pt-8">
          <View>
            <Header />
          </View>

          {showCountrySelection && (
            <TouchableOpacity
              className="absolute top-20 left-6 p-2"
              onPress={handlePrevious}
            >
              <Ionicons name={"arrow-back-sharp"} size={24} color="white" />
            </TouchableOpacity>
          )}

          <Text className="text-[#CDCDCD] text-sm tracking-wider font-bold mt-[25%] mb-[10%] uppercase">
            A Little More About You
          </Text>
          <Text className="text-white text-lg mb-12 text-justify">
            To personalize your experience, please let us know a few things.
          </Text>

          {!showCountrySelection ? (
            <>
              <View className="mb-6">
                <Text className="text-white text-2xl font-bold mb-4">
                  What’s your gender?
                </Text>
                <View className="flex-row justify-between mb-[10%]">
                  {["Male", "Female", "Other"].map((option) => (
                    <TouchableOpacity
                      key={option}
                      className={`flex-1 h-12 mx-1 rounded-lg  ${
                        gender === option ? "bg-white" : "bg-primary"
                      } justify-center items-center`}
                      onPress={() => setGender(option)}
                    >
                      <Text
                        className={`text-base ${
                          gender === option
                            ? "text-black font-semibold"
                            : "text-secondary"
                        }`}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-white text-lg mb-4">
                  What’s your age?
                </Text>
                <TextInput
                  className="h-12 border border-gray-600 rounded-lg px-4 text-white"
                  placeholder="Enter your age"
                  placeholderTextColor="#666"
                  keyboardType="number-pad"
                  value={age !== null ? age.toString() : ""}
                  onChangeText={(text) => {
                    const numericAge = Number(text);
                    if (numericAge >= 1 && numericAge <= 100) {
                      setAge(numericAge);
                    } else if (text === "") {
                      setAge(null);
                    }
                  }}
                />
              </View>

              <TouchableOpacity
                className="h-12 bg-[#333333] rounded-lg justify-center items-center mt-4 mb-8"
                onPress={handleNext}
              >
                <Text className="text-white text-lg font-bold">NEXT</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View className="mb-6">
                <Text className="text-white text-2xl font-bold mb-4">
                  Which country are you from?
                </Text>
                <View className="flex flex-wrap flex-row  mb-[10%]">
                  {[
                    "India",
                    "United States",
                    "United Kingdom",
                    "Australia",
                    "Japan",
                  ].map((option) => (
                    <TouchableOpacity
                      key={option}
                      className={`p-4 rounded-lg shadow-lg  ${
                        country === option ? "bg-white" : "bg-primary"
                      } flex-1 mb-4 mr-4 min-w-[140px]`}
                      onPress={() => setCountry(option)}
                    >
                      <Text
                        className={`text-lg  ${
                          country === option
                            ? "text-black font-semibold"
                            : "text-secondary"
                        }`}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                className="h-12 bg-[#333333] rounded-lg justify-center items-center mt-4"
                onPress={handleProceed}
                disabled={loading}
              >
                <Text className="text-white text-lg font-bold uppercase">
                  {loading ? "Please wait..." : "Proceed"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default GenderAgeScreen;
