"use client";

import { m } from "framer-motion";

export default function RotatingCircle({
  size = 440,
  duration = 10,
  color = "#38bdf8",
  children,
}: {
  size?: number;
  duration?: number;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <m.div
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        ease: "linear",
        duration,
      }}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `4px solid ${color}`,
        boxShadow: `0 0 12px ${color}80`,
      }}
    >
      {children}
    </m.div>
  );
}
