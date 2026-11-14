import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Introducing the new MEGA Devs — A New Era. A New MEGA.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand tokens, inlined: the OG renderer has no CSS variables.
const PAPER = "#0c0b0f";
const INK = "#f4f2ed";
const ACCENT = "#ef4444";
const INK_MUTE = "#6a6862";

export default async function OpengraphImage() {
  // The font ships with the repo, so rendering never depends on a third-party
  // origin at build or request time.
  const spaceGrotesk = await readFile(join(process.cwd(), "app/assets/SpaceGrotesk-Bold.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: PAPER,
          padding: "80px 90px",
          position: "relative",
        }}
      >
        {/* Ambient brand glow, matching the site's single soft accent light. */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -160,
            width: 760,
            height: 760,
            borderRadius: 760,
            background: "radial-gradient(circle, rgba(239,68,68,0.18) 0%, rgba(239,68,68,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 44 }}>
          <div style={{ width: 14, height: 14, borderRadius: 14, background: ACCENT, display: "flex" }} />
          <div style={{ fontSize: 26, letterSpacing: 6, color: INK_MUTE, display: "flex" }}>
            INTRODUCING THE NEW MEGA DEVS
          </div>
        </div>

        <div style={{ fontSize: 108, lineHeight: 1.05, color: INK, letterSpacing: -4, display: "flex" }}>
          A New Era.
        </div>
        <div style={{ fontSize: 108, lineHeight: 1.05, letterSpacing: -4, display: "flex", color: INK }}>
          A New&nbsp;<span style={{ color: ACCENT }}>MEGA</span>.
        </div>

        <div style={{ marginTop: 56, fontSize: 28, color: INK_MUTE, display: "flex" }}>
          megadevs.site
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Space Grotesk", data: spaceGrotesk, style: "normal", weight: 700 }],
    }
  );
}
