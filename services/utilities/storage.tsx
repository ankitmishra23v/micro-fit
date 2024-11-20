import AsyncStorage from "@react-native-async-storage/async-storage";

// Define storage keys
const AUTH_TOKEN_KEY = "__auth_token";
const REFRESH_TOKEN_KEY = "__refresh_token";
const USER_DATA_KEY = "__user_data";

class Storage {
  // Save access token
  async setAuthToken(token: string): Promise<void> {
    if (!token) throw new Error("Token must be a non-empty string.");
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  // Get access token
  async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  }

  // Save refresh token
  async setRefreshToken(token: string): Promise<void> {
    if (!token) throw new Error("Refresh token must be a non-empty string.");
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  // Get refresh token
  async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  }

  // Save user data
  async setUserData(user: Record<string, any>): Promise<void> {
    if (typeof user !== "object" || Array.isArray(user)) {
      throw new Error("User data must be an object.");
    }
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem(USER_DATA_KEY, jsonValue);
  }

  // Get user data
  async getUserData<T = Record<string, any>>(): Promise<T | null> {
    const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
    return jsonValue ? JSON.parse(jsonValue) : null;
  }

  // Clear all stored data
  async clear(): Promise<void> {
    await AsyncStorage.multiRemove([
      AUTH_TOKEN_KEY,
      REFRESH_TOKEN_KEY,
      USER_DATA_KEY,
    ]);
  }
}

export default new Storage();
