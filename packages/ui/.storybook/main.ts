import tailwindcss from "@tailwindcss/vite"
import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  stories: ["../src/components/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config, { configType }) {
    const { mergeConfig } = await import("vite")
    // Match the app pipeline. `@workspace/ui/*` imports resolve through the
    // workspace symlink + the package `exports` map (so globals.css and the
    // component/lib subpaths all resolve correctly) — no alias needed.
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      base: configType === "PRODUCTION" ? "./" : "/",
    })
  },
}

export default config
