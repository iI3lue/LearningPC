import globals from "globals";

export default [
    {
        files: ["**/*.js"],
        ignores: ["node_modules/**"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module", // Let's use module, or just don't specify so it works for commonjs too
            globals: {
                ...globals.browser,
                ...globals.node,
                api: "readonly",
                showToast: "readonly",
                verificarLogros: "readonly",
                loadPyodide: "readonly",
                updateStepIndicator: "readonly",
                toggleTheme: "readonly",
                onLevelComplete: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "warn",
            "no-console": "off"
        }
    }
];
