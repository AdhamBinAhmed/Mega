"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import BackgroundBadge from "./BackgroundBadge";
import { BADGE_SEGMENTS, ORB_SEGMENTS, isSubdomainHost } from "../lib/appRoutes";

// WebGL orb: client-only, loaded after the page is idle (never on the critical path).
const SwimmingGlass = dynamic(() => import("./SwimmingGlass"), { ssr: false });

/**
 * Decorative chrome (5B.2.2 + 5B.2.5): the 60px swimming glass orb and the
 * rotating background badge. Mounted once in the layout; each piece gates
 * itself per route and never appears on user-content pages or subdomains.
 */
export default function ChromeExtras() {
  const pathname = usePathname();
  const [idle, setIdle] = useState(false);
  const [onAppHost, setOnAppHost] = useState(false);
  const [phone, setPhone] = useState(false);

  useEffect(() => {
    setOnAppHost(!isSubdomainHost(window.location.hostname));
  }, []);

  // The orb is desktop-only decoration: on phones it costs a WebGL context
  // and competes with the dock for the same corner.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (idle) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    let timer: number | undefined;
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(() => setIdle(true));
    } else {
      timer = window.setTimeout(() => setIdle(true), 1500);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [idle]);

  const seg = pathname.split("/")[1] || "";
  if (!onAppHost) return null;

  return (
    <>
      {BADGE_SEGMENTS.has(seg) && <BackgroundBadge />}
      {idle && !phone && ORB_SEGMENTS.has(seg) && <SwimmingGlass />}
    </>
  );
}
