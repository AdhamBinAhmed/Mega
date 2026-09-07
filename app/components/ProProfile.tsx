"use client";

import { useEffect } from "react";
import Aurora from "./pro/Aurora";
import Nav from "./pro/Nav";
import Hero from "./pro/Hero";
import LinkCard from "./pro/LinkCard";
import { buildIdentity, buildLinks, type Profile } from "./pro/proData";
import "../[subdomain]/pro-design.css";

export default function ProProfile({ profile }: { profile: Profile }) {
  const identity = buildIdentity(profile);
  const links = buildLinks(profile);

  // Full takeover: hide the global MEGA navbar while this page is mounted.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("pro-active");
    return () => root.classList.remove("pro-active");
  }, []);

  return (
    <div className="pro-root" data-theme="dark">
      <main className="relative min-h-screen">
        <Aurora />
        <Nav identity={identity} github={(profile.github || "").trim() || undefined} />
        <Hero identity={identity} />

        {/* Connect */}
        <section className="relative mx-auto max-w-5xl px-4 sm:px-6 pb-24">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs tracking-[0.35em] uppercase text-[var(--violet)]">
                / connect
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight text-[var(--text)]">
                Find me around
                <br className="hidden sm:block" /> the web.
              </h2>
            </div>
            <p className="hidden sm:block max-w-xs text-sm text-[var(--muted)] text-right">
              Building things at{" "}
              <span className="text-[var(--cyan)]">Mega Devs</span>. Always open to
              a good project or a chat.
            </p>
          </div>

          {links.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {links.map((node, i) => (
                <div
                  key={node.key}
                  className={i === 0 ? "sm:col-span-2" : undefined}
                >
                  <LinkCard node={node} index={i} featured={i === 0} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--muted)] text-sm font-mono">No links added yet.</p>
          )}

          <footer className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border)] pt-8 text-sm text-[var(--dim)]">
            <span>
              © {new Date().getFullYear()} {identity.name}. All rights reserved.
            </span>
            {identity.role && (
              <span className="font-mono text-xs tracking-widest uppercase">
                {identity.role}
              </span>
            )}
          </footer>
        </section>
      </main>
    </div>
  );
}
