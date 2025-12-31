import { toTitleCase } from '@/lib/string'
import z from 'zod'

export const firstnamePolicy = z
  .string()
  .trim()
  .min(2, 'Min 2 characters')
  .max(50, 'Max 50 characters')
  .transform(toTitleCase)
