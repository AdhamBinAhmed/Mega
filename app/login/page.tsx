"use client";

import { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "../lib/i18n";

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
      .catch(() => setError("Unable to verify login availability. Please try again shortly."));
  }, []);

  const handleGoogleSignIn = async () => {
    if (locked || signingIn) return;
    try {
      setError("");
      setSigningIn(true);
      const response = await fetch("/api/login-gate", { method: "POST", cache: "no-store" });
      const gate = await response.json() as { allowed?: boolean };
      if (!response.ok || gate.allowed === false) {
        setLocked(true);
        setError("Login terminated for 20 minutes for security reasons.");
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
        .login-root {
          min-height: 100vh;
          background: #050507;
          color: #f0f0f2;
          font-family: var(--font-outfit, 'Outfit'), sans-serif;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .bg-glow {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(circle at 50% 50%, rgba(232,69,69,0.08) 0%, transparent 60%);
        }
        .card {
          position: relative; z-index: 1;
          background: #0d0d10; border: 1px solid rgba(255,255,255,0.06);
          padding: 60px 48px; border-radius: 24px; text-align: center;
          max-width: 400px; width: 100%;
          box-shadow: 0 24px 60px rgba(0,0,0,0.4);
        }
        .title { font-size: 2rem; font-weight: 800; margin-bottom: 12px; }
        .sub { color: #6b6b7a; margin-bottom: 40px; font-size: 0.95rem; line-height: 1.5; }
        .google-btn {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          width: 100%; padding: 16px; background: white; color: black;
          border: none; border-radius: 12px; font-size: 1rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .google-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,255,255,0.1); }
        .google-icon { width: 24px; height: 24px; }
        .error { color: #e84545; margin-top: 16px; font-size: 0.85rem; padding: 12px; background: rgba(232,69,69,0.1); border-radius: 8px; }
      `}</style>
      
      <div className="bg-glow" />
      
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="title">{t("Sign In")}</h1>
        <p className="sub">{t("Authenticate to manage your developer profile and secure your subdomain.")}</p>

        <button className="google-btn" onClick={handleGoogleSignIn} disabled={locked || signingIn}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="google-icon" />
          {signingIn ? t("Signing in...") : t("Sign in with Google")}
        </button>

        {locked && <div className="error">Login terminated for 20 minutes for security reasons.</div>}
        {error && <div className="error">{error}</div>}
      </motion.div>
    </div>
  );
}
