import { defineConfig } from 'drizzle-kit';
import env from './lib/env';
import 'dotenv/config';

export default defineConfig({
  schema: './lib/db/schema/index.ts',
  out: './lib/db/migrations',
  casing: 'snake_case',
  dialect: 'turso',
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
});
