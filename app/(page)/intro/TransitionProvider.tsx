"use client";

import {
  AnimatePresence,
  motion,
  LazyMotion,
  domAnimation,
  useReducedMotion,
} from "framer-motion";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

function TransitionProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : -8 }}
          transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
          className="min-h-dvh"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </LazyMotion>
  );
}

export default TransitionProvider;
