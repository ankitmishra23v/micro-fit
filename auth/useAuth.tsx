import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
const jwtDecode = require("jwt-decode");
import {
  logIn as doLogin,
  signUp as doSignUp,
  refreshToken as refreshAuthToken,
} from "../services/utilities/api";
import Storage from "../services/utilities/storage";

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  email: string | null;
  firstName: string | null;
  id: string | null; // Added id to the context
  isAuthenticated: () => boolean;
  login: (user: LoginData) => Promise<void>;
  signUp: (user: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
}

interface LoginData {
  email: string;
  password: string;
}

interface SignUpData {
  firstName: string;
  email: string;
  password: string;
  loginType: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let tokenRefreshTimeout: NodeJS.Timeout | null = null;

const useAuthProvider = () => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null); // Added state for id

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
        setId(userData.id); // Set the user ID
        startTokenRefresh(refresh, accessToken);
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
    }
  };

  useEffect(() => {
    initializeAuth();
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
          id: userData._id, // Save the user ID
        }),
      ]);
      setToken(accessToken);
      setRefreshToken(refreshToken);
      setEmail(userData.email);
      setFirstName(userData.firstName);
      setId(userData._id); // Set the user ID
      startTokenRefresh(refreshToken, accessToken);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed.");
    }
  };

  const signUp = async (user: SignUpData): Promise<void> => {
    try {
      await doSignUp({ data: user });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Sign up failed.");
    }
  };

  const refreshAuthTokenHandler = async () => {
    try {
      if (!refreshToken) throw new Error("Refresh token is missing");
      const response: any = await refreshAuthToken({ data: { refreshToken } });
      const { accessToken } = response.data;
      await Storage.setAuthToken(accessToken);
      setToken(accessToken);
      startTokenRefresh(refreshToken, accessToken);
    } catch (error) {
      await logout();
    }
  };

  const startTokenRefresh = (refresh: string, accessToken: string) => {
    setRefreshToken(refresh);
    if (tokenRefreshTimeout) {
      clearTimeout(tokenRefreshTimeout);
      tokenRefreshTimeout = null;
    }
    try {
      const decodedToken: any = jwtDecode(accessToken);
      const expiryTime = decodedToken.exp * 1000;
      const refreshInterval = expiryTime - Date.now() - 1 * 60 * 1000;
      if (refreshInterval > 0) {
        tokenRefreshTimeout = setTimeout(() => {
          refreshAuthTokenHandler();
        }, refreshInterval);
      }
    } catch (error) {}
  };

  const logout = async (): Promise<void> => {
    try {
      if (tokenRefreshTimeout) {
        clearTimeout(tokenRefreshTimeout);
        tokenRefreshTimeout = null;
      }
      await Storage.clear();
      setToken(null);
      setRefreshToken(null);
      setEmail(null);
      setFirstName(null);
      setId(null); // Clear the user ID
    } catch (error) {
      throw new Error("Logout failed.");
    }
  };

  return {
    token,
    refreshToken,
    email,
    firstName,
    id, // Expose id in the context
    isAuthenticated,
    login,
    signUp,
    logout,
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
