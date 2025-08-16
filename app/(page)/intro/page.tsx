"use client";
import React, { useMemo } from "react";
import Projects from "./components/project";
import Hero from "./components/hero";
import Section from "./components/section";
import Image from "next/image";
import ServicesCards from "./components/services";
import ProjectsIconSection from "./components/result";
import ModelViewer from "./components/View3D";
import CokeScrollViewer from "./components/coca3d";
import { Box } from "@radix-ui/themes";
const projects = [
  {
    id: "p1",
    title: "SaaS Dashboard",
    desc: "Analytics dashboard",
    href: "/projects/saas",
  },
  {
    id: "p2",
    title: "3D Landing",
    desc: "WebGL hero with R3F & parallax",
    href: "/projects/3d",
  },
  {
    id: "p3",
    title: "E-commerce UI",
    desc: "Headless cart, filters & checkout",
    href: "/projects/shop",
  },
];

function HomePage() {
  const BuildCoke = useMemo(() => <CokeScrollViewer />, []);
  return (
    <main className="bg-gradient-to-br from-sky-400 via-sky-500 to-blue-700 relative z-20">
      <Box className="fixed z-0">{BuildCoke}</Box>
      <Box className="z-20 relative">
        <Hero />

        <Section className="relative container bg-white rounded-2xl shadow-sm p-8 mx-auto w-10/12 overflow-hidden">
          {/* title */}
          <h2
            className="text-2xl md:text-3xl font-bold inline-block px-4 py-2 rounded-lg 
               text-white 
               bg-gradient-to-br from-sky-400 via-sky-500 to-blue-700 
               shadow-md"
          >
            About
          </h2>

          {/* text */}
          <p className="mt-5 max-w-2xl text-gray-700 relative z-10">
            I’m a frontend engineer focusing on{" "}
            <span className="font-semibold text-sky-600">React/Next.js</span>,{" "}
            <span className="font-semibold text-sky-600">TypeScript</span>, and{" "}
            delightful <span className="font-semibold text-sky-600">UI/UX</span>{" "}
            .
          </p>

          {/* image ở góc phải */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block">
            <Image
              src="/images/prod-10.png"
              alt="About illustration"
              width={250} // 48 x 4 = 250px
              height={250}
              className="object-cover "
              priority
            />
          </div>
        </Section>

        <Section className="container w-10/12 mx-auto">
          <div className="mb-6 flex flex-col items-center justify-between">
            {/* title */}
            <h2
              className="text-2xl md:text-3xl font-bold inline-block px-4 py-2 rounded-lg 
               text-white 
               bg-gradient-to-br from-sky-400 via-sky-500 to-blue-700 
               shadow-md"
            >
              Services we provide
            </h2>
          </div>
          <Projects data={projects} />
          <ModelViewer
            url="/model3d/planets.glb"
            dracoDecoder="https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
          />
        </Section>
        <Section className="mx-auto w-10/12 mb-24">
          <ServicesCards />
        </Section>
        <Section className="mx-auto w-10/12">
          <ProjectsIconSection />
        </Section>
        <Section id="contact" className="container mx-auto w-10/12">
          {/* gradient-border card */}
          <div className="relative rounded-3xl bg-gradient-to-br from-sky-300 via-sky-500 to-blue-700">
            <div className="rounded-3xl bg-white p-8 md:p-10 shadow-lg">
              {/* heading */}
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-700 to-blue-600 bg-clip-text text-transparent">
                Contact
              </h2>

              {/* copy */}
              <p className="mt-3 text-slate-700">
                Want to build something together? Email me at{" "}
                <a
                  className="underline decoration-sky-400 underline-offset-4 hover:text-sky-700 transition"
                  href="mailto:hi@kiet.dev"
                >
                  hi@kiet.dev
                </a>{" "}
                .
              </p>

              {/* actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="mailto:hi@kiet.dev"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-2.5
                     font-medium text-white
                     bg-gradient-to-r from-sky-500 to-blue-600
                     hover:from-sky-400 hover:to-blue-500
                     shadow-sm shadow-sky-200 transition"
                >
                  Email me
                </a>

                <a
                  href="#projects"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-2.5
                     font-medium
                     text-sky-700 border border-sky-200 bg-sky-50
                     hover:bg-sky-100 hover:border-sky-300 transition"
                >
                  View projects
                </a>
              </div>
            </div>
          </div>
        </Section>
      </Box>
    </main>
  );
}

export default HomePage;
