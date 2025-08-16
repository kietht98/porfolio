import { ThemeContext } from "@/app/context/Theme";
import Image from "next/image";
import React, { useContext } from "react";

const Footer = () => {
  const context = useContext(ThemeContext);

  return (
    <footer className="bg-gradient-to-br from-sky-400 via-sky-500 to-blue-700 text-white">
      <div className="mx-auto w-10/12 max-w-screen-xl py-8 lg:py-10">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0 flex items-center">
            <a href="/" className="flex items-center">
              <Image
                width={48}
                height={48}
                src="/logo.svg"
                alt="Logo"
                className="me-3"
              />
              <span className="self-center text-2xl font-bold whitespace-nowrap">
                YourBrand
              </span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase text-sky-50">
                Resources
              </h2>
              <ul className="space-y-2 text-sky-100/90">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Flowbite
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Tailwind CSS
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase text-sky-50">
                Follow us
              </h2>
              <ul className="space-y-2 text-sky-100/90">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Github
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Discord
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase text-sky-50">
                Legal
              </h2>
              <ul className="space-y-2 text-sky-100/90">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-6 border-sky-200/40 sm:mx-auto lg:my-8" />

        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-sky-100/90">
            © {new Date().getFullYear()}{" "}
            <a href="/" className="hover:underline text-white font-semibold">
              YourBrand
            </a>{" "}
            . All Rights Reserved.
          </span>

          <div className="flex mt-4 sm:justify-center sm:mt-0 gap-5">
            {["facebook", "discord", "twitter", "github", "dribbble"].map(
              (icon) => (
                <a
                  key={icon}
                  href="#"
                  className="text-sky-100/80 hover:text-white transition"
                >
                  <span className="sr-only">{icon}</span>
                  {/* Bro có thể thay bằng react-icons hoặc lucide-react */}
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <circle cx="10" cy="10" r="10" />
                  </svg>
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
