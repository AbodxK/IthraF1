"use client";

import { useState } from "react";

interface DownloadButtonProps {
  disabled: boolean;
  onDownload: () => Promise<void>;
}

export default function DownloadButton({ disabled, onDownload }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || loading) return;
    setLoading(true);
    try {
      await onDownload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10">
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className={`
          px-8 py-4 rounded-xl font-bold text-lg tracking-wide
          transition-all duration-300
          ${disabled
            ? "bg-border text-text-muted cursor-not-allowed"
            : loading
              ? "bg-primary/80 text-white cursor-wait"
              : "bg-primary text-white hover:bg-primary-light hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95 animate-rev-pulse"
          }
        `}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Card
          </span>
        )}
      </button>
    </div>
  );
}
