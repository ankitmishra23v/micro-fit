import messaging from "@react-native-firebase/messaging";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useNotification } from "@/notification/notificationContext";
import { Alert } from "react-native";

const NotificationHandler = () => {
  const router = useRouter();
  const { incrementNotificationCount, addNotification } = useNotification();
  const [hasNavigated, setHasNavigated] = useState(false);

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

  const checkInitialNotification = async () => {
    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      setTimeout(() => {
        if (!hasNavigated) {
          handleNotificationNavigation(initialNotification);
          setHasNavigated(true);
        }
      }, 3500);
    }
  };

  useEffect(() => {
    checkInitialNotification();

    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage) => {
        console.log("Message", remoteMessage);
        const messageId = remoteMessage?.messageId || "no-id";
        const notificationPayload = {
          notification: {
            title: remoteMessage.notification?.title || "No Title",
            body: remoteMessage.notification?.body || "No Body",
          },
          data: remoteMessage.data || {},
          sentTime: remoteMessage.sentTime,
          messageId,
        };

        incrementNotificationCount();
        addNotification(notificationPayload);
      }
    );

    const unsubscribeOnNotificationOpenedApp =
      messaging().onNotificationOpenedApp((remoteMessage) => {
        const notificationData = remoteMessage?.data || {};

        if (!hasNavigated) {
          handleNotificationNavigation(notificationData);
          setHasNavigated(true);
        }
      });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const notificationData = remoteMessage?.data || {};

      if (!hasNavigated) {
        handleNotificationNavigation(notificationData);
        setHasNavigated(true);
      }
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
    };
  }, [hasNavigated]);

  return null;
};

export default NotificationHandler;
