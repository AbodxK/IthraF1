"use client";

import { useState, useEffect } from "react";

interface NameInputProps {
  value: string;
  onChange: (val: string) => void;
}

const placeholders = [
  "Type your name here...",
  "اكتب اسمك هنا...",
  "Enter your name...",
  "أدخل اسمك...",
];

export default function NameInput({ value, onChange }: NameInputProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto relative z-10">
      <label className="block text-sm font-semibold text-text mb-2 tracking-wide">
        Your Name <span className="text-text-muted font-normal">(English or Arabic)</span>
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholders[placeholderIndex]}
          maxLength={40}
          className={`
            w-full px-5 py-4 rounded-xl text-lg
            bg-bg-card border-2 text-text
            placeholder:text-text-muted/50
            outline-none transition-all duration-300
            ${isFocused
              ? "border-primary shadow-lg shadow-primary/10"
              : "border-border hover:border-primary/40"
            }
          `}
          dir="auto"
        />
        {/* Racing stripe accent */}
        <div className={`absolute bottom-0 left-0 h-[3px] bg-primary rounded-b-xl transition-all duration-500 ${isFocused ? "w-full" : "w-0"}`} />
      </div>
    </div>
  );
}
