"use client";

import { useState, useCallback } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import Header from "@/components/Header";
import NameInput from "@/components/NameInput";
import DesignGallery from "@/components/DesignGallery";
import DownloadButton from "@/components/DownloadButton";
import FloatingCars from "@/components/FloatingCars";
import LoadingScreen from "@/components/LoadingScreen";
import Confetti from "@/components/Confetti";
import Toast from "@/components/Toast";
import MouseGlow from "@/components/MouseGlow";
import PopCounter from "@/components/PopCounter";
import ScrollReveal from "@/components/ScrollReveal";
import { renderDesignWithName, downloadBlob } from "@/lib/canvas-renderer";
import { incrementDownloads } from "@/lib/download-stats";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [launchCount, setLaunchCount] = useState(0);

  const handleLoadComplete = useCallback(() => setLoading(false), []);

  const handleDownload = async () => {
    if (!name.trim() || !selectedDesign) return;

    const blob = await renderDesignWithName(selectedDesign, name.trim());
    if (blob) {
      downloadBlob(blob, name.trim());
      incrementDownloads();
      setShowConfetti(true);
      setShowToast(true);
    }
  };

  const handleLaunch = useCallback(() => {
    setLaunchCount((prev) => prev + 1);
  }, []);

  return (
    <ThemeProvider>
      {loading && <LoadingScreen onComplete={handleLoadComplete} />}

      <MouseGlow />
      <FloatingCars onLaunch={handleLaunch} />
      <ThemeToggle />
      <PopCounter count={launchCount} />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-6 gap-10 pointer-events-none">
        <div className="pointer-events-auto">
          <ScrollReveal direction="down" delay={0}>
            <Header />
          </ScrollReveal>
        </div>

        <div className="pointer-events-auto w-full flex justify-center">
          <ScrollReveal direction="up" delay={0.1}>
            <NameInput value={name} onChange={setName} />
          </ScrollReveal>
        </div>

        <div className="pointer-events-auto w-full">
          <ScrollReveal direction="up" delay={0.2}>
            <DesignGallery
              selectedDesign={selectedDesign}
              onSelect={setSelectedDesign}
            />
          </ScrollReveal>
        </div>

        <div className="pointer-events-auto">
          <ScrollReveal direction="up" delay={0.3}>
            <DownloadButton
              disabled={!name.trim() || !selectedDesign}
              onDownload={handleDownload}
            />
          </ScrollReveal>
        </div>
      </div>

      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      <Toast
        message="Card downloaded! 🏁"
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </ThemeProvider>
  );
}
