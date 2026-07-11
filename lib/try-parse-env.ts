import type { z, ZodObject, ZodRawShape } from 'zod'

import { ZodError } from 'zod'

export default function tryParseEnv<T extends ZodRawShape>(
  EnvSchema: ZodObject<T>,
  buildEnv: Record<string, string | undefined> = process.env,
): z.infer<ZodObject<T>> {
  try {
    return EnvSchema.parse(buildEnv)
  }
  catch (error) {
    if (error instanceof ZodError) {
      const messages = error.issues.map((issue) => {
        const path = issue.path.join('.') || 'env'

        return `${path}: ${issue.message}`
      })

      throw new Error(`Invalid environment variables:\n${messages.map(message => `- ${message}`).join('\n')}`)
    }

    throw error
  }
}
