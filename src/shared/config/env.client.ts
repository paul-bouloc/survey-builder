import { z } from 'zod'

const ClientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().optional()
})

const parsed = ClientEnvSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
})

if (!parsed.success) {
  const details = parsed.error.issues
    .map(issue => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n')

  throw new Error(
    `Invalid public environment variables:\n${details}\n\nSee .env.example for the expected values.`
  )
}

export const clientEnv = parsed.data
