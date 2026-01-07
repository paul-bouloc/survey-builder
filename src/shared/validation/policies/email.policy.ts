import { normalizeEmail } from '@/lib/string'
import z from 'zod'

export const emailPolicy = z
  .email({ message: 'errors.email.invalid' })
  .transform(normalizeEmail)
