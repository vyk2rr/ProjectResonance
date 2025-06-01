import type { StorybookConfig } from '@storybook/react-vite';
import viteConfig from '../vite.config';

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  viteFinal: async (config) => {
    const { plugins = [], ...otherConfig } = (typeof viteConfig === 'function' ? await viteConfig() : viteConfig);
    return {
      ...otherConfig,
      ...config,
      plugins: [...(config.plugins || []), ...plugins],
    };
  }
};
export default config;
