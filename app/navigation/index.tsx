import React from "react";
import { Stack } from "expo-router";

const Navigation = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="screens/welcome" />
      <Stack.Screen name="screens/signup/genderscreen" />
      <Stack.Screen name="screens/signup/reminders" />
    </Stack>
  );
};

export default Navigation;
