"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "./ThemeProvider";
import { playTireScreech } from "@/lib/tire-sound";

const CAR_COUNT = 8;

// F1 car SVG — always faces right, container handles direction
function F1CarSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={size * 0.35}
      viewBox="0 0 120 42"
      fill="none"
    >
      {/* Body */}
      <path d="M10 28 Q5 28 5 24 L8 20 Q12 14 25 14 L60 12 Q75 10 90 12 L105 14 Q115 16 115 22 L115 26 Q115 28 110 28 Z" fill={color} />
      {/* Cockpit */}
      <path d="M45 14 Q50 8 60 8 Q70 8 72 14 Z" fill="rgba(0,0,0,0.6)" />
      {/* Front wing */}
      <path d="M5 24 L2 22 L2 26 L5 28 Z" fill={color} opacity="0.8" />
      {/* Rear wing */}
      <rect x="108" y="10" width="4" height="6" rx="1" fill={color} opacity="0.9" />
      <rect x="106" y="8" width="10" height="3" rx="1" fill={color} />
      {/* Front wheel */}
      <circle cx="25" cy="30" r="8" fill="#222" />
      <circle cx="25" cy="30" r="5" fill="#444" />
      <circle cx="25" cy="30" r="2" fill="#666" />
      {/* Rear wheel */}
      <circle cx="95" cy="30" r="9" fill="#222" />
      <circle cx="95" cy="30" r="6" fill="#444" />
      <circle cx="95" cy="30" r="2.5" fill="#666" />
      {/* Number */}
      <text x="60" y="24" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" fontFamily="sans-serif">F1</text>
    </svg>
  );
}

const carColors = [
  "#FF6B35", // STEM Racing orange
  "#E91E90", // STEM Racing pink
  "#C4167A", // STEM Racing magenta
  "#FF3EA5", // Light pink
  "#FF8C42", // Warm orange
  "#D63384", // Deep pink
  "#B6BABD", // Silver
  "#FFFFFF", // White
];

interface PhysicsCar {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  colorIndex: number;
  facingRight: boolean;
  alive: boolean;
  launching: boolean;
  launchVx: number;
  launchVy: number;
  opacity: number;
  entering: boolean;
}

function randomCar(id: number, entering = false): PhysicsCar {
  const w = typeof window !== "undefined" ? window.innerWidth : 1200;
  const h = typeof window !== "undefined" ? window.innerHeight : 800;
  const isMobile = w < 768;
  const size = isMobile ? 50 + Math.random() * 30 : 70 + Math.random() * 50;

  const speed = 0.3 + Math.random() * 0.5;
  const angle = Math.random() * Math.PI * 2;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed * 0.3;

  let x: number, y: number;
  if (entering) {
    const edge = Math.floor(Math.random() * 2);
    if (edge === 0) {
      x = -size;
      y = 50 + Math.random() * (h - 150);
    } else {
      x = w + size;
      y = 50 + Math.random() * (h - 150);
    }
  } else {
    x = size + Math.random() * (w - size * 2);
    y = 50 + Math.random() * (h - 150);
  }

  const initialVx = entering ? (x < 0 ? Math.abs(speed) : -Math.abs(speed)) : vx;

  return {
    id,
    x,
    y,
    vx: initialVx,
    vy,
    size,
    colorIndex: Math.floor(Math.random() * carColors.length),
    facingRight: initialVx >= 0,
    alive: true,
    launching: false,
    launchVx: 0,
    launchVy: 0,
    opacity: entering ? 0 : 0.5,
    entering,
  };
}

function LaunchTrail({ x, y, facingRight }: { x: number; y: number; facingRight: boolean }) {
  const lines = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    length: 30 + Math.random() * 40,
    offset: i * 6 - 12,
    delay: Math.random() * 0.1,
  }));

  const dir = facingRight ? 1 : -1;

  return (
    <div className="fixed pointer-events-none z-30" style={{ left: x, top: y }}>
      {lines.map((l) => (
        <div
          key={l.id}
          className="absolute animate-pop-fragment"
          style={{
            width: l.length,
            height: 2,
            backgroundColor: "#E91E90",
            opacity: 0.6,
            transform: `translateY(${l.offset}px)`,
            ["--tx" as string]: `${-dir * 60}px`,
            ["--ty" as string]: `${l.offset * 0.3}px`,
            animationDelay: `${l.delay}s`,
          }}
        />
      ))}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-pop-flash"
        style={{
          width: 50,
          height: 50,
          background: "radial-gradient(circle, rgba(233,30,144,0.4) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

interface FloatingCarsProps {
  onLaunch?: () => void;
}

export default function FloatingCars({ onLaunch }: FloatingCarsProps) {
  const { theme } = useTheme();
  const carsRef = useRef<PhysicsCar[]>([]);
  const [renderCars, setRenderCars] = useState<PhysicsCar[]>([]);
  const [trails, setTrails] = useState<Array<{ id: number; x: number; y: number; facingRight: boolean }>>([]);
  const animRef = useRef<number>(0);
  const nextId = useRef(CAR_COUNT);

  useEffect(() => {
    carsRef.current = Array.from({ length: CAR_COUNT }, (_, i) => randomCar(i));
    setRenderCars([...carsRef.current]);
  }, []);

  useEffect(() => {
    let frameCount = 0;

    function tick() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      for (const c of carsRef.current) {
        if (!c.alive || c.launching) continue;

        if (c.entering) {
          c.opacity = Math.min(0.5, c.opacity + 0.008);
          if (c.opacity >= 0.5) c.entering = false;
        }

        c.x += c.vx;
        c.y += c.vy;

        // Update facing direction based on horizontal velocity
        if (Math.abs(c.vx) > 0.05) {
          c.facingRight = c.vx > 0;
        }

        // Bounce off edges
        if (c.x < -20) c.vx = Math.abs(c.vx);
        if (c.x > w + 20) c.vx = -Math.abs(c.vx);
        if (c.y < 30) c.vy = Math.abs(c.vy);
        if (c.y > h - 50) c.vy = -Math.abs(c.vy);

        // Random direction shifts
        if (Math.random() < 0.003) {
          c.vx += (Math.random() - 0.5) * 0.2;
          c.vy += (Math.random() - 0.5) * 0.1;
        }

        // Speed limit
        const speed = Math.sqrt(c.vx * c.vx + c.vy * c.vy);
        const maxSpeed = 0.8;
        if (speed > maxSpeed) {
          c.vx = (c.vx / speed) * maxSpeed;
          c.vy = (c.vy / speed) * maxSpeed;
        }
      }

      frameCount++;
      if (frameCount % 2 === 0) {
        setRenderCars(
          carsRef.current.filter((c) => c.alive).map((c) => ({ ...c }))
        );
      }

      animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleLaunch = useCallback(
    (id: number, e: React.MouseEvent) => {
      const car = carsRef.current.find((c) => c.id === id);
      if (!car || !car.alive || car.launching) return;

      car.launching = true;
      onLaunch?.();
      playTireScreech();

      // Launch in facing direction
      const speed = 30;
      const dir = car.facingRight ? 1 : -1;
      car.launchVx = dir * speed;
      car.launchVy = car.vy * 3;

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const trailId = Date.now() + id;
      setTrails((prev) => [...prev, { id: trailId, x: cx, y: cy, facingRight: car.facingRight }]);

      // Animate the launch
      let frame = 0;
      const launchTick = () => {
        frame++;
        car.x += car.launchVx;
        car.y += car.launchVy;
        car.opacity = Math.max(0, car.opacity - 0.03);
        if (frame < 30) {
          requestAnimationFrame(launchTick);
        } else {
          car.alive = false;
        }
      };
      requestAnimationFrame(launchTick);

      setTimeout(() => setTrails((prev) => prev.filter((t) => t.id !== trailId)), 600);

      // Spawn new car after delay
      setTimeout(() => {
        const newCar = randomCar(nextId.current++, true);
        carsRef.current.push(newCar);
      }, 1500 + Math.random() * 1500);
    },
    [onLaunch]
  );

  return (
    <>
      <div className="fixed inset-0 overflow-hidden z-[15] pointer-events-none" aria-hidden="true">
        {renderCars.map((car) => (
          <div
            key={car.id}
            className="absolute"
            style={{
              left: car.x,
              top: car.y,
              opacity: car.opacity,
              pointerEvents: "auto",
              willChange: "left, top, opacity",
              // Only flip horizontally — no rotation, no upside down
              transform: car.facingRight ? "scaleX(1)" : "scaleX(-1)",
            }}
          >
            <div
              onClick={(e) => handleLaunch(car.id, e)}
              className={`cursor-pointer hover:opacity-80 active:scale-95 transition-transform duration-100 ${car.launching ? "animate-car-launch" : ""}`}
            >
              <F1CarSVG
                color={carColors[car.colorIndex]}
                size={car.size}
              />
            </div>
          </div>
        ))}
      </div>

      {trails.map((trail) => (
        <LaunchTrail key={trail.id} x={trail.x} y={trail.y} facingRight={trail.facingRight} />
      ))}
    </>
  );
}
