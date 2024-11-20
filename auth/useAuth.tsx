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
} from "../services/utilities/api";
import Storage from "../services/utilities/storage";

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  email: string | null;
  firstName: string | null;
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

const useAuthProvider = () => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);

  const initializeAuth = async () => {
    try {
      const [accessToken, refresh, userData] = await Promise.all([
        Storage.getAuthToken(),
        Storage.getRefreshToken(),
        Storage.getUserData<{ email: string; firstName: string }>(),
      ]);

      if (accessToken && refresh && userData) {
        setToken(accessToken);
        setRefreshToken(refresh);
        setEmail(userData.email);
        setFirstName(userData.firstName);
      }
    } catch (error) {
      console.error("Failed to initialize authentication:", error);
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
        }),
      ]);

      setToken(accessToken);
      setRefreshToken(refreshToken);
      setEmail(userData.email);
      setFirstName(userData.firstName);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const signUp = async (user: SignUpData): Promise<void> => {
    try {
      const response: any = await doSignUp({ data: user });
      const message = response?.data?.message || "Signup successful.";
      console.log(message);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Sign up failed. Please try again."
      );
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await Storage.clear();
      setToken(null);
      setRefreshToken(null);
      setEmail(null);
      setFirstName(null);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return {
    token,
    refreshToken,
    email,
    firstName,
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
