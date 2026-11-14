"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifierIcon,
  ArrowRightIcon,
  MoonIcon,
  CopyIcon,
  ArrowUpIcon,
  HeartIcon,
  UserCircleIcon,
  Widget2Icon,
  Logout2Icon,
  CloseCircleIcon,
  PlayCircleIcon,
} from "@solar-icons/react/linear";
import { GitHubLogo } from "../icons/brand";
import LiquidGlass from "../LiquidGlass";
import { useLang } from "../../lib/i18n";
import { sections } from "../../lib/appRoutes";
import { replayIntro } from "../../lib/newEraIntro";

type Entry = {
  id: string;
  group: "Sections" | "Actions" | "Account";
  label: string;
  icon: ReactNode;
  run: () => void;
};

export default function CommandPalette({
  open,
  onClose,
  onToast,
  onToggleTheme,
  signedIn,
}: {
  open: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
  onToggleTheme: () => void;
  signedIn: boolean | null;
}) {
  const { t } = useLang();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const go = (href: string) => {
    if (href.startsWith("http")) window.open(href, "_blank", "noopener,noreferrer");
    else router.push(href);
    onClose();
  };

  const entries = useMemo<Entry[]>(() => {
    const nav: Entry[] = sections.map((s) => ({
      id: `sec-${s.l}`,
      group: "Sections",
      label: t(s.l),
      icon: <ArrowRightIcon size={14} className="icon-mirror" />,
      run: () => go(s.h),
    }));
    const actions: Entry[] = [
      { id: "act-theme", group: "Actions", label: t("Toggle Theme"), icon: <MoonIcon size={16} />, run: () => { onToggleTheme(); onClose(); } },
      { id: "act-email", group: "Actions", label: t("Copy Email"), icon: <CopyIcon size={16} />, run: () => { navigator.clipboard?.writeText("megatrondevs@gmail.com"); onToast(t("Email copied to clipboard")); onClose(); } },
      { id: "act-top", group: "Actions", label: t("Scroll to Top"), icon: <ArrowUpIcon size={16} />, run: () => { window.scrollTo({ top: 0, behavior: "smooth" }); onClose(); } },
      { id: "act-gh", group: "Actions", label: t("Open GitHub"), icon: <GitHubLogo size={15} />, run: () => { window.open("https://github.com/AdhamBinAhmed", "_blank"); onClose(); } },
      { id: "act-ps", group: "Actions", label: t("Stand with Palestine"), icon: <HeartIcon size={16} />, run: () => go("/palestine") },
      {
        id: "act-intro",
        group: "Actions",
        label: t("Replay the introduction"),
        icon: <PlayCircleIcon size={16} />,
        run: () => {
          onClose();
          replayIntro();
        },
      },
    ];
    const account: Entry[] =
      signedIn === true
        ? [
            { id: "acc-dash", group: "Account", label: t("Dashboard"), icon: <UserCircleIcon size={16} />, run: () => go("/dashboard") },
            { id: "acc-builder", group: "Account", label: t("Builder"), icon: <Widget2Icon size={16} />, run: () => go("/builder") },
            {
              id: "acc-out",
              group: "Account",
              label: t("Sign out"),
              icon: <Logout2Icon size={16} className="icon-mirror" />,
              run: () => {
                import("../../../lib/firebase").then(async ({ auth }) => {
                  const { signOut } = await import("firebase/auth");
                  await signOut(auth);
                  onToast(t("Sign out"));
                });
                onClose();
              },
            },
          ]
        : signedIn === false
          ? [{ id: "acc-login", group: "Account", label: t("Login"), icon: <UserCircleIcon size={16} />, run: () => go("/login") }]
          : [];
    return [...nav, ...actions, ...account];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, signedIn]);

  const q = value.trim().toLowerCase();
  const matches = useMemo(
    () => (q ? entries.filter((e) => e.label.toLowerCase().includes(q)) : entries),
    [entries, q]
  );

  // Clamp/reset the active option when the result set changes.
  useEffect(() => {
    setActive(0);
  }, [q, open]);

  // Focus management: remember the opener, focus the input, restore on close.
  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement as HTMLElement | null;
      const id = window.setTimeout(() => inputRef.current?.focus(), 30);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        window.clearTimeout(id);
        document.body.style.overflow = prevOverflow;
        openerRef.current?.focus?.();
      };
    }
  }, [open]);

  // Keep the active option scrolled into view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        onClose();
        break;
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(i + 1, matches.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(Math.max(matches.length - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        matches[active]?.run();
        setValue("");
        break;
      case "Tab":
        // Single-control combobox: keep focus on the input.
        e.preventDefault();
        break;
    }
  };

  const groups: Entry["group"][] = ["Sections", "Actions", "Account"];
  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mnav-cmd-overlay"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{ width: "100%", maxWidth: 520 }}
          >
            <LiquidGlass variant="modal" radius={24} className="mnav-cmd" role="dialog" aria-modal="true" aria-label={t("Navigate or run a command...")}>
              <div className="mnav-cmd-head">
                <span className="mnav-cmd-prompt" aria-hidden="true"><MagnifierIcon size={16} /></span>
                <input
                  ref={inputRef}
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="mnav-cmd-listbox"
                  aria-activedescendant={matches[active] ? `cmd-opt-${matches[active].id}` : undefined}
                  aria-autocomplete="list"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={t("Navigate or run a command...")}
                  className="mnav-cmd-input"
                />
                <button
                  type="button"
                  className="mnav-cmd-close"
                  onClick={onClose}
                  aria-label={t("Close")}
                  title={t("Close")}
                >
                  <CloseCircleIcon size={20} />
                </button>
              </div>
              <div className="mnav-cmd-body" ref={listRef} role="listbox" id="mnav-cmd-listbox" aria-label={t("Sections")}>
                {matches.length === 0 && (
                  <div className="mnav-cmd-label">{t("No results")}</div>
                )}
                {groups.map((g) => {
                  const inGroup = matches.filter((m) => m.group === g);
                  if (!inGroup.length) return null;
                  return (
                    <div key={g} role="group" aria-label={t(g)}>
                      <div className="mnav-cmd-label" aria-hidden="true">{t(g)}</div>
                      {inGroup.map((m) => {
                        flatIndex += 1;
                        const idx = flatIndex;
                        return (
                          <button
                            key={m.id}
                            id={`cmd-opt-${m.id}`}
                            data-idx={idx}
                            role="option"
                            aria-selected={active === idx}
                            tabIndex={-1}
                            className={`mnav-cmd-item${active === idx ? " is-active" : ""}`}
                            onMouseEnter={() => setActive(idx)}
                            onClick={() => {
                              m.run();
                              setValue("");
                            }}
                          >
                            <span className="mnav-cmd-ic" aria-hidden="true">{m.icon}</span>
                            <span>{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </LiquidGlass>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
