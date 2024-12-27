import React from "react";
import { useNotification } from "@/notification/notificationContext";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const NotificationScreen = () => {
  const { notifications, markNotificationAsRead } = useNotification();
  const router = useRouter();

  const handleNotificationNavigation = (notification: any) => {
    const data = notification?.data || {};
    const { type, taskKey, instanceId } = data;

    // Mark the notification as read when clicked
    markNotificationAsRead(notification.data.notificationId); // Use data.notificationId

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

  const renderNotification = ({ item }: { item: any }) => {
    const isRead = item.read;

    return (
      <TouchableOpacity
        className={`bg-[#1f1f1f] rounded-lg p-4 mb-4 flex-row items-center ${
          isRead ? "opacity-50" : "" // Dim the notification if it is read
        }`}
        onPress={() => !isRead && handleNotificationNavigation(item)} // Disable if read
        disabled={isRead} // Disable interaction if already read
      >
        <View className="mr-3">
          <Ionicons
            name="notifications-outline"
            size={28}
            color="orange"
            className="rounded-full bg-[#292929] p-2"
          />
        </View>
        <View className="flex-1">
          <Text className="text-white text-lg font-bold mb-1">
            {item.notification?.title || "No Title"}
          </Text>
          <Text className="text-secondary text-sm">
            {item.notification?.body || "No Body"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="h-full bg-black">
      <View className="flex-row items-center px-4 py-3">
        <View className="w-1/3">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View className="w-2/3 pl-4">
          <Text className="text-secondary text-lg font-bold tracking-wide uppercase">
            Notifications
          </Text>
        </View>
      </View>
      <View className="flex-1 px-4 py-2">
        {notifications.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="notifications-off" size={64} color="#555555" />
            <Text className="text-secondary text-lg mt-4">
              No notifications yet!
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications.reverse()}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderNotification}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;
