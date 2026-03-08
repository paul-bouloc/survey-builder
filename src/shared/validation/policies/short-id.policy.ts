import z from 'zod'

export const shortIdPolicy = z
  .string()
  .min(6, 'errors.common.min')
  .max(6, 'errors.common.max')
