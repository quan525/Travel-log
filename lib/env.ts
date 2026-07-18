import { z } from 'zod';
import tryParseEnv from './try-parse-env';

const optionalUrl = z.preprocess(
  value => typeof value === 'string' && value.trim() === '' ? undefined : value,
  z.url().optional(),
);

const EnvSchema = z.object({
  NODE_ENV: z.string(),
  TURSO_DATABASE_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string().optional(),
  BETTER_AUTH_URL: optionalUrl,
  BETTER_AUTH_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  APP_PRODUCTION_URL: z.string(),
  OAUTH_PROXY_SECRET: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

const env = tryParseEnv(EnvSchema);

export default env;
