import { normalizeEmail } from '@/lib/string'
import z from 'zod'

export const emailPolicy = z
  .email({ message: 'Invalid email' })
  .transform(normalizeEmail)
