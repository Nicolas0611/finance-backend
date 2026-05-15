module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    // Catch real bugs
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",

    // Enforce layer separation — services cannot import controllers, etc.
    "import/no-cycle": "error",

    // Code quality
    eqeqeq: "error",
    "no-return-await": "error",
    "no-console": ["warn", { allow: ["error", "warn"] }],
  },
  env: {
    node: true,
    es2020: true,
  },
};
