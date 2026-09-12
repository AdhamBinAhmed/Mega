"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { db, auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import {
  DESIGN_WIDTH,
  BG_STYLES,
  FONT_FAMILIES,
  createElement,
  type CanvasElement,
  type ElementType,
} from "../lib/builderTypes";
import { ElementContent } from "../components/CanvasElementView";
import "../[subdomain]/subdomain-bg.css";
import "./builder.css";

type DragState = {
  mode: "move" | "resize";
  id: string;
  startPX: number;
  startPY: number;
  origX: number;
  origY: number;
  origW: number;
  origH: number;
} | null;

const ADD_BUTTONS: { type: ElementType; label: string; ico: string }[] = [
  { type: "text", label: "Text / Heading", ico: "🅣" },
  { type: "button", label: "Button", ico: "⬛" },
  { type: "image", label: "Image", ico: "🖼️" },
  { type: "box", label: "Box / Shape", ico: "▢" },
];

async function uploadToCloudinary(file: File): Promise<string> {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "my_preset");
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "my_cloud_name";
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: data,
  });
  if (!res.ok) throw new Error("Image upload failed. Check your Cloudinary unsigned preset.");
  const json = await res.json();
  return json.secure_url as string;
}

export default function BuilderPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isExisting, setIsExisting] = useState(false); // slug already saved -> locked

  // Site state
  const [title, setTitle] = useState("My Website");
  const [slug, setSlug] = useState("");
  const [bgColor, setBgColor] = useState("#050507");
  const [bgStyle, setBgStyle] = useState("bg-grid");
  const [bgImageUrl, setBgImageUrl] = useState("");
  const [canvasHeight, setCanvasHeight] = useState(1200);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  const dragRef = useRef<DragState>(null);

  const showToast = useCallback((msg: string, kind: "ok" | "err" = "ok") => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Auth + load existing site ──
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }
      setUser(u);
      try {
        const q = query(collection(db, "sites"), where("uid", "==", u.uid));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const d = snap.docs[0];
          const data = d.data() as any;
          setSlug(d.id);
          setIsExisting(true);
          setTitle(data.title || "My Website");
          setBgColor(data.bgColor || "#050507");
          setBgStyle(data.bgStyle || "bg-grid");
          setBgImageUrl(data.bgImageUrl || "");
          setCanvasHeight(data.canvasHeight || 1200);
          setElements(data.elements || []);
        }
      } catch (e) {
        console.error("Load site failed", e);
      }
      setLoadingAuth(false);
    });
    return () => unsub();
  }, [router]);

  // ── Responsive scale of the editor canvas ──
  useEffect(() => {
    const el = canvasRef.current?.parentElement; // the .bld-canvas-wrap
    if (!el) return;
    const update = () => setScale(el.clientWidth / DESIGN_WIDTH);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [loadingAuth]);

  // ── Drag / resize via window pointer events ──
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = (e.clientX - d.startPX) / scale;
      const dy = (e.clientY - d.startPY) / scale;
      setElements((prev) =>
        prev.map((el) => {
          if (el.id !== d.id) return el;
          if (d.mode === "move") {
            return { ...el, x: Math.round(d.origX + dx), y: Math.round(d.origY + dy) };
          }
          return {
            ...el,
            w: Math.max(24, Math.round(d.origW + dx)),
            h: Math.max(24, Math.round(d.origH + dy)),
          };
        })
      );
    };
    const onUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [scale]);

  const selected = elements.find((el) => el.id === selectedId) || null;
  const topZ = elements.reduce((m, el) => Math.max(m, el.z), 0);

  const addEl = (type: ElementType) => {
    const el = createElement(type, topZ);
    setElements((p) => [...p, el]);
    setSelectedId(el.id);
  };

  const patchEl = (id: string, patch: Partial<CanvasElement>) =>
    setElements((p) => p.map((el) => (el.id === id ? { ...el, ...patch } : el)));

  const patchProps = (id: string, patch: Record<string, any>) =>
    setElements((p) =>
      p.map((el) => (el.id === id ? { ...el, props: { ...el.props, ...patch } } : el))
    );

  const removeEl = (id: string) => {
    setElements((p) => p.filter((el) => el.id !== id));
    setSelectedId(null);
  };

  const bringToFront = (id: string) => patchEl(id, { z: topZ + 1 });

  const startInteraction = (
    e: React.PointerEvent,
    id: string,
    mode: "move" | "resize"
  ) => {
    e.stopPropagation();
    const el = elements.find((x) => x.id === id);
    if (!el) return;
    setSelectedId(id);
    dragRef.current = {
      mode,
      id,
      startPX: e.clientX,
      startPY: e.clientY,
      origX: el.x,
      origY: el.y,
      origW: el.w,
      origH: el.h,
    };
  };

  const handleBgUpload = async (file: File) => {
    try {
      showToast("Uploading background…");
      const url = await uploadToCloudinary(file);
      setBgImageUrl(url);
      setBgStyle("custom");
      showToast("Background uploaded ✓");
    } catch (e: any) {
      showToast(e.message || "Upload failed", "err");
    }
  };

  const handleImageUpload = async (id: string, file: File) => {
    try {
      showToast("Uploading image…");
      const url = await uploadToCloudinary(file);
      patchProps(id, { src: url });
      showToast("Image uploaded ✓");
    } catch (e: any) {
      showToast(e.message || "Upload failed", "err");
    }
  };

  const save = async () => {
    const clean = slug.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!clean) {
      showToast("Pick a site address (slug) first.", "err");
      return;
    }
    setSaving(true);
    try {
      if (!isExisting) {
        const existing = await getDoc(doc(db, "sites", clean));
        if (existing.exists()) throw new Error(`"${clean}" is already taken.`);
      }
      await setDoc(
        doc(db, "sites", clean),
        {
          uid: user!.uid,
          slug: clean,
          title,
          bgColor,
          bgStyle,
          bgImageUrl,
          canvasHeight,
          elements,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setSlug(clean);
      setIsExisting(true);
      showToast("Saved & live ✓");
    } catch (e: any) {
      showToast(e.message || "Save failed", "err");
    }
    setSaving(false);
  };

  if (loadingAuth) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#08080b", color: "#fff", fontFamily: "monospace" }}>
        Loading builder…
      </div>
    );
  }

  const handlePx = 14 / scale; // constant on-screen resize handle
  const outlinePx = 2 / scale;

  return (
    <div className="bld-root">
      {/* ── TOP BAR ── */}
      <div className="bld-topbar">
        <input
          className="bld-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Site title"
        />
        <div className="bld-slug">
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="your-name"
            disabled={isExisting}
            style={isExisting ? { opacity: 0.6 } : undefined}
          />
          <span>/site</span>
        </div>
        <div className="bld-spacer" />
        {isExisting && slug && (
          <a className="bld-btn" href={`/site/${slug}`} target="_blank" rel="noopener noreferrer">
            ↗ View live
          </a>
        )}
        <button className="bld-btn" onClick={() => signOut(auth)}>Sign out</button>
        <button className="bld-btn primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save & Publish"}
        </button>
      </div>

      <div className="bld-body">
        {/* ── LEFT: add elements ── */}
        <div className="bld-left">
          <div className="bld-section-label">Add element</div>
          <div className="bld-add-grid">
            {ADD_BUTTONS.map((b) => (
              <button key={b.type} className="bld-add-btn" onClick={() => addEl(b.type)}>
                <span className="ico">{b.ico}</span> {b.label}
              </button>
            ))}
          </div>

          <div className="bld-section-label" style={{ marginTop: 24 }}>Background</div>
          <div className="bld-field">
            <label>Base color</label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
          </div>
          <div className="bld-field">
            <label>Style / effect</label>
            <select value={bgStyle} onChange={(e) => setBgStyle(e.target.value)}>
              {BG_STYLES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          {bgStyle === "custom" && (
            <div className="bld-field">
              <label>Background image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleBgUpload(e.target.files[0])}
              />
            </div>
          )}
          <div className="bld-field">
            <label>Page height (px)</label>
            <input
              type="number"
              value={canvasHeight}
              min={400}
              step={100}
              onChange={(e) => setCanvasHeight(Math.max(400, Number(e.target.value) || 400))}
            />
          </div>
        </div>

        {/* ── CENTER: canvas ── */}
        <div className="bld-canvas-area">
          <div className="bld-canvas-wrap">
            <div
              ref={canvasRef}
              className="bld-canvas"
              onPointerDown={() => setSelectedId(null)}
              style={{
                width: DESIGN_WIDTH * scale,
                height: canvasHeight * scale,
                background: bgColor,
              }}
            >
              {/* scaled design surface */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: DESIGN_WIDTH,
                  height: canvasHeight,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
              >
                {/* background layers preview */}
                {bgStyle !== "none" && bgStyle !== "custom" && (
                  <div className={bgStyle} style={{ position: "absolute", inset: 0 }} />
                )}
                {bgStyle === "bg-grid" && <div className="bg-glow" style={{ position: "absolute", inset: 0 }} />}
                {bgStyle === "custom" && bgImageUrl && (
                  <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${bgImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                )}

                {[...elements].sort((a, b) => a.z - b.z).map((el) => {
                  const isSel = el.id === selectedId;
                  return (
                    <div
                      key={el.id}
                      className={`bld-el ${isSel ? "selected" : ""}`}
                      onPointerDown={(e) => startInteraction(e, el.id, "move")}
                      style={{
                        left: el.x,
                        top: el.y,
                        width: el.w,
                        height: el.h,
                        transform: `rotate(${el.rotation}deg)`,
                        zIndex: el.z,
                        cursor: "move",
                        outlineWidth: isSel ? outlinePx : 0,
                      }}
                    >
                      <ElementContent el={el} />
                      {isSel && (
                        <div
                          className="bld-resize"
                          onPointerDown={(e) => startInteraction(e, el.id, "resize")}
                          style={{ width: handlePx, height: handlePx }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: properties ── */}
        <div className="bld-right">
          {!selected ? (
            <>
              <div className="bld-section-label">Properties</div>
              <div className="bld-empty-hint">
                Select an element on the canvas to edit it, or add one from the left.
                <br /><br />
                Drag to move · drag the corner handle to resize.
              </div>
            </>
          ) : (
            <PropertiesPanel
              key={selected.id}
              el={selected}
              patchEl={patchEl}
              patchProps={patchProps}
              removeEl={removeEl}
              bringToFront={bringToFront}
              onImage={handleImageUpload}
            />
          )}
        </div>
      </div>

      {toast && <div className={`bld-toast ${toast.kind}`}>{toast.msg}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function Range({ label, value, min, max, step, onChange, suffix }: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; suffix?: string;
}) {
  return (
    <div className="bld-field">
      <label>{label}</label>
      <div className="bld-range">
        <input type="range" min={min} max={max} step={step ?? 1} value={value}
          onChange={(e) => onChange(Number(e.target.value))} />
        <span className="val">{value}{suffix || ""}</span>
      </div>
    </div>
  );
}

function PropertiesPanel({ el, patchEl, patchProps, removeEl, bringToFront, onImage }: {
  el: CanvasElement;
  patchEl: (id: string, patch: Partial<CanvasElement>) => void;
  patchProps: (id: string, patch: Record<string, any>) => void;
  removeEl: (id: string) => void;
  bringToFront: (id: string) => void;
  onImage: (id: string, file: File) => void;
}) {
  const p = el.props;
  const set = (patch: Record<string, any>) => patchProps(el.id, patch);

  return (
    <>
      <div className="bld-section-label">{el.type} settings</div>

      {el.type === "text" && (
        <>
          <div className="bld-field">
            <label>Text</label>
            <textarea value={p.content} onChange={(e) => set({ content: e.target.value })} />
          </div>
          <div className="bld-field">
            <label>Font</label>
            <select value={p.fontFamily} onChange={(e) => set({ fontFamily: e.target.value })}>
              {FONT_FAMILIES.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <Range label="Font size" value={p.fontSize} min={10} max={160} onChange={(v) => set({ fontSize: v })} />
          <Range label="Weight" value={p.fontWeight} min={100} max={900} step={100} onChange={(v) => set({ fontWeight: v })} />
          <Range label="Line height" value={p.lineHeight} min={0.8} max={2.5} step={0.05} onChange={(v) => set({ lineHeight: v })} />
          <Range label="Letter spacing" value={p.letterSpacing} min={-5} max={20} onChange={(v) => set({ letterSpacing: v })} suffix="px" />
          <div className="bld-field">
            <label>Align</label>
            <select value={p.align} onChange={(e) => set({ align: e.target.value })}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div className="bld-field">
            <label>Color</label>
            <input type="color" value={p.color} onChange={(e) => set({ color: e.target.value })} />
          </div>
        </>
      )}

      {el.type === "button" && (
        <>
          <div className="bld-field">
            <label>Label</label>
            <input type="text" value={p.label} onChange={(e) => set({ label: e.target.value })} />
          </div>
          <div className="bld-field">
            <label>Link URL</label>
            <input type="url" value={p.href} onChange={(e) => set({ href: e.target.value })} placeholder="https://…" />
          </div>
          <div className="bld-row">
            <div className="bld-field">
              <label>Background</label>
              <input type="color" value={/^#/.test(p.bg) ? p.bg : "#6366f1"} onChange={(e) => set({ bg: e.target.value })} />
            </div>
            <div className="bld-field">
              <label>Text color</label>
              <input type="color" value={p.color} onChange={(e) => set({ color: e.target.value })} />
            </div>
          </div>
          <Range label="Font size" value={p.fontSize} min={10} max={48} onChange={(v) => set({ fontSize: v })} />
          <Range label="Corner radius" value={p.radius} min={0} max={999} onChange={(v) => set({ radius: v })} />
          <div className="bld-field">
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={!!p.shadow} onChange={(e) => set({ shadow: e.target.checked })} style={{ width: "auto" }} />
              Drop shadow
            </label>
          </div>
        </>
      )}

      {el.type === "image" && (
        <>
          <div className="bld-field">
            <label>Upload image</label>
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onImage(el.id, e.target.files[0])} />
          </div>
          <div className="bld-field">
            <label>…or image URL</label>
            <input type="url" value={p.src} onChange={(e) => set({ src: e.target.value })} placeholder="https://…" />
          </div>
          <div className="bld-field">
            <label>Fit</label>
            <select value={p.fit} onChange={(e) => set({ fit: e.target.value })}>
              <option value="cover">Cover (fill)</option>
              <option value="contain">Contain (whole image)</option>
              <option value="fill">Stretch</option>
            </select>
          </div>
          <Range label="Corner radius" value={p.radius} min={0} max={400} onChange={(v) => set({ radius: v })} />
          <Range label="Border width" value={p.border} min={0} max={20} onChange={(v) => set({ border: v })} />
          {p.border > 0 && (
            <div className="bld-field">
              <label>Border color</label>
              <input type="color" value={p.borderColor} onChange={(e) => set({ borderColor: e.target.value })} />
            </div>
          )}
        </>
      )}

      {el.type === "box" && (
        <>
          <div className="bld-field">
            <label>Fill (color or CSS gradient)</label>
            <input type="text" value={p.bg} onChange={(e) => set({ bg: e.target.value })} />
          </div>
          <div className="bld-field">
            <label>Solid color pick</label>
            <input type="color" value={/^#/.test(p.bg) ? p.bg : "#6366f1"} onChange={(e) => set({ bg: e.target.value })} />
          </div>
          <Range label="Corner radius" value={p.radius} min={0} max={400} onChange={(v) => set({ radius: v })} />
          <Range label="Opacity" value={p.opacity} min={0} max={1} step={0.05} onChange={(v) => set({ opacity: v })} />
          <Range label="Border width" value={p.border} min={0} max={20} onChange={(v) => set({ border: v })} />
          {p.border > 0 && (
            <div className="bld-field">
              <label>Border color</label>
              <input type="color" value={p.borderColor} onChange={(e) => set({ borderColor: e.target.value })} />
            </div>
          )}
        </>
      )}

      {/* Common transform controls */}
      <div className="bld-section-label" style={{ marginTop: 18 }}>Transform</div>
      <div className="bld-row">
        <div className="bld-field">
          <label>X</label>
          <input type="number" value={el.x} onChange={(e) => patchEl(el.id, { x: Number(e.target.value) })} />
        </div>
        <div className="bld-field">
          <label>Y</label>
          <input type="number" value={el.y} onChange={(e) => patchEl(el.id, { y: Number(e.target.value) })} />
        </div>
      </div>
      <div className="bld-row">
        <div className="bld-field">
          <label>Width</label>
          <input type="number" value={el.w} onChange={(e) => patchEl(el.id, { w: Math.max(24, Number(e.target.value)) })} />
        </div>
        <div className="bld-field">
          <label>Height</label>
          <input type="number" value={el.h} onChange={(e) => patchEl(el.id, { h: Math.max(24, Number(e.target.value)) })} />
        </div>
      </div>
      <Range label="Rotation" value={el.rotation} min={-180} max={180} onChange={(v) => patchEl(el.id, { rotation: v })} suffix="°" />

      <button className="bld-btn" style={{ width: "100%", marginBottom: 8 }} onClick={() => bringToFront(el.id)}>
        Bring to front
      </button>
      <button className="bld-danger" onClick={() => removeEl(el.id)}>Delete element</button>
    </>
  );
}
