import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

const handledNotifications = new Set();

const NotificationHandler = () => {
  const router = useRouter();

  const handleNotificationNavigation = (
    notificationData: any,
    messageId: string
  ) => {
    const { type, taskKey, instanceId } = notificationData;

    if (type === "APP_NOTIFICATION_FEEDBACK") {
      router.push({
        pathname: "/home/agentTasks/taskFeedback/[taskFeedback]",
        params: {
          taskFeedback: taskKey,
          instanceId,
        },
      });
    } else {
      router.push("/home");
    }
  };

  const askUserPermissionAndNavigate = (
    notificationData: any,
    messageId: string
  ) => {
    if (handledNotifications.has(messageId)) {
      return;
    }

    handledNotifications.add(messageId);

    Alert.alert(
      "Hey!",
      "New feedbacks have been generated, would you like to answer them?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Go",
          onPress: () =>
            handleNotificationNavigation(notificationData, messageId),
        },
      ]
    );
  };

  const checkInitialNotification = async () => {
    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      const messageId = initialNotification?.messageId || "no-id";

      const notificationData = initialNotification?.data || {};

      setTimeout(() => {
        handleNotificationNavigation(notificationData, messageId);
      }, 2800);
    }
  };

  useEffect(() => {
    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage) => {
        const messageId = remoteMessage?.messageId || "no-id";
        const notificationData = remoteMessage?.data || {};
        askUserPermissionAndNavigate(notificationData, messageId);
      }
    );

    const unsubscribeOnNotificationOpenedApp =
      messaging().onNotificationOpenedApp(async (remoteMessage) => {
        const messageId = remoteMessage?.messageId || "no-id";
        const notificationData = remoteMessage?.data || {};
        handleNotificationNavigation(notificationData, messageId);
      });

    checkInitialNotification();

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const messageId = remoteMessage?.messageId || "no-id";
      const notificationData = remoteMessage?.data || {};
      handleNotificationNavigation(notificationData, messageId);
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
    };
  }, []);

  return null;
};

export default NotificationHandler;
