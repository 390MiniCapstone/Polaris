import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import testingLibrary from "eslint-plugin-testing-library";
import jsxA11y from "eslint-plugin-jsx-a11y"; // ✅ Add accessibility plugin

const compat = new FlatCompat({
  recommendedConfig: {
    extends: [
      "expo",
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:testing-library/react",
      "plugin:jsx-a11y/recommended", // ✅ Add a11y rules
    ],
  },
});

export default [
  ...compat.config().map(config => ({
    ...config,
    rules: {
      ...config.rules,
      // Ensure custom rules are not overridden by compat.config()
    },
  })),
  {
    files: ["**/*.{js,jsx,ts,tsx}"], // ✅ Ensure ESLint runs on JS and TS files
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        process: "readonly",
        module: "readonly",
        jest: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: react,
      "react-hooks": reactHooks,
      "testing-library": testingLibrary,
      "jsx-a11y": jsxA11y, // ✅ Accessibility plugin
    },
    rules: {
      "react/prop-types": "off",
      "testing-library/render-result-naming-convention": "off",
      "@typescript-eslint/no-explicit-any": "warn", // ✅ Warn instead of disabling
      "react/no-unescaped-entities": "off",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-require-imports": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "warn", // ✅ Accessibility rule
      "jsx-a11y/anchor-is-valid": "warn", // ✅ Prevent invalid anchor tags
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
