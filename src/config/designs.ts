export interface DesignConfig {
  id: string;
  name: string;
  image: string;
  textPosition: { x: number; y: number };
  maxFontSize: number;
  minFontSize: number;
  fontFamily: string;
  arabicFontFamily: string;
  textColor: string;
  textShadow?: string;
}

export const designs: DesignConfig[] = [
  {
    id: "sr-eid-1",
    name: "Gradient",
    image: "/designs/sr-eid-1.png",
    // Empty space below hexagon+text (~55%) and above bottom stars (~80%)
    textPosition: { x: 0.5, y: 0.68 },
    maxFontSize: 52,
    minFontSize: 24,
    fontFamily: "Inter, system-ui, sans-serif",
    arabicFontFamily: "Inter, system-ui, sans-serif",
    textColor: "#FFFFFF",
    textShadow: "0 2px 10px rgba(0,0,0,0.4)",
  },
  {
    id: "sr-eid-2",
    name: "Light",
    image: "/designs/sr-eid-2.png",
    // Top empty space — below logo (~8%) and above crescent (~30%)
    textPosition: { x: 0.5, y: 0.20 },
    maxFontSize: 52,
    minFontSize: 24,
    fontFamily: "Inter, system-ui, sans-serif",
    arabicFontFamily: "Inter, system-ui, sans-serif",
    textColor: "#000000",
    textShadow: "none",
  },
];
