"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

export default function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const color = theme === "dark"
    ? "rgba(233, 30, 144, 0.06)"
    : "rgba(233, 30, 144, 0.04)";

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-[1] -translate-x-1/2 -translate-y-1/2 hidden md:block"
      style={{
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        willChange: "left, top",
      }}
    />
  );
}
