import z from 'zod'

export const termsPolicy = z
  .boolean()
  .refine(v => v, { message: 'You must accept the terms and conditions' })
