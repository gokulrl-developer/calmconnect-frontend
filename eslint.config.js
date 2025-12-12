import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];
