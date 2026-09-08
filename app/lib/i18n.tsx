"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Lang = "en" | "ar";

/**
 * Arabic translations keyed by the English source string.
 * `t("Works")` returns the Arabic when lang === "ar", otherwise the English key
 * itself — so any string not yet in this map safely falls back to English.
 */
const AR: Record<string, string> = {
  // ── Navbar ──
  "Services": "الخدمات",
  "Process": "آلية العمل",
  "Works": "أعمالنا",
  "Our Story": "قصتنا",
  "Stack": "التقنيات",
  "FAQ": "الأسئلة الشائعة",
  "Team": "الفريق",
  "Contact": "تواصل معنا",
  "Palestine": "فلسطين",
  "Index": "الفهرس",
  "Start a Project →": "ابدأ مشروعاً →",
  "Sections": "الأقسام",
  "Actions": "إجراءات",
  "Navigate or run a command...": "تنقّل أو نفّذ أمراً...",
  "ESC": "خروج",
  "Toggle Theme": "تبديل المظهر",
  "Copy Email": "نسخ البريد",
  "Scroll to Top": "إلى الأعلى",
  "Open GitHub": "فتح GitHub",
  "Stand with Palestine": "ادعم فلسطين",
  "Email copied to clipboard": "تم نسخ البريد الإلكتروني",

  // ── Homepage: side rail + section labels ──
  "§01 · Services": "§01 · الخدمات",
  "§02 · Process": "§02 · آلية العمل",
  "§03 · Works": "§03 · الأعمال",
  "§04 · Stack": "§04 · التقنيات",
  "§05 · FAQ": "§05 · الأسئلة",
  "§06 · Team": "§06 · الفريق",
  "§07 · Contact": "§07 · التواصل",
  "Scroll ↓": "مرّر ↓",

  // ── Hero ──
  "Issue №01": "العدد №01",
  "Cairo · Egypt": "القاهرة · مصر",
  "Est. 2022": "تأسّست 2022",
  "We Ship.": "نُطلق.",
  "Fast.": "بسرعة.",
  "Always.": "دائماً.",
  "Two engineers from Cairo building ": "مهندسان من القاهرة يبنيان ",
  "high-performance web apps": "تطبيقات ويب عالية الأداء",
  ", custom Android ROMs, and production-grade AI systems for clients across the Middle East and beyond.":
    "، وأنظمة أندرويد مخصّصة، وأنظمة ذكاء اصطناعي جاهزة للإنتاج لعملاء في الشرق الأوسط وخارجه.",
  "Our Works": "أعمالنا",
  "Web Apps": "تطبيقات الويب",
  "Android ROMs": "أنظمة أندرويد",
  "AI Systems": "أنظمة الذكاء الاصطناعي",
  "Backends": "الخوادم الخلفية",
  "Edge": "الحوسبة الطرفية",
  "Make your first free portfolio website online": "أنشئ أول موقع بورتفوليو مجاني لك على الإنترنت",
  "Start Now →": "ابدأ الآن →",
  "Systems Nominal": "الأنظمة تعمل بكفاءة",
  "UTC+3 · Available": "توقيت +3 · متاح",

  // ── Stats ──
  "Max Uptime": "أقصى مدة تشغيل",
  "Live Products": "منتجات مباشرة",
  "Response Time": "زمن الاستجابة",
  "Dev Team": "فريق التطوير",

  // ── Services ──
  "What We Do": "ما نقوم به",
  "Services that ": "خدمات ",
  "scale": "تتوسّع",
  "Web Engineering": "هندسة الويب",
  "Backend Architecture": "معمارية الخوادم",
  "AI & ML Systems": "أنظمة الذكاء الاصطناعي",
  "Frontend · Backend · Edge": "واجهة · خادم · طرفية",
  "Kernel · AOSP · OEM": "نواة · AOSP · OEM",
  "APIs · Infra · Databases": "واجهات برمجة · بنية تحتية · قواعد بيانات",
  "Training · Inference · Pipelines": "تدريب · استدلال · مسارات",
  "Pixel-perfect frontends backed by bulletproof APIs. We obsess over load times, core web vitals, and the details that separate good from great.":
    "واجهات مثاليّة بدقّة البكسل مدعومة بواجهات برمجة صلبة. نهتمّ بأزمنة التحميل ومؤشرات الأداء والتفاصيل التي تفصل الجيّد عن العظيم.",
  "Custom kernels with hand-tuned governors, debloated system images, and minimal UI overlays. Real performance, not benchmarks.":
    "أنوية مخصّصة بضبط يدويّ، وصور نظام خفيفة، وواجهات بسيطة. أداء حقيقي، لا مجرّد أرقام قياسية.",
  "Systems engineered to grow. From 10 users to 10 million — horizontal scaling, zero-downtime deploys, and 99.9% uptime SLAs.":
    "أنظمة مصمّمة لتنمو. من 10 مستخدمين إلى 10 ملايين — توسّع أفقي، ونشر بلا توقّف، وضمان تشغيل 99.9%.",
  "Models that ship to production, not stay in notebooks. Fast inference, clean pipelines, and accuracy numbers that mean something.":
    "نماذج تصل إلى الإنتاج، لا تبقى في الدفاتر. استدلال سريع، ومسارات نظيفة، وأرقام دقّة ذات معنى.",
  "avg. deploy time": "متوسط زمن النشر",
  "cold boot time": "زمن الإقلاع البارد",
  "longest uptime": "أطول مدة تشغيل",
  "production accuracy": "دقة الإنتاج",

  // ── Process ──
  "How We Work": "كيف نعمل",
  "Built for ": "مبنية على ",
  "momentum": "الزخم",
  "Discover": "الاكتشاف",
  "Build": "البناء",
  "Ship": "الإطلاق",
  "Support": "الدعم",
  "A technical audit that maps your requirements, constraints, and existing systems before we write a line of code.":
    "تدقيق تقنيّ يرسم متطلّباتك وقيودك وأنظمتك الحالية قبل أن نكتب سطراً واحداً من الشيفرة.",
  "Tight sprints, daily commits, and a shared staging environment so you watch the product take shape in real time.":
    "دورات عمل مركّزة، وتحديثات يومية، وبيئة تجريبية مشتركة لتشاهد المنتج يتشكّل لحظة بلحظة.",
  "Zero-downtime deploys, automated rollbacks, and a launch checklist covering performance, security, and monitoring.":
    "نشر بلا توقّف، وتراجع تلقائي، وقائمة إطلاق تغطّي الأداء والأمان والمراقبة.",
  "Post-launch we stay on-call for bug fixes, scaling advice, and whatever's next on your roadmap.":
    "بعد الإطلاق نبقى جاهزين لإصلاح الأخطاء، ونصائح التوسّع، وأي خطوة قادمة في خطّتك.",

  // ── Works ──
  "Portfolio": "معرض الأعمال",
  "Things we've ": "أشياء قد ",
  "shipped": "أطلقناها",
  "Android ROM": "نظام أندرويد",
  "Web App": "تطبيق ويب",
  "AI System": "نظام ذكاء اصطناعي",
  "Backend": "خادم خلفي",
  "Live": "مباشر",
  "Private": "خاص",

  // ── Stack ──
  "Tech Stack": "التقنيات",
  "Modern ": "ترسانة ",
  "arsenal": "حديثة",
  "Built for modern stacks": "مبنية لتقنيات حديثة",
  "Languages": "اللغات",
  "Runtime": "بيئة التشغيل",
  "Frameworks": "أطر العمل",
  "Databases": "قواعد البيانات",
  "Status": "الحالة",
  "● All systems nominal": "● جميع الأنظمة تعمل",
  "Framework": "إطار عمل",
  "UI": "واجهة",
  "Lang": "لغة",
  "System": "نظام",
  "OS": "نظام تشغيل",
  "Platform": "منصّة",
  "Styling": "تنسيق",
  "DB": "قاعدة بيانات",
  "Infra": "بنية تحتية",
  "ML": "تعلّم آلي",
  "Server": "خادم",

  // ── FAQ ──
  "Questions": "أسئلة",
  "Frequently ": "الأسئلة ",
  "asked": "الشائعة",
  "How fast can you start a new project?": "ما مدى سرعة بدئكم لمشروع جديد؟",
  "Most engagements kick off within 48 hours of a signed scope — we keep our roster small on purpose so there's no queue.":
    "تبدأ معظم المشاريع خلال 48 ساعة من الاتفاق — نُبقي فريقنا صغيراً عمداً كي لا يكون هناك انتظار.",
  "Do you work with existing codebases?": "هل تعملون على مشاريع برمجية قائمة؟",
  "Yes. We regularly inherit legacy stacks, audit them first, then plan incremental refactors instead of risky rewrites.":
    "نعم. نتعامل كثيراً مع أنظمة قديمة، ندقّقها أولاً، ثم نخطّط لتحسينات تدريجية بدل إعادة الكتابة المحفوفة بالمخاطر.",
  "What's your typical engagement length?": "ما هي المدّة المعتادة للتعاون؟",
  "Anywhere from a two-week sprint to an open-ended retainer. We scope in phases so you're never locked into more than you need.":
    "من دورة أسبوعين إلى تعاقد مفتوح. نحدّد النطاق على مراحل كي لا تلتزم بأكثر مما تحتاج.",
  "Can you handle both the app and the infrastructure?": "هل يمكنكم إدارة التطبيق والبنية التحتية معاً؟",
  "Yes — frontend, backend, deployment, CI/CD, and monitoring. One team, one point of contact.":
    "نعم — الواجهة والخادم والنشر وأنظمة CI/CD والمراقبة. فريق واحد، ونقطة تواصل واحدة.",

  // ── Team ──
  "The Team": "الفريق",
  "Meet the ": "تعرّف على ",
  "engineers": "المهندسين",
  "Frontend, ROM & Web Developer": "مطوّر واجهات وأنظمة ROM وويب",
  "Full Stack & Root Developer": "مطوّر متكامل وجذري",
  "Founder": "المؤسّس",
  "CTO": "المدير التقني",
  "Available": "متاح",
  "✈ Telegram": "✈ تيليجرام",

  // ── Marquee ──
  "Let's Build Something Great ": "لِنبنِ شيئاً عظيماً ",
  "Available for Work ": "متاحون للعمل ",

  // ── Contact ──
  "Get in Touch": "تواصل معنا",
  "Let's build something ": "لِنبنِ شيئاً ",
  "great": "عظيماً",
  "Have a project? We're two engineers ready to turn your idea into production-grade software — from first commit to live deploy.":
    "لديك مشروع؟ نحن مهندسان جاهزان لتحويل فكرتك إلى برمجيات جاهزة للإنتاج — من أول سطر حتى الإطلاق المباشر.",
  "Timezone": "المنطقة الزمنية",
  "Availability": "التوفّر",
  "UTC+3 (Cairo)": "توقيت +3 (القاهرة)",
  "Arabic · English": "العربية · الإنجليزية",
  "● Open to Work": "● متاح للعمل",
  "# Project inquiry template": "# نموذج استفسار مشروع",

  // ── History CTA ──
  "The Origin Story": "قصة البداية",
  "Curious how ": "هل تتساءل كيف بدأت ",
  " started?": "؟",
  "Read Our Story →": "اقرأ قصّتنا →",

  // ── Footer ──
  "Navigate": "تصفّح",
  "Connect": "تواصل",
  "Email": "البريد",
  "🇵🇸 Palestine": "🇵🇸 فلسطين",
  "↑ Back to Top": "↑ العودة للأعلى",
  "Studio Time": "توقيت الاستوديو",
  "UTC+3": "توقيت +3",
  "MEGA Devs · Cairo, Egypt · All rights reserved": "MEGA Devs · القاهرة، مصر · جميع الحقوق محفوظة",
  "Designed & built in-house — press / for commands": "صُمّم وبُني داخلياً — اضغط / للأوامر",
};

/** Registry of translations by language. English is identity (key === value). */
const DICTS: Record<Lang, Record<string, string>> = {
  en: {},
  ar: AR,
};

/** Merge more translations in (used by page-level dictionaries). */
export function registerTranslations(lang: Lang, entries: Record<string, string>) {
  Object.assign(DICTS[lang], entries);
}

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (en: string) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Load saved preference on mount (client only, avoids hydration mismatch).
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved === "ar" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  // Reflect language on <html> for direction + accessibility.
  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("lang", lang);
    el.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch {}
  }, []);

  const toggle = useCallback(() => setLang(lang === "ar" ? "en" : "ar"), [lang, setLang]);

  const t = useCallback(
    (en: string) => (lang === "ar" ? DICTS.ar[en] ?? en : en),
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, dir: lang === "ar" ? "rtl" : "ltr", setLang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) {
    // Safe fallback if a component renders outside the provider.
    return {
      lang: "en",
      dir: "ltr",
      setLang: () => {},
      toggle: () => {},
      t: (en: string) => en,
    };
  }
  return ctx;
}
