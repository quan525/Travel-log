import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import db from "./db/index"
import env from "./env"

const baseURL = env.BETTER_AUTH_URL ?? {
  allowedHosts: [
    "localhost:*",
    "*.vercel.app",
  ],
  protocol: "auto" as const,
}

export const auth = betterAuth({
  baseURL,
  database: drizzleAdapter(db, {
    provider: "sqlite",
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
})
