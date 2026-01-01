import { emailPolicy } from '@/shared/validation/policies/email.policy'
import { namePolicy } from '@/shared/validation/policies/name.policy'
import { z } from 'zod'

export const AuthCheckBodySchema = z.object({
  email: emailPolicy
})

export type AuthCheckBody = z.infer<typeof AuthCheckBodySchema>

export const AuthRegisterBodySchema = z.object({
  email: emailPolicy,
  name: namePolicy
})

export type AuthRegisterBody = z.infer<typeof AuthRegisterBodySchema>

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
