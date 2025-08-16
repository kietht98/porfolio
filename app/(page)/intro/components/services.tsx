"use client";

import * as React from "react";
import { m } from "framer-motion";
import {
  CodeIcon,
  GearIcon,
  RocketIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  AccessibilityIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import Image from "next/image";
import { Box } from "@radix-ui/themes";

type Service = {
  key: string;
  title: string;
  desc: string;
  href?: string;
  Icon: React.ReactNode;
};

const SERVICES: Service[] = [
  {
    key: "frontend",
    title: "Frontend",
    desc: "React/Next.js, Angular, UI component, accessibility & performance.",
    href: "/services/frontend",
    Icon: <CodeIcon />,
  },
  {
    key: "backend",
    title: "Backend",
    desc: "Node.js, REST/GraphQL, database & clean architecture.",
    href: "/services/backend",
    Icon: <GearIcon />,
  },
  {
    key: "devops",
    title: "DevOps",
    desc: "CI/CD, containers, monitoring & automation pipelines.",
    href: "/services/devops",
    Icon: <RocketIcon />,
  },
  {
    key: "cloud",
    title: "Cloud",
    desc: "AWS/Azure/GCP, serverless, cost optimization & scaling.",
    href: "/services/cloud",
    Icon: <AccessibilityIcon />,
  },
  {
    key: "security",
    title: "Security",
    desc: "AuthN/Z, secrets, OWASP, hardening & compliance basics.",
    href: "/services/security",
    Icon: <LockClosedIcon />,
  },
  {
    key: "tester",
    title: "Tester",
    desc: "Unit/E2E, coverage, QA process & test automation.",
    href: "/services/tester",
    Icon: <MagnifyingGlassIcon />,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function ServicesCards({
  title = "Our technologies",
  asSliderOnMobile = true,
}: {
  title?: string;
  /** Bật slider (scroll-snap) trên mobile */
  asSliderOnMobile?: boolean;
}) {
  return (
    <section className="relative">
      {/* bg pattern + gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[15%]  right-0 left-0 m-auto w-fit h-fit z-1"
      >
        {/* pattern */}
        <m.div
          animate={{
            y: [0, -10, 0], // lên 10px rồi xuống
            x: [0, 5, 0], // sang phải 5px rồi về
          }}
          transition={{
            duration: 4, // thời gian 1 vòng
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="w-full h-full"
        >
          <Image src="/images/prod-7.png" alt="" width={700} height={700} />
        </m.div>
      </div>

      <div className="mb-6 flex items-end justify-center">
        {/* title */}
        <h2
          className="text-2xl md:text-3xl font-bold inline-block px-4 py-2 rounded-lg 
               text-white 
               bg-gradient-to-br from-sky-400 via-sky-500 to-blue-700 
               shadow-md"
        >
          {title}
        </h2>
      </div>

      <m.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className={[
          // mobile: slider ngang, desktop: grid
          asSliderOnMobile
            ? "flex gap-4 overflow-x-auto px-1 -mx-1 md:mx-0 md:px-0 md:gap-6"
            : "grid gap-6",
          "md:grid md:grid-cols-2 lg:grid-cols-3",
          // ẩn scrollbar cross-browser
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        ].join(" ")}
        style={
          asSliderOnMobile
            ? ({
                scrollSnapType: "x mandatory",
                scrollPaddingLeft: "1rem",
                scrollPaddingRight: "1rem",
              } as React.CSSProperties)
            : undefined
        }
      >
        {SERVICES.map((s) => (
          <m.div
            key={s.key}
            variants={item}
            className={[
              "group relative",
              asSliderOnMobile ? "min-w-[85%] sm:min-w-[60%] md:min-w-0" : "",
              "scroll-ml-4 snap-center md:snap-align-none",
            ].join(" ")}
          >
            {/* gradient border wrapper */}
            <div className="relative rounded-2xl bg-gradient-to-br from-sky-300 via-sky-400 to-blue-500 transition-colors duration-300 group-hover:from-sky-200 group-hover:via-sky-300 group-hover:to-blue-400">
              {/* card body */}
              <div className="rounded-2xl bg-white p-5 hover:shadow-xl transition">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 ring-1 ring-sky-100">
                    <Box className="h-5 w-5 text-sky-600">{s.Icon}</Box>
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={s.href ?? "/services"}
                    className="inline-flex items-center gap-1 text-sm font-medium text-sky-700 hover:text-sky-900"
                  >
                    Learn more <ArrowRightIcon className="h-4 w-4" />
                  </Link>

                  {/* micro-interaction */}
                  <div className="text-xs text-sky-600/70 opacity-0 transition-opacity group-hover:opacity-100">
                    Ready to build
                  </div>
                </div>

                {/* shine on hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition
                  bg-[radial-gradient(120px_80px_at_85%_0%,rgba(56,189,248,0.12),transparent_60%)]"
                />
              </div>
            </div>
          </m.div>
        ))}
      </m.div>

      {/* nút xem tất cả (mobile) */}
      <div className="mt-6 md:hidden">
        <Link
          href="/services"
          className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-sky-400 hover:to-blue-500 transition"
        >
          All services <ArrowRightIcon />
        </Link>
      </div>
    </section>
  );
}
