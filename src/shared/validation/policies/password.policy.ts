import z from 'zod'

export const passwordPolicy = z
  .string()
  .min(10, 'Min 10 characters')
  .max(128)
  .regex(/[a-z]/, 'At least one lowercase letter')
  .regex(/[A-Z]/, 'At least one uppercase letter')
  .regex(/[0-9]/, 'At least one number')
  .regex(/[^A-Za-z0-9]/, 'At least one special character')
