import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (only if not already initialized to prevent Next.js HMR errors)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore & Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Auth
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

// Public pages import Firestore from this module during server rendering. Auth
// is browser-only; constructing it on the server makes `next build` require a
// browser Firebase API key even though no authentication is performed there.
const auth = (typeof window === "undefined" ? null : getAuth(app)) as Auth;
const googleProvider = (typeof window === "undefined" ? null : new GoogleAuthProvider()) as GoogleAuthProvider;

export { app, db, storage, auth, googleProvider };
