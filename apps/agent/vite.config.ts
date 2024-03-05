import basicSsl from "@vitejs/plugin-basic-ssl"
import react from "@vitejs/plugin-react-swc"
import { resolve } from "path"
import copy from "rollup-plugin-copy"
import { PluginOption, defineConfig, loadEnv } from "vite"
import checker from "vite-plugin-checker"
import svgr from "vite-plugin-svgr"
import pkg from "./package.json"

const I18N_SOURCE_PATH = resolve(
  __dirname,
  "../../packages/illa-public-component",
  "locales/*.json",
)
const I18N_TARGET_PATH = resolve(__dirname, "public/locales")
const getUsedEnv = (env: Record<string, string>) => {
  const usedEnv: Record<string, string> = {}
  Object.keys(env).forEach((key) => {
    if (key.startsWith("ILLA_")) {
      let value = env[key]
      usedEnv[`import.meta.env.${key}`] = JSON.stringify(value)
      usedEnv[`process.env.${key}`] = JSON.stringify(value)
    }
  })
  usedEnv[`import.meta.env.ILLA_APP_VERSION`] = JSON.stringify(pkg.version)
  usedEnv[`process.env.ILLA_APP_VERSION`] = JSON.stringify(pkg.version)
  return usedEnv
}

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    base: env.ILLA_BASE_PATH ?? "/",
    envPrefix: ["ILLA_"],
    define: getUsedEnv(env),
    plugins: [
      copy({
        targets: [
          {
            src: [I18N_SOURCE_PATH, "!**/package.json"],
            dest: I18N_TARGET_PATH,
          },
        ],
        hook: "buildStart",
      }) as PluginOption,
      react({
        jsxImportSource: "@emotion/react",
      }),
      svgr() as unknown as PluginOption,
      checker({
        typescript: {
          root: process.cwd(),
          tsconfigPath: "./tsconfig.json",
        },
        eslint: {
          lintCommand: 'eslint "./src/**/**.{ts,tsx}" --config ".eslintrc.cjs"',
          dev: {
            logLevel: ["error", "warning"],
          },
        },
        root: process.cwd(),
      }) as unknown as PluginOption,
      basicSsl() as unknown as PluginOption,
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      port: 5555,
    },
  }
})
