import React, { createContext, useContext, useState, ReactNode } from "react";

// Type for the context value
type NotificationContextType = {
  notificationCount: number;
  notifications: any[];
  incrementNotificationCount: () => void;
  decrementNotificationCount: () => void;
  addNotification: (notification: any) => void;
  markNotificationAsRead: (notificationId: string) => void;
};

// Create context with an initial value of undefined
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Custom hook to use the NotificationContext
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

// Interface for the props of NotificationProvider, including children
interface NotificationProviderProps {
  children: ReactNode;
}

// NotificationProvider component which provides context to its children
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notificationCount, setNotificationCount] = useState(0); // Track the notification count
  const [notifications, setNotifications] = useState<any[]>([]); // Store the list of notifications
  const processedCollapseKeys = new Set(); // Track processed collapse keys to avoid counting multiple times

  // Function to increment the notification count
  const incrementNotificationCount = () => {
    setNotificationCount((prev) => prev + 1);
  };

  // Function to decrement the notification count
  const decrementNotificationCount = () => {
    setNotificationCount((prev) => Math.max(prev - 1, 0)); // Ensure it doesn't go negative
  };

  // Function to add a new notification to the list
  const addNotification = (notification: any) => {
    const title = notification?.notification?.title || "No Title";
    const body = notification?.notification?.body || "No Body";
    const data = notification?.data || {}; // Ensure data is extracted correctly
    const collapseKey = notification?.collapseKey || "default-collapse-key"; // Use collapseKey to group notifications
    const notificationId = data.notificationId; // Get the unique notificationId

    // Check if this collapseKey has already been processed
    if (processedCollapseKeys.has(collapseKey)) {
      return; // Don't add duplicate notifications with the same collapseKey
    }

    // Mark this collapseKey as processed
    processedCollapseKeys.add(collapseKey);

    // Add the notification in a consistent format
    setNotifications((prev) => {
      const newNotifications = [
        ...prev,
        {
          notificationId,
          notification: { title, body },
          data,
          collapseKey,
          read: false, // New notifications are initially unread
        },
      ];

      return newNotifications;
    });

    // Increment the notification count only once for the unique collapseKey
    incrementNotificationCount();
  };

  // Function to mark a notification as read (collapsed)
  const markNotificationAsRead = (notificationId: string) => {
    // Only update the clicked notification, not all notifications
    setNotifications((prev) => {
      const updatedNotifications = prev.map((notification) => {
        if (
          notification.data.notificationId === notificationId &&
          !notification.read
        ) {
          // Only mark the specific notification as read and decrement count
          decrementNotificationCount(); // Decrement count when marked as read
          return { ...notification, read: true };
        }
        return notification;
      });

      return updatedNotifications;
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notificationCount,
        notifications,
        incrementNotificationCount,
        decrementNotificationCount,
        addNotification,
        markNotificationAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
