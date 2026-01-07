import { toTitleCase } from '@/lib/string'
import z from 'zod'

export const namePolicy = z
  .string('errors.common.required')
  .trim()
  .min(2, 'errors.common.min')
  .max(100, 'errors.common.max')
  .transform(toTitleCase)
