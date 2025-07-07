export const ENV_CONFIG = {
  IA: {
    BRAIN_MODEL: 'test-model',
    BRAIN_API_URL: 'http://localhost:3000/test-api',
    BRAIN_DEFAULT_PARAMS: {
      temperature: 0.7,
      top_p: 0.9,
      response_format: {
        type: 'json_object',
      }
    }
  }
} as const;
