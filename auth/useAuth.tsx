import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  logIn as doLogin,
  signUp as doSignUp,
  logout as doLogout,
  submitDeviceDetails,
} from "../services/utilities/api";
import messaging from "@react-native-firebase/messaging";
import Storage from "../services/utilities/storage";
import { Alert } from "react-native";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuthProvider = () => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);

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
      console.error("Error initializing auth:", error);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const isAuthorized =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (isAuthorized) {
        console.log("Notification permissions granted");
      } else {
        console.warn("Notification permissions not granted");
      }
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
    }
  };

  const registerDevice = async (accessToken: string) => {
    try {
      const deviceToken = await messaging().getToken();
      Alert.alert("FCM Device Token:", deviceToken);

      // Send the device token to the backend
      const response: any = await submitDeviceDetails({
        data: {
          accessToken,
          deviceToken,
        },
      });
      console.log("Device registered:", response.data);
    } catch (error) {
      console.error("Error registering device:", error);
    }
  };

  const handleTokenRefresh = () => {
    messaging().onTokenRefresh(async (newToken) => {
      console.log("FCM Token refreshed:", newToken);
      if (token) {
        try {
          await submitDeviceDetails({
            data: {
              accessToken: token,
              deviceToken: newToken,
            },
          });
          console.log("Updated FCM token sent to the server");
        } catch (error) {
          console.error("Error updating FCM token:", error);
        }
      }
    });
  };

  useEffect(() => {
    initializeAuth();
    requestNotificationPermission();
    handleTokenRefresh();
  }, []);

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

      // Register the device with FCM token
      await registerDevice(accessToken);
    } catch (error: any) {
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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
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
