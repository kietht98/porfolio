// app/ClientComponent.tsx
"use client";

import { useEffect } from "react";
import { useStore } from "../store/useStore";
import Image from "next/image";

interface ClientComponentProps {
  initialTheme: string;
}

const ClientComponent: React.FC<ClientComponentProps> = ({ initialTheme }) => {
  const { theme, setTheme } = useStore();

  // Hydrate Zustand store with initial state from SSR
  useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme, setTheme]);

  return (
    <div>
      <p>Current theme: {theme}</p>
      <Image src={""} alt="" />
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
    </div>
  );
};

export default ClientComponent;
