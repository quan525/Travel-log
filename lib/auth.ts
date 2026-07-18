import type { User } from 'better-auth';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware } from 'better-auth/api';
import { oAuthProxy } from 'better-auth/plugins';

import db from './db/index';

import env from './env';

export type UserWithId = Omit<User, 'id'> & {
  id: number;
};

const baseURL = env.BETTER_AUTH_URL ?? {
  allowedHosts: [
    'localhost:*',
    '*.vercel.app',
  ],
  plugins: [
    oAuthProxy({
      productionURL: env.APP_PRODUCTION_URL,
      secret: env.OAUTH_PROXY_SECRET,
    }),
  ],
  trustedOrigins: [
    'https://*-projects.vercel.app',
  ],
  protocol: 'auto' as const,
};

export const auth = betterAuth({
  baseURL,
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/get-session') {
        if (!ctx.context.session) {
          return ctx.json({
            session: null,
            user: null,
          });
        }
      }
    }),
  },
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  advanced: {
    database: {
      generateId: false, // "serial" for auto-incrementing numeric IDs
    },
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
});
