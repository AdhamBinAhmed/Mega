---
name: visual-regression
description: Builds and screenshots key routes in both themes, EN/AR, desktop/mobile.
tools: Bash, Read
model: sonnet
---
npm run build && npm start; capture /, /works, /history, /palestine, /login, /dashboard at 1440 and 390, dark/light, en/ar. Compare with docs/redesign/baseline/. Report diffs.
