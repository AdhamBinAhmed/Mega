"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, doc, setDoc, getDoc, query, where, getDocs } from "firebase/firestore";
// Firebase storage imports removed for Cloudinary
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { db, auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [formData, setFormData] = useState({
    subdomain: "",
    name: "",
    role: "",
    photoUrl: "",
    customBgUrl: "",
    telegram: "",
    github: "",
    phone: "",
    instagram: "",
    facebook: "",
    whatsapp: "",
    gmail: "",
    backgroundStyle: "bg-grid", // default
    themeColor: "blue",
    glassyEffect: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bgImageFile, setBgImageFile] = useState<File | null>(null);
  const [bgImagePreview, setBgImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingBg, setIsDraggingBg] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const initial = saved || "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);

      try {
        const q = query(collection(db, "profiles"), where("uid", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const profileDoc = snapshot.docs[0];
          const data = profileDoc.data();
          setFormData({
            subdomain: profileDoc.id,
            name: data.name || "",
            role: data.role || "",
            photoUrl: data.photoUrl || "",
            customBgUrl: data.customBgUrl || "",
            telegram: data.telegram || "",
            github: data.github || "",
            phone: data.phone || "",
            instagram: data.instagram || "",
            facebook: data.facebook || "",
            whatsapp: data.whatsapp || "",
            gmail: data.gmail || "",
            backgroundStyle: data.backgroundStyle || "bg-grid",
            themeColor: data.themeColor || "blue",
            glassyEffect: data.glassyEffect !== undefined ? data.glassyEffect : true,
          });
          if (data.photoUrl) setImagePreview(data.photoUrl);
          if (data.customBgUrl) setBgImagePreview(data.customBgUrl);
          setIsEditing(true);
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.subdomain || !formData.name) {
      setError("Subdomain and Name are required.");
      return;
    }

    // Basic sanitization for subdomain
    const cleanSubdomain = formData.subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "");

    setIsSubmitting(true);
    try {
      console.log("Starting Firebase write for:", cleanSubdomain);

      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        throw new Error("Firebase API key is missing. Did you restart the server?");
      }

      if (!isEditing) {
        const existingDoc = await getDoc(doc(db, "profiles", cleanSubdomain));
        if (existingDoc.exists()) {
          throw new Error(`The subdomain "${cleanSubdomain}" is already taken by someone else.`);
        }
      }

      let finalPhotoUrl = formData.photoUrl;

      // Upload image to Cloudinary if provided
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        uploadData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'my_preset');

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'my_cloud_name';
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: uploadData,
        });

        if (!res.ok) {
          throw new Error('Failed to upload image to Cloudinary. Make sure your upload preset is set to unsigned.');
        }
        const data = await res.json();
        finalPhotoUrl = data.secure_url;
      }

      let finalCustomBgUrl = formData.customBgUrl;

      // Upload background image to Cloudinary if provided
      if (bgImageFile) {
        const uploadData = new FormData();
        uploadData.append('file', bgImageFile);
        uploadData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'my_preset');

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'my_cloud_name';
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: uploadData,
        });

        if (!res.ok) {
          throw new Error('Failed to upload background image to Cloudinary. Make sure your upload preset is set to unsigned.');
        }
        const data = await res.json();
        finalCustomBgUrl = data.secure_url;
      }

      // Add a 10-second timeout so it doesn't hang forever
      const writePromise = setDoc(doc(db, "profiles", cleanSubdomain), {
        uid: user!.uid,
        name: formData.name,
        role: formData.role,
        photoUrl: finalPhotoUrl,
        customBgUrl: finalCustomBgUrl,
        telegram: formData.telegram,
        github: formData.github,
        phone: formData.phone,
        instagram: formData.instagram,
        facebook: formData.facebook,
        whatsapp: formData.whatsapp,
        backgroundStyle: formData.backgroundStyle,
        themeColor: formData.themeColor,
        glassyEffect: formData.glassyEffect,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firebase write timed out (10s). Database might not be created or rules are blocking it.")), 10000)
      );

      await Promise.race([writePromise, timeoutPromise]);

      console.log("Firebase write successful!");
      setSuccess(true);
    } catch (err: any) {
      console.error("Firebase Error:", err);
      setError(err.message || "Failed to create profile. Make sure your Firestore database is created and rules allow writes.");
    }
    setIsSubmitting(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleBgFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    setBgImageFile(file);
    setBgImagePreview(URL.createObjectURL(file));
  };

  if (loadingAuth) {
    return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050507", color: "white", fontFamily: "monospace" }}>Loading Secure Dashboard...</div>;
  }

  return (
    <div className="create-root" data-theme={theme}>
      <style>{`
        /* ── TOKENS ── */
        .create-root, .create-root [data-theme="dark"] {
          --bg:       #050507;
          --surface:  #0d0d10;
          --surface2: #131318;
          --border:   rgba(255,255,255,0.06);
          --border2:  rgba(255,255,255,0.12);
          --text:     #f0f0f2;
          --muted:    #6b6b7a;
          --accent:   #e84545;
          --accent2:  #ff7043;
          --accent3:  #ffd166;
          --green:    #22c55e;
          --font-display: var(--font-outfit,'Outfit'),sans-serif;
          --font-mono:    var(--font-jetbrains,'JetBrains Mono'),monospace;
          --font-logo:    var(--font-logo,'Orbitron'),sans-serif;
        }
        .create-root[data-theme="light"] {
          --bg:       #faf8f5;
          --surface:  #ffffff;
          --surface2: #f0ede8;
          --border:   rgba(0,0,0,0.07);
          --border2:  rgba(0,0,0,0.14);
          --text:     #111111;
          --muted:    #7a7570;
          --accent:   #c8392b;
          --accent2:  #e8571a;
          --green:    #14532d;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .create-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-display);
          -webkit-font-smoothing: antialiased;
          position: relative;
        }

        /* ── BG EFFECTS ── */
        .bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .bg-glow {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 10% 20%, rgba(232,69,69,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 90% 80%, rgba(255,112,67,0.06) 0%, transparent 70%);
        }
        .create-root[data-theme="light"] .bg-grid {
          background-image:
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
        }
        .create-root[data-theme="light"] .bg-glow {
          background:
            radial-gradient(ellipse 60% 50% at 10% 20%, rgba(200,57,43,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 90% 80%, rgba(232,87,26,0.05) 0%, transparent 70%);
        }

        /* ── NAV ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 56px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid var(--border);
          background: rgba(5,5,7,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .create-root[data-theme="light"] .nav { background: rgba(250,248,245,0.85); }
        
        .logo {
          font-family: var(--font-logo); font-size: 1.1rem; font-weight: 700;
          color: var(--text); text-decoration: none; letter-spacing: 0.12em;
          display: flex; align-items: center; gap: 6px;
        }
        .logo-accent { color: var(--accent); }
        .logo-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }

        .nav-right { display: flex; align-items: center; gap: 20px; }
        .theme-btn, .back-btn {
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted);
          border: 1px solid var(--border2); padding: 8px 12px;
          background: none; letter-spacing: 0.08em; text-transform: uppercase;
          transition: all 0.2s; cursor: pointer; text-decoration: none;
        }
        .theme-btn:hover, .back-btn:hover { color: var(--text); border-color: var(--accent); }

        /* ── CONTENT ── */
        .content {
          position: relative; z-index: 2;
          padding: 140px 56px 100px;
          max-width: 700px; margin: 0 auto;
        }
        .title {
          font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800;
          letter-spacing: -0.04em; line-height: 1; margin-bottom: 16px; color: var(--text);
        }
        .title em { font-style: normal; color: var(--accent); }
        .sub { font-size: 1.05rem; color: var(--muted); line-height: 1.6; margin-bottom: 56px; }

        /* ── FORM ── */
        .form {
          display: flex; flex-direction: column; gap: 24px;
        }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .label {
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted);
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .input, .select {
          background: var(--surface); border: 1px solid var(--border2);
          color: var(--text); font-family: var(--font-display); font-size: 1rem;
          padding: 16px 20px; outline: none; transition: all 0.2s;
        }
        .input:focus, .select:focus { border-color: var(--accent); background: var(--surface2); }
        
        .subdomain-group { display: flex; align-items: center; }
        .subdomain-group .input { flex: 1; border-right: none; }
        .subdomain-suffix {
          background: var(--surface2); border: 1px solid var(--border2);
          color: var(--muted); padding: 16px 20px; font-family: var(--font-mono); font-size: 0.85rem;
        }

        .submit-btn {
          margin-top: 16px;
          background: var(--text); color: var(--bg);
          font-family: var(--font-display); font-size: 0.9rem; font-weight: 700;
          padding: 18px 32px; border: none; cursor: pointer;
          transition: all 0.2s; letter-spacing: 0.05em;
        }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .success-box {
          background: rgba(34, 197, 94, 0.1); border: 1px solid var(--green);
          color: var(--green); padding: 24px; margin-bottom: 24px;
        }
        .error-box {
          background: rgba(232, 69, 69, 0.1); border: 1px solid var(--accent);
          color: var(--accent); padding: 16px; margin-bottom: 24px; font-size: 0.9rem;
        }

        .dropzone {
          border: 2px dashed var(--border2);
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--surface);
          color: var(--muted);
          position: relative;
          overflow: hidden;
        }
        .dropzone.dragging { border-color: var(--accent); background: rgba(232, 69, 69, 0.05); }
        .dropzone:hover { border-color: var(--accent); }
        .dropzone-img {
          width: 80px; height: 80px; border-radius: 50%; object-fit: cover;
          margin: 0 auto 16px; display: block;
        }

        .grid-2-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .content { padding: 100px 24px 60px; }
          .nav { padding: 0 20px; }
          .subdomain-group { flex-direction: column; align-items: stretch; }
          .subdomain-group .input { border-right: 1px solid var(--border2); }
          .subdomain-suffix { border-top: none; text-align: center; }
          .grid-2-col { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>

      {/* BG LAYERS */}
      <div className="bg-grid" />
      <div className="bg-glow" />

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="logo">
          <span className="logo-dot" /> MEGA<span className="logo-accent">Devs</span>
        </a>
        <div className="nav-right">
          <button className="theme-btn" onClick={() => signOut(auth)}>Sign Out</button>
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === "dark" ? "☀" : "◑"}
          </button>
          <a href="/" className="back-btn">← Back</a>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="content">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="title">{isEditing ? "Edit Your" : "Create Your"} <em>Profile</em></h1>
          <p className="sub">{isEditing ? "Update your details below to keep your developer presence fresh." : "Launch your own personalized developer page on the Mega Devs network. Pick your custom subdomain and start shining."}</p>

          {success && (
            <div className="success-box">
              <h3>Profile Created!</h3>
              <p style={{ marginTop: '8px' }}>
                Your site is live at: <strong><a href={`http://${formData.subdomain.toLowerCase()}.megadevs.site`} style={{ color: 'inherit' }}>{formData.subdomain.toLowerCase()}.megadevs.site</a></strong>
              </p>
              <p style={{ fontSize: '0.8rem', marginTop: '12px', opacity: 0.8 }}>
                (For local testing: go to <a href={`/${formData.subdomain.toLowerCase()}`} style={{ color: 'inherit' }}>/{formData.subdomain.toLowerCase()}</a> or setup host file)
              </p>
            </div>
          )}

          {error && <div className="error-box">{error}</div>}

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Custom Subdomain</label>
              <div className="subdomain-group">
                <input
                  type="text" className="input" name="subdomain"
                  placeholder="e.g. adham" value={formData.subdomain} onChange={handleChange} required
                  disabled={isEditing}
                  style={isEditing ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                />
                <div className="subdomain-suffix">.megadevs.site</div>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Full Name</label>
              <input
                type="text" className="input" name="name"
                placeholder="John Doe" value={formData.name} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label className="label">Role / Tagline</label>
              <input
                type="text" className="input" name="role"
                placeholder="Frontend Developer" value={formData.role} onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="label">Profile Photo</label>
              <div
                className={`dropzone ${isDragging ? "dragging" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="dropzone-img" />
                    <span style={{ fontSize: "0.85rem", color: "var(--text)" }}>Click or drop to change</span>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📸</div>
                    <span style={{ fontSize: "0.9rem" }}>Drag & drop an image, or click to browse</span>
                  </>
                )}
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Gmail Address</label>
              <input
                type="email" className="input" name="gmail"
                placeholder="your.email@gmail.com" value={formData.gmail} onChange={handleChange}
              />
            </div>

            <div className="grid-2-col">
              <div className="form-group">
                <label className="label">Telegram Link</label>
                <input
                  type="url" className="input" name="telegram"
                  placeholder="https://t.me/username" value={formData.telegram} onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="label">WhatsApp Link / Number</label>
                <input
                  type="text" className="input" name="whatsapp"
                  placeholder="https://wa.me/1234567890" value={formData.whatsapp} onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid-2-col">
              <div className="form-group">
                <label className="label">Instagram Link</label>
                <input
                  type="url" className="input" name="instagram"
                  placeholder="https://instagram.com/username" value={formData.instagram} onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="label">Facebook Link</label>
                <input
                  type="url" className="input" name="facebook"
                  placeholder="https://facebook.com/username" value={formData.facebook} onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid-2-col">
              <div className="form-group">
                <label className="label">GitHub Link</label>
                <input
                  type="url" className="input" name="github"
                  placeholder="https://github.com/username" value={formData.github} onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="label">Phone Number</label>
                <input
                  type="tel" className="input" name="phone"
                  placeholder="+1 234 567 8900" value={formData.phone} onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid-2-col">
              <div className="form-group">
                <label className="label">Background Style</label>
                <select className="select" name="backgroundStyle" value={formData.backgroundStyle} onChange={handleChange}>
                  <option value="bg-grid">Grid & Glow (Default)</option>
                  <option value="bg-aurora">Aurora Borealis (New)</option>
                  <option value="bg-cyber">Cyberpunk Grid (New)</option>
                  <option value="bg-stars">Starlight Space (New)</option>
                  <option value="bg-holo">Holographic Scanlines (New)</option>
                  <option value="bg-glass">Frosted Glass Orbs (New)</option>
                  <option value="noise">Static Noise</option>
                  <option value="plain">Plain Dark</option>
                  <option value="custom">Custom Image</option>
                </select>
              </div>

              <div className="form-group">
                <label className="label">Accent Color Theme</label>
                <select className="select" name="themeColor" value={formData.themeColor} onChange={handleChange}>
                  <option value="blue">Electric Blue</option>
                  <option value="purple">Deep Purple</option>
                  <option value="emerald">Neon Emerald</option>
                  <option value="rose">Cyber Rose</option>
                  <option value="amber">Solar Amber</option>
                  <option value="slate">Monochrome Slate</option>
                </select>
              </div>

              {formData.backgroundStyle === "custom" && (
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="label">Custom Background Image</label>
                  <div
                    className={`dropzone ${isDraggingBg ? "dragging" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingBg(true); }}
                    onDragLeave={() => setIsDraggingBg(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingBg(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleBgFile(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => document.getElementById("bgFileInput")?.click()}
                  >
                    {bgImagePreview ? (
                      <>
                        <img src={bgImagePreview} alt="BG Preview" className="dropzone-img" style={{ borderRadius: '12px', width: '100%', height: '160px', objectFit: 'cover' }} />
                        <span style={{ fontSize: "0.85rem", color: "var(--text)" }}>Click or drop to change background</span>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🖼️</div>
                        <span style={{ fontSize: "0.9rem" }}>Drag & drop a background image, or click to browse</span>
                      </>
                    )}
                    <input
                      type="file"
                      id="bgFileInput"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleBgFile(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: "12px", background: "var(--surface)", padding: "16px 20px", border: "1px solid var(--border2)", borderRadius: "8px" }}>
              <input 
                type="checkbox" 
                name="glassyEffect" 
                id="glassyEffect"
                checked={formData.glassyEffect} 
                onChange={handleChange}
                style={{ width: "20px", height: "20px", accentColor: "var(--accent)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", flex: 1, justifyContent: "space-between", alignItems: "center" }}>
                <label htmlFor="glassyEffect" className="label" style={{ cursor: "pointer", margin: 0, fontSize: "0.75rem", color: "var(--text)" }}>
                  Enable Glassy Effect (Translucent frosted buttons)
                </label>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (isEditing ? "Save Changes" : "Launch Profile 🚀")}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
