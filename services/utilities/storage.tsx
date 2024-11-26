import AsyncStorage from "@react-native-async-storage/async-storage";

// Define storage keys
const AUTH_TOKEN_KEY = "__auth_token";
const REFRESH_TOKEN_KEY = "__refresh_token";
const USER_DATA_KEY = "__user_data";

class Storage {
  // Save access token
  async setAuthToken(token: string): Promise<void> {
    if (typeof token !== "string" || token.trim() === "") {
      throw new Error("Token must be a non-empty string.");
    }
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error: any) {
      throw new Error(`Failed to save auth token: ${error.message}`);
    }
  }

  // Get access token
  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error: any) {
      throw new Error(`Failed to fetch auth token: ${error.message}`);
    }
  }

  // Save refresh token
  async setRefreshToken(token: string): Promise<void> {
    if (typeof token !== "string" || token.trim() === "") {
      throw new Error("Refresh token must be a non-empty string.");
    }
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error: any) {
      throw new Error(`Failed to save refresh token: ${error.message}`);
    }
  }

  // Get refresh token
  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error: any) {
      throw new Error(`Failed to fetch refresh token: ${error.message}`);
    }
  }

  // Save user data
  async setUserData(user: Record<string, any>): Promise<void> {
    if (typeof user !== "object" || Array.isArray(user) || user === null) {
      throw new Error("User data must be a non-null object.");
    }
    try {
      const jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem(USER_DATA_KEY, jsonValue);
    } catch (error: any) {
      throw new Error(`Failed to save user data: ${error.message}`);
    }
  }

  // Get user data
  async getUserData<T = Record<string, any>>(): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error: any) {
      throw new Error(`Failed to fetch user data: ${error.message}`);
    }
  }

  // Clear all stored data
  async clear(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        AUTH_TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        USER_DATA_KEY,
      ]);
    } catch (error: any) {
      throw new Error(`Failed to clear storage: ${error.message}`);
    }
  }
}

export default new Storage();
