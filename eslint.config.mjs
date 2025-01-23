import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

export default tseslint
  .config(
    {
      ignores: ["dist", "node_modules", "coverage"],
    },

    {
      extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
      files: ["**/*.{ts,tsx,mjs,js}"],
      languageOptions: {
        ecmaVersion: 2024,
      },
    },
  )
  .concat(eslintPluginPrettier);
