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
    name: "Crescent Moon",
    image: "/designs/sr-eid-1.png",
    // Name goes in the empty space below "Eid Mubarak" text (~65% down)
    textPosition: { x: 0.5, y: 0.65 },
    maxFontSize: 52,
    minFontSize: 24,
    fontFamily: "Inter, system-ui, sans-serif",
    arabicFontFamily: "Inter, system-ui, sans-serif",
    textColor: "#FFFFFF",
    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
  },
  {
    id: "sr-eid-2",
    name: "Hexagon",
    image: "/designs/sr-eid-2.png",
    // Name goes below the hexagon shape (~62% down)
    textPosition: { x: 0.5, y: 0.62 },
    maxFontSize: 52,
    minFontSize: 24,
    fontFamily: "Inter, system-ui, sans-serif",
    arabicFontFamily: "Inter, system-ui, sans-serif",
    textColor: "#FFFFFF",
    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
  },
  {
    id: "sr-eid-3",
    name: "Dark Moon",
    image: "/designs/sr-eid-3.png",
    // Name goes in the empty space below "Eid Mubarak" text (~62% down)
    textPosition: { x: 0.5, y: 0.62 },
    maxFontSize: 52,
    minFontSize: 24,
    fontFamily: "Inter, system-ui, sans-serif",
    arabicFontFamily: "Inter, system-ui, sans-serif",
    textColor: "#FFFFFF",
    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
  },
];
