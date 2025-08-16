import { useEffect } from "react";

interface UseKeyboardShortcutsProps {
  onToggleEn: () => void;
  onToggleVn: () => void;
}

export const useKeyboardShortcuts = ({
  onToggleEn,
  onToggleVn,
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === "1") {
        e.preventDefault();
        onToggleEn();
      }

      if (key === "2") {
        e.preventDefault();
        onToggleVn();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onToggleEn, onToggleVn]);
};
