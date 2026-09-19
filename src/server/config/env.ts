import { z } from 'zod'

const ServerEnvSchema = z.object({
  MONGODB_URI: z.string().min(1),
  MONGO_DATABASE: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().min(1).default('7d')
})

const parsed = ServerEnvSchema.safeParse(process.env)

// On reformate les issues Zod : le dump brut est illisible dans une stack de
// démarrage, alors que c'est le seul message que l'opérateur verra.
if (!parsed.success) {
  const details = parsed.error.issues
    .map(issue => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n')

  throw new Error(
    `Invalid environment variables inside .env:\n${details}\n\nSee .env.example for the expected values.`
  )
}

export const serverEnv = parsed.data
