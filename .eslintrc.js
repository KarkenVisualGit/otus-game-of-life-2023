module.exports = {
  env: {
    "browser": true,
    "es2021": true,
    "jest/globals": true,
    "node": true,
  },
  extends: [
    "airbnb-base",
    "plugin:jest/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "import/extensions": ["warn", "never"],
    "import/prefer-default-export": "off",
    "jest/valid-title": "off",
    "no-console": "off",
    "no-alert": "off",
    "no-restricted-globals": "off",
    "no-plusplus": "off",
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "max-len": [
      "error",
      { ignoreTrailingComments: true },
      {
        ignoreComments: true,
      },
      {
        code: 100,
      },
    ],
    "import/no-unresolved": "off",
  },
};
