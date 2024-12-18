import React, { createContext, useContext, useState, useEffect } from "react";
import {
  logIn as doLogin,
  signUp as doSignUp,
  logout as doLogout,
  submitDeviceDetails,
} from "../services/utilities/api";
import messaging from "@react-native-firebase/messaging";
import Storage from "../services/utilities/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform, PermissionsAndroid } from "react-native";
import { useRouter } from "expo-router";

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  email: string | null;
  firstName: string | null;
  id: string | null;
  isAuthenticated: () => boolean;
  login: (user: LoginData) => Promise<void>;
  signUp: (user: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: (newTokens: {
    accessToken: string;
    refreshToken: string;
  }) => Promise<void>;
}

type LoginData = {
  email?: string;
  password?: string;
};

interface SignUpData {
  firstName?: string;
  email?: string;
  password?: string;
  loginType?: string;
  code?: string;
}

const NOTIFICATION_PROMPT_KEY = "lastNotificationPrompt";
const PROMPT_DELAY_DAYS = 1;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuthProvider = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [hasNotificationPermission, setHasNotificationPermission] =
    useState<boolean>(false);

  const initializeAuth = async () => {
    try {
      const [accessToken, refresh, userData] = await Promise.all([
        Storage.getAuthToken(),
        Storage.getRefreshToken(),
        Storage.getUserData<{ email: string; firstName: string; id: string }>(),
      ]);

      if (accessToken && refresh && userData) {
        setToken(accessToken);
        setRefreshToken(refresh);
        setEmail(userData.email);
        setFirstName(userData.firstName);
        setId(userData.id);
      }
    } catch (error) {
      router.push("/screens/welcome");
      console.error("Error initializing auth:", error);
    }
  };

  const checkAndRequestPermission = async (): Promise<boolean> => {
    try {
      const currentPermission = await messaging().hasPermission();

      if (
        currentPermission === messaging.AuthorizationStatus.AUTHORIZED ||
        currentPermission === messaging.AuthorizationStatus.PROVISIONAL
      ) {
        return true;
      }

      const lastPrompt = await AsyncStorage.getItem(NOTIFICATION_PROMPT_KEY);
      const now = new Date().getTime();
      const delayTime = PROMPT_DELAY_DAYS * 24 * 60 * 60 * 1000;

      if (lastPrompt && now - parseInt(lastPrompt, 10) < delayTime) {
        return false;
      }

      const authStatus = await messaging().requestPermission();
      await AsyncStorage.setItem(NOTIFICATION_PROMPT_KEY, now.toString());

      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    } catch (error) {
      console.error(
        "Error checking/requesting notification permissions:",
        error
      );
      return false;
    }
  };

  const handleNotificationFlow = async () => {
    const hasPermission = await checkAndRequestPermission();
    if (hasPermission) {
      setHasNotificationPermission(true);
    }
  };

  const registerDevice = async (accessToken: string) => {
    try {
      const deviceType = Platform.OS === "ios" ? "IOS" : "ANDROID";
      const deviceToken = await messaging().getToken();

      await submitDeviceDetails({
        data: { accessToken, deviceToken, deviceType },
      });
    } catch (error) {
      console.error("Error registering device:", error);
    }
  };

  useEffect(() => {
    initializeAuth();
    if (!hasNotificationPermission) {
      handleNotificationFlow();
    }
    messaging().onTokenRefresh(async (newToken) => {
      if (token) {
        try {
          await submitDeviceDetails({
            data: { accessToken: token, deviceToken: newToken },
          });
        } catch (error) {
          console.error("Error updating FCM token:", error);
        }
      }
    });
  }, [hasNotificationPermission]);

  const isAuthenticated = () => Boolean(token);

  const login = async (user: LoginData): Promise<void> => {
    try {
      const response: any = await doLogin({ data: user });
      const { accessToken, refreshToken, user: userData } = response.data;

      await Promise.all([
        Storage.setAuthToken(accessToken),
        Storage.setRefreshToken(refreshToken),
        Storage.setUserData({
          email: userData.email,
          firstName: userData.firstName,
          id: userData._id,
        }),
      ]);

      setToken(accessToken);
      setRefreshToken(refreshToken);
      setEmail(userData.email);
      setFirstName(userData.firstName);
      setId(userData._id);

      await registerDevice(accessToken);
    } catch (error: any) {
      console.log("errrrrrrrr:", error.data);
      throw new Error(error?.data?.message || "Login failed.");
    }
  };

  const signUp = async (user: SignUpData): Promise<void> => {
    try {
      await doSignUp({ data: user });
    } catch (error: any) {
      throw new Error(error?.data?.message || "Sign up failed.");
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await doLogout();
      await Storage.clear();
      setToken(null);
      setRefreshToken(null);
      setEmail(null);
      setFirstName(null);
      setId(null);
    } catch (error) {
      throw new Error("Logout failed.");
    }
  };

  const refreshTokens = async ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }): Promise<void> => {
    try {
      await Promise.all([
        Storage.setAuthToken(accessToken),
        Storage.setRefreshToken(refreshToken),
      ]);

      setToken(accessToken);
      setRefreshToken(refreshToken);
    } catch (error) {
      console.error("Error refreshing tokens:", error);
      throw new Error("Failed to refresh tokens.");
    }
  };

  return {
    token,
    refreshToken,
    email,
    firstName,
    id,
    isAuthenticated,
    login,
    signUp,
    logout,
    refreshTokens,
  };
};

export const AuthProvider = ({ children }: any) => {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
