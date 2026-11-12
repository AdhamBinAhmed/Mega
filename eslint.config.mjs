import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // SSR-safe client detection (reading matchMedia/localStorage/DOM state in
      // a mount effect and mirroring it into state) is the standard hydration
      // pattern in this app and in the vendored React Bits components; the
      // compiler-era rule flags it wholesale, so it reports as a warning here.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    // Vendored third-party components (React Bits + the FluidGlass shader),
    // kept byte-for-byte against upstream so they stay updatable. Their
    // idioms — `['--css-var' as any]` tween keys and the live
    // settings-ref-assignment pattern — are intentional upstream style, not
    // defects in this codebase. Reported as warnings so they stay visible
    // without masking real errors in first-party code.
    files: ["app/components/reactbits/**", "app/components/FluidGlass.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/refs": "warn",
      "prefer-const": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
