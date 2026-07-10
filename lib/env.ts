import { z } from "zod";
import tryParseEnv from "./try-parse-env";

const EnvSchema = z.object({
    NODE_ENV: z.string(),
})

export type EnvSchema = z.infer<typeof EnvSchema>


const env = tryParseEnv(EnvSchema)

export default env
