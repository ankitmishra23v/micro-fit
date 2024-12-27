import messaging from "@react-native-firebase/messaging";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { useNotification } from "@/notification/notificationContext";
import { Alert } from "react-native";

const NotificationHandler = () => {
  const router = useRouter();
  const { incrementNotificationCount, addNotification } = useNotification();
  const hasNavigated = useRef(false); // Use useRef for consistent tracking

  // Handle navigation based on notification type and payload
  const handleNotificationNavigation = (notification: any) => {
    const data = notification?.data || {};
    const { type, taskKey, instanceId } = data;

    if (type === "APP_CALLBACK_DATA" && instanceId) {
      router.push({
        pathname: "/home/agentTasks/[agentTasks]",
        params: { agentTasks: instanceId },
      });
    } else if (type === "APP_NOTIFICATION_FEEDBACK" && taskKey && instanceId) {
      router.push({
        pathname: "/home/agentTasks/taskFeedback/[taskFeedback]",
        params: {
          taskFeedback: taskKey,
          instanceId,
        },
      });
    } else if (type === "ONBOARD_QUESTIONS") {
      router.push("/screens/onboarding/onboardQuestions");
    } else {
      router.push("/home");
    }
  };

  // Check if the app was launched via a notification (quit state)
  const checkInitialNotification = async () => {
    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      console.log("Initial Notification Data:", initialNotification?.data);
      setTimeout(() => {
        if (!hasNavigated.current) {
          handleNotificationNavigation(initialNotification?.data || {});
          hasNavigated.current = true; // Mark navigation as completed
        }
      }, 3500); // Delay navigation by 3500ms
    }
  };

  useEffect(() => {
    // Check if the app was opened via a notification (quit state)
    checkInitialNotification();

    // Handle foreground notifications
    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage) => {
        console.log("Foreground Notification:", remoteMessage);
        const messageId = remoteMessage?.messageId || "no-id";
        const notificationPayload = {
          notification: {
            title: remoteMessage.notification?.title || "No Title",
            body: remoteMessage.notification?.body || "No Body",
          },
          data: remoteMessage.data || {},
          messageId,
        };

        incrementNotificationCount(); // Increment the in-app notification counter
        addNotification(notificationPayload); // Store the notification for app display
      }
    );

    // Handle notifications when app is opened from background state
    const unsubscribeOnNotificationOpenedApp =
      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log("Notification Opened App:", remoteMessage);
        const notificationData = remoteMessage?.data || {};

        // Ensure navigation occurs only once
        if (!hasNavigated.current) {
          handleNotificationNavigation(notificationData);
          hasNavigated.current = true; // Mark navigation as completed
        }
      });

    // Handle background notifications
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Background Notification:", remoteMessage);
      const notificationData = remoteMessage?.data || {};

      // Ensure navigation occurs only once
      if (!hasNavigated.current) {
        handleNotificationNavigation(notificationData);
        hasNavigated.current = true; // Mark navigation as completed
      }
    });

    return () => {
      console.log("Cleaning up notification handlers...");
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return null;
};

export default NotificationHandler;
