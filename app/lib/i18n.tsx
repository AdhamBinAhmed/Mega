"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  // ── DevMega ad ──
  "DevMega": "DevMega",
  "Tools": "الأدوات",
  "DevMega developer tools": "أدوات DevMega للمطوّرين",
  "Now Live": "متاح الآن",
  "Free Forever": "مجاني للأبد",
  "DevMega — ": "DevMega — ",
  "8 free tools": "8 أدوات مجانية",
  " for developers": " للمطوّرين",
  "A privacy-first toolkit that stays in your browser: repo analysis, error debugging, a real regex IDE, API workspace, and more. Fast, local, and completely free.":
    "مجموعة أدوات تحترم الخصوصية وتعمل داخل متصفّحك: تحليل المستودعات، تصحيح الأخطاء، بيئة تعبيرات نمطية حقيقية، مساحة عمل للـ API، والمزيد. سريعة، محلية، ومجانية بالكامل.",
  "Launch the toolkit →": "افتح الأدوات →",
  "Client latency": "زمن الاستجابة",
  "Developer Tools": "أدوات المطوّرين",
  "A curated suite of eight privacy-first developer utilities — live GitHub analysis, error debugging, a real regex IDE, API workspace, secret scanning, and more. Client-side, blazing fast, and free forever.":
    "مجموعة مختارة من ثماني أدوات للمطوّرين تحترم الخصوصية — تحليل GitHub مباشر، تصحيح الأخطاء، بيئة تعبيرات نمطية حقيقية، مساحة عمل للـ API، وفحص الأسرار، والمزيد. تعمل محلياً، سريعة جداً، ومجانية للأبد.",
  "Free Tools": "أدوات مجانية",
  "Client Latency": "زمن الاستجابة",

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

  // ── Works page ──
  "Selected Work": "أعمال مختارة",
  "Work we're": "أعمال نحن",
  "proud of": "فخورون بها",
  "A selection of projects spanning high-performance web applications, custom Android platforms, and production-grade AI systems — each engineered to a standard we stand behind.":
    "مجموعة مختارة من المشاريع تشمل تطبيقات ويب عالية الأداء، ومنصّات أندرويد مخصّصة، وأنظمة ذكاء اصطناعي جاهزة للإنتاج — كلٌّ منها مصمّم وفق معيار نعتزّ به.",
  "The Portfolio": "معرض الأعمال",
  "Projects": "مشاريع",
  "Android Platform": "منصّة أندرويد",
  "Web Application": "تطبيق ويب",
  "Infrastructure": "بنية تحتية",
  "A custom Android distribution built on AOSP, featuring targeted performance optimizations, a streamlined system image, and a refined minimal interface. Deployed across Xiaomi and Samsung devices.":
    "توزيعة أندرويد مخصّصة مبنيّة على AOSP، بتحسينات أداء موجّهة، وصورة نظام مبسّطة، وواجهة أنيقة بسيطة. منشورة على أجهزة شاومي وسامسونج.",
  "A full-stack e-commerce platform featuring real-time inventory management, bilingual Arabic and English support, integrated payment processing, and a purpose-built administrative dashboard.":
    "منصّة تجارة إلكترونية متكاملة بإدارة مخزون لحظية، ودعم لغتين عربية وإنجليزية، ومعالجة مدفوعات مدمجة، ولوحة تحكّم إدارية مخصّصة.",
  "A machine learning threat-detection system trained on live network traffic, delivering sub-10ms inference at over 94% accuracy. Currently operating in production for two enterprise clients.":
    "نظام كشف تهديدات بالتعلّم الآلي مدرَّب على حركة شبكة حيّة، يقدّم استدلالاً بأقل من 10 مللي ثانية بدقّة تفوق 94%. يعمل حالياً في الإنتاج لعميلين من المؤسسات.",
  "An internal server-management platform providing live performance metrics, secure SSH tunneling, real-time log streaming, and intelligent alerting — maintaining over 847 days of continuous uptime.":
    "منصّة داخلية لإدارة الخوادم توفّر مقاييس أداء لحظية، وأنفاق SSH آمنة، وبثّ سجلّات فوري، وتنبيهات ذكية — مع أكثر من 847 يوماً من التشغيل المتواصل.",
  "OEM Families": "عائلات OEM",
  "Built From Source": "مبني من المصدر",
  "Boot Time": "زمن الإقلاع",
  "Inventory": "المخزون",
  "Payments": "المدفوعات",
  "Accuracy": "الدقة",
  "Inference": "الاستدلال",
  "Enterprise Clients": "عملاء مؤسسات",
  "Days Uptime": "أيام تشغيل",
  "Log Streaming": "بثّ السجلّات",
  "Alerting": "التنبيهات",
  "Visit Project": "زيارة المشروع",
  "Confidential": "سرّي",
  "Flagship Projects": "مشاريع رئيسية",
  "Building Since": "نبني منذ",
  "Shipped to Production": "وصلت للإنتاج",
  "Days Max Uptime": "أيام أقصى تشغيل",
  "Have something": "هل لديك شيء",
  "worth building?": "يستحقّ البناء؟",
  "We partner with teams to design and ship software that performs in production.":
    "نتعاون مع الفرق لتصميم وإطلاق برمجيات تعمل بكفاءة في الإنتاج.",
  "Home": "الرئيسية",
  "Mega Devs. All rights reserved.": "Mega Devs. جميع الحقوق محفوظة.",

  // ── History page ──
  "The Evolution": "مسيرة",
  "of ": "تطوّر ",
  "From a specialized software studio to a multi-team technology organization — a four-year journey defined by disciplined engineering, strategic growth, and a commitment to building at scale.":
    "من استوديو برمجيات متخصّص إلى مؤسّسة تقنية متعدّدة الفرق — رحلة أربع سنوات صاغتها هندسة منضبطة، ونموّ استراتيجي، والتزام بالبناء على نطاق واسع.",
  "Year Established": "سنة التأسيس",
  "Years of Growth": "سنوات من النموّ",
  "Strategic Rebrands": "إعادة تسمية استراتيجية",
  "Specialized Teams": "فرق متخصّصة",
  "Company Timeline": "الخطّ الزمني للشركة",
  "Four defining milestones.": "أربع محطّات فاصلة.",
  "Five defining milestones.": "خمس محطّات فاصلة.",
  "Strategic Pause": "توقّف استراتيجي",
  "Temporary Suspension of MegaOS": "تعليق مؤقّت لـ MegaOS",
  "The MegaDevs management has decided to temporarily suspend MegaOS until 2028 due to its high resource consumption without a sufficient return.":
    "قرّرت إدارة MegaDevs تعليق MegaOS مؤقّتاً حتى عام 2028 نظراً لاستهلاكه العالي للموارد دون عائد كافٍ.",
  "MegaOS Paused": "إيقاف MegaOS",
  "Inception": "البداية",
  "Rebrand & Growth": "إعادة التسمية والنموّ",
  "Scaling Operations": "توسيع العمليات",
  "Maturity": "النضج",
  "Establishing the Foundation": "إرساء الأساس",
  "Strategic Rebranding & Expansion": "إعادة تسمية استراتيجية وتوسّع",
  "Building a Scalable Structure": "بناء هيكل قابل للتوسّع",
  "The Formation of Mega Devs": "تأسيس Mega Devs",
  "Mega ROM was founded under the leadership of Adham Ahmed, beginning as a specialized software development studio. Supported by a dedicated core engineering team, the company established the technical standards and disciplined delivery model that continue to define its work today.":
    "تأسّست Mega ROM بقيادة أدهم أحمد، بادئةً كاستوديو متخصّص لتطوير البرمجيات. وبدعم من فريق هندسي أساسي متفانٍ، أرست الشركة المعايير التقنية ونموذج التسليم المنضبط الذي ما زال يميّز عملها حتى اليوم.",
  "To broaden its technical scope, the company rebranded as MegaOS and strengthened its leadership with the appointment of Seif as Co-Founder. As demand grew, operations expanded into multiple specialized teams, each structured to deliver against increasingly complex project requirements.":
    "لتوسيع نطاقها التقني، أعادت الشركة تسمية نفسها إلى MegaOS وعزّزت قيادتها بتعيين سيف شريكاً مؤسّساً. ومع نموّ الطلب، توسّعت العمليات إلى فرق متخصّصة متعدّدة، صُمّم كلٌّ منها لتلبية متطلّبات مشاريع متزايدة التعقيد.",
  "A pivotal year marked the transition toward a comprehensive corporate structure. New teams were established across engineering, innovation, and systems optimization — laying the operational foundation required to scale reliably and sustain long-term growth.":
    "عامٌ محوري شهد الانتقال نحو هيكل مؤسّسي شامل. أُنشئت فرق جديدة في الهندسة والابتكار وتحسين الأنظمة — لتُرسي الأساس التشغيلي اللازم للتوسّع بموثوقية واستدامة النموّ طويل الأمد.",
  "The company's evolution culminated in the launch of Mega Devs as the parent organization. Today, Mega Devs serves as the governing body overseeing MegaOS and coordinating a network of specialized professional teams across a growing technology ecosystem.":
    "تُوّج تطوّر الشركة بإطلاق Mega Devs كشركة أمّ. واليوم، تعمل Mega Devs كجهة حاكمة تشرف على MegaOS وتنسّق شبكة من الفرق المهنية المتخصّصة عبر منظومة تقنية متنامية.",
  "Founding Team": "الفريق المؤسّس",
  "Co-Founder Appointed": "تعيين شريك مؤسّس",
  "Multi-Team Operations": "عمليات متعدّدة الفرق",
  "Parent Organization": "الشركة الأمّ",
  "Looking Ahead · 2026 – 2036": "نظرة للأمام · 2026 – 2036",
  "Our vision for": "رؤيتنا",
  "the decade ahead.": "للعقد القادم.",
  "Global Technology Leadership": "ريادة تقنية عالمية",
  "Innovation & AI Integration": "الابتكار ودمج الذكاء الاصطناعي",
  "Ecosystem Expansion": "توسيع المنظومة",
  "Developing Future Talent": "تطوير مواهب المستقبل",
  "We aim to establish Mega Devs as a recognized benchmark in the technology sector — extending our capabilities beyond regional markets to deliver enterprise-grade solutions to clients worldwide.":
    "نطمح إلى ترسيخ Mega Devs كمعيار معترف به في قطاع التقنية — بتوسيع قدراتنا إلى ما وراء الأسواق الإقليمية لتقديم حلول بمستوى المؤسسات لعملاء حول العالم.",
  "We are committed to advancing the next generation of software by embedding artificial intelligence and machine learning into the core of the MegaOS platform.":
    "نلتزم بالارتقاء بالجيل القادم من البرمجيات عبر دمج الذكاء الاصطناعي والتعلّم الآلي في صميم منصّة MegaOS.",
  "We are building Mega Devs into a multi-disciplinary technology group, developing a portfolio of products designed to redefine how people interact with technology.":
    "نبني Mega Devs لتكون مجموعة تقنية متعدّدة التخصّصات، ونطوّر حزمة منتجات مصمّمة لإعادة تعريف طريقة تفاعل الناس مع التقنية.",
  "Beyond delivery, we invest in people — cultivating talent and sustaining an environment where engineering excellence and innovation can thrive.":
    "إلى جانب التسليم، نستثمر في البشر — نرعى المواهب ونحافظ على بيئة يزدهر فيها التميّز الهندسي والابتكار.",
  "The next chapter": "الفصل التالي",
  "is already underway.": "قد بدأ بالفعل.",
  "Interested in building with us? We'd welcome the opportunity to discuss your project.":
    "مهتمّ بالبناء معنا؟ يسعدنا أن نناقش مشروعك.",
  "© 2026 Mega Devs. All rights reserved.": "© 2026 Mega Devs. جميع الحقوق محفوظة.",
  "Work": "الأعمال",

  // ── Palestine page ──
  "Free Palestine": "فلسطين حرّة",
  "Stand for Humanity": "قِف مع الإنسانية",
  "Justice · Dignity · Hope": "عدالة · كرامة · أمل",
  "Technology in Service of People": "التقنية في خدمة الناس",
  "We Will Not Look Away": "لن نغضّ الطرف",
  "In Solidarity": "تضامناً",
  "Est. Always": "إلى الأبد",
  "Resilience": "صمود",
  "Solidarity": "تضامن",
  "We stand with the people of Palestine. Beyond the code we write, we believe technology should serve ":
    "نقف مع شعب فلسطين. فوراء ما نكتبه من شيفرة، نؤمن أنّ التقنية يجب أن تخدم ",
  "humanity": "الإنسانية",
  " — that every voice deserves to be heard, every story remembered, and every future built on justice and peace.":
    " — وأنّ كلّ صوت يستحقّ أن يُسمَع، وكلّ قصّة أن تُذكَر، وكلّ مستقبل أن يُبنى على العدل والسلام.",
  "State of Palestine": "دولة فلسطين",
  "What We Stand For": "ما ندافع عنه",
  "Three things we will never ": "ثلاثة أشياء لن ",
  "compromise": "نساوم عليها",
  "Humanity": "الإنسانية",
  "Justice": "العدالة",
  "Hope": "الأمل",
  "Every life carries dignity. We build with empathy and stand with those who endure hardship.":
    "كلّ حياة تحمل كرامة. نبني بتعاطف ونقف مع من يعانون الشدائد.",
  "We believe in equity and truth — that freedom and human rights belong to every single person.":
    "نؤمن بالإنصاف والحقيقة — بأنّ الحريّة وحقوق الإنسان حقٌّ لكلّ إنسان.",
  "Through resilience, community, and creation, a future rooted in peace remains within reach.":
    "بالصمود والتكاتف والإبداع، يبقى مستقبلٌ متجذّر في السلام في متناول اليد.",
  "To exist is to resist. We build so that every ": "أن توجد هو أن تقاوم. نبني كي تبقى كلّ ",
  "story is remembered": "قصّة محفوظة",
  "— MEGA Devs · In Solidarity": "— MEGA Devs · تضامناً",
  "Take Action": "اتّخذ موقفاً",
  "Raise your voice. Build with ": "ارفع صوتك. ابنِ من أجل ",
  "purpose": "هدف",
  "Every voice counts": "كلّ صوت يهمّ",
  "Join the movement and share your solidarity. Amplify the stories that must not be forgotten.":
    "انضمّ إلى الحراك وشارك تضامنك، واجعل صوت القصص التي يجب ألّا تُنسى أعلى.",
  "Stand With": "قِف مع",
  "Standing for humanity": "نقف مع الإنسانية",
  "MEGA Devs · Standing for humanity": "MEGA Devs · نقف مع الإنسانية",

  // ── Login ──
  "Sign In": "تسجيل الدخول",
  "Authenticate to manage your developer profile and secure your subdomain.":
    "سجّل الدخول لإدارة ملفّك التعريفي وتأمين نطاقك الفرعي.",
  "Sign in with Google": "تسجيل الدخول عبر Google",
  "Failed to sign in. Make sure Google Auth is enabled in Firebase.":
    "فشل تسجيل الدخول. تأكّد من تفعيل مصادقة Google في Firebase.",

  // ── Dashboard ──
  "Loading Secure Dashboard...": "جارٍ تحميل لوحة التحكّم الآمنة...",
  "↗ View Live Site": "↗ عرض الموقع المباشر",
  "Sign Out": "تسجيل الخروج",
  "Editing Profile": "تعديل الملف",
  "New Profile": "ملف جديد",
  "Edit Your": "عدّل",
  "Create Your": "أنشئ",
  "Profile": "ملفّك",
  "Update your details below to keep your developer presence fresh.":
    "حدّث بياناتك أدناه لإبقاء حضورك كمطوّر متجدّداً.",
  "Launch your own personalized developer page on the Mega Devs network. Pick your custom subdomain and start shining.":
    "أطلق صفحتك الشخصية كمطوّر على شبكة Mega Devs. اختر نطاقك الفرعي المخصّص وابدأ التألّق.",
  "Draft": "مسودّة",
  "Copy Link": "نسخ الرابط",
  "Copied ✓": "تم النسخ ✓",
  "Profile Saved!": "تم حفظ الملف!",
  "Subdomain and Name are required.": "النطاق الفرعي والاسم مطلوبان.",
  "Basics": "الأساسيات",
  "Your identity on the network": "هويّتك على الشبكة",
  "Custom Subdomain": "النطاق الفرعي المخصّص",
  "Full Name": "الاسم الكامل",
  "Role / Tagline": "الدور / الشعار",
  "Gmail Address": "عنوان Gmail",
  "Profile Photo": "صورة الملف",
  "Shown on your avatar ring": "تظهر على إطار صورتك",
  "Click or drop to change": "انقر أو أسقط للتغيير",
  "Drag & drop an image, or click to browse": "اسحب وأفلت صورة، أو انقر للتصفّح",
  "Social Links": "روابط التواصل",
  "Where people can reach you": "حيث يمكن للناس الوصول إليك",
  "Telegram Link": "رابط تيليجرام",
  "WhatsApp Link / Number": "رابط / رقم واتساب",
  "Instagram Link": "رابط إنستغرام",
  "Facebook Link": "رابط فيسبوك",
  "GitHub Link": "رابط GitHub",
  "Phone Number": "رقم الهاتف",
  "Appearance": "المظهر",
  "Background, accent color & effects": "الخلفية ولون التمييز والتأثيرات",
  "Background Style": "نمط الخلفية",
  "Accent Color Theme": "سمة لون التمييز",
  "Custom Background Image": "صورة خلفية مخصّصة",
  "Click or drop to change background": "انقر أو أسقط لتغيير الخلفية",
  "Drag & drop a background image, or click to browse": "اسحب وأفلت صورة خلفية، أو انقر للتصفّح",
  "Custom Links": "روابط مخصّصة",
  "Add anything — LinkedIn, portfolio, anything else": "أضف أي شيء — لينكدإن، بورتفوليو، أو غير ذلك",
  "+ Add Custom Link": "+ إضافة رابط مخصّص",
  "Remove": "إزالة",
  "Live Preview": "معاينة مباشرة",
  "Fill in your name to see a live preview": "أدخل اسمك لرؤية معاينة مباشرة",
  "Saving changes...": "جارٍ حفظ التغييرات...",
  "Editing existing profile": "تعديل ملف موجود",
  "Ready to launch": "جاهز للإطلاق",
  "Saving...": "جارٍ الحفظ...",
  "Save Changes": "حفظ التغييرات",
  "Launch Profile 🚀": "إطلاق الملف 🚀",
  "Pro Design": "التصميم الاحترافي",
  "· ON": "· مُفعّل",
  "Replace your whole page with the cinematic portfolio layout — aurora background, parallax hero & tilt link grid. Uses your name, role, photo & links.":
    "استبدل صفحتك بالكامل بتصميم البورتفوليو السينمائي — خلفية شفقية، وواجهة بطبقات متحرّكة، وشبكة روابط بميلان ثلاثي الأبعاد. يستخدم اسمك ودورك وصورتك وروابطك.",
  "Enable Pro Design": "تفعيل التصميم الاحترافي",
  "✓ Enabled — Turn Off": "✓ مُفعّل — إيقاف",

  // ── Works: Asseli project ──
  "Brand & E-Commerce": "علامة تجارية ومتجر إلكتروني",
  "A warm, refined storefront and brand experience for Asseli — an artisan honey producer. Crafted with smooth motion and a clean product presentation to showcase small-batch, natural honey and turn visitors into loyal customers.":
    "متجر وتجربة علامة تجارية دافئة وأنيقة لعسلي — منتِج عسل حرفيّ. صُمّم بحركة سلسة وعرض منتجات نظيف لإبراز العسل الطبيعي بكميّات صغيرة وتحويل الزوّار إلى عملاء أوفياء.",
  "Small-Batch": "كميّات صغيرة",
  "Natural Product": "منتج طبيعي",
  "In Production": "في الإنتاج",

  // ── Works: Kira Decoration project ──
  "Brand & Portfolio": "علامة تجارية ومعرض أعمال",
  "The brand and portfolio site for Kira Decoration — a Cairo-based interior design and event studio. A polished digital storefront that showcases delivered projects and connects clients directly across Instagram, WhatsApp, and more.":
    "موقع العلامة التجارية ومعرض أعمال Kira Decoration — استوديو تصميم داخلي وتنظيم فعاليات في القاهرة. واجهة رقمية أنيقة تعرض المشاريع المُنجزة وتربط العملاء مباشرةً عبر إنستغرام وواتساب وغيرها.",
  "Projects Delivered": "مشاريع مُنجزة",
  "Established": "تأسّست",
  "Social Channels": "قنوات تواصل",
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
  // Full-screen wipe played whenever the language changes. Holds the target
  // language ("ar"/"en") while animating, then clears back to null.
  const [wipe, setWipe] = useState<Lang | null>(null);

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
    setLangState((prev) => {
      if (prev !== l) setWipe(l); // trigger the page transition only on a real change
      return l;
    });
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
      {/* Clip layer stays inside the viewport so the translating panel can never
          create horizontal page scroll on mobile. */}
      <div style={{ position: "fixed", inset: 0, zIndex: 100000, pointerEvents: "none", overflow: "hidden" }}>
      <AnimatePresence>
        {wipe && (
          <motion.div
            key="lang-wipe"
            // Arabic (RTL) sweeps right→left; English (LTR) sweeps left→right.
            initial={{ x: wipe === "ar" ? "100%" : "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: wipe === "ar" ? "-100%" : "100%" }}
            transition={{ duration: 0.42, ease: [0.7, 0, 0.3, 1] }}
            onAnimationComplete={() => setWipe(null)}
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(120deg, #a78bfa, #5eead4)",
            }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily: wipe === "ar"
                  ? "var(--font-arabic), sans-serif"
                  : "var(--font-logo), var(--font-outfit), sans-serif",
                fontSize: "clamp(1.8rem, 8vw, 3rem)",
                fontWeight: 800,
                color: "#0a0714",
                letterSpacing: "-0.02em",
              }}
            >
              {wipe === "ar" ? "العربية" : "English"}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
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
