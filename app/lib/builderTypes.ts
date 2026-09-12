// Shared types + constants for the drag-and-drop website builder.

export const DESIGN_WIDTH = 1080; // design-space width in px; live view scales to viewport

export type ElementType = "text" | "button" | "image" | "box";

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number; // design-space px
  y: number;
  w: number;
  h: number;
  rotation: number; // degrees
  z: number;
  props: Record<string, any>;
}

export interface SiteDoc {
  uid: string;
  slug: string;
  title: string;
  bgColor: string;
  bgStyle: string; // reuses subdomain-bg.css classes, or "none"
  bgImageUrl: string;
  canvasHeight: number; // design-space px
  elements: CanvasElement[];
  updatedAt: string;
}

// Background styles reused from the existing profile system (subdomain-bg.css).
export const BG_STYLES: { value: string; label: string }[] = [
  { value: "none", label: "Solid Color Only" },
  { value: "bg-grid", label: "Grid & Glow" },
  { value: "bg-aurora", label: "Aurora Borealis" },
  { value: "bg-cyber", label: "Cyberpunk Grid" },
  { value: "bg-stars", label: "Starlight Space" },
  { value: "bg-holo", label: "Holographic Scanlines" },
  { value: "bg-glass-orbs", label: "Frosted Glass Orbs" },
  { value: "bg-mesh", label: "Gradient Mesh" },
  { value: "bg-matrix", label: "Digital Rain" },
  { value: "bg-vapor", label: "Vaporwave Sunset" },
  { value: "bg-topo", label: "Topographic Lines" },
  { value: "bg-bokeh", label: "Floating Bokeh" },
  { value: "bg-liquid", label: "Liquid Chrome" },
  { value: "bg-nebula", label: "Cosmic Nebula" },
  { value: "bg-plasma", label: "Plasma Field" },
  { value: "bg-circuit", label: "Circuit Board" },
  { value: "custom", label: "Custom Image" },
];

// Font choices come from the shared font library (see ./fonts).
export { FONT_FAMILIES } from "./fonts";
import { FONT_FAMILIES } from "./fonts";

let counter = 0;
function uid() {
  counter += 1;
  return `el_${Date.now().toString(36)}_${counter}`;
}

// Factory: sensible defaults per element type so a freshly added block looks good.
export function createElement(type: ElementType, topZ: number): CanvasElement {
  const base = { id: uid(), type, rotation: 0, z: topZ + 1 } as CanvasElement;
  switch (type) {
    case "text":
      return {
        ...base,
        x: 240, y: 120, w: 600, h: 90,
        props: {
          content: "Your heading here",
          fontSize: 56,
          color: "#ffffff",
          fontWeight: 800,
          align: "center",
          fontFamily: FONT_FAMILIES[0].value,
          lineHeight: 1.1,
          letterSpacing: 0,
        },
      };
    case "button":
      return {
        ...base,
        x: 420, y: 260, w: 240, h: 64,
        props: {
          label: "Click me",
          href: "https://",
          bg: "#6366f1",
          color: "#ffffff",
          radius: 999,
          fontSize: 18,
          fontWeight: 700,
          fontFamily: FONT_FAMILIES[0].value,
          shadow: true,
        },
      };
    case "image":
      return {
        ...base,
        x: 390, y: 360, w: 300, h: 300,
        props: {
          src: "",
          fit: "cover",
          radius: 24,
          border: 0,
          borderColor: "#ffffff",
        },
      };
    case "box":
    default:
      return {
        ...base,
        x: 340, y: 340, w: 400, h: 240,
        props: {
          bg: "linear-gradient(135deg,#6366f1,#a855f7)",
          radius: 24,
          border: 0,
          borderColor: "#ffffff",
          opacity: 1,
        },
      };
  }
}
