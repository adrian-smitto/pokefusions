/**
 * Environment variable validation and loading
 * Throws errors if required variables are missing
 */

interface EnvVars {
  HUGGINGFACE_API_KEY: string;
}

function getEnvVar(key: keyof EnvVars): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

/**
 * Type-safe environment variables
 * Access via env.HUGGINGFACE_API_KEY
 */
export const env = {
  HUGGINGFACE_API_KEY: getEnvVar('HUGGINGFACE_API_KEY'),
} as const;

/**
 * Validate all required environment variables on startup
 * Call this in your API routes or during initialization
 */
export function validateEnv(): EnvVars {
  try {
    return {
      HUGGINGFACE_API_KEY: getEnvVar('HUGGINGFACE_API_KEY'),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Environment validation failed:', error.message);
      console.error('Please check your .env.local file');
    }
    throw error;
  }
}
