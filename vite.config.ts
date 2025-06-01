import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode = 'development' } = {}) => {
  const isStorybook = process.env.STORYBOOK === 'true';
  
  return {
    plugins: [
      // Only include reactRouter when not in Storybook
      ...(!isStorybook ? [reactRouter()] : []),
      tsconfigPaths(),
    ],
  };
});
