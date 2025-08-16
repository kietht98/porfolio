"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Collapsible from "@radix-ui/react-collapsible";
import { HamburgerMenuIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { ThemeContext } from "@/app/context/Theme";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Company",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Library", href: "/library" },
      { label: "Resources", href: "/resources" },
      { label: "Blog", href: "/blog" },
      { label: "Newsletter", href: "/newsletter" },
      { label: "Playground", href: "/playground" },
      { label: "License", href: "/license" },
      { label: "Contact", href: "/contact" },
      { label: "Support", href: "/support" },
      { label: "Terms", href: "/terms" },
    ],
  },
  { label: "Team", href: "/team" },
];

export default function NavBar() {
  const context = useContext(ThemeContext);
  const [open, setOpen] = useState(false);

  const bg = context?.config?.color ?? "#ffffff";
  const isDarkBg = bg.toLowerCase() === "#000000";
  const fg = isDarkBg ? "#ffffff" : undefined;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 shadow-sm bg-inherit">
      <div className="mx-auto w-10/12 flex max-w-screen-xl items-center justify-between py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          <span className="text-lg font-semibold tracking-tight">Flowbite</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <NavigationMenu.Root className="relative">
            <NavigationMenu.List className="flex items-center gap-4">
              {navItems.map((item) =>
                item.children ? (
                  <NavigationMenu.Item key={item.label} className="relative">
                    <NavigationMenu.Trigger
                      className={[
                        "inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium",
                        "text-black hover:bg-gray-100 hover:text-gray-900",
                        "dark:text-black dark:hover:bg-gray-800 dark:hover:text-gray-50",
                        "data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-800",
                      ].join(" ")}
                      style={{ color: fg }}
                    >
                      {item.label}
                      <ChevronDownIcon
                        className="h-4 w-4 transition-transform data-[state=open]:rotate-180"
                        aria-hidden
                      />
                    </NavigationMenu.Trigger>

                    {/* Content stays inside Item (no Portal) */}
                    <NavigationMenu.Content
                      // Viewport sẽ đo và đặt khối này
                      className={[
                        "rounded-xl border border-gray-200 bg-white p-3 shadow-lg",
                        "dark:border-gray-700 dark:bg-gray-900",
                        "w-[min(90vw,640px)]", // chiều rộng khối menu
                      ].join(" ")}
                    >
                      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <NavigationMenu.Link asChild>
                              <Link
                                href={c.href}
                                className="block rounded-lg px-3 py-2 text-sm text-black transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                              >
                                {c.label}
                              </Link>
                            </NavigationMenu.Link>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                ) : (
                  <NavigationMenu.Item key={item.label}>
                    <NavigationMenu.Link asChild>
                      <Link
                        href={item.href!}
                        className="rounded-lg px-2 py-1.5 text-sm font-medium text-black transition hover:bg-gray-100 hover:text-gray-900 dark:text-black dark:hover:bg-gray-800 dark:hover:text-gray-50"
                        style={{ color: fg }}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                )
              )}
            </NavigationMenu.List>

            {/* Optional underline indicator */}
            <NavigationMenu.Indicator className="absolute left-0 top-full z-10 mt-1 h-1 w-[var(--radix-navigation-menu-viewport-width)] rounded-full bg-indigo-500 transition-[width,transform] data-[state=hidden]:opacity-0" />

            {/* Viewport: bắt buộc có, một cái duy nhất */}
            <NavigationMenu.Viewport
              className={[
                "absolute left-0 top-[calc(100%+0.5rem)] z-20",
                "origin-[top_left] rounded-xl border border-gray-200 bg-white p-0 shadow-xl",
                "dark:border-gray-700 dark:bg-gray-900",
                // Radix set CSS vars để khớp size content
                "w-[var(--radix-navigation-menu-viewport-width)]",
                "h-[var(--radix-navigation-menu-viewport-height)]",
                // simple fade
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              ].join(" ")}
            />
          </NavigationMenu.Root>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <Collapsible.Root open={open} onOpenChange={setOpen}>
            <Collapsible.Trigger
              aria-label="Menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <HamburgerMenuIcon className="h-5 w-5" />
            </Collapsible.Trigger>
            <Collapsible.Content forceMount>
              <div className="absolute left-0 top-full w-full border-b border-gray-200 bg-white p-3 shadow-md dark:border-gray-700 dark:bg-gray-900">
                <ul className="space-y-1">
                  {navItems.map((item) =>
                    item.children ? (
                      <li key={item.label}>
                        <details className="rounded-lg">
                          <summary className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                            {item.label}
                          </summary>
                          <ul className="mt-1 space-y-1 pl-3">
                            {item.children.map((c) => (
                              <li key={c.href}>
                                <Link
                                  href={c.href}
                                  className="block rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                                  onClick={() => setOpen(false)}
                                >
                                  {c.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </li>
                    ) : (
                      <li key={item.label}>
                        <Link
                          href={item.href!}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    )
                  )}
                  <li className="mt-2 flex gap-2">
                    <Link
                      href="/login"
                      className="flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
                      onClick={() => setOpen(false)}
                    >
                      Sign up
                    </Link>
                  </li>
                </ul>
              </div>
            </Collapsible.Content>
          </Collapsible.Root>
        </div>
      </div>
    </nav>
  );
}
