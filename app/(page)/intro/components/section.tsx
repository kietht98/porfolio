"use client";

import React from "react";
import { m, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/app/utils/merge";

type SectionProps = Omit<HTMLMotionProps<"section">, "ref"> & {
  /** Animate only the first time it enters the viewport */
  once?: boolean;
  className?: string;
};

type SectionComponent = React.ForwardRefExoticComponent<
  SectionProps & React.RefAttributes<HTMLElement>
>;

const Section = React.forwardRef<HTMLElement, SectionProps>(function Section(
  { className, once = true, children, ...rest },
  ref
) {
  const reduce = useReducedMotion();

  // tránh nhảy layout khi user bật reduce motion
  const initial = reduce ? { opacity: 0 } : { opacity: 0, y: 16 };
  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.5, ease: [0.16, 1, 0.3, 1] };

  return (
    <m.section
      ref={ref}
      initial={initial}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.25 }}
      transition={transition as any}
      className={cn("py-16 md:py-24", className)}
      {...rest} // onDrag, onClick, style... đều pass xuống
    >
      {children}
    </m.section>
  );
}) as SectionComponent;

Section.displayName = "Section";

export default Section;
