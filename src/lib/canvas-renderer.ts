import { designs, DesignConfig } from "@/config/designs";

function isArabic(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

export async function renderDesignWithName(
  designId: string,
  name: string
): Promise<Blob | null> {
  const design = designs.find((d) => d.id === designId);
  if (!design) return null;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Default canvas size for placeholder designs
  const width = 1080;
  const height = 1920;
  canvas.width = width;
  canvas.height = height;

  // Try loading the image, fall back to gradient placeholder
  try {
    const img = await loadImage(design.image);
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  } catch {
    // Draw placeholder gradient
    drawPlaceholder(ctx, width, height, design);
  }

  // Draw the name
  const arabic = isArabic(name);
  const fontFamily = arabic ? design.arabicFontFamily : design.fontFamily;
  const textX = canvas.width * design.textPosition.x;
  const textY = canvas.height * design.textPosition.y;

  // Auto-size font
  let fontSize = design.maxFontSize;
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  while (ctx.measureText(name).width > canvas.width * 0.8 && fontSize > design.minFontSize) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (arabic) ctx.direction = "rtl";

  // Text shadow
  if (design.textShadow) {
    const parts = design.textShadow.match(/(-?\d+)px\s+(-?\d+)px\s+(-?\d+)px\s+(.+)/);
    if (parts) {
      ctx.shadowOffsetX = parseInt(parts[1]);
      ctx.shadowOffsetY = parseInt(parts[2]);
      ctx.shadowBlur = parseInt(parts[3]);
      ctx.shadowColor = parts[4];
    }
  }

  ctx.fillStyle = design.textColor;
  ctx.fillText(name, textX, textY);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  design: DesignConfig
) {
  // Gradient background
  const gradients: Record<string, [string, string, string]> = {
    "f1-speed": ["#E10600", "#1E1E1E", "#0D0D0D"],
    "f1-champion": ["#FFD700", "#1E1E1E", "#E10600"],
    "f1-podium": ["#C0C0C0", "#333333", "#FFD700"],
    "f1-night-race": ["#0D0D0D", "#E10600", "#1E1E1E"],
  };

  const colors = gradients[design.id] || ["#1E1E1E", "#333", "#000"];
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, colors[0]);
  grad.addColorStop(0.5, colors[1]);
  grad.addColorStop(1, colors[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Design name
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.font = "bold 120px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(design.name, width / 2, height * 0.3);

  // F1 label
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.font = "bold 200px Inter, sans-serif";
  ctx.fillText("F1", width / 2, height * 0.7);
}

export function downloadBlob(blob: Blob, name: string) {
  const sanitized = name.replace(/[^\w\u0600-\u06FF\s-]/g, "").trim() || "IthraF1";
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `IthraF1-${sanitized}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
