"use client";

import * as React from "react";
import { m } from "framer-motion";
import Link from "next/link";
import {
  RocketIcon,
  GlobeIcon,
  GitHubLogoIcon,
  Component1Icon,
  MobileIcon,
  LockClosedIcon,
  LayersIcon,
  CodeIcon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";
import LinkWrapper from "@/app/components/LinkWrapper";
import { Box } from "@radix-ui/themes";

type Project = {
  key: string;
  title: string;
  href?: string;
  Icon: React.ReactNode;
  badge?: string; // optional tag (e.g., OSS, WIP)
};

const PROJECTS: Project[] = [
  {
    key: "portfolio",
    title: "Portfolio v3",
    href: "/projects/portfolio",
    Icon: <GlobeIcon />,
    badge: "Next.js",
  },
  {
    key: "designsys",
    title: "Design System",
    href: "https://github.com/pancakeswap/pancake-frontend/",
    Icon: <Component1Icon />,
    badge: "UI Kit",
  },
  {
    key: "oss",
    title: "Open Source Tools",
    href: "https://github.com/kietht98",
    Icon: <GitHubLogoIcon />,
    badge: "OSS",
  },
  {
    key: "mobile",
    title: "Mobile UI Lab",
    href: "https://sliving.com/",
    Icon: <MobileIcon />,
    badge: "Prototype",
  },
  {
    key: "secure",
    title: "E-commerce",
    href: "https://devegbert.xyz/",
    Icon: <LockClosedIcon />,
    badge: "Security",
  },
  {
    key: "play",
    title: "Blogs",
    href: "https://hashnext.hashnode.dev/",
    Icon: <LayersIcon />,
    badge: "Experiments",
  },
  {
    key: "cli",
    title: "VR 360",
    href: "https://univr.vn/univr360/",
    Icon: <CodeIcon />,
    badge: "Node",
  },
  {
    key: "speed",
    title: "Game 2D",
    href: "/game/sprite",
    Icon: <RocketIcon />,
    badge: "Perf",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

function ProjectsIconSection({
  title = "Projects",
  subtitle = "Things I’ve built or tinkered with",
  asSliderOnMobile = true,
}: {
  title?: string;
  subtitle?: string;
  asSliderOnMobile?: boolean;
}) {
  return (
    <section className="relative">
      {/* background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10
        [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"
      >
        <div className="absolute inset-x-0 -top-12 h-[28rem] blur-2xl bg-gradient-to-b from-sky-300/35 via-sky-400/20 to-transparent" />
      </div>

      <div className="mb-6 text-center">
        <div>
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
      </div>

      <m.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className={[
          asSliderOnMobile
            ? "flex gap-4 overflow-x-auto -mx-1 md:mx-0 md:px-0 md:gap-6"
            : "grid gap-6",
          "md:grid md:grid-cols-3 lg:grid-cols-4",
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
        {PROJECTS.map((p) => (
          <m.div
            key={p.key}
            variants={item}
            className={[
              "group relative",
              asSliderOnMobile ? "min-w-[75%] sm:min-w-[55%] md:min-w-0" : "",
              "scroll-ml-4 snap-center md:snap-align-none",
            ].join(" ")}
          >
            {/* gradient border */}
            <div className="relative rounded-2xl  bg-gradient-to-br from-sky-300 via-sky-400 to-blue-500 transition-colors duration-300 group-hover:from-sky-200 group-hover:via-sky-300 group-hover:to-blue-400">
              <LinkWrapper
                href={p.href ?? "/projects"}
                className="block rounded-2xl bg-white p-5 shadow-md hover:shadow-lg transition"
              >
                {/* BIG ICON FOCUS */}
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-100">
                    <Box className="h-5 w-5 text-sky-600">{p.Icon}</Box>
                  </span>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-slate-900">
                      {p.title}
                    </h3>
                    {p.badge && (
                      <span className="mt-1 inline-flex items-center rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 ring-1 ring-sky-100">
                        {p.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* subtle footer row */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-sky-700/80 opacity-0 transition-opacity group-hover:opacity-100">
                    Open project
                  </span>
                  <ArrowRightIcon className="h-4 w-4 text-sky-600 opacity-70 group-hover:opacity-100 transition" />
                </div>

                {/* shine */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition
                  bg-[radial-gradient(120px_80px_at_85%_0%,rgba(56,189,248,0.12),transparent_60%)]"
                />
              </LinkWrapper>
            </div>
          </m.div>
        ))}
      </m.div>

      {/* mobile CTA */}
      <div className="mt-6 md:hidden">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-sky-400 hover:to-blue-500 transition"
        >
          View all <ArrowRightIcon />
        </Link>
      </div>
    </section>
  );
}

export default ProjectsIconSection;
