import React from "react";
import { Slot, Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "../auth/useAuth";
import { ToastProvider } from "../components/ToastManager";

import { NotificationProvider } from "@/notification/notificationContext";
import NotificationHandler from "@/notification/notificaionHandler";
const Layout = () => {
  return (
    <ToastProvider>
      <NotificationProvider>
        <AuthProvider>
          <Slot />
          <NotificationHandler />
        </AuthProvider>
      </NotificationProvider>
    </ToastProvider>
  );
};

export default Layout;
