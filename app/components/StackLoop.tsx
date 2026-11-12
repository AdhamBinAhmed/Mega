"use client";

import { useEffect, useState } from "react";
import { SmartphoneIcon } from "@solar-icons/react/linear";
import LogoLoop, { type LogoItem } from "./reactbits/LogoLoop";
import {
  NextJsLogo,
  ReactLogo,
  PythonLogo,
  CppLogo,
  ArchLinuxLogo,
  TailwindLogo,
  PostgresLogo,
  DockerLogo,
  PyTorchLogo,
  NodeJsLogo,
  NginxLogo,
} from "./icons/brand";
import { useLang } from "../lib/i18n";
import { useBrandColors } from "../lib/useBrandColors";

type Tech = { name: string; cat: string; Icon: React.ComponentType<{ size?: number | string }> };

// Same 12 entries as the homepage techStack list, in the same order.
const TECH: Tech[] = [
  { name: "Next.js", cat: "Framework", Icon: NextJsLogo },
  { name: "React", cat: "UI", Icon: ReactLogo },
  { name: "Python", cat: "Lang", Icon: PythonLogo },
  { name: "C++", cat: "System", Icon: CppLogo },
  { name: "Arch Linux", cat: "OS", Icon: ArchLinuxLogo },
  { name: "Android ROMs", cat: "Platform", Icon: SmartphoneIcon },
  { name: "TailwindCSS", cat: "Styling", Icon: TailwindLogo },
  { name: "PostgreSQL", cat: "DB", Icon: PostgresLogo },
  { name: "Docker", cat: "Infra", Icon: DockerLogo },
  { name: "PyTorch", cat: "ML", Icon: PyTorchLogo },
  { name: "Node.js", cat: "Runtime", Icon: NodeJsLogo },
  { name: "Nginx", cat: "Server", Icon: NginxLogo },
];

/**
 * Tech Stack marquee (5B.2.7) — replaces the static `.stack-grid` cells.
 * Logos are monochrome and inherit `color: var(--ink-soft)`; hover is the
 * brand accent for every logo (never per-brand colors).
 */
export default function StackLoop() {
  const { t, dir } = useLang();
  const brand = useBrandColors();
  const [phone, setPhone] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const logos: LogoItem[] = TECH.map(({ name, cat, Icon }) => ({
    node: (
      <span className="stack-logo">
        <Icon size={phone ? 22 : 28} />
        <span className="stack-logo-cat">{t(cat)}</span>
      </span>
    ),
    title: name,
    ariaLabel: name,
    hoverColor: brand?.accent || "#ef4444",
  }));

  return (
    <div className="stack-loop">
      <LogoLoop
        logos={logos}
        speed={60}
        direction={dir === "rtl" ? "right" : "left"}
        logoHeight={phone ? 28 : 36}
        gap={phone ? 36 : 56}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor="var(--panel)"
        labels="below"
        muted={0.35}
        draggable
        ariaLabel={t("Tech Stack")}
      />
    </div>
  );
}
