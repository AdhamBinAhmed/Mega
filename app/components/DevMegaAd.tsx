"use client";

import { motion } from "framer-motion";
import { useLang } from "../lib/i18n";
import "./DevMegaAd.css";

const TOOLS = [
  "DevLens",
  "StackTrace",
  "DevProof",
  "RegexLab",
  "APIForge",
  "EnvVault",
  "Color Picker",
  "Base64 Codec",
];

const HREF = "https://dev.megadevs.site";

export default function DevMegaAd() {
  const { t } = useLang();

  return (
    <section id="tools" className="devmega-ad" aria-label={t("DevMega developer tools")}>
      <div className="wrap">
        <motion.a
          href={HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="devmega-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 24, stiffness: 130 }}
        >
          <div className="devmega-copy">
            <div className="devmega-kicker-row">
              <span className="devmega-kicker">{t("Now Live")}</span>
              <span className="devmega-pill">{t("Free Forever")}</span>
            </div>
            <h2 className="devmega-title">
              {t("DevMega — ")}
              <em>{t("8 free tools")}</em>
              {t(" for developers")}
            </h2>
            <p className="devmega-dek">
              {t("A privacy-first toolkit that stays in your browser: repo analysis, error debugging, a real regex IDE, API workspace, and more. Fast, local, and completely free.")}
            </p>
            <ul className="devmega-tools">
              {TOOLS.map((name) => (
                <li key={name} className="devmega-tool">{name}</li>
              ))}
            </ul>
            <span className="devmega-cta">
              {t("Launch the toolkit →")}
            </span>
          </div>
          <aside className="devmega-stats" aria-hidden="true">
            <div className="devmega-stat">
              <span className="devmega-stat-n">8</span>
              <span className="devmega-stat-l">{t("Tools")}</span>
            </div>
            <div className="devmega-stat">
              <span className="devmega-stat-n">0ms</span>
              <span className="devmega-stat-l">{t("Client latency")}</span>
            </div>
            <div className="devmega-stat">
              <span className="devmega-stat-n">100%</span>
              <span className="devmega-stat-l">{t("Private")}</span>
            </div>
          </aside>
        </motion.a>
      </div>
    </section>
  );
}
