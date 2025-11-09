import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier, // 禁用与 Prettier 冲突的 ESLint 规则

  // 自定义规则
  {
    rules: {
      // 禁止在生产代码中使用 console（使用 logger 工具代替）
      "no-console": "warn",

      // React Hooks 规则（Next.js 已包含，这里加强）
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "warn", // 允许在特定场景下在 effect 中调用 setState
      "react-hooks/purity": "warn", // 允许某些不纯函数调用（如 Date.now()）

      // TypeScript 规则
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      // React 规则
      "react/jsx-key": "error",
      "react/no-unescaped-entities": "off", // 允许在 JSX 中使用未转义的引号（常见于中文内容）

      // 通用代码质量规则
      "prefer-const": "warn",
      "no-var": "error",
      "eqeqeq": ["warn", "always"],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 额外忽略
    "node_modules/**",
    ".turbo/**",
    "public/**",
    "scripts/**", // 脚本文件允许使用 CommonJS
  ]),
]);

export default eslintConfig;
