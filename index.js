import { registerRootComponent } from "expo";
import messaging from "@react-native-firebase/messaging";
import App from "./App";

// Handle background messages
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background:", remoteMessage);
});

// Handle messages when the app is in the foreground
messaging().onMessage(async (remoteMessage) => {
  console.log("Message received in the foreground:", remoteMessage);
});

// Register the root component
registerRootComponent(App);
