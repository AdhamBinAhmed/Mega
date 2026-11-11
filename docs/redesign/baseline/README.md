# Baseline

- `lint-baseline-full.txt` — eslint output at the pre-redesign commit (65 errors / 13 warnings, dominated by `@next/next/no-html-link-for-pages` ×29 and `@typescript-eslint/no-explicit-any` ×24 in pre-existing business-logic files). Redesign rule: zero NEW lint errors; count must only decrease.
- Screenshots: the Claude-in-Chrome extension was not connected during Phase A, so no pixel baseline was captured. The pre-redesign code is preserved at git commit `29ed596` ("Baseline: pre-redesign snapshot"); a visual baseline can be rebuilt at any time via `git worktree add ../mega-baseline 29ed596 && cd ../mega-baseline && npm ci && npm run build && npm start`.
- Next.js 16.4.0 build prints a security-advisory upgrade reminder (genuine `next` nudge feature). Reported to the user; upgrade deliberately not performed during the redesign (dependency scope is locked to +gsap, +@solar-icons/react).
