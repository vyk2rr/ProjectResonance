import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig((config?: { mode?: string }) => {
  const mode = config?.mode || process.env.NODE_ENV || 'development';
  const isStorybook = process.env.STORYBOOK === 'true';

  return {
    plugins: [
      ...(!isStorybook ? [reactRouter()] : []),
      tsconfigPaths(),
    ],
  };
});