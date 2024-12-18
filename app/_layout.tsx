import React from "react";
import { Slot, Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "../auth/useAuth";
import { ToastProvider } from "../components/ToastManager";
import NotificationHandler from "@/components/notificaionHandler";
const Layout = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Slot />
        <NotificationHandler />
      </AuthProvider>
    </ToastProvider>
  );
};

export default Layout;
