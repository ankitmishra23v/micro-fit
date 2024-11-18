// /app/_layout.js
import React, { useState, useEffect } from "react";
import { Redirect } from "expo-router";
import useAuth from "./auth/useAuth"; // Custom hook to check login status
import { Slot } from "expo-router"; // Import Slot
import "../global.css";

export default function Layout() {
  const { isLoggedIn } = useAuth(); // Check if user is logged in
  const [isLoading, setIsLoading] = useState(true); // Loading state for auth status

  useEffect(() => {
    // Simulate fetching authentication status
    const checkAuthStatus = async () => {
      setIsLoading(false); // After checking, set loading to false
    };

    checkAuthStatus();
  }, []);

  // While loading, render nothing or a loading spinner
  if (isLoading) {
    return null; // Or show a loading spinner if desired
  }

  // Redirect based on authentication status
  if (isLoggedIn) {
    return <Redirect href="screens/onboarding" />;
  }

  // If not logged in, redirect to the welcome screen
  return (
    <>
      <Redirect href="screens/welcome" />
      {/* Render the Slot for nested routes */}
      <Slot />
    </>
  );
}
