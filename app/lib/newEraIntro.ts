"use client";

import { NEW_ERA } from "../new-era/content";

export const NEW_ERA_SEEN_KEY = "mega:new-era:seen";

/**
 * Tiny event bus so any surface (the /new-era page, the command palette) can
 * ask the intro to play without importing the overlay itself — the overlay
 * stays in its own lazily-loaded chunk.
 */
const REPLAY_EVENT = "mega:new-era:replay";

export function replayIntro() {
  window.dispatchEvent(new CustomEvent(REPLAY_EVENT));
}

export function onReplayIntro(handler: () => void) {
  window.addEventListener(REPLAY_EVENT, handler);
  return () => window.removeEventListener(REPLAY_EVENT, handler);
}

/** Safe storage: localStorage → sessionStorage → in-memory (once per tab). */
let memorySeen: string | null = null;

export function readSeen(): string | null {
  try {
    return localStorage.getItem(NEW_ERA_SEEN_KEY);
  } catch {
    /* fall through */
  }
  try {
    return sessionStorage.getItem(NEW_ERA_SEEN_KEY);
  } catch {
    /* fall through */
  }
  return memorySeen;
}

export function markSeen() {
  const value = String(NEW_ERA.version);
  try {
    localStorage.setItem(NEW_ERA_SEEN_KEY, value);
    return;
  } catch {
    /* fall through */
  }
  try {
    sessionStorage.setItem(NEW_ERA_SEEN_KEY, value);
    return;
  } catch {
    /* fall through */
  }
  memorySeen = value;
}

/** Has this visitor already seen the current version of the intro? */
export function hasSeenIntro(): boolean {
  return readSeen() === String(NEW_ERA.version);
}
