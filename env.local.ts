export const ENV_CONFIG = {
  IA: {
    BRAIN_MODEL: import.meta.env.VITE_IA_MODEL,
    BRAIN_API_URL: import.meta.env.VITE_REACT_IA_BRAIN_API,
    BRAIN_DEFAULT_PARAMS: {
      temperature: Number(import.meta.env.VITE_IA_TEMPERATURE),
      top_p: Number(import.meta.env.VITE_IA_TOP_P),
      response_format: {
        type: import.meta.env.VITE_IA_RESPONSE_FORMAT,
      }
    }
  }
} as const;

if (!ENV_CONFIG.IA.BRAIN_API_URL) {
  throw new Error('IA.BRAIN_API_URL is required');
}