module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "jest/globals": true,
        "node": true,
    },
    "extends": [
        'eslint:recommended',
        "plugin:jest/recommended",
        "prettier",
        'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    "overrides": [
        {
            files: ["test/**", ".eslintrc.{js,cjs}"],
            plugins: ["jest"],
            extends: ["plugin:jest/recommended"],
            rules: { "jest/prefer-expect-assertions": "off" },
            "env": {
                "jest/globals": true,
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    plugins: ["jest", "css", "html"],
    "rules": {
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                js: "always",
            },
        ],
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
    }
}
