"use client";

const SEEN_KEY = "mega:new-era-seen";

/**
 * "Is this the first ever visit in this browser?"
 *
 * Both the launch intro and the loading screen need the answer, and they must
 * agree — otherwise the two overlays can stack. The result is computed once per
 * page load at module scope, so the answer does not depend on which component's
 * effect happens to run first, and the flag is written exactly once.
 */
let cached: boolean | null = null;

export function isFirstEverVisit(): boolean {
  if (cached !== null) return cached;
  if (typeof window === "undefined") return false;
  try {
    cached = localStorage.getItem(SEEN_KEY) !== "1";
    localStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Private mode / storage blocked: never replay the intro.
    cached = false;
  }
  return cached;
}
