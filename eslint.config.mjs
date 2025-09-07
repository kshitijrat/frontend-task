import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Base recommended rules for Next.js + TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    ignores: [
      "node_modules/**", // dependencies
      ".next/**", // Next.js build files
      "out/**", // exported static site
      "build/**", // custom build folder
      "next-env.d.ts", // auto-generated types
    ],
  },

  {
    rules: {
      // ❗ Show only actual problems, ignore warnings
      "no-console": "warn", // allow console logs as warnings
      "react-hooks/exhaustive-deps": "warn",

      // turn warnings into ignore (0) for less strict development
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",

      // Allow development convenience
      "no-debugger": "off",
      "no-alert": "off",
    },
  },
];

export default eslintConfig;
