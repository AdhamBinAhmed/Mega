"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, doc, setDoc, getDoc, query, where, getDocs } from "firebase/firestore";
// Firebase storage imports removed for Cloudinary
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { db, auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import PremiumProfileCard from "../components/PremiumProfileCard";
import "./dashboard.css";
import "../[subdomain]/subdomain-bg.css";

function CollapseBody({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      style={{ overflow: "hidden" }}
    >
      <div className="form-section-body">{children}</div>
    </motion.div>
  );
}

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
    cursorSpotlight: false,
    tiltEffect: false,
    particlesEffect: false,
    gradientBorder: false,
    holographicFoil: false,
    cyberGlitch: false,
    levitationFloat: false,
    neonPulse: false,
    sonarPulse: false,
    scanlineEffect: false,
    shineSweep: false,
    borderBeam: false,
    starfield: false,
    customLinks: [] as { id: string, title: string, url: string }[],
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
  const [copiedLink, setCopiedLink] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "01": true, "02": false, "03": false, "04": false, "05": false,
  });
  const toggleSection = (n: string) =>
    setOpenSections((s) => ({ ...s, [n]: !s[n] }));

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
            cursorSpotlight: data.cursorSpotlight || false,
            tiltEffect: data.tiltEffect || false,
            particlesEffect: data.particlesEffect || false,
            gradientBorder: data.gradientBorder || false,
            holographicFoil: data.holographicFoil || false,
            cyberGlitch: data.cyberGlitch || false,
            levitationFloat: data.levitationFloat || false,
            neonPulse: data.neonPulse || false,
            sonarPulse: data.sonarPulse || false,
            scanlineEffect: data.scanlineEffect || false,
            shineSweep: data.shineSweep || false,
            borderBeam: data.borderBeam || false,
            starfield: data.starfield || false,
            customLinks: data.customLinks || [],
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

  const handleCustomLinkChange = (index: number, field: "title" | "url", value: string) => {
    const newLinks = [...formData.customLinks];
    newLinks[index][field] = value;
    setFormData({ ...formData, customLinks: newLinks });
  };

  const handleAddCustomLink = () => {
    setFormData({
      ...formData,
      customLinks: [...formData.customLinks, { id: Date.now().toString(), title: "", url: "" }]
    });
  };

  const handleRemoveCustomLink = (index: number) => {
    const newLinks = [...formData.customLinks];
    newLinks.splice(index, 1);
    setFormData({ ...formData, customLinks: newLinks });
  };

  const handleCopyLink = () => {
    if (!formData.subdomain) return;
    navigator.clipboard?.writeText(`https://${formData.subdomain.toLowerCase()}.megadevs.site`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
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
        cursorSpotlight: formData.cursorSpotlight,
        tiltEffect: formData.tiltEffect,
        particlesEffect: formData.particlesEffect,
        gradientBorder: formData.gradientBorder,
        holographicFoil: formData.holographicFoil,
        cyberGlitch: formData.cyberGlitch,
        levitationFloat: formData.levitationFloat,
        neonPulse: formData.neonPulse,
        sonarPulse: formData.sonarPulse,
        scanlineEffect: formData.scanlineEffect,
        shineSweep: formData.shineSweep,
        borderBeam: formData.borderBeam,
        starfield: formData.starfield,
        gmail: formData.gmail,
        customLinks: formData.customLinks,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firebase write timed out (10s). Database might not be created or rules are blocking it.")), 10000)
      );

      await Promise.race([writePromise, timeoutPromise]);

      console.log("Firebase write successful!");
      setFormData((f) => ({ ...f, subdomain: cleanSubdomain }));
      setIsEditing(true);
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

  const isLive = isEditing && !!formData.subdomain;
  const previewProfile = { ...formData, photoUrl: imagePreview || formData.photoUrl };

  return (
    <div className="create-root" data-theme={theme}>
      {/* BG LAYERS */}
      <div className="bg-grid" />
      <div className="bg-glow" />

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="logo">
          MEGA<span className="logo-accent">Devs</span> <span className="logo-dot" />
        </a>
        <div className="nav-right">
          {isLive && (
            <a href={`/${formData.subdomain.toLowerCase()}`} target="_blank" rel="noopener noreferrer" className="back-btn">
              ↗ View Live Site
            </a>
          )}
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

          {/* DASH HEADER */}
          <div className="dash-header">
            <div>
              <div className="dash-eyebrow">
                <span className="dash-eyebrow-dot" />
                <span>{isEditing ? "Editing Profile" : "New Profile"}</span>
              </div>
              <h1 className="title">{isEditing ? "Edit Your" : "Create Your"} <em>Profile</em></h1>
              <p className="sub">{isEditing ? "Update your details below to keep your developer presence fresh." : "Launch your own personalized developer page on the Mega Devs network. Pick your custom subdomain and start shining."}</p>
            </div>

            {isEditing && (
              <div className="status-card glass-card">
                <span className={`status-pill ${isLive ? "live" : "draft"}`}>
                  <span className="status-dot" /> {isLive ? "Live" : "Draft"}
                </span>
                <div className="status-url">{(formData.subdomain || "yourname").toLowerCase()}.megadevs.site</div>
                <button type="button" className="copy-btn" onClick={handleCopyLink}>
                  {copiedLink ? "Copied ✓" : "Copy Link"}
                </button>
              </div>
            )}
          </div>

          {success && (
            <div className="success-box">
              <h3>Profile Saved!</h3>
              <p style={{ marginTop: '8px' }}>
                Your site is live at: <strong><a href={`http://${formData.subdomain.toLowerCase()}.megadevs.site`} style={{ color: 'inherit' }}>{formData.subdomain.toLowerCase()}.megadevs.site</a></strong>
              </p>
              <p style={{ fontSize: '0.8rem', marginTop: '12px', opacity: 0.8 }}>
                (For local testing: go to <a href={`/${formData.subdomain.toLowerCase()}`} style={{ color: 'inherit' }}>/{formData.subdomain.toLowerCase()}</a> or setup host file)
              </p>
            </div>
          )}

          {error && <div className="error-box">{error}</div>}

          <div className="dashboard-layout">
            {/* ── FORM ── */}
            <form id="profile-form" className="form form-col" onSubmit={handleSubmit}>

              <div className={`form-section glass-card ${openSections["01"] ? "open" : ""}`}>
                <button type="button" className="form-section-head" onClick={() => toggleSection("01")}>
                  <span className="form-section-num">01</span>
                  <div>
                    <div className="form-section-title">Basics</div>
                    <div className="form-section-desc">Your identity on the network</div>
                  </div>
                  <span className="form-section-chevron">▾</span>
                </button>
                <CollapseBody open={openSections["01"]}>

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
                  <label className="label">Gmail Address</label>
                  <input
                    type="email" className="input" name="gmail"
                    placeholder="your.email@gmail.com" value={formData.gmail} onChange={handleChange}
                  />
                </div>
                </CollapseBody>
              </div>

              <div className={`form-section glass-card ${openSections["02"] ? "open" : ""}`}>
                <button type="button" className="form-section-head" onClick={() => toggleSection("02")}>
                  <span className="form-section-num">02</span>
                  <div>
                    <div className="form-section-title">Profile Photo</div>
                    <div className="form-section-desc">Shown on your avatar ring</div>
                  </div>
                  <span className="form-section-chevron">▾</span>
                </button>
                <CollapseBody open={openSections["02"]}>

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
                </CollapseBody>
              </div>

              <div className={`form-section glass-card ${openSections["03"] ? "open" : ""}`}>
                <button type="button" className="form-section-head" onClick={() => toggleSection("03")}>
                  <span className="form-section-num">03</span>
                  <div>
                    <div className="form-section-title">Social Links</div>
                    <div className="form-section-desc">Where people can reach you</div>
                  </div>
                  <span className="form-section-chevron">▾</span>
                </button>
                <CollapseBody open={openSections["03"]}>

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
                </CollapseBody>
              </div>

              <div className={`form-section glass-card ${openSections["04"] ? "open" : ""}`}>
                <button type="button" className="form-section-head" onClick={() => toggleSection("04")}>
                  <span className="form-section-num">04</span>
                  <div>
                    <div className="form-section-title">Appearance</div>
                    <div className="form-section-desc">Background, accent color & effects</div>
                  </div>
                  <span className="form-section-chevron">▾</span>
                </button>
                <CollapseBody open={openSections["04"]}>

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
                      <option value="bg-mesh">Gradient Mesh (New)</option>
                      <option value="bg-matrix">Digital Rain (New)</option>
                      <option value="bg-vapor">Vaporwave Sunset (New)</option>
                      <option value="bg-topo">Topographic Lines (New)</option>
                      <option value="bg-bokeh">Floating Bokeh (New)</option>
                      <option value="bg-liquid">Liquid Chrome (New)</option>
                      <option value="bg-nebula">Cosmic Nebula (New)</option>
                      <option value="bg-plasma">Plasma Field (New)</option>
                      <option value="bg-circuit">Circuit Board (New)</option>
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

                <div className="toggle-row">
                  <input
                    type="checkbox"
                    name="glassyEffect"
                    id="glassyEffect"
                    checked={formData.glassyEffect}
                    onChange={handleChange}
                  />
                  <label htmlFor="glassyEffect">Enable Glassy Effect (Translucent frosted buttons)</label>
                </div>

                <div className="toggle-row">
                  <input
                    type="checkbox"
                    name="cursorSpotlight"
                    id="cursorSpotlight"
                    checked={formData.cursorSpotlight}
                    onChange={handleChange}
                  />
                  <label htmlFor="cursorSpotlight">Cursor Spotlight (Glow follows the visitor's mouse)</label>
                </div>

                <div className="toggle-row">
                  <input
                    type="checkbox"
                    name="tiltEffect"
                    id="tiltEffect"
                    checked={formData.tiltEffect}
                    onChange={handleChange}
                  />
                  <label htmlFor="tiltEffect">3D Tilt (Card tilts toward the cursor)</label>
                </div>

                <div className="toggle-row">
                  <input
                    type="checkbox"
                    name="particlesEffect"
                    id="particlesEffect"
                    checked={formData.particlesEffect}
                    onChange={handleChange}
                  />
                  <label htmlFor="particlesEffect">Ambient Particles (Floating light specks in the card)</label>
                </div>

                <div className="toggle-row">
                  <input
                    type="checkbox"
                    name="gradientBorder"
                    id="gradientBorder"
                    checked={formData.gradientBorder}
                    onChange={handleChange}
                  />
                  <label htmlFor="gradientBorder">Animated Gradient Border (Spinning accent-color ring)</label>
                </div>

                <div className="toggle-row">
                  <input
                    type="checkbox"
                    name="holographicFoil"
                    id="holographicFoil"
                    checked={formData.holographicFoil}
                    onChange={handleChange}
                  />
                  <label htmlFor="holographicFoil">✨ Holographic Foil Sheen (Iridescent rainbow prism sweep)</label>
                </div>

                <div className="toggle-row">
                  <input
                    type="checkbox"
                    name="cyberGlitch"
                    id="cyberGlitch"
                    checked={formData.cyberGlitch}
                    onChange={handleChange}
                  />
                  <label htmlFor="cyberGlitch">⚡ Cyberpunk Text Glitch (Digital RGB channel split on text)</label>
                </div>

                <div className="toggle-row">
                  <input
                    type="checkbox"
                    name="levitationFloat"
                    id="levitationFloat"
                    checked={formData.levitationFloat}
                    onChange={handleChange}
                  />
                  <label htmlFor="levitationFloat">🛸 3D Zero-Gravity Float (Smooth continuous levitation bobbing)</label>
                </div>

                <div className="toggle-row">
                  <input
                    type="checkbox"
                    name="neonPulse"
                    id="neonPulse"
                    checked={formData.neonPulse}
                    onChange={handleChange}
                  />
                  <label htmlFor="neonPulse">🔮 Neon Outer Aura Pulse (Pulsing multi-layer ambient glow)</label>
                </div>

                <div className="toggle-row">
                  <input
                    type="checkbox"
                    name="sonarPulse"
                    id="sonarPulse"
                    checked={formData.sonarPulse}
                    onChange={handleChange}
                  />
                  <label htmlFor="sonarPulse">📡 Avatar Sonar Ripples (Radar wave pulse radiating behind photo)</label>
                </div>

                <div className="toggle-row">
                  <input
                    type="checkbox"
                    name="scanlineEffect"
                    id="scanlineEffect"
                    checked={formData.scanlineEffect}
                    onChange={handleChange}
                  />
                  <label htmlFor="scanlineEffect">📺 CRT Matrix Scanlines (Futuristic retro display lines overlay)</label>
                </div>

                <div className="toggle-row">
                  <input
                    type="checkbox"
                    name="shineSweep"
                    id="shineSweep"
                    checked={formData.shineSweep}
                    onChange={handleChange}
                  />
                  <label htmlFor="shineSweep">💫 Glint Shine Sweep (Diagonal light glides across the card)</label>
                </div>

                <div className="toggle-row">
                  <input
                    type="checkbox"
                    name="borderBeam"
                    id="borderBeam"
                    checked={formData.borderBeam}
                    onChange={handleChange}
                  />
                  <label htmlFor="borderBeam">🌟 Border Light Beam (Glowing accent beam orbits the edge)</label>
                </div>

                <div className="toggle-row">
                  <input
                    type="checkbox"
                    name="starfield"
                    id="starfield"
                    checked={formData.starfield}
                    onChange={handleChange}
                  />
                  <label htmlFor="starfield">⭐ Twinkling Starfield (Animated stars shimmer behind content)</label>
                </div>
                </CollapseBody>
              </div>

              <div className={`form-section glass-card ${openSections["05"] ? "open" : ""}`}>
                <button type="button" className="form-section-head" onClick={() => toggleSection("05")}>
                  <span className="form-section-num">05</span>
                  <div>
                    <div className="form-section-title">Custom Links</div>
                    <div className="form-section-desc">Add anything — LinkedIn, portfolio, anything else</div>
                  </div>
                  <span className="form-section-chevron">▾</span>
                </button>
                <CollapseBody open={openSections["05"]}>

                {formData.customLinks.map((link, index) => (
                  <div key={link.id} className="link-row">
                    <input
                      type="text"
                      className="input"
                      placeholder="Link Title (e.g. LinkedIn)"
                      value={link.title}
                      onChange={(e) => handleCustomLinkChange(index, "title", e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="url"
                      className="input"
                      placeholder="URL (https://...)"
                      value={link.url}
                      onChange={(e) => handleCustomLinkChange(index, "url", e.target.value)}
                      style={{ flex: 2 }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomLink(index)}
                      className="link-remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddCustomLink}
                  className="link-add-btn"
                >
                  + Add Custom Link
                </button>
                </CollapseBody>
              </div>
            </form>

            {/* ── LIVE PREVIEW ── */}
            <div className="preview-col">
              <div className="preview-sticky">
                <div className="preview-label">
                  <span className="preview-label-dot" /> Live Preview
                </div>
                <div className="browser-chrome glass-panel">
                  <div className="browser-dots"><span /><span /><span /></div>
                  <div className="browser-url">{(formData.subdomain || "yourname").toLowerCase()}.megadevs.site</div>
                </div>
                <div className="preview-frame" data-theme="dark">
                  {formData.backgroundStyle === "bg-grid" && <div className="bg-grid" />}
                  {(formData.backgroundStyle === "bg-grid" || formData.backgroundStyle === "bg-glow") && <div className="bg-glow" />}
                  {formData.backgroundStyle === "noise" && <div className="noise" />}
                  {formData.backgroundStyle === "bg-aurora" && <div className="bg-aurora" />}
                  {formData.backgroundStyle === "bg-cyber" && <div className="bg-cyber" />}
                  {formData.backgroundStyle === "bg-stars" && <div className="bg-stars" />}
                  {formData.backgroundStyle === "bg-holo" && <div className="bg-holo" />}
                  {formData.backgroundStyle === "bg-glass" && <div className="bg-glass-orbs" />}
                  {formData.backgroundStyle === "bg-mesh" && <div className="bg-mesh" />}
                  {formData.backgroundStyle === "bg-matrix" && <div className="bg-matrix" />}
                  {formData.backgroundStyle === "bg-vapor" && <div className="bg-vapor" />}
                  {formData.backgroundStyle === "bg-topo" && <div className="bg-topo" />}
                  {formData.backgroundStyle === "bg-bokeh" && <div className="bg-bokeh" />}
                  {formData.backgroundStyle === "bg-liquid" && <div className="bg-liquid" />}
                  {formData.backgroundStyle === "bg-nebula" && <div className="bg-nebula" />}
                  {formData.backgroundStyle === "bg-plasma" && <div className="bg-plasma" />}
                  {formData.backgroundStyle === "bg-circuit" && <div className="bg-circuit" />}
                  {formData.backgroundStyle === "custom" && bgImagePreview && (
                    <div style={{
                      position: "absolute", inset: 0, pointerEvents: "none",
                      backgroundImage: `url(${bgImagePreview})`, backgroundSize: "cover",
                      backgroundPosition: "center", opacity: 0.3,
                    }} />
                  )}
                  {previewProfile.name ? (
                    <PremiumProfileCard profile={previewProfile} bgStyle={formData.backgroundStyle} />
                  ) : (
                    <div style={{ position: "relative", zIndex: 1, padding: "80px 24px", textAlign: "center", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                      Fill in your name to see a live preview
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── SAVE BAR ── */}
          <div className="save-bar glass-panel">
            <div className="save-bar-info">
              {isSubmitting ? "Saving changes..." : isEditing ? "Editing existing profile" : "Ready to launch"}
            </div>
            <button type="submit" form="profile-form" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (isEditing ? "Save Changes" : "Launch Profile 🚀")}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
