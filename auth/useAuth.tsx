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
} from "../services/utilities/api";
import Storage from "../services/utilities/storage";

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
          id: userData._id,
        }),
      ]);

      setToken(accessToken);
      setRefreshToken(refreshToken);
      setEmail(userData.email);
      setFirstName(userData.firstName);
      setId(userData._id);
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
