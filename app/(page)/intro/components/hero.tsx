"use client";

import { m, useReducedMotion } from "framer-motion";

function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative h-screen overflow-hidden mx-auto w-10/12">
      {/* content */}
      <div className="relative z-10 flex h-full items-center justify-between">
        <div className="container">
          <m.h1
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduce ? 0 : 0.15,
              duration: reduce ? 0 : 0.5,
            }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            <span className="bg-gradient-to-r from-white via-sky-50 to-sky-100 bg-clip-text text-transparent">
              Building <br /> delightful UIs
            </span>
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: reduce ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduce ? 0 : 0.25,
              duration: reduce ? 0 : 0.45,
            }}
            className="mt-5 text-sky-50/90"
          >
            Frontend Engineer — React / Next.js / TypeScript
          </m.p>

          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: reduce ? 0 : 0.35,
              duration: reduce ? 0 : 0.4,
            }}
            className="mt-7 flex flex-wrap gap-3"
          >
            {/* Nút nổi bật trên nền xanh */}
          </m.div>
        </div>
        <div className="container text-right">
          <m.h1
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduce ? 0 : 0.15,
              duration: reduce ? 0 : 0.5,
            }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            <span className="bg-gradient-to-r from-white via-sky-50 to-sky-100 bg-clip-text text-transparent">
              Designing <br /> joyful UIs
            </span>
          </m.h1>
          <m.p
            initial={{ opacity: 0, y: reduce ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduce ? 0 : 0.25,
              duration: reduce ? 0 : 0.45,
            }}
            className="mt-5 max-w-xl text-sky-50/90"
          >
            Frontend Engineer — React / Next.js / TypeScript
          </m.p>

          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: reduce ? 0 : 0.35,
              duration: reduce ? 0 : 0.4,
            }}
            className="mt-7 flex flex-wrap gap-3"
          >
            {/* Nút nổi bật trên nền xanh */}
          </m.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
