import React, { useState } from "react";
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

  showToast = (toastProps: ToastProps) => {
    setToast(toastProps);
    setTimeout(() => {
      setToast(null); // Hide toast after 3 seconds
    }, 3000);
  };

  return (
    <>
      {children}
      {toast && <ToastComponent type={toast.type} title={toast.title} />}
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
