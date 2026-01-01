import { toTitleCase } from '@/lib/string'
import z from 'zod'

export const namePolicy = z
  .string()
  .trim()
  .min(2, 'Min 2 characters')
  .max(100, 'Max 100 characters')
  .transform(toTitleCase)
