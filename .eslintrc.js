module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/typescript/recommended",
        "@vue/prettier",
        // "@vue/prettier/@typescript-eslint",
    ],
    plugins: ["prettier"],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        "prettier/prettier": "warn",
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "@typescript-eslint/no-unused-vars":
            process.env.NODE_ENV === "production" ? "off" : "warn",
        // "@typescript-eslint/explicit-module-boundary-types":
        //     process.env.NODE_ENV === "production" ? "off" : "warn",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any":
            process.env.NODE_ENV === "production" ? "off" : "warn",
    },
};
