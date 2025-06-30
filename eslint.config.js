import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import stylistic from '@stylistic/eslint-plugin'

export default [
    js.configs.recommended,
    prettierConfig,
    {
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "commonjs",
            globals: {
                node: true,
            },
        },
        plugins: {
            prettier,
            '@stylistic': stylistic,
        },
        rules: {
            '@stylistic/brace-style': ["error", "allman", { "allowSingleLine" : true }],
            '@stylistic/indent': ['error', 4],
            "no-undef": "off",
            "no-unused-vars": "off",
            "no-constant-binary-expression": "off",
            "no-delete-var": "off",
        },
    },
];
