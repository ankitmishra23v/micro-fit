import React from "react";
import { Stack } from "expo-router";
import "../global.css";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default Layout;
