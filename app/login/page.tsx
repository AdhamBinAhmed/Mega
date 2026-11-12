"use client";

import { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "../lib/i18n";
import { GoogleLogo } from "../components/icons/brand";
import LiquidGlass from "../components/LiquidGlass";

export default function LoginPage() {
  const { t } = useLang();
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    fetch("/api/login-gate", { cache: "no-store" })
      .then((res) => res.json())
      .then((gate: { allowed?: boolean }) => setLocked(gate.allowed === false))
      .catch(() => setError(t("Unable to verify login availability. Please try again shortly.")));
  }, [t]);

  const handleGoogleSignIn = async () => {
    if (locked || signingIn) return;
    try {
      setError("");
      setSigningIn(true);
      const response = await fetch("/api/login-gate", { method: "POST", cache: "no-store" });
      const gate = await response.json() as { allowed?: boolean };
      if (!response.ok || gate.allowed === false) {
        setLocked(true);
        setError(t("Login terminated for 20 minutes for security reasons."));
        return;
      }
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || t("Failed to sign in. Make sure Google Auth is enabled in Firebase."));
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="login-root">
      <style>{`
        /* Brand tokens + theme support (was a hardcoded dark palette). */
        .login-root {
          min-height: 100vh;
          background: var(--paper);
          color: var(--ink);
          font-family: var(--font-ui);
          display: flex; align-items: center; justify-content: center;
          padding: 100px 20px 60px;
          position: relative; overflow: hidden;
        }
        .login-root .bg-glow {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(circle at 50% 40%, var(--glow) 0%, transparent 60%);
        }
        /* Surface material: LiquidGlass (variant=modal) */
        .login-card {
          position: relative; z-index: 1;
          padding: 60px 48px; text-align: center;
          max-width: 400px; width: 100%;
        }
        .title { font-size: 2rem; font-weight: 800; margin-bottom: 12px; letter-spacing: -0.03em; }
        .sub { color: var(--ink-soft); margin-bottom: 40px; font-size: 0.95rem; line-height: 1.5; }
        .google-btn {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          width: 100%; padding: 16px; background: var(--ink); color: var(--paper);
          border: none; border-radius: var(--r-md); font-family: var(--font-ui);
          font-size: 1rem; font-weight: 600;
          cursor: pointer; transition: transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base);
        }
        .google-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--sh-float); }
        .google-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .error {
          color: var(--accent); margin-top: 16px; font-size: 0.85rem; padding: 12px;
          background: color-mix(in oklab, var(--accent) 10%, transparent);
          border-radius: var(--r-sm);
        }
      `}</style>

      <div className="bg-glow" />

      <LiquidGlass
        as={motion.div}
        variant="modal"
        radius={28}
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="title">{t("Sign In")}</h1>
        <p className="sub">{t("Authenticate to manage your developer profile and secure your subdomain.")}</p>

        <button className="google-btn" onClick={handleGoogleSignIn} disabled={locked || signingIn}>
          <GoogleLogo size={22} title="Google" />
          {signingIn ? t("Signing in...") : t("Sign in with Google")}
        </button>

        {locked && <div className="error" role="alert">{t("Login terminated for 20 minutes for security reasons.")}</div>}
        {error && <div className="error" role="alert">{error}</div>}
      </LiquidGlass>
    </div>
  );
}
