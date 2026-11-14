"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { onReplayIntro } from "../../lib/newEraIntro";

/**
 * Keeps the intro out of the main bundle: the overlay is only fetched when it
 * is actually going to play (first visit, or an explicit replay).
 */
const NewEraIntro = dynamic(() => import("./NewEraIntro"), { ssr: false });

export default function IntroGate() {
  const pathname = usePathname();
  const [playing, setPlaying] = useState(false);

  // The blocking <head> script already decided whether this visit plays, so
  // the decision (and the no-flash cover) happen before first paint.
  useEffect(() => {
    if (document.documentElement.dataset.intro === "play") setPlaying(true);
  }, []);

  // Replay requests from /new-era or the command palette.
  useEffect(() => onReplayIntro(() => setPlaying(true)), []);

  // The homepage underneath must not be reachable while the intro is up.
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main) return;
    if (playing) {
      main.setAttribute("inert", "");
      main.setAttribute("aria-hidden", "true");
    } else {
      main.removeAttribute("inert");
      main.removeAttribute("aria-hidden");
    }
  }, [playing, pathname]);

  const done = () => {
    setPlaying(false);
    document.documentElement.dataset.intro = "skip";
  };

  if (!playing) return null;
  return <NewEraIntro onDone={done} />;
}
