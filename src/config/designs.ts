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
    // Empty space between arabic text (~48%) and logo (~90%)
    textPosition: { x: 0.5, y: 0.72 },
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
    // Empty space below hexagon shape (~50%) before bottom
    textPosition: { x: 0.5, y: 0.68 },
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
    // Empty space below "Eid Mubarak" text (~58%) before bottom
    textPosition: { x: 0.5, y: 0.73 },
    maxFontSize: 52,
    minFontSize: 24,
    fontFamily: "Inter, system-ui, sans-serif",
    arabicFontFamily: "Inter, system-ui, sans-serif",
    textColor: "#FFFFFF",
    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
  },
];
