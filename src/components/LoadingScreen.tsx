"use client";

import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [lightsOn, setLightsOn] = useState(0);
  const [goPhase, setGoPhase] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 1; i <= 5; i++) {
      timers.push(setTimeout(() => setLightsOn(i), i * 500));
    }

    timers.push(setTimeout(() => {
      setGoPhase(true);
      setLightsOn(0);
    }, 3200));

    timers.push(setTimeout(() => setFadeOut(true), 3800));
    timers.push(setTimeout(onComplete, 4400));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0A0A0A] transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      <div className="mb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #FF6B35, #E91E90, #C4167A)" }}
          >
            STEM Racing
          </span>
        </h1>
        <p className="mt-3 text-white/50 text-sm tracking-widest uppercase">Eid Mubarak</p>
      </div>

      {/* Start lights */}
      <div className="flex gap-4 md:gap-6 mb-12">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-10 h-10 md:w-14 md:h-14 rounded-full transition-all duration-300"
            style={{
              backgroundColor: goPhase ? "#333" : lightsOn >= i ? "#E91E90" : "#333",
              boxShadow: !goPhase && lightsOn >= i
                ? "0 0 20px #E91E90, 0 0 40px rgba(233,30,144,0.4)"
                : "none",
            }}
          />
        ))}
      </div>

      {goPhase && (
        <div className="text-4xl md:text-6xl font-extrabold text-[#00D200] animate-fade-in tracking-widest">
          GO!
        </div>
      )}

      {/* Gradient stripe at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2"
        style={{ background: "linear-gradient(90deg, #FF6B35, #E91E90, #C4167A)" }}
      />
    </div>
  );
}
