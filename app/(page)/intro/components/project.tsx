"use client";

import { Card } from "@radix-ui/themes";
import { m } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

type Project = { id: string; title: string; desc: string; href?: string };

function Projects({ data }: { data: Project[] }) {
  return (
    <section className="mb-6 relative rounded-3xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-700 p-10">
      {/* glow background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10
    [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"
      >
        <div
          className="absolute inset-x-0 top-[-10%] h-[40rem] blur-3xl
      bg-gradient-to-b from-sky-300/40 via-sky-400/20 to-transparent"
        />
      </div>

      <m.div
        id="projects"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {data?.map?.((p) => (
          <m.a
            key={p.id}
            variants={item}
            href={p.href ?? "#"}
            className="group block"
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* gradient border wrapper */}
            <div
              className="relative rounded-2xl
          bg-gradient-to-br from-sky-300 via-sky-400 to-blue-500
          group-hover:from-sky-200 group-hover:via-sky-300 group-hover:to-blue-400
          transition-colors duration-300"
            >
              <Card
                className="rounded-2xl border border-sky-100 bg-white 
               shadow-sky-300/20 group-hover:shadow-sky-400/30 transition
              p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="text-lg font-semibold tracking-tight
                bg-gradient-to-r from-sky-700 to-sky-500 bg-clip-text text-transparent"
                  >
                    {p.title}
                  </h3>
                  <FiArrowUpRight
                    className="size-4 text-sky-500 opacity-60 group-hover:opacity-100 transition"
                    aria-hidden
                  />
                </div>

                <p className="mt-2 text-sm text-sky-700/80">{p.desc}</p>

                {/* subtle shine on hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl
              opacity-0 group-hover:opacity-100 transition
              bg-[radial-gradient(120px_60px_at_80%_0%,rgba(255,255,255,0.12),transparent_60%)]"
                />
              </Card>
            </div>
          </m.a>
        ))}
      </m.div>
    </section>
  );
}

export default Projects;
