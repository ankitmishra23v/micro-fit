import React, { createContext, useContext, useState, ReactNode } from "react";

type NotificationContextType = {
  notificationCount: number;
  notifications: any[];
  incrementNotificationCount: () => void;
  decrementNotificationCount: () => void;
  addNotification: (notification: any) => void;
  markNotificationAsRead: (notificationId: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const processedCollapseKeys = new Set();

  const incrementNotificationCount = () => {
    setNotificationCount((prev) => prev + 1);
  };

  const decrementNotificationCount = () => {
    setNotificationCount((prev) => Math.max(prev - 1, 0));
  };

  const addNotification = (notification: any) => {
    const title = notification?.notification?.title || "No Title";
    const body = notification?.notification?.body || "No Body";
    const data = notification?.data || {};
    const collapseKey = notification?.collapseKey || "default-collapse-key";
    const notificationId = data.notificationId;

    if (processedCollapseKeys.has(collapseKey)) {
      return;
    }

    processedCollapseKeys.add(collapseKey);

    setNotifications((prev) => {
      const newNotifications = [
        ...prev,
        {
          notificationId,
          notification: { title, body },
          data,
          collapseKey,
          read: false,
        },
      ];

      return newNotifications;
    });
    incrementNotificationCount();
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) => {
      const updatedNotifications = prev.map((notification) => {
        if (
          notification.data.notificationId === notificationId &&
          !notification.read
        ) {
          decrementNotificationCount();
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
