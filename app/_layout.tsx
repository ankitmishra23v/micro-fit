import React from "react";
import { Slot, Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "@/auth/useAuth";
import { ToastProvider } from "@/components/ToastManager";
const Layout = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </ToastProvider>
  );
};

export default Layout;
