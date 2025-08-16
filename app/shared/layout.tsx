"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "../context/Theme";
import { useStoreGrammars } from "../redux/store";

// Radix primitives
import * as Tooltip from "@radix-ui/react-tooltip";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as Separator from "@radix-ui/react-separator";

// Radix Icons
import {
  HomeIcon,
  BookmarkIcon,
  LayersIcon,
  LightningBoltIcon,
  RocketIcon,
  HamburgerMenuIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeIcon,
} from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/themes";

type MenuItem = {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  badge?: string;
};

const MENUS: MenuItem[] = [
  { title: "Home", url: "/home", icon: HomeIcon },
  { title: "Vocabulary", url: "/vocabulary", icon: BookmarkIcon },
  { title: "Common Regularly", url: "/common", icon: LayersIcon },
  { title: "Flashcards", url: "/flashcard", icon: LightningBoltIcon },
  { title: "Game · Sprite", url: "/game/sprite", icon: RocketIcon },
  { title: "Three · Astro", url: "/threejs", icon: GlobeIcon },
  { title: "Landing Page", url: "/caroselling", icon: GlobeIcon },
];

const LayoutComps = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(true); // Radix Collapsible state
  const queryGrammars = useStoreGrammars();

  const [config, setConfig] = useState({ color: "#ffffff" });
  const themeCtx = useMemo(
    () => ({
      setColor: ({ color }: { color: string }) => setConfig({ color }),
      config,
    }),
    [config]
  );

  useEffect(() => {
    localStorage.setItem("$regis", window.btoa("REQUEST"));
    if (!queryGrammars.isEmpty && !queryGrammars.loading) return;
    queryGrammars.fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(url + "/");

  return (
    <ThemeProvider value={themeCtx}>
      {/* Mobile toggle */}
      {!open && (
        <button
          className="fixed top-3 left-3 z-50 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white/90 px-2 py-2 shadow-sm backdrop-blur transition hover:shadow md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <HamburgerMenuIcon className="h-5 w-5" />
        </button>
      )}

      <Collapsible.Root
        open={open}
        onOpenChange={setOpen}
        className="fixed left-0 top-0 z-40 h-screen"
      >
        {/* Sidebar panel */}
        {open && (
          <Collapsible.Content
            forceMount
            className={[
              "h-full w-64 translate-x-0 md:translate-x-0",
              "transition-transform duration-300",
              open ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
          >
            <div className="relative flex h-full flex-col overflow-hidden border-r border-gray-200 bg-white/85 backdrop-blur dark:border-gray-700 dark:bg-gray-900/85">
              {/* Brand */}
              <div className="flex items-center gap-2 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-sm">
                  <RocketIcon className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    English App
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Learn • Practice • Win
                  </span>
                </div>
                <div className="ml-auto">
                  <Collapsible.Trigger
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white/90 px-2 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-200 dark:hover:bg-gray-800"
                    aria-label="Collapse sidebar"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Hide
                  </Collapsible.Trigger>
                </div>
              </div>

              <Separator.Root className="mx-3 h-px bg-gray-200 dark:bg-gray-800" />

              {/* Scrollable nav */}
              <ScrollArea.Root className="h-full">
                <ScrollArea.Viewport className="h-full">
                  <nav className="p-3">
                    <ul className="flex flex-col gap-1">
                      {MENUS.map((m) => {
                        const Icon = m.icon;
                        const active = isActive(m.url);
                        return (
                          <li key={m.url}>
                            <Link
                              href={m.url}
                              aria-current={active ? "page" : undefined}
                              className={[
                                "group relative grid grid-cols-[24px_1fr_auto] items-center gap-3 rounded-xl px-3 py-2.5",
                                "ring-1 ring-transparent transition-all",
                                active
                                  ? "bg-gradient-to-r from-gray-50 to-gray-100 ring-gray-200 dark:from-gray-800 dark:to-gray-800/70 dark:ring-gray-700"
                                  : "hover:bg-gray-50 hover:ring-gray-200 dark:hover:bg-gray-800/60 dark:hover:ring-gray-700",
                              ].join(" ")}
                            >
                              <Icon
                                className={[
                                  "h-5 w-5",
                                  active
                                    ? "text-indigo-600 dark:text-indigo-400"
                                    : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200",
                                ].join(" ")}
                              />
                              <span
                                className={[
                                  "truncate text-sm",
                                  active
                                    ? "font-semibold text-gray-900 dark:text-gray-100"
                                    : "text-gray-700 dark:text-gray-200",
                                ].join(" ")}
                              >
                                {m.title}
                              </span>
                              {m.badge && (
                                <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:text-indigo-300">
                                  {m.badge}
                                </span>
                              )}
                              {active && (
                                <span className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-r-full bg-indigo-500/80" />
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </ScrollArea.Viewport>

                <ScrollArea.Scrollbar
                  orientation="vertical"
                  className="flex touch-none select-none bg-transparent p-0.5"
                >
                  <ScrollArea.Thumb className="flex-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>

              <div className="mt-auto p-3">
                <Separator.Root className="mb-3 h-px bg-gray-200 dark:bg-gray-800" />
                <div className="flex items-center justify-end">
                  <Collapsible.Trigger
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white/90 px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-200 dark:hover:bg-gray-800"
                    aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
                  >
                    {open ? (
                      <>
                        <ChevronLeftIcon className="h-4 w-4" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronRightIcon className="h-4 w-4" />
                        Show
                      </>
                    )}
                  </Collapsible.Trigger>
                </div>
              </div>
            </div>
          </Collapsible.Content>
        )}

        {/* Mini rail (collapsed) with tooltip */}
        {!open && (
          <div className="fixed left-0 top-0 z-40 flex h-screen w-14 flex-col items-center border-r border-gray-200 bg-white/85 py-3 backdrop-blur dark:border-gray-700 dark:bg-gray-900/85 md:flex">
            <Tooltip.Provider delayDuration={200}>
              {MENUS.map((m) => {
                const Icon = m.icon;
                const active = isActive(m.url);
                return (
                  <Tooltip.Root key={m.url}>
                    <Tooltip.Trigger asChild>
                      <Link
                        href={m.url}
                        aria-current={active ? "page" : undefined}
                        className={[
                          "mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl transition",
                          active
                            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200",
                        ].join(" ")}
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="right"
                      sideOffset={8}
                      className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                    >
                      {m.title}
                    </Tooltip.Content>
                  </Tooltip.Root>
                );
              })}
            </Tooltip.Provider>

            <button
              className="mt-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white/90 text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={() => setOpen(true)}
              aria-label="Expand sidebar"
            >
              <HamburgerMenuIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </Collapsible.Root>

      {/* Content */}
      <main
        className={[
          "min-h-screen bg-[#f5f6f8] transition-all",
          open ? "md:ml-64" : "md:ml-14",
        ].join(" ")}
      >
        <div className="px-4 py-4 md:px-6">{children}</div>
      </main>
    </ThemeProvider>
  );
};

export default LayoutComps;
