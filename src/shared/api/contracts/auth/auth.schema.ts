import { z } from 'zod'

export const AuthResponseSchema = z.object({
  userId: z.string(),
  email: z.email(),
  name: z.string(),
  isNewUser: z.boolean(),
  needsRegistration: z.boolean().optional()
})

export type AuthResponse = z.infer<typeof AuthResponseSchema>

export const SessionResponseSchema = z.object({
  userId: z.string(),
  email: z.email(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type SessionResponse = z.infer<typeof SessionResponseSchema>
