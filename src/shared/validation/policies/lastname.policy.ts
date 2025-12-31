import { toUppercase } from '@/lib/string'
import z from 'zod'

export const lastnamePolicy = z
  .string()
  .trim()
  .min(2, 'Min 2 characters')
  .max(50, 'Max 50 characters')
  .transform(toUppercase)
