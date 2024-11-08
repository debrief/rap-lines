import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]
  },
  {
    languageOptions: { globals: globals.browser }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  { rules: {
    "react/prop-types": 0,
    "no-trailing-spaces": "on",
    "no-use-before-define": "on",
    "no-unused-vars": "on",
    "dot-notation": "on",
    "no-case-declarations": "off",
    "react/display-name": "on",
    "react/no-deprecated": "on",
    "prefer-promise-reject-errors": "off",
    "camelcase": "on",
    "eqeqeq": "off",
    "react/no-unsafe": 0 

  } }
];