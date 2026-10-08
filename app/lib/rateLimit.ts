import { doc, getDoc, writeBatch, type WriteBatch } from "firebase/firestore";
import { db } from "../../lib/firebase";

// Per-account write quota: at most 5 profile/site saves per rolling 24 hours.
// (The 50-requests-per-60-seconds limit is a per-IP edge limit enforced in
// middleware.ts — this file is the per-account layer.)
export const MAX_ACCOUNT_WRITES = 5;
export const ACCOUNT_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Reads the caller's rate-limit counter at `rateLimits/{uid}`, throws if the
 * 5-per-24h quota is spent, and otherwise queues the incremented counter into
 * `batch`.
 *
 * IMPORTANT: the profile/site write MUST be committed in the SAME batch, so
 * Firestore rules can verify (via getAfter) that every content write is
 * accompanied by a counter increment. The counter's own rules only permit a
 * +1 increment per write and a reset no sooner than every 24h, which is what
 * makes the cap enforceable server-side rather than merely in the client.
 */
export async function addQuotaWrite(batch: WriteBatch, uid: string): Promise<void> {
  const ref = doc(db, "rateLimits", uid);
  const snap = await getDoc(ref);
  const now = Date.now();

  let windowStart = now;
  let count = 0;
  if (snap.exists()) {
    const d = snap.data() as { windowStart?: number; count?: number };
    // Reuse the existing window only while it is still within 24h; otherwise
    // it rolls over to a fresh window starting now.
    if (typeof d.windowStart === "number" && now - d.windowStart < ACCOUNT_WINDOW_MS) {
      windowStart = d.windowStart;
      count = typeof d.count === "number" ? d.count : 0;
    }
  }

  if (count >= MAX_ACCOUNT_WRITES) {
    const remainingMs = ACCOUNT_WINDOW_MS - (now - windowStart);
    const hrs = Math.max(1, Math.ceil(remainingMs / 3_600_000));
    throw new Error(
      `Save limit reached (${MAX_ACCOUNT_WRITES} saves per 24 hours). ` +
        `Please try again in about ${hrs} hour${hrs > 1 ? "s" : ""}.`
    );
  }

  batch.set(ref, { uid, windowStart, count: count + 1, updatedAt: now });
}

/** Convenience: a fresh Firestore write batch bound to our db. */
export function newBatch(): WriteBatch {
  return writeBatch(db);
}
