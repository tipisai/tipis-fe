export default {
  defaultValue: "__NOT_TRANSLATED__",
  overwrite: true,
  keepRemoved: false,
  keySeparator: false,
  locales: ["en-US"],
  namespaceSeparator: false,
  output: "packages/locales/$LOCALE.json",
  input: [
    "apps/agent/src/**/*.{ts,tsx}",
    "packages/**/*.{ts,tsx}",
    "!**/node_modules/**",
  ],
  sort: true,
}
