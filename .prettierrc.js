/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: "lf",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^types$",
    "^@/types/(.*)$",
    "^@/config/(.*)$",
    "^@/hooks/(.*)$",
    "^@/router/(.*)$",
    "^@/layouts/(.*)$",
    "^@/pages/(.*)$",
    "^@/service/(.*)$",
    "",
    // 原始组件
    "^@/components/ui/(.*)$",
    "",
    // 二次封装组件
    "^@/components/(.*)$",
    "",
    "^@/store/(.*)$",
    "^@/models/(.*)$",
    "^@/utils/(.*)$",
    "",
    "^[../]",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
}
