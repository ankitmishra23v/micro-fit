import { Stack, useRouter } from "expo-router";
import errorImage from "@/assets/images/err.png";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useAuth } from "@/auth/useAuth";

export default function NotFoundScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleRedirect = () => {
    if (isAuthenticated()) {
      router.replace("/home");
    } else {
      router.replace("/screens/welcome");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Page Not Found" }} />
      <View style={styles.container}>
        <Image source={errorImage} style={styles.image} />
        <Text style={styles.title}>Oops! Page not found</Text>
        <Text style={styles.message}>
          The page you’re looking for doesn’t exist or has been moved.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleRedirect}>
          <Text style={styles.linkText}>Go to Home Screen</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#cccccc",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#333333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  linkText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
