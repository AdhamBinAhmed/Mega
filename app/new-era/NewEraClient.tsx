"use client";

import { useEffect } from "react";
import { NeHero, NeChapters, NeCyber, NeTools, NeMegaOS, NeTeam, NeVision } from "./sections";
import ChapterIndex from "./ChapterIndex";
import { replayIntro } from "../lib/newEraIntro";

export default function NewEraClient() {
  // Deep link: /new-era?replay=1 plays the intro on arrival.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("replay") === "1") replayIntro();
  }, []);

  return (
    <div className="ne-root">
      <div className="paper-glow" aria-hidden="true" />
      <ChapterIndex />
      <NeHero onReplay={replayIntro} />
      <NeChapters />
      <NeCyber />
      <NeTools />
      <NeMegaOS />
      <NeTeam />
      <NeVision />
    </div>
  );
}
