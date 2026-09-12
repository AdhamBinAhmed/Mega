import type { CSSProperties } from "react";
import type { CanvasElement } from "../lib/builderTypes";
import "./canvas-buttons.css";

// Shared button styling used by both the live renderer and the editor's preset
// swatches, so a preset looks identical everywhere.
export function buttonStyleFromProps(p: Record<string, any>): CSSProperties {
  const style: CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: p.bg,
    color: p.color,
    borderRadius: p.radius,
    fontSize: p.fontSize,
    fontWeight: p.fontWeight,
    fontFamily: p.fontFamily,
    padding: "0 20px",
    textAlign: "center",
    letterSpacing: `${p.letterSpacing ?? 0}px`,
    textTransform: p.textTransform || "none",
    border: p.border && p.border !== "none" ? p.border : "none",
    boxShadow:
      p.boxShadow !== undefined ? p.boxShadow : p.shadow ? "0 10px 30px rgba(0,0,0,0.35)" : "none",
    textShadow: p.textShadow || "none",
    cursor: "pointer",
    userSelect: "none",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
  };
  if (p.backdropBlur) {
    (style as any).backdropFilter = `blur(${p.backdropBlur}px)`;
    (style as any).WebkitBackdropFilter = `blur(${p.backdropBlur}px)`;
  }
  if (p.animClass === "btn-gradient-move") style.backgroundSize = "220% 220%";
  return style;
}

export function buttonClassName(p: Record<string, any>): string {
  return p.animClass ? `cbtn ${p.animClass}` : "cbtn";
}

// Pure, hook-free renderer for a single canvas element's *content*.
// The wrapper (absolute position / size / rotation) is applied by the caller,
// so this same component works in the interactive editor and the server-rendered
// live page without any divergence.
export function ElementContent({ el, live }: { el: CanvasElement; live?: boolean }) {
  const p = el.props || {};

  switch (el.type) {
    case "text":
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent:
              p.align === "left" ? "flex-start" : p.align === "right" ? "flex-end" : "center",
            fontSize: p.fontSize,
            color: p.color,
            fontWeight: p.fontWeight,
            textAlign: p.align,
            fontFamily: p.fontFamily,
            lineHeight: p.lineHeight ?? 1.1,
            letterSpacing: `${p.letterSpacing ?? 0}px`,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          {p.content}
        </div>
      );

    case "button": {
      const inner = (
        <span className={buttonClassName(p)} style={buttonStyleFromProps(p)}>
          {p.label}
        </span>
      );
      // On the live site the button links out; in the editor it's inert.
      if (live && p.href && p.href !== "https://") {
        return (
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", width: "100%", height: "100%", textDecoration: "none" }}
          >
            {inner}
          </a>
        );
      }
      return inner;
    }

    case "image":
      return p.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={p.src}
          alt=""
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: p.fit || "cover",
            borderRadius: p.radius,
            border: p.border ? `${p.border}px solid ${p.borderColor}` : "none",
            display: "block",
            pointerEvents: "none",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.06)",
            border: "1px dashed rgba(255,255,255,0.25)",
            borderRadius: p.radius,
            color: "rgba(255,255,255,0.5)",
            fontSize: 14,
            fontFamily: "monospace",
          }}
        >
          No image
        </div>
      );

    case "box":
    default:
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: p.bg,
            borderRadius: p.radius,
            border: p.border ? `${p.border}px solid ${p.borderColor}` : "none",
            opacity: p.opacity ?? 1,
          }}
        />
      );
  }
}
