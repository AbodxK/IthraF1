"use client";

interface PopCounterProps {
  count: number;
}

export default function PopCounter({ count }: PopCounterProps) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[50] flex items-center gap-2 bg-bg-card/90 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg">
      <span className="text-lg">🏎️</span>
      <span className="text-sm font-bold text-text">{count}</span>
      <span className="text-xs text-text-muted">launched!</span>
    </div>
  );
}
