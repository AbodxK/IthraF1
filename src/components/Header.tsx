"use client";

export default function Header() {
  return (
    <header className="text-center pt-10 pb-4 relative z-10">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(135deg, #FF6B35, #E91E90, #C4167A)" }}
        >
          STEM Racing
        </span>
      </h1>
      <p className="mt-2 text-text-muted text-sm md:text-base tracking-widest uppercase">
        Eid Mubarak
      </p>
    </header>
  );
}
