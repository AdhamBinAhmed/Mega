"use client";

import { useEffect, useState } from "react";
import StaggeredMenu from "../reactbits/StaggeredMenu";
import ThemeToggle from "./ThemeToggle";
import LangToggle from "./LangToggle";
import { useLang } from "../../lib/i18n";

/**
 * Phone navigation (< 768px) — the StaggeredMenu panel, opened from the dock.
 * The component's own logo+toggle header is hidden: the dock is the only bar
 * on phones, so the menu is driven in controlled mode.
 */
export default function MobileMenu({
  signedIn,
  open,
  onOpenChange,
}: {
  signedIn: boolean | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t, dir } = useLang();
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!isPhone) return null;

  const items = [
    { label: t("Home"), ariaLabel: t("Home"), link: "/" },
    { label: t("Services"), ariaLabel: t("Services"), link: "/#services" },
    { label: t("Works"), ariaLabel: t("Works"), link: "/works" },
    { label: t("Our Story"), ariaLabel: t("Our Story"), link: "/history" },
    { label: t("Contact"), ariaLabel: t("Contact"), link: "/#contact" },
    { label: t("Palestine"), ariaLabel: t("Palestine"), link: "/palestine" },
    signedIn
      ? { label: t("Dashboard"), ariaLabel: t("Dashboard"), link: "/dashboard" }
      : { label: t("Login"), ariaLabel: t("Login"), link: "/login" },
  ];

  const socials = [
    { label: "GitHub", link: "https://github.com/AdhamBinAhmed" },
    { label: "Telegram", link: "https://t.me/llxcd_EG" },
    { label: "DevMega", link: "https://dev.megadevs.site" },
    { label: t("Email"), link: "mailto:megatrondevs@gmail.com" },
  ];

  return (
    <StaggeredMenu
      isFixed
      hideHeader
      open={open}
      onOpenChange={onOpenChange}
      position={dir === "rtl" ? "left" : "right"}
      colors={["var(--panel-2)", "var(--accent)"]}
      accentColor="var(--accent)"
      menuButtonColor="var(--ink)"
      openMenuButtonColor="var(--ink)"
      changeMenuColorOnOpen={false}
      displayItemNumbering
      displaySocials
      logoUrl="/dark_mode_img.jpg"
      items={items}
      socialItems={socials}
      menuLabel={t("Menu")}
      closeLabel={t("Close")}
      socialsLabel={t("Socials")}
      extra={
        <>
          <ThemeToggle className="mnav-icon" />
          <LangToggle className="mnav-icon mnav-lang" />
        </>
      }
    />
  );
}
