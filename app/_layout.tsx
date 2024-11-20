import React from "react";
import { Slot, Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "@/auth/useAuth";
const Layout = () => {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
};

export default Layout;
