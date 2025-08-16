"use client";
import React, { PropsWithChildren, useEffect } from "react";
import LayoutComps from "../shared/layout";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
const queryClient = new QueryClient();
const Layout = ({ children }: PropsWithChildren) => {
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
      } else {
        console.log("Notification permission denied.");
      }
    } catch (error) {
      console.error("Failed to request notification permission", error);
    }
  };
  useEffect(() => {
    // Request permission on component mount
    requestNotificationPermission();
  }, []);
  return (
    <Theme hasBackground={false}>
      <QueryClientProvider client={queryClient}>
        <LayoutComps>{children}</LayoutComps>
        <ToastContainer />
      </QueryClientProvider>
    </Theme>
  );
};

export default Layout;
