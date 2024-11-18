// /app/auth/useAuth.js
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Use useCallback to prevent function re-creation on every render
  const checkLoginStatus = useCallback(async () => {
    try {
      const user = await AsyncStorage.getItem("user"); // Replace with your actual auth check logic
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Failed to check login status", error);
    }
  }, []);

  useEffect(() => {
    checkLoginStatus(); // Call the function to check login status on mount
  }, [checkLoginStatus]); // The function is memoized, so it doesn't re-run unnecessarily

  return { isLoggedIn };
};

export default useAuth;
