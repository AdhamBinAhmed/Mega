---
name: icon-migrator
description: Replaces react-icons and glyph icons with Solar per docs/redesign/ICON_MIGRATION_MAP.md, including i18n key splitting.
tools: Read, Edit, Grep, Glob, Bash
model: sonnet
---
Follow ICON_MIGRATION_MAP.md exactly. Verify each name in node_modules/@solar-icons/react/dist/icons/style/linear.d.mts before importing. When removing a glyph from an i18n key, update both the EN key and the AR value. Run npm run build at the end.
