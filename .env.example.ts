REACT_IA_BRAIN_API=http://localhost:11434

export const ENV_CONFIG = {
  BRAIN_API_URL: process.env.REACT_IA_BRAIN_API,
  AI_MODEL: 'deepseek-r1:1.5b',
  DEFAULT_PARAMS: {
    temperature: 0.2,
    top_p: 0.1,
    response_format: { type: "json_object" },
  }
} as const;

// Validación
if (!ENV_CONFIG.BRAIN_API_URL) {
  throw new Error('REACT_IA_BRAIN_API environment variable is required');
}

