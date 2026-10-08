import { NextResponse } from "next/server";

const WINDOW_MS = 60_000;
const MAX_LOGIN_STARTS = 50;
const LOCKOUT_MS = 20 * 60_000;

type GateState = { starts: number[]; lockedUntil: number };

// The login page calls POST immediately before opening Google's sign-in flow.
// Use a shared store if this must be global across serverless instances.
let state: GateState = { starts: [], lockedUntil: 0 };

function status() {
  const now = Date.now();
  if (state.lockedUntil > now) {
    return { allowed: false, retryAfterSeconds: Math.ceil((state.lockedUntil - now) / 1000) };
  }
  state.starts = state.starts.filter((time) => now - time < WINDOW_MS);
  return { allowed: true, retryAfterSeconds: 0 };
}

export async function GET() {
  return NextResponse.json(status(), { headers: { "Cache-Control": "no-store" } });
}

export async function POST() {
  const gate = status();
  if (!gate.allowed) {
    return NextResponse.json(gate, { status: 429, headers: { "Cache-Control": "no-store" } });
  }

  state.starts.push(Date.now());
  if (state.starts.length > MAX_LOGIN_STARTS) {
    state.starts = [];
    state.lockedUntil = Date.now() + LOCKOUT_MS;
    return NextResponse.json(
      { allowed: false, retryAfterSeconds: LOCKOUT_MS / 1000 },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    );
  }
  return NextResponse.json({ allowed: true, retryAfterSeconds: 0 }, { headers: { "Cache-Control": "no-store" } });
}
