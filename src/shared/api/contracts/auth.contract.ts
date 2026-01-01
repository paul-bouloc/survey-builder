import { emailPolicy } from '@/shared/validation/policies/email.policy'
import { namePolicy } from '@/shared/validation/policies/name.policy'
import { passwordPolicy } from '@/shared/validation/policies/password.policy'
import { termsPolicy } from '@/shared/validation/policies/terms.policy'
import { z } from 'zod'

export const RegisterBodySchema = z
  .object({
    email: emailPolicy,
    name: namePolicy,
    password: passwordPolicy,
    passwordConfirm: z.string(),
    acceptTerms: termsPolicy
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        code: 'custom',
        path: ['passwordConfirm'],
        message: 'Passwords do not match'
      })
    }
  })

export type RegisterBody = z.infer<typeof RegisterBodySchema>

export const RegisterResponseSchema = z.object({
  userId: z.string(),
  email: z.email()
})

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>
