// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
    commonjs: true,
    node: true,
    es6: true,
  },
  extends: ["eslint:recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  ignorePatterns: ["node_modules/*", ".next/*", ".out/*", "!.prettierrc.js"], // We don't want to lint generated files nor node_modules, but we want to lint .prettierrc.js (ignored by default by eslint)
  plugins: ["react", "@typescript-eslint"],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      settings: { react: { version: "detect" } },
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended", // TypeScript rules
        "plugin:react/recommended", // React rules
        "plugin:react-hooks/recommended", // React hooks rules
        // "plugin:jsx-a11y/recommended", // Accessibility rules
        "plugin:prettier/recommended", // Prettier plugin
      ],
      rules: {
        // We will use TypeScript's types for component props instead
        "react/prop-types": "off",

        // No need to import React when using Next.js
        "react/react-in-jsx-scope": "off",
        "react/no-prototype-builtins": "off",
        "react-hooks/exhaustive-deps": "off",

        // This rule is not compatible with Next.js's <Link /> components
        "jsx-a11y/anchor-is-valid": "off",

        // Why would you want unused vars?
        "@typescript-eslint/no-unused-vars": ["warn"],

        // Includes .prettierrc.js rules
        "prettier/prettier": ["off", {}, { usePrettierrc: true }],

        // I suggest this setting for requiring return types on functions only where useful
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",

        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
};
