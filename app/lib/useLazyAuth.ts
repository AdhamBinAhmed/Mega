"use client";

import { useEffect, useState } from "react";

/**
 * Firebase-free until needed: the marketing bundle must not pay for the
 * Firebase SDK. When `active` first turns true (palette/menu opened), the
 * firebase module is dynamically imported and auth state is subscribed.
 */
export function useLazyAuth(active: boolean): { signedIn: boolean | null } {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    if (!active) return;
    let unsub: (() => void) | undefined;
    let cancelled = false;
    import("../../lib/firebase")
      .then(({ auth }) => {
        if (cancelled) return;
        unsub = auth.onAuthStateChanged((user) => setSignedIn(!!user));
      })
      .catch(() => setSignedIn(false));
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [active]);

  return { signedIn };
}
