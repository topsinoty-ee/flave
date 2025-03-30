module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint, perfectionist"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "next/core-web-vitals",
    "plugin:unicorn/recommended",
    "plugin:sonarjs/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "@typescript-eslint/no-explicit-any": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "perfectionist/sort-imports": "error",
    "unicorn/no-array-reduce": "error",
    "unicorn/prefer-module": "off",
    "sonarjs/no-duplicate-string": "error",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/consistent-type-imports": "error",
  },
};
