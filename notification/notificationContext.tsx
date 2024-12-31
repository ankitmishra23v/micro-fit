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
    const collapseKey = notification?.collapseKey || null;
    const notificationId = data.notificationId || Date.now().toString();
    const sentTime = notification?.sentTime || Date.now();

    setNotifications((prev) => {
      const existingNotification = prev.find(
        (n) => n.notificationId === notificationId
      );

      if (!existingNotification) {
        if (collapseKey) {
          incrementNotificationCount();
        }
        return [
          ...prev,
          {
            notificationId,
            notification: { title, body },
            data,
            collapseKey,
            sentTime,
            read: false,
          },
        ];
      }
      return prev;
    });
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) => {
        if (
          notification.notificationId === notificationId &&
          !notification.read
        ) {
          decrementNotificationCount();
          return { ...notification, read: true };
        }
        return notification;
      })
    );
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
