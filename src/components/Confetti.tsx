"use client";

import { useEffect, useRef, useCallback } from "react";

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: "rect" | "circle" | "flag";
  opacity: number;
  gravity: number;
  friction: number;
  wobble: number;
  wobbleSpeed: number;
}

// STEM Racing gradient palette + accents
const COLORS = [
  "#FF6B35", "#E91E90", "#C4167A", "#FF3EA5",
  "#FF6B35", "#E91E90",
  "#FFFFFF", "#FFFFFF",
  "#FFD700",
  "#000000",
];

const PARTICLE_COUNT = 120;
const DURATION = 3500;

export default function Confetti({ active, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startTime = useRef(0);

  const createParticles = useCallback((): Particle[] => {
    const particles: Particle[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return particles;

    const cx = canvas.width / 2;
    const cy = canvas.height * 0.35;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 4 + Math.random() * 10;
      const shapes: Particle["shape"][] = ["rect", "circle", "flag"];

      particles.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * velocity * (0.6 + Math.random() * 0.8),
        vy: Math.sin(angle) * velocity * 0.9 - Math.random() * 6,
        size: 4 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        opacity: 1,
        gravity: 0.12 + Math.random() * 0.08,
        friction: 0.98,
        wobble: Math.random() * 10,
        wobbleSpeed: 0.03 + Math.random() * 0.05,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = createParticles();
    startTime.current = performance.now();

    function drawCheckeredFlag(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
      const s = size / 2;
      ctx.fillStyle = "#000";
      ctx.fillRect(x - s, y - s, s, s);
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = "#FFF";
      ctx.fillRect(x, y - s, s, s);
      ctx.fillRect(x - s, y, s, s);
    }

    function animate() {
      if (!ctx || !canvas) return;
      const elapsed = performance.now() - startTime.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;

      for (const p of particles) {
        p.vy += p.gravity;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.x += p.vx + Math.sin(p.wobble) * 0.5;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;

        if (elapsed > DURATION * 0.7) {
          p.opacity = Math.max(0, 1 - (elapsed - DURATION * 0.7) / (DURATION * 0.3));
        }

        if (p.opacity <= 0 || p.y > canvas.height + 50) continue;
        alive++;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.shape === "rect") {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === "circle") {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawCheckeredFlag(ctx, 0, 0, p.size);
        }

        ctx.restore();
      }

      if (alive > 0 && elapsed < DURATION) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onComplete?.();
      }
    }

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [active, createParticles, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      aria-hidden="true"
    />
  );
}
