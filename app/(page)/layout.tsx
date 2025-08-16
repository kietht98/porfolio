"use client";
import React, { PropsWithChildren, useMemo, useState } from "react";
import Footer from "@/app/components/footer";
import { ThemeProvider } from "../context/Theme";
import { MotionConfig } from "framer-motion";
import TransitionProvider from "./intro/TransitionProvider";

const Layout = ({ children }: PropsWithChildren) => {
  const [config, setConfig] = useState({
    color: "#ffffff",
  });

  const disableAnim = true; // toggle theo state/env/cookie tùy bro

  const configMemo = useMemo(() => {
    return {
      setColor: ({ color }: { color: string }) =>
        setConfig({
          color: color,
        }),
      config: config,
    };
  }, [config]);
  return (
    <ThemeProvider value={configMemo}>
      {/* <NavBar /> */}
      <main>
        {" "}
        <TransitionProvider>
          {" "}
          <MotionConfig
            reducedMotion={disableAnim ? "always" : "user"} // 'always' = tắt animation
            transition={disableAnim ? { duration: 0 } : undefined}
          >
            {" "}
            {children}
          </MotionConfig>
        </TransitionProvider>
      </main>
      <Footer />
    </ThemeProvider>
  );
};

export default Layout;
