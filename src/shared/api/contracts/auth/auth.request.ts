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
