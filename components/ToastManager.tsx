import React, { useState, useCallback, useEffect } from "react";
import { ToastComponent } from "./Toast";

type ToastType = "success" | "error" | "warning";

interface ToastProps {
  title: string;
  type: ToastType;
}

let showToast: (toastProps: ToastProps) => void;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);

  showToast = (toastProps: ToastProps) => {
    setToast(toastProps);
    setIsToastVisible(true);
  };

  const hideToast = useCallback(() => {
    setIsToastVisible(false);
    setTimeout(() => {
      setToast(null);
    }, 300);
  }, []);

  useEffect(() => {
    if (isToastVisible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isToastVisible, hideToast]);

  return (
    <>
      {children}
      {toast && isToastVisible && (
        <ToastComponent
          type={toast.type}
          title={toast.title}
          onClose={hideToast}
        />
      )}
    </>
  );
};

export const toast = {
  success: (props: { title: string }) =>
    showToast({ ...props, type: "success" }),
  error: (props: { title: string }) => showToast({ ...props, type: "error" }),
  warning: (props: { title: string }) =>
    showToast({ ...props, type: "warning" }),
};
