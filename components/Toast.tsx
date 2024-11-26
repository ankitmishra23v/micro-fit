import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

const screenWidth = Dimensions.get("window").width;

type ToastType = "success" | "error" | "warning";

interface ToastProps {
  type: ToastType;
  title: string;
}

export const ToastComponent = ({ type, title }: ToastProps) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 3000); // Auto-hide after 3 seconds
    });
  }, [fadeAnim]);

  const getBorderBottomStyle = () => {
    switch (type) {
      case "success":
        return { borderBottomColor: "#4CAF50" }; // Green for success
      case "error":
        return { borderBottomColor: "#F44336" }; // Red for error
      case "warning":
        return { borderBottomColor: "#FFC107" }; // Yellow for warning
      default:
        return {};
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <AntDesign name="checkcircleo" size={24} color="green" />;
      case "error":
        return <Entypo name="cross" size={24} color="red" />;
      case "warning":
        return <AntDesign name="warning" size={24} color="#FFC107" />;
      default:
        return "ℹ️";
    }
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        getBorderBottomStyle(),
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getIcon()}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.toastTitle}>{title}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 50,
    left: screenWidth * 0.05,
    width: screenWidth * 0.9,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#1A202C", // Gray-900
    borderBottomWidth: 4, // Horizontal line thickness
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Light background for the icon
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4, // Shadow around icon
  },
  icon: {
    fontSize: 12,
    color: "#fff", // White icon color
  },
  textContainer: {
    flex: 1,
  },
  toastTitle: {
    color: "#fff", // White text
    fontSize: 16,
    fontWeight: "bold",
  },
});
