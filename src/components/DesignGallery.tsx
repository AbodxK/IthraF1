"use client";

import { useRef } from "react";
import { designs } from "@/config/designs";

interface DesignGalleryProps {
  selectedDesign: string | null;
  onSelect: (id: string) => void;
}

function DesignCard({
  design,
  isSelected,
  onSelect,
  index,
}: {
  design: (typeof designs)[0];
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
  };

  return (
    <button
      ref={cardRef}
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        group relative rounded-2xl overflow-hidden border-2
        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
        animate-fade-in
        transition-[border-color,box-shadow] duration-300
        ${isSelected
          ? "border-primary shadow-lg shadow-primary/30 ring-2 ring-primary/20"
          : "border-border hover:border-primary/40 hover:shadow-xl"
        }
      `}
      style={{ animationDelay: `${index * 0.1}s`, transformStyle: "preserve-3d" }}
    >
      <div className="aspect-[9/16] w-full relative bg-black">
        {/* Actual design image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={design.image}
          alt={design.name}
          className="w-full h-full object-cover"
        />

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Card title */}
      <div className="bg-bg-card px-3 py-2.5 text-center border-t border-border">
        <span className="text-sm font-semibold text-text">{design.name}</span>
      </div>
    </button>
  );
}

export default function DesignGallery({ selectedDesign, onSelect }: DesignGalleryProps) {
  return (
    <div className="w-full max-w-2xl mx-auto relative z-10">
      <h2 className="text-xl font-bold text-text mb-4">Choose a Design</h2>
      <div className="grid grid-cols-2 gap-4">
        {designs.map((design, i) => (
          <DesignCard
            key={design.id}
            design={design}
            isSelected={selectedDesign === design.id}
            onSelect={() => onSelect(design.id)}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
