import React, { forwardRef, useEffect, useRef } from "react";
import { FiCheck } from "react-icons/fi";
import { InputENProps } from "./types";

const InputEN = forwardRef<HTMLInputElement, InputENProps>(function InputEN(
  { hidden, label },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inputElement = inputRef.current;
    if (!inputElement) return;

    const handleInput = () => {
      const value = inputElement.value;
      if (divRef.current && value) {
        const isCorrect = label.toLowerCase().includes(value.toLowerCase());
        divRef.current.style.visibility = isCorrect ? "visible" : "hidden";
      }
    };

    inputElement.addEventListener("input", handleInput);
    inputElement.addEventListener("change", handleInput);

    return () => {
      inputElement.removeEventListener("input", handleInput);
      inputElement.removeEventListener("change", handleInput);
    };
  }, [label]);

  return (
    <div className="flex gap-2 items-center">
      <label
        className="whitespace-nowrap"
        style={{
          display: hidden ? "none" : "block",
        }}
        aria-label={label}
      >
        {label}
      </label>
      <input
        ref={inputRef}
        className="px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name={label}
        style={{
          display: !hidden ? "none" : "block",
        }}
        id={label}
        placeholder="Type the answer..."
        aria-label={`Input field for: ${label}`}
      />
      <div
        ref={divRef}
        className="invisible transition-opacity duration-200"
        aria-label="Correct answer indicator"
      >
        <FiCheck size={24} color="green" />
      </div>
    </div>
  );
});

InputEN.displayName = "InputEN";

export default InputEN;
